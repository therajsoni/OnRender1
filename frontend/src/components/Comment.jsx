import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className='my-2'>
      <div className='flex items-start gap-3'>
        <Avatar className='w-10 h-10'> {/* Adjust size for responsiveness */}
          <AvatarImage src={comment?.author?.profilePicture} alt={comment?.author?.username} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='font-bold text-sm'>
            {comment?.author?.username}
          </h1>
          <p className='font-normal text-xs pl-1'>{comment?.text}</p> {/* Adjust text size */}
        </div>
      </div>
    </div>
  );
};

export default Comment;
