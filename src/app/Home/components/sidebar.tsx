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

  const activeProfile =  localStorage.getItem('activeProfile');
  const profileId = activeProfile ? JSON.parse(activeProfile)._id : null;

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

  const Tooltip = ({ text }: { text: string }) => (
    <span className="absolute bottom-0 mb-8 w-max rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none">
      {text}
    </span>
  );

  const IconButton = ({ icon: Icon, text, onClick }: { icon: any; text: string; onClick?: () => void }) => (
    <div className="relative group flex flex-col items-center cursor-pointer" onClick={onClick}>
      <Icon className="w-6 h-6" />
      <Tooltip text={text} />
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
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

      {/* Desktop Sidebar */}
      {isDesktop && (
        <div className="fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white flex flex-col items-center gap-8 p-4 border-r border-slate-900">
          <IconButton icon={HomeIcon} text="Voltar ao início" onClick={() => router.push('/')} />
          <IconButton icon={UserIcon} text="Perfil" onClick={() => router.push(`perfil/${profileId}`)} />
          <IconButton icon={BellIcon} text="Notificações" onClick={() => console.log('Notificações')} />
          {/* <IconButton icon={StarIcon} text="Favoritos" onClick={() => console.log('Favoritos')} /> */}
          <IconButton icon={ArrowRightOnRectangleIcon} text="Sair" onClick={() => console.log('Sair')} />
        </div>
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <div
          className={`
            fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white z-50 flex flex-col p-4 gap-6
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            md:hidden
          `}
        >
          <button className="self-end text-2xl mb-4" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-lg">
              <IconButton icon={HomeIcon} text="Voltar ao início" onClick={() => router.push('/')} />
              <span>Início</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <IconButton icon={UserIcon} text="Perfil" onClick={() => router.push(`perfil/${profileId}`)} />
              <span>Perfil</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <IconButton icon={BellIcon} text="Notificações" onClick={() => console.log('Notificações')} />
              <span>Notificações</span>
            </div>
            {/* <div className="flex items-center gap-4 text-lg">
              <IconButton icon={StarIcon} text="Favoritos" onClick={() => console.log('Favoritos')} />
              <span>Favoritos</span>
            </div> */}
            <div className="flex items-center gap-4 text-lg">
              <IconButton icon={ArrowRightOnRectangleIcon} text="Sair" onClick={() => console.log('Sair')} />
              <span>Sair</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
