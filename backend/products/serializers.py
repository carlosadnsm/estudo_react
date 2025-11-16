from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'stock', 'created_at']


    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("O nome do produto não pode ser vazio.")
        return value

    def validate_price(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value