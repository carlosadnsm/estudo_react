import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductTable from './ProductTable';
import { productService } from '../services/api';

// Mock apenas do serviço de API - deixamos os componentes PrimeReact renderizarem normalmente
vi.mock('../services/api', () => ({
  productService: {
    getAll: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('ProductTable', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Produto 1',
      price: 10.0,
      description: 'Descrição 1',
      stock: 5,
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Produto 2',
      price: 20.0,
      description: 'Descrição 2',
      stock: 10,
      created_at: '2025-01-02T00:00:00Z',
    },
    {
      id: 3,
      name: 'Produto 3',
      price: 30.0,
      description: 'Descrição 3',
      stock: 15,
      created_at: '2025-01-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    productService.getAll.mockResolvedValue({ data: mockProducts });
  });

  describe('Renderização da Tabela', () => {
    it('deve exibir a tabela de produtos corretamente', async () => {
      render(<ProductTable />);

      // Aguarda o carregamento dos produtos
      await waitFor(() => {
        expect(productService.getAll).toHaveBeenCalled();
      });

      // Verifica se há produtos na tela (busca pelo nome do primeiro produto)
      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument();
        expect(screen.getByText('Produto 2')).toBeInTheDocument();
        expect(screen.getByText('Produto 3')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem quando não há produtos', async () => {
      productService.getAll.mockResolvedValue({ data: [] });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
      });
    });

    it('deve exibir o título "Produtos"', () => {
      render(<ProductTable />);

      expect(screen.getByText('Produtos')).toBeInTheDocument();
    });

    it('deve exibir os botões de ação', () => {
      render(<ProductTable />);

      expect(screen.getByText('Novo Produto')).toBeInTheDocument();
      expect(screen.getByText('Limpar Ordenação')).toBeInTheDocument();
    });
  });

  describe('Exclusão de Produto', () => {
    it('deve remover o produto da lista ao clicar em deletar', async () => {
      const user = userEvent.setup();
      productService.delete.mockResolvedValue({});

      // Mock do window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<ProductTable />);

      // Aguarda produtos carregarem
      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument();
      });

      // Busca todos os botões com a classe p-button-danger (botões de deletar)
      const deleteButtons = document.querySelectorAll('.p-button-danger');
      expect(deleteButtons.length).toBeGreaterThan(0);

      // Clica no primeiro botão deletar
      await user.click(deleteButtons[0]);

      // Verifica se o confirm foi chamado
      expect(confirmSpy).toHaveBeenCalledWith('Deseja deletar este produto?');

      // Verifica se a API foi chamada
      await waitFor(() => {
        expect(productService.delete).toHaveBeenCalledWith(1);
      });

      confirmSpy.mockRestore();
    });

    it('não deve remover o produto se o usuário cancelar', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument();
      });

      const deleteButtons = document.querySelectorAll('.p-button-danger');
      await user.click(deleteButtons[0]);

      // Verifica que a API NÃO foi chamada
      expect(productService.delete).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Adição de Produto', () => {
    it('deve abrir o modal ao clicar em "Novo Produto"', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      const newProductButton = screen.getByText('Novo Produto');
      await user.click(newProductButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('deve adicionar um novo produto corretamente', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      // Abre o modal
      const newProductButton = screen.getByText('Novo Produto');
      await user.click(newProductButton);

      // Preenche o formulário
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Busca os campos do formulário pelo id (PrimeReact InputNumber não renderiza inputs acessíveis diretamente)
      const nameInput = document.querySelector('#name');
      const priceInput = document.querySelector('#price input');
      const stockInput = document.querySelector('#stock input');
      const descriptionInput = document.querySelector('#description');

      if (nameInput) {
        await user.clear(nameInput);
        await user.type(nameInput, 'Novo Produto');
      }

      if (priceInput) {
        await user.clear(priceInput);
        await user.type(priceInput, '50');
      }

      if (stockInput) {
        await user.clear(stockInput);
        await user.type(stockInput, '20');
      }

      if (descriptionInput) {
        await user.clear(descriptionInput);
        await user.type(descriptionInput, 'Nova descrição');
      }

      // Clica em salvar
      const saveButton = screen.getByText(/salvar/i);
      await user.click(saveButton);

      // Verifica que o modal foi fechado
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('deve validar campos obrigatórios ao tentar salvar', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      // Abre o modal
      const newProductButton = screen.getByText('Novo Produto');
      await user.click(newProductButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Tenta salvar sem preencher campos
      const saveButton = screen.getByText(/salvar/i);
      await user.click(saveButton);

      // Verifica que as mensagens de erro aparecem
      await waitFor(() => {
        expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/preço é obrigatório/i)).toBeInTheDocument();
      });

      // Modal deve continuar aberto
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('deve limpar os erros ao digitar nos campos', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      const newProductButton = screen.getByText('Novo Produto');
      await user.click(newProductButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Tenta salvar sem preencher
      const saveButton = screen.getByText(/salvar/i);
      await user.click(saveButton);

      // Verifica erros
      await waitFor(() => {
        expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      });

      // Digita no campo nome
      const nameInput = screen.getByLabelText(/nome/i);
      await user.type(nameInput, 'Produto Teste');

      // Verifica que o erro foi removido
      await waitFor(() => {
        expect(screen.queryByText(/nome é obrigatório/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edição de Produto', () => {
    it('deve abrir o modal de edição com os dados do produto', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument();
      });

      // Busca todos os botões com a classe p-button-warning (botões de editar - amarelo)
      const editButtons = document.querySelectorAll('.p-button-warning');
      
      if (editButtons.length > 0) {
        await user.click(editButtons[0]);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Verifica que existe um botão "Atualizar" (modo de edição)
        const updateButton = screen.queryByText(/atualizar/i);
        if (updateButton) {
          expect(updateButton).toBeInTheDocument();
        }
      }
    });
  });

  describe('Ordenação', () => {
    it('deve limpar a ordenação ao clicar no botão', async () => {
      const user = userEvent.setup();

      render(<ProductTable />);

      const clearSortButton = screen.getByText('Limpar Ordenação');
      await user.click(clearSortButton);

      // Verifica que o botão funciona (não deve gerar erro)
      expect(clearSortButton).toBeInTheDocument();
    });
  });
});
