import { Link } from "react-router-dom";
import { useRef, FormEvent, useState } from "react";
import image from "/assets/eu.png"
import ErrorNotification from "@/components/erronotification";
import SuccessNotification from "@/components/successnotification";

function Cadastro() {
  // Definindo os tipos das referências como HTMLInputElement
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null)
  const [sucess, setSucesse] = useState<string | null>(null)

  function clearInput(){
    nameRef.current!.value = ''
    emailRef.current!.value = ''
    passwordRef.current!.value = ''
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!name || !email!! || !password) {
      setError("Por favor, preencha todos campos")
      clearInput()
      return
    }
    try {
      // Utilizando fetch para enviar os dados
      const response = await fetch('http://localhost:5000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password
        }),
      });

      if (response.ok) {
        setSucesse("Usuário Cadastrado com sucesso");
        clearInput()

      } else {
        setError("Erro ao cadastrar usuário");
        clearInput()
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      clearInput()
    }
  }

  return (
    <div className="bg-background h-screen flex items-center justify-center">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      {sucess && <SuccessNotification message={sucess} onClose={() => setSucesse(null)} />}
      <div className="flex flex-col absolute  md:relative h-3/4 w-full md:flex-row md:h-3/6 xl:w-3/4 xl:h-3/4 items-center justify-center ">

        <div className="flex h-full">
          <img src={image} alt="logo" className="rounded-l-lg w-full hidden md:block " />
        </div>

        <div className="w-full absolute md:relative md:w-3/6  h-full bg-card p-2 border border-gray-300 rounded-r-lg shadow-lg  flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold  text-center text-paragraph 2xl:text-5xl">Cadastro</h2>
          <form className="flex flex-col 2xl:h-2/6  p-6 gap-4 2xl:gap-9 2xl:4xl items-center justify-center  w-full" onSubmit={handleSubmit}>
            <input
              ref={nameRef}
              type="text"
              placeholder="Nome"
              className="w-4/5 md:w-full  md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              ref={passwordRef}
              type="password"
              placeholder="Senha"
              className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
            <button className="w-3/6 bg-button 2xl:p-3 2xl:text-4xl  text-buttonText py-2 px-4 rounded-md duration-200 hover:bg-buttonHover">
              Cadastrar-se
            </button>
            <p className="text-text w-full flex justify-center gap-2  2xl:text-4xl " >
              Já tem uma conta?  <Link to="/login" className="text-text duration-200 hover:text-link hover:underline  block text-center">
                Faça login
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Cadastro;