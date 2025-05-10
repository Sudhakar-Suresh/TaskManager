import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoArrowBack } from 'react-icons/io5';
import { IoSquareOutline, IoCheckboxOutline } from 'react-icons/io5';
import { BiPencil } from 'react-icons/bi';
import './TagPopup.css';

const TagPopup = ({ isOpen, onClose, onSave, selectedTags = [] }) => {
  // Load stored tags from localStorage or use defaults
  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem('appTags');
    return storedTags 
      ? JSON.parse(storedTags)
      : [
          { id: 1, name: 'Priority', color: '#FFD700' },
          { id: 2, name: 'new', color: '#FF7F50' }
        ];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [showEditTagForm, setShowEditTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1E88E5'); // Default blue color
  const [editingTag, setEditingTag] = useState(null);

  // Available colors for tag creation - matching the image
  const colorOptions = [
    '#FF4D4F', // Red
    '#FF7E36', // Orange
    '#FFC01E', // Amber
    '#FFDE3B', // Yellow
    '#4CD964', // Green
    '#5CDA90', // Light green
    '#20CDA8', // Teal
    '#1E88E5', // Light blue (Default)
    '#007AFF', // Blue
    '#5856D6', // Indigo
    '#9C27B0', // Purple
    '#C62828', // Dark red
    '#E040FB', // Pink
    '#FF80AB', // Light pink
    '#9E9E9E', // Gray
  ];

  // Sync selected tags when props change
  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appTags', JSON.stringify(tags));
  }, [tags]);

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

  const handleAddTag = () => {
    setNewTagName('');
    setSelectedColor('#1E88E5');
    setShowNewTagForm(true);
    setShowEditTagForm(false);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setSelectedColor(tag.color);
    setShowEditTagForm(true);
    setShowNewTagForm(false);
  };

  const handleNewTagSave = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: selectedColor
      };
      
      setTags(prevTags => [...prevTags, newTag]);
      setLocalSelectedTags(prev => [...prev, newTagName.trim()]);
      
      // Reset form
      setNewTagName('');
      setSelectedColor('#1E88E5');
      setShowNewTagForm(false);
    }
  };

  const handleEditTagSave = () => {
    if (newTagName.trim() && editingTag) {
      // Check if the tag name is being changed
      const oldName = editingTag.name;
      const newName = newTagName.trim();
      
      // Update the tag in the tags array
      setTags(prevTags => 
        prevTags.map(tag => 
          tag.id === editingTag.id 
            ? { ...tag, name: newName, color: selectedColor }
            : tag
        )
      );
      
      // Update the selected tags if the edited tag was selected
      if (localSelectedTags.includes(oldName)) {
        setLocalSelectedTags(prev => 
          prev.map(tagName => tagName === oldName ? newName : tagName)
        );
      }
      
      // Reset form
      setNewTagName('');
      setSelectedColor('#1E88E5');
      setEditingTag(null);
      setShowEditTagForm(false);
    }
  };

  const handleTagFormCancel = () => {
    setNewTagName('');
    setSelectedColor('#1E88E5');
    setEditingTag(null);
    setShowNewTagForm(false);
    setShowEditTagForm(false);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="tag-popup-overlay" onClick={handleOverlayClick}>
      <div className="tag-popup" onClick={e => e.stopPropagation()}>
        {!showNewTagForm && !showEditTagForm ? (
          // Main Tag Popup View
          <>
            <div className="tag-popup-header">
              <span>Tags</span>
              <button className="add-tag-button" onClick={handleAddTag}>+</button>
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
                  style={{ backgroundColor: tag.color }}
                >
                  <div 
                    className="tag-left"
                    onClick={() => handleTagSelect(tag.name)}
                  >
                    {localSelectedTags.includes(tag.name) ? (
                      <IoCheckboxOutline className="tag-icon" />
                    ) : (
                      <IoSquareOutline className="tag-icon" />
                    )}
                    <span className="tag-name">{tag.name}</span>
                  </div>
                  <button 
                    className="edit-tag-button"
                    onClick={() => handleEditTag(tag)}
                  >
                    <BiPencil className="edit-icon" />
                  </button>
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
          </>
        ) : showNewTagForm ? (
          // New Tag Form View
          <>
            <div className="new-tag-header">
              <button className="back-button" onClick={handleTagFormCancel}>
                <IoArrowBack />
              </button>
              <span>New Tag</span>
              <button 
                className="save-new-tag-button"
                onClick={handleNewTagSave}
                disabled={!newTagName.trim()}
              >
                SAVE
              </button>
            </div>

            <div className="new-tag-form">
              <div className="form-group">
                <label>TAG NAME</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Type a name"
                  className="new-tag-name-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>COLOR</label>
                <div className="color-grid">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Edit Tag Form View - Same design as New Tag
          <>
            <div className="new-tag-header">
              <button className="back-button" onClick={handleTagFormCancel}>
                <IoArrowBack />
              </button>
              <span>Edit Tag</span>
              <button 
                className="save-new-tag-button"
                onClick={handleEditTagSave}
                disabled={!newTagName.trim()}
              >
                SAVE
              </button>
            </div>

            <div className="new-tag-form">
              <div className="form-group">
                <label>TAG NAME</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Type a name"
                  className="new-tag-name-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>COLOR</label>
                <div className="color-grid">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TagPopup; 