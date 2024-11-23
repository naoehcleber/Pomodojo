from django.forms import ModelForm

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import Usuario



class CreateUserForm(UserCreationForm):

    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2']

class UserChangeForm(forms.ModelForm):

    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'image', 'email']
        labels = {
            'first_name': '',
            'last_name': '',
            'image': '',
            'email': ''
        }
        widgets = {
            'image': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
        }
       
    