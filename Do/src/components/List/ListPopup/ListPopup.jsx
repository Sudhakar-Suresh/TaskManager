import React, { useEffect } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { BsCheck2 } from 'react-icons/bs';
import './ListPopup.css';

const ListPopup = ({ isOpen, onClose, onListSelect, selectedList = 'Personal' }) => {
  // Prevent scrolling of the background when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const myLists = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Grocery List' }
  ];

  const handleListClick = (listName) => {
    onListSelect(listName);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="list-popup-overlay" onClick={handleOverlayClick}>
      <div className="list-popup" onClick={e => e.stopPropagation()}>
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
              onClick={() => handleListClick(list.name)}
            >
              <span className="list-name">{list.name}</span>
              {list.name === selectedList && (
                <BsCheck2 className="check-icon" />
              )}
            </button>
          ))}
        </div>

        <div className="list-section">
          <div className="section-title">
            <span>hio</span>
            <IoPersonOutline className="share-icon" />
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
    </div>
  );
};

export default ListPopup; 