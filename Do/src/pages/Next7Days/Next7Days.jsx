import React, { useState, useRef, useEffect } from 'react';
import './Next7Days.css';
import { FiPlus, FiCalendar, FiFilter, FiMoreHorizontal } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

const Next7Days = ({ 
  tasks,
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  userLists,
  onAddList
}) => {
  const [expandedTaskInput, setExpandedTaskInput] = useState(null);
  const [taskText, setTaskText] = useState('');
  const taskInputRef = useRef(null);
  const daysGridRef = useRef(null);
  const dayCardRefs = useRef([]);

  // Initialize refs array for day cards
  useEffect(() => {
    dayCardRefs.current = Array(7).fill().map((_, i) => dayCardRefs.current[i] || React.createRef());
  }, []);

  // Get dates for the next 7 days
  const getDaysArray = () => {
    const days = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      days.push({
        date,
        dayName: dayNames[date.getDay()],
        dayShort: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
        dateFormatted: date.getDate(),
        month: monthNames[date.getMonth()],
        isToday: i === 0
      });
    }
    
    return days;
  };
  
  const days = getDaysArray();
  
  // Filter tasks for specific day
  const getTasksForDay = (dayIndex) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayIndex);
    const dateStr = targetDate.toISOString().split('T')[0];
    
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate === dateStr
    );
  };

  // Handle clicks outside the expanded input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedTaskInput !== null && 
          taskInputRef.current && 
          !taskInputRef.current.contains(event.target)) {
        setExpandedTaskInput(null);
        setTaskText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedTaskInput]);

  // Focus input when expanded
  useEffect(() => {
    if (expandedTaskInput !== null && taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [expandedTaskInput]);

  // Update card heights when tasks change
  useEffect(() => {
    // This will run whenever tasks array changes
    dayCardRefs.current.forEach((ref, index) => {
      if (ref && ref.current) {
        const tasksCount = getTasksForDay(index).length;
        // Apply a class based on task count
        if (tasksCount === 0) {
          ref.current.classList.remove('has-tasks');
          ref.current.classList.remove('has-multiple-tasks');
        } else if (tasksCount === 1) {
          ref.current.classList.add('has-tasks');
          ref.current.classList.remove('has-multiple-tasks');
        } else {
          ref.current.classList.add('has-tasks');
          ref.current.classList.add('has-multiple-tasks');
        }
      }
    });
  }, [tasks]);

  const handleAddTask = (dayIndex) => {
    if (taskText.trim()) {
      // Calculate the target date based on dayIndex
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayIndex);
      
      // Format the date as ISO string but keep only the date part
      const dateStr = targetDate.toISOString().split('T')[0];
      
      onAddTask(taskText, 'Personal', dateStr);
      setTaskText('');
      setExpandedTaskInput(null);
    }
  };

  const handleKeyDown = (e, dayIndex) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask(dayIndex);
    } else if (e.key === 'Escape') {
      setExpandedTaskInput(null);
      setTaskText('');
    }
  };

  return (
    <div className="next7days-wrapper">
      <div className="next7days-container">
        <div className="app-header">
          <div className="header-left">
            <div className="calendar-icon">
              <FiCalendar size={20} />
            </div>
            <h1>Next 7 days</h1>
          </div>
          
          <div className="header-right">
            <button className="my-lists-button">
              <span>My lists</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L5 7L8 4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="filter-button">
              <FiFilter size={16} />
              <span>Filter</span>
            </button>
            
            <button className="more-options-button">
              <FiMoreHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <div className="days-grid-container">
          <div className="days-grid" ref={daysGridRef}>
            {days.map((day, index) => {
              const dayTasks = getTasksForDay(index);
              const taskCount = dayTasks.length;
              
              return (
                <div 
                  key={index} 
                  className={`day-card ${taskCount > 0 ? 'has-tasks' : ''} ${taskCount > 1 ? 'has-multiple-tasks' : ''}`}
                  ref={dayCardRefs.current[index]}
                  data-task-count={taskCount}
                >
                  <div className="day-header">
                    <h2>
                      {day.dayShort} 
                      {day.isToday ? 
                        <span className="today-label">{day.dayName}</span> : 
                        <span className="day-date">{day.dateFormatted}</span>
                      }
                    </h2>
                  </div>
                  
                  <div className="day-tasks-container">
                    {dayTasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="task-item">
                        <div 
                          className="checkbox" 
                          onClick={() => onToggleComplete(task.id)}
                        >
                          <div className="checkbox-circle"></div>
                        </div>
                        <div className="task-info">
                          <div className="task-label">My lists • {task.list}</div>
                          <div className="task-text">{task.title}</div>
                        </div>
                        <div 
                          className="task-close"
                          onClick={() => onDeleteTask(task.id)}
                        >
                          <IoCloseOutline size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {expandedTaskInput === index ? (
                    <div className="task-item add-task-row" ref={taskInputRef}>
                      <div className="add-task-plus">
                        <FiPlus size={16} />
                      </div>
                      <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder="Add Task"
                        className="add-task-inline-input"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div 
                      className="task-item add-task-row"
                      onClick={() => setExpandedTaskInput(index)}
                    >
                      <div className="add-task-plus">
                        <FiPlus size={16} />
                      </div>
                      <div className="add-task-placeholder">Add Task</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Next7Days;