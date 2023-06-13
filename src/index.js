import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { BloctoWallet } from '@blocto/aptos-wallet-adapter-plugin';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WalletCore, NetworkName } from '@aptos-labs/wallet-adapter-core';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

let network = NetworkName.Testnet;
const wallets = [
  new PetraWallet(),
  new BloctoWallet({
    network: network,
    bloctoAppId: '84503da4-7d0f-4ced-b004-ecd81bfc333b',
  }),
  new MartianWallet(),
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <ToastContainer />
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
