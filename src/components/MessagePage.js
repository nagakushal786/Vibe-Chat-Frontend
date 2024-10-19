/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import AvatarPage from './AvatarPage';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadImage';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import wallpaper from '../assets/wallapaper.jpeg';
import { IoSend } from "react-icons/io5";
import { HiDownload } from "react-icons/hi";
import moment from "moment";

const MessagePage = () => {
  const params=useParams();
  const socketConnection=useSelector(state=> state?.user?.socketConnection);
  const user=useSelector(state=> state?.user);
  const [openImageVideo, setOpenImageVideo]=useState(false);
  const [loading, setLoading]=useState(false);
  const [allMessages, setAllMessages]=useState([]);
  const currMessage=useRef(null);
  const [deleteMsg, setDeleteMsg]=useState(null);

  const [message, setMessage]=useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });

  const [userData, setUserData]=useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false
  });

  useEffect(()=> {
    if(currMessage.current){
      currMessage.current.scrollIntoView({behavior: "smooth", block: "end"});
    }
  }, [allMessages]);
  
  useEffect(()=> {
    if(socketConnection){
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params?.userId);

      socketConnection.on("message-user", (data)=> {
        setUserData(data);
      });

      socketConnection.on("message", (data)=> {
        setAllMessages(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  useEffect(()=> {
    if(socketConnection){
      socketConnection.on("message-deleted", (messageId)=> {
        setAllMessages((prevMessages)=> prevMessages.filter(msg=> msg?._id!==messageId));
      });
    }
  }, [socketConnection]);

  const handleUpload=()=> {
    setOpenImageVideo(prevState=> !prevState);
  }

  const handleUploadImage=async (e)=> {
    const file=e.target.files[0];

    setLoading(true);
    const photo=await uploadFile(file);
    setLoading(false);
    setOpenImageVideo(false);

    setMessage((prevData)=> {
      return {
        ...prevData,
        imageUrl: photo?.url
      }
    })
  }

  const handleUploadVideo=async (e)=> {
    const file=e.target.files[0];

    setLoading(true);
    const video=await uploadFile(file);
    setLoading(false);
    setOpenImageVideo(false);

    setMessage((prevData)=> {
      return {
        ...prevData,
        videoUrl: video?.url
      }
    })
  }

  const handleClearImage=()=> {
    setMessage((prevData)=> {
      return {
        ...prevData,
        imageUrl: ""
      }
    });
  }

  const handleClearVideo=()=> {
    setMessage((prevData)=> {
      return {
        ...prevData,
        videoUrl: ""
      }
    });
  }

  const handleOnChange=(e)=> {
    const value=e.target.value;

    setMessage((prevData)=> {
      return {
        ...prevData,
        text: value
      }
    })
  }

  const handleSendMessage=(e)=> {
    e.preventDefault();

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id
        });

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  }

  const handleDownload=(fileUrl)=> {
    const link=document.createElement('a');
    link.href=fileUrl;

    const fileName=fileUrl.split("/").pop();
    link.download=fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  const handleDelete=async (messageId, type)=> {
    if(socketConnection){
      socketConnection.emit("delete-message", {
        messageId,
        type,
        senderId: user?._id,
        receiverId: params?.userId
      });

      if(type==="me"){
        setAllMessages((prevMessages)=> prevMessages.filter(msg=> msg?._id!==messageId));
      }
    }
  }

  const handleDeleteOpen=(messageId)=> {
    setDeleteMsg(prevState=> prevState===messageId ? null : messageId);
  }

  return (
    <div style={{backgroundImage: `url(${wallpaper})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleDoubleLeft size={25}/>
          </Link>

          <div className='mt-1'>
            <AvatarPage
              width={50}
              height={50}
              name={userData?.name}
              imageUrl={userData?.profile_pic}
              userId={userData._id}
            />
          </div>

          <div>
            <h3 className='font-semibold text-lg text-secondary my-0 text-ellipsis line-clamp-1'>
              {userData?.name}
            </h3>
            <p className='-my-1'>
              {
                userData.online ? <span className='text-sm text-primary'>online</span> : <span className='text-sm text-primary'>offline</span>
              }
            </p>
          </div>

        </div>

        <div>
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical size={25}/>
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>

        {/* Show all messages */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currMessage}>
          {
            allMessages.map((msg, idx)=> {
              return (
                <div key={idx} className={`p-2 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md relative ${user?._id===msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <div className='relative'>
                          <img
                            src={msg?.imageUrl}
                            alt='displayImage'
                            className='w-full h-full object-scale-down p-3'
                          />
                        </div>
                      )
                    }

                    {
                      msg?.videoUrl && (
                        <div className='relative'>
                          <video
                            src={msg?.videoUrl}
                            className='w-full h-full object-scale-down p-3'
                            controls
                            muted
                            autoPlay
                          />
                        </div>
                      )
                    }
                  </div>
                  <p className='px-3 py-1'>{msg?.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg?.createdAt).format("LT")}</p>

                  {/* Delete messages */}
                  {user?._id===msg?.msgByUserId && (
                    <div className='absolute top-1 right-0 flex flex-col items-center gap-3 cursor-pointer'>
                      <HiDotsVertical size={16} onClick={()=> handleDeleteOpen(msg?._id)}/>
                      {
                        deleteMsg===msg?._id && (
                          <div className='absolute top-3 right-4 bg-white shadow-lg rounded z-10'>
                            <button onClick={()=> handleDelete(msg?._id, "me")} className='block px-4 py-1 border border-transparent hover:border-secondary rounded text-sm font-semibold text-primary'>
                              Delete for me
                            </button>
                            <button onClick={()=> handleDelete(msg?._id, "everyone")} className='block px-4 py-1 border border-transparent hover:border-secondary rounded text-sm font-semibold text-primary'>
                              Delete for all
                            </button>
                          </div>
                        )
                      }

                      {
                        (msg?.imageUrl || msg?.videoUrl) && (
                          <button onClick={()=> handleDownload(msg?.imageUrl || msg?.videoUrl)} className='cursor-pointer'>
                            <HiDownload size={16}/>
                          </button>
                        )
                      }
                    </div>
                  )}
                </div>
              )
            })
          }
        </div>

        {/* Image display */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div onClick={handleClearImage} className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
                <IoClose size={30}/>
              </div>
              <div className='bg-white p-1'>
                <img
                  src={message.imageUrl}
                  alt='imageUrl'
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }

        {/* Video display */}
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div onClick={handleClearVideo} className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
                <IoClose size={30}/>
              </div>
              <div className='bg-white p-1'>
                <video
                  src={message.videoUrl}
                  className='aspect-video w-full h-full max-w-sm m-2'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
              <Loading/>
            </div>
          )
        }
      </section>

      {/* Send messages */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleUpload} className='flex justify-center items-center w-10 h-10 hover:text-white hover:bg-primary rounded-full'>
            <FaPlus size={25}/>
          </button>

          {
            openImageVideo && (
              <div className='bg-white shadow rounded absolute bottom-14 w-30 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-3 gap-3 hover:bg-slate-200 hover:rounded cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={20}/>
                    </div>
                    <p className='font-semibold text-sm'>Image</p>
                  </label>
                  <input
                    type='file'
                    id='uploadImage'
                    name='uploadImage'
                    onChange={handleUploadImage}
                    className='hidden'
                  />

                  <label htmlFor='uploadVideo' className='flex items-center p-3 gap-3 hover:bg-slate-200 hover:rounded cursor-pointer'>
                    <div className='text-purple-600'>
                      <FaVideo size={20}/>
                    </div>
                    <p className='font-semibold text-sm'>Video</p>
                  </label>
                  <input
                    type='file'
                    id='uploadVideo'
                    name='uploadVideo'
                    onChange={handleUploadVideo}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }
        </div>

        {/* Message Input */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Enter your message....'
            className='py-1 px-5 w-full h-full outline-none'
            value={message.text}
            onChange={handleOnChange}
          />

          <button className='mr-2 hover:text-primary'>
            <IoSend size={28}/>
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage;