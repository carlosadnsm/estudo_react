import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/api';

const initialState = {
  items: [],
  status: 'idle', 
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await productService.getAll();
  return res.data;
});

export const addProduct = createAsyncThunk('products/add', async (data, { rejectWithValue }) => {
  try {
    const res = await productService.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao criar');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await productService.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao atualizar');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao deletar');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export default productsSlice.reducer;