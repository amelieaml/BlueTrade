from django.contrib import admin
from django.urls import path, include

# 1. IMPORTA ESTAS DOS HERRAMIENTAS DE DJANGO
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # AQUI SE DEFINE LA RUTA, PRIMERO ES EL NOMBRE DEL PROYECTO (ITEM)
    # DESPUES VIENE EL NOMBRE DE LA APP (TEST), FINALMENTE LA RUTA DEL ROUTER (ITEMS)
    path('item/', include('api.urls')),
]

# 2. AGREGA ESTA CONDICIÓN AL FINAL (FUERA DE LA LISTA)
# Esto le dice a Django: "Si estamos programando localmente, expón la carpeta media mediante la URL /media/"
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)