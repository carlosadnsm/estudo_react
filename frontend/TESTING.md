## A partir da questao 3:

# Testes Unitários - Frontend React

Este projeto utiliza **Vitest** e **Testing Library** para testes unitários dos componentes React.

##  Dependências de Teste

- `vitest` - Framework de testes rápido para Vite
- `@testing-library/react` - Utilitários para testar componentes React
- `@testing-library/jest-dom` - Matchers customizados para Jest DOM
- `@testing-library/user-event` - Simulação de interações do usuário
- `jsdom` - Implementação do DOM para Node.js

##  Testes Implementados

### ProductTable.test.jsx

####  Renderização da Tabela
-  Deve exibir a tabela de produtos corretamente
-  Deve exibir mensagem quando não há produtos
-  Deve exibir o título "Produtos"
-  Deve exibir os botões de ação

####  Exclusão de Produto
-  Deve remover o produto da lista ao clicar em deletar
-  Não deve remover o produto se o usuário cancelar

####  Adição de Produto
-  Deve abrir o modal ao clicar em "Novo Produto"
-  Deve adicionar um novo produto corretamente
-  Deve validar campos obrigatórios ao tentar salvar
-  Deve limpar os erros ao digitar nos campos

####  Edição de Produto
-  Deve abrir o modal de edição com os dados do produto

####  Ordenação
-  Deve limpar a ordenação ao clicar no botão
##  Como Executar os Testes

### Rodar todos os testes
```bash
npm test
```

### Rodar testes em modo watch (reexecuta ao salvar)
```bash
npm test -- --watch
```

### Rodar testes com interface gráfica
```bash
npm run test:ui
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Rodar um arquivo de teste específico
```bash
npm test ProductTable.test.jsx
```

## Cobertura de Testes

Os testes cobrem os principais fluxos do componente `ProductTable`:

1. **Carregamento de dados** - Verifica se produtos são exibidos corretamente
2. **CRUD de produtos** - Testa criação, leitura, atualização e exclusão
3. **Validações** - Garante que campos obrigatórios são validados
4. **Interações do usuário** - Testa cliques, digitação e feedback visual
5. **Estados de erro** - Verifica bordas vermelhas e mensagens de erro

## Configss

### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
```

### setupTests.js
```javascript
import '@testing-library/jest-dom';
```

## Exemplo de Testes

```javascript
it('deve exibir a tabela de produtos corretamente', async () => {
  render(<ProductTable />);

  await waitFor(() => {
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByTestId('product-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-row-3')).toBeInTheDocument();
  });
});
```

##  Boas Práticas

-  Testes isolados - cada teste limpa os mocks antes de executar
-  Testes assíncronos - usa `waitFor` para aguardar atualizações
-  Simulação de API - usa `vi.mock` para mockar serviços
-  Interações reais - usa `userEvent` para simular ações do usuário
-  Acessibilidade - usa queries semânticas (`getByRole`, `getByTestId`)

## Debugging

Para debugar testes, adicione:

```javascript
import { screen } from '@testing-library/react';

// Exibe o DOM atual no console
screen.debug();

// Exibe um elemento específico
screen.debug(screen.getByTestId('datatable'));
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

- Primeiro teste deu ruim kkkkkkk

 Test Files  1 failed (1)
      Tests  4 failed | 8 passed (12)
   Start at  22:32:00
   Duration  6.36s (transform 172ms, setup 142ms, collect 1.17s, tests 3.90s, environment 953ms, prepare 21ms)

 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit

Para arrumar foi necessario mockar a api ao inves de mockar o front, depois disso foi tranquilo, arrumei alguns errinhos na mao e deu brasil

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  22:47:15
   Duration  11.40s (transform 160ms, setup 141ms, collect 1.36s, tests 8.75s, environment 962ms, prepare 19ms)

para rodar precisa entrar no dir do front e rodar os comandos dee teste
cd C:\Users\carlo\dev\estudo_react\frontend
npm test
npm test -- --run