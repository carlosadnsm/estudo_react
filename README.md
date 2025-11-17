# Agro-e | Teste Técnico Front-End + Back-End

Este repositório contém a solução para o teste técnico utilizando **React** no front-end e **Django + Django REST Framework** no back-end.

Para rodar o back (tem que estar na pasta)

.\venv\Scripts\Activate
python manage.py runserver

Para rodar o front (tem que estar na pasta)

npm run dev

---

### 1. Sua aplicação em Django precisa de um sistema de monitoramento e geração de logs para rastrear
erros em produção.
Tarefas:
Configure o Django para enviar logs detalhados para um sistema externo (ex.: Sentry ou ELK Stack)

A configuração do Sentry no Django foi feita através do sentry_sdk direto no backend/config/settings.py com integração específica para Django e logging. O DSN (Data Source Name) do Sentry vem de variável de ambiente para segurança, permitindo diferentes configurações por ambiente (development, staging, production). A taxa de amostragem de performance foi definida em 10% para produção (otimização de custos) e 100% para desenvolvimento (debug completo). O send_default_pii está ativado para enviar informações de usuário junto com os erros, facilitando a reprodução de bugs. O sistema captura automaticamente todas as exceções não tratadas, erros de requisições HTTP, queries lentas do banco de dados, e transações de performance.

Para isso foi necessario definir um .env locamente direto na pasta do backend, caso queiram testar por ai, precisam adicionar o:

SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
SENTRY_ENVIRONMENT=development

na mesma altura do arquivo manage.py