import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const validateForm = ()=>{
    if(!formData.fullname.trim()) return toast.error("Full Name is Required");
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
        const response = await axios.post("http://localhost:3000/user/signup", formData, {
          withCredentials : true
        });
        
        alert("Sign Up Successful");
        navigate("/home");
        toast.success("Account Created Successfully");
      } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        alert("Sign Up failed");
      }
    }
  };


  return (
    <>
      <div className='h-screen w-screen bg-gray-100 flex flex-col'>
              <img src='/uber2.svg' className='w-15 object-cover rounded-lg mt-5 ml-5'/>
          
          <form className='space-y-4 mt-6' onSubmit={handleSubmit}>
            <div>
              <h1 className='text-xl font-normal ml-3'>What's Your Full Name?</h1>
              <input required type='text' placeholder='Full Name' className='border-2 rounded-xl pl-2 h-10 w-2/3 ml-4 mt-4' value={formData.fullname} onChange={(e)=>{setFormData({ ...formData, fullname : e.target.value })}}></input>
            </div>
            <div>
              <h1 className='text-xl font-normal ml-3'>What's Your Email</h1>
              <input required type='email' placeholder='abc@abc.com' className='border-2 rounded-xl pl-2 h-10 w-2/3 mt-4 ml-4' value={formData.email} onChange={(e)=>{setFormData({ ...formData, email : e.target.value })}}>
              </input>
            </div>
      
            <div>
              <h1 className='text-xl ml-3 font-normal'>Create Password</h1>
              <input required type='password' placeholder='********' className='border-2 rounded-xl pl-2 pt-1 h-10 w-2/3 mt-4 ml-4' value={formData.password} onChange={(e)=>{setFormData({ ...formData, password : e.target.value })}}></input>
            </div>
      
            <button type='submit' className='w-3/4 h-10 bg-black text-white rounded shadow mt-7 ml-11 pb-1 active:scale-95 transition transform duration-150'><h2 className='font-normal text-xl'>Create Account</h2></button>
      
            <div className='flex items-center justify-center gap-4 mt-5'>
              <h1 className='font-medium'>Already have an account?</h1>
              <Link to={"/user-login"} className='text-blue-800'>Login as User</Link>
            </div>
      
          </form>
      </div>
    </>
  )
}

export default UserSignup
