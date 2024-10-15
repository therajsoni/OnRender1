// Tread.js
import React, { useState } from 'react';
import TreadData from './TreadData';
import Chart from './Chart';

const Tread = () => {
  const [length, setLength] = useState(1);
  let element = [];

  for (let a = 1; a <= length; a++) {
    element.push(<div key={a} className='m-5'><Chart title={''} description={''} text={''} /></div>);
  }

  return (
    <div className='ml-[290px] m-12'>
      <h1 className='text-center mr-8 m-12 text-xl font-extrabold'>MY BLOG</h1>
      <div className='grid m-16 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '>
        <TreadData />
        {element}
        <div className="max-h-fit max-w-fit pl-[69px] pr-[69px] pt-[145px] pb-[145px] bg-yellow-700 rounded-sm m-5 mt-7 opacity-70">
          <div onClick={() => setLength((prev) => prev + 1)} className='pr-7 pl-7 pt-9 pb-9 text-white rounded-2xl border-2 border-dashed'>
            Create Blog
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tread;
