import { useState } from 'react';
import AddTask from '../../components/AddTask/AddTask';
import TaskCard from '../../components/TaskCard/TaskCard';
import './MyDay.css';

const MyDay = ({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  isCompletedView = false 
}) => {
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

  // Sort tasks: pinned first, then by creation date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="myday-container">
      <div className="myday-header">
        <h1>{isCompletedView ? 'Completed Tasks' : getGreeting() + ', Sudhakar'}<span className="dot">.</span></h1>
        <p className="subtitle">
          {isCompletedView ? 'All your completed tasks' : 'Time to make your own luck'}
        </p>
      </div>
      
      {!isCompletedView && (
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
      )}
      
      <div className="tasks-section">
        {sortedTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
      
      {!isCompletedView && <AddTask onAddTask={onAddTask} />}
    </div>
  );
};

export default MyDay; 