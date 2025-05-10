import React from 'react';
import TaskCard from '../../components/TaskCard/TaskCard';
import './CompletedTasks.css';

const CompletedTasks = ({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="completed-tasks-container">
        <div className="completed-tasks-header">
          <h1>Completed Tasks<span className="dot">.</span></h1>
          <p className="subtitle">No completed tasks yet</p>
        </div>
      </div>
    );
  }

  // Sort tasks by completion date (most recent first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0);
    const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0);
    return dateB - dateA;
  });

  // Group tasks by completion date
  const groupedTasks = sortedTasks.reduce((groups, task) => {
    const date = task.completedAt ? new Date(task.completedAt) : new Date();
    const dateKey = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {});

  return (
    <div className="completed-tasks-container">
      <div className="completed-tasks-header">
        <h1>Completed Tasks<span className="dot">.</span></h1>
        <p className="subtitle">Tasks you've accomplished</p>
        <div className="completed-count">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} completed
        </div>
      </div>

      <div className="completed-tasks-content">
        {Object.entries(groupedTasks).map(([date, tasksGroup]) => (
          <div key={date} className="completed-group">
            <div className="date-header">
              <span className="date-label">{date}</span>
              <span className="task-count">
                {tasksGroup.length} {tasksGroup.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <div className="tasks-group">
              {tasksGroup.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks; 