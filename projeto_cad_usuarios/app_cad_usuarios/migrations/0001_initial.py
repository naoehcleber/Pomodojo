# Generated by Django 5.1.1 on 2024-10-20 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.TextField(max_length=255)),
                ('last_name', models.TextField(max_length=255)),
                ('password', models.TextField(max_length=255)),
                ('image', models.ImageField(upload_to='app_cad_usuarios/files/userPhotos')),
            ],
        ),
    ]
