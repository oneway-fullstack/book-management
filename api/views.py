import json
from api.models import Book
from api.serializers import (
    BookCreateSerializer,
    BookDetailSerializer
)
from rest_framework import viewsets, permissions
from rest_framework.decorators import action

class BookViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = Book.objects.all()

    def get_serializer_class(self):
        if self.action == 'mine':
            return BookDetailSerializer
        if self.action == 'create':
            return BookCreateSerializer
        return BookCreateSerializer

    @action(detail=False, methods=['get'], url_path='mine')
    def mine(self, request, *args, **kwargs):
        self.queryset = request.user.books
        return super().list(request, *args, **kwargs)
