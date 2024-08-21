
import React, { useState } from 'react';
import './pages_CSS/BottomComp.css';
import deleteIcon from '../assets/4980658.png';
import bitcoin from '../assets/bitcoin.webp';
import { useCoinData } from './CoinDataContext'; // Import the custom hook

const BottomComp = ({ coinData, walletName }) => {
  const { setCoinData } = useCoinData(); // No need to pass setCoinData, it's used from context
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      const userToken = process.env.REACT_APP_BLOCKCYPHER_TOKEN;// Replace with your API token
      fetch(`https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}/addresses?token=${userToken}&address=${addressToDelete}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setCoinData(prevData => prevData.filter(item => item.address !== addressToDelete));
            setShowConfirmation(false);
            setAddressToDelete(null);
          } else {
            alert('Failed to delete the address');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting the address');
        });
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setAddressToDelete(null);
  };

  return (
    <div className="bottomComp">
      {showConfirmation && (
        <div className="confirmationPopup">
          <p>Are you sure you want to delete this address?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
      <div className="upper_div">
        <div className="total_coin">
          <p>Total Coin - {coinData.length}</p>
        </div>
      </div>
      <div className="lower_div">
        <div className="table_section">
          <table>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Holding</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coinData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="coin">
                      <div className="image">
                        <img src={bitcoin} alt="Bitcoin" />
                      </div>
                      <div className="text">
                        <p>Bitcoin</p><p>{index + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.balance / 100000000}</td>
                  <td>
                    <div className="action">
                      <button
                        className="delete_btn"
                        onClick={() => handleDeleteClick(item.address)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BottomComp;


