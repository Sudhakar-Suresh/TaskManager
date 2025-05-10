import React, { useState } from 'react';
import { BsBell, BsPerson } from 'react-icons/bs';
import { BiListUl } from 'react-icons/bi';
import { HiHashtag } from 'react-icons/hi';
import { BsPinAngle } from 'react-icons/bs';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import './TaskDropdown.css';

const TaskDropdown = ({ 
  isOpen, 
  position, 
  onReminderClick, 
  onListClick,
  selectedList = 'Personal'
}) => {
  const [showListPopup, setShowListPopup] = useState(false);

  if (!isOpen) return null;

  const myLists = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Grocery List' }
  ];

  const handleListButtonClick = (e) => {
    e.stopPropagation();
    setShowListPopup(!showListPopup);
  };

  const handleListSelect = (listName) => {
    onListClick(listName);
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
            Move to...
          </div>
          
          <div className="list-section">
            <div className="section-title">
              <span>My lists</span>
              <button className="add-list-button">⊕</button>
            </div>
            {myLists.map(list => (
              <button
                key={list.id}
                className={`list-item ${list.name === selectedList ? 'selected' : ''}`}
                onClick={() => handleListSelect(list.name)}
              >
                <span className="list-name">{list.name}</span>
                {list.name === selectedList && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="list-section">
            <div className="section-title">
              <span>hio</span>
              <BsPerson className="share-icon" />
            </div>
            <button className="list-item shared-item">
              <div className="shared-item-left">
                <span className="user-avatar">👤</span>
                <span className="list-name">Hio</span>
              </div>
              <MdOutlineKeyboardArrowRight className="arrow-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDropdown; 