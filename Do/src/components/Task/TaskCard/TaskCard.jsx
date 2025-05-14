import React, { useState, useRef, useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
import { BsThreeDotsVertical, BsBell, BsPinAngle, BsPinAngleFill, BsCheck } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import TaskDropdown from '../TaskDropdown/TaskDropdown';
import ReminderPopup from '../../ReminderPopup/ReminderPopup';
import ListPopup from '../../List/ListPopup/ListPopup';
import TagPopup from '../../TagPopup/TagPopup';
import TaskExpandedPopup from '../TaskExpandedPopup/TaskExpandedPopup';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate, onToggleComplete, userLists = [], onAddList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isPinned, setIsPinned] = useState(task.isPinned || false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reminderPopupOpen, setReminderPopupOpen] = useState(false);
  const [reminder, setReminder] = useState(task.reminder || null);
  const [isListPopupOpen, setIsListPopupOpen] = useState(false);
  const [currentList, setCurrentList] = useState(task.list || 'Personal');
  const [selectedTags, setSelectedTags] = useState(task.tags || []);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const cardRef = useRef(null);

  // Load tag definitions from localStorage to access colors
  const [tagDefinitions, setTagDefinitions] = useState(() => {
    const storedTags = localStorage.getItem('appTags');
    return storedTags 
      ? JSON.parse(storedTags)
      : [
          { id: 1, name: 'Priority', color: '#FFD700' },
          { id: 2, name: 'new', color: '#FF7F50' }
        ];
  });

  useEffect(() => {
    // Update reminder state when task changes
    setReminder(task.reminder || null);
  }, [task.reminder]);

  // Close tag popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTagPopup && !event.target.closest('.tag-popup')) {
        setShowTagPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTagPopup]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && 
          !menuButtonRef.current?.contains(event.target) && 
          !dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle click outside to close list popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isListPopupOpen && !event.target.closest('.list-popup') && !event.target.closest('.task-dropdown')) {
        setIsListPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListPopupOpen]);

  // Add this useEffect to keep tag definitions in sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedTags = localStorage.getItem('appTags');
      if (storedTags) {
        setTagDefinitions(JSON.parse(storedTags));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper function to get tag color
  const getTagColor = (tagName) => {
    const tag = tagDefinitions.find(t => t.name === tagName);
    return tag ? tag.color : '#E0E0E0'; // Fallback to gray if not found
  };

  // Helper function to determine text color based on background color
  const getContrastColor = (hexColor) => {
    // If it's one of the known light colors that needs dark text
    if (hexColor === '#FFD700' || hexColor === '#FFDE3B') {
      return '#000000';
    }
    // For all other colors, use white text
    return '#FFFFFF';
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    const rect = menuButtonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
    setDropdownOpen(!dropdownOpen);
  };

  const handlePinClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    setDropdownOpen(false);
    
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

  const handleListClick = () => {
    console.log("List click handler called");
    setDropdownOpen(false); // Close dropdown when opening list popup
    setIsListPopupOpen(true);
  };

  const handleListSelect = (listName) => {
    setCurrentList(listName);
    onUpdate({
      ...task,
      list: listName
    });
    setIsListPopupOpen(false);
  };

  const handleTagsClick = () => {
    setDropdownOpen(false); // Close dropdown when opening tags
    setShowTagPopup(true);
  };

  const handleTagsSave = (newTags) => {
    setSelectedTags(newTags);
    onUpdate({
      ...task,
      tags: newTags
    });
    setShowTagPopup(false);
  };

  const handleCardClick = (e) => {
    // Don't expand if clicking checkbox or action buttons
    if (
      e.target.closest('.task-checkbox') ||
      e.target.closest('.task-actions')
    ) {
      return;
    }
    setIsExpanded(true);
  };

  console.log("List popup state:", isListPopupOpen);

  return (
    <>
      <div 
        ref={cardRef}
        className={`task-card ${isDeleting ? 'deleting' : ''} 
                   ${isPinned ? 'pinned' : ''} 
                   ${task.completed ? 'completed' : ''}
                   ${selectedTags.length > 0 ? 'has-tags' : ''}
                   ${task.reminder ? 'has-reminder' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !dropdownOpen && setIsHovered(false)}
        onClick={handleCardClick}
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
          
          <div className="task-list-info">
            <span className="list-name">My lists &gt; {currentList}</span>
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
              {selectedTags.length > 0 && (
                <div className="task-tags">
                  {selectedTags.map(tag => {
                    const tagColor = getTagColor(tag);
                    const textColor = getContrastColor(tagColor);
                    
                    return (
                      <span 
                        key={tag}
                        className="task-tag"
                        style={{ 
                          backgroundColor: tagColor,
                          color: textColor
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
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
        ref={dropdownRef}
        isOpen={dropdownOpen}
        position={dropdownPosition}
        onClose={() => setDropdownOpen(false)}
        onReminderClick={handleReminderClick}
        onListClick={handleListClick}
        onTagsClick={handleTagsClick}
        onPinClick={handlePinClick}
        isPinned={isPinned}
      />

      {/* List Popup */}
      {isListPopupOpen && (
        <ListPopup
          isOpen={isListPopupOpen}
          onClose={() => setIsListPopupOpen(false)}
          onListSelect={handleListSelect}
          selectedList={currentList}
          userLists={userLists}
          onAddList={onAddList}
        />
      )}

      {/* Reminder Popup */}
      {reminderPopupOpen && (
        <ReminderPopup 
          isOpen={reminderPopupOpen}
          onClose={() => setReminderPopupOpen(false)}
          onSave={handleReminderSave}
          initialDate={reminder?.date}
        />
      )}

      {/* Tag Popup */}
      {showTagPopup && (
        <TagPopup
          isOpen={showTagPopup}
          onClose={() => setShowTagPopup(false)}
          onSave={handleTagsSave}
          selectedTags={selectedTags}
        />
      )}

      <TaskExpandedPopup
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        currentList={currentList}
        selectedTags={selectedTags}
      />
    </>
  );
};

export default TaskCard; 