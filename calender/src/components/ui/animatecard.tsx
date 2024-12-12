import React, {useRef} from "react";
import { UseIntersectionObserver } from "../useIntersectionObserver";

interface AnimatedCardProps{
    children: React.ReactNode;
    className?: string;
}


const AnimatedCard: React.FC<AnimatedCardProps> = ({children, className}) =>{
    const ref = useRef<HTMLDivElement>(null)
    const {contenteVisible} = UseIntersectionObserver(ref,{threshold: 0.2})

    return(
        <div
        ref={ref}
        className={`bg-link w-96 h-52 md:h-full flex flex-col justify-center items-center rounded-lg p-2  transition-transform duration-700
          ${
            contenteVisible ? "animate-scrollView" : "opacity-0 translate-x-0"
          } ${className}`}
      >
        {children}
      </div>
    )
}

export default AnimatedCard