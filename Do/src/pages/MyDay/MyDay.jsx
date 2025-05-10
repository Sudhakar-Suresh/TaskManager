import { useState } from 'react';
import AddTask from '../../components/Task/AddTask/AddTask';
import TaskCard from '../../components/Task/TaskCard/TaskCard';
import './MyDay.css';

const MyDay = ({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  isCompletedView = false,
  userLists = [],
  onAddList,
  listName
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
    <div className="my-day-container">
      <div className="day-header">
        <div className="greeting-section">
          <h1>{listName || 'My day'}</h1>
          <p>{getGreeting()}, Sudhakar</p>
        </div>
        
        <div className="date-display">
          <div className="date-box">
            <div className="day-name">{dayName}</div>
            <div className="date-number">{date}</div>
            <div className="month-name">{month}</div>
          </div>
        </div>
      </div>
      
      <div className="tasks-section">
        {!isCompletedView && (
          <AddTask onAddTask={onAddTask} />
        )}
        
        <div className="tasks-list">
          {sortedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              onToggleComplete={onToggleComplete}
              userLists={userLists}
              onAddList={onAddList}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDay; 