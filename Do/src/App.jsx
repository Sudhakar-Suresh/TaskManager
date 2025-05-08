import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MyDay from './pages/MyDay/MyDay'
import BackgroundImage from './components/BackgroundImage/BackgroundImage'

function App() {
  const [activePage, setActivePage] = useState('My day')
  const [userLists, setUserLists] = useState([])
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [taskCounts, setTaskCounts] = useState({
    myDay: 0,
    next7Days: 0
  })

  // Restore background from localStorage on initial load
  useEffect(() => {
    const savedBackgroundId = localStorage.getItem('selectedBackground');
    if (savedBackgroundId) {
      // You can implement additional logic here if needed
    }
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page)
  }

  const handleAddList = (listName) => {
    setUserLists([...userLists, listName])
  }

  const handleListSelect = (listName) => {
    setActivePage(listName)
  }

  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded)
  }

  const renderContent = () => {
    switch(activePage) {
      case 'My day':
        return <MyDay />;
      // Add other cases for different pages
      default:
        return <div>Select a page</div>;
    }
  }

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
      
      {/* BackgroundImage component should be outside other components */}
      <BackgroundImage />
    </div>
  )
}

export default App
