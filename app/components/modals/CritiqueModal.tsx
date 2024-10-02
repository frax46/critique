"use client"

import createCritiqueModal from "@/app/hooks/createCritiqueModal"
import { useState } from "react"
import Modal from "./Modal"



export default function Critiquemodal(){

    const critiqueModal = createCritiqueModal()
    const [isLoading,setIsLoading] = useState(false)

    enum STEPS{
        
    }

    return(
        <Modal
            disabled={isLoading}
            isOpen={critiqueModal.isOpen}
            onClose={critiqueModal.onClose}
            onSubmit={critiqueModal.onClose}
            actionLabel="Submit"
            title="Create"
        />
    )
}