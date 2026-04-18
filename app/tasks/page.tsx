'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getTasks, saveTasks, addTask, updateTask, deleteTask, generateId } from '@/lib/storage';
import { Task, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_COLORS, STATUS_COLORS } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | Task['status']>('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTasks(getTasks());
  }, []);

  const refresh = () => setTasks(getTasks());

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleToggleStatus = (id: string, current: Task['status']) => {
    const next = current === 'done' ? 'active' : 'done';
    updateTask(id, {
      status: next,
      completedAt: next === 'done' ? new Date().toISOString() : undefined,
    });
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    refresh();
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    addTask({
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    });
    setShowNewTask(false);
    refresh();
  };

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tasks</h1>
          <p className={styles.subtitle}>{tasks.length} total • {tasks.filter(t => t.status === 'done').length} completed</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowNewTask(!showNewTask)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          New Task
        </button>
      </header>

      <div className={styles.filters}>
        {(['all', 'active', 'pending', 'done'] as const).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={styles.filterCount}>
              {f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {showNewTask && <NewTaskForm onSubmit={handleAddTask} onCancel={() => setShowNewTask(false)} />}

      <div className={styles.tableHeader}>
        <span style={{ flex: 0.5 }}></span>
        <span style={{ flex: 3 }}>Task</span>
        <span style={{ flex: 1 }}>Category</span>
        <span style={{ flex: 1 }}>Priority</span>
        <span style={{ flex: 1 }}>Status</span>
        <span style={{ flex: 0.5 }}></span>
      </div>

      <div className={styles.taskList}>
        {filtered.map(task => (
          <div key={task.id} className={`${styles.taskRow} ${task.status === 'done' ? styles.taskDone : ''}`}>
            <span style={{ flex: 0.5 }}>
              <button
                className={`${styles.checkbox} ${task.status === 'done' ? styles.checked : ''}`}
                onClick={() => handleToggleStatus(task.id, task.status)}
              >
                {task.status === 'done' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </span>
            <span style={{ flex: 3 }} className={styles.taskName}>
              <span>{task.title}</span>
              {task.description && <span className={styles.taskDesc}>{task.description}</span>}
            </span>
            <span style={{ flex: 1 }}>
              <span className={styles.badge} style={{ backgroundColor: `${CATEGORY_COLORS[task.category]}15`, color: CATEGORY_COLORS[task.category] }}>
                {CATEGORY_LABELS[task.category]}
              </span>
            </span>
            <span style={{ flex: 1 }}>
              <span className={styles.priority} style={{ color: PRIORITY_COLORS[task.priority] }}>
                {task.priority}
              </span>
            </span>
            <span style={{ flex: 1 }}>
              <span className={styles.status} style={{ color: STATUS_COLORS[task.status] }}>
                <span className={styles.statusDot} style={{ backgroundColor: STATUS_COLORS[task.status] }} />
                {task.status}
              </span>
            </span>
            <span style={{ flex: 0.5, textAlign: 'right' }}>
              <button className={styles.deleteBtn} onClick={() => handleDelete(task.id)} title="Delete task">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="#6E6E82" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>No tasks found. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}

function NewTaskForm({ onSubmit, onCancel }: { onSubmit: (t: Omit<Task, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('coding');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  return (
    <div className={styles.newTaskForm}>
      <input className={styles.input} placeholder="Task title..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
      <input className={styles.input} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
      <div className={styles.formRow}>
        <select className={styles.select} value={category} onChange={e => setCategory(e.target.value as Task['category'])}>
          <option value="exam-prep">Exam Prep</option>
          <option value="coding">Coding</option>
          <option value="fitness">Fitness</option>
          <option value="personal">Personal</option>
        </select>
        <select className={styles.select} value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className={styles.submitBtn} onClick={() => title.trim() && onSubmit({ title, description, category, priority, status: 'active', estimatedMinutes: 60 })} disabled={!title.trim()}>Add</button>
        <button className={styles.cancelFormBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
