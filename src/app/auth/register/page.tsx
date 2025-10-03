"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted") === "true";
    if (accepted) {
      setForm(prev => ({ ...prev, termsAccepted: true }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      setMessage("Você deve aceitar os termos de serviço.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erro ao registrar usuário");
      } else {
        setMessage("Conta criada com sucesso!");
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
        });
        localStorage.removeItem("termsAccepted");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro de rede, tente novamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/background-home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full space-y-8 p-10 bg-[rgba(245,245,245,0.06)] backdrop-blur-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Junte-se ao Cineverse
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Seu Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Digite novamente sua senha"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={form.termsAccepted}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-300">
              Eu li e aceito os{" "}
              <a
                href="/auth/terms"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300"
              >
                termos de serviço
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          {message && (
            <p className="text-center text-sm text-red-500 mt-2">{message}</p>
          )}

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer"
              onClick={() => router.push('/auth/login')}
            >
              Já tem uma conta? Entrar
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => router.push("/auth/login")}
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
