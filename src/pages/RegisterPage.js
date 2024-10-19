import React, { useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadImage';
import axios from "axios";
import toast from 'react-hot-toast';

const Register = () => {
  const [data, setData]=useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });

  const [photo, setPhoto]=useState("");
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

  const handleUpload=async (e)=> {
    const file=e.target.files[0];

    const photo=await uploadFile(file);

    setPhoto(file);
    setData((prevData)=> {
      return {
        ...prevData,
        profile_pic: photo?.url
      }
    })
  }

  const handleClear=(e)=> {
    e.stopPropagation();
    e.preventDefault();
    setPhoto(null);
  }

  const handleSubmit=async (e)=> {
    e.preventDefault();
    e.stopPropagation();

    const postUrl=`${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try{
      const response=await axios.post(postUrl, data);
      toast.success(response?.data?.message);

      if(response?.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        navigate("/email");
      }
    }catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md mx-auto rounded overflow-hidden p-4'>
        <h1 className='text-center text-3xl text-primary font-extrabold'>Welcome to VibeChat!</h1>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name' className='font-semibold'>Name: </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 px-2 py-1 focus: outline-primary mt-1'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

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

          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='font-semibold'>Password: </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus: outline-primary mt-1'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic' className='font-semibold'>Profile Picture: 
              <div className='mt-1'></div>
              <div className='h-14 bg-slate-200 flex justify-center items-center border hover:border-primary rounded cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    photo?.name ? photo?.name : "Upload profile pic"
                  }
                </p>
                {
                  photo?.name && (
                    <button className='text-lg ml-2 hover:text-red-600' onClick={handleClear}>
                      <IoIosCloseCircle />
                    </button>
                  )
                }
              </div>
            </label>

            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='bg-slate-100 px-2 py-1 focus: outline-primary hidden'
              onChange={handleUpload}
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Register
          </button>
        </form>

        <p className='my-3 text-center'>Already have account? <Link to="/email" className='text-primary hover:underline font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register;