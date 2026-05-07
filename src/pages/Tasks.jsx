import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, FileText, CheckCircle2, Circle, MoreVertical, LayoutGrid, List, Trash2, Edit3, X } from 'lucide-react';
import useTasks from '../hooks/useTasks';
import './Tasks.css';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const titleRef = useRef(null);

  const { tasks, addTask, toggleTask, removeTask, updateTask } = useTasks();

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'tasks') return !t.done;
    if (activeTab === 'done') return t.done;
    return true;
  }).filter(t => (t.title || '').toLowerCase().includes(search.toLowerCase()));

  const activeItemData = tasks.find(t => t.id === activeItem);

  useEffect(() => {
    if (activeItemData?.id === activeItem) {
      setNewTitle(activeItemData.title || '');
      setNewDesc(activeItemData.description || '');
    }
  }, [activeItem]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setActiveItem(null);
  };

  const handleUpdate = (e) => {
    if (e) e.preventDefault();
    if (!editingId || !newTitle.trim()) return;
    updateTask(editingId, { title: newTitle.trim(), description: newDesc.trim() });
    setEditingId(null);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setNewTitle(task.title);
    setNewDesc(task.description || '');
    setActiveItem(task.id);
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    if (activeItemData) {
      setNewTitle(activeItemData.title);
      setNewDesc(activeItemData.description || '');
    } else {
      setNewTitle('');
      setNewDesc('');
    }
  };

  return (
    <div className="dashboard-container fade-in" style={{ height: 'calc(100vh - 4rem)' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">TASK MATRIX</h1>
          <p className="text-muted">{tasks.filter(t=>!t.done).length} active • {tasks.filter(t=>t.done).length} completed</p>
        </div>
      </header>

      <div className="tasks-layout card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
        <div className="tasks-sidebar">
          <div className="tasks-sidebar-header">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 className="retro-text">DIRECTORY</h3>
              <div className="action-buttons">
                <button className="icon-btn" onClick={() => { setEditingId(null); setActiveItem(null); setNewTitle(''); setNewDesc(''); }} title="Add task">
                  <Plus size={18} />
                </button>
                <button className="icon-btn"><Search size={18} /></button>
              </div>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <input type="text" placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{width:'100%',padding:'0.5rem',background:'var(--bg-surface)',border:'1px solid var(--border-color)',borderRadius:'4px',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:'0.875rem'}} />
            </div>

            <div className="task-tabs">
              <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>TASKS</button>
              <button className={`tab-btn ${activeTab === 'done' ? 'active' : ''}`} onClick={() => setActiveTab('done')}>DONE</button>
              <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>ALL</button>
            </div>
          </div>

          <div className="tasks-list">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <div key={task.id} className={`list-item ${activeItem === task.id ? 'active' : ''} ${task.done ? 'done' : ''}`}
                onClick={() => setActiveItem(task.id)}>
                <div onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}>
                  {task.done ? <CheckCircle2 size={16} className="text-muted" /> : <Circle size={16} className="text-accent" />}
                </div>
                <div className="item-content">
                  <span className="item-title">{task.title || 'Untitled'}</span>
                  <span className="item-meta text-muted">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date'} {task.description && '• has notes'}
                  </span>
                </div>
                <div className="action-buttons" style={{marginLeft:'auto',opacity:0.5}} onClick={e=>e.stopPropagation()}>
                  <button className="icon-btn" onClick={() => startEdit(task)}><Edit3 size={14} /></button>
                  <button className="icon-btn" onClick={() => removeTask(task.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            )) : (
              <div className="empty-state" style={{padding:'2rem'}}>
                <FileText size={32} className="text-muted" style={{marginBottom:'1rem'}} />
                <p className="text-muted" style={{fontSize:'0.875rem'}}>No tasks found</p>
              </div>
            )}
          </div>

          <div className="tasks-sidebar-footer text-muted flex-between">
            <span>{filteredTasks.length} ITEMS</span>
            <div className="action-buttons">
              <button className="icon-btn active"><List size={16} /></button>
            </div>
          </div>
        </div>

        <div className="tasks-editor">
          {activeItemData ? (
            <div className="editor-active">
              <div className="editor-top">
                <div className="editor-breadcrumbs text-muted">
                  DIRECTORY / {activeItemData.done ? 'COMPLETED' : 'ACTIVE'} / <span className="text-accent">{(activeItemData.title || 'Untitled').toUpperCase()}</span>
                </div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {!editingId && <button className="icon-btn" onClick={() => startEdit(activeItemData)} title="Edit"><Edit3 size={16} /></button>}
                  <button className="icon-btn" onClick={() => setActiveItem(null)}><X size={18} /></button>
                </div>
              </div>

              <form onSubmit={editingId ? handleUpdate : handleAdd} className="editor-canvas">
                {editingId ? (
                  <>
                    <input ref={titleRef} type="text" className="editor-title retro-text" value={newTitle}
                      onChange={e => setNewTitle(e.target.value)} placeholder="Task title..." />
                    <textarea className="editor-body" value={newDesc}
                      onChange={e => setNewDesc(e.target.value)} placeholder="Add description or notes..." />
                  </>
                ) : (
                  <>
                    <h2 className="editor-title retro-text">{activeItemData.title || 'Untitled'}</h2>
                    {activeItemData.description && <div className="editor-body" style={{whiteSpace:'pre-wrap',overflowY:'auto'}}>{activeItemData.description}</div>}
                  </>
                )}
                <div className="editor-meta" style={{fontSize:'0.75rem',color:'var(--text-secondary)',marginTop:'auto'}}>
                  Created: {activeItemData.createdAt ? new Date(activeItemData.createdAt).toLocaleString() : 'Unknown'}
                  {activeItemData.done && ' • Completed'}
                  {activeItemData.description && ` • ${activeItemData.description.split(' ').length} words`}
                </div>
              </form>

              <div className="editor-bottom flex-between">
                <span className="text-muted retro-text" style={{ fontSize: '0.875rem' }}>
                  CHAR: {(newTitle + newDesc).length} | WORDS: {((newTitle + ' ' + newDesc).trim().split(/\s+/).filter(Boolean).length)}
                </span>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {editingId && <button className="btn-retro" type="button" onClick={cancelEdit} style={{padding:'0.5rem 1rem',fontSize:'0.875rem'}}>CANCEL</button>}
                  {!editingId && <button className="btn-retro" type="button" onClick={() => startEdit(activeItemData)} style={{padding:'0.5rem 1rem',fontSize:'0.875rem'}}>EDIT</button>}
                  {editingId && <button className="btn-retro" type="button" onClick={handleUpdate} style={{padding:'0.5rem 1rem',fontSize:'0.875rem'}}>SAVE CHANGES</button>}
                </div>
              </div>
            </div>
          ) : (
            <div className="editor-empty">
              <div style={{textAlign:'center'}}>
                <Plus size={48} className="text-muted" style={{marginBottom:'1rem'}} />
                <p className="retro-text text-muted" style={{fontSize:'1.5rem',letterSpacing:'2px'}}>SELECT OR CREATE TASK</p>
                <form onSubmit={handleAdd} style={{marginTop:'1.5rem',display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                  <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)}
                    placeholder="New task title..." style={{padding:'0.5rem 1rem',background:'var(--bg-surface)',border:'1px solid var(--border-color)',borderRadius:'4px',color:'var(--text-primary)',fontFamily:'var(--font-mono)',width:'250px'}} />
                  <button className="btn-retro" type="submit">ADD</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
