import React from "react";
import { Space, Table, Tag } from "antd";
import { FaMedal } from "react-icons/fa";
import medal1 from "../images/medal1.png";
import medal2 from "../images/medal2.png";
import medal3 from "../images/medal3.png";
import medal4 from "../images/medal4.png";
import medal5 from "../images/medal5.png";

const medals = [medal1, medal2, medal3, medal4, medal5];
const columns = [
  {
    align: "left",
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (value) => {
      return (
        <img
          src={medals[value - 1]}
          alt={`medal${value}`}
          width={30}
          height={30}
        />
      );
    },
  },
  {
    align: "left",
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
 
  {
    align: "left",
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
];

const data = [
  {
    key: "1",
    rank: 1,
    name: "John Brown",
    times: 32,
    amount: 2000,
  },
  {
    key: "1",
    rank: 2,
    name: "John Brown",
    times: 32,
    amount: 2000,
  },
  {
    key: "3",
    rank: 3,
    name: "John Brown",
    times: 32,
    amount: 2000,
  },
  {
    key: "4",
    rank: 4,
    name: "John Brown",
    times: 32,
    amount: 2000,
  },
  {
    key: "5",
    rank: 5,
    name: "John Brown",
    times: 32,
    amount: 2000,
  },
];

const App = () => {
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
        dataSource={data}
        pagination={false}
        className="w-[500px] mt-[1rem] leaderboard_table "
      />
    </div>
  );
};

export default App;
