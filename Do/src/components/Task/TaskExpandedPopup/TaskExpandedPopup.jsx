import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { BsBell } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import './TaskExpandedPopup.css';

const TaskExpandedPopup = ({ 
  isOpen, 
  onClose, 
  task, 
  onUpdate,
  onDelete,
  currentList = 'Personal',
  selectedTags = []
}) => {
  const [notes, setNotes] = useState(task.notes || '');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskMenu, setShowSubtaskMenu] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    onUpdate({
      ...task,
      notes: e.target.value
    });
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      const newSubtasks = [
        ...subtasks,
        { id: Date.now(), title: newSubtask.trim(), completed: false }
      ];
      setSubtasks(newSubtasks);
      setNewSubtask('');
      onUpdate({
        ...task,
        subtasks: newSubtasks
      });
    }
  };

  const handleSubtaskComplete = (subtaskId) => {
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    setSubtasks(updatedSubtasks);
    onUpdate({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  const handleMarkComplete = () => {
    onUpdate({
      ...task,
      completed: true
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="task-expanded-overlay" onClick={onClose}>
      <div className="task-expanded-popup" onClick={e => e.stopPropagation()}>
        <div className="task-expanded-header">
          <div className="header-left">
            <span className="list-path">My lists &gt; {currentList}</span>
          </div>
          <div className="header-actions">
            <button className="header-action-btn" onClick={handleMarkComplete}>
              <span className="complete-icon"></span>
              Mark as complete
            </button>
            <button className="header-action-btn" onClick={handleDelete}>
              <IoTrashOutline />
            </button>
            <button className="header-action-btn" onClick={onClose}>
              <IoCloseOutline />
            </button>
          </div>
        </div>

        <div className="task-expanded-content">
          <h1 className="task-title">{task.title}</h1>

          <div className="quick-actions">
            <button className="quick-action-btn">
              <BsBell />
              <span>Remind me</span>
            </button>
            <button className="quick-action-btn">
              <span className="list-icon"></span>
              <span>{currentList}</span>
            </button>
            <button className="quick-action-btn">
              <span className="tag-icon">#</span>
              <span>Tags</span>
            </button>
          </div>

          <div className="section notes-section">
            <h2>NOTES</h2>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Insert your notes here"
              className="notes-input"
            />
          </div>

          <div className="section subtasks-section">
            <div className="section-header">
              <h2>SUBTASKS <span className="count">{subtasks.filter(st => st.completed).length}/{subtasks.length}</span></h2>
              <button 
                className="subtask-menu-btn"
                onClick={() => setShowSubtaskMenu(!showSubtaskMenu)}
              >
                <HiOutlineDotsVertical />
              </button>
              {showSubtaskMenu && (
                <div className="subtask-menu">
                  <button>Sort by name</button>
                  <button>Sort by date</button>
                  <button>Clear completed</button>
                </div>
              )}
            </div>
            <div className="subtasks-list">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="subtask-item">
                  <label className="subtask-checkbox">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskComplete(subtask.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span className={`subtask-title ${subtask.completed ? 'completed' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="add-subtask">
              <div className="checkbox-placeholder"></div>
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask(e)}
                placeholder="Add a new subtask"
                className="add-subtask-input"
              />
            </div>
          </div>

          <div className="section attachments-section">
            <h2>ATTACHMENTS</h2>
            <div className="attachment-dropzone">
              Click to add / drop your files here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskExpandedPopup; 