import { Link } from "react-router-dom";
import { useRef, FormEvent } from "react";

function Cadastro() {
  // Definindo os tipos das referências como HTMLInputElement
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      // Utilizando fetch para enviar os dados
      const response = await fetch('http://localhost:5000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameRef.current?.value,
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (response.ok) {
        alert("Usuário Cadastrado com sucesso");
      } else {
        alert("Erro ao cadastrar usuário");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          ref={nameRef}
          type="text"
          placeholder="Nome"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
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
          Cadastrar-se
        </button>
      </form>
      <Link to="/login" className="text-blue-700 hover:underline mt-4 block text-center">
        Já tem uma conta? Faça login
      </Link>
    </div>
  );
}

export default Cadastro;