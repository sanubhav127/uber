import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const CapLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
  
    const validateForm = ()=>{
       if(!formData.email.trim()) return toast.error("Email is Required");
       if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email Format!")
       if(!formData.password) return toast.error("Password is Required");
       if(formData.password.length < 6) return toast.error("Password must be atleast 6 characters");
   
       return true;
    };
  
    const handleSubmit = async (e)=>{
      e.preventDefault();
      const success = validateForm();
      if(success === true){
        try {
          const response = await axios.post("http://localhost:3000/captain/login", formData, {
            withCredentials : true
          });
  
          alert("Login Successfully!");
          navigate("/caphome");
          toast.success("Logged in Successfully");
        } catch (error) {
          console.error("Error registering user:", error.response?.data || error.message);
          alert("Login failed");
        }
      }
    };

  return (
    <>
       <div className='h-screen w-screen bg-gray-100 flex flex-col'>
              <img src='/uber2.svg' className='w-15 object-cover rounded-lg mt-5 ml-5'/>
          
          <form className='space-y-4 mt-6' onSubmit={handleSubmit}>
            <div>
              <h1 className='text-xl font-normal ml-3'>What's Your Email</h1>
              <input type='email' placeholder='abc@abc.com' className='border-2 rounded-xl pl-2 h-10 w-2/3 mt-4 ml-4' value={formData.email} onChange={(e)=>{setFormData({ ...formData, email : e.target.value })}}>
              </input>
            </div>
      
            <div>
              <h1 className='text-xl ml-3 font-normal'>Enter Password</h1>
              <input type='password' placeholder='********' className='border-2 rounded-xl pl-2 pt-1 h-10 w-2/3 mt-4 ml-4' value={formData.password} onChange={(e)=>{setFormData({ ...formData, password : e.target.value })}}></input>
            </div>
      
            <button type='submit' className='w-3/4 h-10 bg-black text-white rounded shadow mt-7 ml-11 pb-1 active:scale-95 transition transform duration-150'><h2 className='font-normal text-xl'>Login</h2></button>
      
            <div className='flex items-center justify-center gap-4 mt-5'>
              <h1 className='font-medium'>Want to Join as a Driver?</h1>
              <Link to={"/captain-signup"} className='text-blue-800'>Register Yourself</Link>
            </div>
      
          </form>
      
          <div className="w-full border-t border-gray-400 mt-5"></div>
      
          <button className='w-3/4 h-10 bg-black text-white rounded shadow ml-11 mt-11 pb-1 font-normal text-xl text-center active:scale-95 transition transform duration-150' onClick={()=>{navigate("/user-login")}}>Login as User</button>
          </div>
    </>
  )
}

export default CapLogin;
