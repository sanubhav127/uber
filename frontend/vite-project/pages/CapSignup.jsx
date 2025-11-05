import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const CapSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    color: "",
    plate: "",
    capacity: "",
    vehicleType: "",
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
    
   const data = {
    fullname: formData.fullname,
    email: formData.email,
    password: formData.password,
    vehicle: {
      color: formData.color,
      plate: formData.plate,
      capacity: formData.capacity,
      vehicleType: formData.vehicleType,
    }
  }
    const success = validateForm();
    if(success === true){
        try {
        const response = await axios.post("http://localhost:3000/captain/signup", data ,{
          withCredentials : true,
          headers: { "Content-Type": "application/json" }
        });
        
        alert("Sign Up Successful");
        navigate("/caphome");
        toast.success("Account Created Successfully");
      } catch (error) {
        console.error("Error registering captain:", error.response?.data || error.message);
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
                   <input required type='text' 
                   placeholder='Full Name' 
                   className='border-2 rounded-xl pl-2 h-10 w-2/3 mt-2 ml-4'
                   name='fullname'
                   onChange={(e)=>{setFormData({ ...formData, fullname : e.target.value })}}
                   value={formData.fullname}
                   ></input>
               </div>
               
               <div>
                 <h1 className='text-xl font-normal ml-3'>What's Your Email?</h1>
                 <input required type='email' 
                 placeholder='abc@abc.com' 
                 className='border-2 rounded-xl pl-2 h-10 w-2/3 mt-2 ml-4'
                 name='email'
                 onChange={(e)=>{setFormData({ ...formData, email : e.target.value })}}
                 value={formData.email}>
                 </input>
               </div>
         
               <div>
                 <h1 className='text-xl ml-3 font-normal'>Create Password</h1>
                 <input required type='password' 
                 placeholder='********' 
                 className='border-2 rounded-xl pl-2 pt-1 h-10 w-2/3 mt-2 ml-4'
                 name='password'
                 onChange={(e)=>{setFormData({ ...formData, password : e.target.value })}}
                 value={formData.password}></input>
               </div>

              <h1 className='text-xl ml-3 font-normal'>Enter Vehicle Details</h1>
               <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
                <input
                  type="text"
                  name="color"
                  placeholder="Vehicle Color"
                  value={formData.color}
                  onChange={(e)=>{setFormData({ ...formData, color : e.target.value })}}
                  className="w-3/4 p-2 ml-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <input
                  type="text"
                  name="plate"
                  placeholder="Plate Number"
                  value={formData.plate}
                  onChange={(e)=>{setFormData({ ...formData, plate : e.target.value })}}
                  className="w-3/4 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e)=>{setFormData({ ...formData, capacity : e.target.value })}}
                  className="w-3/4 p-2 ml-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e)=>{setFormData({ ...formData, vehicleType : e.target.value })}}
                  className="w-3/4 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="" disabled>Select Vehicle</option>
                  <option value="car">Car</option>
                  <option value="rickshaw">Rickshaw</option>
                  <option value="bike">Bike</option>
          </select>
              </div>

                <div className='flex items-center justify-center gap-4 mt-5'>
                 <h1 className='font-medium'>Already have an account?</h1>
                 <Link to={"/captain-login"} className='text-blue-800'>Login as Captain</Link>
               </div>
         
               <button type='submit' className='w-3/4 h-10 bg-black text-white rounded shadow mt-3 ml-11 pb-1 active:scale-95 transition transform duration-150'><h2 className='font-normal text-xl'>Create Account</h2></button>
             </form>

             </div>
   </>
  )
}

export default CapSignup
