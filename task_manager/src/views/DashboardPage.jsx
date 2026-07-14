import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import TaskModal from '../components/TaskModal';

function DashboardPage({ apiBaseUrl, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    fetchTasks();
    decodeTokenUser();
  }, []);

  const decodeTokenUser = () => {
    try {
      if (!token || token.split('.').length < 2) return;
      const base64Url = token.split('.')[1];
      const payload = JSON.parse(window.atob(base64Url));
      if (payload?.sub) setUsername(payload.sub);
    } catch (e) { 
      console.error("Token decoding failed:", e); 
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/task`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch(`${apiBaseUrl}/task`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        await fetchTasks();
      }
    } catch (err) { console.error(err); }
  };


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${apiBaseUrl}/task/${taskId}?status=${newStatus}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (err) { console.error(err); }
  };


  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`${apiBaseUrl}/task/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-container">
  
      <header className="navbar">
        <div className="app-title">Mytask (Welcome, {username}!)</div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      
      <main className="task-section">
        <div className="action-row">
          <div className="filter-buttons">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
            <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
          <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>+ Add New Task</button>
        </div>

        
        <div className="tasks-list">
          {tasks
            .filter(t => {
              if (filter === 'all') return true;
              const normalizedStatus = t.status?.toLowerCase() || "";
              if (filter === 'pending') return normalizedStatus !== 'completed';
              return normalizedStatus === 'completed';
            })
            .map(task => (
              <div className="task-box" key={task.task_id}>
                <div className="task-details">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <small>Priority: {task.priority} | Due Date: {task.due_date}</small>
                </div>
                
                <div className="task-actions">
    
                  <select 
                    className="status-dropdown" 
                    value={task.status || "just started"} 
                    onChange={(e) => handleStatusChange(task.task_id, e.target.value)}
                  >
                    <option value="just started">Just Started</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

              
                  <button className="delete-btn" onClick={() => handleDeleteTask(task.task_id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {tasks.length === 0 && (
            <p className="no-tasks-text">No tasks found. Click "+ Add New Task" to create one!</p>
          )}
        </div>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTask} />
    </div>
  );
}

export default DashboardPage;
