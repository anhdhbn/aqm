from django.db import models

# Create your models here.

class Data(models.Model):
    temp = models.FloatField(blank=False, null=False)
    humidity = models.FloatField(blank=False, null=False)
    pressure = models.FloatField(blank=False, null=False)
    pm1 = models.FloatField(blank=False, null=False)
    pm25 = models.FloatField(blank=False, null=False)
    pm10 = models.FloatField(blank=False, null=False)
    windspeed = models.FloatField(blank=False, null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    created_date = models.DateField(auto_now_add=True, editable=False) #auto_now 