import React, { useState } from 'react';
import './Next7Days.css';
import { FiPlus } from 'react-icons/fi';

const Next7Days = ({ 
  tasks,
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  userLists,
  onAddList
}) => {
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
  
  // Filter tasks for My lists > Personal
  const getPersonalTasks = (day) => {
    return tasks.filter(task => 
      task.list === 'Personal' && 
      !task.completed
    );
  };

  const handleAddTask = (text) => {
    onAddTask(text);
  };

  return (
    <div className="next7days-container">
      <div className="next7days-header">
        <div className="header-left">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#F0F0F0"/>
              <path d="M8 12H16M12 8V16" stroke="#555555" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Next 7 days</h1>
        </div>
        <div className="header-actions">
          <div className="my-lists-filter">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8H12M4 4H12M4 12H8" stroke="#555555" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>My lists</span>
          </div>
          <div className="filter-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H14M4 8H12M6 12H10" stroke="#555555" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Filter</span>
          </div>
          <div className="more-options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V3.01M8 8V8.01M8 13V13.01" stroke="#555555" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <button className="clear-completed-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H14M6 4V2H10V4M8 7V11M5 14H11C11.5523 14 12 13.5523 12 13V5H4V13C4 13.5523 4.4477 14 5 14Z" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Clear completed</span>
          </button>
        </div>
      </div>
      
      <div className="days-grid">
        {days.map((day, index) => (
          <div key={index} className="day-card">
            <div className="day-header">
              <h2>{day.dayShort} <span className={day.isToday ? "today-label" : ""}>{day.isToday ? "Tuesday" : ""}</span></h2>
            </div>
            
            {index === 0 && (
              <>
                {getPersonalTasks(day).map((task, taskIndex) => (
                  <div key={taskIndex} className="task-item">
                    <div className="checkbox">
                      <div className="checkbox-circle"></div>
                    </div>
                    <div className="task-info">
                      <div className="task-label">My lists • Personal</div>
                      <div className="task-text">{task.title || "sdf"}</div>
                    </div>
                    <div className="task-close">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L11 11M3 11L11 3" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                ))}
                
                {getPersonalTasks(day).length === 0 && (
                  <div className="task-item">
                    <div className="checkbox">
                      <div className="checkbox-circle"></div>
                    </div>
                    <div className="task-info">
                      <div className="task-label">My lists • Personal</div>
                      <div className="task-text">sdf</div>
                    </div>
                    <div className="task-close">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L11 11M3 11L11 3" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="task-item add-me-task">
                  <div className="checkbox empty"></div>
                  <div className="task-info">
                    <div className="task-text add-task-text">Add me to My Day</div>
                  </div>
                  <div className="task-close">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L11 11M3 11L11 3" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </>
            )}
            
            <div className="add-task-button">
              <FiPlus size={16} />
              <span>Add Task</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Next7Days;