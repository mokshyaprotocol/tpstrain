import FlipNumbers from 'react-flip-numbers';
import { useEffect, useRef, useState } from 'react';

export default function NumberAnimation({ animationNumber }) {
  console.log('animationNumber', animationNumber);
  const timer = useRef(null);
  const [number, setNumber] = useState(animationNumber);

  useEffect(() => {
    // clearInterval(timer.current);
    // timer.current = setInterval(() => {
    //   setNumber((prev) => prev + 1);
    // }, 1000);
    setNumber(animationNumber);
  }, [animationNumber]);

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
        // numbers='20'
      />
         
    </div>
  );
}
