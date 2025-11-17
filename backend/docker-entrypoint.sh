#!/bin/bash
set -e

echo "Aguardando banco de dados..."
until python -c "import socket; s = socket.socket(); s.settimeout(1); s.connect(('db', 5432)); s.close()" 2>/dev/null; do
  echo "PostgreSQL ainda não está pronto..."
  sleep 1
done
echo "Banco de dados disponível!"

echo "Aplicando migrações..."
python manage.py migrate --noinput

echo "Criando superusuário (se não existir)..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@gmail.com', 'admin')
    print('Superusuário criado: admin/admin')
else:
    print('Superusuário já existe')
END

echo "Iniciando servidor..."
if [ "$DJANGO_ENV" = "production" ]; then
    echo "Modo PRODUÇÃO - usando gunicorn"
    gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120
else
    echo "Modo DESENVOLVIMENTO - usando runserver"
    python manage.py runserver 0.0.0.0:8000
fi
