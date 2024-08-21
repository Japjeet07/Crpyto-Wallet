import React from 'react';
import { useCoinData } from '../CoinDataContext';
import '../pages_CSS/last_transaction.css'
import bitcoin from '../../assets/bitcoin.webp';




const Last_Transaction = () => {
  const { transactions } = useCoinData();

  return (
    <div>

      <div className="bottomComp">
        <h1 className="heading">Trasactions</h1>
        <div className="upper_div">
          <p className="total_coin">Total Transaction-{transactions.length}</p>
        </div>
        <div className="lower_div">
          <div className="table_section">
            <table>
              <thead>
                <tr>

                  <th>Date</th>
                  <th>Amount</th>
                  <th>Result</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="date">
                      <div className="coin">
                        <div className="image">
                          <img src={bitcoin} alt="Bitcoin" />
                        </div>
                        <div>
                          <div className="date-part">
                            {tx.date ? tx.date.split('T')[0] : 'N/A'}
                          </div>
                          <div className="time-part">
                            {tx.date ? tx.date.split('T')[1] : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{tx.amount / 100000000}</td>
                    <td>{tx.result}</td>
                    <td className="status">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Last_Transaction;
