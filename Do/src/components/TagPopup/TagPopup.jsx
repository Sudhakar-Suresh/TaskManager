import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { IoSquareOutline, IoCheckboxOutline } from 'react-icons/io5';
import { BiPencil } from 'react-icons/bi';
import './TagPopup.css';

const TagPopup = ({ isOpen, onClose, onSave, selectedTags = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [tags] = useState([
    { id: 1, name: 'Priority', color: '#FFD700' },
    { id: 2, name: 'new', color: '#FF7F50' }
  ]);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleTagSelect = (tagName) => {
    setLocalSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const handleSave = () => {
    onSave(localSelectedTags);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="tag-popup-overlay" onClick={handleOverlayClick}>
      <div className="tag-popup" onClick={e => e.stopPropagation()}>
        <div className="tag-popup-header">
          <span>Tags</span>
          <button className="add-tag-button">+</button>
        </div>

        <div className="tag-search">
          <IoSearchOutline className="search-icon" />
          <input
            type="text"
            placeholder="Search tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tags-list">
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              className={`tag-item ${localSelectedTags.includes(tag.name) ? 'selected' : ''}`}
              onClick={() => handleTagSelect(tag.name)}
              style={{ backgroundColor: tag.color }}
            >
              <div className="tag-left">
                {localSelectedTags.includes(tag.name) ? (
                  <IoCheckboxOutline className="tag-icon" />
                ) : (
                  <IoSquareOutline className="tag-icon" />
                )}
                <span className="tag-name">{tag.name}</span>
              </div>
              {tag.name === 'new' && (
                <BiPencil className="edit-icon" />
              )}
            </div>
          ))}
        </div>

        <div className="tag-popup-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="save-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagPopup; 