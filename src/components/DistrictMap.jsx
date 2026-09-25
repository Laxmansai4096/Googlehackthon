import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Thermometer, 
  Clock, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { ESSENTIAL_DRUGS } from '../data/mockData';

export default function DistrictMap({ 
  facilities, 
  selectedFacility, 
  setSelectedFacility, 
  transferRouteActive,
  onInitiateTransfer
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Khordha, Odisha center
      const map = L.map(mapContainerRef.current, {
        center: [20.18, 85.68],
        zoom: 10,
        zoomControl: true
      });

      // Dark Tactical Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Update Markers when facilities or selected facility changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    facilities.forEach(fac => {
      let color = '#10b981'; // safe
      let ringColor = 'rgba(16, 185, 129, 0.4)';

      if (fac.type === 'Central Warehouse') {
        color = '#38bdf8';
        ringColor = 'rgba(56, 189, 248, 0.5)';
      } else if (fac.overallHealth === 'Critical Stock-Out') {
        color = '#ef4444';
        ringColor = 'rgba(239, 68, 68, 0.6)';
      } else if (fac.overallHealth === 'Low Stock') {
        color = '#f59e0b';
        ringColor = 'rgba(245, 158, 11, 0.4)';
      } else if (fac.overallHealth === 'Surplus Near Expiry') {
        color = '#06b6d4';
        ringColor = 'rgba(6, 182, 212, 0.5)';
      }

      const isSelected = selectedFacility && selectedFacility.id === fac.id;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-facility-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background: ${color};
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 ${isSelected ? '18px' : '10px'} ${ringColor};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="
              width: 8px;
              height: 8px;
              background: #ffffff;
              border-radius: 50%;
            "></span>
            ${fac.overallHealth === 'Critical Stock-Out' ? `
              <div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid #ef4444;
                animation: pulse 1.5s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(fac.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedFacility(fac);
        map.panTo(fac.coordinates, { animate: true, duration: 0.6 });
      });

      marker.bindTooltip(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #fff; background: #0c1527; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);">
          ${fac.name} (${fac.overallHealth})
        </div>
      `, { direction: 'top', offset: [0, -10] });

      markersGroup.addLayer(marker);
    });
  }, [facilities, selectedFacility, setSelectedFacility]);

  // Handle Transfer Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (transferRouteActive) {
      // Route from PHC Balipatna to CHC Jatni
      const balipatna = [20.1420, 85.9230];
      const jatni = [20.1652, 85.7063];
      const midpoint = [20.1810, 85.8140]; // via highway route

      const latlngs = [balipatna, midpoint, jatni];

      const polyline = L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.9
      }).addTo(map);

      // Add animated truck icon at midpoint
      const truckIcon = L.divIcon({
        className: 'truck-marker',
        html: `
          <div style="
            background: #0284c7;
            color: #ffffff;
            padding: 6px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 16px rgba(56, 189, 248, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 2s infinite ease-in-out;
          ">
            🚚
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const truckMarker = L.marker(midpoint, { icon: truckIcon }).addTo(map);
      truckMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; font-size: 12px;">
          <strong>⚡ Active Inter-Facility Transfer</strong><br/>
          Cargo: <strong>60 Vials Anti-Snake Venom</strong><br/>
          From: PHC Balipatna (Surplus)<br/>
          To: CHC Jatni (Emergency Deficit)<br/>
          ETA: <strong>32 minutes via NH-16</strong>
        </div>
      `).openPopup();

      routeLayerRef.current = L.layerGroup([polyline, truckMarker]).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [transferRouteActive]);

  return (
    <div className="tactical-card" style={{ height: '100%' }}>
      <div className="card-topbar">
        <div className="card-title">
          <Building2 size={18} color="#38bdf8" />
          <span>District Geospatial Healthcare Command (Khordha Network)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
            Stockout
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, background: '#06b6d4', borderRadius: '50%' }}></span>
            Surplus
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></span>
            Safe
          </span>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div 
        ref={mapContainerRef} 
        className="map-viewport-wrapper"
        style={{ minHeight: '440px', flex: 1 }}
      />

      {/* Selected Facility Quick Glance Drawer */}
      {selectedFacility && (
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--bg-surface-elevated)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{selectedFacility.name}</strong>
              <span className={`status-badge ${
                selectedFacility.overallHealth === 'Critical Stock-Out' ? 'critical' :
                selectedFacility.overallHealth === 'Surplus Near Expiry' ? 'surplus' :
                selectedFacility.overallHealth === 'Low Stock' ? 'low' : 'safe'
              }`}>
                {selectedFacility.overallHealth}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>In-charge: <strong>{selectedFacility.inCharge}</strong></span>
              <span>Distance: <strong>{selectedFacility.distanceFromHQ_KM} km from CDW</strong></span>
              <span>ILR Temp: <strong style={{ color: selectedFacility.fridgeTempC > 6 ? '#f59e0b' : '#10b981' }}>{selectedFacility.fridgeTempC}°C</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {selectedFacility.id === 'FAC-CHC-JATNI' && (
              <button 
                className="btn-primary" 
                onClick={onInitiateTransfer}
                style={{ fontSize: '0.82rem' }}
              >
                <Truck size={14} />
                <span>Trigger Surplus Transfer from Balipatna</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
