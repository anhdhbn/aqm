from rest_framework import serializers

from .models import Data

class DataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Data
        fields = ('temp', 'humidity', 'pressure', 'pm1', 'pm25', 'pm10', 'windspeed', 'created_date', 'created_at')