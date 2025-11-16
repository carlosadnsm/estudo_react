from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'stock', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        """Valida que o nome não seja vazio"""
        if not value or not value.strip():
            raise serializers.ValidationError("O nome do produto não pode ser vazio.")
        return value.strip()

    def validate_price(self, value):
        """Valida que o preço seja positivo"""
        if value is None:
            raise serializers.ValidationError("O preço é obrigatório.")
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_stock(self, value):
        """Valida que o estoque não seja negativo"""
        if value is not None and value < 0:
            raise serializers.ValidationError("O estoque não pode ser negativo.")
        return value