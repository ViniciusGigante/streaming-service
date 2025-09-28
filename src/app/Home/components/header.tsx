import Image from "next/image";
import SearchBar from "./searchBar";

export default function Header() {
  return (
    <header className="hidden md:flex w-full min-h-[10vh] bg-transparent text-white flex-col px-4 absolute top-0 left-0 z-20 items-center justify-start">
  <Image
    src="/cineverse-logo.svg"
    width={300}
    height={100}
    alt="Cineverse Logo"
  />
  <SearchBar/>
</header>

  );
}
