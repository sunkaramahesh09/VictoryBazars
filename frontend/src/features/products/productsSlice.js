import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/products', { params }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await API.get(`/products/${id}`); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/products/categories'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAdminProducts = createAsyncThunk('products/fetchAdmin', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/products/admin/all', { params }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/products', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await API.put(`/products/${id}`, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try { await API.delete(`/products/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const uploadProductImages = createAsyncThunk('products/uploadImages', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await API.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { id, images: res.data.images };
  }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Upload failed'); }
});

export const deleteProductImage = createAsyncThunk('products/deleteImage', async ({ productId, publicId }, { rejectWithValue }) => {
  try {
    const res = await API.delete(`/products/${productId}/images/${encodeURIComponent(publicId)}`);
    return { productId, images: res.data.images };
  }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Delete failed'); }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [], selectedProduct: null, similarProducts: [],
    categories: [], adminProducts: [],
    loading: false, error: null,
    page: 1, pages: 1, total: 0,
    filters: { search: '', category: '', sort: '' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearSelected: (state) => { state.selectedProduct = null; state.similarProducts = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products; s.page = a.payload.page; s.pages = a.payload.pages; s.total = a.payload.total; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProductById.pending, (s) => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.selectedProduct = a.payload.product; s.similarProducts = a.payload.similar; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload.categories; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => { s.adminProducts = a.payload.products; s.total = a.payload.total; })
      .addCase(createProduct.fulfilled, (s, a) => { s.adminProducts.unshift(a.payload.product); })
      .addCase(updateProduct.fulfilled, (s, a) => { const i = s.adminProducts.findIndex(p => p._id === a.payload.product._id); if (i !== -1) s.adminProducts[i] = a.payload.product; })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.adminProducts = s.adminProducts.filter(p => p._id !== a.payload); })
      .addCase(uploadProductImages.fulfilled, (s, a) => {
        const i = s.adminProducts.findIndex(p => p._id === a.payload.id);
        if (i !== -1) s.adminProducts[i].images = a.payload.images;
      })
      .addCase(deleteProductImage.fulfilled, (s, a) => {
        const i = s.adminProducts.findIndex(p => p._id === a.payload.productId);
        if (i !== -1) s.adminProducts[i].images = a.payload.images;
      });
  },
});

export const { setFilters, clearSelected } = productsSlice.actions;
export default productsSlice.reducer;
