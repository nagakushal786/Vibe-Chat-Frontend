import React from 'react';
import AvatarPage from './AvatarPage';
import { Link } from 'react-router-dom';

const UserCard = ({user, onClose}) => {
  return (
    <Link to={`/home/${user._id}`} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer'>
        <div>
            <AvatarPage
              width={50}
              height={50}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
        </div>
        <div>
            <div className='font-semibold text-secondary text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm text-ellipsis line-clamp-1'>
                {user?.email}
            </p>
        </div>
    </Link>
  )
}

export default UserCard;