import { useState } from 'react';
import AddTask from '../../components/Task/AddTask/AddTask';
import TaskCard from '../../components/Task/TaskCard/TaskCard';
import TaskExpandedPopup from '../../components/Task/TaskExpandedPopup/TaskExpandedPopup';
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
  listName = 'Personal'
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

  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="my-day-container">
      <div className="header-content">
        <div className="greeting-container">
          <h1 className="greeting-heading">{getGreeting()}, Sudhakar<span className="blue-dot">.</span></h1>
          <p className="greeting-subtitle">Time to make your own luck</p>
        </div>
        
        <div className="date-container">
          <div className="date-card">
            <div className="date-day-name">{dayName}</div>
            <div className="date-number">{date}</div>
            <div className="date-month">May</div>
          </div>
          
          <div className="meeting-info">
            <p className="meeting-text">Join video meetings with one tap</p>
            <div className="calendar-buttons">
              <button className="calendar-button google">
                <span className="calendar-icon">📅</span>
                Connect Google Calendar
              </button>
              <button className="calendar-button outlook">
                <span className="calendar-icon">📆</span>
                Connect Outlook Calendar
              </button>
            </div>
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
      
      {selectedTask && (
        <TaskExpandedPopup
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          currentList={listName}
          userLists={userLists}
          onAddList={onAddList}
          selectedTags={selectedTask.tags || []}
        />
      )}
    </div>
  );
};

export default MyDay; 