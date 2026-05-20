from django.urls import path, include
from rest_framework import routers
from .views import *
from django.urls import path

#DEFINE LAS DIRECCIONES DE LA API, EN ESTE CASO SE CREA UNA RUTA PARA LOS ITEMS, QUE SE ENCUENTRA EN EL ARCHIVO VIEWS.PY
router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioView, 'usuario')

urlpatterns = [
    path('test/', include(router.urls))
]