import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange, taskCounts }) => {
  const menuItems = [
    {
      id: 'today',
      label: 'Today',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      count: taskCounts.today
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      count: taskCounts.upcoming
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V11H13V7H7V19H17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      count: taskCounts.all
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: taskCounts.completed
    }
  ];

  const insightItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
          <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2"/>
          <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Tasks</h3>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.count > 0 && (
                    <span className="nav-count">{item.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Insights</h3>
          <ul className="nav-list">
            {insightItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="productivity-tip">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <h4>Productivity Tip</h4>
            <p>Break large tasks into smaller, manageable chunks for better focus and completion rates.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;