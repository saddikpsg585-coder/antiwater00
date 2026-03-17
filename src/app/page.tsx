"use client";

import styles from './page.module.css';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function OverviewDashboard() {
  const { role, alerts, scheduleEvents } = useAuth();
  return (
    <div className={`animate-fade-in ${styles.dashboard}`}>
      <header className={styles.header}>
        <div>
          <h1>System Overview</h1>
          <p>{role === 'Sampler' ? 'Review your scheduled tasks below.' : 'Real-time visibility into required water quality metrics.'}</p>
        </div>
        <div className={styles.actions}>
          {role !== 'Sampler' && <button className="btn">Download Report</button>}
        </div>
      </header>

      {/* Key Metrics Summary Bar */}
      {role !== 'Sampler' && (
        <section className={styles.metricsBar}>
          <div className="glass-panel">
            <div className={styles.metricLabel}>Average pH</div>
            <div className={styles.metricValue}>7.4</div>
            <div className={`${styles.metricChange} ${styles.positive}`}>+0.1 this week</div>
          </div>
          <div className="glass-panel">
            <div className={styles.metricLabel}>Average Chlorine</div>
            <div className={styles.metricValue}>1.2 <span className={styles.unit}>mg/L</span></div>
            <div className={`${styles.metricChange} ${styles.neutral}`}>Stable</div>
          </div>
          <div className="glass-panel">
            <div className={styles.metricLabel}>Active Sampling Boards</div>
            <div className={styles.metricValue}>24</div>
            <div className={styles.metricChange}>Across 4 zones</div>
          </div>
        </section>
      )}

      <div className={styles.mainGrid}>
        {/* Alerts Panel */}
        {role !== 'Sampler' && (
          <section className={`glass-panel ${styles.alertsPanel}`}>
            <div className={styles.panelHeader}>
              <h2>Active Alerts</h2>
              <span className={styles.alertCount}>2</span>
            </div>
            <div className={styles.alertList}>
              {alerts.length === 0 ? (
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem'}}>No active alerts. All metrics are within normal ranges.</p>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className={`${styles.alertCard} ${alert.risk === 'high' ? styles.dangerCard : styles.warningCard}`}>
                    <div className={styles.alertIcon}>⚠️</div>
                    <div className={styles.alertContent}>
                      <h3>{alert.name}</h3>
                      <p>{alert.message}</p>
                      <span className={styles.alertTime}>Last sampled: {alert.time}</span>
                    </div>
                    <Link href={`/point/${alert.pointId}`} className={`btn ${alert.risk === 'high' ? 'btn-danger' : ''} ${styles.alertBtn}`}>View</Link>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Upcoming Schedule Summary */}
        <section className={`glass-panel ${styles.schedulePanel}`}>
          <h2>Upcoming Schedule</h2>
          <div className={styles.scheduleList}>
            
            {scheduleEvents.filter(e => e.status === 'pending').length === 0 ? (
              <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem'}}>No upcoming events.</p>
            ) : (
              scheduleEvents.filter(e => e.status === 'pending').map(event => (
                <div key={event.id} className={styles.scheduleItem}>
                  <div className={`${styles.riskIndicator} ${event.type === 'urgent' ? styles.riskHigh : styles.riskLow}`}></div>
                  <div className={styles.scheduleDetails}>
                    <h4>{event.name}</h4>
                    <p>{event.type === 'urgent' ? 'Requires urgent re-sampling' : 'Routine sample'}</p>
                  </div>
                  <div className={styles.scheduleTime}>{event.date}</div>
                </div>
              ))
            )}

          </div>
        </section>
      </div>
      
      {/* Quick Access Links */}
      <section className={styles.quickAccess}>
        <h2>Quick Access</h2>
        <div className={styles.quickCards}>
          {role !== 'Sampler' && (
            <a href="/map" className={`glass-panel ${styles.quickCard}`}>
              <span className={styles.quickIcon}>🗺️</span>
              <h3>Map View</h3>
              <p>Interactive layout of all sample points</p>
            </a>
          )}
          <a href="/schedule" className={`glass-panel ${styles.quickCard}`}>
            <span className={styles.quickIcon}>📅</span>
            <h3>Schedule Dashboard</h3>
            <p>Calendar view of all sampling events</p>
          </a>
          {role !== 'Sampler' && (
            <a href="/analysis" className={`glass-panel ${styles.quickCard}`}>
              <span className={styles.quickIcon}>📈</span>
              <h3>Data Analysis</h3>
              <p>Trends, compliance, and webhooks</p>
            </a>
          )}
        </div>
      </section>

    </div>
  );
}
