# pomodoro/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.pomodoro_view, name='pomodoro'),
]
