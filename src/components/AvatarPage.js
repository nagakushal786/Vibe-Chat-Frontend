/* eslint-disable no-lone-blocks */
import React from 'react';
import { LuUserCircle2 } from "react-icons/lu";
import { useSelector } from 'react-redux';

const AvatarPage = ({userId, name, imageUrl, width, height}) => {

  const onlineUser=useSelector(state=> state?.user?.onlineUser);

  let avatarName="";

  if(name){
    const splitName=name?.split(" ");

    if(splitName.length>1){
      avatarName=splitName[0][0]+splitName[1][0];
    }else{
      avatarName=splitName[0][0];
    }
  }

  const bgColours=[
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-cyan-200",
    "bg-gray-200",
    "bg-sky-200",
    "bg-blue-200",
  ];

  const randIndex=Math.floor(Math.random()*bgColours.length);

  const isOnline=onlineUser.includes(userId);

  return (
    <div className={`text-slate-800 rounded-full font-bold relative`} style={{width: width+"px", height: height+"px"}}>
      {
        imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            width={width}
            height={height}
            className='rounded-full'
            style={{
              width: `${width}px`,
              height: `${height}px`,
              objectFit: 'fill'
            }}
          />
        ) : (
          name ? (
            <div style={{width: width+"px", height: height+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center font-bold text-lg ${bgColours[randIndex]}`}>
              {avatarName}
            </div>
          ) : (
            <div className='w-fit mx-auto mt-4'>
              <LuUserCircle2 size={width}/>
            </div>
          )
        )
      }

      {
        isOnline && (
          <div
            className='absolute z-10 bottom-0 right-0 w-3 h-3 bg-green-600 border border-white rounded-full'
            style={{ boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)' }}
          ></div>
        )
      }
    </div>
  )
}

export default AvatarPage;

{/* <div className='bg-green-600 p-1 bottom-2 absolute right-1 z-10 rounded-full'></div> */}