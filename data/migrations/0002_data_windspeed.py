# Generated by Django 2.2.10 on 2020-11-23 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='data',
            name='windspeed',
            field=models.FloatField(default=0),
        ),
    ]