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
  const client = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');
  return withResponseError(client.getBlockByHeight(height, withTransactions));
}

export async function getTpsByBlockHeight(currentBlockHeight) {
  const blockHeight = currentBlockHeight ?? TPS_FREQUENCY;

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
    return roundedTps;
  } else {
    return 0;
  }
}
