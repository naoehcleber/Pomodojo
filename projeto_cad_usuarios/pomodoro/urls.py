# pomodoro/urls.py
from django.urls import path
from . import views


app_name = 'pomodoro'

urlpatterns = [
    path('pomodoro', views.pomodoro_view, name='pomodoro'),

]
