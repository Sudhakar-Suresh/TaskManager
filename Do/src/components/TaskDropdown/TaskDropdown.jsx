import React from 'react';
import { BsBell } from 'react-icons/bs';
import { BiListUl } from 'react-icons/bi';
import { HiHashtag } from 'react-icons/hi';
import { BsPinAngle } from 'react-icons/bs';
import './TaskDropdown.css';

const TaskDropdown = ({ isOpen, position, onReminderClick }) => {
  if (!isOpen) return null;

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
      <button className="dropdown-item">
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
    </div>
  );
};

export default TaskDropdown; 