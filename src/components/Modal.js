

import React, { useState } from 'react';
import axios from 'axios';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import './pages_CSS/Modal.css';

const bip32 = BIP32Factory(ecc);

const Modal = ({ info, onClose }) => {
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWalletAddresses = async (walletName, token) => {
    try {
      const response = await axios.get(`http://localhost:8080/proxy?url=http://localhost:8080/proxy?url=https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}?token=${token}`);
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        setError('Invalid mnemonic.');
        return;
      }

      const walletToken = process.env.REACT_APP_BLOCKCYPHER_TOKEN;
      // Replace with your API token
      const walletAddresses = await fetchWalletAddresses(walletName, walletToken);

      if (walletAddresses.length === 0) {
        setError('No addresses found for the wallet.');
        return;
      }

      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const root = bip32.fromSeed(seed);
      const account = root.derivePath("m/44'/1'/0'/0/0"); // Derive the first address for Bitcoin Testnet
      const { address: derivedAddress } = bitcoin.payments.p2pkh({ pubkey: account.publicKey, network: bitcoin.networks.testnet });
      // console.log(derivedAddress)
      // if (!walletAddresses.includes(derivedAddress)) {
      //   setError('Mnemonic and wallet name do not match.');
      //   return;
      // }

      let results = [];
      for (const addr of walletAddresses) {
        const balance = await fetchBalance(addr);
        results.push({ address: addr, balance });
      }

      info(results, walletName);
    } catch (error) {
      console.error('Error processing wallet information:', error);
      setError('An error occurred while processing wallet information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modalContainer">
        <div className="topDiv">
          <div className="heading">
            <span>Import Wallet</span>
          </div>
          <div className="close_btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </div>
        </div>
        <div className="middleDiv">
          <div className="inputFields">
            <div className="inputGroup">
              <label htmlFor="walletName">Enter your wallet name:</label>
              <input
                id="walletName"
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="mnemonic">Enter your Mnemonic:</label>
              <textarea
                id="mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                rows="4"
              />
            </div>
          </div>
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
        </div>
        <div className="bottomDiv">
          <button className="submitBtn" onClick={handleSubmit} disabled={loading}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
