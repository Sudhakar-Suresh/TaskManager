import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  const [activePage, setActivePage] = useState('My day')
  const [userLists, setUserLists] = useState([])
  const [taskCounts, setTaskCounts] = useState({
    myDay: 0,
    next7Days: 0
  })

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
    // Handle sidebar expansion state if needed
    console.log('Sidebar expanded:', isExpanded)
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
      <div className="main-content">
        <h1>{activePage}</h1>
        {/* Add your main content here */}
      </div>
    </div>
  )
}

export default App
