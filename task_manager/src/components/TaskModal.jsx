import React, { useState } from 'react';
import FormInput from './FormInput';

function TaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3);
  const [dueDays, setDueDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handlePriorityChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setPriority("");
      return;
    }
    const num = parseInt(val, 10);
    if (num > 5) {
      setPriority(5); 
    } else if (num < 1) {
      setPriority(1); 
    } else {
      setPriority(num);
    }
  };

  const handleSubmitLocal = (e) => {
    e.preventDefault();
    const finalPriority = priority === "" ? 0 : parseInt(priority, 10);
    onSubmit({ 
      title, 
      description, 
      priority: finalPriority, 
      due: parseInt(dueDays, 10), 
      start_date: startDate 
    });
    setTitle("");
    setDescription("");
    setPriority(3);
    setDueDays(3);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '400px', border: '1px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Create New Task</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>X</button>
        </div>
        <form onSubmit={handleSubmitLocal}>
          <FormInput 
            label="Task Title" 
            type="text" 
            placeholder="e.g., Deploy new API" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <div className="input-div" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} 
              placeholder="Describe requirements..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <FormInput 
              label="Priority (1-5)" 
              type="number" 
              min="1" 
              max="5" 
              value={priority} 
              onChange={handlePriorityChange} 
            />
            <FormInput 
              label="Days to Complete" 
              type="number" 
              min="1" 
              value={dueDays} 
              onChange={(e) => setDueDays(e.target.value)} 
            />
          </div>
          <FormInput 
            label="Start Date" 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          <button type="submit" className="add-task-btn" style={{ width: '100%', marginTop: '10px' }}>
            Save Task Blueprint
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
