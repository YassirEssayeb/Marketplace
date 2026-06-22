import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdDetail from './pages/AdDetail';
import CreateAd from './pages/CreateAd';
import EditAd from './pages/EditAd';
import MyAds from './pages/MyAds';
import MyFavorites from './pages/MyFavorites';
import Messaging from './pages/Messaging';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
        <ToastProvider>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/ads/new" element={<CreateAd />} />
            <Route path="/ads/:id/edit" element={<EditAd />} />
            <Route path="/ads/:id" element={<AdDetail />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/favorites" element={<MyFavorites />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
