/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import AvatarPage from '../components/AvatarPage';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData]=useState({
    password: "",
    userId: ""
  });

  const navigate=useNavigate();
  const location=useLocation();
  const dispatch=useDispatch();

  const userInfo=location?.state;

  useEffect(()=> {
    if(!userInfo?.name){
      navigate("/email");
    }
  }, []);

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

    const postUrl=`${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try{
      const response=await axios({
        method: "post",
        url: postUrl,
        data: {
          password: data.password,
          userId: userInfo?._id
        },
        withCredentials: true
      });

      toast.success(response?.data?.message);

      if(response?.data.success){
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
          userId: ""
        });
        navigate("/home");
      }
    }catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md mx-auto rounded overflow-hidden p-4'>
        <h1 className='text-center text-3xl text-primary font-extrabold'>Welcome to VibeChat!</h1>

        <div className='w-fit mx-auto mt-4 flex justify-center items-center flex-col'>
          <AvatarPage userId={userInfo?._id} name={userInfo?.name} imageUrl={userInfo?.profile_pic} width={90} height={90}/>
          <h2 className='mt-2 font-semibold text-primary text-lg'>{userInfo?.name}</h2>
        </div>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
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

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Login
          </button>
        </form>

        <p className='my-3 text-center'><Link to="/forgot" state={userInfo} className='text-primary hover:underline font-semibold'>Forgot password?</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage;