from django.shortcuts import render
from rest_framework import request

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import JSONParser 

from .serializers import DataSerializer
from .models import Data
from django.core.cache import cache

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import renderers

from datetime import date, timedelta

def RepresentsInt(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

class DataViewSet(viewsets.ModelViewSet):
    @action(method="get", detail=True, renderer_classes=[renderers.JSONRenderer])
    def fetch_data(self, request, *args, **kwargs):
        type_get = request.GET.get('type', 'all').replace("/", "")
        all_data = Data.objects.all().order_by("created_at")
        max_get=50
        startdate = date.today()
        enddate = date.today() + timedelta(days=1)
        if RepresentsInt(type_get):
            take = int(type_get)
            all_data = reversed(all_data.reverse()[:take])
        else:
            if type_get != "all":
                if type_get == "day":
                    startdate = date.today() - timedelta(days=1)
                elif type_get == "week":
                    startdate = date.today() - timedelta(days=7)
                elif type_get == "2week":
                    startdate = date.today() - timedelta(days=14)
                elif type_get == "month":
                    startdate = date.today() - timedelta(days=30)
                elif type_get == "year":
                    startdate = date.today() - timedelta(days=365)
                all_data = all_data.filter(created_at__range=[startdate, enddate])
        if(len(all_data) > max_get):
            all_data = reversed(all_data.reverse()[:max_get])
        serializer = DataSerializer(all_data, many=True)
        return Response(serializer.data)
    
    @action(method="post", detail=True, renderer_classes=[renderers.JSONRenderer])
    def post_data(self, request, *args, **kwargs):
        data = JSONParser().parse(request)
        serializer = DataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "data were created"}, status=status.HTTP_201_CREATED)
        else: return Response(serializer.errors)

    @action(method="get", detail=True, renderer_classes=[renderers.JSONRenderer])
    def realtime_data(self, request, *args, **kwargs):
        tmp = Data()
        tmp.temp=cache.get("realtime_temp")
        tmp.humidity=cache.get("realtime_humidity")
        tmp.pressure=cache.get("realtime_pressure")
        tmp.windspeed=cache.get("realtime_windSpeed")
        tmp.pm1=cache.get("realtime_pm1")
        tmp.pm25=cache.get("realtime_pm25")
        tmp.pm10=cache.get("realtime_pm10")
        
        tmp.so2 = cache.get("realtime_so2")
        tmp.no2 = cache.get("realtime_no2")
        tmp.co = cache.get("realtime_co")
        tmp.o3 = cache.get("realtime_o3")

        tmp.no = cache.get("realtime_no")
        tmp.nh3 = cache.get("realtime_nh3")
        
        serializer = DataSerializer(tmp, many=False)
        return Response(serializer.data)

# class DataViewSet(viewsets.ModelViewSet):
#     queryset = Data.objects.all().order_by('created_date')
#     serializer_class = DataSerializer
