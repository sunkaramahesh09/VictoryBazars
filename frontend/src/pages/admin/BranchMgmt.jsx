import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches, createBranch, updateBranch, deleteBranch } from '../../features/branches/branchesSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', district: '', city: '', address: '', phone: '', timing: '9:00 AM – 9:00 PM', isActive: true };

export default function BranchMgmt() {
  const dispatch = useDispatch();
  const { branches, loading } = useSelector((s) => s.branches);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchBranches()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openEdit = (b) => {
    setForm({ name: b.name, district: b.district, city: b.city, address: b.address, phone: b.phone || '', timing: b.timing, isActive: b.isActive });
    setEditId(b._id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = editId ? await dispatch(updateBranch({ id: editId, data: form })) : await dispatch(createBranch(form));
    if (updateBranch.fulfilled.match(res) || createBranch.fulfilled.match(res)) {
      toast.success(editId ? 'Branch updated!' : 'Branch added!');
      setShowForm(false); setForm(EMPTY); setEditId(null);
    } else toast.error('Failed to save branch');
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete branch "${name}"?`)) return;
    const res = await dispatch(deleteBranch(id));
    if (deleteBranch.fulfilled.match(res)) toast.success('Branch deleted');
  };

  const filtered = branches.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">Branch Management</h1>
            <p className="text-gray-500 text-sm">{branches.length} branches across Andhra Pradesh</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} className="btn-primary py-2 text-sm">
            <FiPlus /> Add Branch
          </button>
        </div>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search branches..." className="input-field max-w-sm mb-5" />

        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display font-bold text-xl">{editId ? 'Edit Branch' : 'Add New Branch'}</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Rajahmundry Main" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">District *</label>
                    <input name="district" value={form.district} onChange={handleChange} required placeholder="e.g., East Godavari" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} required placeholder="e.g., Rajahmundry" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} required placeholder="Full street address" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Timing</label>
                    <input name="timing" value={form.timing} onChange={handleChange} placeholder="9:00 AM – 9:00 PM" className="input-field" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-red-700" />
                    <span className="text-sm font-medium text-gray-700">Active Branch</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center py-2.5 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center py-2.5 text-sm"><FiSave /> {editId ? 'Update' : 'Add'} Branch</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><FiMapPin className="w-4 h-4 text-red-700" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                    <p className="text-xs text-red-700">{b.city}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(b)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center"><FiEdit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(b._id, b.name)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"><FiTrash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{b.district}</p>
              <p className="text-xs text-gray-400 mb-2">{b.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{b.timing}</span>
                {b.isActive ? <span className="badge-green">Active</span> : <span className="badge-gray">Inactive</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
