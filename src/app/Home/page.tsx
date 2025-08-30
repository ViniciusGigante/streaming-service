import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Banner from "./components/banner";
import CardMovie from "./components/cardFilme";

export default function HomePage() {
  return (
    <>
       <main className="flex w-full min-h-screen bg-[#b8b8b8]">
  <Sidebar />
  <section className="h-[600px] min-h-[100vh] relative w-full bg-[#1E1E1E] text-white  "
    style={{padding: '20px',backgroundImage: "url('/background-home.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",}}
    >
  <Header />
  <Banner/>

    <div></div>
  
</section>
</main>

    </>
  );
}
