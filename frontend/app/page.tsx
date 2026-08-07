'use client';

import { useState } from 'react';
import RouteControls, { type RouteResult, type Location } from './routeControls';
import CampusMap from './campusMap';

export default function HomePage() {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleRouteUpdate = (newRoute: RouteResult | null) => {
    setRoute(newRoute);
  };

  const handleLocationSelect = (selectedOrigin: string, selectedDestination: string) => {
    setOrigin(selectedOrigin);
    setDestination(selectedDestination);
  };

  return (
    <main style={{ height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#f5f5f5', display: 'flex' }}>
      {/* Left Panel - Controls */}
      <div style={{ width: 450, display: 'flex', flexDirection: 'column' }}>
        <RouteControls
          onRouteUpdate={handleRouteUpdate}
          onLocationsLoad={setLocations}
          onLocationSelect={handleLocationSelect}
        />

        {/* Route info panel */}
        {route && (
          <div
            style={{
              margin: '16px 20px 20px',
              background: 'rgba(20, 20, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              padding: 16,
              color: '#fff',
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: '#00ff88' }}>Route Info</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>
                <strong>Distance:</strong> {route.distance.toFixed(1)}m
              </p>
              <p style={{ margin: 0 }}>
                <strong>Duration:</strong> {route.duration_minutes.toFixed(1)} min
              </p>
              <p style={{ margin: 0 }}>
                <strong>Accessibility:</strong> {(route.accessibility_score * 100).toFixed(0)}%
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                {route.path.length} waypoints
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Campus Map */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <CampusMap
          locations={locations}
          route={route?.path || null}
          origin={origin}
          destination={destination}
          fullScreen
        />
      </div>
    </main>
  );
}
