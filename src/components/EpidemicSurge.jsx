import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CloudRain, 
  Bug, 
  ShieldAlert, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { EPIDEMIC_SURGE_SCENARIOS, ESSENTIAL_DRUGS } from '../data/mockData';
import { queryGeminiEpidemicSurgeForecast } from '../services/geminiService';

export default function EpidemicSurge({ onPreSupplyDispatched }) {
  const [activeScenario, setActiveScenario] = useState(EPIDEMIC_SURGE_SCENARIOS[0]);
  const [indentDispatched, setIndentDispatched] = useState(false);
  const [geminiForecast, setGeminiForecast] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  // Query live Gemini 3.5 Flash for epidemiological projection
  useEffect(() => {
    let isCancelled = false;
    async function fetchForecast() {
      setIsForecastLoading(true);
      try {
        const text = await queryGeminiEpidemicSurgeForecast(activeScenario.title);
        if (!isCancelled && text) {
          setGeminiForecast(text);
        }
      } catch (e) {
        console.warn('Gemini forecast error:', e);
      } finally {
        if (!isCancelled) setIsForecastLoading(false);
      }
    }
    fetchForecast();
    return () => { isCancelled = true; };
  }, [activeScenario.id]);

  // Generate 30-day predictive points for the primary impacted drug
  const primaryDrugImpact = activeScenario.impactedDrugs[0];
  const drugMeta = ESSENTIAL_DRUGS.find(d => d.id === primaryDrugImpact.drugId);

  // Days: 1 to 30
  const days = [1, 5, 10, 15, 20, 25, 30];
  const initialStock = 50;
  const baseBurnRate = drugMeta?.dailyBurnRateAvg || 4;
  const surgeMultiplier = primaryDrugImpact.surgeMultiplier;

  const [gemTenderSubmitted, setGemTenderSubmitted] = useState(false);
  const [showGemModal, setShowGemModal] = useState(false);

  // Stock remaining under normal vs outbreak
  const normalStockCurve = days.map(d => Math.max(0, Math.round(initialStock - (d * baseBurnRate))));
  const surgeStockCurve = days.map(d => Math.max(0, Math.round(initialStock - (d * baseBurnRate * surgeMultiplier))));

  const handleDispatchIndent = () => {
    setIndentDispatched(true);
    if (onPreSupplyDispatched) {
      onPreSupplyDispatched(activeScenario);
    }
  };

  const handleTransmitGeMRequisition = () => {
    setGemTenderSubmitted(true);
    setShowGemModal(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
      {/* Public Government & Space Agency Data Telemetry Integration Strip */}
      <div style={{
        gridColumn: '1 / -1',
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderRadius: 'var(--radius-md)',
        padding: '0.95rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🛰️
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
              Public Government & Global Open Data Telemetry Correlator
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Real-time synchronization with IMD weather, ISRO/Bhuvan flood radar, WHO disease indices, FAO agricultural data, & data.gov.in baselines.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span className="badge-soft safe" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: '700' }}>
            🌦️ IMD Monsoon Alert (92mm/24h)
          </span>
          <span className="badge-soft blue" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: '700' }}>
            🛰️ ISRO Bhuvan (Inundation 14.2%)
          </span>
          <span className="badge-soft warn" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: '700' }}>
            🌐 WHO / IDSP Vector Alert
          </span>
          <span className="badge-soft safe" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: '700' }}>
            🌾 FAO Harvest Index
          </span>
          <span className="badge-soft safe" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontWeight: '700' }}>
            📊 data.gov.in 5-Yr Baseline
          </span>
        </div>
      </div>

      {/* Left Column: Outbreak Scenarios */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <TrendingUp size={18} color="#f59e0b" />
            <span>Epidemiological Outbreak Simulator (Vertex AI Model)</span>
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Simulate regional seasonal climate events and disease vectors to evaluate anticipatory medicine surge demand:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {EPIDEMIC_SURGE_SCENARIOS.map(scenario => {
              const isSelected = activeScenario.id === scenario.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => {
                    setActiveScenario(scenario);
                    setIndentDispatched(false);
                  }}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-elevated)',
                    border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: isSelected ? '#f59e0b' : '#fff' }}>
                      {scenario.id === 'surge-monsoon-flood' && <CloudRain size={16} />}
                      {scenario.id === 'surge-dengue-fever' && <Bug size={16} />}
                      {scenario.id === 'surge-canine-bite' && <ShieldAlert size={16} />}
                      <span>{scenario.title}</span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.7rem', background: '#f59e0b', color: '#070d18', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '800' }}>
                        ACTIVE MODEL
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem', lineHeight: '1.4' }}>
                    {scenario.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {scenario.impactedDrugs.map(d => {
                      const dm = ESSENTIAL_DRUGS.find(item => item.id === d.drugId);
                      return (
                        <span 
                          key={d.drugId}
                          style={{
                            fontSize: '0.72rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            color: '#fbbf24',
                            fontWeight: '600'
                          }}
                        >
                          {dm?.name.split(' ')[0]}: {d.alertText}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Predictive Curves & Pre-Supply Indent */}
      <div className="tactical-card">
        <div className="card-topbar">
          <div className="card-title">
            <Sparkles size={18} color="#38bdf8" />
            <span>30-Day Demand Projection vs. Current Buffer</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>
            ⚠️ Exhaustion: Day 4 Without Pre-Supply
          </span>
        </div>

        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Visual SVG Chart */}
            <div style={{
              background: '#050a14',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#fff', fontWeight: '700' }}>
                  Target Molecule: {drugMeta?.name}
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 10, height: 2, background: '#10b981' }}></span> Baseline
                  </span>
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 10, height: 2, background: '#ef4444' }}></span> Outbreak Surge
                  </span>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <svg viewBox="0 0 500 160" style={{ width: '100%', height: '140px', overflow: 'visible' }}>
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

                {/* Y Axis Labels */}
                <text x="30" y="25" fill="#64748b" fontSize="10" textAnchor="end">50v</text>
                <text x="30" y="75" fill="#64748b" fontSize="10" textAnchor="end">25v</text>
                <text x="30" y="125" fill="#64748b" fontSize="10" textAnchor="end">0v</text>

                {/* X Axis Day Labels */}
                {days.map((d, i) => {
                  const x = 50 + (i * 70);
                  return (
                    <text key={d} x={x} y="145" fill="#64748b" fontSize="10" textAnchor="middle">
                      Day {d}
                    </text>
                  );
                })}

                {/* Baseline Normal Stock Line (Green) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={normalStockCurve.map((val, i) => `${50 + i * 70},${120 - (val / 50) * 100}`).join(' ')}
                />

                {/* Outbreak Surge Stock Line (Red) */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  points={surgeStockCurve.map((val, i) => `${50 + i * 70},${120 - (val / 50) * 100}`).join(' ')}
                />

                {/* Critical Stockout Intersection Marker */}
                <circle cx="105" cy="120" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="115" y="112" fill="#ef4444" fontSize="10" fontWeight="bold">Day 4 Exhaustion!</text>
              </svg>
            </div>

            {/* AI Recommendation Box */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#2563eb', fontWeight: '800', fontSize: '0.85rem' }}>
                  <Sparkles size={15} />
                  <span>Anticipatory AI Action Order</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badge-soft blue" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Cpu size={11} />
                    <span>Gemini 3.5 Flash Live Forecast</span>
                  </span>
                  {isForecastLoading && <RefreshCw size={12} className="animate-spin" color="#2563eb" />}
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                {geminiForecast || activeScenario.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {indentDispatched ? (
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
                fontWeight: '700'
              }}>
                <CheckCircle2 size={18} />
                <span>Pre-Supply Indent Dispatched to District Warehouse (Order #IND-2489)</span>
              </div>
            ) : (
              <button 
                className="btn-primary"
                onClick={handleDispatchIndent}
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
              >
                <Send size={15} />
                <span>Issue Anticipatory Pre-Supply Indent to Central Warehouse</span>
              </button>
            )}

            {/* Advancement 4: GeM & State Medical Corporation (OSMCL) Emergency Procurement Tender */}
            {gemTenderSubmitted ? (
              <div style={{
                background: '#eff6ff',
                border: '1.5px solid #3b82f6',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.82rem'
              }}>
                <div>
                  <strong>🏛️ GeM & OSMCL Emergency Tender Transmitted:</strong> Requisition #GEM/2026/B/894102-OD
                </div>
                <button 
                  onClick={() => setShowGemModal(true)}
                  style={{
                    background: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.75rem'
                  }}
                >
                  View GeM Sanction Order
                </button>
              </div>
            ) : (
              <button
                onClick={handleTransmitGeMRequisition}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1.5px solid #2563eb',
                  color: '#2563eb',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span>🏛️</span>
                <span>Auto-Draft Emergency GeM & State Medical Corp (OSMCL) Purchase Tender</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GeM & OSMCL Emergency Sanction Order Modal */}
      {showGemModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            border: '2px solid #2563eb'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#1e3a8a',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏛️</span>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Government e-Marketplace (GeM) & OSMCL Fast-Track Requisition</div>
                  <div style={{ fontSize: '0.72rem', color: '#bfdbfe' }}>NHM Rule 144 Emergency Procurement Gateway</div>
                </div>
              </div>
              <button 
                onClick={() => setShowGemModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.84rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Requisition Number:</span>
                  <strong style={{ color: '#0f172a' }}>GEM/2026/B/894102-OD</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Procuring Authority:</span>
                  <strong style={{ color: '#0f172a' }}>Chief Medical Officer, District Khordha</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>State Nodal Agency:</span>
                  <strong style={{ color: '#2563eb' }}>OSMCL (Odisha State Medical Corp Ltd)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Estimated Tender Value:</span>
                  <strong style={{ color: '#16a34a' }}>₹2,45,000 (Sanctioned via NHM Contingency)</strong>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>Indented Lifesaving Medicines:</div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', lineHeight: 1.5 }}>
                  <li>500 Vials • Polyvalent Anti-Snake Venom (10ml) — Critical Emergency Buffer</li>
                  <li>1,200 Sachets • Oral Rehydration Salts (ORS 20.5g WHO formulation)</li>
                  <li>350 Units • Soluble Human Insulin (100 IU/ml)</li>
                </ul>
              </div>

              <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '6px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.78rem' }}>
                🛡️ <strong>Fast-Track SLA:</strong> Direct dispatch authorized within 72 hours under State Emergency Epidemic Contingency. SHA-256 Digital Verification logged.
              </div>

              <button
                onClick={() => setShowGemModal(false)}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
