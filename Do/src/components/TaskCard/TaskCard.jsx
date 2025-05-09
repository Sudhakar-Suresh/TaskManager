import React, { useState, useRef, useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
import { BsThreeDotsVertical, BsBell } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import TaskDropdown from '../TaskDropdown/TaskDropdown';
import ReminderPopup from '../ReminderPopup/ReminderPopup';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate, onToggleComplete }) => {
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
    const updatedReminder = {
      ...reminderData,
      date: reminderData.date // Keep as ISO string
    };
    setReminder(updatedReminder);
    onUpdate({
      ...task,
      reminder: updatedReminder
    });
    setReminderPopupOpen(false);
  };

  const formatReminderDate = (dateString) => {
    if (!dateString) return '';

    const reminderDate = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    // Format time
    const timeString = reminderDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Check if it's today or tomorrow
    if (isSameDay(reminderDate, now)) {
      return `Today, ${timeString}`;
    } else if (isSameDay(reminderDate, tomorrow)) {
      return `Tomorrow, ${timeString}`;
    }

    // If it's within 7 days, show the day name
    const diffDays = Math.floor((reminderDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 7 && diffDays > -1) {
      return `${reminderDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${timeString}`;
    }

    // Otherwise show the full date
    return `${reminderDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: reminderDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })}, ${timeString}`;
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id);
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
            <input 
              type="checkbox" 
              id={`task-${task.id}`} 
              checked={task.completed}
              onChange={handleCheckboxChange}
            />
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