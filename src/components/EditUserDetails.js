import React, { useEffect, useRef, useState } from 'react';
import AvatarPage from './AvatarPage';
import uploadFile from '../helpers/uploadImage';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'

const EditUserDetails = ({onClose, user}) => {

    const [data, setData]=useState({
        _id: user._id,
        name: user.name,
        profile_pic: user.profile_pic
    });
    const uploadPhotoRef=useRef();
    const dispatch=useDispatch();

    useEffect(()=> {
        setData((prevData)=> {
            return {
                ...prevData,
                ...user
            }
        })
    }, [user]);

    const handleOnChange=(e)=> {
        const {name, value}=e.target;

        setData((prevState)=> {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleOpenUploadPhoto=(e)=> {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    }

    const handleUploadPhoto=async (e)=> {
        const file=e.target.files[0];

        const photo=await uploadFile(file);

        setData((prevData)=> {
            return {
                ...prevData,
                profile_pic: photo?.url
            }
        })
    }

    const handleSubmit=async (e)=> {
        e.preventDefault();
        e.stopPropagation();
        try{
            const postUrl=`${process.env.REACT_APP_BACKEND_URL}/api/update`;

            const response=await axios({
                method: "post",
                url: postUrl,
                data: data,
                withCredentials: true
            });

            toast.success(response?.data?.message);
            console.log("Current user details:",response);

            if(response?.data?.success){
                dispatch(setUser(response?.data?.data));
                onClose();
            }
        }catch(error){
            toast.error(error?.response?.data?.message);
        }
    }

    return (
      <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-7 m-1 rounded w-full max-w-sm'>
          <h2 className='font-semibold text-center text-primary text-3xl'>Profile Details</h2>
          <p className='text-sm text-center font-extrabold mt-1'>Edit user details</p>

          <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                <label className='font-semibold mb-2'>Name: </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={data.name}
                  onChange={handleOnChange}
                  className='w-full py-1 px-2 focus:outline-primary border'
                />
            </div>

            <div>
                <p className='font-semibold mb-2'>Profile Picture:</p>
                <div className='my-1 flex items-center gap-5'>
                    <AvatarPage
                      width={45}
                      height={45}
                      imageUrl={data?.profile_pic}
                      name={data?.name}
                    />
                    <label htmlFor='profile_pic'>
                    <button className='font-semibold border-primary p-1 text-primary' onClick={handleOpenUploadPhoto}>Change Photo</button>
                    <input
                      type='file'
                      name='profile_pic'
                      id='profile_pic'
                      className='hidden'
                      onChange={handleUploadPhoto}
                      ref={uploadPhotoRef}
                    />
                    </label>
                </div>
            </div>

            <Divider/>
            <div className='flex justify-between'>
                <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                <button onClick={handleSubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-white hover:text-primary'>Update</button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default React.memo(EditUserDetails);