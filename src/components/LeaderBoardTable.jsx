import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { FaMedal } from 'react-icons/fa';
import medal1 from '../images/medal1.png';
import medal2 from '../images/medal2.png';
import medal3 from '../images/medal3.png';
import medal4 from '../images/medal4.png';
import medal5 from '../images/medal5.png';

const medals = [medal1, medal2, medal3, medal4, medal5];
const columns = [
  {
    align: 'left',
    title: 'Wallet Address',
    dataIndex: 'name',
    key: 'name',
  },

  {
    align: 'left',
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
];

const App = (props) => {
  const { leaderboard } = props;
  const loading = false;
  return (
    <div className='table-modal'>
      <h1 className='text-center'>Leaderboard</h1>
      <Table
        loading={loading}
        size='small'
        sticky={true}
        bordered={false}
        columns={columns}
        dataSource={leaderboard}
        pagination={false}
        className='w-[500px] mt-[1rem] leaderboard_table '
      />
    </div>
  );
};

export default App;
