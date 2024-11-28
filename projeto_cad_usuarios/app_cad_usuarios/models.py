from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now

# Create your models here.
# class Usuario(models.Model):
#     id_usuario = models.AutoField(primary_key = True)
#     nome = models.TextField(max_length =255)
#     idade = models.IntegerField()



class UsuarioManager(BaseUserManager):
    
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError('O usuário deve ter um endereço de email')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)  # Criptografa a senha
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class Usuario(AbstractBaseUser):
    
    id_usuario = models.AutoField(primary_key = True)
    first_name = models.TextField(max_length =50)
    last_name = models.TextField(max_length =50)
    email = models.TextField(max_length =50, unique=True, default='default@example.com')
    password = models.TextField(max_length=255)
    image = models.ImageField(upload_to='media/files/userPhotos', default='files/userPhotos/defaultUser.PNG')
    
    objects = UsuarioManager()

    USERNAME_FIELD = 'email'  # Define o campo utilizado para login
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Campos exigidos além do email

class Contact(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"  # Mostra o nome e email
    
class Metas(models.Model):
    id_meta = models.AutoField(primary_key = True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)  # The goal text
    completed = models.BooleanField(default=False)  # Whether the goal is completed
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp


