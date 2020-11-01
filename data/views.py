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

# class DataViewSet(APIView):
#     def get(delf, request):
#         all_data = Data.objects.all()
#         all_data_seri = DataSerializer(all_data, many=True)
#         return Response(all_data_seri.data)
# class DataViewSet(viewsets.ModelViewSet):
#     queryset = Data.objects.all().order_by('created_date')
#     serializer_class = DataSerializer

@api_view(['GET', 'POST'])
def query_data(request):
    if request.method == "GET":
        type_get = request.GET.get('type', 'all')
        print(type_get)
        all_data = Data.objects.all()
        serializer = DataSerializer(all_data, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = DataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "data were created"}, status=status.HTTP_201_CREATED)
        else: return Response(serializer.errors)