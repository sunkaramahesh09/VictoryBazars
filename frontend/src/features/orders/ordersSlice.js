import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const placeOrder = createAsyncThunk('orders/place', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/orders', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to place order'); }
});

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/orders/my'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllOrders = createAsyncThunk('orders/all', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/orders', { params }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try { const res = await API.put(`/orders/${id}/status`, { status }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const verifyPIN = createAsyncThunk('orders/verifyPIN', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/orders/verify-pin', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid PIN'); }
});

export const fetchOrderStats = createAsyncThunk('orders/stats', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/orders/stats'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { currentOrder: null, myOrders: [], adminOrders: [], stats: null, recentOrders: [], loading: false, error: null, pinResult: null },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; },
    clearPinResult: (state) => { state.pinResult = null; state.error = null; },
    addRealtimeOrder: (state, action) => { state.adminOrders.unshift(action.payload); },
    updateRealtimeStatus: (state, action) => {
      const { orderId, status } = action.payload;
      // Update in adminOrders
      const adminOrder = state.adminOrders.find(o => o._id === orderId);
      if (adminOrder) adminOrder.status = status;
      // Also update in myOrders so Redux stays in sync
      const myOrder = state.myOrders.find(o => o._id === orderId);
      if (myOrder) myOrder.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.loading = false;
        s.currentOrder = a.payload.order;
        // Add the new order to myOrders immediately so the customer
        // sees it right away without a separate fetchMyOrders call
        s.myOrders.unshift(a.payload.order);
      })
      .addCase(placeOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.myOrders = a.payload.orders; })
      .addCase(fetchAllOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.loading = false; s.adminOrders = a.payload.orders; })
      .addCase(fetchAllOrders.rejected, (s) => { s.loading = false; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const i = s.adminOrders.findIndex(o => o._id === a.payload.order._id);
        if (i !== -1) s.adminOrders[i] = a.payload.order;
      })
      .addCase(verifyPIN.pending, (s) => { s.loading = true; s.error = null; s.pinResult = null; })
      .addCase(verifyPIN.fulfilled, (s, a) => { s.loading = false; s.pinResult = a.payload; })
      .addCase(verifyPIN.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchOrderStats.fulfilled, (s, a) => { s.stats = a.payload.stats; s.recentOrders = a.payload.recentOrders; });
  },
});

export const { clearCurrentOrder, clearPinResult, addRealtimeOrder, updateRealtimeStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
