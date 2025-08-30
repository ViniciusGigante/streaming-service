export default function RegisterPage() {
  return (<div className="min-h-screen  flex items-center justify-center px-4 "
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

        <form className="mt-8 space-y-6">
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
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
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
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
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
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
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
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
                placeholder="Digite novamente sua senha"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              Concordo com os termos e condições
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Criar conta
          </button>

          <div className="text-center">
            <button type="button" className="text-sm text-gray-400 hover:text-gray-300">
              Já tem uma conta? Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}