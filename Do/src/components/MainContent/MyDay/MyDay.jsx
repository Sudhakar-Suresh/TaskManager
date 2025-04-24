import React, { useState } from 'react';
import './MyDay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faBell, faSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

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
  
  const handleAddTask = (taskText) => {
    if (taskText && taskText.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: taskText,
        completed: false
      }]);
    }
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

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
      
      {tasks.length === 0 ? (
        <div className="content-placeholder">
          {/* Intentionally empty - background will come from the parent */}
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input 
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskComplete(task.id)}
              />
              <span>{task.text}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="add-task-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.elements.taskInput;
          handleAddTask(input.value);
          input.value = '';
        }}>
          <div className="add-task-input">
            <input
              type="text"
              name="taskInput"
              placeholder="Add task"
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyDay;
