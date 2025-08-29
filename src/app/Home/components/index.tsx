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
    <div className="h-screen w-18 bg-gray-800 text-white p-4">
        <div className="flex flex-col  items-center space-y-6 gap-4">
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