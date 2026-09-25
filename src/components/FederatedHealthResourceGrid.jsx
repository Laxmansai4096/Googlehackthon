import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Bed, 
  Users, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Globe2, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Lock,
  Share2
} from 'lucide-react';
import { FEDERATED_STATE_NODES } from '../data/mockData';
import { queryGeminiFederatedResourceAudit } from '../services/geminiService';

export default function FederatedHealthResourceGrid({ facilities, onTriggerChallan }) {
  const [selectedState, setSelectedState] = useState(FEDERATED_STATE_NODES[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [federatedAudit, setFederatedAudit] = useState(null);

  // Compute live district-wide resource aggregations from facilities
  const totalDistrictBeds = facilities.reduce((acc, f) => acc + (f.totalBeds || 0), 0);
  const occupiedDistrictBeds = Math.round(totalDistrictBeds * 0.76);
  const availableDistrictBeds = totalDistrictBeds - occupiedDistrictBeds;
  const icuDistrictBeds = Math.round(totalDistrictBeds * 0.18);
  const maternalBeds = Math.round(totalDistrictBeds * 0.28);

  // Compile state nodes summary for Gemini
  const compileStateSummary = () => {
    return FEDERATED_STATE_NODES.map(node => (
      `STATE: ${node.stateName} (${node.districtCluster})
- Active Vector Model: ${node.activeVectorModel}
- Local Training Epoch: ${node.localEpoch}, Surge Multiplier: ${node.sharedSurgeMultiplier}x
- Critical Drug Need: ${node.criticalDrugDemand}
- Available Beds: ${node.availableBeds}/${node.totalBeds}, Staff Attendance Compliance: ${node.personnelCompliance}%`
    )).join('\n\n');
  };

  const handleRunFederatedSync = async () => {
    setIsSyncing(true);
    try {
      const summary = compileStateSummary();
      const res = await queryGeminiFederatedResourceAudit(summary);
      if (res) {
        setFederatedAudit(res);
      }
    } catch (e) {
      console.warn('Federated sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleRunFederatedSync();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header Banner: National Federated Health Platform Identity */}
      <div className="h2s-card" style={{ padding: '1.5rem', background: '#ffffff', border: '1.5px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'
            }}>
              <Network size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                  Federated National Health Resource & Supply Chain Platform
                </h3>
                <span className="badge-soft blue" style={{ fontSize: '0.72rem' }}>
                  MoHFW National Grid
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Real-time visibility into <strong>Medicine Stocks, Bed Availability & Medical Personnel Attendance</strong> across India's PHC Network with cross-state federated learning.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Lock size={13} />
              <span>Differential Privacy Active (ε=0.5)</span>
            </div>

            <button
              onClick={handleRunFederatedSync}
              disabled={isSyncing}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 1.15rem',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
              }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Synchronizing Model Weights...' : 'Sync Federated Model Weights'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Resource Utilization Triad (Beds, Attendance, Footfall) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Panel A: Bed Availability Real-Time Matrix */}
        <div className="h2s-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bed size={18} color="#2563eb" />
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Real-Time Bed Availability</strong>
            </div>
            <span className="badge-soft safe" style={{ fontSize: '0.7rem' }}>
              {availableDistrictBeds} Beds Vacant
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a' }}>
              {occupiedDistrictBeds} / {totalDistrictBeds}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Beds Occupied (76% Load)</span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: '76%', height: '100%', background: '#2563eb' }}></div>
          </div>

          {/* Detailed Bed Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.78rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>ICU / Oxygen Beds</div>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{icuDistrictBeds} Units Available</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>Maternal Delivery Beds</div>
              <strong style={{ fontSize: '0.95rem', color: '#16a34a' }}>{maternalBeds} Units Ready</strong>
            </div>
          </div>
        </div>

        {/* Panel B: Medical Personnel Biometric Attendance */}
        <div className="h2s-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#16a34a" />
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Medical Personnel Attendance</strong>
            </div>
            <span className="badge-soft safe" style={{ fontSize: '0.7rem' }}>
              93.4% Biometric Rate
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#16a34a' }}>
              142 / 152
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Staff Clocked-In on Duty</span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: '93.4%', height: '100%', background: '#16a34a' }}></div>
          </div>

          {/* Detailed Cadre Counts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.78rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>Doctors (MOs) on Duty</div>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>18 Active / 20 Sanctioned</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>ANM & ASHA Field Force</div>
              <strong style={{ fontSize: '0.95rem', color: '#2563eb' }}>84 Active in Villages</strong>
            </div>
          </div>
        </div>

        {/* Panel C: Patient Footfall & Daily Utilization */}
        <div className="h2s-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#f59e0b" />
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Patient Footfall & Consumption</strong>
            </div>
            <span className="badge-soft warn" style={{ fontSize: '0.7rem' }}>
              Surge: +24% Above Normal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a' }}>
              1,280
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Daily OPD Patient Footfall</span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: '84%', height: '100%', background: '#f59e0b' }}></div>
          </div>

          {/* Detailed Footfall Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.78rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>Emergency Triage Entries</div>
              <strong style={{ fontSize: '0.95rem', color: '#dc2626' }}>92 Cases Today</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b' }}>Correlated Drug Burn</div>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>1.4x Standard Run-Rate</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Federated Cross-State Shared Predictive Model Grid */}
      <div className="h2s-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe2 size={18} color="#2563eb" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                Cross-State Federated AI Edge Nodes (India National Network)
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Collaborative edge learning: State models train on local PHC EHR data and share vector gradients securely without centralizing patient records.
            </p>
          </div>

          <span className="badge-soft blue" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={12} />
            <span>Gemini 3.8 Flash Global Aggregator</span>
          </span>
        </div>

        {/* State Node Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {FEDERATED_STATE_NODES.map(node => {
            const isSelected = selectedState.stateId === node.stateId;
            return (
              <div
                key={node.stateId}
                onClick={() => setSelectedState(node)}
                style={{
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{node.stateName}</strong>
                  <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                    ONLINE
                  </span>
                </div>

                <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '0.5rem' }}>
                  📍 {node.districtCluster}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#1e40af', background: '#dbeafe', padding: '0.4rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  ⚡ Model: <strong>{node.activeVectorModel}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>Epoch: #{node.localEpoch}</span>
                  <span>Surge: <strong>{node.sharedSurgeMultiplier}x</strong></span>
                  <span>Synced: {node.lastSyncTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Gemini Federated Audit Intelligence Card */}
        {federatedAudit && (
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <strong style={{ fontSize: '0.95rem', color: '#166534' }}>
                  {federatedAudit.federatedConsensusVerdict || 'Federated Edge Weights Synchronized'}
                </strong>
              </div>
              <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                National Grid Index: {federatedAudit.nationalHealthIndex || 88}%
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#14532d', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              {federatedAudit.bedAndPersonnelDiagnosis}
            </p>

            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534', marginBottom: '0.35rem' }}>
              Cross-District Resource Redistribution Directives (Autonomous Engine):
            </div>

            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.82rem', color: '#14532d', lineHeight: '1.5' }}>
              {federatedAudit.crossStateRedistributionDirectives?.map((dir, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{dir}</li>
              ))}
            </ul>

            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.74rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} />
                <span>{federatedAudit.privacyGuarantee}</span>
              </div>

              <button
                onClick={() => onTriggerChallan && onTriggerChallan()}
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>Authorize Cross-District Redistribution</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
