import React from 'react';

const About = () => (
  <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
    <div className="max-w-3xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">About</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Who are we?</p>

      <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-6">
        <p className="font-body-md text-on-surface leading-relaxed">
          ProMarket is an online classifieds platform that allows users to post, search, and trade across a variety of listings: jobs, real estate, vehicles, fashion, home, multimedia, leisure, and services.
        </p>
        <p className="font-body-md text-on-surface leading-relaxed">
          Our mission is to facilitate exchanges between individuals and professionals in a simple, fast, and secure environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">verified</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Verified sellers</h3>
            <p className="font-body-sm text-on-surface-variant">Every seller is certified to guarantee quality.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">shield</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Safe transactions</h3>
            <p className="font-body-sm text-on-surface-variant">Trade with confidence thanks to our secure system.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">public</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">100% free</h3>
            <p className="font-body-sm text-on-surface-variant">Post your listings for free, with no hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default About;
