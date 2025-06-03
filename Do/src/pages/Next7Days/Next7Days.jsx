import React, { useState, useRef, useEffect } from 'react';
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
    <div className="next7days-wrapper">
      <div className="next7days-container">
        <div className="app-header">
          <div className="header-left">
            <div className="calendar-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="18" height="16" rx="2" stroke="#333" strokeWidth="1.5"/>
                <path d="M1 7H19" stroke="#333" strokeWidth="1.5"/>
                <path d="M6 1V5" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 1V5" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1>Next 7 days</h1>
          </div>
          
          <div className="header-right">
            <div className="my-lists-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8Z" fill="#555"/>
                <path d="M2 4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H3C2.44772 5 2 4.55228 2 4Z" fill="#555"/>
                <path d="M2 12C2 11.4477 2.44772 11 3 11H9C9.55228 11 10 11.4477 10 12C10 12.5523 9.55228 13 9 13H3C2.44772 13 2 12.5523 2 12Z" fill="#555"/>
              </svg>
              <span>My lists</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L5 7L8 4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="filter-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 8H12" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6 12H10" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Filter</span>
            </div>
            
            <div className="more-options-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="3" r="1.5" fill="#555"/>
                <circle cx="8" cy="8" r="1.5" fill="#555"/>
                <circle cx="8" cy="13" r="1.5" fill="#555"/>
              </svg>
            </div>
            
            <button className="clear-completed-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 12M4 12L12 4" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Clear completed</span>
            </button>
          </div>
        </div>
        
        <div className="days-grid-container">
          <div className="days-grid">
            {days.map((day, index) => (
              <div key={index} className="day-card">
                <div className="day-header">
                  <h2>{day.dayShort} {day.isToday && <span className="today-label">Tuesday</span>}</h2>
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
                          <div className="task-text">{task.title || "zsdfg"}</div>
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
                          <div className="task-text">zsdfg</div>
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
      </div>
    </div>
  );
};

export default Next7Days;