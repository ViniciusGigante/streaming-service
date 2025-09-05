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

useEffect(() => {
  async function fetchProfiles() {
    try {
      const res = await fetch("/api/perfis", { credentials: "include" });
      
      // Log do status da requisição
      console.log("Status da requisição /api/perfis:", res.status);
      
      const data = await res.json();
      
      // Log da resposta
      console.log("Resposta de /api/perfis:", data);

      if (res.ok) {
        setProfiles(data.profiles);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
    }
  }

  fetchProfiles();
}, []);


  const handleSelectProfile = (profile: Profile) => {
    localStorage.setItem("activeProfile", JSON.stringify(profile));
    router.push("/Home");
  };

  const handleProfileCreated = (newProfile: Profile) => {
    setProfiles([...profiles, newProfile]);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col px-4">
      <div className="mt-4 mx-aut self-start">
        <Image
          src="/cineverse-logo-dark.svg"
          width={300}
          height={110}
          alt="Cineverse Logo"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">Quem está assistindo?</h1>
        
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="group cursor-pointer"
              onClick={() => handleSelectProfile(profile)}
            >
              <div
                className="w-32 h-32 bg-gray-700 rounded-md group-hover:border-2 group-hover:border-white transition-all mb-3 flex items-center justify-center"
              >
                <span className="text-white text-2xl">{profile.name[0]}</span>
              </div>
              <p className="text-gray-400 group-hover:text-white transition-colors">
                {profile.name}
              </p>
            </div>
          ))}

          <div
            className="group cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <div className="w-32 h-32 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-all mb-3">
              <div className="text-4xl text-gray-400 group-hover:text-white">+</div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors">Adicionar</p>
          </div>
        </div>
      </div>

      <button className="border border-gray-600 text-gray-400 px-8 py-2 hover:border-white hover:text-white transition-colors">
        GERENCIAR PERFIS
      </button>

      {modalOpen && (
        <AdicionarPerfilModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </div>
  );
}
