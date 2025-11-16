# Gestão de Produtos - React + Django

## Estrutura do Projeto

```
├── frontend/          # Aplicação React com Vite
└── backend/           # API Django REST
```

## Como Rodar o Projeto

### Backend (Django)

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Ative o virtual environment:
```bash
.\venv\Scripts\activate
```

3. Execute as migrações (se necessário):
```bash
python manage.py migrate
```

4. Inicie o servidor Django:
```bash
python manage.py runserver
```

O backend estará disponível em `http://localhost:8000`

### Frontend (React)

1. Abra um novo terminal e navegue até a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências (se ainda não tiver feito):
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Funcionalidades Implementadas

### Tabela de Produtos (DataTable do primereact)
- Exibição de produtos com colunas: Nome, Preço e Ações
- Paginação automática (10 itens por página ou mais)
- Botões para editar e deletar produtos
- Formatação de preços em BRL
- Loading state durante requisições

### API Endpoints - URL ou Postman(ou similares)
- `GET /api/products/` - Lista todos os produtos
- `POST /api/products/` - Criar novo produto
- `GET /api/products/{id}/` - Obter detalhes de um produto
- `PUT /api/products/{id}/` - Atualizar um produto
- `DELETE /api/products/{id}/` - Deletar um produto

## A partir da questao 2:
- Para rodar os testes fazer: 
'
cd backend
.\venv\Scripts\activate
python manage.py test products
'
Exemplo de retorno: 

(venv) PS C:\Users\carlo\dev\estudo_react\backend> python manage.py test products
Found 13 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.............
----------------------------------------------------------------------
Ran 13 tests in 0.043s

OK
Destroying test database for alias 'default'...