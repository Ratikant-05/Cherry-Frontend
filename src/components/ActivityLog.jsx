import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ActivityLog.css';

const ActivityLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityLog, setActivityLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingHour, setEditingHour] = useState(null);
  const [activityForm, setActivityForm] = useState({
    activity: '',
    category: 'other',
    mood: 'neutral',
    productivity: 3,
    notes: ''
  });

  const categories = [
    { value: 'work', label: 'Work', color: '#3b82f6' },
    { value: 'personal', label: 'Personal', color: '#10b981' },
    { value: 'health', label: 'Health', color: '#f59e0b' },
    { value: 'education', label: 'Education', color: '#8b5cf6' },
    { value: 'entertainment', label: 'Entertainment', color: '#ef4444' },
    { value: 'social', label: 'Social', color: '#ec4899' },
    { value: 'other', label: 'Other', color: '#6b7280' }
  ];

  const moods = [
    { value: 'excellent', label: '😄 Excellent', color: '#22c55e' },
    { value: 'good', label: '😊 Good', color: '#84cc16' },
    { value: 'neutral', label: '😐 Neutral', color: '#6b7280' },
    { value: 'poor', label: '😔 Poor', color: '#f59e0b' },
    { value: 'terrible', label: '😢 Terrible', color: '#ef4444' }
  ];

  useEffect(() => {
    fetchActivityLog();
  }, [selectedDate]);

  const fetchActivityLog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`activity-log/date/${selectedDate}`);
      setActivityLog(response.data);
    } catch (error) {
      console.error('Failed to fetch activity log:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const getActivityForHour = (hour) => {
    if (!activityLog || !activityLog.activities) return null;
    return activityLog.activities.find(activity => activity.hour === hour);
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : '#6b7280';
  };

  const getMoodEmoji = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.label.split(' ')[0] : '😐';
  };

  const handleHourClick = (hour) => {
    const existingActivity = getActivityForHour(hour);
    if (existingActivity) {
      setActivityForm({
        activity: existingActivity.activity,
        category: existingActivity.category,
        mood: existingActivity.mood,
        productivity: existingActivity.productivity,
        notes: existingActivity.notes || ''
      });
    } else {
      setActivityForm({
        activity: '',
        category: 'other',
        mood: 'neutral',
        productivity: 3,
        notes: ''
      });
    }
    setEditingHour(hour);
  };

  const handleSaveActivity = async () => {
    if (!activityForm.activity.trim()) {
      toast.error('Please enter an activity description');
      return;
    }

    try {
      const response = await axios.post('activity-log/activity', {
        date: selectedDate,
        hour: editingHour,
        ...activityForm
      });
      
      setActivityLog(response.data);
      setEditingHour(null);
      setActivityForm({
        activity: '',
        category: 'other',
        mood: 'neutral',
        productivity: 3,
        notes: ''
      });
      toast.success('Activity saved successfully!');
    } catch (error) {
      console.error('Failed to save activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleDeleteActivity = async () => {
    try {
      const response = await axios.delete('activity-log/activity', {
        data: {
          date: selectedDate,
          hour: editingHour
        }
      });
      
      setActivityLog(response.data);
      setEditingHour(null);
      toast.success('Activity deleted successfully!');
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setEditingHour(null);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  if (loading) {
    return (
      <div className="activity-log-loading">
        <div className="loading-spinner"></div>
        <p>Loading activity log...</p>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <h2>Activity Log</h2>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
          {isToday && <span className="today-badge">Today</span>}
        </div>
      </div>

      <div className="activity-grid">
        {Array.from({ length: 24 }, (_, hour) => {
          const activity = getActivityForHour(hour);
          const isCurrentHour = isToday && hour === currentHour;
          
          return (
            <div
              key={hour}
              className={`hour-slot ${activity ? 'has-activity' : ''} ${isCurrentHour ? 'current-hour' : ''}`}
              onClick={() => handleHourClick(hour)}
            >
              <div className="hour-label">
                {formatHour(hour)}
                {isCurrentHour && <span className="current-indicator">●</span>}
              </div>
              
              {activity ? (
                <div className="activity-content">
                  <div 
                    className="activity-category"
                    style={{ backgroundColor: getCategoryColor(activity.category) }}
                  >
                    {categories.find(c => c.value === activity.category)?.label}
                  </div>
                  <div className="activity-text">{activity.activity}</div>
                  <div className="activity-meta">
                    <span className="mood">{getMoodEmoji(activity.mood)}</span>
                    <span className="productivity">
                      {'★'.repeat(activity.productivity)}{'☆'.repeat(5 - activity.productivity)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-slot">
                  <span className="add-activity">+ Add Activity</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingHour !== null && (
        <div className="activity-modal-overlay">
          <div className="activity-modal">
            <div className="modal-header">
              <h3>Activity for {formatHour(editingHour)}</h3>
              <button 
                className="close-button"
                onClick={() => setEditingHour(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Activity Description *</label>
                <input
                  type="text"
                  value={activityForm.activity}
                  onChange={(e) => setActivityForm({ ...activityForm, activity: e.target.value })}
                  placeholder="What did you do during this hour?"
                  maxLength={200}
                  className="activity-input"
                />
                <small>{activityForm.activity.length}/200 characters</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={activityForm.category}
                    onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                    className="category-select"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mood</label>
                  <select
                    value={activityForm.mood}
                    onChange={(e) => setActivityForm({ ...activityForm, mood: e.target.value })}
                    className="mood-select"
                  >
                    {moods.map(mood => (
                      <option key={mood.value} value={mood.value}>
                        {mood.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Productivity Level: {activityForm.productivity}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={activityForm.productivity}
                  onChange={(e) => setActivityForm({ ...activityForm, productivity: parseInt(e.target.value) })}
                  className="productivity-slider"
                />
                <div className="productivity-labels">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={activityForm.notes}
                  onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                  placeholder="Additional notes about this activity..."
                  maxLength={500}
                  rows={3}
                  className="notes-textarea"
                />
                <small>{activityForm.notes.length}/500 characters</small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setEditingHour(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              {getActivityForHour(editingHour) && (
                <button
                  onClick={handleDeleteActivity}
                  className="delete-button"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSaveActivity}
                className="save-button"
                disabled={!activityForm.activity.trim()}
              >
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
