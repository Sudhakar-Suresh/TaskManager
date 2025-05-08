import { useState, useEffect } from 'react';
import AddTask from '../../components/AddTask/AddTask';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import './MyDay.css';

const MyDay = () => {
  const [tasks, setTasks] = useState([]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[today.getDay()];
  const date = today.getDate();
  const month = months[today.getMonth()].substring(0, 3);

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="myday-container">
      {/* Header with greeting */}
      <div className="myday-header">
        <h1>{getGreeting()}, Sudhakar<span className="dot">.</span></h1>
        <p className="subtitle">Time to make your own luck</p>
      </div>
      
      {/* Calendar section */}
      <div className="calendar-section">
        <div className="date-display">
          <div className="day-name">{dayName}</div>
          <div className="date-number">{date}</div>
          <div className="month-name">{month}</div>
        </div>
        <div className="calendar-info">
          <p>Join video meetings with one tap</p>
          <div className="calendar-buttons">
            <button className="calendar-button google">
              <span className="calendar-icon">📅</span> Connect Google Calendar
            </button>
            <button className="calendar-button outlook">
              <span className="calendar-icon">📆</span> Connect Outlook Calendar
            </button>
          </div>
        </div>
      </div>
      
      {/* Task list would go here */}
      
      <AddTask onAddTask={handleAddTask} />
      <BackgroundImage />
    </div>
  );
};

export default MyDay; 