import React from 'react';
import './MainContent.css';
import MyDay from '../MyDay/MyDay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faBell, faSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

const MainContent = ({ activePage, taskCounts, onAddTask }) => {
  const renderContent = () => {
    switch (activePage) {
      case 'My day':
        return <MyDay onAddTask={onAddTask} />;
      case 'Next 7 days':
        return <div className="placeholder-content">Next 7 days content</div>;
      case 'All my tasks':
        return <div className="placeholder-content">All my tasks content</div>;
      case 'My Calendar':
        return <div className="placeholder-content">My Calendar content</div>;
      case 'Completed tasks':
        return <div className="placeholder-content">Completed tasks content</div>;
      default:
        if (activePage) {
          return (
            <div className="placeholder-content">
              <h2>{activePage}</h2>
              <p>List content will go here</p>
            </div>
          );
        }
        return <div className="placeholder-content">Select a page from the sidebar</div>;
    }
  };

  return (
    <div className="main-content-wrapper">
      {renderContent()}
    </div>
  );
};

export default MainContent; 