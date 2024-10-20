"""
URL configuration for projeto_cad_usuarios project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app_cad_usuarios import views


urlpatterns = [
    #redireciona a pagina inicial pra login
    path('', views.home_redirect),
    #admin
    path('admin/', admin.site.urls),

    #rota, view responsavel, nome de referencia
    path('login/', views.login, name = 'login'),
    path('logon/', views.logon, name='logon'),
    path('home/', views.home, name = 'home'),

    #usuarios.com/usuarios
    #path('usuarios/', views.usuarios, name = 'listagem_usuarios'),

    path('usuarios/', views.usuarioPage, name = 'usuarioPage'),
    path('pomodoro/', include('pomodoro.urls')),
]
