from django.shortcuts import render

from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.conf import settings

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    CACHE_KEY = 'products:list'
   
    @receiver(post_save, sender=Product)
    def invalidate_cache_on_save(sender, instance, **kwargs):
        cache.delete(CACHE_KEY)

    @receiver(post_delete, sender=Product)
    def invalidate_cache_on_delete(sender, instance, **kwargs):
        cache.delete(CACHE_KEY)

    def list(self, request, *args, **kwargs):
        data = cache.get(self.CACHE_KEY)
        if data is None:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data
            cache.set(self.CACHE_KEY, data, getattr(settings, 'CACHE_TTL', 600))
        return Response(data)

    def _invalidate_cache(self):
        cache.delete(self.CACHE_KEY)

    def create(self, request, *args, **kwargs):
        resp = super().create(request, *args, **kwargs)
        self._invalidate_cache()
        return resp

    def update(self, request, *args, **kwargs):
        resp = super().update(request, *args, **kwargs)
        self._invalidate_cache()
        return resp

    def partial_update(self, request, *args, **kwargs):
        resp = super().partial_update(request, *args, **kwargs)
        self._invalidate_cache()
        return resp

    def destroy(self, request, *args, **kwargs):
        resp = super().destroy(request, *args, **kwargs)
        self._invalidate_cache()
        return resp

@api_view(['POST'])
@permission_classes([AllowAny]) 
def register(request):
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    if not username or not password:
        return Response({'detail': 'username e password são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=username, password=password)
    return Response({'detail': 'Usuário criado com sucesso.'}, status=status.HTTP_201_CREATED)