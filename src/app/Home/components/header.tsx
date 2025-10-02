import Image from "next/image";
import SearchBar from "./searchBar"; 

export default function Header() {
  return (
    <header className="hidden md:flex fixed top-0 left-20 w-full min-h-[10vh]  text-white flex-row px-4 z-20 items-center justify-start gap-6 bg-gray-900">

      <Image
        src="/cineverse-logo.svg"
        width={300}
        height={100}
        alt="Cineverse Logo"
      />
      <div className="flex-1">
        <SearchBar />
      </div>
    </header>
  );
}
