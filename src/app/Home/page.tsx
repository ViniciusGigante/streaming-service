import Sidebar from "./components/sidebar";
import Banner from "./components/banner";

export default function HomePage() {
  return (
    <>
       <main className="flex w-full min-h-screen bg-[#b8b8b8]">
  <Sidebar />
  <Banner />
</main>

    </>
  );
}
