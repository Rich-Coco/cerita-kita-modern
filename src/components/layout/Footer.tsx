import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-black border-t border-white/5 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img alt="Hunt Logo" src="/lovable-uploads/bcc00d43-2cf1-4768-9f93-45bf4e058eb7.png" className="h-12 w-12 text-primary object-fill" />
              <span className="font-bold text-xl tracking-tight">Hunt</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Platform modern untuk membaca dan menerbitkan cerita dalam Bahasa Indonesia.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Jelajahi</h4>
              <ul className="space-y-2">
                <li><Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">Temukan Cerita</Link></li>
                <li><Link to="/genres" className="text-muted-foreground hover:text-foreground transition-colors">Kategori</Link></li>
                <li><Link to="/authors" className="text-muted-foreground hover:text-foreground transition-colors">Penulis</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Pengguna</h4>
              <ul className="space-y-2">
                <li><Link to="/publish" className="text-muted-foreground hover:text-foreground transition-colors">Terbitkan Cerita</Link></li>
                <li><Link to="/coins" className="text-muted-foreground hover:text-foreground transition-colors">Beli Koin</Link></li>
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Bantuan</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Lainnya</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">Tentang Kami</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hunt. Hak Cipta Dilindungi.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Dibuat dengan <Heart size={14} className="text-red-500" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;