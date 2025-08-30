export default function Perfil() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Banner de capa */}
      <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-700"></div>

      <div className="p-6 -mt-16">
        {/* Header Perfil */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-[#0f0f0f]"></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Nome do Usuário</h1>
            <p className="text-gray-400">usuario@email.com</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 text-sm">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">120</p>
            <p className="text-gray-400 text-sm">Filmes assistidos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-gray-400 text-sm">Listas criadas</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">45</p>
            <p className="text-gray-400 text-sm">Favoritos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">Ontem</p>
            <p className="text-gray-400 text-sm">Último login</p>
          </div>
        </div>

        {/* Listas */}
        <div className="space-y-10">
          {/* Assistir mais tarde */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Assistir mais tarde</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="min-w-[150px] h-40 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500"
                >
                  Filme {i}
                </div>
              ))}
            </div>
          </section>

          {/* Favoritos */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Favoritos</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[150px] h-40 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500"
                >
                  Lorem Ipsum {i}
                </div>
              ))}
            </div>
          </section>

          {/* Atividade Recente */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Atividade recente</h2>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você adicionou <span className="font-semibold">Filme X</span> aos favoritos.
              </div>
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você assistiu 70% de <span className="font-semibold">Filme Y</span>.
              </div>
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você criou a lista <span className="font-semibold">Assistir em família</span>.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}