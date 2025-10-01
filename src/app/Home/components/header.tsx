import Image from "next/image";
import SearchBar from "./searchBar"; 

export default function Header() {
  return (
    <header className=" md:flex w-full min-h-[10vh] bg-transparent text-white flex-row px-4 absolute top-0 left-0 z-20 items-center justify-start gap-6">
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
