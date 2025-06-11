import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiArrowUp } from 'react-icons/fi';
import './DayAddTask.css';

const DayAddTask = ({ onAddTask, dayIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskText, setTaskText] = useState('');
  const taskInputRef = useRef(null);
  const containerRef = useRef(null);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(event.target)) {
        handleCancel();
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

  const handleAddTask = () => {
    if (taskText.trim()) {
      // Calculate the target date based on dayIndex
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayIndex);
      
      // Format the date as ISO string but keep only the date part
      const dateStr = targetDate.toISOString().split('T')[0];
      
      onAddTask(taskText, 'Personal', dateStr);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTaskText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isExpanded) {
    return (
      <div className="day-add-task-wrapper" ref={containerRef}>
        <div 
          className="day-add-task-button"
          onClick={() => setIsExpanded(true)}
        >
          <FiPlus size={16} />
          <span>Add Task</span>
        </div>
      </div>
    );
  }

  return (
    <div className="day-add-task-wrapper" ref={containerRef}>
      <div className="day-add-task-input">
        <div className="input-with-icon">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter task title"
            ref={taskInputRef}
            onKeyDown={handleKeyDown}
            autoFocus
            className={taskText ? "has-text" : ""}
          />
          <div className={`arrow-icon ${taskText ? "active" : ""}`}>
            <FiArrowUp />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DayAddTask; 