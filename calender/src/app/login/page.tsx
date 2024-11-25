import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import Image from '/assets/eu.png'
import ErrorNotification from "@/components/erronotification";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function clearInput(){
    emailRef.current!.value = ''
    passwordRef.current!.value = ''
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value.trim()
    const password = passwordRef.current?.value.trim()

    if(!email ! || !password){
      setError("Por favor, preencha todos os campos")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         email, password
        }),
      });
    
      if (response.status === 404) {
       setError("Usuário não encontrado")
       return
      }

      if (response.status === 400) {
        setError("Senha incorreta.");
        passwordRef.current!.value = ''
        return;
      }
    
      if (!response.ok) {
        setError("Erro inesperado.");
        clearInput()
        return;
      }
      
      const { token }: { token: string } = await response.json();
      if(!token || typeof token !== 'string'){
        throw new Error("Token inválido recebido do servidor")
      }
      localStorage.setItem("token", token);
      navigate("/calender");
    } catch (err: any) {  
      setError(err.message);
    }
  }

  return (
    <div className="bg-background h-screen flex items-center justify-center">
      
      <div className="flex flex-col absolute  md:relative h-3/4 w-full md:flex-row md:h-2/4 xl:w-3/4 xl:h-3/4 items-center justify-center ">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
        <div className="flex h-full">
          <img src={Image} alt="logo" className="rounded-l-lg w-full hidden md:block " />
        </div>
        <div className="w-full absolute md:relative md:w-3/6  h-full bg-card p-2 border border-gray-300 rounded-r-lg shadow-lg  flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold  text-center text-paragraph 2xl:text-5xl">Login</h2>
          <form className="flex flex-col 2xl:h-2/6 p-6 gap-4 2xl:gap-9 2xl:4xl items-center justify-center h-3/5 w-full" onSubmit={handleSubmit}>
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
              className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5  px-3 bg-input py-2 border  2xl:p-3 2xl:text-4xl  border-gray-300 rounded-md focus:outline-none"
            />
            <button className="w-3/6 bg-button  2xl:p-3 2xl:text-4xl  text-buttonText py-2 px-4 rounded-md duration-200 hover:bg-buttonHover">
              Login
            </button>
            <p className="text-text w-full flex justify-center gap-2  2xl:text-4xl " >
              Não tem uma conta?  <Link to="/register" className="text-text duration-200 hover:text-link hover:underline  block text-center">
                Cadastre-se
              </Link>
            </p>
          </form>


        </div>
      </div>
    </div>
  );
}

export default Login;
