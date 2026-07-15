import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const demoOrders = [
  { id: '#PM-9021', customer: 'John Doe', initials: 'JD', status: 'shipped', date: 'Oct 12, 2024', amount: '$312.50' },
  { id: '#PM-9022', customer: 'Mary Laurent', initials: 'ML', status: 'processing', date: 'Oct 12, 2024', amount: '$1,450.00' },
  { id: '#PM-9023', customer: 'Sophie Martin', initials: 'SM', status: 'delivered', date: 'Oct 11, 2024', amount: '$89.00' },
  { id: '#PM-9024', customer: 'Thomas Bernard', initials: 'TB', status: 'refunded', date: 'Oct 10, 2024', amount: '$540.20' },
  { id: '#PM-9025', customer: 'Alice Smith', initials: 'AP', status: 'shipped', date: 'Oct 10, 2024', amount: '$120.00' },
];

const demoListings = [
  { title: 'Casque sans fil Apex', price: '$299', stock: 12, status: 'active' },
  { title: 'Montre Chronos Skeleton', price: '$1,450', stock: 3, status: 'pending' },
  { title: 'Chaise ErgoForm Pro', price: '$890', stock: 0, status: 'paused' },
];

const statusColors = {
  shipped: 'bg-blue-50 text-blue-700',
  processing: 'bg-yellow-50 text-yellow-700',
  delivered: 'bg-green-50 text-green-700',
  refunded: 'bg-red-50 text-red-700',
  active: 'bg-green-50 text-green-700 border border-green-200',
  pending: 'bg-secondary-fixed/30 text-secondary-fixed-dim border border-secondary-fixed-dim/20',
  paused: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
};

const statusLabels = {
  shipped: 'Shipped',
  processing: 'Processing',
  delivered: 'Delivered',
  refunded: 'Refunded',
  active: 'Active',
  pending: 'Pending',
  paused: 'Paused',
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    if (!user) return navigate('/login');
  }, [user, navigate]);

  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { key: 'listings', icon: 'list_alt', label: 'My listings' },
    { key: 'orders', icon: 'receipt_long', label: 'Orders' },
    { key: 'analytics', icon: 'monitoring', label: 'Analytics' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-4 gap-2">
        <div className="px-2 py-6 mb-4">
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Seller Studio</h1>
          <p className="text-on-surface-variant font-label-md text-label-md mt-1">Seller portal</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left border-none cursor-pointer ${
                activeNav === item.key
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant bg-transparent'
              }`}
            >
              <span className="material-symbols-outlined" style={activeNav === item.key ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span className="font-label-md">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-1">
          <button className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold flex items-center justify-center gap-2 mb-4 hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer">
            <span className="material-symbols-outlined">add</span>
            New product
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md">Support</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-12 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Overview</h2>
            <span className="text-on-surface-variant bg-surface-container px-3 py-1 rounded-full text-label-sm font-label-sm">Active session</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
              <span className="absolute -top-1 -right-1 bg-secondary w-2 h-2 rounded-full"></span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="text-right">
                <p className="font-label-md text-label-md text-primary">{user?.name || 'Seller'}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">PREMIUM SELLER</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{user?.name?.charAt(0) || 'V'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-12 max-w-[1400px] mx-auto">
          {/* Metrics Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total sales', value: '$42,890', change: '+12.5%', up: true, icon: 'payments', bg: 'bg-secondary-fixed', color: 'text-on-secondary-fixed' },
              { label: 'Total orders', value: '1,248', change: '+5.2%', up: true, icon: 'shopping_bag', bg: 'bg-primary-fixed', color: 'text-on-primary-fixed' },
              { label: 'Store Views', value: '18.4K', change: '-2.1%', up: false, icon: 'visibility', bg: 'bg-tertiary-fixed', color: 'text-on-tertiary-fixed' },
            ].map(metric => (
              <div key={metric.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(15,23,42,0.05)] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 ${metric.bg} rounded-lg ${metric.color}`}>
                    <span className="material-symbols-outlined">{metric.icon}</span>
                  </div>
                  <span className={`font-label-md flex items-center gap-1 ${metric.up ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="material-symbols-outlined text-sm">{metric.up ? 'trending_up' : 'trending_down'}</span> {metric.change}
                  </span>
                </div>
                <p className="text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">{metric.label}</p>
                <h3 className="font-headline-lg text-headline-lg">{metric.value}</h3>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Listings Section */}
            <section className="lg:col-span-1 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h4 className="font-headline-sm text-headline-sm">Active listings</h4>
                <button className="text-secondary font-label-md hover:underline bg-transparent border-none cursor-pointer">View all</button>
              </div>
              <div className="flex flex-col gap-4">
                {demoListings.map((listing, i) => (
                  <div key={i} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline">inventory_2</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-label-md text-primary truncate">{listing.title}</h5>
                      <p className="text-on-surface-variant text-body-sm">{listing.price} • {listing.stock} in stock</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[listing.status]}`}>
                        {statusLabels[listing.status]}
                      </span>
                    </div>
                    <button className="material-symbols-outlined text-on-surface-variant bg-transparent border-none cursor-pointer">more_vert</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Orders Table */}
            <section className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h4 className="font-headline-sm text-headline-sm">Recent orders</h4>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-variant transition-all flex items-center gap-2 bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                  </button>
                  <button className="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-variant transition-all flex items-center gap-2 bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-sm">download</span> Export
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-[0px_2px_4px_rgba(15,23,42,0.05)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Order</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Customer</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Date</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {demoOrders.map(order => (
                      <tr key={order.id} className="hover:bg-surface-container transition-colors">
                        <td className="px-6 py-4 font-body-sm text-primary">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold">{order.initials}</div>
                            <span className="font-label-md text-primary">{order.customer}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-body-sm text-on-surface-variant">{order.date}</td>
                        <td className="px-6 py-4 text-right font-label-md text-primary">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <span className="text-label-sm text-on-surface-variant">Showing 5 of 48 orders</span>
                  <div className="flex gap-2">
                    <button className="p-2 border border-outline-variant rounded hover:bg-surface-variant transition-colors disabled:opacity-50 bg-transparent cursor-pointer" disabled>
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="p-2 border border-outline-variant rounded hover:bg-surface-variant transition-colors bg-transparent cursor-pointer">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-surface-container-highest border-t border-outline-variant mt-20">
          <div className="max-w-[1400px] mx-auto px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">ProMarket</h3>
              <p className="text-on-surface-variant font-label-sm text-label-sm">© 2024 ProMarket Global. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              {['Privacy policy', 'Terms of service', 'Security', 'Contact'].map(link => (
                <button key={link} className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors bg-transparent border-none cursor-pointer">{link}</button>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SellerDashboard;
