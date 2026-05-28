import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from '../features/branches/branchesSlice';
import API from '../api/axios';
import { FiBriefcase, FiUpload, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const POSITIONS = ['Store Manager', 'Assistant Manager', 'Cashier', 'Sales Associate', 'Inventory Staff', 'Security Guard', 'Housekeeping', 'Delivery Staff', 'IT Support', 'Accountant', 'HR Executive'];

const PERKS = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Market-rate compensation with performance bonuses' },
  { icon: '📈', title: 'Career Growth', desc: 'Internal promotions and skill development programs' },
  { icon: '🏥', title: 'Health Benefits', desc: 'Medical coverage for you and your family' },
  { icon: '🤝', title: 'Great Culture', desc: 'Supportive team environment across all 55+ stores' },
];

export default function Careers() {
  const dispatch = useDispatch();
  const { branches } = useSelector((s) => s.branches);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', branchPreference: '', coverLetter: '' });
  const [resume, setResume] = useState(null);

  useEffect(() => { dispatch(fetchBranches()); }, [dispatch]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (resume) fd.append('resume', resume);
      await API.post('/careers/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="card p-10 text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display font-black text-2xl text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">Thank you for applying to Victory Bazars. Our HR team will review your application and contact you within 5–7 working days.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary w-full justify-center">Apply for Another Position</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero py-12">
        <div className="container-custom text-center">
          <span className="text-red-200 text-sm font-semibold uppercase tracking-widest block mb-2">Join Our Team</span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3">Careers at Victory Bazars</h1>
          <p className="text-red-100 max-w-xl mx-auto">Be part of Andhra Pradesh's fastest-growing supermarket chain. 55+ stores, 1000+ employees, endless opportunities.</p>
        </div>
      </div>

      {/* Perks */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="section-subtitle">Why Join Us</span>
            <h2 className="section-title">Life at Victory Bazars</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 text-center">
                <span className="text-4xl mb-3 block">{icon}</span>
                <h3 className="font-display font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center">
                <FiBriefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-gray-900">Apply Now</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="your@email.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Position Applied For *</label>
                  <select name="position" value={form.position} onChange={handleChange} required className="input-field">
                    <option value="">Select position</option>
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Store Location</label>
                <select name="branchPreference" value={form.branchPreference} onChange={handleChange} className="input-field">
                  <option value="">Any location (open to all)</option>
                  {branches.map((b) => <option key={b._id} value={b._id}>{b.name} — {b.city}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Resume (PDF/DOC, max 5MB)</label>
                <div className="relative">
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all">
                    <FiUpload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">{resume ? resume.name : 'Click to upload resume'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter / Why should we hire you?</label>
                <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={5}
                  placeholder="Tell us about yourself, your experience, and why you'd be a great fit for Victory Bazars..."
                  className="input-field resize-none" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</span>
                ) : <><FiSend /> Submit Application</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
