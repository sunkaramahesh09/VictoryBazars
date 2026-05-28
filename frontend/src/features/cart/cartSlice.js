import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('vb_cart') || '[]');

const calcTotals = (items) => ({
  itemCount: items.reduce((s, i) => s + i.quantity, 0),
  total: items.reduce((s, i) => s + i.price * i.quantity, 0),
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: saved, ...calcTotals(saved) },
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, price, images, unit, stock } = action.payload;
      const existing = state.items.find(i => i._id === _id);
      if (existing) {
        if (existing.quantity < stock) existing.quantity += 1;
      } else {
        state.items.push({ _id, name, price, image: images?.[0]?.url || '', unit, stock, quantity: 1 });
      }
      Object.assign(state, calcTotals(state.items));
      localStorage.setItem('vb_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      Object.assign(state, calcTotals(state.items));
      localStorage.setItem('vb_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) { if (quantity <= 0) state.items = state.items.filter(i => i._id !== id); else item.quantity = Math.min(quantity, item.stock); }
      Object.assign(state, calcTotals(state.items));
      localStorage.setItem('vb_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = []; state.itemCount = 0; state.total = 0;
      localStorage.removeItem('vb_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
