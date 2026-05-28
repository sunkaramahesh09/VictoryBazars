import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminProducts, createProduct, updateProduct, deleteProduct,
  uploadProductImages, deleteProductImage,
} from '../../features/products/productsSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUploadCloud, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Groceries', 'Dairy & Eggs', 'Beverages', 'Snacks & Namkeen',
  'Personal Care', 'Home Care', 'Baby Products', 'Bakery & Sweets',
  'Frozen Foods', 'Gifting', 'Fresh Fruits & Vegetables', 'Staples',
];

const EMPTY = {
  name: '', description: '', category: '', price: '', mrp: '',
  stock: '', unit: 'piece', isFeatured: false, isActive: true,
};

/* ─── Image Upload Panel ──────────────────────────────────────────────────── */
function ImagePanel({ productId, existingImages, onImagesUpdated }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [previews, setPreviews] = useState([]);   // { file, objectUrl }
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const addFiles = useCallback((files) => {
    const valid = [...files].filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length < files.length) toast.error('Some files skipped (not image or >5 MB)');
    const entries = valid.map(f => ({ file: f, objectUrl: URL.createObjectURL(f) }));
    setPreviews(p => [...p, ...entries]);
  }, []);

  const removePreview = (idx) => {
    setPreviews(p => {
      URL.revokeObjectURL(p[idx].objectUrl);
      return p.filter((_, i) => i !== idx);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!previews.length) return;
    setUploading(true);
    const fd = new FormData();
    previews.forEach(p => fd.append('images', p.file));
    const res = await dispatch(uploadProductImages({ id: productId, formData: fd }));
    if (uploadProductImages.fulfilled.match(res)) {
      toast.success(`${previews.length} image(s) uploaded!`);
      previews.forEach(p => URL.revokeObjectURL(p.objectUrl));
      setPreviews([]);
      onImagesUpdated(res.payload.images);
    } else {
      toast.error(res.payload || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDeleteExisting = async (publicId) => {
    if (!confirm('Remove this image from the product?')) return;
    setDeletingId(publicId);
    const res = await dispatch(deleteProductImage({ productId, publicId }));
    if (deleteProductImage.fulfilled.match(res)) {
      toast.success('Image removed');
      onImagesUpdated(res.payload.images);
    } else {
      toast.error(res.payload || 'Failed to remove');
    }
    setDeletingId(null);
  };

  return (
    <div className="sm:col-span-2 space-y-4">
      <label className="block text-sm font-medium text-gray-700">Product Images</label>

      {/* Existing images */}
      {existingImages?.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Uploaded images</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.public_id || img.url} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img.public_id)}
                  disabled={deletingId === img.public_id}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  {deletingId === img.public_id
                    ? <span className="text-xs animate-pulse">Removing…</span>
                    : <FiTrash2 className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragOver ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-gray-50'}`}
      >
        <FiUploadCloud className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-red-600">Click to browse</span> or drag & drop images here
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5 MB each · up to 5 images</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* New image previews */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Ready to upload</p>
          <div className="flex flex-wrap gap-3">
            {previews.map((p, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-red-200 shadow-sm">
                <img src={p.objectUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 btn-primary py-2 text-sm"
          >
            {uploading
              ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />Uploading…</>
              : <><FiUploadCloud className="w-4 h-4" /> Upload {previews.length} Image{previews.length > 1 ? 's' : ''} to Cloudinary</>}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function ProductsMgmt() {
  const dispatch = useDispatch();
  const { adminProducts, loading } = useSelector((s) => s.products);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [currentImages, setCurrentImages] = useState([]);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchAdminProducts()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setForm(EMPTY); setEditId(null); setCurrentImages([]); setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, category: p.category,
      price: p.price, mrp: p.mrp, stock: p.stock, unit: p.unit,
      isFeatured: p.isFeatured, isActive: p.isActive,
    });
    setCurrentImages(p.images || []);
    setEditId(p._id);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setForm(EMPTY); setEditId(null); setCurrentImages([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock) };
    const res = editId
      ? await dispatch(updateProduct({ id: editId, data }))
      : await dispatch(createProduct(data));

    if (updateProduct.fulfilled.match(res) || createProduct.fulfilled.match(res)) {
      const savedId = res.payload.product._id;
      toast.success(editId ? 'Product updated!' : 'Product created! You can now add images below.');
      if (!editId) {
        // After create — stay open in edit mode so user can upload images
        setEditId(savedId);
        setCurrentImages(res.payload.product.images || []);
      } else {
        closeForm();
      }
    } else {
      toast.error(res.payload || 'Failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(res)) toast.success('Product deleted');
    else toast.error('Failed to delete');
  };

  const filtered = adminProducts.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm">{adminProducts.length} products in catalogue</p>
          </div>
          <button onClick={openAdd} className="btn-primary py-2 text-sm">
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="input-field max-w-sm"
          />
        </div>

        {/* ── Form Modal ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-up">
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="font-display font-bold text-xl text-gray-900">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={closeForm} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      placeholder="e.g., Aashirvaad Atta 10kg" className="input-field" />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} required className="input-field">
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                    <input name="unit" value={form.unit} onChange={handleChange}
                      placeholder="e.g., 1 kg, 500 ml" className="input-field" />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Selling Price (₹) *</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange}
                      required min="0" placeholder="0" className="input-field" />
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">MRP (₹) *</label>
                    <input name="mrp" type="number" value={form.mrp} onChange={handleChange}
                      required min="0" placeholder="0" className="input-field" />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity *</label>
                    <input name="stock" type="number" value={form.stock} onChange={handleChange}
                      required min="0" placeholder="0" className="input-field" />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                        className="w-4 h-4 accent-red-700" />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
                        className="w-4 h-4 accent-red-700" />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      rows={3} placeholder="Product description…" className="input-field resize-none" />
                  </div>

                  {/* ── Image Panel (only shown when product already has an _id) ── */}
                  {editId ? (
                    <ImagePanel
                      productId={editId}
                      existingImages={currentImages}
                      onImagesUpdated={setCurrentImages}
                    />
                  ) : (
                    <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 flex items-center gap-3 text-gray-400">
                      <FiImage className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">Save the product first, then you can upload images.</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeForm} className="btn-outline flex-1 justify-center py-2.5 text-sm">
                    {editId ? 'Done' : 'Cancel'}
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                    {saving
                      ? 'Saving…'
                      : <><FiSave /> {editId ? 'Update' : 'Create'} Product</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Products Table ── */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Product', 'Category', 'Price', 'MRP', 'Stock', 'Images', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      {/* Product name + thumb */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0]?.url ? (
                            <img src={p.images[0].url} alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                              <FiImage className="w-4 h-4 text-red-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="badge-red">{p.category}</span></td>
                      <td className="px-4 py-3 font-bold text-gray-900">₹{p.price}</td>
                      <td className="px-4 py-3 text-gray-500 line-through">₹{p.mrp}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-sm ${p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-orange-500' : 'text-green-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      {/* Image count badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                          ${p.images?.length ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                          <FiImage className="w-3 h-3" />
                          {p.images?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {p.isActive ? <span className="badge-green">Active</span> : <span className="badge-gray">Inactive</span>}
                          {p.isFeatured && <span className="badge bg-yellow-100 text-yellow-700">Featured</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)}
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                            title="Edit product & manage images">
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p._id, p.name)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Delete product">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
