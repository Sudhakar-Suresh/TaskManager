import React, { useState, useEffect } from 'react';
import './ReminderPopup.css';

const ReminderPopup = ({ isOpen, onClose, onSave, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let dateToUse;
      if (initialDate) {
        dateToUse = new Date(initialDate);
      } else {
        dateToUse = new Date();
        dateToUse.setMinutes(Math.ceil(dateToUse.getMinutes() / 30) * 30);
        dateToUse.setSeconds(0);
        dateToUse.setMilliseconds(0);
      }
      
      setSelectedDate(dateToUse);
      setSelectedTime(formatTime(dateToUse));
      setCurrentMonth(new Date(dateToUse.getFullYear(), dateToUse.getMonth(), 1));
      setIsRecurring(false);
    }
  }, [isOpen, initialDate]);

  const timeOptions = generateTimeOptions();

  function generateTimeOptions() {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const date = new Date();
        date.setHours(i, j, 0, 0);
        options.push(formatTime(date));
      }
    }
    return options;
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDateForInput(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);

    // Update the full date with the new time
    if (selectedDate) {
      const [hours, minutes] = parseTime(time);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
    }
  };

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return [hours, minutes];
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setFullYear(currentMonth.getFullYear());
    newDate.setMonth(currentMonth.getMonth());
    newDate.setDate(day);
    
    // Preserve the current time
    if (selectedTime) {
      const [hours, minutes] = parseTime(selectedTime);
      newDate.setHours(hours, minutes, 0, 0);
    }
    
    setSelectedDate(newDate);
  };

  const handleQuickSelect = (option) => {
    const now = new Date();
    let newDate = new Date(now);

    switch(option) {
      case 'tomorrow':
        newDate.setDate(now.getDate() + 1);
        break;
      case 'nextWeek':
        newDate.setDate(now.getDate() + 7);
        break;
      case 'someday':
        newDate.setDate(now.getDate() + 14);
        break;
      default:
        return;
    }

    // Preserve the current time or set to next 30-minute interval
    if (selectedTime) {
      const [hours, minutes] = parseTime(selectedTime);
      newDate.setHours(hours, minutes, 0, 0);
    } else {
      newDate.setMinutes(Math.ceil(newDate.getMinutes() / 30) * 30);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      setSelectedTime(formatTime(newDate));
    }

    setSelectedDate(newDate);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const handleSave = () => {
    if (!selectedDate) return;
    
    onSave({
      date: selectedDate.toISOString(),
      isRecurring
    });
    onClose();
  };

  const generateCalendarDays = () => {
    if (!currentMonth) return [];

    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Previous month days
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    const prevMonthDays = firstDayOfWeek - 1;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(prevMonth);
      date.setDate(prevMonth.getDate() - i);
      days.push(
        <span key={`prev-${i}`} className="day prev-month">
          {date.getDate()}
        </span>
      );
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      const isToday = isCurrentDay(date);
      
      days.push(
        <span 
          key={`current-${day}`}
          className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </span>
      );
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(nextMonth);
      date.setDate(i);
      days.push(
        <span key={`next-${i}`} className="day next-month">
          {date.getDate()}
        </span>
      );
    }
    
    return days;
  };

  function isCurrentDay(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  if (!isOpen) return null;

  return (
    <div className="reminder-overlay">
      <div className="reminder-popup">
        <div className="reminder-header">
          <h2>Reminder</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="reminder-content">
          <div className="date-time-inputs">
            <div className="input-group">
              <label>DATE</label>
              <input 
                type="text" 
                value={selectedDate ? formatDateForInput(selectedDate) : ''}
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
                {currentMonth.toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <div className="calendar-nav">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="nav-button"
                >
                  &lt;
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="nav-button"
                >
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
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup; 