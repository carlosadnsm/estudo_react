# Agro-e | Teste Técnico Front-End + Back-End

Este repositório contém a solução para o teste técnico utilizando **React** no front-end e **Django + Django REST Framework** no back-end.

Para rodar o back (tem que estar na pasta)

.\venv\Scripts\Activate
python manage.py runserver

Para rodar o front (tem que estar na pasta)

npm run dev

---

### 1. A aplicação React apresenta lentidão ao renderizar listas com mais de 500 produtos.
Tarefas:
Explique e implemente uma solução para melhorar a performance da renderização

O DataTable que eu ja estava usando do PrimeReact ja tem virtualizacao interna com o virtualScroll, vou apenas alterar ele, pois se for refazer com React-Window, perderei as features da tabela que ja existem no PrimeReact, como ordencao, template... Alem do fato que a UX fica melhor pois o scroll infinito é mais natural e suave do que paginação, fora que fica um visual mais clean sem o footer da tabela. A combinação de cache backend com virtual scroll frontend é muito boa porque o backend com cache de dez minutos evita queries repetidas ao banco enquanto o frontend com virtual scroll renderiza apenas o necessário, resultando em experiência fluida mesmo com milhares de produtos.