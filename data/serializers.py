from rest_framework import serializers

from .models import Data

class DataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Data
        fields = ('temp', 'humidity', 'pressure', 'pm1', 'pm25', 'pm10', 'windspeed', 'so2', 'no2', 'co', 'o3', 'no', 'nh3' ,'created_date', 'created_at')