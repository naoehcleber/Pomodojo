from django.db import models

# Create your models here.
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key = True)
    nome = models.TextField(max_length =255)
    idade = models.IntegerField()

class CriarUsuario(models.Model):
    id_usuario = models.AutoField(primary_key = True)
    nome = models.TextField(max_length =255)
    email = models.TextField(max_length =255)