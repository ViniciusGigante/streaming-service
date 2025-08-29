import Sidebar from "./components";

export default function HomePage() {
  return (
    <>
        <main className="flex">
          <Sidebar />
          <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
            <p>This is the main content area.</p>
          </div>
        </main>
    </>
  );
}
