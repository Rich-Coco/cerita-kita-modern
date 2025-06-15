
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Home, User, Menu, X, LogOut, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
      <span className="md:inline">{label}</span>
    </Link>;
};

const Navbar = () => {
  // Force re-render of avatar when profile changes
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    profile,
    signOut
  } = useAuth();

  // Update avatar key when profile changes
  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarKey(Date.now());
    }
  }, [profile?.avatar_url]);

  const handleAuthNavigation = (type: 'login' | 'signup') => {
    if (type === 'login') {
      navigate('/auth', {
        state: {
          activeTab: 'login'
        }
      });
    } else {
      navigate('/auth', {
        state: {
          activeTab: 'signup'
        }
      });
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

  if (user) {
    navItems.push({
      to: '/profile',
      icon: <User size={20} />,
      label: 'Profil'
    });
  }

  return <header className={cn("sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-6", isScrolled ? "bg-black/70 backdrop-blur-lg border-b border-white/5" : "bg-transparent")}>
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img alt="Hunt Logo" className="h-12 w-12 text-primary object-cover" src="/lovable-uploads/5147552b-e69e-4cc2-ba04-add5d231fe04.png" />
            <span className="font-bold tracking-tight text-2xl text-left mx-[5px]">Hunt</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />)}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={profile?.avatar_url} 
                        alt={profile?.username || user.email} 
                        key={avatarKey}
                      />
                      <AvatarFallback>
                        {profile?.full_name ? profile.full_name.charAt(0) + (profile.full_name.split(' ')[1]?.charAt(0) || '') : user.email?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{profile?.full_name || 'Pengguna'}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {profile?.username ? `@${profile.username}` : user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" onClick={() => handleAuthNavigation('login')} className="px-4 py-2">
                Masuk
              </Button>
              <Button onClick={() => handleAuthNavigation('signup')} className="relative overflow-hidden group px-4 py-2">
                <span className="relative z-10">Daftar</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>}

          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && <div className="md:hidden py-4 px-2 glass animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navItems.map(item => <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} />)}
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              {user ? <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={profile?.avatar_url} 
                        alt={profile?.username || user.email} 
                        key={avatarKey}
                      />
                      <AvatarFallback>
                        {profile?.full_name ? profile.full_name.charAt(0) + (profile.full_name.split(' ')[1]?.charAt(0) || '') : user.email?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{profile?.full_name || 'Pengguna'}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {profile?.username ? `@${profile.username}` : user.email}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center justify-start px-4" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </> : <>
                  <Button onClick={() => handleAuthNavigation('login')} variant="outline">
                    Masuk
                  </Button>
                  <Button onClick={() => handleAuthNavigation('signup')}>
                    Daftar
                  </Button>
                </>}
            </div>
          </nav>
        </div>}
    </header>;
};

export default Navbar;
