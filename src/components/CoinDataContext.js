import React, { createContext, useContext, useState } from 'react';

const CoinDataContext = createContext();

export const useCoinData = () => useContext(CoinDataContext);

export const CoinDataProvider = ({ children }) => {
  const [coinData, setCoinData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletName, setWalletName] = useState(''); // Add walletName state

  return (
    <CoinDataContext.Provider value={{ coinData, setCoinData, transactions, setTransactions, walletName, setWalletName }}>
      {children}
    </CoinDataContext.Provider>
  );
};
