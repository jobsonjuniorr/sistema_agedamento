import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef } from "react";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      // Usando fetch para enviar os dados de login
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const { token }: { token: string } = await response.json();

      // Armazenar o token no localStorage
      localStorage.setItem('token', token);

      // Redirecionar para a rota de listar usuários
      navigate('/calender');
    } catch (err) {
      alert("Senha ou email incorretos");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Senha"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">
          Login
        </button>
      </form>
      <Link to="/register" className="text-blue-700 hover:underline mt-4 block text-center">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
}

export default Login;
