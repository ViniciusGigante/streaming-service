'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import Image from "next/image";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
}

export default function CategoriaExpandida() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoria = decodeURIComponent(params.categoria as string);
  const type = searchParams.get('type');
  
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.history.state?.items) {
      setItems(window.history.state.items);
      setLoading(false);
      return;
    }

    async function fetchCategoryItems() {
      try {
        const endpoint = type === 'movie' ? '/api/filmes' : '/api/series';
        const response = await fetch(endpoint, { credentials: "include" });
        const data = await response.json();

        if (data.success) {
          const categoryItems = data.data[categoria] || [];
          setItems(categoryItems);
        }
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      } finally {
        setLoading(false);
      }
    }

    if (categoria && type) {
      fetchCategoryItems();
    }
  }, [categoria, type]);

  const handleBack = () => router.back();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#b8b8b8]">
        <Sidebar />
        <section className="min-h-screen relative flex-1 bg-[#1E1E1E] text-white md:ml-20 md:pt-0 p-4">
          <Header />
          <div className="flex items-center justify-center h-64">
            <p className="text-white">Carregando...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#b8b8b8]">
      <Sidebar />
      <section className="min-h-screen relative flex-1 bg-[#1E1E1E] text-white md:ml-20 md:pt-0 p-4">
        <Header />
        
        {/* Cabeçalho da categoria */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={handleBack}
              className="mb-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold capitalize">{categoria}</h1>
            <p className="text-gray-400 mt-2">
              {items.length} {type === 'movie' ? 'filmes' : 'séries'} encontrados
            </p>
          </div>
        </div>

        {/* Grid de itens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="min-w-[180px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => console.log('Item clicado:', item.title)}
            >
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                width={200}
                height={300}
                className="w-full h-60 object-cover"
              />
              <div
                className="p-3"
                style={{
                  background: "linear-gradient(to top, #0b1a3f, rgba(11,26,63,0))"
                }}
              >
                <h3 className="font-semibold text-sm truncate text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum item encontrado nesta categoria.</p>
            <button 
              onClick={handleBack}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Voltar para Home
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
