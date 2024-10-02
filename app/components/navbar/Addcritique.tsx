"use client"

import { useCallback } from "react"

import createCritiqueModal from "@/app/hooks/createCritiqueModal"


const AddCritique = ()=>{

    const critiqueModal = createCritiqueModal()
    
    return(
        <div className="border-[1px] rounded-full p-2 text-blue-500 cursor-pointer" onClick={critiqueModal.onOpen}>Create Critique</div>
    )
}

export default AddCritique