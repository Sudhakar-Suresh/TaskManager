import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { BsBell } from 'react-icons/bs';
import { HiHashtag } from 'react-icons/hi';
import { BiListUl } from 'react-icons/bi';
import ReminderPopup from '../../ReminderPopup/ReminderPopup';
import ListPopup from '../../List/ListPopup/ListPopup';
import TagPopup from '../../TagPopup/TagPopup';
import './TaskCreatePopup.css';

const TaskCreatePopup = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialDate,
  initialList = 'Personal',
  userLists = [],
  onAddList
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedList, setSelectedList] = useState(initialList);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reminder, setReminder] = useState(initialDate ? { date: initialDate } : null);
  
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    const taskData = {
      title: title.trim(),
      notes: notes.trim(),
      list: selectedList,
      tags: selectedTags,
      reminder: reminder,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: reminder?.date || initialDate || new Date().toISOString()
    };
    
    onSave(taskData);
    
    onClose();
    
    setTitle('');
    setNotes('');
    setSelectedList(initialList);
    setSelectedTags([]);
    setReminder(initialDate ? { date: initialDate } : null);
  };

  const handleReminderClick = (e) => {
    e.stopPropagation();
    setShowReminderPopup(true);
    setShowListPopup(false);
    setShowTagPopup(false);
  };

  const handleReminderSave = (reminderData) => {
    setReminder(reminderData);
    setShowReminderPopup(false);
  };

  const handleListClick = (e) => {
    e.stopPropagation();
    setShowListPopup(true);
    setShowReminderPopup(false);
    setShowTagPopup(false);
  };

  const handleListSelect = (listName) => {
    setSelectedList(listName);
    setShowListPopup(false);
  };

  const handleTagsClick = (e) => {
    e.stopPropagation();
    setShowTagPopup(true);
    setShowReminderPopup(false);
    setShowListPopup(false);
  };

  const handleTagsSave = (tags) => {
    setSelectedTags(tags);
    setShowTagPopup(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Later today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-create-overlay" onClick={onClose}>
      <div className="task-create-popup" onClick={e => e.stopPropagation()}>
        <div className="task-create-header">
          <div className="task-type-selector">
            <button className="type-btn selected">Task</button>
            <button className="type-btn">Event</button>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="task-create-content">
          <div className="list-path">
            <span>My lists &gt; {selectedList}</span>
          </div>
          
          <input
            type="text"
            className="title-input"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          
          <div className="task-options">
            <button 
              className={`option-btn ${reminder ? 'active' : ''}`}
              onClick={handleReminderClick}
            >
              <BsBell className="option-icon" />
              <span>{reminder ? formatDate(reminder.date) : 'Later today, 3:12PM'}</span>
              <div className="toggle-switch">
                <input type="checkbox" checked={!!reminder} readOnly />
                <span className="slider round"></span>
              </div>
            </button>
            
            <button 
              className="option-btn"
              onClick={handleListClick}
            >
              <BiListUl className="option-icon" />
              <span>{selectedList}</span>
            </button>
            
            <button 
              className="option-btn"
              onClick={handleTagsClick}
            >
              <HiHashtag className="option-icon" />
              <span>Tags</span>
            </button>
          </div>
          
          <textarea
            className="notes-input"
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="task-create-footer">
          <button 
            className="save-btn"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            Save
          </button>
        </div>
        
        {showReminderPopup && (
          <ReminderPopup 
            isOpen={showReminderPopup}
            onClose={() => setShowReminderPopup(false)}
            onSave={handleReminderSave}
            initialDate={reminder?.date}
            isRecurring={reminder?.isRecurring}
          />
        )}

        {showListPopup && (
          <ListPopup
            isOpen={showListPopup}
            onClose={() => setShowListPopup(false)}
            onListSelect={handleListSelect}
            selectedList={selectedList}
            userLists={userLists}
            onAddList={onAddList}
            variant="centered"
          />
        )}

        {showTagPopup && (
          <TagPopup
            isOpen={showTagPopup}
            onClose={() => setShowTagPopup(false)}
            onSave={handleTagsSave}
            selectedTags={selectedTags}
          />
        )}
      </div>
    </div>
  );
};

export default TaskCreatePopup; 