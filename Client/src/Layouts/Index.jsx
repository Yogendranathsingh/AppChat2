import React from "react";
import Logo from '../assets/logo.png'
import './Index.css'

const AuthLayout= ({children})=>{
    return(
        <>
            <div className='authBox'>
                <img src={Logo} alt="logo" />
            </div>
            {children}
        </>
    )
}

export default AuthLayout