import os
import sys
from django.utils import timezone
from django.db import models as m
from django.contrib.auth.models import User

def upload_to(instance, filename):
    now = timezone.now()
    base, extension = os.path.splitext(filename.lower())
    milliseconds = now.microsecond // 1000
    return f"books/{instance.pk}/{now:%Y%m%d%H%M%S}{milliseconds}{extension}"


class Book(m.Model):
    user_target = m.ForeignKey(User, related_name='books', on_delete=m.CASCADE)
    book_author = m.CharField(max_length=64, null=False)
    book_title = m.CharField(max_length=128, null=False)
    book_description = m.CharField(max_length=512, default='')
    book_poster_image = m.ImageField(upload_to=upload_to, blank=True)
    book_created_at = m.DateTimeField(auto_now_add=True)
    book_updated_at = m.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'db_book'
        ordering = ['book_updated_at']
        unique_together = ['user_target', 'book_author', 'book_title']

