# Agro-e | Teste Técnico Front-End + Back-End

Este repositório contém a solução para o teste técnico utilizando **React** no front-end e **Django + Django REST Framework** no back-end.

---

### 1. Como invalidar o Cache se os produtos forem atualizados?

O cache é feito no método list do ProductViewSet. Quando chega um GET em /api/products, o código tenta ler a chave products:list no cache. Se existir, retorna o conteúdo diretamente. Se não existir, busca os produtos no banco, serializa, grava no cache com o TTL definido (10 minutos) e devolve a resposta. Assim os próximos GET usam o dado em cache até expirar.

A invalidação acontece sempre que há escrita. Após criar, atualizar, atualizar parcialmente ou deletar um produto, o ViewSet chama cache.delete('products:list'). Isso remove a chave e garante que o próximo GET recalcule e regrave o cache atualizado.

Para mudanças feitas fora da API (por exemplo, no Django /admin ou scripts), usa-se sinais do Django. Registre handlers para post_save e post_delete do modelo Product que executam cache.delete('products:list'). Esses signals devem ficar em products/signals.py e ser carregados no método ready do AppConfig (products/apps.py). Com isso, qualquer alteração em produtos, por qualquer caminho, derruba a chave e força a reconstrução no próximo GET.