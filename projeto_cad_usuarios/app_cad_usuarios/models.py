from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

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
    image = models.ImageField(upload_to='app_cad_usuarios/files/userPhotos', default='files/userPhotos/defaultUser.PNG')
    
    objects = UsuarioManager()

    USERNAME_FIELD = 'email'  # Define o campo utilizado para login
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Campos exigidos além do email