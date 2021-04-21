from api.models import Book
from rest_framework import serializers

class BookDetailSerializer(serializers.ModelSerializer):
    book_created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Book
        fields = ['id', 'user_target', 'book_author', 'book_title', 'book_description', 'book_poster_image',
                  'book_created_at', 'book_updated_at']

class BookCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ['user_target', 'book_author', 'book_title', 'book_description', 'book_poster_image']


