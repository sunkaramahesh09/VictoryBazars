import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchBranches = createAsyncThunk('branches/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/branches', { params }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchDistricts = createAsyncThunk('branches/districts', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/branches/districts'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createBranch = createAsyncThunk('branches/create', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/branches', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateBranch = createAsyncThunk('branches/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await API.put(`/branches/${id}`, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteBranch = createAsyncThunk('branches/delete', async (id, { rejectWithValue }) => {
  try { await API.delete(`/branches/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const branchesSlice = createSlice({
  name: 'branches',
  initialState: { branches: [], districts: [], selectedBranch: null, loading: false, error: null },
  reducers: { setSelectedBranch: (state, action) => { state.selectedBranch = action.payload; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (s) => { s.loading = true; })
      .addCase(fetchBranches.fulfilled, (s, a) => { s.loading = false; s.branches = a.payload.branches; })
      .addCase(fetchBranches.rejected, (s) => { s.loading = false; })
      .addCase(fetchDistricts.fulfilled, (s, a) => { s.districts = a.payload.districts; })
      .addCase(createBranch.fulfilled, (s, a) => { s.branches.push(a.payload.branch); })
      .addCase(updateBranch.fulfilled, (s, a) => {
        const i = s.branches.findIndex(b => b._id === a.payload.branch._id);
        if (i !== -1) s.branches[i] = a.payload.branch;
      })
      .addCase(deleteBranch.fulfilled, (s, a) => { s.branches = s.branches.filter(b => b._id !== a.payload); });
  },
});

export const { setSelectedBranch } = branchesSlice.actions;
export default branchesSlice.reducer;
