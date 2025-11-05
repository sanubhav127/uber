import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate();

  return (
   <>
    <div className='bg-[url(/traffic.jpg)] bg-no-repeat bg-cover bg-bottom h-screen w-full flex flex-col justify-between relative'>
      <img src='/uber2.svg' className='w-15 object-cover rounded-lg z-0 absolute mt-5 ml-5'/>
      <div className='absolute h-1/5 w-full text-center space-y-3 bottom-0 bg-white'>
        <p className='font-medium text-2xl mt-3 text-shadow-2xs'>Get Started With UBER</p>
        <button className='w-3/4 h-10 bg-black text-white rounded mt-2 shadow text-xl pb-1.5 font-sans active:scale-95 transition transform duration-150' onClick={()=>{navigate("/user-login")}}>Continue</button>
      </div>
    </div>
   </>
  )
}

export default HomePage
