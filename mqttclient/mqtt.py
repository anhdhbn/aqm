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
        if(cache.get("aqm_count") >= 20):
            tmp = Data.objects.create(
                temp=cache.get("temp")/cache.get("aqm_count"), 
                humidity=cache.get("humidity")/cache.get("aqm_count"), 
                pressure=cache.get("pressure")/cache.get("aqm_count"),
                windspeed=cache.get("windSpeed")/cache.get("aqm_count"),
                pm1=cache.get("pm1")/cache.get("aqm_count"),
                pm25=cache.get("pm25")/cache.get("aqm_count"),
                pm10=cache.get("pm10")/cache.get("aqm_count"),
            )
            tmp.save()
            for k in keys:
                cache.set(k, 0,timeout=None)
            cache.set("aqm_count", 0,timeout=None)
        
        

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(os.getenv("MQTT_HOST", "localhost"), 1883, 60)