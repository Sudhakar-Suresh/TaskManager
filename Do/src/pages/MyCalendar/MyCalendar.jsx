import React from 'react';
import './MyCalendar.css';

const MyCalendar = () => {
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>My Calendar<span className="dot">.</span></h1>
        <p className="subtitle">Connect your calendar to manage events hiii</p>
      </div>
      <div className="calendar-content">
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default MyCalendar; 