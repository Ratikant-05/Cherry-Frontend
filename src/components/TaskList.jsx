import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ 
  tasks, 
  loading, 
  activeView, 
  onEditTask, 
  onDeleteTask, 
  onToggleStatus,
  filters,
  onFiltersChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize viewMode from localStorage or default to 'tiles'
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem('cherry-task-view-mode');
    return savedViewMode && ['tiles', 'details', 'list', 'compact'].includes(savedViewMode) 
      ? savedViewMode 
      : 'tiles';
  });

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cherry-task-view-mode', viewMode);
  }, [viewMode]);

  const getViewTitle = () => {
    switch (activeView) {
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'all':
      default:
        return 'All Tasks';
    }
  };

  const getViewDescription = () => {
    switch (activeView) {
      case 'today':
        return 'Tasks due today';
      case 'upcoming':
        return 'Tasks due in the next 7 days';
      case 'completed':
        return 'Your completed tasks';
      case 'all':
      default:
        return 'All your tasks in one place';
    }
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      priority: '',
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.sortBy !== 'createdAt' || filters.order !== 'desc';

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="header-content">
          <h2 className="view-title">{getViewTitle()}</h2>
          <p className="view-description">{getViewDescription()}</p>
        </div>
        
        <div className="header-actions">
          <div className="view-switcher">
            <button 
              className={`view-btn ${viewMode === 'tiles' ? 'active' : ''}`}
              onClick={() => setViewMode('tiles')}
              title="Tiles View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'details' ? 'active' : ''}`}
              onClick={() => setViewMode('details')}
              title="Details View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="10" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="16" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filters
            {hasActiveFilters && <span className="filter-indicator"></span>}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Priority</label>
              <select 
                value={filters.priority} 
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Order</label>
              <select 
                value={filters.order} 
                onChange={(e) => handleFilterChange('order', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="task-list-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeView === 'completed' ? (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V11H13V7H7V19H17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <h3>
              {activeView === 'completed' 
                ? 'No completed tasks yet' 
                : `No tasks ${activeView === 'today' ? 'for today' : activeView === 'upcoming' ? 'upcoming' : 'found'}`
              }
            </h3>
            <p>
              {activeView === 'completed' 
                ? 'Complete some tasks to see them here.' 
                : activeView === 'today'
                ? 'Great! You have no tasks due today. Enjoy your free time!'
                : activeView === 'upcoming'
                ? 'No upcoming tasks in the next 7 days.'
                : 'Create your first task to get started.'
              }
            </p>
          </div>
        ) : (
          <div className={`tasks-grid view-${viewMode}`}>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task._id)}
                onToggleStatus={onToggleStatus}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;