import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MyDay from './pages/MyDay/MyDay'
import CompletedTasks from './pages/CompletedTasks/CompletedTasks'
import BackgroundImage from './components/BackgroundImage/BackgroundImage'
import MyCalendar from './pages/MyCalendar/MyCalendar'
import AllTasks from './pages/AllTasks/AllTasks'
import Next7Days from './pages/Next7Days/Next7Days'

function App() {
  const [activePage, setActivePage] = useState('My day')
  const [userLists, setUserLists] = useState(() => {
    const savedLists = localStorage.getItem('userLists');
    return savedLists ? JSON.parse(savedLists) : ['Personal', 'Work', 'Grocery List'];
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCounts();
  }, [tasks]);
  
  // Save userLists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userLists', JSON.stringify(userLists));
  }, [userLists]);

  const [taskCounts, setTaskCounts] = useState({
    myDay: 0,
    completed: 0
  });

  const updateTaskCounts = () => {
    setTaskCounts({
      myDay: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length
    });
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            }
          : task
      )
    );
  };

  const handleAddTask = (taskText, list = 'Personal', dueDate = null) => {
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      isPinned: false,
      reminder: null,
      list: list || 'Personal',
      dueDate: dueDate
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? {
          ...task,
          ...updatedTask,
          tags: updatedTask.tags || []
        } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleAddList = (listName) => {
    if (!userLists.includes(listName)) {
      setUserLists(prev => [...prev, listName]);
    }
  };

  const handleListSelect = (listName) => {
    setActivePage(listName);
  };

  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded);
  };

  const renderContent = () => {
    if (activePage === 'My day') {
      return (
        <MyDay 
          tasks={tasks.filter(task => !task.completed)}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
        />
      );
    }

    if (activePage === 'Next 7 days') {
      return (
        <Next7Days 
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
        />
      );
    }

    if (activePage === 'All my tasks') {
      return (
        <AllTasks 
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
        />
      );
    }

    if (activePage === 'My Calendar') {
      return (
        <MyCalendar 
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
        />
      );
    }

    if (activePage === 'Completed') {
      return (
        <CompletedTasks 
          tasks={tasks.filter(task => task.completed)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
        />
      );
    }

    // For user lists
    if (userLists.includes(activePage)) {
      return (
        <MyDay 
          tasks={tasks.filter(task => !task.completed && task.list === activePage)}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          userLists={userLists}
          onAddList={handleAddList}
          listName={activePage}
        />
      );
    }

    return null;
  };

  return (
    <div className="app-container">
      <Sidebar 
        onPageChange={handlePageChange}
        onAddList={handleAddList}
        userLists={userLists}
        activeItem={activePage}
        onListSelect={handleListSelect}
        onSidebarToggle={handleSidebarToggle}
        taskCounts={taskCounts}
      />
      <div className={`main-content ${isSidebarExpanded ? 'shifted' : ''}`}>
        {renderContent()}
      </div>
      <BackgroundImage />
    </div>
  );
}

export default App;
