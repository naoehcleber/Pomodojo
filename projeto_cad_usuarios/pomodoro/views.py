from django.shortcuts import render

def pomodoro_view(request):
    return render(request,'pomodoro/pomodoro.html')
