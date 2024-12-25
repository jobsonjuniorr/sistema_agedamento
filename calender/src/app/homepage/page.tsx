import { Link } from "react-router-dom"
import Image from "/assets/eu.png"
import ImageCalender from "/assets/calender.png"
import ImageDashBord from "/assets/dashbord_info.png"
import { MobileMenu } from "@/components/ui/dorpdown"
import {AnimatedCard, AnimatedVerse} from "@/components/ui/animatecard";

export function HomePage() {

    return (
        <div className="h-screen w-full overflow-y-auto custom-scrollbar">
            <header className="flex justify-around bg-background border-b border-b-button p-2 shadow-sm shadow-butto">
                <div className="flex flex-row-reverse items-center gap-2 ">
                    <h3>CLT Agendamentos</h3>
                    <img className="h-11 w-11 rounded-full" src={Image} alt="Ícone" />
                </div>
                <div className="md:hidden">
                    <MobileMenu />
                </div>
                <ul className=" hidden md:flex justify-evenly items-center gap-3 w-2/5 ">
                    <li className="text-text hover:underline hover:text-buttonHover cursor-pointer">Home</li>
                    <li className="text-text hover:underline hover:text-buttonHover  cursor-pointer">Serviço</li>
                    <li className="text-text hover:underline hover:text-buttonHover  cursor-pointer">Dashbord</li>
                    <li className="text-text hover:underline hover:text-buttonHover  cursor-pointer"><Link to={'/login'}>Login</Link></li>
                    <button className="p-3 bg-button rounded-lg text-text hover:bg-buttonHover"><Link to={'/register'}>Cadastra-se!</Link></button>
                </ul>
            </header>

            <section className="h-full flex  items-center justify-center  ">
                <div className="w-full md:w-11/12 p-4 bg-background rounded-xl flex flex-col items-center justify-center gap-1">
                    <h2 className="w-full md:w-4/6 indent-3 font-semibold text-text  md:text-center  animate-cardanimationRight ">

                        O sistema CLT Agendamentos permite gerenciar horários de forma eficiente, com um dashboard intuitivo que organiza informações como status de agendamentos e relatórios.

                    </h2>
                    <div className="flex items-center justify-center p-2 ">
                        <img className="w-full md:w-5/6 rounded-2xl animate-cardanimationLeft" src={ImageCalender} alt="Imagem do DashBord" />
                    </div>
                </div>
            </section>


            <section className="flex items-center justify-center ">
                <div className=" w-11/12 h-full rounded-xl flex flex-col p-2 bg-card items-center justify-center gap-2 md:gap-0 animate-wiggle">    
                    <div className="w-full h-52 flex justify-start ">
                        <AnimatedCard>
                            <h1 className="font-bold  text-text text-xl">Configurações Flexíveis</h1>
                            <p className="w-full indent-3 font-semibold text-text p-2">
                                Personalize o sistema de acordo com as suas necessidades.
                            </p>
                        </AnimatedCard>


                    </div>
                    <div className="w-full h-52 flex justify-center">
                        <AnimatedCard>
                            <h1 className="font-bold text-xl text-text">Agendamentos Simples</h1>
                            <p className="w-full indent-3 font-semibold text-text p-2">
                                Realize agendamentos de forma prática e rápida, com interface intuitiva e feedback instantâneo.
                            </p>

                        </AnimatedCard>
                    </div>
                    <div className="w-full h-52 flex justify-end ">
                        <AnimatedCard>
                            <h1 className="font-bold text-xl text-text">Dashboard Interativo</h1>
                            <p className="w-full indent-3 font-semibold text-text p-2">
                                Visualize informações como agendamentos mensais, total arrecadado e histórico de agendamentos em tempo real.
                            </p>
                        </AnimatedCard>
                    </div>

                </div>
            </section>

            <section className="h-full flex items-center justify-center">
               <AnimatedVerse>
                
               <h2 className=" w-full md:w-4/6 indent-3 font-semibold text-text">
                        Gere relatórios personalizados para acompanhar o desempenho e os dados do sistema ao longo do tempo.
                    </h2>
                    <div className="flex items-center justify-center p-2 ">
                        <img className="w-full rounded-md" src={ImageDashBord} alt="Imagem do calender" />
                    </div>
               
               </AnimatedVerse>
            </section>
            <footer className="bg-card flex items-center justify-center p-1">
                <div className="flex flex-col items-center justify-center">
                    <ul className="flex gap-3">

                        <li><a href="https://github.com/jobsonjuniorr" target="_blank" className="text-text hover:underline hover:text-button">GitHub</a></li>
                        <li><a href="https://www.linkedin.com/in/jobson-junior-8b92492a9/" target="_blank" className="text-text hover:underline hover:text-button">LinkedIn</a></li>
                        <li><a href="/terms" className="text-text hover:underline hover:text-button">Termos de Serviço</a></li>

                    </ul>

                    <p className="font-medium text-sm">Jobson Junior | jobson13j@gmail.com</p>
                </div>
            </footer>

        </div>
    )

}