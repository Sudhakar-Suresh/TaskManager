import React, { useState, useRef, useEffect } from 'react';
import './AddTask.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faBell, 
  faCalendarAlt, 
  faTag, 
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const AddTask = ({ onAddTask, listOptions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [selectedList, setSelectedList] = useState(listOptions[0] || 'My day');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  const [reminder, setReminder] = useState(null);
  
  const inputRef = useRef(null);
  const componentRef = useRef(null);
  
  // Focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Handle clicks outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        if (isExpanded && !taskTitle.trim()) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, taskTitle]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (taskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        notes: taskNotes,
        list: selectedList,
        dueDate: dueDate || null,
        tags: [...tags],
        reminder: reminder,
        completed: false,
        createdAt: new Date(),
      };
      
      onAddTask(newTask);
      
      // Reset form
      setTaskTitle('');
      setTaskNotes('');
      setDueDate('');
      setTags([]);
      setReminder(null);
      
      // Collapse if needed
      setIsExpanded(false);
    }
  };
  
  // Format date to display in a friendly way
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = '';
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div 
      className={`add-task-component ${isExpanded ? 'expanded' : ''}`} 
      ref={componentRef}
    >
      <form onSubmit={handleSubmit}>
        <div className="add-task-input-row">
          <div className="add-icon">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a task"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onClick={() => !isExpanded && setIsExpanded(true)}
            className="task-title-input"
          />
          
          {isExpanded && (
            <button type="submit" className="add-task-submit">
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
        </div>
        
        {isExpanded && (
          <div className="expanded-content">
            <textarea
              placeholder="Add notes"
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              className="task-notes"
            />
            
            <div className="task-options">
              <div className="task-list-select">
                <select 
                  value={selectedList} 
                  onChange={(e) => setSelectedList(e.target.value)}
                >
                  {listOptions.length > 0 ? (
                    listOptions.map(list => (
                      <option key={list} value={list}>{list}</option>
                    ))
                  ) : (
                    <option value="My day">My day</option>
                  )}
                </select>
              </div>
              
              <div className="task-date-picker">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                {dueDate && (
                  <span className="date-display">
                    {formatDate(dueDate)}
                    <button 
                      type="button" 
                      onClick={() => setDueDate('')}
                      className="clear-date"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </span>
                )}
              </div>
              
              <div className="task-reminder">
                <FontAwesomeIcon icon={faBell} />
                <select 
                  value={reminder || ''} 
                  onChange={(e) => setReminder(e.target.value || null)}
                >
                  <option value="">No reminder</option>
                  <option value="today">Later today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="nextWeek">Next week</option>
                </select>
              </div>
            </div>
            
            <div className="task-tags">
              <FontAwesomeIcon icon={faTag} />
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div key={index} className="tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  placeholder="Add tag..." 
                  onKeyDown={handleAddTag}
                  className="tag-input"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTask; 