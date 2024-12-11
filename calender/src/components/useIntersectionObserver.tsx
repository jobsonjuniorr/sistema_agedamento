import { useState, useEffect } from "react";


export function UseIntersectionObserver(
    elementRef: React.RefObject<HTMLElement>,
    options: IntersectionObserverInit = {}
){
    const [isIntersecting, SetIsIntersecting] = useState(false)

    useEffect(()=>{
        const element =  elementRef.current
        if(!element) return;
        const observer = new IntersectionObserver(([entry])=>{
            SetIsIntersecting(entry.isIntersecting);
        },options)
        observer.observe(element)
        return() =>{
            if(element) observer.unobserve(element)
        };
    },[elementRef,options])
    
    return isIntersecting
}