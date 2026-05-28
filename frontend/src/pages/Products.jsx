import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../features/products/productsSlice';
import ProductCard from '../components/products/ProductCard';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Category tiles — paste your CDN image URL into the `img` field for each category.
// Leave img as null to show a placeholder until you have the image.
const CATEGORY_TILES = [
  { name: 'Dairy & Eggs', slug: 'Dairy & Eggs', bg: '#dbeafe', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779731604/Slice-2_10_1_ubobr5.avif' },
  { name: 'Fruits & Vegetables', slug: 'Fresh Fruits & Vegetables', bg: '#dcfce7', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779731724/Slice-3_9_1_uhxj6p.avif' },
  { name: 'Cold Drinks & Juices', slug: 'Cold Drinks & Juices', bg: '#dbeafe', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779731797/Slice-4_9_1_mc6l65.avif' },
  { name: 'Snacks & Munchies', slug: 'Snacks & Munchies', bg: '#fef9c3', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951736/Slice-5_4_2_tr6mqv.jpg' },
  { name: 'Breakfast & Instant Food', slug: 'Breakfast & Instant Food', bg: '#fff7ed', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779952462/Slice-6_5_1_x2t9xn.jpg' },
  { name: 'Bakery & Sweets', slug: 'Bakery & Sweets', bg: '#fef3c7', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951803/Slice-8_4_1_oknaux.jpg' },
  { name: 'Stationery & Books', slug: 'Stationery & Books', bg: '#fce7f3', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779953186/b5cfc944-9611-4f08-b4f9-a071d07b1aad_ooyz3i.jpg' },
  { name: 'Staples', slug: 'Staples', bg: '#fdf4e7', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951560/Slice-10_1_imhpk9.jpg' },
  { name: 'Tea, Coffee & More', slug: 'Beverages', bg: '#fdf6ec', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951653/Slice-7-1_0_1_eqelgr.jpg' },
  { name: 'Masala & Oils', slug: 'Masala & Oils', bg: '#fff3e0', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732701/Slice-11_dii24s.jpg' },
  { name: 'Fragrance', slug: 'Fragrance', bg: '#e0f2fe', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779953062/543ccb3a-df06-4d10-a6ab-ef0f33240667_mm6xht.jpg' },
  { name: 'Baby Care', slug: 'Baby Care', bg: '#f3e8ff', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732606/Slice-15_yo4qrd.jpg' },
  { name: 'Pharmacy', slug: 'Pharmacy', bg: '#dcfce7', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732523/Slice-16_zsjija.jpg' },
  { name: 'Cleaning Essentials', slug: 'Cleaning Essentials', bg: '#e0f7fa', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732455/Slice-17_1_dg18fe.jpg' },
  { name: 'Home Care', slug: 'Home Care', bg: '#fdf2fb', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732364/Slice-18_1_sc4vux.jpg' },
  { name: 'Personal Care', slug: 'Personal Care', bg: '#fff1f2', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779732056/Slice-191-ezgif.com-crop_wwvrre.avif' },
  { name: 'Pet Care', slug: 'Pet Care', bg: '#f0fdf4', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779731924/Slice-20_1_1_xdteou.avif' },
  { name: 'Gifting', slug: 'Gifting', bg: '#fff0f5', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951266/Website_Old_Blogs_Revised_Thumbnails_-_Copy_t4frx6.webp' },
  { name: 'Sauces & Spreads', slug: 'Sauces & Spreads', bg: '#fffbeb', img: 'https://res.cloudinary.com/ddn1qjenm/image/upload/v1779951938/Slice-12_sbsxsd.jpg' },
];


const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
];

/* ── Horizontal scrollable row per category (Blinkit style) ── */
function CategoryRow({ category, products, onSeeAll }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 500, behavior: 'smooth' });

  return (
    <section className="mb-7">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h2 className="text-[15px] sm:text-[17px] font-bold text-gray-900">{category}</h2>
        <button
          onClick={() => onSeeAll(category)}
          className="text-[12px] sm:text-[13px] font-semibold text-[#0c831f] hover:underline"
        >
          see all
        </button>
      </div>

      <div className="relative group/row">
        {/* Left arrow — desktop only */}
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow items-center justify-center hidden md:group-hover/row:flex transition-all"
        >
          <FiChevronLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Scrollable card row */}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((p) => (
            <div key={p._id} className="flex-shrink-0 w-[140px] sm:w-[155px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Right arrow — desktop only */}
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow items-center justify-center hidden md:group-hover/row:flex transition-all"
        >
          <FiChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </section>
  );
}

/* ── Category Strip — responsive: 2-row scroll on mobile, full-spread on desktop ── */
function CategoryStrip({ tiles, activeCategory, onSelect }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── TILE renderer (shared) ── */
  const Tile = ({ tile, size = 'md' }) => {
    const isActive = activeCategory === tile.slug;
    const boxSz = size === 'lg' ? 'w-[90px] h-[90px]' : 'w-[68px] h-[68px]';
    const textSz = size === 'lg' ? 'text-[12px]' : 'text-[11px]';
    return (
      <button
        onClick={() => onSelect(tile.slug)}
        className="flex flex-col items-center gap-1.5 group transition-all"
        style={size === 'md' ? { width: '80px' } : {}}
      >
        <div
          className={`${boxSz} rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-200 ${isActive ? 'ring-2 ring-[#0c831f] ring-offset-1 shadow-md' : 'hover:shadow-md'
            }`}
          style={{ background: tile.bg }}
        >
          {tile.img ? (
            <img
              src={tile.img}
              alt={tile.name}
              className="w-full h-full object-contain object-bottom p-1 group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            /* Placeholder: subtle shopping bag icon until img URL is added */
            <svg className="w-[50%] h-[50%] opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          )}
        </div>
        <span
          className={`${textSz} font-semibold text-center leading-tight w-full px-0.5 ${isActive ? 'text-[#0c831f]' : 'text-gray-700'
            }`}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.6em' }}
        >
          {tile.name}
        </span>
      </button>
    );
  };

  /* DESKTOP — 2 flex rows, each tile flex-1 to fill width evenly */
  if (isDesktop) {
    const half = Math.ceil(tiles.length / 2);
    const row1 = tiles.slice(0, half);
    const row2 = tiles.slice(half);
    return (
      <div className="px-4 lg:px-8 py-3 max-w-7xl mx-auto">
        <div className="flex mb-1">
          {row1.map(t => (
            <div key={t.name} className="flex-1 flex justify-center">
              <Tile tile={t} size="lg" />
            </div>
          ))}
        </div>
        <div className="flex">
          {row2.map(t => (
            <div key={t.name} className="flex-1 flex justify-center">
              <Tile tile={t} size="lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* MOBILE — 2-row CSS grid, horizontal scroll */
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(2, auto)',
        gridAutoFlow: 'column',
        gridAutoColumns: '80px',
        overflowX: 'auto',
        columnGap: '2px',
        rowGap: '4px',
        padding: '10px 10px 12px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {tiles.map(t => <Tile key={t.name} tile={t} size="md" />)}
    </div>
  );
}

/* ── Main Page ── */
export default function Products() {
  const dispatch = useDispatch();
  const { products, categories, loading, total, pages } = useSelector((s) => s.products);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRefs = useRef({});
  const catStripRef = useRef(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const loadProducts = useCallback(() => {
    const params = { page: currentPage, limit: viewMode === 'browse' ? 200 : 20 };
    if (search) params.search = search;
    if (activeCategory) params.category = activeCategory;
    if (sort) params.sort = sort;
    dispatch(fetchProducts(params));
  }, [dispatch, search, activeCategory, sort, currentPage, viewMode]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    const t = setTimeout(() => { setCurrentPage(1); loadProducts(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const grouped = products.reduce((acc, p) => {
    const cat = p.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const handleCategoryClick = (cat) => {
    const next = cat === activeCategory ? '' : cat;
    setActiveCategory(next);
    setCurrentPage(1);
    if (next && viewMode === 'browse') {
      setTimeout(() => {
        sectionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  const handleSeeAll = (cat) => {
    setActiveCategory(cat);
    setViewMode('grid');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => { setSearch(''); setActiveCategory(''); setSort(''); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky search bar — mobile-first ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[56px] sm:top-[64px] z-20 shadow-sm">
        <div className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2 flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search products...'
              className="w-full border border-gray-200 rounded-xl pl-8 pr-7 py-2 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort — hidden label on mobile, just a short select */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
            className="border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-600 bg-gray-50 focus:outline-none focus:border-green-500 transition-all cursor-pointer max-w-[90px] sm:max-w-none"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle — tiny pills */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {['browse', 'grid'].map((m) => (
              <button
                key={m}
                onClick={() => { setViewMode(m); if (m === 'browse') setActiveCategory(''); }}
                className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${viewMode === m ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category strip ── */}
      <div className="bg-white border-b border-gray-100" ref={catStripRef}>
        <CategoryStrip tiles={CATEGORY_TILES} activeCategory={activeCategory} onSelect={handleCategoryClick} />
      </div>


      {/* ── Content ── */}
      <div className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto py-4">

        {/* Active filter chip */}
        {(search || activeCategory) && (
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-2 flex-wrap">
            {total > 0 ? `${products.length} of ${total} products` : 'No products found'}
            {activeCategory && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                {activeCategory}
                <button onClick={() => setActiveCategory('')}><FiX className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-red-500 font-medium hover:underline">Clear</button>
          </p>
        )}

        {/* ── Skeleton — only on FIRST load (no products yet) ── */}
        {loading && products.length === 0 && (
          <div className="space-y-7">
            {[1, 2].map((s) => (
              <div key={s}>
                <div className="skeleton-shimmer h-4 w-32 rounded mb-3" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[140px] sm:w-[155px]">
                      <div className="skeleton-shimmer rounded-xl" style={{ aspectRatio: '1/1' }} />
                      <div className="mt-2 space-y-1.5 px-1">
                        <div className="skeleton-shimmer h-2.5 w-2/3 rounded" />
                        <div className="skeleton-shimmer h-3 w-full rounded" />
                        <div className="skeleton-shimmer h-6 w-full rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl">🔍</span>
            <h3 className="font-bold text-base mt-3 mb-1 text-gray-800">No Products Found</h3>
            <p className="text-sm text-gray-400 mb-4">Try a different search or clear filters</p>
            <button onClick={clearFilters} className="bg-[#0c831f] hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* ── BROWSE: Blinkit-style category rows ── */}
        {/* While re-fetching, fade existing products instead of blanking the page */}
        {products.length > 0 && viewMode === 'browse' && (
          <div style={{ opacity: loading ? 0.45 : 1, transition: 'opacity 0.2s ease' }}>
            {Object.keys(grouped).map((cat) => (
              <div key={cat} ref={(el) => (sectionRefs.current[cat] = el)}>
                <CategoryRow category={cat} products={grouped[cat]} onSeeAll={handleSeeAll} />
              </div>
            ))}
          </div>
        )}

        {/* ── GRID: 2 cols mobile, 3 sm, 4 md, 5 lg, 6 xl ── */}
        {products.length > 0 && viewMode === 'grid' && (
          <div style={{ opacity: loading ? 0.45 : 1, transition: 'opacity 0.2s ease' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8 pb-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  <FiChevronLeft className="w-3.5 h-3.5" />
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${currentPage === i + 1 ? 'bg-[#0c831f] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
                  disabled={currentPage === pages}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  <FiChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
