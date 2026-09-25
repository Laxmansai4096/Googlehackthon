import React, { useState } from 'react';
import { 
  ThermometerSnowflake, 
  AlertTriangle, 
  CheckCircle2, 
  BatteryCharging, 
  ZapOff, 
  Bell, 
  Send,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ColdChainSentinel({ facilities }) {
  const [facilitiesState, setFacilitiesState] = useState(facilities);
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [simulatedBreach, setSimulatedBreach] = useState(false);

  const handleSimulateOutage = () => {
    setSimulatedBreach(true);
    setFacilitiesState(prev => prev.map(f => {
      if (f.id === 'FAC-PHC-BEGUNIA') {
        return {
          ...f,
          coldChainOnline: false,
          fridgeTempC: 9.8 // Dangerous breach above 8°C!
        };
      }
      return f;
    }));
  };

  const handleRestoreGrid = () => {
    setSimulatedBreach(false);
    setAlertDispatched(false);
    setFacilitiesState(prev => prev.map(f => {
      if (f.id === 'FAC-PHC-BEGUNIA') {
        return {
          ...f,
          coldChainOnline: true,
          fridgeTempC: 4.2
        };
      }
      return f;
    }));
  };

  const handleDispatchEvacuation = () => {
    setAlertDispatched(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
      {/* Left Column: Real-time Refrigerator Telemetry */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <ThermometerSnowflake size={18} color="#38bdf8" />
            <span>District Ice-Lined Refrigerator (ILR) Telemetry Hub</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {simulatedBreach ? (
              <button 
                className="btn-secondary"
                onClick={handleRestoreGrid}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                <RefreshCw size={13} />
                <span>Restore Grid Power</span>
              </button>
            ) : (
              <button 
                className="btn-secondary"
                onClick={handleSimulateOutage}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderColor: '#ef4444', color: '#f87171' }}
              >
                <ZapOff size={13} />
                <span>Simulate Power Outage at Begunia</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Biological vaccines (Pentavalent, BCG) and Insulin must strictly remain between <strong>+2°C and +8°C</strong>. Any breach exceeding 45 minutes spoils potency permanently.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {facilitiesState.map(fac => {
              const isBreached = fac.fridgeTempC > 8.0 || fac.fridgeTempC < 2.0;
              const isWarning = fac.fridgeTempC >= 6.5 && fac.fridgeTempC <= 8.0;

              return (
                <div 
                  key={fac.id}
                  style={{
                    background: isBreached ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-surface-elevated)',
                    border: isBreached ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                      {fac.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                      Primary Cold-Box: Model ILR-300 | Backup: {fac.coldChainOnline ? 'Grid Live' : 'Battery Backup (2h Left)'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        fontFamily: 'var(--font-mono)',
                        color: isBreached ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'
                      }}>
                        {fac.fridgeTempC.toFixed(1)}°C
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        Target: 2°C - 8°C
                      </div>
                    </div>

                    <span className={`status-badge ${isBreached ? 'critical' : isWarning ? 'low' : 'safe'}`}>
                      {isBreached ? 'CRITICAL TEMP' : isWarning ? 'ELEVATED' : 'OPTIMAL'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Automated Contingency Action */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <Bell size={18} color="#ef4444" />
            <span>Cold-Chain Contingency Dispatch Engine</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: simulatedBreach ? '#ef4444' : '#10b981', fontWeight: '700' }}>
            {simulatedBreach ? 'ALARM TRIGGERED' : 'SYSTEM SECURE'}
          </span>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div>
            {simulatedBreach ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: '800', marginBottom: '0.4rem' }}>
                  <AlertTriangle size={18} />
                  <span>EMERGENCY COLD-CHAIN BREACH AT PHC BEGUNIA</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  Grid blackout detected. Refrigerator temperature has reached <strong>9.8°C</strong>. 
                  Immediate threat to <strong>18 vials of Pentavalent vaccine and 6 vials of Insulin</strong>.
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  • Nearest solar-backup facility: <strong>CHC Khordha Sub-Divisional (14.2 km)</strong><br/>
                  • Estimated safe window remaining: <strong>38 minutes before irreversible protein denaturing</strong>.
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <ShieldCheck size={28} color="#10b981" />
                <div>
                  <div style={{ fontWeight: '700', color: '#34d399', fontSize: '0.88rem' }}>
                    All ILR Cold-Boxes In Strict Thermal Range
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Continuous 15-second IoT telemetry active across 6 monitored rural clinics.
                  </div>
                </div>
              </div>
            )}

            {/* FEFO Priority Rule */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                FEFO (First-Expired, First-Out) Algorithm Active
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                System automatically sequences vaccine distribution so that stock with the earliest expiry date is consumed first, completely eliminating expired wastage.
              </p>
            </div>
          </div>

          <div>
            {simulatedBreach && (
              alertDispatched ? (
                <div style={{
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
                  fontSize: '0.85rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>Vaccine Evacuation Van Dispatched to Begunia with Portable Cryo-Box!</span>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleDispatchEvacuation}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' }}
                >
                  <Send size={15} />
                  <span>Dispatch Emergency Cryo-Van & Alert Chief Medical Officer</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
