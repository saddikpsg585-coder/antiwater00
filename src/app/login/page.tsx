"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './auth.module.css';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Manager' | 'Sampler'>('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setRole(selectedRole);
      setIsLoading(false);
      router.push('/'); // Redirect to Dashboard Overview
    }, 1500);
  };

  return (
    <div className={styles.authContainer}>
      <div className={`animate-fade-in ${styles.authCard}`}>
        <div className={styles.authHeader}>
          <h1>Welcome Back</h1>
          <p>Sign in to your Aqua Monitor dashboard</p>
        </div>

        <form className={styles.authForm} onSubmit={handleLogin}>
          <div className="input-group" style={{background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
            <label className="input-label" style={{color: '#60a5fa'}}>Demo Mode: Select Demo Role</label>
            <select 
              className="input-field" 
              value={selectedRole}
              onChange={(e: any) => setSelectedRole(e.target.value)}
            >
              <option value="Admin">Administrator (Full Access)</option>
              <option value="Manager">Facility Manager (View & Reports)</option>
              <option value="Sampler">Lab Tech / Sampler (Data Entry Only)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="user@hospital.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <label className="input-label">Password</label>
              <Link href="#" className={styles.authLink} style={{fontSize: '0.8rem'}}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn" style={{width: '100%', marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem'}} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Don't have an account? <Link href="/signup" className={styles.authLink}>Request Access</Link>
        </div>
      </div>
    </div>
  );
}
