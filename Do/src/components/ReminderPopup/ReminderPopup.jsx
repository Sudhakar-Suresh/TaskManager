import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ReminderPopup.css';

const ReminderPopup = ({ isOpen, onClose, onSave, initialDate, isRecurring: initialIsRecurring }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const popupRef = useRef(null);
  const timePickerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      let dateToUse;
      if (initialDate) {
        dateToUse = new Date(initialDate);
        if (isNaN(dateToUse.getTime())) {
          dateToUse = new Date();
          dateToUse.setMinutes(Math.ceil(dateToUse.getMinutes() / 30) * 30);
        }
      } else {
        dateToUse = new Date();
        dateToUse.setMinutes(Math.ceil(dateToUse.getMinutes() / 30) * 30);
      }
      
      dateToUse.setSeconds(0);
      dateToUse.setMilliseconds(0);
      
      setSelectedDate(dateToUse);
      setSelectedTime(formatTime(dateToUse));
      setCurrentMonth(new Date(dateToUse.getFullYear(), dateToUse.getMonth(), 1));
      setIsRecurring(initialIsRecurring || false);
    }
  }, [isOpen, initialDate, initialIsRecurring]);

  // Add click outside handler for popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Add click outside handler for time picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePickerRef.current && 
          !timePickerRef.current.contains(event.target) && 
          !event.target.classList.contains('time-input')) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimePicker]);

  // Generate time options only once
  const timeOptions = useMemo(() => generateTimeOptions(), []);

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
    
    // Format as M.DD.YYYY (e.g., 6.11.2025)
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}.${day}.${year}`;
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
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate how many days from the previous month to show
    // If first day is Sunday (0), we need to show 6 days from prev month
    // If first day is Monday (1), we need to show 0 days, etc.
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Previous month days
    const prevMonth = new Date(currentMonth);
    prevMonth.setDate(0); // Last day of previous month
    
    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push(
        <span key={`prev-${i}`} className="day prev-month">
          {prevMonth.getDate() - i + 1}
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
    
    // Next month days to fill the remaining grid
    const totalDaysShown = 42; // 6 rows of 7 days
    const nextMonthDays = totalDaysShown - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(
        <span key={`next-${i}`} className="day next-month">
          {i}
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="reminder-overlay" onClick={handleOverlayClick}>
      <div className="reminder-popup" ref={popupRef} onClick={e => e.stopPropagation()}>
        <div className="reminder-header">
          <h2>Reminder</h2>
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
                <div className="time-picker" ref={timePickerRef}>
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

          <div className="month-display">
            <h3>{`${monthName} ${year}`}</h3>
            <div className="month-nav">
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

          <div className="calendar-quick-container">
            <div className="calendars-grid">
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
              <button 
                className="quick-option-btn"
                onClick={() => handleQuickSelect('tomorrow')}
              >
                Tomorrow
              </button>
              <button 
                className="quick-option-btn"
                onClick={() => handleQuickSelect('nextWeek')}
              >
                Next week
              </button>
              <button 
                className="quick-option-btn"
                onClick={() => handleQuickSelect('someday')}
              >
                Someday
              </button>
            </div>
            
            <div className="recurring-container">
              <label className="recurring-option">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(!isRecurring)}
                />
                <span>Recurring</span>
              </label>
            </div>
          </div>
        </div>

        <div className="reminder-footer">
          <button className="delete-btn" onClick={onClose}>Delete</button>
          <button className="set-btn" onClick={handleSave}>Set</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup; 