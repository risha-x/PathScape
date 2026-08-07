'use client';

import { useState, useEffect } from 'react';

export interface Location {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
}

export interface RouteResult {
  path: { x: number; y: number; z: number; label: string }[];
  distance: number;
  duration_minutes: number;
  accessibility_score: number;
}

interface RouteControlsProps {
  onRouteUpdate: (route: RouteResult | null) => void;
  onLocationsLoad: (locations: Location[]) => void;
  onLocationSelect?: (origin: string, destination: string) => void;
}

export default function RouteControls({ onRouteUpdate, onLocationsLoad, onLocationSelect }: RouteControlsProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [constraints, setConstraints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:8000/locations');
        const data = await res.json();
        setLocations(data.locations);
        onLocationsLoad(data.locations);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };
    fetchLocations();
  }, [onLocationsLoad]);

  const filterLocations = (query: string) => {
    if (!query.trim()) return [];
    return locations.filter((loc) =>
      loc.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const originSuggestions = filterLocations(originInput);
  const destinationSuggestions = filterLocations(destinationInput);

  const getLocationLabel = (id: string) => {
    return locations.find((loc) => loc.id === id)?.label || '';
  };

  const toggleConstraint = (constraint: string) => {
    setConstraints((prev) =>
      prev.includes(constraint)
        ? prev.filter((c) => c !== constraint)
        : [...prev, constraint]
    );
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Please select both origin and destination');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          constraints,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to find route');
      }

      const route: RouteResult = await res.json();
      onRouteUpdate(route);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onRouteUpdate(null);
    } finally {
      setLoading(false);
    }
  };

  const selectOrigin = (location: Location) => {
    setOrigin(location.id);
    setOriginInput(location.label);
    setShowOriginSuggestions(false);
    onLocationSelect?.(location.id, destination);
  };

  const selectDestination = (location: Location) => {
    setDestination(location.id);
    setDestinationInput(location.label);
    setShowDestinationSuggestions(false);
    onLocationSelect?.(origin, location.id);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '0.9rem',
    boxSizing: 'border-box' as const,
  };

  const suggestionStyle = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(20, 20, 30, 0.98)',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    borderTop: 'none',
    borderRadius: '0 0 6px 6px',
    maxHeight: 200,
    overflowY: 'auto' as const,
    zIndex: 100,
  };

  const suggestionItemStyle = {
    padding: '10px 12px',
    cursor: 'pointer' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background 0.2s',
  };

  return (
    <div
      style={{
        color: '#fff',
        background: 'rgba(20, 20, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: 20,
        borderRadius: 0,
        border: 'none',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ margin: '0 0 16px', fontSize: '1.5rem', color: '#00ff88' }}>PathScape</h1>
      <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#aaa' }}>
        AI-powered accessibility planning for personalized campus routes
      </p>

      <div style={{ flex: 1, overflowY: 'auto' }}>

      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#00ff88' }}>
          Start Location
        </label>
        <input
          type="text"
          placeholder="Search for a location..."
          value={originInput}
          onChange={(e) => {
            setOriginInput(e.target.value);
            setShowOriginSuggestions(true);
            if (!e.target.value) setOrigin('');
          }}
          onFocus={() => setShowOriginSuggestions(true)}
          onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
          style={inputStyle}
        />
        {showOriginSuggestions && originSuggestions.length > 0 && (
          <div style={suggestionStyle}>
            {originSuggestions.map((loc) => (
              <div
                key={loc.id}
                onClick={() => selectOrigin(loc)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    'rgba(0, 255, 136, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
                style={suggestionItemStyle}
              >
                {loc.label}
              </div>
            ))}
          </div>
        )}
        {origin && (
          <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#00ff88' }}>
            ✓ Selected: {getLocationLabel(origin)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#00ff88' }}>
          Destination
        </label>
        <input
          type="text"
          placeholder="Search for a location..."
          value={destinationInput}
          onChange={(e) => {
            setDestinationInput(e.target.value);
            setShowDestinationSuggestions(true);
            if (!e.target.value) setDestination('');
          }}
          onFocus={() => setShowDestinationSuggestions(true)}
          onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
          style={inputStyle}
        />
        {showDestinationSuggestions && destinationSuggestions.length > 0 && (
          <div style={suggestionStyle}>
            {destinationSuggestions.map((loc) => (
              <div
                key={loc.id}
                onClick={() => selectDestination(loc)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    'rgba(0, 255, 136, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
                style={suggestionItemStyle}
              >
                {loc.label}
              </div>
            ))}
          </div>
        )}
        {destination && (
          <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#00ff88' }}>
            ✓ Selected: {getLocationLabel(destination)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#00ff88' }}>
          Accessibility Constraints
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['no_stairs', 'no_hills', 'prefer_ramps', 'wheelchair'].map((constraint) => (
            <label key={constraint} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={constraints.includes(constraint)}
                onChange={() => toggleConstraint(constraint)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem' }}>
                {constraint === 'no_stairs' && 'No Stairs'}
                {constraint === 'no_hills' && 'No Steep Hills'}
                {constraint === 'prefer_ramps' && 'Prefer Ramps'}
                {constraint === 'wheelchair' && 'Wheelchair Accessible'}
              </span>
            </label>
          ))}
        </div>
      </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: 6,
          border: 'none',
          background: '#00ff88',
          color: '#000',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          fontSize: '0.9rem',
          marginTop: 12,
        }}
      >
        {loading ? 'Finding Route...' : 'Find Route'}
      </button>

      {error && (
        <div style={{ marginTop: 12, padding: 8, background: 'rgba(255, 100, 100, 0.2)', borderRadius: 6, fontSize: '0.85rem', color: '#ff6464' }}>
          {error}
        </div>
      )}
    </div>
  );
}
