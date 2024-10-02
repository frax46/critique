"use client"

import Critiquemodal from "@/app/components/modals/CritiqueModal"
import { useEffect, useState } from "react"

export const ModalProvider = ()=>{
    const [isMounted,setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

    return(
        <>
            <Critiquemodal />
        </>
    )
}