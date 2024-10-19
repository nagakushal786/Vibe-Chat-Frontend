import React from 'react';
import logo from "../assets/logo.png";

const AuthLayouts = ({children}) => {
  return (
    <>
      <header className='flex justify-center items-center py-1 shadow-sm bg-white'>
        <img
          src={logo}
          alt='logo'
          className='w-[300px] h-auto'
          style={{height: '300px'}}
        />
      </header>
      {children}
    </>
  )
}

export default AuthLayouts;