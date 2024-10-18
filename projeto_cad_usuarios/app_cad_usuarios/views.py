from django.shortcuts import render
from .models import Usuario
# Create your views here.
def home(requests):
    return render(requests, 'usuarios/usuarioPage.html')

def usuarios(requests):
    novo_usuario = Usuario()
    novo_usuario.nome = requests.POST.get('nome')
    novo_usuario.idade = requests.POST.get('idade')
    novo_usuario.save()
    #exibir todos os usuarios ja cadstrados em uma nova pagina
    usuarios = {
        'usuarios'  : Usuario.objects.all()
    }
    #retorna os dados para a pagina de listagem de usuarios
    return render(requests, 'usuarios/usuarios.html', usuarios)

def usuarioPage(requests):
    return render(requests, 'usuarios/usuarioPage.html', usuarioPage)

def login(requests):
    return render(requests, 'login/singin_template.html')

def logon(requests):
    return render(requests, 'login/cadastro.html')

