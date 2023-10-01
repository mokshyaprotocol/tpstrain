import React from 'react';

export const DiconnectModal = ({isOpen, onCancel, onConfirm}) => {
  console.log('disconnect', onConfirm, onCancel);
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h2 style={{fontSize: 20}}>Disconnect Wallet</h2>
          <p onClick={() => console.log('123')}>
            Disconnect current wallet to connect another wallet
          </p>
          <div className="modal-buttons">
            <button
              className="cancel-button"
              onClick={() => {
                console.log('23');
                // onCancel();
              }}
            >
              Cancel
            </button>
            <button className="delete-button" onClick={onConfirm}>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    )
  );
};
