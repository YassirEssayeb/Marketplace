import React from 'react';
import { Link } from 'react-router-dom';

const JoinAsSeller = () => {
  return (
    <main className="pt-20">
      {/* Hero Section with Bento Layout */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-16 md:py-24">
        <div className="grid grid-cols-12 gap-gutter">
          {/* Main CTA Area */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <span className="text-secondary font-label-md mb-4 tracking-widest uppercase">Seller program</span>
            <h1 className="font-display-lg text-display-lg md:text-[64px] leading-tight mb-6">Grow your enterprise sales with ProMarket</h1>
            <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">Join the elite network of professional sellers. Connect with global buyers, manage your leads easily and enjoy zero listing fees.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-label-md text-lg hover:shadow-xl transition-all active:scale-95 text-center no-underline">Start selling</Link>
              <button className="bg-surface-container-highest text-primary px-10 py-5 rounded-lg font-label-md text-lg hover:bg-surface-variant transition-all border-none cursor-pointer">Seller guide</button>
            </div>
          </div>
          {/* Visual Bento Column */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4 h-[500px]">
            <div className="col-span-2 rounded-xl bg-surface-container-high overflow-hidden shadow-sm border border-outline-variant relative group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDknKJlSjBFtnxA8S9cwusa9J5MBNlyIWA6HadU1hCX-BDZQNeaPIDzqCIU9-GYrLET-TeprN90qB6vol9sX7q7kpJBU9R0pSPrR8Oy6KbCpJosWcWjFFVnIBkTSf7Amr_wfQuqmDQnxR_hEB9QJwg9Bit7yxJdLnK4TtRBLFDB8ZQXivZk1haxRNZ_WUk_UNfmAPADB8k535k7kQyXZunN2blQeEDisCWV2lIfW7w4Cw3CQ71B" alt="Espace de travail professionnel" />
            </div>
            <div className="rounded-xl bg-surface-container overflow-hidden border border-outline-variant">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAW6ciPFWGyo9bGbAQ6FB_5Nld-OIm-SXtRlDXa5bUNPmHS38njrdMnsW6hrcnvGbSpm2Kp5s_ZbkHqNc8CvGxExXAwOChbmtd16MRZyWLZq8PysCITCusVRBqrdXDlaGEg7Xb2D7eJi1Q4jboSy7PIzf5U1v7c8sP47lGbjwqdfYBaGYi-CtU3ZD25rk2KqAEKtcenKjO-Exn7_NYQh0VFLo3eO3ZW5PTk-H8EMXMIjOcsxXC" alt="Professional equipment" />
            </div>
            <div className="rounded-xl bg-surface-container-low p-6 border border-outline-variant flex flex-col justify-end">
              <span className="text-headline-md font-black text-secondary">0%</span>
              <span className="text-body-sm font-label-sm text-on-surface-variant uppercase">Listing fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4">Why professional sellers choose us</h2>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'public', title: 'Connect with global enterprise buyers', desc: 'Instantly access a verified network of Fortune 500 procurement teams and high-growth tech companies.' },
              { icon: 'forum', title: 'Message-First Sales Flow', desc: 'Our intuitive communication platform streamlines negotiations, technical questions and closing deals directly.' },
              { icon: 'payments', title: 'Zero listing fees', desc: 'Maximize your margins. List your inventory with no upfront fees and only pay a small commission on sale.' },
            ].map((prop, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary-fixed text-secondary flex items-center justify-center rounded-lg mb-6">
                  <span className="material-symbols-outlined">{prop.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm mb-4">{prop.title}</h3>
                <p className="text-body-md text-on-surface-variant">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-container-max mx-auto px-margin-desktop">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="font-headline-lg text-headline-lg mb-8">From sign-up to payment in minutes</h2>
            <div className="space-y-8">
              {[
                { num: 1, title: 'Create your profile', desc: 'Set up your professional seller storefront. Showcase your expertise, verification badges and shipping capabilities.' },
                { num: 2, title: 'List your products', desc: 'Use our high-precision listing tools to upload detailed specifications and professional photographs.' },
                { num: 3, title: 'Negotiate and close', desc: 'Engage with interested buyers through our secure messaging system. Negotiate terms and finalize logistics.' },
              ].map(step => (
                <div key={step.num} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-secondary flex items-center justify-center font-bold text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">{step.num}</div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm mb-2">{step.title}</h4>
                    <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-fixed rounded-full blur-3xl opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
              <img className="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhLilP_eLaF4Asaoly0eb83bo5kvHgiF7WKqQs-zcotVrDE5CyxgwFjvoYKgr5ArOy5M5nlLLdp3obI7aIAO7MpqoDp5GVTy2ITpqEfCBadkehnMr_Jf4HLTXzgIH3_zD_dXZp18WGgZdUFFQoBRRIAZHEJ655pXnVeSnMUDjOM1ofcSYDhfbrIegBP_3vIcW6p-zGEIghJg7JKnoEbJgf-Kc9NYnjmFyJf6yN5PzKYU1bmOO8" alt="Tableau de bord vendeur" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-primary text-white py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary flex-shrink-0 bg-surface-container-high flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">MC</span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md italic mb-6 leading-relaxed">"ProMarket has transformed our business. We reached enterprise accounts we never could have targeted through traditional social media."</p>
              <div>
                <span className="block font-bold text-lg">Marcus Chen</span>
                <span className="block text-on-primary-container">Director, Peak Optic Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Gen Form */}
      <section className="py-24 bg-surface" id="start-selling">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-16 flex flex-col lg:flex-row gap-16 shadow-lg">
            <div className="lg:w-1/2">
              <h2 className="font-headline-lg text-headline-lg mb-4">Sell internationally</h2>
              <p className="text-body-lg text-on-surface-variant mb-8">Ready to elevate your marketplace presence? Fill out the form below and our onboarding specialist will contact you within 24 hours.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Verified seller status', 'Priority support', 'API access', 'Wholesale tools'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                    <span className="text-body-sm font-label-md">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <form className="lg:w-1/2 space-y-4" onSubmit={e => { e.preventDefault(); alert('Request received. Our team will contact you within 24h.'); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">First name</label>
                  <input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" placeholder="John" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">Last name</label>
                  <input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" placeholder="Doe" type="text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">Business email</label>
                <input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" placeholder="john@company.com" type="email" />
              </div>
              <div className="space-y-1">
                <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">Website</label>
                <input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" placeholder="www.yourcompany.com" type="text" />
              </div>
              <div className="space-y-1">
                <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">Inventory category</label>
                <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none appearance-none">
                  <option>Professional A/V</option>
                  <option>IT & Data Center</option>
                  <option>Industrial machinery</option>
                  <option>Scientific equipment</option>
                </select>
              </div>
              <button className="w-full bg-secondary text-white py-4 rounded-lg font-label-md text-lg hover:bg-secondary-container transition-all active:scale-95 mt-4 border-none cursor-pointer" type="submit">Submit request</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JoinAsSeller;
