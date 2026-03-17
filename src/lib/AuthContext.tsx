"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'Admin' | 'Manager' | 'Sampler' | null;

export type MapData = { id: string, name: string, imageUrl: string };
export type Point = { id: string, mapId: string, name: string, top: string, left: string, risk: 'low'|'medium'|'high', ph: number, cl: number, zone?: string, imageUrl?: string };
export type Alert = { id: string, pointId: string, name: string, message: string, time: string, risk: 'high'|'medium' };
export type ScheduleEvent = { id: string, pointId: string, name: string, date: string, type: 'urgent'|'routine', status: 'pending'|'completed' };

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  maps: MapData[];
  setMaps: React.Dispatch<React.SetStateAction<MapData[]>>;
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  scheduleEvents: ScheduleEvent[];
  setScheduleEvents: React.Dispatch<React.SetStateAction<ScheduleEvent[]>>;
}

const defaultContext: AppContextType = {
  role: null, setRole: () => {},
  maps: [], setMaps: () => {},
  points: [], setPoints: () => {},
  alerts: [], setAlerts: () => {},
  scheduleEvents: [], setScheduleEvents: () => {}
};

const AuthContext = createContext<AppContextType>(defaultContext);

const initialMaps: MapData[] = [
  { id: 'm1', name: 'Main Facility', imageUrl: '' } // empty uses default CSS background
];

const initialPoints: Point[] = [
  { id: 'p1', mapId: 'm1', name: 'Wait Room Water Dispenser', top: '20%', left: '30%', risk: 'low', ph: 7.2, cl: 1.2, zone: 'Main Lobby' },
  { id: 'p2', mapId: 'm1', name: 'ICU Wash Basin (Bed 4)', top: '50%', left: '60%', risk: 'high', ph: 6.4, cl: 0.8, zone: 'ICU Ward A' },
  { id: 'p3', mapId: 'm1', name: 'Cafeteria Main Line', top: '70%', left: '40%', risk: 'medium', ph: 7.5, cl: 0.4, zone: 'Cafeteria' },
];

const initialAlerts: Alert[] = [
  { id: 'a1', pointId: 'p2', name: 'Point A-14 (North Wing)', message: 'pH reading (6.2) below acceptable range (6.5 - 8.5).', time: 'Today, 08:30 AM', risk: 'high' },
  { id: 'a2', pointId: 'p3', name: 'Point C-02 (East Wing)', message: 'Residual Chlorine (0.4 mg/L) is marginally low.', time: 'Yesterday, 14:15 PM', risk: 'medium' }
];

const initialEvents: ScheduleEvent[] = [
  { id: 'e1', pointId: 'p2', name: 'Point A-14 (North Wing)', date: '2026-03-16', type: 'urgent', status: 'pending' },
  { id: 'e2', pointId: 'p3', name: 'Point C-02 (East Wing)', date: '2026-03-17', type: 'routine', status: 'pending' },
  { id: 'e3', pointId: 'p1', name: 'Point B-05 (Main Lobby)', date: '2026-03-19', type: 'routine', status: 'pending' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Admin');
  const [maps, setMaps] = useState<MapData[]>(initialMaps);
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(initialEvents);

  return (
    <AuthContext.Provider value={{ 
      role, setRole, 
      maps, setMaps,
      points, setPoints, 
      alerts, setAlerts, 
      scheduleEvents, setScheduleEvents 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
