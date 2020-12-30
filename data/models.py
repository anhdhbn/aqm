from django.db import models

# Create your models here.

class Data(models.Model):
    temp = models.FloatField(blank=False, null=False, default=0)
    humidity = models.FloatField(blank=False, null=False, default=0)
    pressure = models.FloatField(blank=False, null=False, default=0)
    pm1 = models.FloatField(blank=False, null=False, default=0)
    pm25 = models.FloatField(blank=False, null=False, default=0)
    pm10 = models.FloatField(blank=False, null=False, default=0)
    windspeed = models.FloatField(blank=False, null=False, default=0)

    so2 = models.FloatField(blank=False, null=False, default=0)
    no2 = models.FloatField(blank=False, null=False, default=0)
    co = models.FloatField(blank=False, null=False, default=0)
    o3 = models.FloatField(blank=False, null=False, default=0)

    no = models.FloatField(blank=False, null=False, default=0)
    nh3 = models.FloatField(blank=False, null=False, default=0)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    created_date = models.DateField(auto_now_add=True, editable=False) #auto_now 