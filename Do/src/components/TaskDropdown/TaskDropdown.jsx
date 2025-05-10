import React, { useState } from 'react';
import { BsBell } from 'react-icons/bs';
import { BiListUl } from 'react-icons/bi';
import { HiHashtag } from 'react-icons/hi';
import { BsPinAngle } from 'react-icons/bs';
import './TaskDropdown.css';

const TaskDropdown = ({ isOpen, position, onReminderClick, onListClick, userLists = [] }) => {
  const [showListPopup, setShowListPopup] = useState(false);

  if (!isOpen) return null;

  const handleListButtonClick = () => {
    setShowListPopup(!showListPopup);
  };

  const handleListSelect = (listName) => {
    if (onListClick) {
      onListClick(listName);
    }
    setShowListPopup(false);
  };

  return (
    <div 
      className="task-dropdown"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <button 
        className="dropdown-item" 
        onClick={onReminderClick}
      >
        <BsBell className="dropdown-icon" />
        <span>Reminder</span>
      </button>
      <button 
        className={`dropdown-item ${showListPopup ? 'active' : ''}`}
        onClick={handleListButtonClick}
      >
        <BiListUl className="dropdown-icon" />
        <span>Lists</span>
      </button>
      <button className="dropdown-item">
        <HiHashtag className="dropdown-icon" />
        <span>Tags</span>
      </button>
      <button className="dropdown-item">
        <BsPinAngle className="dropdown-icon" />
        <span>Pin</span>
      </button>

      {showListPopup && (
        <div className="list-popup">
          <div className="list-popup-header">
            <h3>Move to...</h3>
          </div>
          <div className="list-popup-section">
            <h4>My lists</h4>
            {userLists.map((list, index) => (
              <button
                key={index}
                className="list-item"
                onClick={() => handleListSelect(list)}
              >
                <span>{list}</span>
                {list === 'Personal' && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDropdown; 