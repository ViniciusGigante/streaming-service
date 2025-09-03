'use client';
import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  HomeIcon,    
  UserIcon,  
  BellIcon,
  StarIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setMenuOpen(false);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
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

      {isDesktop && (
        <div className="fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white flex flex-col items-center gap-8 p-4 border-r border-slate-900">
          <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Pesquisar')} />
          <HomeIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Home')} />
          <UserIcon className="w-6 h-6 cursor-pointer" onClick={() => router.push("perfil")} />
          <BellIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Notificações')} />
          <StarIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Favoritos')} />
          <ArrowRightOnRectangleIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Sair')} />
        </div>
      )}

      {!isDesktop && (
        <div
          className={`fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white z-50 flex flex-col p-4 gap-6
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            md:hidden
          `}
        >
          <button className="self-end text-2xl mb-4" onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          <div className="flex items-center gap-4 text-lg">
            <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Pesquisar')} />
            <span>Pesquisar</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <HomeIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Home')} />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <UserIcon className="w-6 h-6 cursor-pointer" onClick={() => router.push("perfil")} />
            <span>Perfil</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <BellIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Notificações')} />
            <span>Notificações</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <StarIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Favoritos')} />
            <span>Favoritos</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <ArrowRightOnRectangleIcon className="w-6 h-6 cursor-pointer" onClick={() => console.log('Sair')} />
            <button className="flex items-center">Sair</button>
          </div>
        </div>
      )}
    </>
  );
}
