import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const user = JSON.parse(localStorage.getItem('vb_user') || 'null');
const token = localStorage.getItem('vb_token') || null;

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/auth/register', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/auth/login', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const getProfile = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/auth/me'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, isLoggedIn: !!token, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null; state.isLoggedIn = false;
      localStorage.removeItem('vb_token'); localStorage.removeItem('vb_user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => {
      state.loading = false; state.user = action.payload.user;
      state.token = action.payload.token; state.isLoggedIn = true;
      localStorage.setItem('vb_token', action.payload.token);
      localStorage.setItem('vb_user', JSON.stringify(action.payload.user));
    };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(registerUser.pending, pending).addCase(registerUser.fulfilled, fulfilled).addCase(registerUser.rejected, rejected)
      .addCase(loginUser.pending, pending).addCase(loginUser.fulfilled, fulfilled).addCase(loginUser.rejected, rejected)
      .addCase(getProfile.fulfilled, (state, action) => { state.user = action.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
