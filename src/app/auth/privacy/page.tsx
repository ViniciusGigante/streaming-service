import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Privacy Policy – Cineverse
        </h1>
        <p className="mb-10 text-center text-gray-700">
          This Policy explains how we collect, use, and protect your data on Cineverse.
        </p>

        <div className="space-y-6">
          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">1. Data Collected</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Name, email, password, and phone (during registration).</li>
              <li>Viewing history and preferences (for recommendations).</li>
              <li>Cookies and browsing data (to improve the experience).</li>
            </ul>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Personalize movie and series recommendations.</li>
              <li>Maintain account security and authentication.</li>
              <li>Contact users about service updates.</li>
            </ul>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">3. Sharing</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Your data is not sold to third parties.</li>
              <li>We use third-party services, like Google, only for secure authentication (login/password recovery).</li>
            </ul>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">4. User Rights</h2>
            <p>According to LGPD (Brazilian General Data Protection Law), you can:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Request access, modification, or deletion of your data.</li>
              <li>Request account deletion at any time.</li>
            </ul>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">5. Data Storage</h2>
            <p>
              Data is securely stored and used only while your account is active. Accounts inactive for more than 30 days will be deleted.
            </p>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
            <p>
              We use cookies to record viewing preferences and provide personalized recommendations. Users may disable cookies in their browser, but this may limit the Cineverse experience.
            </p>
          </section>

          <section className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-2">7. Changes</h2>
            <p>
              We may update this Policy at any time, notifying users of relevant changes.
            </p>
          </section>
        </div>

        <footer className="mt-12 border-t pt-6 text-sm text-gray-600 text-center">
          <p>
            Return to{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}
