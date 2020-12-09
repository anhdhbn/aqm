from django.urls import include, path
from rest_framework import routers
from .views import DataViewSet
from rest_framework import renderers
from rest_framework.urlpatterns import format_suffix_patterns

fetch_data = DataViewSet.as_view({
    'get': 'fetch_data'
}, renderer_classes=[renderers.JSONRenderer])

post_data = DataViewSet.as_view({
    'post': 'post_data'
}, renderer_classes=[renderers.JSONRenderer])

realtime_data = DataViewSet.as_view({
    'get': 'realtime_data'
}, renderer_classes=[renderers.JSONRenderer])


urlpatterns = format_suffix_patterns([
    path('', fetch_data, name='fetch-data'),
    path('', post_data, name='post-data'),
    path('/realtime/', realtime_data, name='realtime-data'),
])

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
# urlpatterns = [
#     path('', views.query_data),
#     path('realtime/', views.realtime_data),
#     # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]