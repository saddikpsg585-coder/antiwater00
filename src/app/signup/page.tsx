"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sampler', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/'); // Redirect to Dashboard Overview
    }, 1500);
  };

  return (
    <div className={styles.authContainer}>
      <div className={`animate-fade-in ${styles.authCard}`}>
        <div className={styles.authHeader}>
          <h1>Create an Account</h1>
          <p>Register as a new facility user</p>
        </div>

        <form className={styles.authForm} onSubmit={handleSignup}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. John Doe" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@hospital.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Requested Role</label>
            <select 
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="Admin">Administrator</option>
              <option value="Manager">Facility Manager</option>
              <option value="Sampler">Lab Technician / Sampler</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn" style={{width: '100%', marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem'}} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account? <Link href="/login" className={styles.authLink}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
