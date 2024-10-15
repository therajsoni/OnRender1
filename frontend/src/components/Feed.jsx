import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-20'>
      <Posts />
    </div>
  );
};

export default Feed;
