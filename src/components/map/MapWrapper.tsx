"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div style={{height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>Loading Map Engine...</div>
});

export default function MapWrapper(props: any) {
  return <MapComponent {...props} />;
}
