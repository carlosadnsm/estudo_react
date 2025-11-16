# Agro-e | Teste Técnico Front-End + Back-End

Este repositório contém a solução para o teste técnico utilizando **React** no front-end e **Django + Django REST Framework** no back-end.

---

### 1. Configuração inicial
- Instalação do **Python 3.14** e verificação do `pip`.
- Criação e ativação de um **ambiente virtual (venv)**.
- Instalação das dependências iniciais:
  - `django`
  - `djangorestframework`

### 2. Estrutura do projeto
- Criação da pasta raiz `agro-e/` com subpastas:
  - `backend/` → projeto Django
  - `frontend/` → aplicação React (a ser criada)
  - `docs/` → documentação
- Inicialização do repositório Git e criação de `.gitignore`.

### 3. Backend (Django)
- Criação do projeto Django chamado **core**.
- Criação do app **products**.
- Registro do app `products` e do `rest_framework` em `INSTALLED_APPS`.
- Implementação do modelo **Product**:
  - Campos: `name` (CharField) e `price` (DecimalField).
- Execução das migrações:
  - `python manage.py makemigrations`
  - `python manage.py migrate`

- Para rodar o servidor: 

    .\venv\Scripts\activate 

    e depois 

    python manage.py runserver
---

## Next Steps
- Implementar **serializers**, **viewsets** e **rotas** para expor os produtos via `/api/products/`.
- Criar o front-end em React para consumir a API.
- Adicionar testes unitários e documentação detalhada.

---