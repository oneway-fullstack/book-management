from rest_framework import routers
from django.urls import include, path
from .views import *

router = routers.DefaultRouter()
router.register(r'books', BookViewSet, basename='books')
urlpatterns = [
    path('', include(router.urls)),
]


