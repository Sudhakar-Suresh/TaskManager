import React from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import './ListPopup.css';

const ListPopup = ({ isOpen, onClose, onListSelect, selectedList = 'Personal' }) => {
  if (!isOpen) return null;

  const myLists = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Grocery List' }
  ];

  return (
    <div className="list-popup-overlay" onClick={onClose}>
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
              onClick={() => onListSelect(list.name)}
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