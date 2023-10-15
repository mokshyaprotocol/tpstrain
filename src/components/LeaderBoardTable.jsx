import React from 'react';
import {Space, Table, Tag} from 'antd';

const columns = [
  {
    align: 'left',
    title: 'Wallet Address',
    dataIndex: 'name',
    key: 'name',
  },

  {
    align: 'right',
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
];

const App = (props) => {
  const {leaderboard} = props;
  const loading = false;
  return (
    <div className="table-modal">
      <h1 className="text-center">Leaderboard</h1>
      <Table
        loading={loading}
        size="small"
        sticky={true}
        bordered={false}
        columns={columns}
        dataSource={leaderboard}
        pagination={false}
        className="w-[500px] mt-[1rem] leaderboard_table "
      />
    </div>
  );
};

export default App;
