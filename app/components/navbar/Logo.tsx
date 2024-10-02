"use client"

import Image from "next/image"

const Logo =()=>{
    return(
        <Image
            alt="home critique"
            src="/logo_homecritique.png"
            height="100"
            width="100"
            className="hidden md:block cursor-pointer"
        />
    )
}

export default Logo