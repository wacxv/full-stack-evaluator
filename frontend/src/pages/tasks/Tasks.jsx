import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem('userId'));
  const email = localStorage.getItem('email');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await api.post('/tasks', {
        title: newTask,
        isDone: false,
        userId: userId
      });
      setNewTask('');
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const toggleTask = async (id, isDone) => {
    try {
      const task = tasks.find(t => t.id === id);
      await api.put(`/tasks/${id}`, {
        title: task.title,
        isDone: !isDone
      });
      loadTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const task = tasks.find(t => t.id === id);
      await api.put(`/tasks/${id}`, {
        title: editTitle,
        isDone: task.isDone
      });
      setEditingId(null);
      loadTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>📝 Task Manager</h1>
        <div className="user-info">
          <span>{email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="tasks-grid">
        <div className="tasks-card">
          <form onSubmit={createTask} className="create-task-form">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="btn-primary">Add Task</button>
          </form>

          <button onClick={loadTasks} disabled={loading} className="btn-refresh">
            {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>

          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError('')}>✕</button>
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <p className="no-tasks">No tasks yet. Create one to get started!</p>
          )}

          <ul className="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.isDone ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => toggleTask(task.id, task.isDone)}
                  className="task-checkbox"
                />
                
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="task-edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="task-title">{task.title}</span>
                )}

                <div className="task-actions">
                  {editingId === task.id ? (
                    <>
                      <button onClick={() => saveEdit(task.id)} className="btn-save">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(task.id, task.title)} className="btn-edit">Edit</button>
                      <button onClick={() => deleteTask(task.id)} className="btn-delete">Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}