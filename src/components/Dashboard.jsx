import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import Analytics from './Analytics';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('today');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks with filters:', filters);
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      console.log('Making API call to:', `/tasks?${params}`);
      const response = await axios.get(`tasks?${params}`);
      console.log('Tasks received:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await axios.post('tasks', taskData);
      setTasks([response.data, ...tasks]);
      setShowTaskForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, taskData);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setEditingTask(null);
      setShowTaskForm(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const toggleTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      toast.success(`Task marked as ${newStatus}!`);
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];
    
    switch (activeView) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate < tomorrow;
        });
        break;
      
      case 'upcoming':
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > new Date() && dueDate <= nextWeek;
        });
        break;
      
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.status === 'completed');
        break;
      
      case 'all':
      default:
        break;
    }
    
    return filteredTasks;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="dashboard">
      <Header 
        user={user}
        onAddTask={() => setShowTaskForm(true)}
      />
      
      <div className="dashboard-body">
        <Sidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          taskCounts={{
            today: tasks.filter(task => {
              if (!task.dueDate) return false;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const dueDate = new Date(task.dueDate);
              return dueDate >= today && dueDate < tomorrow;
            }).length,
            upcoming: tasks.filter(task => {
              if (!task.dueDate) return false;
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              const dueDate = new Date(task.dueDate);
              return dueDate > new Date() && dueDate <= nextWeek;
            }).length,
            completed: tasks.filter(task => task.status === 'completed').length,
            all: tasks.length
          }}
        />
        
        <main className="main-content">
          {activeView === 'analytics' ? (
            <Analytics tasks={tasks} />
          ) : (
            <TaskList
              tasks={getFilteredTasks()}
              loading={loading}
              activeView={activeView}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onToggleStatus={toggleTaskStatus}
              filters={filters}
              onFiltersChange={setFilters}
            />
          )}
        </main>
      </div>
      
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? 
            (data) => updateTask(editingTask._id, data) : 
            createTask
          }
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Dashboard;