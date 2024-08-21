
import React from 'react';
import './pages_CSS/TopComp.css';

const TopComp = ({ openModal, syncStatus, onReSync }) => {
  return (
    <div className="topComp">
      <div className="right">
        <div className="synchronize_Box">
          
          <li>
            <p className="synchronize">Status: {syncStatus}</p>
          </li>
        </div>
        <div className="searchBox">
          <div className="btn">
            <li className="yyy" onClick={openModal}>
              <i className="bi bi-plus"></i>
              <p className="add">Insert</p>
            </li>
            <li className="yyy" onClick={onReSync}>
              <i className="bi bi-arrow-clockwise"></i>
              <p className="reSync">Re-sync</p>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopComp;
