'use client'

import { useState } from "react";

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  profileId: string;
  currentName: string;
}

export default function EditarPerfilModal({
  isOpen,
  onClose,
  onProfileUpdated,
  profileId,
  currentName
}: EditarPerfilModalProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("O nome do perfil é obrigatório");
    if (name === currentName) return onClose();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/perfil/me/config?profileId=${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao atualizar perfil");
      } else {
        onProfileUpdated();
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
        <h2 className="text-2xl font-bold text-white mb-4">Editar Perfil</h2>
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
            {loading ? "Atualizando..." : "Atualizar Perfil"}
          </button>
        </form>
      </div>
    </div>
  );
}