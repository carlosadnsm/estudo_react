import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import {
  fetchProducts,
  addProduct as addProductThunk,
  updateProduct as updateProductThunk,
  deleteProduct as deleteProductThunk,
  selectProducts,
  selectProductsStatus,
} from '../features/products/productsSlice';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export default function ProductTable() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductsStatus);
  const loading = status === 'loading';

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: null, description: '', stock: 0 });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({ name: false, price: false });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" rounded outlined className="p-button-warning" onClick={() => handleEdit(rowData)} tooltip="Editar" tooltipPosition="top" />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData)} tooltip="Deletar" tooltipPosition="top" />
      </div>
    );
  };

  const handleEdit = (product) => {
    setEditingId(product.id ?? null);
    setNewProduct({
      name: product.name ?? '',
      price: product.price ?? null,
      description: product.description ?? '',
      stock: product.stock ?? 0,
    });
    setErrors({ name: false, price: false });
    setShowAddDialog(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm('Deseja deletar este produto?')) return;
    if (product?.id) dispatch(deleteProductThunk(product.id));
  };

  const handleAddProduct = () => {
    setErrors({ name: false, price: false });
    setShowAddDialog(true);
  };

  const priceBodyTemplate = (rowData) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.price);

  const descriptionBodyTemplate = (rowData) => (rowData.description ? rowData.description : '-');

  const stockBodyTemplate = (rowData) => rowData.stock ?? 0;

  const createdAtBodyTemplate = (rowData) => {
    if (!rowData.created_at) return '-';
    try {
      return new Date(rowData.created_at).toLocaleString('pt-BR');
    } catch {
      return rowData.created_at;
    }
  };

  useEffect(() => {
    if (!showAddDialog) setNewProduct({ name: '', price: null, description: '', stock: 0 });
  }, [showAddDialog]);

  const onNewProductChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && typeof value === 'string' && value.trim() !== '') setErrors((e) => ({ ...e, name: false }));
    if (field === 'price' && value != null && value >= 0) setErrors((e) => ({ ...e, price: false }));
  };

  const saveNewProduct = () => {
    const nameInvalid = !newProduct.name || (typeof newProduct.name === 'string' && newProduct.name.trim() === '');
    const priceInvalid = newProduct.price == null || newProduct.price < 0;
    if (nameInvalid || priceInvalid) {
      setErrors({ name: nameInvalid, price: priceInvalid });
      return;
    }

    if (editingId) {
      dispatch(
        updateProductThunk({
          id: editingId,
          data: {
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            stock: newProduct.stock ?? 0,
          },
        })
      );
      setEditingId(null);
      setShowAddDialog(false);
      return;
    }

    dispatch(
      addProductThunk({
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        stock: newProduct.stock ?? 0,
      })
    );
    setShowAddDialog(false);
  };

  const dialogFooter = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => { setShowAddDialog(false); setEditingId(null); }} />
      <Button label={editingId ? 'Atualizar' : 'Salvar'} icon={editingId ? 'pi pi-save' : 'pi pi-check'} className="p-button-primary" onClick={saveNewProduct} />
    </div>
  );

  return (
    <div className="card">
      <h2>Produtos</h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Button
          label="Limpar Ordenação"
          icon="pi pi-sort-alt"
          className="p-button-text"
          onClick={() => {
            setSortField(null);
            setSortOrder(null);
          }}
        />
        <Button label="Novo Produto" icon="pi pi-plus" className="p-button-success" onClick={handleAddProduct} />
      </div>

      <Dialog
        header={editingId ? 'Editar Produto' : 'Novo Produto'}
        visible={showAddDialog}
        style={{ width: '480px' }}
        modal
        onHide={() => setShowAddDialog(false)}
        footer={dialogFooter}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nome *</label>
            <InputText id="name" value={newProduct.name} onChange={(e) => onNewProductChange('name', e.target.value)} className={errors.name ? 'p-invalid' : ''} />
            {errors.name && <small className="p-error">Nome é obrigatório.</small>}
          </div>
          <div className="p-field">
            <label htmlFor="price">Preço *</label>
            <InputNumber
              id="price"
              value={newProduct.price}
              onValueChange={(e) => onNewProductChange('price', e.value)}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              className={errors.price ? 'p-invalid' : ''}
              min={0}
            />
            {errors.price && <small className="p-error">Preço é obrigatório e não pode ser negativo.</small>}
          </div>
          <div className="p-field">
            <label htmlFor="stock">Estoque</label>
            <InputNumber id="stock" value={newProduct.stock} onValueChange={(e) => onNewProductChange('stock', e.value)} />
          </div>
          <div className="p-field">
            <label htmlFor="description">Descrição</label>
            <InputTextarea id="description" value={newProduct.description} onChange={(e) => onNewProductChange('description', e.target.value)} rows={4} />
          </div>
        </div>
      </Dialog>

      <DataTable
        value={products}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        tableStyle={{ minWidth: '100%' }}
        emptyMessage="Nenhum produto encontrado."
        size="small"
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          setSortField(e.sortField || null);
          setSortOrder(typeof e.sortOrder === 'number' ? e.sortOrder : null);
        }}
      >
        <Column field="name" header="Nome" sortable />
        <Column field="price" header="Preço" body={priceBodyTemplate} sortable />
        <Column field="description" header="Descrição" body={descriptionBodyTemplate} bodyClassName="description-cell" />
        <Column field="stock" header="Estoque" body={stockBodyTemplate} sortable style={{ width: '120px' }} />
        <Column field="created_at" header="Criado em" body={createdAtBodyTemplate} sortable style={{ width: '180px' }} />
        <Column body={actionBodyTemplate} header="Ações" style={{ width: '120px' }} />
      </DataTable>
    </div>
  );
}