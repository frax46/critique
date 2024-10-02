import { create } from "zustand";

interface CritiqueModal{
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void

}


const createCritiqueModal =  create<CritiqueModal>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))

export default createCritiqueModal