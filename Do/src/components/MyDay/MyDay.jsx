import React, { useState, useEffect } from 'react';
import './MyDay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faBell, faSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddTask from '../AddTask/AddTask';
import BackgroundImage from '../BackgroundImage/BackgroundImage';

const MyDay = () => {
  const [tasks, setTasks] = useState([]);
  
  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[today.getDay()];
  const date = today.getDate();
  const month = months[today.getMonth()];
  
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Night';
  };
  
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  // Add this to your CSS variables if you need to apply the background color to elements
  useEffect(() => {
    // Add a CSS variable watcher if needed
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const mainBg = root.style.getPropertyValue('--main-background');
      // You can update other elements based on the main background change
    });
    
    observer.observe(root, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="myday-container">
      <div className="myday-header">
        <div className="header-content">
          <h1>{getGreeting()}, sudhakar<span className="dot">.</span></h1>
          <p className="subtitle">This is your private space</p>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <FontAwesomeIcon icon={faSync} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faSquare} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      
      <div className="date-section">
        <div className="date-column">
          <span className="day-name">{dayName}</span>
          <span className="date-number">{date}</span>
          <span className="month-name">{month}</span>
        </div>
        <div className="event-info">
          <p>You have no events scheduled for today</p>
        </div>
      </div>
      
      <AddTask 
        onAddTask={handleAddTask}
        listOptions={['My day', 'Next 7 days', 'Personal', 'Work']}
      />
      
      {tasks.length === 0 && (
        <div className="empty-state-background">
          {/* This div will show the selected background */}
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <input 
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  setTasks(tasks.map(t => 
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                  ));
                }}
              />
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.notes && <div className="task-note">{task.notes}</div>}
                
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="task-due-date">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  )}
                  
                  {task.list !== 'My day' && (
                    <span className="task-list">{task.list}</span>
                  )}
                  
                  {task.tags.length > 0 && (
                    <div className="task-tags-list">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="task-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <BackgroundImage />
    </div>
  );
};

export default MyDay; 