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
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Beranda' },
    { to: '/search', icon: <Search size={20} />, label: 'Temukan' },
    { to: '/publish', icon: <BookOpen size={20} />, label: 'Terbitkan' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-6 bg-black/70 backdrop-blur-lg border-b border-white/5">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <img alt="Hunt Logo" className="h-12 w-12 text-primary object-cover" src="/lovable-uploads/5147552b-e69e-4cc2-ba04-add5d231fe04.png" />
            <span className="font-bold tracking-tight text-2xl text-left mx-[5px]">Hunt</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <a key={item.to} href={item.to} className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-secondary">
                {item.icon}
                <span className="md:inline">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {/* Auth buttons removed */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
