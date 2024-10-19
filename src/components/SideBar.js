/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaDove, FaUserPlus } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import AvatarPage from './AvatarPage';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { clearUser } from '../redux/userSlice';


const SideBar = () => {
  const user=useSelector(state=> state?.user);
  const [editUserOpen, setEditUserOpen]=useState(false);
  const [allUsers, setAllUsers]=useState([]);
  const [openSearchUser, setOpenSearchUser]=useState(false);
  const socketConnection=useSelector(state=> state?.user?.socketConnection);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  useEffect(()=> {
    if(socketConnection){
      socketConnection.emit("sidebar", user?._id);

      socketConnection.on("conversation", (data)=> {
        const conversationUserData=data.map((conversationUser, idx)=> {
          if(conversationUser?.sender?._id===conversationUser?.receiver?._id){
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          }else if(conversationUser?.receiver?._id!==user?._id){
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver
            }
          }else{
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          }
        });

        setAllUsers(conversationUserData);
      })
    }
  }, [socketConnection, user?._id]);

  const handleLogOut=()=> {
    dispatch(clearUser());
    navigate("/email");
    localStorage.clear();
  }

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
        <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
            <div>
              <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat'>
                <IoChatbubbleEllipses size={25}/>
              </NavLink>

              <div className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`} title='Add User' onClick={()=> setOpenSearchUser(true)}>
                <FaUserPlus size={25}/>
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <button className='mx-auto mb-2' title={user?.name} onClick={()=> setEditUserOpen(true)}>
                <AvatarPage
                  width={40}
                  height={40}
                  name={user?.name}
                  imageUrl={user?.profile_pic}
                  userId={user?._id}
                />
              </button>
              <button onClick={handleLogOut} className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`} title='Logout'>
                <LuLogOut size={25}/>
              </button>
            </div>
        </div>

        <div className='w-full'>
          <div className='h-16 flex items-center'>
            <h2 className='text-xl font-bold p-4 text-slate-800'>Messages</h2>
          </div>
          <div className='p-[0.5px]'></div>

          <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
            {
              allUsers.length===0 && (
                <div className='mt-20'>
                  <div className='flex justify-center items-center my-4 text-slate-500'>
                    <GoArrowUpLeft size={50}/>
                  </div>
                  <p className='text-lg text-center text-slate-400 font-bold font-serif mt-3'>Explore your happiness by talking to the people you love... &#9829;&#9829;</p>
                </div>
              )
            }

            {
              allUsers.map((convo, idx)=> {
                return (
                  <NavLink to={"/home/"+convo?.userDetails?._id} key={idx} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                    <div>
                      <AvatarPage
                        imageUrl={convo?.userDetails?.profile_pic}
                        name={convo?.userDetails?.name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{convo?.userDetails?.name}</h3>
                      <div className='text-slate-500 text-xs flex items-center gap-1'>
                        <div className='flex items-center gap-1'>
                          {
                            convo?.lastMsg?.imageUrl && (
                              <div className='flex items-center gap-1'>
                                <span><FaImage/></span>
                                {!convo?.lastMsg?.text && <span>Image</span>}
                              </div>
                            )
                          }

                          {
                            convo?.lastMsg?.videoUrl && (
                              <div className='flex items-center gap-1'>
                                <span><FaVideo/></span>
                                {!convo?.lastMsg?.text && <span>Video</span>}
                              </div>
                            )
                          }
                        </div>
                        <p className='text-ellipsis line-clamp-1'>{convo?.lastMsg?.text}</p>
                      </div>
                    </div>
                    {
                      Boolean(convo?.unseenMsg) && (
                        <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 text-white bg-primary rounded-full font-semibold'>{convo?.unseenMsg}</p>
                      )
                    }
                  </NavLink>
                )
              })
            }
          </div>
        </div>

        {/* Edit user details */}
        {
          editUserOpen && (
            <EditUserDetails onClose={()=> setEditUserOpen(false)} user={user}/>
          )
        }

        {/* Search user details */}
        {
          openSearchUser && (
            <SearchUser onClose={()=> setOpenSearchUser(false)}/>
          )
        }
    </div>
  )
}

export default SideBar;