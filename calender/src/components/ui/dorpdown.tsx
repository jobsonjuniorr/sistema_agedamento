import { useState } from "react";
import { Link } from "react-router-dom";


export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative "  >
            <button  onClick={() => setIsOpen(!isOpen)}
                className="text-text z-10 absolute p-3 focus:outline-none">
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    ></path>
                </svg>
            </button>
            <div className={`absolute h-screen -left-40 bg-card w-60 py-2 rounded-lg shadow-lg transition-all duration-300 ${isOpen?"opacity-100 visible":"opacity-0 invisible"}`}>
                
            <ul className="flex flex-col items-start gap-2 p-4">
                   
                        <Link to="/" className="block px-4 py-2  w-full  transition-all duration-200 hover:border-l-4  hover:border-b-4
                        hover:border-button rounded">
                            Home
                        </Link>
                
                        <Link to="/produto" className="block px-4 py-2  w-full  transition-all duration-200 hover:border-l-4  hover:border-b-4
                        hover:border-button rounded">
                            Produto
                        </Link>
                  
                 
                        <Link to="/servico" className="block px-4 py-2  w-full  transition-all duration-200 hover:border-l-4  hover:border-b-4
                        hover:border-button rounded">
                            Serviço
                        </Link>
                 
                 
                        <Link to="/login" className="block px-4 py-2  w-full  transition-all duration-200 hover:border-l-4  hover:border-b-4
                        hover:border-button rounded">
                            Login
                        </Link>
                  
              
                        <Link
                            to="/register"
                            className="block px-4 py-2  w-full  transition-all duration-200 hover:border-l-4  hover:border-b-4
                        hover:border-button rounded"
                        >
                            Cadastra-se!
                        </Link>
               
                </ul>
            </div>

        </div>
    )
}