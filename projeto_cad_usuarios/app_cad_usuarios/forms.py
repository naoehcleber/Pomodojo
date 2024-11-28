from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import Usuario, Contact

class CreateUserForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2']

        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': ' ',
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': ' ',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': ' ',
            }),
            'password1': forms.PasswordInput(attrs={
                'class': 'form-control',
                'placeholder': ' ',
            }),
            'password2': forms.PasswordInput(attrs={
                'class': 'form-control',
                'placeholder': ' ',
            }),
        }


class UserChangeForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'email', 'image']
        
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
        }
    
        
        def clean(self):
            cleaned_data = super().clean()
            return cleaned_data
    
    
class TechSupport(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'phone', ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Seu nome'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Seu email'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Seu telefone'}),
        }