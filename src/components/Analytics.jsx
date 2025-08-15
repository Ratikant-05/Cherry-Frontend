import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = ({ tasks = [] }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAnalytics();
  }, [tasks]);

  const calculateAnalytics = () => {
    try {
      setLoading(true);
      
      // Calculate status statistics
      const statusStats = [
        { _id: 'pending', count: tasks.filter(task => task.status === 'pending').length },
        { _id: 'in-progress', count: tasks.filter(task => task.status === 'in-progress').length },
        { _id: 'completed', count: tasks.filter(task => task.status === 'completed').length }
      ];

      // Calculate priority statistics
      const priorityStats = [
        { _id: 'high', count: tasks.filter(task => task.priority === 'high').length },
        { _id: 'medium', count: tasks.filter(task => task.priority === 'medium').length },
        { _id: 'low', count: tasks.filter(task => task.priority === 'low').length }
      ];

      // Calculate completion rate
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate average estimated time
      const totalEstimatedTime = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      const avgEstimatedTime = totalTasks > 0 ? Math.round(totalEstimatedTime / totalTasks) : 0;

      // Calculate overdue tasks
      const now = new Date();
      const overdueTasks = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < now;
      }).length;

      // Calculate productivity trends (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const completedOnDate = tasks.filter(task => {
          if (task.status !== 'completed' || !task.updatedAt) return false;
          const taskDate = new Date(task.updatedAt).toISOString().split('T')[0];
          return taskDate === dateStr;
        }).length;

        last7Days.push({
          date: dateStr,
          completed: completedOnDate
        });
      }

      const analyticsData = {
        statusStats,
        priorityStats,
        totalTasks,
        completedTasks,
        completionRate,
        avgEstimatedTime,
        overdueTasks,
        productivityTrend: last7Days
      };

      console.log('Calculated analytics:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to calculate analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="error-state">
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          analytics?.statusStats?.find(s => s._id === 'pending')?.count || 0,
          analytics?.statusStats?.find(s => s._id === 'in-progress')?.count || 0,
          analytics?.statusStats?.find(s => s._id === 'completed')?.count || 0,
        ],
        backgroundColor: [
          '#FED7D7',
          '#BEE3F8',
          '#C6F6D5',
        ],
        borderColor: [
          '#E53E3E',
          '#3182CE',
          '#38A169',
        ],
        borderWidth: 2,
      },
    ],
  };

  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          analytics?.priorityStats?.find(p => p._id === 'low')?.count || 0,
          analytics?.priorityStats?.find(p => p._id === 'medium')?.count || 0,
          analytics?.priorityStats?.find(p => p._id === 'high')?.count || 0,
        ],
        backgroundColor: [
          '#38A169',
          '#ED8936',
          '#E53E3E',
        ],
        borderColor: [
          '#2F855A',
          '#DD6B20',
          '#C53030',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare daily completion data using the calculated productivity trend
  const dailyCompletionData = {
    labels: analytics?.productivityTrend?.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: analytics?.productivityTrend?.map(item => item.completed) || [],
        backgroundColor: 'rgba(56, 161, 105, 0.2)',
        borderColor: '#38A169',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667EEA',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '60%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
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

  const totalTasks = analytics?.totalTasks || 0;
  const completedTasks = analytics?.completedTasks || 0;
  const completionRate = analytics?.completionRate || 0;
  const avgEstimatedTime = analytics?.avgEstimatedTime || 0;
  const overdueTasks = analytics?.overdueTasks || 0;
  const inProgressTasks = analytics?.statusStats?.find(s => s._id === 'in-progress')?.count || 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Analytics & Insights</h2>
        <p>Track your productivity and task completion patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{formatTime(avgEstimatedTime)}</h3>
            <p>Avg. Estimated Time</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{overdueTasks}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Task Status Distribution</h3>
          <div className="chart-container">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <div className="chart-container">
            <Bar data={priorityData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Daily Task Completion (Last 7 Days)</h3>
          <div className="chart-container">
            <Line data={dailyCompletionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="time-analysis">
        <h3>Time Analysis</h3>
        <div className="time-stats">
          <div className="time-stat">
            <label>Average Estimated Time</label>
            <span>{formatTime(avgEstimatedTime)}</span>
          </div>
          <div className="time-stat">
            <label>Total Tasks</label>
            <span>{totalTasks}</span>
          </div>
          <div className="time-stat">
            <label>Completion Rate</label>
            <span>{completionRate}%</span>
          </div>
          <div className="time-stat">
            <label>Overdue Tasks</label>
            <span>{overdueTasks}</span>
          </div>
        </div>
      </div>

      {/* Productivity Tips */}
      <div className="productivity-tips">
        <h3>💡 Productivity Insights</h3>
        <div className="tips-grid">
          {completionRate >= 80 && (
            <div className="tip-card success">
              <h4>🎉 Great Job!</h4>
              <p>You have an excellent completion rate of {completionRate}%. Keep up the great work!</p>
            </div>
          )}
          
          {completionRate < 50 && (
            <div className="tip-card warning">
              <h4>📈 Room for Improvement</h4>
              <p>Your completion rate is {completionRate}%. Try breaking large tasks into smaller, manageable chunks.</p>
            </div>
          )}
          
          {overdueTasks > 0 && (
            <div className="tip-card info">
              <h4>⏰ Time Management</h4>
              <p>You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}. Consider reviewing your priorities and deadlines.</p>
            </div>
          )}
          
          {analytics?.priorityStats?.find(p => p._id === 'high')?.count > 0 && (
            <div className="tip-card info">
              <h4>🔥 High Priority Focus</h4>
              <p>You have high-priority tasks. Consider tackling these first for maximum impact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;