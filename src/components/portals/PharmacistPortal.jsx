import React, { useState } from 'react';
import { 
  Package, 
  Camera, 
  ThermometerSnowflake, 
  Truck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  PlusCircle, 
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import ShelfScanner from '../ShelfScanner';
import { ESSENTIAL_DRUGS } from '../../data/mockData';

export default function PharmacistPortal({ 
  facilities, 
  currentFacility, 
  setCurrentFacility, 
  onCommitInventory,
  transferRouteActive 
}) {
  const [activePharmacistTab, setActivePharmacistTab] = useState('scanner'); // 'scanner', 'inventory', 'transfers'
  const [searchTerm, setSearchTerm] = useState('');

  const activeFac = currentFacility || facilities?.[1] || facilities?.[0] || {
    id: 'FAC-CHC-JATNI',
    name: 'CHC Jatni (Sub-Divisional Hospital)',
    inCharge: 'Dr. Smita Pattnaik',
    overallHealth: 'Critical Stock-Out',
    inventory: []
  };

  const filteredInventory = (activeFac.inventory || []).filter(item => {
    const drugMeta = ESSENTIAL_DRUGS.find(d => d.id === item.drugId);
    return (drugMeta?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
           (item.batchNo || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner: Pharmacist Identity & Facility Selector (Hack2Skill White Elevated Card) */}
      <div className="h2s-card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'
            }}>
              💊
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Primary Health Centre Pharmacy Portal
                </h2>
                <span className="brand-badge-pill">
                  Dispensary Cockpit
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Pharmacist In-Charge: <strong style={{ color: '#1e293b' }}>{activeFac.inCharge}</strong> • Active Facility: <strong style={{ color: '#1e293b' }}>{activeFac.name}</strong>
              </p>
            </div>
          </div>

          {/* Change Local Facility Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>Active Facility:</span>
            <select
              value={activeFac.id}
              onChange={(e) => {
                const found = facilities.find(f => f.id === e.target.value);
                if (found) setCurrentFacility(found);
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#1e293b',
                fontSize: '0.85rem',
                fontWeight: '700',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {facilities.map(fac => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.overallHealth})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Segmented Sub-Tabs Bar (Matches Hack2Skill Screenshot Style) */}
      <div className="segmented-tab-bar">
        <button
          className={`segmented-tab-btn ${activePharmacistTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActivePharmacistTab('scanner')}
        >
          📸 Gemini Stock Photo Digitizer
        </button>

        <button
          className={`segmented-tab-btn ${activePharmacistTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActivePharmacistTab('inventory')}
        >
          📦 Local Pharmacy Ledger ({activeFac.inventory?.length || 0} Drugs)
        </button>

        <button
          className={`segmented-tab-btn ${activePharmacistTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setActivePharmacistTab('transfers')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>🚚 Inter-Facility Directives</span>
          {transferRouteActive && (
            <span style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }}></span>
          )}
        </button>
      </div>

      {/* Tab 1: Gemini Vision Scanner for Stock Digitalization */}
      {activePharmacistTab === 'scanner' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="blue-info-banner">
            <div>
              <strong style={{ color: '#1e40af', fontSize: '0.9rem' }}>
                Zero Data-Entry Stock Intake (Gemini Flash Multimodal Vision)
              </strong>
              <div style={{ fontSize: '0.8rem', color: '#1e3a8a', marginTop: '2px' }}>
                Upload or capture received medicine cartons, blister packs, or handwritten paper registers to instantly extract drug name, batch number, expiry date, and quantity into the digital ledger.
              </div>
            </div>
            <span className="badge-soft safe" style={{ flexShrink: 0 }}>
              Live AI OCR Ready
            </span>
          </div>

          <div className="h2s-card" style={{ padding: '1.5rem' }}>
            <ShelfScanner 
              facilities={facilities}
              onCommitInventory={onCommitInventory}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Local Pharmacy Stock Table */}
      {activePharmacistTab === 'inventory' && (
        <div className="h2s-card">
          <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} color="#2563eb" />
              <span>Current Stock Holdings at {activeFac.name}</span>
            </div>

            {/* Hack2Skill Search Input with Return Icon */}
            <div className="h2s-search-input-wrap">
              <Search size={15} color="#94a3b8" />
              <input 
                type="text"
                placeholder="Search local stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div style={{
                background: '#f1f5f9',
                borderRadius: '4px',
                padding: '2px 5px',
                fontSize: '0.7rem',
                color: '#64748b'
              }}>
                ↵
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="h2s-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity on Shelf</th>
                  <th>Batch Number</th>
                  <th>Expiration Date</th>
                  <th>Storage Temperature</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const drugMeta = ESSENTIAL_DRUGS.find(d => d.id === item.drugId);
                  const isCritical = item.status === 'Critical Stock-Out';
                  const isSurplus = item.status === 'Surplus Near Expiry';
                  const isLow = item.status === 'Low Stock';

                  return (
                    <tr key={item.drugId}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{drugMeta?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{drugMeta?.tier}</div>
                      </td>
                      <td>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '800',
                          color: isCritical ? '#dc2626' : isLow ? '#d97706' : '#16a34a'
                        }}>
                          {item.stock} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>{drugMeta?.standardUnit}</span>
                        </div>
                      </td>
                      <td>
                        <code style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', color: '#334155' }}>
                          {item.batchNo}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}>
                          <Calendar size={13} color="#64748b" />
                          <span style={{ color: item.expiryDays < 60 && item.expiryDays > 0 ? '#d97706' : '#1e293b', fontWeight: item.expiryDays < 60 ? '700' : '500' }}>
                            {item.expiryDate !== 'N/A' ? `${item.expiryDate} (${item.expiryDays}d)` : 'Exhausted'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                          {drugMeta?.tempRequirement}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-soft ${isCritical ? 'crit' : isSurplus ? 'safe' : isLow ? 'warn' : 'safe'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inter-Facility Transfer Directives */}
      {activePharmacistTab === 'transfers' && (
        <div className="h2s-card">
          <div className="sidebar-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} color="#2563eb" />
              <span>Inter-Facility Transfer Requisitions (Government Rule 144 Protocol)</span>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {transferRouteActive ? (
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 style={{ color: '#166534', fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                    Active Transfer Directive In-Transit
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#14532d', marginBottom: '0.65rem' }}>
                    <strong>Cargo:</strong> 60 Vials of Anti-Snake Venom (Batch: ASV-23X-990)
                  </p>
                  <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: '1.6' }}>
                    • Dispatch Origin: <strong>PHC Balipatna</strong> (Surplus)<br/>
                    • Receiving Clinic: <strong>CHC Jatni</strong> (Critical Stockout Resolved)<br/>
                    • Courier Carrier: Dedicated Cryo-Bike Courier (Driver: Rabi Sahoo · +91 94372 10982)<br/>
                    • Estimated Time of Arrival: <strong>24 Minutes via NH-16 Highway</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
                <Truck size={42} style={{ margin: '0 auto 1rem', opacity: 0.35, color: '#2563eb' }} />
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                  No Active Inter-Clinic Transfer Right Now
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  When the Chief Medical Officer orders an emergency restock, dispatch orders will appear here automatically.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
