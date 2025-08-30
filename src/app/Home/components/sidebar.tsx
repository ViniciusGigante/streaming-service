'use client';
import { 
  MagnifyingGlassIcon, 
  HomeIcon,    
  UserIcon,  
  BellIcon,
  StarIcon 
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Sidebar() {
  return (
  <>
    <div className="fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white p-4 border-r border-slate-900">
  <div className="flex flex-col items-center gap-8">
    <Image 
      src="/logo-inicial.png" 
      alt="Logo"
      height={98}
      width={98}
    />
    <MagnifyingGlassIcon className="w-6 h-6 text-white" />
    <HomeIcon className="w-6 h-6 text-white" />
    <UserIcon className="w-6 h-6 text-white" />
    <BellIcon className="w-6 h-6 text-white" />
    <StarIcon className="w-6 h-6 text-white" />
  </div>
</div>

  </>
)}