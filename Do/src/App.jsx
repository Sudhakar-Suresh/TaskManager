import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MyDay from './pages/MyDay/MyDay'
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
    const myDayCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.filter(task => task.completed).length;
    setTaskCounts({
      myDay: myDayCount,
      completed: completedCount
    });
  };

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
      isPinned: false,
      reminder: null,
      createdAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
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
          <MyDay 
            tasks={tasks.filter(task => task.completed)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            isCompletedView={true}
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
