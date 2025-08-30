'use client';
import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  HomeIcon,    
  UserIcon,  
  BellIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';

const menuItems = [
  { icon: MagnifyingGlassIcon, label: 'Pesquisar' },
  { icon: HomeIcon, label: 'Home' },
  { icon: UserIcon, label: 'Perfil' },
  { icon: BellIcon, label: 'Notificações' },
  { icon: StarIcon, label: 'Favoritos' },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    
      <div
        className={`
          fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 md:hidden z-50 border-b border-slate-900
          transition-colors duration-500 ease-in-out
          ${scrolled ? 'bg-transparent' : 'bg-gray-800'}
        `}
      >
     
        <Image
          src="/cineverse-logo.svg"
          width={270}
          height={90}
          alt="Cineverse Logo"
        />

       
        <button onClick={() => setMenuOpen(true)} className="text-white text-2xl font-bold mr-10">
          ☰
        </button>
      </div>

    
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white flex-col items-center gap-8 p-4 border-r border-slate-900">
        {menuItems.map(({ icon: Icon }, idx) => (
          <Icon key={idx} className="w-6 h-6" />
        ))}
      </div>

     
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white z-50 flex flex-col p-4 gap-6
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
      
        <button className="self-end text-2xl mb-4" onClick={() => setMenuOpen(false)}>
          ✕
        </button>

        {menuItems.map(({ icon: Icon, label }, idx) => (
          <div key={idx} className="flex items-center gap-4 text-lg">
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
