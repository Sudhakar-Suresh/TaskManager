import React, { useState } from 'react';
import './AddListPopup.css';

const AddListPopup = ({ onClose, onCreateList }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.trim()) {
      onCreateList(listName.trim());
      setListName('');
      onClose();
    }
  };

  return (
    <div className="add-list-popup">
      <div className="popup-content">
        <h3>Create New List</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter list name"
            autoFocus
          />
          <div className="popup-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListPopup; 