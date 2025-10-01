import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md mx-auto pr-20">
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full bg-gray-800 text-white rounded-full pl-12 pr-4 py-2 
                   border border-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-600 
                   placeholder-gray-400 transition duration-200"
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
