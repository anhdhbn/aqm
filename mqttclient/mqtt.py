import os
import paho.mqtt.client as mqtt

topic = "AQM/hub1/box1"

def on_connect(client, userdata, flags, rc):
    client.subscribe(topic)
# { "temp":28.74, "humidity": 73.10, "pressure":1018.00, "windspeed": 32, "pm1": 30, "pm25":47, "pm10": 59 }
# The callback for when a PUBLISH message is received from the server.

prev = {}
keys = ["temp", "humidity", "pressure", "windSpeed", "pm1", "pm25", "pm10"]
for k in keys:
    prev[k] = 0

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
            if(data["pressure"] <= 0 or data["windSpeed"] <= 0): return
            else:
                if k == "device": continue
                if(data[k] <= 0): data[k] = prev[k]
                else: prev[k] = data[k]
        print(data)
        tmp = Data.objects.create(
            temp=data["temp"], 
            humidity=data["humidity"], 
            pressure=data["pressure"],
            windspeed=data["windSpeed"],
            pm1=data["pm1"],
            pm25=data["pm25"],
            pm10=data["pm10"],
        )
        tmp.save()
        

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(os.getenv("MQTT_HOST", "localhost"), 1883, 60)