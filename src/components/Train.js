import React, { useEffect } from 'react';
import TrainImage from '../images/trainnnn.gif';
const Train = () => {
  useEffect(() => {}, []);

  return (
    <div style={{ marginBottom: 30 }} className='gif-container' speed='10ms'>
      <img
        src={TrainImage}
        alt='image'
        className='md:h-[250px]  lg:w-[630px] lg:h-[260px]  object-cover'
      />
    </div>
  );
};

export default Train;
