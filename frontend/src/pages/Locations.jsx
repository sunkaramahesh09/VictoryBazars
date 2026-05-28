import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches, fetchDistricts } from '../features/branches/branchesSlice';
import { FiMapPin, FiPhone, FiClock, FiSearch } from 'react-icons/fi';

export default function Locations() {
  const dispatch = useDispatch();
  const { branches, districts, loading } = useSelector((s) => s.branches);
  const [search, setSearch] = useState('');
  const [activeDistrict, setActiveDistrict] = useState('');

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchDistricts());
  }, [dispatch]);

  const filtered = branches.filter((b) => {
    const matchDistrict = !activeDistrict || b.district === activeDistrict;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase()) || b.district.toLowerCase().includes(search.toLowerCase());
    return matchDistrict && matchSearch;
  });

  const grouped = filtered.reduce((acc, b) => {
    if (!acc[b.district]) acc[b.district] = [];
    acc[b.district].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container-custom py-10 text-center">
          <span className="text-red-200 text-sm font-semibold uppercase tracking-widest block mb-2">55+ Stores Across AP</span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3">Our Store Locations</h1>
          <p className="text-red-100 max-w-xl mx-auto">Find your nearest Victory Bazars in every major district of Andhra Pradesh</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, store name or district..." className="input-field pl-10" />
          </div>
          <select value={activeDistrict} onChange={(e) => setActiveDistrict(e.target.value)} className="input-field md:w-64">
            <option value="">All Districts</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[{ n: `${branches.length}+`, l: 'Total Stores' }, { n: `${districts.length}`, l: 'Districts Covered' }, { n: `${filtered.length}`, l: 'Showing Now' }].map(({ n, l }) => (
            <div key={l} className="card p-4 text-center">
              <p className="font-display font-black text-2xl md:text-3xl text-red-700">{n}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <div key={i} className="skeleton-shimmer h-36 rounded-2xl" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">📍</span>
            <h3 className="font-display font-bold text-xl mt-4 mb-2">No stores found</h3>
            <p className="text-gray-500">Try a different search or district</p>
          </div>
        ) : (
          Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([district, stores]) => (
            <div key={district} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-display font-bold text-lg text-gray-900">{district}</h2>
                <span className="badge-red">{stores.length} store{stores.length > 1 ? 's' : ''}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((branch) => (
                  <div key={branch._id} className="card p-5 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                        <p className="text-red-700 text-sm font-medium">{branch.city}</p>
                      </div>
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" title="Open" />
                    </div>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p className="flex items-start gap-2">
                        <FiMapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{branch.address}
                      </p>
                      {branch.phone && (
                        <a href={`tel:${branch.phone}`} className="flex items-center gap-2 hover:text-red-700 transition-colors">
                          <FiPhone className="w-4 h-4 text-red-400 shrink-0" />{branch.phone}
                        </a>
                      )}
                      <p className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-red-400 shrink-0" />{branch.timing}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
