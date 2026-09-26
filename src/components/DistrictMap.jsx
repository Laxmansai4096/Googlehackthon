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
  ArrowRight,
  MessageSquare,
  Share2,
  ShieldCheck,
  Activity
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

      // Standard OpenStreetMap Tiles (Clean, reliable, no API key watermark)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
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
    <div className="tactical-card" style={{ height: '100%', overflow: 'hidden' }}>
      <div className="card-topbar">
        <div className="card-title">
          <Building2 size={18} color="#38bdf8" />
          <span>District Geospatial Healthcare Command (50/50 Live Telemetry & Spatial GIS)</span>
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

      {/* 50/50 Split Grid: Left = Live Facility Dashboard, Right = Spatial Map */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        minHeight: '430px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Live Facility Telemetry & District Dashboard */}
        <div style={{
          padding: '1.25rem',
          background: 'var(--bg-surface-elevated)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {selectedFacility ? (
            <div>
              {/* Selected Center Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    SELECTED FACILITY TELEMETRY
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginTop: '0.15rem' }}>
                    {selectedFacility.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Type: <strong>{selectedFacility.type}</strong>
                  </div>
                </div>

                <span className={`status-badge ${
                  selectedFacility.overallHealth === 'Critical Stock-Out' ? 'critical' :
                  selectedFacility.overallHealth === 'Surplus Near Expiry' ? 'surplus' :
                  selectedFacility.overallHealth === 'Low Stock' ? 'low' : 'safe'
                }`}>
                  {selectedFacility.overallHealth}
                </span>
              </div>

              {/* Key Facility Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.65rem',
                marginBottom: '1rem'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Medical Officer</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginTop: '2px' }}>
                    {selectedFacility.inCharge.split(' ')[0]} {selectedFacility.inCharge.split(' ')[1]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{selectedFacility.phone}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cold Chain ILR</div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    color: selectedFacility.fridgeTempC > 6 ? '#f59e0b' : '#10b981',
                    marginTop: '2px'
                  }}>
                    {selectedFacility.fridgeTempC}°C
                  </div>
                  <div style={{ fontSize: '0.72rem', color: selectedFacility.fridgeTempC > 6 ? '#f59e0b' : '#10b981' }}>
                    {selectedFacility.fridgeTempC > 6 ? '⚠️ Temp Near Limit' : '✓ 2°C–8°C Thermal Safe'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Depot Distance</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginTop: '2px' }}>
                    {selectedFacility.distanceFromHQ_KM} km from CDW
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Highway Corridor</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Inpatient Beds</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginTop: '2px' }}>
                    {selectedFacility.totalBeds} Active Beds
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981' }}>24/7 Trauma Ready</div>
                </div>
              </div>

              {/* Facility Medicine Stock Inventory Snapshot */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Essential Drugs Stock:</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Live Sentinel</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px' }}>
                  {selectedFacility.inventory.slice(0, 4).map(item => {
                    const drug = ESSENTIAL_DRUGS.find(d => d.id === item.drugId);
                    const isCrit = item.stock <= 5 || item.status === 'Critical Stock-Out';
                    return (
                      <div key={item.drugId} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.6rem',
                        background: isCrit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: isCrit ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem'
                      }}>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{drug?.name.split('(')[0]}</span>
                        <span style={{
                          fontWeight: '800',
                          color: isCrit ? '#ef4444' : '#10b981',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {item.stock} {drug?.standardUnit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem 0' }}>
              Select a facility on the map to inspect live telemetry
            </div>
          )}

          {/* Quick Transfer & WhatsApp Actions */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            {selectedFacility?.id === 'FAC-CHC-JATNI' && (
              <button 
                className="btn-primary" 
                onClick={onInitiateTransfer}
                style={{ fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}
              >
                <Truck size={14} />
                <span>Trigger Cryo-Bike Transfer</span>
              </button>
            )}

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🚨 *ArogyaSetu AI Emergency Dispatch Alert*\nFacility: ${selectedFacility?.name || 'CHC Jatni'}\nStatus: ${selectedFacility?.overallHealth || 'Active'}\nILR Refrigerator Temp: ${selectedFacility?.fridgeTempC || 4.2}°C\nIn-charge: ${selectedFacility?.inCharge || 'MO'}\nLive Track: https://laxmansai4096.github.io/Googlehackthon/`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#059669',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.55rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
              }}
              title="Send Live Facility Status & Dispatch Link via WhatsApp"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Alert</span>
            </a>
          </div>
        </div>

        {/* Right Column: Leaflet Map (Half of area) */}
        <div style={{ position: 'relative', minHeight: '430px' }}>
          <div 
            ref={mapContainerRef} 
            className="map-viewport-wrapper"
            style={{ width: '100%', height: '100%', minHeight: '430px' }}
          />
        </div>
      </div>
    </div>
  );
}
