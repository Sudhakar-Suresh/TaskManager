import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import './MyCalendar.css';

const MyCalendar = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  // Get days for the calendar
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Calculate total days to show (including days from previous and next months)
    const totalDays = 42; // 6 rows of 7 days
    
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: 
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      });
    }
    
    // Add days from next month
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    setCalendarDays(days);
  };

  const getTasksForDate = (date) => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear() &&
        !task.completed
      );
    });
  };

  const navigateToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const navigateToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.date);
  };

  const handleCreateTask = () => {
    setShowCreateTask(true);
  };

  const handleCreateTaskSubmit = () => {
    // This would be implemented to call the onAddTask function
    // For now, we'll just close the create task form
    setShowCreateTask(false);
    setNewTaskText('');
  };

  const renderWeekdayHeaders = () => {
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    
    return (
      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar-left">
          <button 
            className="today-button"
            onClick={navigateToToday}
          >
            TODAY
          </button>
          <div className="calendar-navigation">
            <button 
              className="nav-button"
              onClick={navigateToPreviousMonth}
            >
              <FiChevronLeft />
            </button>
            <button 
              className="nav-button"
              onClick={navigateToNextMonth}
            >
              <FiChevronRight />
            </button>
          </div>
          <h2 className="current-month">{formatMonthYear(currentDate)}</h2>
        </div>
        
        <div className="calendar-toolbar-right">
          <div className="view-selector">
            <select 
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
            >
              <option value="month">MONTH</option>
              <option value="week">WEEK</option>
              <option value="day">DAY</option>
            </select>
          </div>
          <div className="calendar-actions">
            <button className="action-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#333"/>
                <path d="M19 15C19.5523 15 20 14.5523 20 14C20 13.4477 19.5523 13 19 13C18.4477 13 18 13.4477 18 14C18 14.5523 18.4477 15 19 15Z" fill="#333"/>
                <path d="M19 11C19.5523 11 20 10.5523 20 10C20 9.44772 19.5523 9 19 9C18.4477 9 18 9.44772 18 10C18 10.5523 18.4477 11 19 11Z" fill="#333"/>
                <path d="M5 15C5.55228 15 6 14.5523 6 14C6 13.4477 5.55228 13 5 13C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15Z" fill="#333"/>
                <path d="M5 11C5.55228 11 6 10.5523 6 10C6 9.44772 5.55228 9 5 9C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11Z" fill="#333"/>
              </svg>
            </button>
            <button className="action-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M6 12H18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="action-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="15" rx="2" stroke="#333" strokeWidth="2"/>
                <path d="M3 10H21" stroke="#333" strokeWidth="2"/>
                <path d="M8 3V7" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 3V7" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="action-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="calendar-grid-container">
        {renderWeekdayHeaders()}
        
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const tasksForDay = getTasksForDate(day.date);
            const isSelected = selectedDate && 
              day.date.getDate() === selectedDate.getDate() &&
              day.date.getMonth() === selectedDate.getMonth() &&
              day.date.getFullYear() === selectedDate.getFullYear();
              
            return (
              <div 
                key={index} 
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="day-number">{day.date.getDate()}</div>
                <div className="day-tasks">
                  {tasksForDay.map((task, taskIndex) => (
                    <div key={taskIndex} className="calendar-task">
                      <div className="task-checkbox"></div>
                      <div className="task-title">{task.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <button className="create-button" onClick={handleCreateTask}>
        <FiPlus />
        <span>Create</span>
      </button>
      
      {showCreateTask && (
        <div className="create-task-modal">
          <div className="create-task-content">
            <h3>Create Task</h3>
            <input 
              type="text"
              placeholder="Task title"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <div className="create-task-actions">
              <button onClick={() => setShowCreateTask(false)}>Cancel</button>
              <button onClick={handleCreateTaskSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar; 