import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-surface-container-highest border-t border-outline-variant">
    <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="max-w-sm">
          <Link to="/" className="block mb-6 no-underline"><img src="/logo.png" alt="ProMarket" className="h-10 w-auto" /></Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">The go-to marketplace for verified professional assets, premium products, and enterprise-grade sourcing.</p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">language</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Marketplace</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/browse" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Browse All</Link></li>
              <li><Link to="/browse?tab=sellers" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Premium Sellers</Link></li>
              <li><Link to="/browse?sort=trending" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Trending</Link></li>
              <li><Link to="/browse?sort=newest" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Resources</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Help Center</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Sourcing Guide</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Partner Program</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Trust & Safety</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Company</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">About</Link></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Careers</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Press</a></li>
              <li><Link to="/contact" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">&copy; {new Date().getFullYear()} ProMarket Global. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Privacy Policy</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Terms of Service</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Trust & Safety</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
