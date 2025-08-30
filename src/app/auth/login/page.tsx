export default function LoginPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4 "
          style={{
    backgroundImage: "url('/background-home.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
    >
      <div className="max-w-md w-full space-y-8  p-8 rounded-lg shadow-lg bg-[rgba(245,245,245,0.06)] backdrop-blur-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Login
          </h2>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-[rgba(255,255,255,0.15)]  bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
                placeholder="Digite seu email"
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
                className="mt-1 block w-full px-3 py-2 bg-[rgba(255,255,255,0.15)]  bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:blue-600 focus:border-transparent"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Lembrar-me
              </label>
            </div>

            <button type="button" className="text-sm text-blue-600 hover:blue-900">
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Entrar
          </button>

          <div className="text-center">
            <button type="button" className="text-sm text-gray-400 hover:text-gray-300">
              Não tem conta? Criar agora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}