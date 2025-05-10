import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MyDay from './pages/MyDay/MyDay'
import CompletedTasks from './pages/CompletedTasks/CompletedTasks'
import BackgroundImage from './components/BackgroundImage/BackgroundImage'

function App() {
  const [activePage, setActivePage] = useState('My day')
  const [userLists, setUserLists] = useState([])
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

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      isPinned: false,
      reminder: null
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

    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(
      tasks.map(task => 
        task.id === updatedTask.id ? {
          ...task,
          ...updatedTask,
          tags: updatedTask.tags || []
        } : task
      )
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleAddList = (listName) => {
    setUserLists(prev => [...prev, listName]);
  };

  const handleListSelect = (listName) => {
    setActivePage(listName);
  };

  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded);
  };

  const renderContent = () => {
    switch(activePage) {
      case 'My day':
        return (
          <MyDay 
            tasks={tasks.filter(task => !task.completed)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        );
      case 'Completed':
        return (
          <CompletedTasks 
            tasks={tasks.filter(task => task.completed)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        );
      default:
        return <div>Select a page</div>;
    }
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
