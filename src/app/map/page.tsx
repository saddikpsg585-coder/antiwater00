"use client";

import MapWrapper from '@/components/map/MapWrapper';
import styles from './map.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function MapPage() {
  const { role, maps, setMaps, points, setPoints } = useAuth();
  const [activeMapId, setActiveMapId] = useState(maps[0]?.id || '');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMapModal, setShowAddMapModal] = useState(false);
  
  const [isPlacing, setIsPlacing] = useState(false);
  const [tempCoords, setTempCoords] = useState<{top: string, left: string} | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Marker Form states
  const [newName, setNewName] = useState('');
  const [newZone, setNewZone] = useState('');
  const [newRisk, setNewRisk] = useState<'low'|'medium'|'high'>('low');
  const [newPointImage, setNewPointImage] = useState<string>('');

  // Map Form states
  const [newMapName, setNewMapName] = useState('');
  const [newMapImage, setNewMapImage] = useState<string>('');

  const activeMapPoints = points.filter(p => p.mapId === activeMapId);

  const startPlacement = () => {
    setIsPlacing(true);
    setSuccessMsg('Click anywhere on the map to choose a location.');
  };

  const handleMapClick = (coords: {top: string, left: string}) => {
    setTempCoords(coords);
    setIsPlacing(false);
    setShowAddModal(true);
    setSuccessMsg('');
  };

  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCoords || !activeMapId) return;

    const newPoint = {
      id: `p${points.length + 1}`,
      mapId: activeMapId,
      name: newName,
      zone: newZone,
      risk: newRisk,
      ph: 7.0, // Default mock values
      cl: 1.0,
      top: tempCoords.top,
      left: tempCoords.left,
      imageUrl: newPointImage || undefined
    };

    setPoints([...points, newPoint]);
    setShowAddModal(false);
    setTempCoords(null);
    setNewName('');
    setNewZone('');
    setNewRisk('low');
    setNewPointImage('');

    setSuccessMsg('New Sampling Point successfully created!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMapImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePointImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPointImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMap = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `m${maps.length + 1}`;
    setMaps([...maps, { id: newId, name: newMapName, imageUrl: newMapImage }]);
    setActiveMapId(newId);
    setShowAddMapModal(false);
    setNewMapName('');
    setNewMapImage('');
    setSuccessMsg('New Map successfully added!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.header} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0}}>Facility Map</h1>
            <p style={{margin: '0.2rem 0 0 0', color: 'var(--text-secondary)'}}>Interactive layout of all water sampling points.</p>
          </div>
          <div className={styles.actions} style={{display: 'flex', gap: '0.8rem'}}>
            {role === 'Admin' && <button className="btn" style={{background: 'var(--panel-border)', color: 'white'}} onClick={() => setShowAddMapModal(true)}>Add New Map Layer</button>}
            {role === 'Admin' && <button className="btn" onClick={startPlacement} disabled={isPlacing || !activeMapId}>Add New Marker</button>}
          </div>
        </div>

        {/* Map Switcher Tabs */}
        <div style={{display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%'}}>
          {maps.map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveMapId(m.id)}
              style={{
                padding: '0.5rem 1rem', 
                borderRadius: '20px', 
                border: '1px solid',
                borderColor: activeMapId === m.id ? '#3b82f6' : 'var(--panel-border)',
                background: activeMapId === m.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                color: activeMapId === m.id ? '#60a5fa' : 'white',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
              {m.name}
            </button>
          ))}
        </div>
      </header>
      
      {successMsg && (
        <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '8px', textAlign: 'center'}}>
          {successMsg}
        </div>
      )}

      {/* Add Marker Modal */}
      {showAddModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-panel" style={{margin: 'auto', padding: '2rem', width: '400px', maxWidth: '90%'}}>
            <h2>Add New Sampling Point</h2>
            <form onSubmit={handleAddMarker} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Point Name</label>
                <input type="text" className="input-field" placeholder="e.g. Sink 4" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Location / Zone</label>
                <input type="text" className="input-field" placeholder="e.g. Ward 2" value={newZone} onChange={e => setNewZone(e.target.value)} required />
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Level of Danger (Initial Risk)</label>
                <select className="input-field" value={newRisk} onChange={(e: any) => setNewRisk(e.target.value)}>
                  <option value="low">Low Risk (Green)</option>
                  <option value="medium">Medium Risk (Yellow)</option>
                  <option value="high">High Risk (Red)</option>
                </select>
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Location Photo (Optional)</label>
                <input type="file" accept="image/*" className="input-field" onChange={handlePointImageUpload} style={{padding: '0.5rem'}} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{background: 'transparent', border: '1px solid var(--panel-border)'}} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn" style={{flex: 1}}>Confirm Point Creation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Map Modal */}
      {showAddMapModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-panel" style={{margin: 'auto', padding: '2rem', width: '400px', maxWidth: '90%'}}>
            <h2>Add New Map Layer</h2>
            <form onSubmit={handleAddMap} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Map Name</label>
                <input type="text" className="input-field" placeholder="e.g. 2nd Floor, Building C..." value={newMapName} onChange={e => setNewMapName(e.target.value)} required />
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <label className="input-label">Upload Map Image</label>
                <input type="file" accept="image/*" className="input-field" onChange={handleImageUpload} style={{padding: '0.5rem'}} required />
              </div>
              <div style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                Supported: JPG, PNG, WEBP.
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{background: 'transparent', border: '1px solid var(--panel-border)'}} onClick={() => setShowAddMapModal(false)}>Cancel</button>
                <button type="submit" className="btn" style={{flex: 1}} disabled={!newMapImage}>Create Overlay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className={`glass-panel ${styles.mapSection}`}>
        {activeMapId ? (
          <MapWrapper isPlacing={isPlacing} onMapClick={handleMapClick} activeMapId={activeMapId} />
        ) : (
          <div style={{height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'}}>No map selected.</div>
        )}
      </section>

      <section className={`glass-panel ${styles.pointsList}`}>
        <h2>Points on Active Map</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Point ID</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Ph</th>
              <th>Last Cl</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeMapPoints.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)'}}>No points on this map yet.</td></tr>
            ) : (
              activeMapPoints.map(pt => (
                <tr key={pt.id}>
                  <td>{pt.id}</td>
                  <td>{pt.name} {pt.zone && `(${pt.zone})`}</td>
                  <td>
                    <span className={`badge badge-${pt.risk}`}>
                      {pt.risk === 'low' ? 'Low Risk' : pt.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                    </span>
                  </td>
                  <td>{pt.ph}</td>
                  <td>{pt.cl}</td>
                  <td><Link href={`/point/${pt.id}`} className="btn" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>View</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
