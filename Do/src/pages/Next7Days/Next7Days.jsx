import React, { useState, useRef, useEffect } from 'react';
import './Next7Days.css';
import { FiPlus, FiCalendar, FiFilter, FiMoreHorizontal } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import TaskCard from '../../components/Task/TaskCard/TaskCard';
import AddTask from '../../components/Task/AddTask/AddTask';

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

  // Add task with specific due date
  const handleAddTaskForDay = (text, dayIndex) => {
    if (text.trim()) {
      // Calculate the target date based on dayIndex
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayIndex);
      
      // Format the date as ISO string but keep only the date part
      const dateStr = targetDate.toISOString().split('T')[0];
      
      onAddTask(text, 'Personal', dateStr);
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
              
              return (
                <div 
                  key={index} 
                  className="day-card"
                  data-task-count={dayTasks.length}
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
                    {dayTasks.map((task) => (
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
                    
                    <div className="day-add-task-wrapper">
                      <div 
                        className="day-add-task-button"
                        onClick={() => setExpandedTaskInput(index)}
                      >
                        <FiPlus size={16} />
                        <span>Add Task</span>
                      </div>
                      
                      {expandedTaskInput === index && (
                        <div className="day-add-task-input">
                          <input
                            type="text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            placeholder="Enter task title"
                            ref={taskInputRef}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTaskForDay(taskText, index);
                                setTaskText('');
                                setExpandedTaskInput(null);
                              } else if (e.key === 'Escape') {
                                setExpandedTaskInput(null);
                                setTaskText('');
                              }
                            }}
                          />
                          <div className="day-add-task-actions">
                            <button 
                              onClick={() => {
                                handleAddTaskForDay(taskText, index);
                                setTaskText('');
                                setExpandedTaskInput(null);
                              }}
                              disabled={!taskText.trim()}
                            >
                              Add
                            </button>
                            <button 
                              onClick={() => {
                                setExpandedTaskInput(null);
                                setTaskText('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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