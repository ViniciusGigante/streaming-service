'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdicionarPerfilModal from "./components";

interface Profile {
  _id: string;
  name: string;
  avatarColor?: string;
}

export default function SelecaoPerfilPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [manageMode, setManageMode] = useState(false);


  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);


  const [profileToRename, setProfileToRename] = useState<Profile | null>(null);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(false);


  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch("/api/perfis", { credentials: "include" });
        const data = await res.json();

        if (res.ok) {
          setProfiles(data.profiles);
        } else {
          console.error("Erro ao buscar perfis:", data);
        }
      } catch (err) {
        console.error("Erro ao buscar perfis:", err);
      }
    }
    fetchProfiles();
  }, []);

  const handleSelectProfile = (profile: Profile) => {
    if (manageMode) return;
    localStorage.setItem("activeProfile", JSON.stringify(profile));
    router.push("/Home");
  };

  const handleProfileCreated = (newProfile: Profile) => {
    setProfiles(prev => [...prev, newProfile]);
  };


  async function confirmDeleteProfile() {
    if (!profileToDelete) return;

    if (profiles.length <= 1) {
      setErrorMessage("Você não pode excluir o último perfil da conta.");
      return;
    }

    setDeleting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/perfis/configPerfis/deletePerfil", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profileToDelete._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Erro ao excluir perfil.");
        setDeleting(false);
        return;
      }

      setProfiles(prev => prev.filter(p => p._id !== profileToDelete._id));

      try {
        const active = localStorage.getItem("activeProfile");
        if (active) {
          const activeObj = JSON.parse(active);
          if (activeObj && activeObj._id === profileToDelete._id) {
            localStorage.removeItem("activeProfile");
          }
        }
      } catch (e) {}

      setProfileToDelete(null);
      setDeleting(false);
    } catch (err) {
      console.error("Erro ao chamar API de delete:", err);
      setErrorMessage("Erro de rede ao excluir perfil.");
      setDeleting(false);
    }
  }

  async function confirmRenameProfile() {
    if (!profileToRename || !newName.trim()) return;
    setRenaming(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/perfis/configPerfis/renamePerfil", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profileToRename._id, newName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Erro ao renomear perfil.");
        setRenaming(false);
        return;
      }

      setProfiles(prev =>
        prev.map(p => p._id === profileToRename._id ? { ...p, name: newName } : p)
      );

      setProfileToRename(null);
      setNewName("");
      setRenaming(false);
    } catch (err) {
      console.error("Erro ao renomear perfil:", err);
      setErrorMessage("Erro de rede ao renomear perfil.");
      setRenaming(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col px-4">
      {/* Logo */}
      <div className="mt-4 mx-auto">
        <Image
          src="/cineverse-logo-dark.svg"
          width={300}
          height={110}
          alt="Cineverse Logo"
        />
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">Quem está assistindo?</h1>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {profiles.map(profile => (
            <div
              key={profile._id}
              className="group relative cursor-pointer"
              onClick={() => handleSelectProfile(profile)}
            >
              {/* Botões gerenciar */}
              {manageMode && (
                <>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setErrorMessage(null);
                      setProfileToDelete(profile);
                    }}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-600 rounded-s-md flex items-center justify-center text-white text-sm hover:bg-red-700 transition z-10"
                    aria-label={`Excluir perfil ${profile.name}`}
                  >
                    🗑
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setErrorMessage(null);
                      setProfileToRename(profile);
                      setNewName(profile.name);
                    }}
                    className="absolute top-10 right-0 w-8 h-8 bg-blue-600 rounded-s-md flex items-center justify-center text-white text-sm hover:bg-blue-700 transition z-10"
                    aria-label={`Renomear perfil ${profile.name}`}
                  >
                    ✏️
                  </button>
                </>
              )}

              {/* Avatar */}
              <div className={`w-32 h-32 rounded-md mb-3 flex items-center justify-center transition-all ${manageMode ? "border-2 border-red-600" : "bg-gray-700 group-hover:border-2 group-hover:border-white"}`}>
                <span className="text-white text-2xl">{profile.name[0]}</span>
              </div>

              {/* Nome */}
              <p className={`text-gray-400 transition-colors ${manageMode ? "text-red-400" : "group-hover:text-white"}`}>
                {profile.name}
              </p>
            </div>
          ))}

          {/* Adicionar perfil */}
          <div className="group cursor-pointer" onClick={() => setModalOpen(true)}>
            <div className="w-32 h-32 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-all mb-3">
              <div className="text-4xl text-gray-400 group-hover:text-white">+</div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors">Adicionar</p>
          </div>
        </div>
      </div>

      {/* Botão Gerenciar Perfis */}
      <div className="mb-8 mx-auto">
        <button
          onClick={() => setManageMode(!manageMode)}
          className={`px-8 py-2 m-1 rounded-lg font-semibold transition-all duration-300
            ${manageMode
              ? "bg-red-700 text-white hover:bg-red-600"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-md"
            }`}
        >
          {manageMode ? "Cancelar" : "Gerenciar Perfis"}
        </button>
        <button className="px-8 py-2 m-1 rounded-lg font-semibold transition-all duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-md"
           onClick={() => {router.push(`/`)}}
        >
          Voltar ao início
        </button>
      </div>

      {/* Modal de Adicionar Perfil */}
      {modalOpen && (
        <AdicionarPerfilModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { if (!deleting) setProfileToDelete(null); }} />
          <div className="relative bg-[#161616] max-w-md w-full p-6 rounded-lg shadow-xl border border-gray-800 z-10">
            <h3 className="text-lg font-semibold text-white mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-gray-300 mb-4">
              Tem certeza que deseja excluir o perfil <span className="font-medium text-white">{profileToDelete.name}</span>?
              Essa ação não pode ser desfeita.
            </p>

            {errorMessage && <div className="mb-3 text-sm text-red-400">{errorMessage}</div>}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { if (!deleting) setProfileToDelete(null); }}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteProfile}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renomeação */}
      {profileToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { if (!renaming) setProfileToRename(null); }} />
          <div className="relative bg-[#161616] max-w-md w-full p-6 rounded-lg shadow-xl border border-gray-800 z-10">
            <h3 className="text-lg font-semibold text-white mb-2">Renomear perfil</h3>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Novo nome do perfil"
            />
            {errorMessage && <div className="mb-3 text-sm text-red-400">{errorMessage}</div>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { if (!renaming) setProfileToRename(null); }}
                disabled={renaming}
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRenameProfile}
                disabled={renaming}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {renaming ? "Renomeando..." : "Renomear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
