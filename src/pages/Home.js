/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearUser, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import logo from "../assets/mainLogo.png";
import io from "socket.io-client";

const Home = () => {
  const user=useSelector(state=> state.user);

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();

  const fetchUserDetails=async ()=> {
    try{
      const getUrl=`${process.env.REACT_APP_BACKEND_URL}/api/user`;
  
      const response=await axios({
        method: "get",
        url: getUrl,
        withCredentials: true
      });

      dispatch(setUser(response?.data?.data));

      if(response?.data?.data?.logout){
        dispatch(clearUser());
        navigate("/email");
      }
  
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchUserDetails();
  }, []);

  // Socket connection
  useEffect(()=> {
    const socketConnection=io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    socketConnection.on("onlineUser", (data)=> {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return ()=> {
      socketConnection.disconnect();
    }
  }, [])

  const basePath=location.pathname==="/";

  return (
    <div className='grid lg:grid-cols-[400px,1fr] h-screen max-h-screen'>
      <section className={`bg-white lg:block ${!basePath && "hidden"}`}>
        <SideBar/>
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>

      <div className={`${!basePath ? "hidden" : "lg:flex justify-center items-center flex-col gap-2 hidden"}`}>
          <div>
            <img
              src={logo}
              alt='logo'
              width={250}
            />
          </div>
          <p className='text-lg mt-2 text-slate-600 font-extrabold'>Select user to start chat</p>
      </div>
    </div>
  )
}

export default Home;

// className={`${basePath} && hidden`} - Outlet