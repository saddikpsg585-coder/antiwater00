"use client";

import { useState } from 'react';
import styles from './schedule.module.css';
import { useAuth, ScheduleEvent } from '@/lib/AuthContext';

export default function ScheduleDashboard() {
  const { role, points, scheduleEvents, setScheduleEvents, alerts, setAlerts } = useAuth();
  const [success, setSuccess] = useState('');
  
  // Sample Submission State
  const [selectedEventId, setSelectedEventId] = useState('');
  const [ph, setPh] = useState('');
  const [cl, setCl] = useState('');

  // Editing State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  
  const pendingEvents = scheduleEvents.filter(e => e.status === 'pending');

  const handleSubmitSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    const event = scheduleEvents.find(e => e.id === selectedEventId);
    if (!event) return;

    // Mark schedule as completed
    setScheduleEvents(prev => prev.map(e => e.id === selectedEventId ? { ...e, status: 'completed' } : e));

    // Resolve any active alerts for this point
    setAlerts(prev => prev.filter(a => a.pointId !== event.pointId));

    setSuccess('Sample successfully logged! Alert resolved and schedule marked as done.');
    setTimeout(() => setSuccess(''), 4000);
    
    // Reset form
    setSelectedEventId('');
    setPh('');
    setCl('');
  };

  const handleSaveEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pointId = formData.get('pointId') as string;
    const date = formData.get('date') as string;
    const type = formData.get('type') as 'urgent' | 'routine';
    const point = points.find(p => p.id === pointId);

    if (editingEvent) {
      setScheduleEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { ...ev, pointId, name: point?.name || '', date, type } : ev));
    } else {
      setScheduleEvents(prev => [...prev, { id: `e${Date.now()}`, pointId, name: point?.name || '', date, type, status: 'pending' }]);
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScheduleEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const openEditModal = (ev: ScheduleEvent) => {
    setEditingEvent(ev);
    setShowEventModal(true);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.header}>
        <div>
          <h1>Schedule Dashboard</h1>
          <p>Interactive Agenda for all sampling events.</p>
        </div>
        <div className={styles.actions}>
          {role !== 'Sampler' && <button className="btn" onClick={openAddModal}>Add New Event</button>}
        </div>
      </header>

      {success && (
        <div style={{padding: '1rem', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '8px', textAlign: 'center'}}>
          {success}
        </div>
      )}

      {showEventModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-panel" style={{margin: 'auto', padding: '2rem', width: '400px', maxWidth: '90%'}}>
            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSaveEvent} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Sampling Point</label>
                <select name="pointId" className="input-field" defaultValue={editingEvent?.pointId} required>
                  {points.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Date</label>
                <input name="date" type="date" className="input-field" defaultValue={editingEvent?.date || new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Event Type</label>
                <select name="type" className="input-field" defaultValue={editingEvent?.type || 'routine'} required>
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent Re-sample</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{background: 'transparent', border: '1px solid var(--panel-border)'}} onClick={() => setShowEventModal(false)}>Cancel</button>
                <button type="submit" className="btn" style={{flex: 1}}>Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.mainGrid}>
        <section className={`glass-panel`}>
          <h2>Sampling Agenda</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>All scheduled tasks.</p>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
            {scheduleEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              scheduleEvents.sort((a,b) => a.date.localeCompare(b.date)).map(ev => (
                <div key={ev.id} style={{
                  padding: '1rem', background: ev.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--panel-border)', borderRadius: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{margin: '0 0 0.3rem 0'}}>{ev.name} <span style={{fontSize: '0.75rem', padding: '2px 6px', background: ev.type==='urgent' ? '#ef4444' : '#3b82f6', borderRadius: '4px', marginLeft: '0.5rem'}}>{ev.type}</span></h4>
                    <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Date: {ev.date} | Status: <span style={{color: ev.status === 'completed' ? '#10b981' : '#f59e0b'}}>{ev.status}</span></p>
                  </div>
                  {role !== 'Sampler' && (
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button onClick={() => openEditModal(ev)} style={{background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer'}}>Edit</button>
                      <button onClick={(e) => handleDeleteEvent(ev.id, e)} style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'}}>Del</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`glass-panel ${styles.formSection}`}>
          <h2>Complete Sample</h2>
          <p className={styles.formDesc}>Select a pending event to log its collected sample results.</p>

          <form className={styles.form} onSubmit={handleSubmitSample}>
            <div className="input-group">
              <label className="input-label">Pending Event</label>
              <select className="input-field" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} required>
                <option value="" disabled>-- Select a task --</option>
                {pendingEvents.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                ))}
              </select>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
              <div className="input-group" style={{flex: 1}}>
                <label className="input-label">pH Reading</label>
                <input type="number" step="0.1" className="input-field" placeholder="e.g. 7.2" value={ph} onChange={e => setPh(e.target.value)} required />
              </div>
              <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Chlorine (mg/L)</label>
                <input type="number" step="0.1" className="input-field" placeholder="e.g. 1.2" value={cl} onChange={e => setCl(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Sampled By</label>
              <input type="text" className="input-field" placeholder="Technician Name" required />
            </div>

            <button type="submit" className="btn" style={{width: '100%', marginTop: '1rem'}}>
              Submit Sample Data
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
