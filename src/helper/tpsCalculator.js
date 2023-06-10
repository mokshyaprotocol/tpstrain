const moment = require('moment');
const { useEffect, useState } = require('react');
const { AptosClient } = require('aptos');
// import { WalletCore, NetworkName } from '@aptos-labs/wallet-adapter-core';

const TPS_FREQUENCY = 600; // calculate tps every 600 blocks

const ResponseErrorType = {
  NOT_FOUND: 'Not found',
  UNHANDLED: 'Unhandled',
  TOO_MANY_REQUESTS: 'To Many Requests',
};

function ensureMillisecondTimestamp(timestamp) {
  if (timestamp.length > 13) {
    timestamp = timestamp.slice(0, 13);
  }
  if (timestamp.length === 10) {
    timestamp = timestamp + '000';
  }
  return parseInt(timestamp);
}

function parseTimestamp(timestamp) {
  return moment(ensureMillisecondTimestamp(timestamp));
}

// {
//     "endBlock": {
//         "block_height": "90319525",
//         "block_hash": "0x3b72455cddc3f78c1d0abb1dc9e55c173b35161a5b6e231b8b03e3f10f1ca29a",
//         "block_timestamp": "1685877837718986",
//         "first_version": "538967653",
//         "last_version": "538967706",
//         "transactions": null,
//         "__headers": {
//             "content-length": "221",
//             "content-type": "application/json; charset=utf-8"
//         }
//     }
// }

function calculateTps(startBlock, endBlock) {
  const startTransactionVersion = parseInt(startBlock.last_version);
  const endTransactionVersion = parseInt(endBlock.last_version);

  const startTimestamp = parseTimestamp(startBlock.block_timestamp);
  const endTimestamp = parseTimestamp(endBlock.block_timestamp);
  const duration = moment.duration(endTimestamp.diff(startTimestamp));
  const durationInSec = duration.asSeconds();

  return (endTransactionVersion - startTransactionVersion) / durationInSec;
}

async function withResponseError(promise) {
  return await promise.catch((error) => {
    console.error('ERROR!', error, typeof error);
    if (typeof error === 'object' && 'status' in error) {
      error = error;
      if (error.status === 404) {
        throw { type: ResponseErrorType.NOT_FOUND };
      }
    }
    if (
      error.message
        .toLowerCase()
        .includes(ResponseErrorType.TOO_MANY_REQUESTS.toLowerCase())
    ) {
      throw {
        type: ResponseErrorType.TOO_MANY_REQUESTS,
      };
    }

    throw {
      type: ResponseErrorType.UNHANDLED,
      message: error.toString(),
    };
  });
}

function useGetBlockByHeight({ height, withTransactions = true }) {
  const result = getBlockByHeight({ height, withTransactions }, '');
  return result;
}

function getBlockByHeight(requestParameters, nodeUrl) {
  const { height, withTransactions } = requestParameters;
  // const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

  const client = new AptosClient('https://fullnode-testnet.wapal.io/');
  return withResponseError(client.getBlockByHeight(height, withTransactions));
}
// {
//     "block_height": "90318925",
//     "block_hash": "0x7fe6f3b831c4651d354d86c4c17d532ed355767e32873189f547bbfa7e6e3bf0",
//     "block_timestamp": "1685877682656741",
//     "first_version": "538956392",
//     "last_version": "538956411",
//     "transactions": null,
//     "__headers": {
//         "content-length": "221",
//         "content-type": "application/json; charset=utf-8"
//     }
// }
// function getTpsByBlockHeight() {}
export async function getTpsByBlockHeight(currentBlockHeight) {
  const blockHeight = currentBlockHeight ?? TPS_FREQUENCY;

  // const [tps, setTps] = useState<number | null>(null);

  // const { data: startBlock } = useGetBlockByHeight({
  //   height: blockHeight - TPS_FREQUENCY,
  //   withTransactions: false,
  // });

  //   withTransactions: false,
  const startBlock = await getBlockByHeight(
    { height: blockHeight - TPS_FREQUENCY },
    false
  );
  const endBlock = await getBlockByHeight({
    height: blockHeight,
    withTransactions: false,
  });
  if (startBlock !== undefined && endBlock !== undefined) {
    const tps = calculateTps(startBlock, endBlock);
    const roundedTps = Math.ceil(tps);
    console.log(roundedTps, 'roundedTps');
    return roundedTps;
  } else {
    return 0;
  }
}
