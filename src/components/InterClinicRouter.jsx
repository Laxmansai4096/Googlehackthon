import React, { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  HeartHandshake,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InterClinicRouter({ 
  facilities, 
  transferRouteActive, 
  onTriggerTransfer,
  onResetTransfer 
}) {
  const [transitStep, setTransitStep] = useState(transferRouteActive ? 'dispatched' : 'idle');

  const handleStartTransfer = () => {
    setTransitStep('dispatched');
    onTriggerTransfer();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
      {/* Left Column: Inter-Facility Balancing Engine */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <Truck size={18} color="#06b6d4" />
            <span>Dynamic Inter-Clinic Redistribution Router (FEFO Matcher)</span>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
            Zero-Waste Optimization
          </span>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            ArogyaSetu AI cross-references expiry dates across rural facilities to re-route near-expiry stock from low-consumption clinics to emergency deficit zones.
          </div>

          {/* Transfer Visual Match Card */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Origin Facility (Surplus) */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <span style={{ fontSize: '0.7rem', color: '#06b6d4', textTransform: 'uppercase', fontWeight: '800' }}>
                  SURPLUS DONOR FACILITY
                </span>
                <div style={{ fontWeight: '800', color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>
                  PHC Balipatna
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Has 140 vials expiring in <strong style={{ color: '#f59e0b' }}>32 days</strong>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                  Surplus Detected
                </div>
              </div>

              {/* Transfer Arrow & Cargo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fff', background: 'rgba(255,255,255,0.08)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', marginBottom: '0.35rem' }}>
                  60 Vials ASV
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#06b6d4' }}>
                  <span style={{ width: '30px', height: '2px', background: '#06b6d4' }}></span>
                  <Truck size={18} />
                  <span style={{ width: '30px', height: '2px', background: '#06b6d4' }}></span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  28.4 km / 32 mins
                </div>
              </div>

              {/* Destination Facility (Deficit) */}
              <div style={{ flex: 1, minWidth: '180px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: '800' }}>
                  EMERGENCY DEFICIT RECEIVER
                </span>
                <div style={{ fontWeight: '800', color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>
                  CHC Jatni
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.2rem' }}>
                  Current Stock: <strong>0 Vials (Exhausted)</strong>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                  Immediate Risk
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {transferRouteActive || transitStep === 'dispatched' ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                flex: 1,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                <CheckCircle2 size={18} />
                <span>Cold-Box Courier En-Route via NH-16 (ETA: 24 mins)</span>
              </div>

              <button 
                className="btn-secondary"
                onClick={() => {
                  setTransitStep('idle');
                  onResetTransfer();
                }}
                style={{ fontSize: '0.78rem' }}
                title="Reset simulation"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary"
              onClick={handleStartTransfer}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              <Truck size={17} />
              <span>Authorize & Dispatch Cold-Box Courier (Work Order #WO-891)</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Quantitative Impact Analysis */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <HeartHandshake size={18} color="#10b981" />
            <span>Projected Socio-Economic Impact</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
            Verified Value Creation
          </span>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Impact Metric 1 */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Lives Protected
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  60 Potential Victims
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Restores 24/7 venom resuscitation coverage to 1,20,000 residents in Jatni block.
                </div>
              </div>
            </div>

            {/* Impact Metric 2 */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Pharmaceutical Loss Salvaged
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹39,000 INR
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Prevented 60 vials from expiring on Balipatna shelf without consumption.
                </div>
              </div>
            </div>

            {/* Impact Metric 3 */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Response Time Compression
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  32 Mins <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>vs 14 Days</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Overcomes standard central tender indent cycle delay.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
