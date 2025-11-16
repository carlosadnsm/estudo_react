from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from .models import Product

class ProductModelTest(TestCase):
    """Testes para o modelo Product"""
    
    def test_create_product(self):
        """Testa criação de produto válido"""
        product = Product.objects.create(
            name="Produto Teste",
            price=Decimal("99.99"),
            description="Descrição teste",
            stock=10
        )
        self.assertEqual(product.name, "Produto Teste")
        self.assertEqual(product.price, Decimal("99.99"))
        self.assertEqual(product.stock, 10)
        
    def test_product_str(self):
        """Testa representação em string do produto"""
        product = Product.objects.create(
            name="Produto Teste",
            price=Decimal("50.00")
        )
        self.assertEqual(str(product), "Produto Teste")

class ProductAPITest(APITestCase):
    """Testes para a API de produtos"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.product1 = Product.objects.create(
            name="Produto 1",
            price=Decimal("10.00"),
            description="Descrição 1",
            stock=5
        )
        self.product2 = Product.objects.create(
            name="Produto 2",
            price=Decimal("20.00"),
            description="Descrição 2",
            stock=10
        )
        
    def test_get_all_products(self):
        """Testa listagem de todos os produtos"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_get_single_product(self):
        """Testa busca de um produto específico"""
        response = self.client.get(f'/api/products/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Produto 1")
        self.assertEqual(Decimal(response.data['price']), Decimal("10.00"))
        
    def test_create_valid_product(self):
        """Testa criação de produto válido"""
        data = {
            'name': 'Produto Novo',
            'price': '30.00',
            'description': 'Nova descrição',
            'stock': 15
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 3)
        self.assertEqual(response.data['name'], 'Produto Novo')
        
    def test_create_product_without_name(self):
        """Testa validação: produto sem nome deve falhar"""
        data = {
            'name': '',
            'price': '30.00'
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        
    def test_create_product_without_price(self):
        """Testa validação: produto sem preço deve falhar"""
        data = {
            'name': 'Produto Sem Preço',
            'price': ''
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('price', response.data)
        
    def test_create_product_with_negative_price(self):
        """Testa validação: preço negativo deve falhar"""
        data = {
            'name': 'Produto Preço Negativo',
            'price': '-10.00'
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('price', response.data)
        
    def test_create_product_with_negative_stock(self):
        """Testa validação: estoque negativo deve falhar"""
        data = {
            'name': 'Produto Estoque Negativo',
            'price': '10.00',
            'stock': -5
        }
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stock', response.data)
        
    def test_update_product(self):
        """Testa atualização de produto"""
        data = {
            'name': 'Produto Atualizado',
            'price': '15.00',
            'description': 'Descrição atualizada',
            'stock': 20
        }
        response = self.client.put(f'/api/products/{self.product1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.name, 'Produto Atualizado')
        self.assertEqual(self.product1.price, Decimal('15.00'))
        
    def test_partial_update_product(self):
        """Testa atualização parcial de produto"""
        data = {'price': '25.00'}
        response = self.client.patch(f'/api/products/{self.product1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.price, Decimal('25.00'))
        self.assertEqual(self.product1.name, 'Produto 1')  #nome não mudou
        
    def test_delete_product(self):
        """Testa exclusão de produto"""
        response = self.client.delete(f'/api/products/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 1)
        
    def test_delete_nonexistent_product(self):
        """Testa exclusão de produto inexistente"""
        response = self.client.delete('/api/products/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)