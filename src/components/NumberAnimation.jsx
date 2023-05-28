import FlipNumbers from "react-flip-numbers";
import { useEffect, useRef, useState } from "react";

export default function NumberAnimation({animationNumber}) {
  const timer = useRef(null);
  const [number, setNumber] = useState(animationNumber ?? 5500);

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setNumber((prev) => prev + 1);
    }, 1000);
  }, []);

  return (
    <div className="App">
      <FlipNumbers
        height={40}
        width={40}
        color="black"
        // background="red"
        play
        perspective={400}
        numbers={String(number)}
      />
    </div>
  );
}