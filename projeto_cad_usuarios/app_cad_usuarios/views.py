from django.shortcuts import render

# Create your views here.
def home(requests):
    return render(requests, 'usuarios/home.html')

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
    return render(requests, 'usuarios/usuarios.hmtl', usuarios)
