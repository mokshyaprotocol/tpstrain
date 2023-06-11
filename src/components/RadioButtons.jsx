import React, { useRef } from "react";

const RadioButtons = ({ radioData, setDonatedAmount }) => {
  const handleClick = (e) => {
    setDonatedAmount(Number(e.target.value));
  };
  return (
    <ul class="donate-now grid grid-cols-3 gap-[3.5rem] mt-[1rem]">
      {radioData?.items?.map((item, index) => {
        return (
          <li
            key={index}
            className=" border border-secondary group hover:text-white depo-selector  rounded-lg cursor-pointer relative w-[88px] h-[88px] ">
            <input
              onClick={handleClick}
              type="radio"
              id={item.id}
              name={radioData.name}
              value={item.value}
              className="cursor-pointer peer  rounded-lg invisible  checked:bg-primary  checked:text-white hover:bg-primary group-hover:text-white hover:text-white w-full h-full  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] right-0 bottom-0 block z-50"
            />
            <label
              for={item.label}
              className=" peer-hover:text-white group-hover:text-white cursor-pointer group-hover:bg-primary peer-hover:cursor-pointer rounded-lg  text-center  flex items-center w-full h-full justify-center text-3xl peer-checked:bg-primary peer-checked:text-white">
              {item.label}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default RadioButtons;
