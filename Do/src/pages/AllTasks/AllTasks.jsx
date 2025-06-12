import React, { useState, useRef, useEffect } from 'react';
import './AllTasks.css';
import TaskCard from '../../components/Task/TaskCard/TaskCard';
import { FiPlus, FiShare2, FiFilter } from 'react-icons/fi';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineLightningBolt } from 'react-icons/hi';

const AllTasks = ({
  tasks,
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleComplete,
  userLists,
  onAddList
}) => {
  // State for columns
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To do', tasks: [] },
    { id: 'inProgress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);
  
  // State for new task inputs
  const [newTaskTexts, setNewTaskTexts] = useState({
    todo: '',
    inProgress: '',
    done: ''
  });
  
  // State for drag and drop
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  // Refs for columns
  const columnRefs = useRef({});
  
  // Update columns when tasks change
  useEffect(() => {
    const todoTasks = tasks.filter(task => !task.completed && !task.inProgress);
    const inProgressTasks = tasks.filter(task => !task.completed && task.inProgress);
    const completedTasks = tasks.filter(task => task.completed);
    
    setColumns([
      { id: 'todo', title: 'To do', tasks: todoTasks },
      { id: 'inProgress', title: 'In Progress', tasks: inProgressTasks },
      { id: 'done', title: 'Done', tasks: completedTasks }
    ]);
  }, [tasks]);
  
  // Handle adding new tasks
  const handleAddTask = (columnId) => {
    const text = newTaskTexts[columnId];
    if (!text.trim()) return;
    
    const newTask = {
      title: text,
      inProgress: columnId === 'inProgress',
      completed: columnId === 'done',
      list: 'Personal'
    };
    
    onAddTask(
      newTask.title, 
      newTask.list, 
      null, // dueDate
      '', // notes
      [], // tags
      newTask.completed, 
      newTask.inProgress
    );
    
    // Reset input field
    setNewTaskTexts(prev => ({
      ...prev,
      [columnId]: ''
    }));
  };
  
  // Handle input change
  const handleInputChange = (columnId, value) => {
    setNewTaskTexts(prev => ({
      ...prev,
      [columnId]: value
    }));
  };
  
  // Handle key press for input fields
  const handleKeyPress = (e, columnId) => {
    if (e.key === 'Enter') {
      handleAddTask(columnId);
    }
  };
  
  // Handle moving tasks between columns
  const handleTaskStatusChange = (task, newStatus) => {
    const updatedTask = {
      ...task,
      inProgress: newStatus === 'inProgress',
      completed: newStatus === 'done'
    };
    
    onUpdateTask(updatedTask);
  };
  
  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id);
    
    // Add a delay to set opacity (for visual feedback)
    setTimeout(() => {
      e.target.style.opacity = '0.4';
    }, 0);
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
    
    // Remove all drag-over classes
    columns.forEach(column => {
      if (columnRefs.current[column.id]) {
        columnRefs.current[column.id].classList.remove('drag-over');
      }
    });
  };
  
  // Handle drag over
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    
    // Add drag-over class to the column
    if (dragOverColumn !== columnId) {
      // Remove from previous column
      if (dragOverColumn && columnRefs.current[dragOverColumn]) {
        columnRefs.current[dragOverColumn].classList.remove('drag-over');
      }
      
      // Add to current column
      if (columnRefs.current[columnId]) {
        columnRefs.current[columnId].classList.add('drag-over');
      }
      
      setDragOverColumn(columnId);
    }
  };
  
  // Handle drop
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    // Remove drag-over class
    if (columnRefs.current[columnId]) {
      columnRefs.current[columnId].classList.remove('drag-over');
    }
    
    // Move the task
    if (draggedTask) {
      handleTaskStatusChange(draggedTask, columnId);
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };
  
  // Handle adding a new section
  const handleAddSection = () => {
    // This would typically open a dialog to name the new section
    // For now, we'll just add a placeholder section
    const newSectionId = `section-${Date.now()}`;
    
    setColumns(prev => [
      ...prev,
      { id: newSectionId, title: 'New Section', tasks: [] }
    ]);
    
    setNewTaskTexts(prev => ({
      ...prev,
      [newSectionId]: ''
    }));
  };
  
  return (
    <div className="alltasks-root">
      <div className="alltasks-container">
        <div className="alltasks-header">
          <div className="header-main">
            <div className="header-title">
              <h1>Next<span className="dot">.</span></h1>
            </div>
            <div className="header-actions">
              <button className="action-btn">
                <FiShare2 className="action-icon" />
                <span>Share</span>
              </button>
              <button className="action-btn">
                <BsGrid className="action-icon" />
                <span>View</span>
              </button>
              <button className="action-btn">
                <FiFilter className="action-icon" />
                <span>Filter</span>
              </button>
              <button className="action-btn">
                <HiOutlineLightningBolt className="action-icon" />
                <span>Automations</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="kanban-board">
          {columns.map(column => (
            <div 
              key={column.id}
              ref={el => columnRefs.current[column.id] = el}
              className="kanban-column"
              onDragOver={e => handleDragOver(e, column.id)}
              onDrop={e => handleDrop(e, column.id)}
            >
              <div className="column-header">
                <h2>{column.title}</h2>
              </div>
              
              <div className="column-content">
                {column.tasks.map(task => (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={e => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="task-wrapper"
                  >
                    <TaskCard 
                      task={task}
                      onDelete={onDeleteTask}
                      onUpdate={onUpdateTask}
                      onToggleComplete={onToggleComplete}
                      userLists={userLists}
                      onAddList={onAddList}
                    />
                  </div>
                ))}
                
                {/* Task input field - minimal design as in image */}
                <div className="add-task-container">
                  <button className="add-task-button">
                    <span className="add-icon">+</span>
                    <span className="add-text">Add Task</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Section Button */}
          <div className="add-section-column">
            <button className="add-section-button" onClick={handleAddSection}>
              <FiPlus className="add-section-icon" />
              <span>Add section</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTasks; 