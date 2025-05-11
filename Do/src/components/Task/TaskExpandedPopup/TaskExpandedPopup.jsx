import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { BsBell } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import { BiListUl } from 'react-icons/bi';
import { HiHashtag } from 'react-icons/hi';
import ReminderPopup from '../../ReminderPopup/ReminderPopup';
import ListPopup from '../../List/ListPopup/ListPopup';
import TagPopup from '../../TagPopup/TagPopup';
import './TaskExpandedPopup.css';

const TaskExpandedPopup = ({ 
  isOpen, 
  onClose, 
  task, 
  onUpdate,
  onDelete,
  currentList = 'Personal',
  selectedTags = [],
  userLists = [],
  onAddList
}) => {
  const [notes, setNotes] = useState(task.notes || '');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskMenu, setShowSubtaskMenu] = useState(false);

  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [reminder, setReminder] = useState(task.reminder || null);
  const [currentTags, setCurrentTags] = useState(selectedTags);
  const [taskList, setTaskList] = useState(task.list || currentList);

  const [tagDefinitions, setTagDefinitions] = useState(() => {
    const storedTags = localStorage.getItem('appTags');
    return storedTags 
      ? JSON.parse(storedTags)
      : [
          { id: 1, name: 'Priority', color: '#FFD700' },
          { id: 2, name: 'new', color: '#FF7F50' }
        ];
  });

  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('userLists');
    return savedLists ? JSON.parse(savedLists) : ['Personal', 'Work', 'Grocery List'];
  });

  useEffect(() => {
    if (task.list) {
      setTaskList(task.list);
    } else if (currentList) {
      setTaskList(currentList);
    }
  }, [task.list, currentList]);

  useEffect(() => {
    if (userLists && userLists.length > 0) {
      setLists(userLists);
    }
  }, [userLists]);

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

  const handleReminderClick = (e) => {
    e.stopPropagation();
    setShowReminderPopup(true);
    setShowListPopup(false);
    setShowTagPopup(false);
  };

  const handleReminderSave = (reminderData) => {
    const updatedTask = {
      ...task,
      reminder: {
        date: reminderData.date,
        isRecurring: reminderData.isRecurring
      }
    };
    setReminder(updatedTask.reminder);
    onUpdate(updatedTask);
    setShowReminderPopup(false);
  };

  const handleListClick = (e) => {
    e.stopPropagation();
    setShowListPopup(true);
    setShowReminderPopup(false);
    setShowTagPopup(false);
  };

  const handleListSelect = (listName) => {
    setTaskList(listName);
    onUpdate({
      ...task,
      list: listName
    });
    setShowListPopup(false);
  };

  const handleTagsClick = (e) => {
    e.stopPropagation();
    setShowTagPopup(true);
    setShowReminderPopup(false);
    setShowListPopup(false);
  };

  const handleTagsSave = (tags) => {
    setCurrentTags(tags);
    onUpdate({
      ...task,
      tags: tags
    });
    setShowTagPopup(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const getTagColor = (tagName) => {
    const tag = tagDefinitions.find(t => t.name === tagName);
    return tag ? tag.color : '#E0E0E0';
  };

  if (!isOpen) return null;

  return (
    <div className="task-expanded-overlay" onClick={onClose}>
      <div className="task-expanded-popup" onClick={e => e.stopPropagation()}>
        <div className="task-expanded-header">
          <div className="header-left">
            <span className="list-path">My lists &gt; {taskList}</span>
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
            <button 
              className={`quick-action-btn ${reminder ? 'has-reminder' : ''}`} 
              onClick={handleReminderClick}
            >
              <BsBell className="action-icon" />
              <span>{reminder ? formatDate(reminder.date) : 'Remind me'}</span>
              {reminder?.isRecurring && <span className="recurring-indicator">↻</span>}
            </button>

            <button 
              className="quick-action-btn" 
              onClick={handleListClick}
              title="Change list"
            >
              <BiListUl className="action-icon" />
              <span>{taskList}</span>
            </button>

            <button 
              className={`quick-action-btn ${currentTags.length > 0 ? 'has-tags' : ''}`} 
              onClick={handleTagsClick}
            >
              <HiHashtag className="action-icon" />
              <span>Tags {currentTags.length > 0 && `(${currentTags.length})`}</span>
            </button>
          </div>

          {currentTags.length > 0 && (
            <div className="task-tags">
              {currentTags.map(tag => (
                <span 
                  key={tag}
                  className="task-tag"
                  style={{ backgroundColor: getTagColor(tag) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

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

        {showReminderPopup && (
          <ReminderPopup 
            isOpen={showReminderPopup}
            onClose={() => setShowReminderPopup(false)}
            onSave={handleReminderSave}
            initialDate={reminder?.date}
            isRecurring={reminder?.isRecurring}
          />
        )}

        {showListPopup && (
          <ListPopup
            isOpen={showListPopup}
            onClose={() => setShowListPopup(false)}
            onListSelect={handleListSelect}
            selectedList={taskList}
            userLists={lists}
            onAddList={(listName) => {
              if (onAddList) {
                onAddList(listName);
                setLists(prev => [...prev, listName]);
                handleListSelect(listName);
              }
            }}
            variant="centered"
          />
        )}

        {showTagPopup && (
          <TagPopup
            isOpen={showTagPopup}
            onClose={() => setShowTagPopup(false)}
            onSave={handleTagsSave}
            selectedTags={currentTags}
            tagDefinitions={tagDefinitions}
          />
        )}
      </div>
    </div>
  );
};

export default TaskExpandedPopup; 