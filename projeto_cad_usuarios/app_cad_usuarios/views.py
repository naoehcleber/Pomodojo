from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.forms import inlineformset_factory
from .models import *
from .forms import CreateUserForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.urls import reverse

# Função para renderizar a página inicial
def home(request):
    return render(request, 'usuarios/usuarioPage.html')

# # Função para cadastrar novos usuários
# def usuarios(request):
#     novo_usuario = Usuario()
#     novo_usuario.nome = request.POST.get('nome')
#     novo_usuario.idade = request.POST.get('idade')
#     novo_usuario.save()
#     # Recupera todos os usuários cadastrados
#     usuarios = {
#         'usuarios'  : Usuario.objects.all()
#     }
#     # Retorna os dados para a página de listagem de usuários
#     return render(request, 'usuarios/usuarios.html', usuarios)

# Função para redirecionar o usuário para a página de login
def home_redirect(request):
    return redirect('login')  # Nome da URL para onde deseja redirecionar

# Função para renderizar a página do usuário
def usuarioPage(request):
    return render(request, 'usuarios/usuarioPage.html', usuarioPage)

# Função para autenticar e fazer login do usuário
def login_Usuario(request):
    if request.method == "POST":
        email =  request.POST.get('email')  # Obtém o email do formulário
        password = request.POST.get('password')  # Obtém a senha do formulário
        
        # Autentica o usuário com as credenciais fornecidas
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)  # Faz login se o usuário for autenticado
            return render(request, 'pomodoro/pomodoro.html')  # Redireciona para a página 'pomodoro'
            
        else:
            messages.info(request, 'Email ou Senha estão incorretos')  # Mensagem de erro

    return render(request, 'login/singin_template.html')

# Função para cadastrar um novo usuário
def logon(request):
    if request.method == "POST":
        form = CreateUserForm(request.POST)  # Cria um formulário com os dados enviados
        if form.is_valid():
            form.save()  # Salva o novo usuário
            return redirect(reverse('login'))  # Redireciona para a página de login
    else:
        form = CreateUserForm()  # Cria um formulário vazio
    return render(request, 'login/cadastro.html', {"form": form})

# Função para renderizar a página do usuário (duplicada)
def usuarioPage(request):
    context = {}  # Certifique-se de que context é um dicionário
    return render(request, 'usuarios/usuarioPage.html', context)

def pomodoro_view_gambiarra(request):
    return render(request, 'pomodoro/pomodoro.html')

def concentration_history(request):
    return render(request, 'pomodoro/concentration_history.html')