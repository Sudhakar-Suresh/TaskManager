import React, { forwardRef } from 'react';
import { BsBell } from 'react-icons/bs';
import { BiListUl } from 'react-icons/bi';
import { HiHashtag } from 'react-icons/hi';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import './TaskDropdown.css';

const TaskDropdown = forwardRef(({ 
  isOpen, 
  position, 
  onClose,
  onReminderClick,
  onTagsClick,
  onListClick,
  onPinClick,
  isPinned
}, ref) => {
  if (!isOpen) return null;

  const handleTagClick = (e) => {
    e.stopPropagation();
    if (onTagsClick) {
      onTagsClick();
    }
  };

  const handleReminderClick = (e) => {
    e.stopPropagation();
    if (onReminderClick) {
      onReminderClick();
    }
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    if (onPinClick) {
      onPinClick();
    }
  };

  const handleListClick = (e) => {
    e.stopPropagation();
    if (onListClick) {
      onListClick();
    }
  };

  return (
    <div 
      ref={ref}
      className="task-dropdown"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onClick={e => e.stopPropagation()}
    >
      <button 
        className="dropdown-item" 
        onClick={handleReminderClick}
      >
        <BsBell className="dropdown-icon" />
        <span>Reminder</span>
      </button>
      <button 
        className="dropdown-item"
        onClick={handleListClick}
      >
        <BiListUl className="dropdown-icon" />
        <span>Lists</span>
      </button>
      <button 
        className="dropdown-item"
        onClick={handleTagClick}
      >
        <HiHashtag className="dropdown-icon" />
        <span>Tags</span>
      </button>
      <button 
        className={`dropdown-item ${isPinned ? 'active' : ''}`}
        onClick={handlePinClick}
      >
        {isPinned ? <BsPinAngleFill className="dropdown-icon" /> : <BsPinAngle className="dropdown-icon" />}
        <span>{isPinned ? 'Unpin' : 'Pin'}</span>
      </button>
    </div>
  );
});

TaskDropdown.displayName = 'TaskDropdown';

export default TaskDropdown; 