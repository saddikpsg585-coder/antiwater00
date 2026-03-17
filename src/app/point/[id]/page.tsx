"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './point.module.css';

const mockDB: Record<string, any> = {
  'p1': {
    id: 'p1', name: 'Wait Room Water Dispenser', risk: 'low',
    location: 'Main Lobby / Wait Room', floor: '1st Floor',
    history: [
      { date: '2026-03-16 10:00', ph: 7.2, cl: 1.2, notes: 'Clear, no odor', user: 'Admin' },
      { date: '2026-03-09 10:15', ph: 7.3, cl: 1.1, notes: 'Routine', user: 'Tech A' }
    ]
  },
  'p2': {
    id: 'p2', name: 'ICU Wash Basin (Bed 4)', risk: 'high',
    location: 'ICU Ward A', floor: '3rd Floor',
    history: [
      { date: '2026-03-17 08:30', ph: 6.4, cl: 0.8, notes: 'pH dropped slightly', user: 'Admin' },
      { date: '2026-03-16 14:00', ph: 6.8, cl: 0.9, notes: 'Follow up required', user: 'Tech B' }
    ]
  },
  'p3': {
    id: 'p3', name: 'Cafeteria Main Line', risk: 'medium',
    location: 'Cafeteria Kitchen', floor: 'Ground Floor',
    history: [
      { date: '2026-03-16 09:00', ph: 7.5, cl: 0.4, notes: 'Chlorine low', user: 'Tech C' }
    ]
  }
};

export default function PointDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap params using React.use() as required in Next.js 15+
  const { id } = use(params);
  
  const point = mockDB[id] || { 
    id, name: 'Unknown Point', risk: 'low', location: 'Unknown', floor: 'Unknown', history: [] 
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <button className="btn" style={{width: 'fit-content'}} onClick={() => router.back()}>
        &larr; Back
      </button>

      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>{point.name}</h1>
          <div className={styles.metaInfo}>
            ID: {point.id} | Location: {point.location} ({point.floor})
          </div>
          <div>
            <span className={`badge badge-${point.risk}`}>
              Risk Level: {point.risk.toUpperCase()}
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          <button className="btn" onClick={() => router.push('/schedule')}>Log New Sample</button>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <section className={`glass-panel ${styles.chartSection}`}>
            <h2>Trend Charts (Mock)</h2>
            <div className={styles.chartPlaceholder}>
              [ Trend Charts for pH and Chlorine over time ]
            </div>
          </section>

          <section className={`glass-panel ${styles.historySection}`}>
            <h2>Historical Sampling Data</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>pH</th>
                  <th>Chlorine (mg/L)</th>
                  <th>Sampled By</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {point.history.map((log: any, idx: number) => (
                  <tr key={idx}>
                    <td>{log.date}</td>
                    <td>{log.ph}</td>
                    <td>{log.cl}</td>
                    <td>{log.user}</td>
                    <td>{log.notes}</td>
                  </tr>
                ))}
                {point.history.length === 0 && (
                  <tr><td colSpan={5}>No records found.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <section className={`glass-panel ${styles.photoSection}`}>
            <h2>Location Photo</h2>
            <div className={styles.photoPlaceholder}>
              [ Image of Sampling Point ]
            </div>
          </section>

          <section className={`glass-panel ${styles.detailsSection}`}>
            <h2>Point Details</h2>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>Active</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Frequency</span>
              <span className={styles.detailValue}>Daily</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Total Samples</span>
              <span className={styles.detailValue}>{point.history.length}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Alerts</span>
              <span className={styles.detailValue}>{point.risk === 'high' ? 'Triggered' : 'None'}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
