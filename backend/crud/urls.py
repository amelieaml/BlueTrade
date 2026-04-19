from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # AQUI SE DEFINE LA RUTA, PRIMERO ES EL NOMBRE DEL PROYECTO (ITEM)
    # DESPUES VIENE EL NOMBRE DE LA APP (TEST), FINALMENTE LA RUTA DEL ROUTER (ITEMS)
    path('item/', include('api.urls')),

]
