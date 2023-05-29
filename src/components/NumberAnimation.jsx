import FlipNumbers from 'react-flip-numbers';
import { useEffect, useRef, useState } from 'react';

export default function NumberAnimation({ animationNumber }) {
  const timer = useRef(null);
  const [number, setNumber] = useState(animationNumber ?? 5500);

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setNumber((prev) => prev + 1);
    }, 1000);
  }, []);

  return (
    <div className='App'>
      <FlipNumbers
        height={30}
        width={30}
        color='black'
        // background="red"
        play
        className='number-animation'
        perspective={400}
        numbers={String(number)}
      />
         
    </div>
  );
}
