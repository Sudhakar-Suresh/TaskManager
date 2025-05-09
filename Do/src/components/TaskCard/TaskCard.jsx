import React, { useState, useRef, useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
import { BsThreeDotsVertical, BsBell } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import TaskDropdown from '../TaskDropdown/TaskDropdown';
import ReminderPopup from '../ReminderPopup/ReminderPopup';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [reminderDate, setReminderDate] = useState(null);
  const menuButtonRef = useRef(null);
  const [reminderPopupOpen, setReminderPopupOpen] = useState(false);
  const [reminder, setReminder] = useState(null);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    const rect = menuButtonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.right - 180,
    });
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && 
          !event.target.closest('.task-dropdown') && 
          !event.target.closest('.menu-button')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleReminderClick = () => {
    setDropdownOpen(false);
    setReminderPopupOpen(true);
  };

  const handleReminderSave = (reminderData) => {
    setReminder(reminderData);
    setReminderPopupOpen(false);
  };

  const formatReminderDate = (dateString) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const [day, month, year] = dateString.split('.');
    const reminderDate = new Date(year, month - 1, day);
    
    if (reminderDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (reminderDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return reminderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <>
      <div 
        className="task-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !dropdownOpen && setIsHovered(false)}
      >
        <div className="task-left">
          <div className="task-checkbox">
            <input type="checkbox" id={`task-${task.id}`} checked={task.completed} />
            <label htmlFor={`task-${task.id}`}></label>
          </div>
          <div className="task-content">
            <span className="task-title">{task.title}</span>
            <div className="task-list-info">
              <span className="list-icon">🔒</span>
              <span className="list-name">My lists &gt; Personal</span>
              {reminder && (
                <div className="task-reminder">
                  <BsBell className="reminder-icon" />
                  <span>{formatReminderDate(reminder.date)}</span>
                  {reminder.isRecurring && <span className="recurring-indicator">↻</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        {(isHovered || dropdownOpen) && (
          <div className="task-actions">
            <button className="action-button">
              <BiPencil />
            </button>
            <button 
              className={`action-button menu-button ${dropdownOpen ? 'active' : ''}`}
              onClick={handleMenuClick}
              ref={menuButtonRef}
            >
              <BsThreeDotsVertical />
            </button>
            <button className="action-button">
              <IoCloseOutline />
            </button>
          </div>
        )}
      </div>
      <TaskDropdown 
        isOpen={dropdownOpen}
        position={dropdownPosition}
        onReminderClick={handleReminderClick}
      />
      <ReminderPopup 
        isOpen={reminderPopupOpen}
        onClose={() => setReminderPopupOpen(false)}
        onSave={handleReminderSave}
        initialDate={reminder?.date}
      />
    </>
  );
};

export default TaskCard; 