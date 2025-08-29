import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full min-h-[10vh] bg-transparent text-white flex flex-col px-4  absolute top-0 left-0 z-20 items-center justify-start ">
    <Image
              src="/cineverse-logo.svg"
              width={300}
              height={100}
              alt="Cineverse Logo"
            />

<div className="w-3/4 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-auto rounded-full"
    style={{ height: '1px' }}
></div>



    </header>
  );
}
