import React, { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus, viewMode = 'tiles' }) => {

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e53e3e';
      case 'medium':
        return '#ed8936';
      case 'low':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#38a169';
      case 'in-progress':
        return '#3182ce';
      case 'pending':
        return '#718096';
      default:
        return '#718096';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const handleStatusChange = (newStatus) => {
    onToggleStatus(task._id, newStatus);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete();
    }
  };

  return (
    <div className={`task-item ${task.status} view-${viewMode}`}>
      <div className="task-header">
        <div className="task-status-indicator">
          <div 
            className={`status-dot ${task.status}`}
            style={{ backgroundColor: getStatusColor(task.status) }}
          ></div>
        </div>
        
        <div className="task-priority">
          <div 
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={`${task.priority} priority`}
          ></div>
        </div>
        
        <div className="task-actions">
          {task.status !== 'completed' && (
            <>
              {task.status === 'pending' && (
                <button 
                  className="action-btn start-btn"
                  onClick={() => handleStatusChange('in-progress')}
                  title="Start Task"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                </button>
              )}
              {task.status === 'in-progress' && (
                <button 
                  className="action-btn continue-btn"
                  onClick={() => handleStatusChange('completed')}
                  title="Mark Complete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </>
          )}
          
          {task.status === 'completed' && (
            <button 
              className="action-btn reopen-btn"
              onClick={() => handleStatusChange('pending')}
              title="Reopen Task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          )}
          
          <button 
            className="action-btn edit-btn"
            onClick={onEdit}
            title="Edit Task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Delete Task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <div className={`task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {formatDate(task.dueDate)}
            </div>
          )}
          
          <div className="task-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {formatTime(task.estimatedTime)}
            {task.actualTime > 0 && (
              <span className="actual-time">/ {formatTime(task.actualTime)}</span>
            )}
          </div>
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="task-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="task-footer">
        <div className="task-status-text">
          <span className={`status-badge ${task.status}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        
        <div className="task-created">
          Created {formatDate(task.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;