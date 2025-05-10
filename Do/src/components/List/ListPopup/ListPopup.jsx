import React, { useEffect, useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { BsCheck2 } from 'react-icons/bs';
import './ListPopup.css';

const ListPopup = ({ isOpen, onClose, onListSelect, selectedList = 'Personal', userLists = [], onAddList }) => {
  const [showAddListInput, setShowAddListInput] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    console.log("ListPopup received userLists:", userLists);
  }, [userLists]);

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

  // If userLists is empty, use default lists
  const displayLists = userLists.length > 0 ? 
    userLists.map((name, id) => ({ id, name })) : 
    [
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

  const handleAddListClick = () => {
    setShowAddListInput(true);
  };

  const handleAddListSubmit = () => {
    if (newListName.trim() && onAddList) {
      console.log("Adding new list:", newListName.trim());
      onAddList(newListName.trim());
      setNewListName('');
      setShowAddListInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddListSubmit();
    } else if (e.key === 'Escape') {
      setShowAddListInput(false);
      setNewListName('');
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
            <button className="add-list-button" onClick={handleAddListClick}>⊕</button>
          </div>
          
          {showAddListInput && (
            <div className="add-list-input-container">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Add new list"
                className="add-list-input"
                autoFocus
                onKeyDown={handleKeyPress}
              />
              <div className="add-list-buttons">
                <button 
                  className="add-list-save-btn" 
                  onClick={handleAddListSubmit}
                  disabled={!newListName.trim()}
                >
                  Add
                </button>
                <button 
                  className="add-list-cancel-btn" 
                  onClick={() => {
                    setShowAddListInput(false);
                    setNewListName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {displayLists.map(list => (
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