import os
import paho.mqtt.client as mqtt
from django.core.cache import cache

topic = "AQM/hub1/box1"

def on_connect(client, userdata, flags, rc):
    client.subscribe(topic)
# { "temp":28.74, "humidity": 73.10, "pressure":1018.00, "windspeed": 32, "pm1": 30, "pm25":47, "pm10": 59 }
# The callback for when a PUBLISH message is received from the server.

prev = {}
keys = ["temp", "humidity", "pressure", "windSpeed", "pm1", "pm25", "pm10"]
for k in keys:
    prev[k] = 0
    cache.set(k, 0,timeout=None)
    cache.set(f"realtime_{k}", 0,timeout=None)
    cache.set(f"{k}", 0,timeout=None)

cache.set("aqm_count", 0,timeout=None)

def on_message(client, userdata, msg):
    import json
    from data.models import Data
    if(msg.topic == topic):
        data = json.loads(msg.payload.decode("utf-8"))
        for k in data.keys():
            for key in keys:
                if key not in data.keys():
                    if key != "device":
                        data[key] = 0
            # if(data["pressure"] <= 0 or data["windSpeed"] <= 0): return
            else:
                if k == "device": continue
                if(data[k] <= 0): data[k] = prev[k]
                else: prev[k] = data[k]
        for key in keys:
            if key != "device":
                cache.set(f"realtime_{key}", data[key],timeout=None)
                cache.set(key, cache.get(key) + data[key],timeout=None)
        
        cache.set("aqm_count", cache.get("aqm_count") + 1,timeout=None)
        # print(f"""({cache.get("aqm_count")}), ({cache.get("temp")/cache.get("aqm_count")}), ({cache.get("realtime_temp")})""")
        count_ = cache.get("aqm_count")
        if(count_ >= 21):
            tmp = Data.objects.create(
                temp=round(cache.get("temp")/count_, 2), 
                humidity=round(cache.get("humidity")/count_, 2), 
                pressure=round(cache.get("pressure")/count_, 2),
                windspeed=round(cache.get("windSpeed")/count_, 2),
                pm1=round(cache.get("pm1")/count_, 2),
                pm25=round(cache.get("pm25")/count_, 2),
                pm10=round(cache.get("pm10")/count_, 2),
            )
            tmp.save()
            for k in keys:
                cache.set(k, 0,timeout=None)
            cache.set("aqm_count", 1,timeout=None)
        
        

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(os.getenv("MQTT_HOST", "localhost"), 1883, 60)