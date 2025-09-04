'use client'

import { useState } from "react";

interface AdicionarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (newProfile: { _id: string; name: string }) => void;
}

export default function AdicionarPerfilModal({
  isOpen,
  onClose,
  onProfileCreated,
}: AdicionarPerfilModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("O nome do perfil é obrigatório");

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/perfis/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar perfil");
      } else {
        onProfileCreated({ _id: data.profileId, name: name.trim() });
        setName("");
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Erro de rede, tente novamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Adicionar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome do perfil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Perfil"}
          </button>
        </form>
      </div>
    </div>
  );
}
