import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Thermometer, 
  ArrowUpRight,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { ESSENTIAL_DRUGS } from '../data/mockData';

export default function InventoryTable({ 
  facility, 
  onOpenScanner,
  onOpenTransferModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');

  if (!facility) return null;

  const filteredInventory = facility.inventory.filter(item => {
    const drugMeta = ESSENTIAL_DRUGS.find(d => d.id === item.drugId);
    const matchesSearch = drugMeta?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'ALL' || item.status === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="tactical-card" style={{ height: '100%' }}>
      <div className="card-topbar">
        <div className="card-title">
          <Package size={18} color="#38bdf8" />
          <span>Live Facility Stock Ledger — {facility.name}</span>
        </div>
        <button 
          className="btn-primary"
          onClick={onOpenScanner}
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
        >
          <PlusCircle size={14} />
          <span>Digitize Stock Photo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: 'rgba(255, 255, 255, 0.01)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-surface-elevated)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          flex: '1',
          minWidth: '220px'
        }}>
          <Search size={15} color="var(--text-dim)" />
          <input 
            type="text"
            placeholder="Search medicine name, batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.85rem',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'Critical Stock-Out', 'Low Stock', 'Surplus Near Expiry', 'Safe'].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              style={{
                background: filterTier === tier ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                border: filterTier === tier ? '1px solid var(--google-blue)' : '1px solid var(--border-subtle)',
                color: filterTier === tier ? '#38bdf8' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Medicine Description</th>
              <th>Current Stock</th>
              <th>Batch No</th>
              <th>Expiry Countdown</th>
              <th>Storage Temp</th>
              <th>Status</th>
              <th>Action</th>
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
                    <div style={{ fontWeight: '700', color: '#fff' }}>{drugMeta?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Category: {drugMeta?.category}
                    </div>
                  </td>
                  <td>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#fff'
                    }}>
                      {item.stock} <span style={{ fontSize: '0.7rem', fontWeight: '400', color: 'var(--text-muted)' }}>{drugMeta?.standardUnit}</span>
                    </div>
                  </td>
                  <td>
                    <code style={{
                      background: 'rgba(255,255,255,0.06)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#cbd5e1'
                    }}>
                      {item.batchNo}
                    </code>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                      <Calendar size={13} color="var(--text-dim)" />
                      <span style={{
                        color: item.expiryDays < 60 && item.expiryDays > 0 ? '#f59e0b' : 'inherit',
                        fontWeight: item.expiryDays < 60 ? '700' : '400'
                      }}>
                        {item.expiryDate !== 'N/A' ? `${item.expiryDate} (${item.expiryDays}d)` : 'Exhausted'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: drugMeta?.tempRequirement.includes('Cold') ? '#38bdf8' : 'var(--text-muted)' }}>
                      {drugMeta?.tempRequirement}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      isCritical ? 'critical' : isSurplus ? 'surplus' : isLow ? 'low' : 'safe'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {isCritical ? (
                      <button 
                        className="btn-primary"
                        onClick={() => onOpenTransferModal(item)}
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                      >
                        Request Transfer
                      </button>
                    ) : isSurplus ? (
                      <button 
                        className="btn-secondary"
                        onClick={() => onOpenTransferModal(item)}
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderColor: '#06b6d4', color: '#38bdf8' }}
                      >
                        Offload Surplus
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Optimal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
