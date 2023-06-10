import './App.css';
import Train from './components/Train';
import Bottom from './components/Bottom';
import CustomModal from './components/CustomModal';
import { useEffect, useState } from 'react';
import { DONATION, LEADERBOARD } from './constants';
import LeaderBoardTable from './components/LeaderBoardTable';
import DonationForm from './components/DonationForm';
import { FaMedal } from 'react-icons/fa';
import Logo from './images/logo.png';
import Loading from './components/Loading';
import Congratulations from './components/Congratulations';
import { Button } from 'antd';

import FlipNumbers from 'react-flip-numbers';
import NumberAnimation from './components/NumberAnimation';
import { getTpsByBlockHeight } from './helper/tpsCalculator';
import axios from 'axios';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { MartianWalletName } from '@martianwallet/aptos-wallet-adapter';
function App() {
  const [modalActiveFor, setModalActiveFor] = useState('');
  const [title, setTitle] = useState('');
  const [showOk, setShowOk] = useState('');
  const [hasDonated, setHasDonated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState('20s');
  const [tpsValue, setData] = useState(null);
  const [openWalletModal, setOpenWalletModal] = useState();

  const [walletConnected, setWalletConnected] = useState(false);

  const { signAndSubmitTransaction, disconnect, connect, account } =
    useWallet();

  useEffect(() => {
    console.log('account', account);
    if (account) {
      localStorage.setItem('wallet', account);
      setWalletConnected(true);
    }
  }, [account]);

  const getAnimationDuration = (value) => {
    if (value >= 10 && value <= 100) {
      return '5s'; // Animation duration for the range 0-10
    } else if (value >= 100 && value <= 200) {
      return '10s'; // Animation duration for the range 20-50
    } else if (value >= 200 && value <= 300) {
      return '15s'; // No animation duration for other values
    }
    if (value >= 300 && value <= 400) {
      return '20s';
    }
    if (value >= 400 && value <= 500) {
      return '25s';
    }
  };

  const handleWallet = async () => {
    try {
      console.log('cliced');
      connect(PetraWalletName);
    } catch (e) {
      console.log('connect error', e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://fullnode.testnet.aptoslabs.com/v1/'
        );
        // console.log({ response: +response.data.block_height });
        const tps = await getTpsByBlockHeight(+response.data.block_height);
        console.log({ tps });
        setData(tps);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 2000); // Fetch data every 2 seconds

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, []);

  const handleDonate = () => {
    setModalActiveFor(DONATION);
  };

  const handleLeaderBoard = () => {
    setModalActiveFor(LEADERBOARD);
  };

  function test() {
    getTpsByBlockHeight(90337792);
  }

  //step 1
  const submitDonate = async () => {
    const amount = +donatedAmount * Math.pow(10, 8);
    // let address =
    //   '0x820197629592f750e2aea8fba610dd6aa0ae886073dfd04e1c90586fbfa7aa09';
    let address =
      '0x9e2790f6dad1eeb411004651478cfcc5adf4808420fa11006a3c1d19318f2f8f';
    try {
      const response = await fetch(
        `https://api.tpstrain.com/get_source_address?amount=${amount}&wallet_address=${address}`
      );
      const data = await response.json();
      const payload = {
        function: '0x1::aptos_account::transfer',
        // function: '0x1::coin::transfer',
        // type_arguments: ['0x1::aptos_coin::AptosCoin'],
        type_arguments: [],
        arguments: [data.source_address, amount],
      };
      const transaction = await signAndSubmitTransaction(payload);
      console.log({ data, transaction });

      const processTransaction = await axios.post(
        'https://api.tpstrain.com/process_transactions',
        {
          wallet_address: address,
          balance: amount,
          txnhash: transaction?.hash,
        }
      );
      console.log({ processTransaction });
    } catch (err) {
      console.log(err);
    }
  };

  // title
  useEffect(() => {
    setShowOk(hasDonated);
    if (hasDonated) {
      setTitle('Congratulations!!');
    } else {
      setTitle('');
    }
  }, [hasDonated]);

  return (
    <div className='tps-train-container'>
      <div className='tps-train-title' style={{ display: 'flex' }}>
        <img
          src={Logo}
          alt='logo'
          className='object-contain h-[30px] lg:h-[40px] title-logo'
        />

        <Button
          onClick={() => {
            handleWallet();
            // setWalletOpen(true);
          }}
          type='ghost'
          style={{ width: '143px', height: '30px', marginLeft: '1259px' }}
          className='bg-primary text-white my-[2.6rem] md:my-[1.9rem]  flex mx-auto justify-center items-center w-[160px] h-[52px] md:w-[200px] lg:w-[270px]  md:h-[50px] lg:h-[60px]'
        >
          Connect Wallet
        </Button>
      </div>
      {/* <ConnectWallet /> */}
      <div className='tps-train-image'>
        <Train />
      </div>
      <div className='donate-text'>
        <h3 className='text-2xl md:mt-[1rem]' style={{ fontSize: 23 }}>
          "Donate APt to make the train move faster"
        </h3>
      </div>
      <div className='tps-train-score-btn'>
        {/* <h2
          className='font-bold text-4xl mt-[3rem]'
          style={{ textAlign: 'center' }}
        >
          5500
        </h2> */}
        {tpsValue && <NumberAnimation animationNumber={tpsValue} />}

        <Button
          onClick={() => {
            console.log('donate now clicked', walletConnected);
            if (walletConnected) {
              handleDonate();
            } else {
              handleWallet();
            }
          }}
          type='ghost'
          className='bg-primary text-white my-[2.6rem] md:my-[1.9rem]  flex mx-auto justify-center items-center w-[160px] h-[52px] md:w-[200px] lg:w-[270px]  md:h-[50px] lg:h-[60px]'
        >
          DONATE NOW
        </Button>
      </div>
      <div className='tps-train-leaderboard'>
        <p className='text-xl mt-[1rem] text-center' style={{ fontSize: 18 }}>
          Aptos is super fast. Don’t believe it? Donate APT to stress test.
        </p>
        <Button
          className='mx-auto w-full flex items-center justify-center leaderboard-btn'
          icon={<FaMedal className='text-[#E8E254] font-extrabold text-3xl ' />}
          size='middle'
          type='ghost'
          onClick={handleLeaderBoard}
        >
          <span className='text-2xl font-semibold'> Leaderboard</span>
        </Button>
        <p
          className='mt-[0.5rem] text-gray-600 text-center'
          style={{ fontSize: 12 }}
        >
          TPS Train V1.6
        </p>
        <p className='mt-[0.1rem] text-gray-500 text-center'>
          &copy; TPS Train
        </p>
      </div>

      <CustomModal
        showOk={showOk}
        modalActiveFor={modalActiveFor}
        setHasDonated={setHasDonated}
        setModalActiveFor={setModalActiveFor}
        title={title}
      >
        {modalActiveFor == DONATION && !hasDonated && !isLoading && (
          <DonationForm
            hasDonated={hasDonated}
            isLoading={isLoading}
            donatedAmount={donatedAmount}
            setHasDonated={setHasDonated}
            setModalActiveFor={setModalActiveFor}
            setTitle={setTitle}
            showOk={showOk}
            setShowOk={setShowOk}
            handleDonate={() => {
              console.log('final donate');
              submitDonate();
            }}
            setDonatedAmount={setDonatedAmount}
            setIsLoading={setIsLoading}
          />
        )}
        {modalActiveFor == LEADERBOARD && !hasDonated && !isLoading && (
          <LeaderBoardTable />
        )}

        {isLoading && <Loading />}
        {hasDonated && <Congratulations donatedAmount={donatedAmount} />}
      </CustomModal>
    </div>
    // <div className="App grid grid-cols-1 items-center justify-items-center w-[90%] md:w-[90%] lg:w-[90%] xl:w-[90%] 2xl:w-[80%] pt-[1rem]  mx-auto max-h-[100vh] overflow-hidden">
    // <img
    //   src={Logo}
    //   alt="logo"
    //   className="object-contain h-[30px] lg:h-[40px]"
    // />
    //   <Train />
    //   <Bottom
    //     modalActiveFor={modalActiveFor}
    //     setModalActiveFor={setModalActiveFor}
    //   />

    // </div>
  );
}

export default App;

// Deposit click garda
// step1 : https://api.tpstrain.com/get_source_address?amount=200000000

// response {
//     id,
//     source_address:'sdfdsf'
// }

// step2: signAndSubmitTransaction call from aptos warkade sdk
//  const payload = {
//       function:
//         '0x1::aptos_account::transfer',
//       type_arguments: [],
//       arguments: ['source_address','amount'],
//     };

//     step3: https://api.tpstrain.com/process_transactions

//     body {
//         id,
//         amount:

//     }
