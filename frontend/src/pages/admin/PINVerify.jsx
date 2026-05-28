import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPIN, clearPinResult } from '../../features/orders/ordersSlice';
import { fetchBranches } from '../../features/branches/branchesSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiKey, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PINVerify() {
  const dispatch = useDispatch();
  const { branches } = useSelector((s) => s.branches);
  const { loading, error, pinResult } = useSelector((s) => s.orders);
  const [pin, setPin] = useState(['', '', '', '']);
  const [branchId, setBranchId] = useState('');

  useEffect(() => {
    dispatch(fetchBranches());
    return () => dispatch(clearPinResult());
  }, [dispatch]);

  const handleDigit = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin]; next[i] = val;
    setPin(next);
    if (val && i < 3) document.getElementById(`pin-${i + 1}`)?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) document.getElementById(`pin-${i - 1}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const pinStr = pin.join('');
    if (pinStr.length !== 4) return toast.error('Enter complete 4-digit PIN');
    if (!branchId) return toast.error('Select branch');
    const res = await dispatch(verifyPIN({ pin: pinStr, branchId }));
    if (verifyPIN.fulfilled.match(res)) toast.success('✅ Order verified & completed!');
    else toast.error(error || 'Invalid PIN or order not ready');
  };

  const reset = () => { setPin(['', '', '', '']); dispatch(clearPinResult()); document.getElementById('pin-0')?.focus(); };

  return (
    <AdminLayout>
      <div className="animate-fade-in max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-black text-2xl text-gray-900">Verify Pickup PIN</h1>
          <p className="text-gray-500 text-sm">Enter customer's 4-digit PIN to verify and complete their pickup order.</p>
        </div>

        <div className="card p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <FiKey className="w-8 h-8 text-red-700" />
            </div>
          </div>

          {pinResult ? (
            <div className="text-center animate-slide-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-display font-bold text-2xl text-green-700 mb-2">Order Completed!</h2>
              <p className="text-gray-600 mb-2">{pinResult.order?.customerName} can collect their order.</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-1">
                <p><span className="text-gray-400">Order:</span> <span className="font-mono font-bold">{pinResult.order?.orderNumber}</span></p>
                <p><span className="text-gray-400">Items:</span> {pinResult.order?.items?.length}</p>
                <p><span className="text-gray-400">Total:</span> <span className="font-bold">₹{pinResult.order?.subtotal?.toFixed(2)}</span></p>
              </div>
              <button onClick={reset} className="btn-primary w-full justify-center">Verify Next Order</button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Select Branch *</label>
                <select value={branchId} onChange={(e) => setBranchId(e.target.value)} required className="input-field">
                  <option value="">-- Select your branch --</option>
                  {branches.map((b) => <option key={b._id} value={b._id}>{b.name} — {b.city}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter Customer's Pickup PIN</label>
                <div className="flex justify-center gap-4">
                  {pin.map((d, i) => (
                    <input key={i} id={`pin-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => handleDigit(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-16 h-20 text-center text-3xl font-black border-2 border-gray-200 rounded-xl focus:border-red-700 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-gray-50 focus:bg-white" />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                  <FiXCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading || pin.join('').length !== 4}
                className="btn-primary w-full justify-center py-4 text-base">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</span>
                ) : <><FiKey /> Verify & Complete Order</>}
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          <strong>Note:</strong> Only orders with status <span className="font-mono bg-blue-100 px-1 rounded">ready</span> can be verified. Ask the customer to show the 4-digit PIN from their order confirmation.
        </div>
      </div>
    </AdminLayout>
  );
}
