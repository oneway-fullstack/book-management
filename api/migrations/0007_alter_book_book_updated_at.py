# Generated by Django 3.2 on 2021-04-21 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_book_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='book_updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]