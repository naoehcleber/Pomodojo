from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.forms import inlineformset_factory
from .models import *
from .forms import CreateUserForm, UserChangeForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.forms import UserChangeForm
from django.views.decorators.cache import never_cache
from .forms import *
import json
from django.http import JsonResponse
import logging


# Função para renderizar a página inicial
def home(request):
    return render(request, 'usuarios/usuarioPage.html')

def historico(request):
    return render(request, 'historico/historico.html')

def metas(request):
    return render(request, 'metas/metas.html')

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
@never_cache
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


def personalizar(request):
    if request.method == "POST":
        form = UserChangeForm(request.POST, request.FILES, instance=request.user)
        print("Formulário sendo usado:", type(form).__name__)  # Depuração
        print("Campos no formulário:", form.fields.keys())
        if form.is_valid():
            
            form.save()
            return redirect(reverse('usuarioPage'))
        else:
            print(form.errors)
            return render(request, 'usuarios/personalizarPerfil.html', {'form': form})
    else:
        form = UserChangeForm(instance=request.Usuario)
        return render(request, 'usuarios/personalizarPerfil.html', {'form': form})

def metas(request):
    print("Método HTTP recebido:", request.method)  # Verifica o método HTTP
    if request.method == 'POST':
       
        data = json.loads(request.body)  # Parse JSON from the request
        goal_text = data.get('text', '').strip()
        completed = data.get('completed', False)
        print("Dados recebidos:", data)  # Depuração
        if goal_text:  # Ensure the goal text is not empty
            Metas.objects.create(user=request.Usuario, text=goal_text, completed=completed)
            return JsonResponse({'message': 'Goal saved successfully!'}, status=201)
        else:
            return JsonResponse({'error': 'Goal text is required.'}, status=400)
    else:
        goals = Metas.objects.filter(user=request.user)
        return render(request, 'metas/metas.html', {'goals': goals})


def pomodoro_view_gambiarra(request):
    data = DadosArduino.objects.all().order_by('-created_at')
    
    return render(request, 'pomodoro/pomodoro.html', {'data': data})

logger = logging.getLogger(__name__)

def get_user_level(request):
    if request.method == 'GET':
        try:
            logger.info(f"Usuário autenticado: {request.Usuario.email}")
            user_level = request.Usuario.ciclos  # Substitua pelo campo correto
            logger.info(f"Nível do usuário {request.Usuario.email}: {user_level}")
            return JsonResponse({'level': user_level}, status=200)
        except AttributeError as e:
            logger.error(f"Erro: {str(e)}")
            return JsonResponse({'error': 'Perfil do usuário não encontrado.'}, status=400)
    logger.warning("Método inválido usado")
    return JsonResponse({'error': 'Método inválido.'}, status=405)

def increment_ciclos(request):
    if request.method == 'POST':
        try:
            # Atualiza o campo ciclos do usuário logado
            profile = request.Usuario.ciclos
            logger.info(f"Ciclos antes do incremento: {profile.ciclos}")

            profile.ciclos += 1
            logger.info(f"Ciclos depois do incremento: {profile.ciclos}")
            profile.save()
            return JsonResponse({'message': 'Ciclos incrementados com sucesso!', 'ciclos': profile.ciclos}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Ocorreu um erro: {str(e)}'}, status=400)
    return JsonResponse({'error': 'Método inválido.'}, status=405)

def historico(request):
    return render(request, 'historico/historico.html')


def suporte(request):
    if request.method == 'POST':
        form = TechSupport(request.POST)
        if form.is_valid():
            contact = form.save(commit=False)  # Salva os dados no banco
            contact.id_usuario = request.Usuario  # Associa o usuário atual

            print(contact)  # Exibe a instância salva
            contact.save()
            return redirect('suporte')
    else:
        form= TechSupport()
    return render(request, 'suporte/suporte.html', {'form':form})

def save_arduino_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            DadosArduino.objects.create(value=data['data'])
            return JsonResponse({'message': 'Data saved successfully!'}, status=201)
        except KeyError:
            return JsonResponse({'error': 'Invalid data format'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

