import React from "react";
import { BsCheckAll } from "react-icons/bs";

const Congratulations = ({ donatedAmount }) => {
  return (
    <div>
      <div className="flex items-center gap-[1rem]">
        <BsCheckAll className="text-green-400" />
        <p className="text-lg text-gray-600">
          {donatedAmount} Apt donated Successfully
        </p>
      </div>
      <p className="font-semibold text-lg">
        Thank you for contributing to Aptos
      </p>
    </div>
  );
};
export default Congratulations;
