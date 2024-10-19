/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import UserCard from './UserCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {
    const [searchUser, setSearchUser]=useState([]);
    const [loading, setLoading]=useState(false);
    const [search, setSearch]=useState("");

    const handleSearchUser=async ()=> {
        try{
            setLoading(true);
            const postUrl=`${process.env.REACT_APP_BACKEND_URL}/api/search`;

            const response=await axios.post(postUrl, {
                search: search
            });
            setLoading(false);

            setSearchUser(response?.data?.data);
        }catch(error){
            toast.error(error?.response?.data?.message);
        }
    }

    useEffect(()=> {
        handleSearchUser();
    }, [search]);

    console.log(searchUser);

    return (
        <div className='fixed left-0 right-0 top-0 bottom-0 bg-slate-700 bg-opacity-50 p-2 z-10'>
            {/* Search bar */}
            <div className='w-full max-w-lg mx-auto mt-10 m-2 relative'>
                <div className='bg-white rounded h-14 overflow-hidden flex'>
                    <input
                      type='text'
                      placeholder='Search User by name, email....'
                      className='w-full outline-none py-1 px-4 h-full'
                      onChange={(e)=> setSearch(e.target.value)}
                      value={search}
                    />
                    <div className='h-14 w-14 flex justify-center items-center'>
                      <IoSearchOutline size={25}/>
                      <button className='text-secondary hover:text-red-600 p-1' onClick={onClose}>
                        <IoClose size={25}/>
                      </button>
                    </div>
                </div>

                {/* Display search user */}
                <div className='bg-white mt-2 w-full p-4 rounded'>
                    {/* No user found */}
                    {
                        searchUser.length===0 && !loading && (
                            <p className='text-center text-slate-500 font-semibold'>No User found &#x1F61E;</p>
                        )
                    }

                    {
                        loading && (
                            <p><Loading/></p>
                        )
                    }

                    {
                        searchUser.length!==0 && !loading && (
                            searchUser.map((user, idx)=> {
                                return (
                                    <UserCard key={idx} user={user} onClose={onClose}/>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchUser;