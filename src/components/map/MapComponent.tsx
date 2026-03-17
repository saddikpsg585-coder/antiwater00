"use client";

import { useState } from 'react';
import { useAuth, Point } from '@/lib/AuthContext';

export default function MapComponent({ onMapClick, isPlacing, activeMapId }: { onMapClick?: (coords: {top: string, left: string}) => void, isPlacing?: boolean, activeMapId: string }) {
  const { points, maps } = useAuth();
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const activeMap = maps.find(m => m.id === activeMapId);
  const mapPoints = points.filter(p => p.mapId === activeMapId);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing || !onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = `${((x / rect.width) * 100).toFixed(2)}%`;
    const top = `${((y / rect.height) * 100).toFixed(2)}%`;
    onMapClick({ top, left });
  };

  return (
    <div 
      onClick={handleContainerClick}
      style={{ 
        position: 'relative',
        height: '500px', 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#1e293b',
        backgroundImage: activeMap?.imageUrl ? `url(${activeMap.imageUrl})` : 'radial-gradient(rgba(255,255,255,0.1) 2px, transparent 2px)',
        backgroundSize: activeMap?.imageUrl ? 'cover' : '30px 30px',
        backgroundPosition: 'center',
        cursor: isPlacing ? 'crosshair' : 'default'
      }}>
      
      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>
        {isPlacing ? (
          <span style={{color: '#f59e0b', fontWeight: 'bold'}}>Click anywhere on the map to place marker</span>
        ) : (
          <span>Mock Facility Map (Leaflet bypassed for preview)</span>
        )}
      </div>

      {mapPoints.map(point => {
        let color = '#10b981'; // low/green
        if (point.risk === 'medium') color = '#f59e0b';
        if (point.risk === 'high') color = '#ef4444';

        return (
          <div 
            key={point.id}
            onClick={(e) => {
              if (isPlacing) return;
              e.stopPropagation();
              setSelectedPoint(point);
            }}
            style={{
              position: 'absolute',
              top: point.top,
              left: point.left,
              width: '24px',
              height: '24px',
              backgroundColor: color,
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: `0 0 10px ${color}`,
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              zIndex: selectedPoint?.id === point.id ? 10 : 5
            }}
          />
        );
      })}

      {selectedPoint && !isPlacing && (
        <div style={{
          position: 'absolute',
          top: `calc(${selectedPoint.top} - 120px)`,
          left: `calc(${selectedPoint.left} + 20px)`,
          background: 'white',
          color: '#0f172a',
          padding: '10px',
          borderRadius: '8px',
          width: '200px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem' }}>{selectedPoint.name}</h3>
            <button onClick={() => setSelectedPoint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>×</button>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem' }}>
            Risk: <strong style={{ textTransform: 'uppercase' }}>{selectedPoint.risk}</strong>
          </p>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '4px', flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>pH</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedPoint.ph}</div>
            </div>
            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '4px', flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Cl</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedPoint.cl} mg/L</div>
            </div>
          </div>
          <a href={`/point/${selectedPoint.id}`} style={{ display: 'block', textAlign: 'center', width: '100%', padding: '6px', fontSize: '0.8rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            View Details
          </a>
        </div>
      )}
    </div>
  );
}
