from django.urls import include, path
from rest_framework import routers
from . import views

# router = routers.DefaultRouter()
# router.register(r'^data/$', views.DataViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', views.query_data),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]