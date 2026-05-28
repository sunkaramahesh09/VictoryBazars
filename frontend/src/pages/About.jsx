import { FiAward, FiUsers, FiStar, FiMapPin } from "react-icons/fi";
import { siteMetrics } from "../data/siteMetrics";

// ─── Cloudinary image placeholders ──────────────────────────────────────────
// Replace these URLs with your real Cloudinary URLs when ready
const IMAGES = {
  // Chairman / founder photo (Goluguri Venkatareddy)
  chairman:
    "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779299245/chairmanvb_xhyyj2.webp",
  // Store inauguration / brand photo (lady with Victory logo)
  storeLaunch:
    "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779299446/Gemini_Generated_Image_yjy8z3yjy8z3yjy8_jknp2z.webp",
  // "Who We Are" section store interior
  storeInterior:
    "https://res.cloudinary.com/ddn1qjenm/image/upload/v1779299553/ChatGPT-Image-Dec-16-2025-10_21_57-AM_ademhp.webp",
};

// CloudinaryImg — shows a branded red gradient if the URL is not yet live
function CloudinaryImg({ src, alt, className, style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        // If the cloudinary URL is not live yet, show a red branded placeholder
        e.currentTarget.style.cssText =
          "background:linear-gradient(135deg,#b91c1c,#7f1d1d);display:block;width:100%;height:100%;";
        e.currentTarget.src = "";
        e.currentTarget.alt = "";
      }}
    />
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div className="page-hero py-16">
        <div className="container-custom text-center">
          <span className="text-red-200 text-sm font-semibold uppercase tracking-widest block mb-3">
            Est. 2001
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            About Victory Bazars
          </h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            "Where Quality Meets Value" — A story of trust, service, and
            community since 2001.
          </p>
        </div>
      </div>

      {/* ── Who We Are ── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-subtitle">Our Story</span>
              <h2 className="section-title mb-4">Victory Bazars</h2>
              <div className="w-12 h-1 bg-red-700 rounded-full mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4">
                Victory Bazars is a trusted neighborhood supermarket serving
                customers since 2001. We are committed to providing fresh
                groceries, quality products, and daily essentials at affordable
                prices, all under one roof.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                From fresh fruits and vegetables to packaged foods and household
                needs, we ensure a clean store environment, friendly service,
                and a pleasant shopping experience for every customer.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since 2001, Victory Bazars has been a symbol of trust and
                quality in grocery retail. We focus on fresh stock, best prices,
                and a convenient shopping experience for families and businesses
                alike.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our goal is simple – deliver value, maintain quality, and build
                long-term customer trust.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl h-96 bg-gray-100">
              <CloudinaryImg
                src={IMAGES.storeInterior}
                alt="Victory Bazars Store Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-red-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: siteMetrics.skuRange, l: "SKU Range", icon: FiStar },
              { n: siteMetrics.stores, l: "Stores Across AP", icon: FiMapPin },
              { n: "Since 2001", l: "Serving Customers", icon: FiAward },
              {
                n: siteMetrics.dailyCustomers,
                l: "Daily Customers",
                icon: FiUsers,
              },
            ].map(({ n, l, icon: Icon }) => (
              <div key={l} className="text-white">
                <Icon className="w-6 h-6 text-red-300 mx-auto mb-2" />
                <p className="font-display font-black text-4xl mb-1">{n}</p>
                <p className="text-red-200 text-sm font-medium uppercase tracking-wide">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chairman Quote ── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Chairman Photo */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-96 bg-gray-100 flex-shrink-0">
              <CloudinaryImg
                src={IMAGES.chairman}
                alt="Goluguri Venkatareddy – Chairman, Victory Bazars"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Quote */}
            <div>
              <blockquote className="text-2xl md:text-3xl font-display font-semibold text-gray-700 italic leading-relaxed mb-6">
                "At Victory Bazars, we are committed to providing fresh quality
                products, honest pricing, and a pleasant shopping experience for
                every customer, every day."
              </blockquote>
              <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                Goluguri Venkatareddy &mdash; Chairman
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Values / Philosophy ── */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left — text rows */}
            <div className="space-y-8">
              {/* Mission Statement */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-3">
                  Mission Statement
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  At Victory Bazars, our mission is to provide fresh,
                  high-quality products at affordable prices while delivering a
                  reliable and pleasant shopping experience. We are committed to
                  maintaining trust, value, and customer satisfaction in
                  everything we do.
                </p>
              </div>

              {/* Core Values */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-3">
                  Our Core Values
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Victory Bazars is driven by strong values of quality,
                  integrity, and customer care. We are committed to serving our
                  community with reliable products, transparent pricing, and a
                  pleasant shopping experience.
                </p>
              </div>

              {/* Philosophy */}
              <div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-3">
                  Our Philosophy
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Our philosophy at Victory Bazars is rooted in quality,
                  affordability, and community trust. We aim to serve our
                  customers with care, freshness, and commitment every day.
                </p>
              </div>
            </div>

            {/* Right — store launch photo */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-[420px] bg-gray-100 sticky top-24">
              <CloudinaryImg
                src={IMAGES.storeLaunch}
                alt="Victory Bazars Store Launch"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Footer Info ── */}
      <section className="py-14 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display font-black text-2xl text-gray-900 mb-4 uppercase tracking-wide">
                Victory Bazars Pvt Ltd
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {siteMetrics.aboutStoreSentence}
              </p>
              <p className="text-gray-500 leading-relaxed mt-3">
                {siteMetrics.aboutDailySentence}
              </p>
              <p className="text-gray-500 leading-relaxed mt-3">
                {siteMetrics.aboutSkuSentence}
              </p>
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-4">
                Head Office
              </h3>
              <address className="not-italic text-gray-500 leading-relaxed space-y-1">
                <p>Victory Bazars Pvt Ltd</p>
                <p>Ravulapalem, Dr. B.R. Ambedkar Konaseema District</p>
                <p>Andhra Pradesh, India</p>
              </address>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
