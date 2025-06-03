import React from 'react';
import './AllTasks.css';
import TaskCard from '../../components/Task/TaskCard/TaskCard';

const AllTasks = ({
  tasks,
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  userLists,
  onAddList
}) => {
  // Filter for non-completed tasks
  const activeTasks = tasks.filter(task => !task.completed);
  
  return (
    <div className="alltasks-root">
      <div className="alltasks-container">
        <div className="alltasks-header">
          <div className="header-main">
            <h1>All Tasks<span className="dot">.</span></h1>
            <div className="header-actions">
              <button className="action-btn">Sort</button>
              <button className="action-btn">Filter</button>
            </div>
          </div>
          <p className="subtitle">View and manage all your tasks</p>
        </div>
        <div className="alltasks-content">
          {activeTasks.length > 0 ? (
            <div className="tasks-list">
              {activeTasks.map(task => (
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
          ) : (
            <div className="empty-state">
              <p>No tasks added yet</p>
              <button 
                className="add-task-btn"
                onClick={() => onAddTask("New task")}
              >
                + Add Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasks; 