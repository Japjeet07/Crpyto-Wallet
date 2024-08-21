

import React, { useState} from 'react';
import TopComp from '../TopComp';
import BottomComp from '../BottomComp';
import Modal from '../Modal';
import { useCoinData } from '../CoinDataContext';
import axios from 'axios';

const Wallet = () => {
  const { coinData, setCoinData, setTransactions, walletName, setWalletName } = useCoinData(); // Get walletName and setWalletName from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Synced');



  const fetchWalletAddresses = async (walletName, token) => {
    try {
      const response = await axios.get(`http://localhost:8080/proxy?url=https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}?token=${token}`);
      return response.data.addresses || [];
    } catch (error) {
      console.error('Error fetching wallet addresses:', error);
      return [];
    }
  };



  const fetchBalance = async (address) => {
    try {
      const response = await axios.get(`http://localhost:8080/proxy?url=https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`);
      return response.data.final_balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };



  const fetchTransactionData = async (coins) => {
    const transactionPromises = coins.map(async (coin) => {
      try {
        const response = await axios.get(`http://localhost:8080/proxy?url=https://api.blockcypher.com/v1/btc/test3/addrs/${coin.address}/full`);
        const { txs } = response.data;
  
        if (!txs) {
          console.error('No transactions found for address:', coin.address);
          return [];
        }
  
        return txs.flatMap(tx => {
          const outputs = tx.outputs.filter(output => output.addresses.includes(coin.address));
          const inputs = tx.inputs.filter(input => input.addresses.includes(coin.address));
  
          return outputs.map(output => ({
            address: coin.address,
            date: tx.confirmed,
            amount: output.value,
            result: 'Received',
            status: tx.confirmations > 0 ? 'Confirmed' : 'Unconfirmed'
          })).concat(inputs.map(input => ({
            address: coin.address,
            date: tx.confirmed,
            amount: -input.output_value,
            result: 'Sent',
            status: tx.confirmations > 0 ? 'Confirmed' : 'Unconfirmed'
          })));
        });
      } catch (error) {
        console.error('Error fetching transaction data for address:', coin.address, error);
        return [];
      }
    });
  
    const transactions = await Promise.all(transactionPromises);
    setTransactions(transactions.flat());
  };


  

  const fetchNewCoinData = async () => {
    setSyncStatus('Syncing');

    const walletToken = process.env.REACT_APP_BLOCKCYPHER_TOKEN; // Replace with your API token
    const walletAddresses = await fetchWalletAddresses(walletName, walletToken);
    let results = [];
    for (const addr of walletAddresses) {
      const balance = await fetchBalance(addr);
      results.push({ address: addr, balance });
    }
    
    setCoinData(results);
    await fetchTransactionData(results);
    setSyncStatus('Synced');

  };



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  const handleReSync = () => {
    fetchNewCoinData();
  };



  const handleCoinData = async (results, walletName) => {
    setCoinData(results);
    await fetchTransactionData(results);
    setWalletName(walletName);
    setIsModalOpen(false);
  };

  

  return (
    <div className="container">
      <TopComp openModal={openModal} syncStatus={syncStatus} onReSync={handleReSync} />
      <ul>
        <li>Status: {syncStatus}</li>
      </ul>
      {isModalOpen && <Modal info={handleCoinData} onClose={closeModal} />}
      <BottomComp coinData={coinData} walletName={walletName} />
    </div>
  );
};

export default Wallet;
