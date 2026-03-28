import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Home, User, Menu, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to} className={cn("flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
      {icon}
      <span className="md:inline">{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Beranda' },
    { to: '/search', icon: <Search size={20} />, label: 'Temukan' },
    { to: '/publish', icon: <BookOpen size={20} />, label: 'Terbitkan' },
    { to: '/profile', icon: <User size={20} />, label: 'Profil' },
  ];

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-6", isScrolled ? "bg-black/70 backdrop-blur-lg border-b border-white/5" : "bg-transparent")}>
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img alt="Ngomik Logo" className="h-12 w-12 text-primary object-cover" src="/lovable-uploads/5147552b-e69e-4cc2-ba04-add5d231fe04.png" />
            <span className="font-bold tracking-tight text-2xl text-left mx-0">Ngomik</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />
            ))}
          </nav>
        </div>

        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4 px-2 glass animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
