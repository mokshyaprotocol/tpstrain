import './App.css';
import Train from './components/Train';
import Bottom from './components/Bottom';
import CustomModal from './components/CustomModal';
import { useEffect, useState } from 'react';
import { CONNECT_WALLET, DONATION, LEADERBOARD } from './constants';
import LeaderBoardTable from './components/LeaderBoardTable';
import DonationForm from './components/DonationForm';
import { FaMedal } from 'react-icons/fa';
import Logo from './images/logo.png';
import Loading from './components/Loading';
import Congratulations from './components/Congratulations';
import { Button, Modal } from 'antd';

import FlipNumbers from 'react-flip-numbers';
import NumberAnimation from './components/NumberAnimation';
import { getTpsByBlockHeight } from './helper/tpsCalculator';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { MartianWalletName } from '@martianwallet/aptos-wallet-adapter';
import { BloctoWalletName } from '@blocto/aptos-wallet-adapter-plugin';
import PetraIcon from '../src/images/petra.png';
import BlocktoIcon from '../src/images/blockto.png';
import MartianIcon from '../src/images/martian.png';

import { ConnectWallet } from './components/ConnectWallet';

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
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [walletConnected, setWalletConnected] = useState(false);

  const { signAndSubmitTransaction, disconnect, connect, account } =
    useWallet();

  useEffect(() => {
    if (account) {
      localStorage.setItem('wallet', account);
      setWalletConnected(true);
      setWalletAddress(account.address);
      setModalActiveFor('');
    }
  }, [account]);

  useEffect(() => {
    setShowOk(hasDonated);
    if (hasDonated) {
      setTitle('Congratulations!!');
    } else {
      setTitle('');
    }
  }, [hasDonated]);

  const displayWalletAddress = () => {
    return walletAddress
      ? walletAddress.slice(0, 4) + '....' + walletAddress.slice(-4)
      : 'Connect Wallet';
  };

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
        // console.log({ tps });
        setData(tps);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 3000); // Fetch data every 2 seconds

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

  const submitDonate = async () => {
    setLoading(true);
    const amount = +donatedAmount * Math.pow(10, 8);

    try {
      const response = await fetch(
        `https://api.tpstrain.com/get_source_address?amount=${amount}&wallet_address=${walletAddress}`
      );
      if (response.status === 502) {
        toast.error('Deposit failed. Please try again!.');
        return;
      }
      const data = await response.json();
      const payload = {
        function: '0x1::aptos_account::transfer',
        // function: '0x1::coin::transfer',
        // type_arguments: ['0x1::aptos_coin::AptosCoin'],
        type_arguments: [],
        arguments: [data.source_address, amount],
      };
      const transaction = await signAndSubmitTransaction(payload);

      const processTransaction = await axios.post(
        'https://api.tpstrain.com/process_transactions',
        {
          wallet_address: walletAddress,
          balance: amount,
          txnhash: transaction?.hash,
        }
      );
      toast.success('APT deposited successfully.');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleConnectWallet = (walletName) => {
    let openSelectedWallet = '';
    if (walletName === 'petra') {
      openSelectedWallet = PetraWalletName;
    } else if (walletName === 'blockto') {
      openSelectedWallet = BloctoWalletName;
    } else if (walletName === 'martian') {
      openSelectedWallet = MartianWalletName;
    }

    connect(openSelectedWallet);
    setModalActiveFor('');
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
    <div className='container'>
      <div className='tps-train-container'>
        <div className='tps-train-title' style={{ display: 'flex' }}>
          <div className='img-logo-holder'>
            <img
              src={Logo}
              alt='logo'
              className='object-contain h-[30px] lg:h-[40px] title-logo'
            />
          </div>
          <div className='head_button_wrap'>
            <Button
              className='mx-auto flex items-center'
              icon={
                <FaMedal className='text-[#E8E254] font-extrabold text-3xl ' />
              }
              size='middle'
              type='ghost'
              onClick={handleLeaderBoard}
            >
              <span className='text-2xl font-semibold'> Leaderboard</span>
            </Button>
            <Button
              onClick={() => {
                setModalActiveFor(CONNECT_WALLET);
                handleWallet();
                // setWalletOpen(true);
              }}
              type='ghost'
              style={{ width: '143px', height: '30px' }}
              className='tps_primary-btn text-white my-[2.6rem] md:my-[1.9rem]  flex mx-auto justify-center items-center w-[160px] h-[52px] md:w-[200px] lg:w-[270px]  md:h-[50px] lg:h-[60px]'
            >
              {displayWalletAddress()}
            </Button>
          </div>
        </div>
        {/* <ConnectWallet /> */}
        <div className='tps-train-image'>
          <Train tpsValue={tpsValue} />
        </div>
        <div className='donate-text'>
          <h3 className='text-2xl md:mt-[1rem]' style={{ fontSize: 23 }}>
            "Donate Apt to make the train move faster"
          </h3>
        </div>
        <div className='tps-train-score-btn'>
          {tpsValue && <NumberAnimation animationNumber={tpsValue} />}

          <Button
            onClick={() => {
              if (walletAddress) {
                handleDonate();
              } else {
                handleWallet();
              }
            }}
            type='ghost'
            className='tps_primary-btn tps_primary-btn__inverted text-white my-[2.6rem] md:my-[1.9rem]  flex mx-auto justify-center items-center w-[160px] h-[52px] md:w-[200px] lg:w-[270px]  md:h-[50px] lg:h-[60px]'
          >
            DONATE NOW
          </Button>
        </div>
        <div className='tps-train-leaderboard'>
          <p className='text-xl mt-[1rem] text-center' style={{ fontSize: 18 }}>
            Aptos is super fast. Don’t believe it? Donate APT to stress test.
          </p>
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
        <Modal
          title='Connect Wallet'
          open={modalActiveFor === CONNECT_WALLET}
          className='connect-wallet-modal'
          onOk={() => {}}
          onCancel={() => {
            setModalActiveFor('');
          }}
        >
          <div className='connect_wallet_modal'>
            <ul>
              <li>
                <div className='icon-wrap'>
                  <img src={PetraIcon} alt='' />
                </div>
                <p
                  className='wallet_item'
                  onClick={() => handleConnectWallet('petra')}
                >
                  Petra
                </p>
              </li>
              <li>
                <div className='icon-wrap'>
                  <img src={BlocktoIcon} alt='' />
                </div>
                <p
                  className='wallet_item'
                  onClick={() => handleConnectWallet('blockto')}
                >
                  Blockto
                </p>
              </li>
              <li>
                <div className='icon-wrap'>
                  <img src={MartianIcon} alt='' />
                </div>
                <p
                  className='wallet_item'
                  onClick={() => handleConnectWallet('martian')}
                >
                  Martian.
                </p>
              </li>
            </ul>
          </div>
        </Modal>

        {modalActiveFor == DONATION && (
          <CustomModal
            showOk={showOk}
            modalActiveFor={modalActiveFor}
            setHasDonated={setHasDonated}
            setModalActiveFor={setModalActiveFor}
            title={title}
          >
            {modalActiveFor == DONATION && !hasDonated && !isLoading && (
              <DonationForm
                loading={loading}
                hasDonated={hasDonated}
                isLoading={isLoading}
                donatedAmount={donatedAmount}
                setHasDonated={setHasDonated}
                setModalActiveFor={setModalActiveFor}
                setTitle={setTitle}
                showOk={showOk}
                setShowOk={setShowOk}
                handleDonate={() => {
                  submitDonate();
                  setModalActiveFor('');
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
        )}
      </div>
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
