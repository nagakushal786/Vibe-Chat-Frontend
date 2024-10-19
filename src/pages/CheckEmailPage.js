import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { LuUserCircle2 } from "react-icons/lu";

const CheckEmailPage = () => {

  const [data, setData]=useState({
    email: "",
  });

  const navigate=useNavigate();

  const handleOnChange=(e)=> {
    const {name, value}=e.target;

    setData((prev)=> {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit=async (e)=> {
    e.preventDefault();
    e.stopPropagation();

    const postUrl=`${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try{
      const response=await axios.post(postUrl, data);
      toast.success(response?.data?.message);

      if(response?.data.success){
        setData({
          email: ""
        });
        navigate("/password", {
          state: response?.data?.data
        });
      }
    }catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md mx-auto rounded overflow-hidden p-4'>
        <h1 className='text-center text-3xl text-primary font-extrabold'>Welcome to VibeChat!</h1>

        <div className='w-fit mx-auto mt-4'>
          <LuUserCircle2 size={90}/>
        </div>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='font-semibold'>Email: </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus: outline-primary mt-1'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Let's Go
          </button>
        </form>

        <p className='my-3 text-center'>New to VibeChat? <Link to="/register" className='text-primary hover:underline font-semibold'>SignUp</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage;