import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Banner from "./components/banner";
import CardMovie from "./components/cardFilme";

export default function HomePage() {
  return (
    <>
       <main className=" w-full min-h-screen bg-[#b8b8b8]">
  <Sidebar />
  <section 
    className="min-h-screen relative flex-1 bg-[#1E1E1E] text-white md:ml-20 md:pt-0"
    style={{
      padding: "20px",
      backgroundImage: "url('/background-home.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <Header />
    <Banner />

    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl">
        <div className="flex flex-wrap justify-center">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardMovie key={index} />
          ))}
        </div>
      </div>
    </div>
  </section>
</main>


    </>
  );
}
