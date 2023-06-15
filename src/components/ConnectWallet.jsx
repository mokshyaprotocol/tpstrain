import React from 'react';

export const ConnectWallet = ({ handleClose, handleConnect }) => {
  return (
    <div className="connect_wallet_modal">
      <div className='mt-[2rem] flex flex-col'>
        <ul style={{ background: 'red' }}>
          <li>Petra</li>
          <li>Blockto</li>
          <li>Matrian</li>
        </ul>
      </div>
    </div>
  );
};
