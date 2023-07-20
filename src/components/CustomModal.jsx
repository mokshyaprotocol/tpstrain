import React from 'react';
import { Button, Modal } from 'antd';

const CustomModal = ({
  modalActiveFor,
  setModalActiveFor,
  children,
  title,
  showOk,
  setHasDonated,
}) => {
  const handleOk = () => {
    setModalActiveFor('');
    setHasDonated(false);
  };

  const handleCancel = () => {
    setModalActiveFor('');
    setHasDonated(false);
  };

  return (
    <>
      <Modal
        className='w-fit min-w-[300px] min-h-[400px] transition-all'
        width={'fit'}
        title={title}
        open={!!modalActiveFor}
        onOk={handleOk}
        okButtonProps={{ className: `bg-primary ${!showOk && 'hidden'} ` }}
        cancelButtonProps={{ className: `hidden` }}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;
