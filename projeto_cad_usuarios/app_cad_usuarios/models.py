from django.db import models

# Create your models here.
class Usuarios(models.Model):
    id_usuario = models.AutoField(primary_key = True)
    nome = models.TextField(max_length =255)
    idade = models.IntegerField()
