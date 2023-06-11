import React, { useState } from 'react';
import RadioButtons from './RadioButtons';
import { Button } from 'antd';

const DonationForm = ({
  setIsLoading,
  setDonatedAmount,
  setHasDonated,
  handleDonate,
  loading,
}) => {
  const radioData = {
    name: 'amount',
    items: [
      { id: 0.1, value: 0.1, label: 0.1 },
      { id: 0.5, value: 0.5, label: 0.5 },
      { id: 1, value: 1, label: 1 },
      { id: 2, value: 2, label: 2 },
      { id: 3, value: 5, label: 3 },
      { id: 5, value: 5, label: 5 },
    ],
  };

  // const handleDonate = async (e) => {
  //   // set loading to true
  //   setIsLoading(true);
  //   // let response = await new Promise((r) => setTimeout(r, 2000));
  //   setIsLoading(false);

  //   setHasDonated(true);
  // };
  return (
    <div className='mt-[2rem] flex flex-col '>
      <RadioButtons radioData={radioData} setDonatedAmount={setDonatedAmount} />
      <Button
        onClick={handleDonate}
        type='ghost'
        className='mx-auto bg-primary mt-[2.5rem] w-[130px] h-[50px]  text-white'
      >
        {loading ? 'loading...' : 'Donate'}
      </Button>
    </div>
  );
};

export default DonationForm;
