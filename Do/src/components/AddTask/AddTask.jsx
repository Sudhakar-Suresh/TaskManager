import { useState, useEffect, useRef } from 'react';
import './AddTask.css';

const AddTask = ({ onAddTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskText, setTaskText] = useState('');
  const taskInputRef = useRef(null);
  const containerRef = useRef(null);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
        setTaskText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText);
      setTaskText('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setTaskText('');
    }
  };

  if (!isExpanded) {
    return (
      <div 
        className="add-task-container" 
        onClick={() => setIsExpanded(true)}
        ref={containerRef}
      >
        <div className="add-task-simple">
          <span className="task-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="4" fill="#F0F0F0" />
              <path d="M9 5V13M5 9H13" stroke="#777777" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="task-placeholder">Add task</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="add-task-container expanded"
      ref={containerRef}
    >
      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter task title"
          className="task-input-expanded"
          ref={taskInputRef}
        />
        <button 
          type="button" 
          className="collapse-button"
          onClick={() => setIsExpanded(false)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10L8 5L13 10" stroke="#777777" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AddTask; 