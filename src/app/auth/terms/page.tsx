'use client'

import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function TermsPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 text-white"
      style={{
        backgroundImage: "url('/background-home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl w-full space-y-8 p-10 bg-[rgba(245,245,245,0.06)] backdrop-blur-md rounded-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Terms of Use – Cineverse
        </h1>
        <p className="mb-10 text-center text-gray-300">
          Welcome to Cineverse! By creating an account and using our services, you agree to the following terms:
        </p>

        <div className="space-y-6">
          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">1. About Cineverse</h2>
            <p>
              Cineverse is a free streaming platform that allows users to watch movies and series online, as well as receive personalized recommendations based on their preferences.
            </p>
          </section>

          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">2. Access Rules</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-300">
              <li>The minimum age to create an account is 14 years.</li>
              <li>Users under 18 must use kids profiles, which automatically block +18 content.</li>
              <li>Each account is personal and non-transferable.</li>
            </ul>
          </section>

          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">3. User Data</h2>
            <p>
              To use Cineverse, users must provide personal information such as name, email, password, and phone number. The processing of this data is detailed in our Privacy Policy.
            </p>
          </section>

          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">4. Responsibilities</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-300">
              <li>Cineverse does not authorize redistribution, copying, or commercial use of displayed content.</li>
              <li>Users are responsible for the accuracy of registered data and the security of their accounts.</li>
              <li>The platform may experience occasional instabilities without guarantee of continuous availability.</li>
            </ul>
          </section>

          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">5. Account Termination</h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-300">
              <li>Accounts inactive for more than 30 days may be automatically terminated.</li>
              <li>Cineverse may also terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section className="bg-[rgba(30,30,30,0.8)] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">6. Changes</h2>
            <p>
              These Terms may be changed at any time, with users being notified by email or within the platform.
            </p>
          </section>
        </div>

        {/* Botões de Accept e Decline */}
        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => {
              localStorage.setItem("termsAccepted", "true");
              router.push("/auth/register");
            }}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Accept
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("termsAccepted");
              router.push("/");
            }}
            className="w-full cursor-pointer bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Decline
          </button>
        </div>

        <footer className="mt-12 border-t border-gray-700 pt-6 text-sm text-gray-400 text-center">
          <p>
            For more details, please see our{" "}
            <Link href="/auth/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}
