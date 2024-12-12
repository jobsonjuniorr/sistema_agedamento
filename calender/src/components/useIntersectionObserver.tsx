import { useState, useEffect } from "react";


export function UseIntersectionObserver(
    elementRef: React.RefObject<HTMLElement>,
    options: IntersectionObserverInit = {}
){
    const [contenteVisible, setcontenteVisible] = useState(false)
    const [isIntersecting, SetIsIntersecting] = useState(false)

    useEffect(()=>{
        const element =  elementRef.current
        if(!element) return;

        const observer = new IntersectionObserver(([entry])=>{
            if(entry.isIntersecting){
                setcontenteVisible(true)
                SetIsIntersecting(true)
            }else{
                SetIsIntersecting(false)
            }

        },options)

        observer.observe(element)

        return() =>{
            if(element) observer.unobserve(element)
        };
    },[elementRef,options])
    
    return {isIntersecting, contenteVisible}
}