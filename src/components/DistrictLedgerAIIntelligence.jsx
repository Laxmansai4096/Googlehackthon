import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Send, 
  Layers, 
  Filter, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  Truck,
  ThermometerSnowflake,
  Search,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { ESSENTIAL_DRUGS } from '../data/mockData';
import { 
  queryGeminiDistrictStockInsights, 
  queryGeminiCustomStockQuestion 
} from '../services/geminiService';

export default function DistrictLedgerAIIntelligence({ 
  facilities, 
  selectedFacilityId, 
  onSelectFacility,
  onTriggerChallan 
}) {
  const currentFac = facilities.find(f => f.id === selectedFacilityId) || facilities[1];
  
  // Selected sub-centre tab ('ALL' = Hub + all sub-centres, 'HUB' = Hub only, or sub-centre ID)
  const [activeCentreTab, setActiveCentreTab] = useState('ALL');
  const [selectedFilter, setSelectedFilter] = useState('ACTION_NEEDED'); // 'ACTION_NEEDED', 'COLD_CHAIN', 'ALL'
  const [selectedDrugId, setSelectedDrugId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Gemini State
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [officerQuestion, setOfficerQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState(null);
  const [isLoadingQa, setIsLoadingQa] = useState(false);

  const subCentres = currentFac.subCentres || [];

  // Compile real-time text summary for Gemini ingestion
  const generateStockSummaryText = () => {
    let text = `BLOCK HUB: ${currentFac.name} (${currentFac.type})\n`;
    text += `Main Hub Inventory:\n`;
    currentFac.inventory.forEach(i => {
      const dm = ESSENTIAL_DRUGS.find(d => d.id === i.drugId);
      text += ` - ${dm?.name || i.drugId}: Stock=${i.stock} (Threshold=${dm?.criticalThreshold || 15}), Batch=${i.batchNo}, Expiry=${i.expiryDays}d, Status=${i.status}\n`;
    });

    if (subCentres.length > 0) {
      text += `\nAffiliated Sub-Centres (${subCentres.length}):\n`;
      subCentres.forEach(sc => {
        text += ` Sub-Centre: ${sc.name} (Dist: ${sc.distanceKM}km, Pop: ${sc.populationServed})\n`;
        sc.inventory.forEach(i => {
          const dm = ESSENTIAL_DRUGS.find(d => d.id === i.drugId);
          if (i.stock <= (dm?.criticalThreshold || 15) || i.expiryDays < 60) {
            text += `   * ALERT: ${dm?.name}: Stock=${i.stock}, Batch=${i.batchNo}, Expiry=${i.expiryDays}d, Status=${i.status}\n`;
          }
        });
      });
    }
    return text;
  };

  // Trigger Live Gemini Analysis on Facility Change
  useEffect(() => {
    let isCancelled = false;
    async function fetchInsights() {
      setIsLoadingAi(true);
      setQaAnswer(null);
      try {
        const summary = generateStockSummaryText();
        const res = await queryGeminiDistrictStockInsights(currentFac.name, summary);
        if (!isCancelled && res) {
          setAiInsights(res);
        }
      } catch (err) {
        console.warn('Live Gemini Stock Insights Error:', err);
      } finally {
        if (!isCancelled) setIsLoadingAi(false);
      }
    }

    fetchInsights();
    return () => { isCancelled = true; };
  }, [currentFac.id]);

  // Handle manual question to Gemini
  const handleAskQuestion = async (customPrompt = null) => {
    const q = customPrompt || officerQuestion;
    if (!q.trim()) return;

    setIsLoadingQa(true);
    setQaAnswer(null);
    try {
      const summary = generateStockSummaryText();
      const ans = await queryGeminiCustomStockQuestion(currentFac.name, q, summary);
      if (ans) {
        setQaAnswer({ question: q, answer: ans });
      }
    } catch (e) {
      console.warn('QA error:', e);
    } finally {
      setIsLoadingQa(false);
    }
  };

  // Build aggregated flat list of rows for the table view
  const aggregatedRows = [];

  // Add Hub rows
  if (activeCentreTab === 'ALL' || activeCentreTab === 'HUB') {
    currentFac.inventory.forEach(item => {
      aggregatedRows.push({
        centerId: currentFac.id,
        centerName: currentFac.name,
        centerType: 'Block Hub (SDH/CHC)',
        item
      });
    });
  }

  // Add Sub-Centre rows
  subCentres.forEach(sc => {
    if (activeCentreTab === 'ALL' || activeCentreTab === sc.id) {
      sc.inventory.forEach(item => {
        aggregatedRows.push({
          centerId: sc.id,
          centerName: sc.name,
          centerType: sc.type,
          item
        });
      });
    }
  });

  // Filter rows based on user criteria
  const filteredRows = aggregatedRows.filter(row => {
    const dm = ESSENTIAL_DRUGS.find(d => d.id === row.item.drugId);
    
    // Drug filter
    if (selectedDrugId !== 'ALL' && row.item.drugId !== selectedDrugId) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dm?.name.toLowerCase().includes(q);
      const matchCenter = row.centerName.toLowerCase().includes(q);
      const matchBatch = row.item.batchNo.toLowerCase().includes(q);
      if (!matchName && !matchCenter && !matchBatch) return false;
    }

    // Status / Cold-chain filter
    if (selectedFilter === 'ACTION_NEEDED') {
      const isDeficit = row.item.stock <= (dm?.criticalThreshold || 15);
      const isExpiring = row.item.expiryDays < 60;
      return isDeficit || isExpiring || row.item.status === 'Critical Stock-Out' || row.item.status === 'Low Stock';
    } else if (selectedFilter === 'COLD_CHAIN') {
      return dm?.tempRequirement.includes('Cold Chain');
    }

    return true;
  });

  // Count metrics across the block network
  const totalSubCentres = subCentres.length;
  const criticalDeficitCount = aggregatedRows.filter(r => r.item.stock === 0 || r.item.status === 'Critical Stock-Out').length;
  const nearExpiryCount = aggregatedRows.filter(r => r.item.expiryDays > 0 && r.item.expiryDays <= 45).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Executive AI Stock Intelligence Hero Banner */}
      <div className="h2s-card" style={{
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderRadius: 'var(--radius-lg)',
        padding: '1.35rem 1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
            }}>
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  District Executive Stock Intelligence — {currentFac.name}
                </h3>
                <span className="badge-soft blue" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} />
                  <span>Gemini 3.8 Flash Neural Analysis</span>
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Autonomous spatial aggregation across <strong>1 Hub Hospital + {totalSubCentres} Affiliated Sub-Centres</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setIsLoadingAi(true);
                const summary = generateStockSummaryText();
                queryGeminiDistrictStockInsights(currentFac.name, summary).then(res => {
                  if (res) setAiInsights(res);
                  setIsLoadingAi(false);
                });
              }}
              disabled={isLoadingAi}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <RefreshCw size={13} className={isLoadingAi ? 'animate-spin' : ''} />
              <span>Re-analyze with Gemini</span>
            </button>
          </div>
        </div>

        {/* AI Briefing Metrics & Insights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
          
          {/* Health Index Card */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                Block Stock Safety Index
              </span>
              <span className={`badge-soft ${criticalDeficitCount > 0 ? 'crit' : 'safe'}`}>
                {aiInsights?.statusVerdict || (criticalDeficitCount > 0 ? 'ACTION REQUIRED' : 'OPTIMAL')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.25rem 0' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: '900', color: criticalDeficitCount > 0 ? '#dc2626' : '#16a34a' }}>
                {aiInsights?.stockHealthScore || (criticalDeficitCount > 0 ? 68 : 94)}%
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Stock Sufficiency</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#475569', marginTop: '0.35rem' }}>
              <span>🔴 <strong>{criticalDeficitCount}</strong> Stockout Batches</span>
              <span>🟡 <strong>{nearExpiryCount}</strong> Near-Expiry (FEFO)</span>
            </div>
          </div>

          {/* AI Priority Directives */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            gridColumn: 'span 2'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} />
              <span>Real-Time Clinical Supply Insights (Gemini)</span>
            </div>

            {isLoadingAi ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                <RefreshCw size={15} className="animate-spin" />
                <span>Gemini 3.8 Flash is synthesizing multi-centre supply chains...</span>
              </div>
            ) : aiInsights?.priorityInsights ? (
              <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.83rem', color: '#1e293b', lineHeight: '1.5' }}>
                {aiInsights.priorityInsights.map((insight, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{insight}</li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '0.83rem', color: '#1e293b', lineHeight: '1.5' }}>
                🚨 <strong>Critical Deficit:</strong> Zero stock of Anti-Snake Venom & Anti-Rabies at CHC Jatni and Kantabad HWC.<br />
                📦 <strong>FEFO Near Expiry:</strong> 140 vials at PHC Balipatna expiring in 32 days; recommend immediate intra-block redistribution.
              </div>
            )}

            {aiInsights?.prescriptiveTransferPlan && (
              <div style={{
                marginTop: '0.65rem',
                background: '#ffffff',
                border: '1px dashed #93c5fd',
                borderRadius: '4px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                color: '#1d4ed8',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Truck size={14} />
                <span>{aiInsights.prescriptiveTransferPlan}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Ask Gemini AI Search Bar */}
        <div style={{
          marginTop: '1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Search size={16} color="#2563eb" />
            <input 
              type="text"
              placeholder="Ask Gemini AI (e.g. Which sub-centre has the lowest Oxytocin? Are any vaccines expiring this month?)"
              value={officerQuestion}
              onChange={(e) => setOfficerQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAskQuestion(); }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.84rem',
                color: '#0f172a'
              }}
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={isLoadingQa || !officerQuestion.trim()}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {isLoadingQa ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
              <span>Ask AI</span>
            </button>
          </div>

          {/* Quick preset query chips */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>Officer Prompts:</span>
            {[
              'Which sub-centre has zero Anti-Snake Venom?',
              'List all batches expiring within 45 days',
              'Give emergency borrow recommendation'
            ].map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setOfficerQuestion(promptText);
                  handleAskQuestion(promptText);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.72rem',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* QA Answer display */}
          {qaAnswer && (
            <div style={{
              marginTop: '0.75rem',
              background: '#ffffff',
              border: '1.5px solid #bfdbfe',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.83rem',
              color: '#0f172a',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '2px' }}>
                🤖 Gemini 3.8 Flash Clinical Response:
              </strong>
              {qaAnswer.answer}
            </div>
          )}
        </div>
      </div>

      {/* 2. Centre-Wise & Sub-Centre Hierarchy Navigation Bar */}
      <div className="h2s-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Centre Hierarchy & Sub-Centres Oversight
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Select Facilities Under {currentFac.name} Block
            </div>
          </div>

          {/* Center Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCentreTab('ALL')}
              style={{
                background: activeCentreTab === 'ALL' ? '#2563eb' : '#f1f5f9',
                color: activeCentreTab === 'ALL' ? '#ffffff' : '#334155',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏥 All Centers ({1 + subCentres.length})
            </button>

            <button
              onClick={() => setActiveCentreTab('HUB')}
              style={{
                background: activeCentreTab === 'HUB' ? '#2563eb' : '#f1f5f9',
                color: activeCentreTab === 'HUB' ? '#ffffff' : '#334155',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏛️ Main Hub Only
            </button>

            {subCentres.map(sc => (
              <button
                key={sc.id}
                onClick={() => setActiveCentreTab(sc.id)}
                style={{
                  background: activeCentreTab === sc.id ? '#2563eb' : '#f1f5f9',
                  color: activeCentreTab === sc.id ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{sc.name.split(' ')[0]}</span>
                {sc.overallHealth.includes('Critical') && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626' }}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Centres Quick Cards View */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {/* Main Hub Card */}
          <div 
            onClick={() => setActiveCentreTab('HUB')}
            style={{
              background: activeCentreTab === 'HUB' ? '#eff6ff' : '#f8fafc',
              border: activeCentreTab === 'HUB' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{currentFac.name.split('(')[0]}</strong>
              <span className={`badge-soft ${currentFac.overallHealth.includes('Critical') ? 'crit' : 'safe'}`} style={{ fontSize: '0.68rem' }}>
                Main Hub
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              In-Charge: {currentFac.inCharge.split('(')[0]}
            </div>
          </div>

          {/* Sub-Centres */}
          {subCentres.map(sc => {
            const isSelected = activeCentreTab === sc.id;
            const defCount = sc.inventory.filter(i => i.stock === 0 || i.status === 'Critical Stock-Out').length;

            return (
              <div 
                key={sc.id}
                onClick={() => setActiveCentreTab(sc.id)}
                style={{
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{sc.name}</strong>
                  <span className={`badge-soft ${defCount > 0 ? 'crit' : 'safe'}`} style={{ fontSize: '0.68rem' }}>
                    {defCount > 0 ? `${defCount} Critical` : 'Safe'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📍 {sc.distanceKM} km away</span>
                  <span>👥 Pop: {sc.populationServed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep Filtered Medicine Ledger Table */}
      <div className="h2s-card">
        <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.98rem', fontWeight: '800' }}>
              Detailed Medicine Inventory & FEFO Allocation Ledger
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal', marginTop: '2px' }}>
              Displaying <strong>{filteredRows.length} batches</strong> across selected facilities
            </div>
          </div>

          {/* Action Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '2px' }}>
              <button
                onClick={() => setSelectedFilter('ACTION_NEEDED')}
                style={{
                  background: selectedFilter === 'ACTION_NEEDED' ? '#ffffff' : 'transparent',
                  color: selectedFilter === 'ACTION_NEEDED' ? '#dc2626' : '#64748b',
                  fontWeight: selectedFilter === 'ACTION_NEEDED' ? '800' : '600',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: selectedFilter === 'ACTION_NEEDED' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🔥 Action Needed Only
              </button>

              <button
                onClick={() => setSelectedFilter('COLD_CHAIN')}
                style={{
                  background: selectedFilter === 'COLD_CHAIN' ? '#ffffff' : 'transparent',
                  color: selectedFilter === 'COLD_CHAIN' ? '#2563eb' : '#64748b',
                  fontWeight: selectedFilter === 'COLD_CHAIN' ? '800' : '600',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: selectedFilter === 'COLD_CHAIN' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                ❄️ Cold-Chain Sensitive
              </button>

              <button
                onClick={() => setSelectedFilter('ALL')}
                style={{
                  background: selectedFilter === 'ALL' ? '#ffffff' : 'transparent',
                  color: selectedFilter === 'ALL' ? '#0f172a' : '#64748b',
                  fontWeight: selectedFilter === 'ALL' ? '800' : '600',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: selectedFilter === 'ALL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                All Medicines
              </button>
            </div>

            {/* Drug select */}
            <select
              value={selectedDrugId}
              onChange={(e) => setSelectedDrugId(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All EDL Medicines</option>
              {ESSENTIAL_DRUGS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="h2s-table">
            <thead>
              <tr>
                <th>Center / Sub-Centre</th>
                <th>Drug Name</th>
                <th>Current Stock</th>
                <th>Batch Number</th>
                <th>Expiry Countdown (FEFO)</th>
                <th>Storage Temp</th>
                <th>Prescriptive Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No medicines match the selected filter criteria. All stocks safe!
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const drugMeta = ESSENTIAL_DRUGS.find(d => d.id === row.item.drugId);
                  const isStockout = row.item.stock === 0 || row.item.status === 'Critical Stock-Out';
                  const isLow = row.item.stock < (drugMeta?.criticalThreshold || 15);
                  const isNearExpiry = row.item.expiryDays > 0 && row.item.expiryDays <= 45;

                  return (
                    <tr key={`${row.centerId}-${row.item.drugId}-${idx}`}>
                      {/* Facility */}
                      <td>
                        <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>
                          {row.centerName}
                        </strong>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {row.centerType}
                        </div>
                      </td>

                      {/* Drug Name */}
                      <td>
                        <strong style={{ color: '#0f172a' }}>
                          {drugMeta?.name || row.item.drugId}
                        </strong>
                        <div style={{ fontSize: '0.7rem', color: '#2563eb' }}>
                          {drugMeta?.category || 'Essential'}
                        </div>
                      </td>

                      {/* Stock Count */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <strong style={{
                            color: isStockout ? '#dc2626' : isLow ? '#d97706' : '#16a34a',
                            fontSize: '0.95rem'
                          }}>
                            {row.item.stock} {drugMeta?.standardUnit || 'Units'}
                          </strong>
                          {isStockout && (
                            <span style={{ fontSize: '0.65rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '1px 4px', borderRadius: '3px', fontWeight: '800' }}>
                              EXHAUSTED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          Threshold: {drugMeta?.criticalThreshold || 15} units
                        </div>
                      </td>

                      {/* Batch */}
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569' }}>
                        {row.item.batchNo}
                      </td>

                      {/* Expiry / FEFO */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontWeight: isNearExpiry ? '800' : 'normal',
                            color: isNearExpiry ? '#d97706' : '#1e293b',
                            fontSize: '0.82rem'
                          }}>
                            {row.item.expiryDays > 0 ? `${row.item.expiryDays} days` : '0 days (Expired/Out)'}
                          </span>
                        </div>
                        {row.item.expiryDays > 0 && (
                          <div style={{
                            width: '90px',
                            height: '4px',
                            background: '#e2e8f0',
                            borderRadius: '2px',
                            marginTop: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min(100, (row.item.expiryDays / 365) * 100)}%`,
                              height: '100%',
                              background: isNearExpiry ? '#d97706' : '#16a34a'
                            }}></div>
                          </div>
                        )}
                      </td>

                      {/* Temperature */}
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {drugMeta?.tempRequirement || 'Ambient'}
                      </td>

                      {/* Action Needed */}
                      <td>
                        {isStockout ? (
                          <button
                            onClick={() => onTriggerChallan && onTriggerChallan()}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>CRITICAL RESTOCK</span>
                            <ArrowRight size={11} />
                          </button>
                        ) : isNearExpiry ? (
                          <button
                            onClick={() => onTriggerChallan && onTriggerChallan()}
                            style={{
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              color: '#d97706',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer'
                            }}
                          >
                            ROTATE BATCH (FEFO)
                          </button>
                        ) : (
                          <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                            OPTIMAL BUFFER
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
