"use client";

import styles from './analysis.module.css';

export default function AnalysisDashboard() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.header}>
        <div>
          <h1>Data Analysis & Reporting</h1>
          <p>Mock visualization of webhook responses from external analysis services.</p>
        </div>
        <div className={styles.actions}>
          <button className="btn">Configure Webhook</button>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <section className={`glass-panel ${styles.chartSection}`}>
          <div className={styles.sectionHeader}>
            <h2>Historical pH Trends (Facility Wide)</h2>
            <select className="input-field" style={{padding: '0.4rem', fontSize: '0.85rem'}}>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className={styles.chartPlaceholder}>
            {/* Placeholder for Recharts <LineChart> */}
            <div className={styles.mockChart}>
               <div className={styles.chartLine} style={{height: '60%'}}></div>
               <div className={styles.chartLine} style={{height: '70%'}}></div>
               <div className={styles.chartLine} style={{height: '65%'}}></div>
               <div className={styles.chartLine} style={{height: '80%'}}></div>
               <div className={styles.chartLine} style={{height: '50%'}}></div>
               <div className={styles.chartLine} style={{height: '40%', background: 'var(--risk-high)'}}></div>
               <div className={styles.chartLine} style={{height: '60%'}}></div>
            </div>
            <p className={styles.chartNote}>CSS Mock Chart (Recharts bypassed for preview)</p>
          </div>
        </section>

        <section className={`glass-panel ${styles.sideSection}`}>
          <h2>Compliance Status</h2>
          <div className={styles.complianceCard}>
             <div className={styles.circleGraph}>
               <span>92%</span>
             </div>
             <div className={styles.complianceInfo}>
               <h3>WHO Guidelines</h3>
               <p>Samples meeting standards</p>
             </div>
          </div>
          
          <h2 style={{marginTop: '2rem'}}>Recent Webhook Hits</h2>
          <ul className={styles.webhookList}>
            <li className={styles.webhookItem}>
              <span className={styles.statusSuccess}>200 OK</span>
              <span>Point A-14 Analysis</span>
              <span className={styles.timeStr}>10:45 AM</span>
            </li>
            <li className={styles.webhookItem}>
              <span className={styles.statusSuccess}>200 OK</span>
              <span>Point C-02 Analysis</span>
              <span className={styles.timeStr}>09:12 AM</span>
            </li>
            <li className={styles.webhookItem}>
              <span className={styles.statusError}>500 ERR</span>
              <span>Point B-05 Request Failed</span>
              <span className={styles.timeStr}>Yesterday</span>
            </li>
          </ul>
        </section>
      </div>

    </div>
  );
}
