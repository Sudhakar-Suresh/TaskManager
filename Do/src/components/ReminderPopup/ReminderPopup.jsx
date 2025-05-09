import React, { useState } from 'react';
import './ReminderPopup.css';

const ReminderPopup = ({ isOpen, onClose, onSave, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || '5.8.2025');
  const [selectedTime, setSelectedTime] = useState('4:12 PM');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4)); // May 2025
  const [isRecurring, setIsRecurring] = useState(false);

  const timeOptions = [
    "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
  ];

  if (!isOpen) return null;

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).replace(/\//g, '.'));
  };

  const handleQuickSelect = (option) => {
    const today = new Date();
    let newDate;

    switch(option) {
      case 'tomorrow':
        newDate = new Date(today.setDate(today.getDate() + 1));
        break;
      case 'nextWeek':
        newDate = new Date(today.setDate(today.getDate() + 7));
        break;
      case 'someday':
        newDate = new Date(today.setDate(today.getDate() + 14));
        break;
      default:
        return;
    }

    setSelectedDate(newDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).replace(/\//g, '.'));
    setCurrentMonth(newDate);
  };

  const handleSave = () => {
    onSave({
      date: selectedDate,
      time: selectedTime,
      isRecurring
    });
    onClose();
  };

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Previous month days
    const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push(
        <span key={`prev-${i}`} className="day prev-month">
          {prevMonth.getDate() - i}
        </span>
      );
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${day}.${currentMonth.getMonth() + 1}.${currentMonth.getFullYear()}`;
      const isSelected = selectedDate === dateStr;
      days.push(
        <span 
          key={day} 
          className={`day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </span>
      );
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <span key={`next-${i}`} className="day next-month">
          {i}
        </span>
      );
    }
    
    return days;
  };

  return (
    <div className="reminder-overlay">
      <div className="reminder-popup">
        <div className="reminder-header">
          <h2>Reminder</h2>
        </div>

        <div className="reminder-content">
          <div className="date-time-inputs">
            <div className="input-group">
              <label>DATE</label>
              <input 
                type="text" 
                value={selectedDate}
                readOnly
                className="date-input"
              />
            </div>
            <div className="input-group">
              <label>TIME</label>
              <input 
                type="text" 
                value={selectedTime}
                readOnly
                className="time-input"
                onClick={() => setShowTimePicker(!showTimePicker)}
              />
              {showTimePicker && (
                <div className="time-picker">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="calendar-container">
            <div className="calendar-header">
              <h3>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="calendar-nav">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                  &lt;
                </button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                  &gt;
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              <div className="weekdays">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
              <div className="days">
                {generateCalendarDays()}
              </div>
            </div>

            <div className="quick-options">
              <button onClick={() => handleQuickSelect('tomorrow')}>Tomorrow</button>
              <button onClick={() => handleQuickSelect('nextWeek')}>Next week</button>
              <button onClick={() => handleQuickSelect('someday')}>Someday</button>
              <button 
                className={`recurring-btn ${isRecurring ? 'active' : ''}`}
                onClick={() => setIsRecurring(!isRecurring)}
              >
                <span>↻</span> Recurring
              </button>
            </div>
          </div>
        </div>

        <div className="reminder-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="set-btn" onClick={handleSave}>Set</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup; 