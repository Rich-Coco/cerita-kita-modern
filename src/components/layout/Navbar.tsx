
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Home, User, Coins, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({
  to,
  icon,
  label,
  isActive
}: NavItemProps) => {
  return <Link to={to} className={cn("flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Authentication state - check for user data in sessionStorage to determine if logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    // Check for login/signup status in session storage
    const userDataStr = sessionStorage.getItem('userData');
    if (userDataStr) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login/signup navigation
  const handleAuthNavigation = (type: 'login' | 'signup') => {
    if (type === 'login') {
      navigate('/auth', { state: { activeTab: 'login' } });
    } else {
      navigate('/auth', { state: { activeTab: 'signup' } });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [{
    to: '/',
    icon: <Home size={20} />,
    label: 'Beranda'
  }, {
    to: '/search',
    icon: <Search size={20} />,
    label: 'Temukan'
  }, {
    to: '/publish',
    icon: <BookOpen size={20} />,
    label: 'Terbitkan'
  }];

  return <header className={cn("sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-6", isScrolled ? "bg-black/70 backdrop-blur-lg border-b border-white/5" : "bg-transparent")}>
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight">CeritaKita</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />)}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/coins" className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-yellow-400">
                <Coins size={16} />
                <span className="font-medium">120</span>
              </Link>
              
              <Link to="/">
                <Avatar className="border-2 border-primary transition-all hover:border-accent hover:scale-105">
                  <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                  <AvatarFallback>BP</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={() => handleAuthNavigation('signup')} className="relative overflow-hidden group">
                <span className="relative z-10">Masuk</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          )}

          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden py-4 px-2 glass animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navItems.map(item => <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />)}
            
            {!isAuthenticated && <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                <Button onClick={() => handleAuthNavigation('login')} variant="outline">
                  Masuk
                </Button>
                <Button onClick={() => handleAuthNavigation('signup')}>
                  Daftar
                </Button>
              </div>}
          </nav>
        </div>}
    </header>;
};

export default Navbar;
