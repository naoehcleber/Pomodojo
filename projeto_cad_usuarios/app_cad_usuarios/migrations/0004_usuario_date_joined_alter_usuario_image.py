# Generated by Django 5.1.1 on 2024-11-23 17:25

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_cad_usuarios', '0003_usuario_last_login_alter_usuario_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='date_joined',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='image',
            field=models.ImageField(default='files/userPhotos/defaultUser.PNG', upload_to='files/userPhotos'),
        ),
    ]
