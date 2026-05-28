import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success('Message sent! We\'ll respond within 24 hours.', { duration: 5000 });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero py-12">
        <div className="container-custom text-center">
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3">Contact Us</h1>
          <p className="text-red-100 max-w-xl mx-auto">We're here to help. Reach out to us via any of the channels below.</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Head Office</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <FiMapPin className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Victory Bazars Pvt Ltd</p>
                    <p className="text-gray-500 text-sm">8-452/2, CRC Road, Ravulapalem – 533238</p>
                    <p className="text-gray-500 text-sm">Dr. B.R. Ambedkar Konaseema District, AP</p>
                  </div>
                </div>
                <a href="tel:+919256265626" className="flex gap-3 items-center text-gray-600 hover:text-red-700 transition-colors">
                  <FiPhone className="w-5 h-5 text-red-700 shrink-0" />
                  <span className="text-sm font-medium">+91 9256265626</span>
                </a>
                <a href="mailto:victorybazarscustomercare@gmail.com" className="flex gap-3 items-start text-gray-600 hover:text-red-700 transition-colors">
                  <FiMail className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                  <span className="text-sm break-all">victorybazarscustomercare@gmail.com</span>
                </a>
                <div className="flex gap-3 items-center text-gray-600">
                  <FiClock className="w-5 h-5 text-red-700 shrink-0" />
                  <span className="text-sm">10:00 AM – 5:00 PM (Mon–Sat)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/919256265626?text=Hello%20Victory%20Bazars!%20I%20need%20assistance." target="_blank" rel="noreferrer"
              className="card p-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group block">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Chat on WhatsApp</p>
                <p className="text-sm text-gray-500">Quick response — usually within minutes</p>
              </div>
            </a>

            {/* Store Hours */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3">Store Hours</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Saturday', time: '9:00 AM – 9:00 PM' },
                  { day: 'Sunday', time: '9:00 AM – 8:00 PM' },
                  { day: 'Public Holidays', time: '10:00 AM – 7:00 PM' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-medium text-gray-900">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="your@email.com" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                      <option value="">Select a topic</option>
                      <option>Product Inquiry</option>
                      <option>Order Support</option>
                      <option>Store Feedback</option>
                      <option>Business Partnership</option>
                      <option>Careers</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                    placeholder="Write your message here..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3.5">
                  {sending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</span>
                  ) : <><FiSend /> Send Message</>}
                </button>
              </form>
            </div>

            {/* Map embed placeholder */}
            <div className="card overflow-hidden mt-6 h-64">
              <iframe
                title="Victory Bazars Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.123456789!2d81.8255!3d16.7683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37b0000000000%3A0x0!2zMTbCsDQ2JzA2LjAiTiA4McKwNDknMzEuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
