import React, { useState, useEffect, useRef } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { BsCheck2 } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import './ListPopup.css';

const ListPopup = ({ 
  isOpen, 
  onClose, 
  onListSelect, 
  selectedList = 'Personal', 
  userLists = [], 
  onAddList,
  position = null,
  variant = 'centered'
}) => {
  const popupRef = useRef(null);

  // Get lists from localStorage or use default
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('userLists');
    return savedLists ? JSON.parse(savedLists) : ['Personal', 'Work', 'Grocery List'];
  });

  // Keep lists in sync
  useEffect(() => {
    setLists(userLists);
  }, [userLists]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleListClick = (listName) => {
    onListSelect(listName);
    onClose();
  };

  const popupStyle = variant === 'positioned' && position ? {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
  } : {};

  return (
    <div 
      className={`list-popup-overlay ${variant}`} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`list-popup ${variant}`}
        ref={popupRef}
        style={popupStyle}
        onClick={e => e.stopPropagation()}
      >
        <div className="list-popup-header">
          Move to...
        </div>

        <div className="list-section">
          <div className="section-title">
            <span className="section-name">My lists</span>
            <AiOutlinePlus 
              className="add-icon"
              onClick={() => onAddList && onAddList('New List')}
            />
          </div>
          
          {lists.map((listName) => (
            <button
              key={listName}
              className={`list-item ${listName === selectedList ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleListClick(listName);
              }}
            >
              <div className="list-item-content">
                <span className="list-name">{listName}</span>
              </div>
              {listName === selectedList && (
                <BsCheck2 className="check-icon" />
              )}
            </button>
          ))}

          <div className="section-divider"></div>

          <div className="section-title">
            <span className="section-name">hio</span>
            <IoPersonOutline className="person-icon" />
          </div>
          
          <button className="list-item shared">
            <div className="list-item-content">
              <div className="shared-list-info">
                <IoPersonOutline className="person-small-icon" />
                <span className="list-name">Hio</span>
              </div>
            </div>
            <MdOutlineKeyboardArrowRight className="arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPopup; 