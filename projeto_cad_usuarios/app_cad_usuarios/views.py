from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.forms import inlineformset_factory
from .models import *
from .forms import OrderForm, CreateUserForm

# Create your views here.
def home(request):
    return render(request, 'usuarios/usuarioPage.html')

def usuarios(request):
    novo_usuario = Usuario()
    novo_usuario.nome = request.POST.get('nome')
    novo_usuario.idade = request.POST.get('idade')
    novo_usuario.save()
    #exibir todos os usuarios ja cadstrados em uma nova pagina
    usuarios = {
        'usuarios'  : Usuario.objects.all()
    }
    #retorna os dados para a pagina de listagem de usuarios
    return render(request, 'usuarios/usuarios.html', usuarios)

def usuarioPage(request):
    return render(request, 'usuarios/usuarioPage.html', usuarioPage)

def login(request):
    return render(request, 'login/singin_template.html')

def logon(request):
    form = CreateUserForm()
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("")
    else:
        form = CreateUserForm()
    return render(request, 'login/cadastro.html', {"form": form})

