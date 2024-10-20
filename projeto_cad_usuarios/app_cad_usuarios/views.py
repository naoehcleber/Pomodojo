from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.forms import inlineformset_factory
from .models import *
from .forms import CreateUserForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

# Create your views here.
def home(request):
    return render(request, 'usuarios/usuarioPage.html')

# def usuarios(request):
#     novo_usuario = Usuario()
#     novo_usuario.nome = request.POST.get('nome')
#     novo_usuario.idade = request.POST.get('idade')
#     novo_usuario.save()
#     #exibir todos os usuarios ja cadstrados em uma nova pagina
#     usuarios = {
#         'usuarios'  : Usuario.objects.all()
#     }
#     #retorna os dados para a pagina de listagem de usuarios
#     return render(request, 'usuarios/usuarios.html', usuarios)

def home_redirect(request):
    return redirect('login')  # Nome da URL para onde deseja redirecionar

def usuarioPage(request):
    return render(request, 'usuarios/usuarioPage.html', usuarioPage)

def login(request):
    if request.method == "POST":
        email =  request.POST.get('email')
        password = request.POST.get('password')

        user =authenticate(request, email=email, password=password)

        if user is not None:
            login(request, email)
            redirect('pomodoro_view')
        else :
            messages.info(request, 'Email ou Senha estão incorretos')

    return render(request, 'login/singin_template.html')

def logon(request):
    
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = CreateUserForm()
    return render(request, 'login/cadastro.html', {"form": form})

def usuarioPage(request):
    return render(request, 'usuarios/usuarioPage.html', usuarioPage)
