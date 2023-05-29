import React, { useRef, useEffect } from 'react';
import TrainImage from '../images/trainnnn.gif';
import gifshot from 'gifshot';

const Train = () => {
  const gifRef = useRef(null);
  useEffect(() => {
    // Function to adjust the GIF speed
    const adjustGifSpeed = () => {
      gifshot.createGIF(
        {
          gifWidth: 300,
          gifHeight: 200,
          images: [TrainImage],
          interval: 1, // Adjust the interval to control the speed
        },
        (obj) => {
          if (!obj.error) {
            console.log('gif', gifRef);
            gifRef.current.src = obj.image;
          }
        }
      );
    };

    // Call the function to adjust the GIF speed
    adjustGifSpeed();
  }, []);

  return (
    <div style={{ marginBottom: 30 }} className='gif-container' speed='10ms'>
      <img
        src={TrainImage}
        ref={gifRef}
        alt='image'
        className='md:h-[250px]  lg:w-[630px] lg:h-[260px]  object-cover'
      />
    </div>
  );
};

export default Train;
