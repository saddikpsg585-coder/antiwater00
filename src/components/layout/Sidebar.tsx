"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: '📊', roles: ['Admin', 'Manager', 'Sampler'] },
  { label: 'Map View', href: '/map', icon: '🗺️', roles: ['Admin', 'Manager'] },
  { label: 'Schedule Dashboard', href: '/schedule', icon: '📅', roles: ['Admin', 'Manager', 'Sampler'] },
  { label: 'Data Analysis', href: '/analysis', icon: '📈', roles: ['Admin', 'Manager'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <Link href="/" className={styles.brand}>
        <div className={styles.brandIcon}>W</div>
        <div className={styles.brandText}>Aqua<br/>Monitor</div>
      </Link>
      
      <nav className={styles.nav}>
        {NAV_ITEMS.filter(item => item.roles.includes(role || '')).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userProfile} style={{display: 'flex', alignItems: 'center', width: '100%', gap: '0.5rem'}}>
          <div className={styles.avatar}>{role ? role.charAt(0) : 'U'}</div>
          <div className={styles.userInfo} style={{flex: 1}}>
            <span className={styles.userName}>{role || 'Guest'} User</span>
            <span className={styles.userRole}>{role === 'Admin' ? 'System Administrator' : role === 'Manager' ? 'Facility Manager' : 'Lab Tech'}</span>
          </div>
          <button 
            onClick={() => router.push('/login')} 
            title="Logout"
            style={{background: 'none', border:'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
