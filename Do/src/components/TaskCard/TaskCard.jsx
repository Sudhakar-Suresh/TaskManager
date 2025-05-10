import React, { useState, useRef, useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
import { BsThreeDotsVertical, BsBell, BsPinAngle, BsPinAngleFill, BsCheck } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import TaskDropdown from '../TaskDropdown/TaskDropdown';
import ReminderPopup from '../ReminderPopup/ReminderPopup';
import ListPopup from '../ListPopup/ListPopup';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate, onToggleComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isPinned, setIsPinned] = useState(task.isPinned || false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuButtonRef = useRef(null);
  const cardRef = useRef(null);
  const [reminderPopupOpen, setReminderPopupOpen] = useState(false);
  const [reminder, setReminder] = useState(task.reminder || null);
  const [isListPopupOpen, setIsListPopupOpen] = useState(false);
  const [selectedList, setSelectedList] = useState('Personal');

  useEffect(() => {
    // Update reminder state when task changes
    setReminder(task.reminder || null);
  }, [task.reminder]);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    const rect = menuButtonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.right - 180,
    });
    setDropdownOpen(!dropdownOpen);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    
    // Add animation class
    cardRef.current.classList.add(newPinnedState ? 'pin-animation' : 'unpin-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      cardRef.current.classList.remove(newPinnedState ? 'pin-animation' : 'unpin-animation');
    }, 500);

    onUpdate({
      ...task,
      isPinned: newPinnedState
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };

  const handleReminderClick = () => {
    setDropdownOpen(false);
    setReminderPopupOpen(true);
  };

  const handleReminderSave = (reminderData) => {
    try {
      const updatedTask = {
        ...task,
        reminder: {
          date: reminderData.date,
          isRecurring: reminderData.isRecurring
        }
      };
      
      setReminder(updatedTask.reminder);
      onUpdate(updatedTask);
      setReminderPopupOpen(false);
    } catch (error) {
      console.error('Error saving reminder:', error);
      // Keep the popup open if there's an error
      setReminderPopupOpen(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // Format time
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(/\s/, ''); // Remove space between time and AM/PM

      // Format date in DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id);
    
    // Add completion animation
    if (!task.completed) {
      cardRef.current.classList.add('completing');
      setTimeout(() => {
        cardRef.current.classList.remove('completing');
      }, 300);
    }
  };

  const handleListSelect = (listName) => {
    setSelectedList(listName);
    setIsListPopupOpen(false);
    onUpdate({
      ...task,
      list: listName
    });
    setDropdownOpen(false);
  };

  return (
    <>
      <div 
        ref={cardRef}
        className={`task-card ${isDeleting ? 'deleting' : ''} 
                   ${isPinned ? 'pinned' : ''} 
                   ${task.completed ? 'completed' : ''}`}
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
            <label htmlFor={`task-${task.id}`}>
              {task.completed && <BsCheck className="check-icon" />}
            </label>
          </div>
          <div className="task-content">
            <div className="task-title-row">
              <span className="task-title">
                {task.title}
                {task.completed && <span className="completed-line" />}
              </span>
              {isPinned && <BsPinAngleFill className="pinned-indicator" />}
            </div>
            <div className="task-info">
              <div className="task-list-info">
                <span className="list-name">My lists &gt; Personal</span>
              </div>
              {task.reminder && (
                <div className="task-date">
                  <BsBell className="date-icon" />
                  <span className="date-text">{formatDate(task.reminder.date)}</span>
                  {task.reminder.isRecurring && (
                    <span className="recurring-indicator" title="Recurring">↻</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {(isHovered || dropdownOpen) && (
          <div className="task-actions">
            <button 
              className={`action-button pin-button ${isPinned ? 'active' : ''}`}
              onClick={handlePinClick}
              title={isPinned ? "Unpin task" : "Pin task"}
            >
              {isPinned ? <BsPinAngleFill /> : <BsPinAngle />}
            </button>
            <button 
              className={`action-button menu-button ${dropdownOpen ? 'active' : ''}`}
              onClick={handleMenuClick}
              ref={menuButtonRef}
            >
              <BsThreeDotsVertical />
            </button>
            <button 
              className="action-button delete-button"
              onClick={handleDelete}
              title="Delete task"
            >
              <IoCloseOutline />
            </button>
          </div>
        )}
      </div>
      <TaskDropdown 
        isOpen={dropdownOpen}
        position={dropdownPosition}
        onClose={() => setDropdownOpen(false)}
        onReminderClick={handleReminderClick}
        onListClick={handleListSelect}
        userLists={['Personal', 'Work', 'Grocery List']}
      />
      {reminderPopupOpen && (
        <ReminderPopup 
          isOpen={reminderPopupOpen}
          onClose={() => setReminderPopupOpen(false)}
          onSave={handleReminderSave}
          initialDate={reminder?.date}
        />
      )}
      <ListPopup
        isOpen={isListPopupOpen}
        onClose={() => setIsListPopupOpen(false)}
        onListSelect={handleListSelect}
        selectedList={selectedList}
      />
    </>
  );
};

export default TaskCard; 