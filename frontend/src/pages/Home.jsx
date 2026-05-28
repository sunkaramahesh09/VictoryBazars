import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchBranches } from "../features/branches/branchesSlice";
import ProductCard from "../components/products/ProductCard";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiAward,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { siteMetrics } from "../data/siteMetrics";

// 👇 Paste your new Cloudinary banner URLs here after uploading
const SLIDES = [
  { img: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779903739/ChatGPT_Image_May_27_2026_11_10_58_PM_cbdb05.png", ctaLink: "/products" },
  { img: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779903987/ChatGPT_Image_May_27_2026_11_16_20_PM_yzrlwi.png", ctaLink: "/products" },
  { img: "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779904110/ChatGPT_Image_May_27_2026_11_18_18_PM_tuiwnc.png", ctaLink: "/products" },
];

// Red SVG line-art icons – each returns an inline SVG string
const CATEGORIES = [
  {
    name: "Groceries", slug: "Groceries",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="20" width="48" height="36" rx="3"/><path d="M8 28h48M22 20v-6a10 10 0 0120 0v6"/><circle cx="24" cy="40" r="3"/><circle cx="40" cy="40" r="3"/></svg>`
  },
  {
    name: "Dairy", slug: "Dairy & Eggs",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20 10h24l4 12H16L20 10z"/><rect x="14" y="22" width="36" height="32" rx="4"/><path d="M26 34c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14 34h36"/></svg>`
  },
  {
    name: "Beverages", slug: "Beverages",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M18 12h28l-4 40H22L18 12z"/><path d="M46 20h6l-2 16h-4"/><path d="M18 24h28"/></svg>`
  },
  {
    name: "Snacks", slug: "Snacks & Munchies",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h8l4-8 4 8h4l4-8 4 8h8v4H12v-4z"/><rect x="10" y="30" width="44" height="24" rx="3"/><path d="M22 42h20M22 36h20"/></svg>`
  },
  {
    name: "Cleaning", slug: "Cleaning Essentials",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M26 10h12v8l6 10v26H20V28l6-10V10z"/><path d="M20 34h24"/><circle cx="32" cy="46" r="4"/><path d="M30 10h4"/></svg>`
  },
  {
    name: "Personal", slug: "Personal Care",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="14" width="20" height="36" rx="6"/><path d="M28 14V10h8v4"/><path d="M32 30v8"/><circle cx="32" cy="26" r="3"/></svg>`
  },
  {
    name: "Home Care", slug: "Home Care",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M8 32L32 10l24 22"/><path d="M16 32v20h12V38h8v14h12V32"/></svg>`
  },
  {
    name: "Baby", slug: "Baby Care",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="12"/><path d="M20 38c0 0-6 4-6 12h36c0-8-6-12-6-12"/><path d="M28 20h1m6 0h1"/><path d="M28 26c1 2 6 2 8 0"/></svg>`
  },
  {
    name: "Fresh", slug: "Fresh Fruits & Vegetables",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="36" r="16"/><path d="M32 20V8"/><path d="M32 8c0 0 8-4 12 4"/><path d="M32 8c0 0-8-4-12 4"/></svg>`
  },
  {
    name: "Bakery", slug: "Bakery & Sweets",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="34" width="44" height="20" rx="3"/><path d="M16 34c0-8 6-16 16-16s16 8 16 16"/><path d="M10 42h44"/><path d="M32 18v-8"/></svg>`
  },
  {
    name: "Frozen", slug: "Frozen Foods",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M32 8v48M8 32h48"/><path d="M16 16l32 32M48 16L16 48"/><circle cx="32" cy="32" r="6"/></svg>`
  },
  {
    name: "Gifting", slug: "Gifting",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="26" width="44" height="30" rx="2"/><rect x="8" y="18" width="48" height="10" rx="2"/><path d="M32 18v38"/><path d="M32 18c0 0-8-10 0-10s8 10 8 10"/><path d="M32 18c0 0 8-10 0-10s-8 10-8 10"/></svg>`
  },
  {
    name: "Staples", slug: "Staples",
    svg: `<svg viewBox="0 0 64 64" fill="none" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M28 52V28"/><path d="M20 36l8-8 8 8"/><ellipse cx="28" cy="22" rx="10" ry="14" transform="rotate(-15 28 22)"/></svg>`
  },
];

const {
  skuRange,
  stores,
  years,
  dailyCustomers,
  storeCountPhrase,
  pickupStorePhrase,
} = siteMetrics;

const STATS = [
  { number: skuRange, label: "SKU Range" },
  { number: stores, label: "Stores" },
  { number: years, label: "Trusted Since 2001" },
  { number: dailyCustomers, label: "Daily Customers" },
];

const WHY_US = [
  {
    icon: FiAward,
    title: "Quality Guaranteed",
    desc: "Every product sourced from verified suppliers. Freshness and quality you can count on.",
  },
  {
    icon: FiStar,
    title: "Best Prices Daily",
    desc: "Competitive prices, daily offers and combo deals that save you more every visit.",
  },
  {
    icon: FiShoppingBag,
    title: "Easy Pickup",
    desc: `Order online, get a 4-digit PIN, and pickup at any of our ${pickupStorePhrase}.`,
  },
  {
    icon: FiUsers,
    title: `Serving ${dailyCustomers} Daily`,
    desc: "Trusted by thousands of families daily. 25 years of community-first service.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Rajahmundry",
    rating: 5,
    text: "Victory Bazars is my go-to supermarket. Great quality, best prices, and the staff is always friendly. The new online pickup is super convenient!",
  },
  {
    name: "Ravi Kumar",
    city: "Vijayawada",
    rating: 5,
    text: "Shopping here for 10+ years. The fresh produce section is unbeatable, and prices are much better than other supermarkets in the city.",
  },
  {
    name: "Anitha Reddy",
    city: "Kakinada",
    rating: 5,
    text: "The variety they stock is amazing — from everyday essentials to gifts. The online ordering system with PIN pickup is a great innovation!",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Heights match 16:9 image ratio per breakpoint.
  // object-top ensures logo + headline at top are always visible.
  return (
    <div className="relative w-full overflow-hidden h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
      {/* Slides — crossfade with opacity */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.img}
            alt={`Victory Bazars Banner ${i + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
      >
        <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>
      {/* Next */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
      >
        <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const { branches } = useSelector((s) => s.branches);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchBranches());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Category Icon Strip — red SVG line-art, mobile-first */}
      <div className="bg-white border-b-2 border-red-600">
        <div className="px-2 sm:container-custom">
          <div
            className="flex overflow-x-auto py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-3 sm:px-5 group"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform duration-200"
                  dangerouslySetInnerHTML={{ __html: cat.svg }}
                />
                <span className="text-[10px] sm:text-[11px] font-semibold text-red-700 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <section className="section py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-3">Who We Are</h2>
            <p className="text-red-700 font-display font-bold text-2xl mb-4">
              Victory Bazars
            </p>
            <div className="w-12 h-1 bg-red-700 rounded-full mx-auto mb-6" />
            <p className="text-gray-500 leading-relaxed mb-6">
              Since 2001, Victory Bazars has been a trusted and customer-centric
              supermarket brand, serving families with quality products, fair
              pricing, and consistent value for over two decades.
            </p>
            <blockquote className="border-l-4 border-red-700 bg-gray-50 px-6 py-4 rounded-r-xl text-left">
              <p className="text-gray-700 font-medium">
                To provide high-quality products at fair prices and deliver a
                smooth, modern supermarket shopping experience for every
                customer.
              </p>
            </blockquote>
            <p className="text-gray-500 mt-6 leading-relaxed text-sm">
              We offer a comprehensive range of products under one roof,
              including{" "}
              <strong>
                fresh groceries, daily essentials, beverages, bakery items,
                frozen foods, home care, personal care, baby products, gifting
                items, and toys.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="container-custom">
          <p className="text-center text-red-200 font-medium mb-8 text-sm uppercase tracking-widest">
            Victory Bazars at a Glance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ number, label }) => (
              <div key={label}>
                <p className="font-display font-black text-5xl md:text-6xl text-white mb-1">
                  {number}
                </p>
                <p className="text-red-200 text-sm font-medium uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-subtitle">Fresh & Popular</span>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link
              to="/products"
              className="btn-outline text-sm py-2 hidden sm:flex"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton-shimmer h-48 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton-shimmer h-4 w-2/3 rounded" />
                    <div className="skeleton-shimmer h-3 w-full rounded" />
                    <div className="skeleton-shimmer h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-primary">
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Everyday Shopping Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=700&q=80"
                alt="Victory Bazars Store Aisle"
                className="w-full h-80 object-cover"
              />
            </div>
            <div>
              <span className="section-subtitle">Our Promise</span>
              <h2 className="section-title mb-4">
                Everyday Shopping,
                <br />
                Made Easy at
                <br />
                <span className="text-red-700">Victory Bazars</span>
              </h2>
              <div className="w-12 h-1 bg-red-700 rounded-full mb-6" />
              <ul className="space-y-3">
                {[
                  "Fresh Stock Everyday",
                  "Best Prices & Daily Offers",
                  "Quality You'll Come Back For",
                  "18,000+ Products Under One Roof",
                  "55+ Stores Across Andhra Pradesh",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-red-700 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-primary mt-8">
                Learn More <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Order Online & Pickup Section */}
      <section className="py-16 bg-red-700">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-red-200 font-semibold text-sm uppercase tracking-widest block mb-2">
                New Feature
              </span>
              <h2 className="font-display font-black text-4xl text-white mb-4">
                Order Online &<br />
                Pickup In Store
              </h2>
              <p className="text-red-100 leading-relaxed mb-8">
                Browse our full catalogue online, add items to your cart, select
                your nearest branch, and place the order. We'll prepare it and
                give you a{" "}
                <strong className="text-white">4-digit pickup PIN</strong>. Walk
                in, show your PIN, and walk out!
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    step: "1",
                    icon: "🛍️",
                    title: "Browse & Add",
                    desc: "Shop from 18K+ products online",
                  },
                  {
                    step: "2",
                    icon: "📍",
                    title: "Choose Store",
                    desc: "Pick your nearest branch",
                  },
                  {
                    step: "3",
                    icon: "🔢",
                    title: "Get PIN",
                    desc: "Receive your 4-digit pickup PIN",
                  },
                  {
                    step: "4",
                    icon: "✅",
                    title: "Pickup",
                    desc: "Walk in and collect your order",
                  },
                ].map(({ step, icon, title, desc }) => (
                  <div
                    key={step}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white"
                  >
                    <span className="text-2xl">{icon}</span>
                    <p className="font-bold mt-2 mb-0.5">{title}</p>
                    <p className="text-red-100 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/products"
                className="mt-8 bg-white text-red-700 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors inline-flex items-center gap-2"
              >
                Start Shopping <FiArrowRight />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=700&q=80"
                alt="Supermarket Shopping"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-subtitle">Why Us</span>
            <h2 className="section-title">Why Choose Victory Bazars?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card p-6 text-center group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-red-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Banner */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container-custom text-center">
          <h2 className="section-title mb-3">{storeCountPhrase}</h2>
          <p className="text-gray-500 mb-6">
            Find a Victory Bazars near you in every major district.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              "Konaseema",
              "East Godavari",
              "West Godavari",
              "Vijayawada",
              "Guntur",
              "Visakhapatnam",
              "Nellore",
              "Tirupati",
              "Kurnool",
              "Kadapa",
            ].map((d) => (
              <span key={d} className="badge-red px-3 py-1 text-sm">
                {d}
              </span>
            ))}
            <span className="badge-gray px-3 py-1 text-sm">& More...</span>
          </div>
          <Link to="/locations" className="btn-primary">
            <FiMapPin /> Find Your Nearest Store
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-subtitle">Customer Love</span>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, rating, text }) => (
              <div key={name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {name}
                    </p>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      {city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Where Quality Meets Value" */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 mb-2">
                "Where Quality
                <br />
                Meets Value."
              </h2>
              <p className="text-gray-500 font-medium mb-2">— Victory Bazars</p>
              <div className="w-10 h-1 bg-red-700 rounded-full mb-6" />
              <ul className="space-y-3">
                {[
                  "Fresh Stock Everyday",
                  "Best Prices & Daily Offers",
                  "Quality You'll Come Back For",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-700 font-medium"
                  >
                    <span className="w-2.5 h-2.5 bg-red-700 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=700&q=80"
                alt="Supermarket Shelves"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919256265626?text=Hello%20Victory%20Bazars!%20I%20need%20assistance."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-btn"
      >
        <FaWhatsapp className="w-5 h-5" />
        Order on WhatsApp
      </a>
    </div>
  );
}
