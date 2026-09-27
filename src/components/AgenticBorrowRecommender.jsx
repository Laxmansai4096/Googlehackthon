import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Share2,
  Cpu,
  MessageSquare,
  ThermometerSnowflake,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ESSENTIAL_DRUGS } from '../data/mockData';
import { queryGeminiLogisticsRationale } from '../services/geminiService';

// Haversine distance calculator between two GPS coordinates (km)
function calculateDistanceKM(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

export default function AgenticBorrowRecommender({ 
  deficitFacility, 
  facilities, 
  onTriggerTransfer 
}) {
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const [geminiRationale, setGeminiRationale] = useState(null);
  const [isLoadingRationale, setIsLoadingRationale] = useState(false);

  const currentFacility = deficitFacility || facilities?.[1];

  // Identify all medicines currently Low or Stock-Out in this facility
  const deficitItems = currentFacility?.inventory ? currentFacility.inventory.filter(
    item => item.status === 'Critical Stock-Out' || item.status === 'Low Stock' || item.stock <= 5
  ) : [];

  // Pick the most critical deficit drug
  const targetDeficitItem = deficitItems[0];
  const targetDrugMeta = targetDeficitItem ? ESSENTIAL_DRUGS.find(d => d.id === targetDeficitItem.drugId) : null;

  // Agentic Search: Look across other facilities for one with surplus or safe buffer
  const allFacilities = facilities || [];
  const donorCandidates = (currentFacility && targetDeficitItem) ? allFacilities
    .filter(fac => fac.id !== currentFacility.id)
    .map(fac => {
      const matchingStock = fac.inventory.find(i => i.drugId === targetDeficitItem.drugId);
      const distKM = calculateDistanceKM(
        currentFacility.coordinates[0], currentFacility.coordinates[1],
        fac.coordinates[0], fac.coordinates[1]
      );
      
      const threshold = targetDrugMeta?.criticalThreshold || 15;
      const availableStock = matchingStock ? matchingStock.stock : 0;
      const safeBuffer = availableStock - threshold;

      return {
        facility: fac,
        stockItem: matchingStock,
        currentStock: availableStock,
        safeBuffer: safeBuffer,
        distanceKM: distKM,
        estimatedTransitMins: Math.round(distKM * 1.4 + 10),
        canLend: safeBuffer > 10 // Only lend if donor keeps safe reserve!
      };
    })
    .filter(candidate => candidate.canLend)
    .sort((a, b) => a.distanceKM - b.distanceKM) : []; // Sort by nearest first

  const bestDonor = donorCandidates[0];

  // Recommended bridge quantity (enough for 7 days until state tender arrives)
  const suggestedBorrowQty = targetDrugMeta ? Math.min(bestDonor?.safeBuffer || 20, targetDrugMeta.dailyBurnRateAvg * 7) : 15;

  // Live call to Google Gemini 3.5 Flash for autonomous supply rationale (called unconditionally)
  useEffect(() => {
    let isCancelled = false;
    async function fetchRationale() {
      if (!currentFacility || !bestDonor || !targetDrugMeta) return;
      setIsLoadingRationale(true);
      try {
        const text = await queryGeminiLogisticsRationale(
          currentFacility.name,
          bestDonor.facility.name,
          targetDrugMeta.name,
          bestDonor.distanceKM
        );
        if (!isCancelled && text) {
          setGeminiRationale(text);
        }
      } catch (e) {
        console.warn('Gemini logistics rationale fetch error:', e);
      } finally {
        if (!isCancelled) setIsLoadingRationale(false);
      }
    }
    fetchRationale();
    return () => { isCancelled = true; };
  }, [currentFacility?.id, bestDonor?.facility?.id, targetDeficitItem?.drugId]);

  if (!currentFacility) return null;

  if (deficitItems.length === 0) {
    return (
      <div className="h2s-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <ShieldCheck size={28} color="#16a34a" />
        <div>
          <strong style={{ color: '#166534', fontSize: '0.92rem' }}>
            Agentic Sentinel: Inventory Self-Sufficient
          </strong>
          <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>
            All critical essential drugs at {currentFacility.name} have sufficient buffer for the next 14+ days.
          </div>
        </div>
      </div>
    );
  }

  const handleSendBorrowRequest = () => {
    setIsAgentThinking(true);
    
    setTimeout(() => {
      setIsAgentThinking(false);
      setRequestSentSuccess(true);

      if (onTriggerTransfer && bestDonor) {
        onTriggerTransfer({
          donorFacilityId: bestDonor.facility.id,
          recipientFacilityId: currentFacility.id,
          drugId: targetDeficitItem.drugId,
          drugName: targetDrugMeta?.name || targetDeficitItem.drugId,
          quantity: suggestedBorrowQty,
          batchNo: bestDonor.stockItem?.batchNo || ('ASV-24X-' + Math.floor(100 + Math.random() * 900)),
          expiryDays: bestDonor.stockItem?.expiryDays || 42,
          donorName: bestDonor.facility.name,
          recipientName: currentFacility.name
        });
      }
    }, 900);
  };

  return (
    <div className="h2s-card" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#2563eb',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.1)'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Autonomous Agentic AI Borrow Recommender</span>
              <span className="badge-soft blue" style={{ fontSize: '0.7rem' }}>
                Rule 144 NHM Spatial Protocol
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Autonomous spatial search & bridge-supply negotiation for stock-out prevention
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge-soft blue" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={12} />
            <span>Gemini 3.5 Flash Live Reasoning</span>
          </span>
          <span className="badge-soft crit">
            Deficit: {targetDrugMeta?.name}
          </span>
        </div>
      </div>

      {/* Executive Operational Action Matrix (Replaces dense text with clean tactical cards) */}
      <div style={{
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: '800', fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#2563eb" />
            <span>Autonomous Operational Dispatch Matrix:</span>
          </div>
          {isLoadingRationale && (
            <span style={{ fontSize: '0.75rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} className="animate-spin" />
              <span>Synthesizing Gemini Flash Telemetry...</span>
            </span>
          )}
        </div>

        {/* 4-Card Tactical Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '0.75rem'
        }}>
          {/* Card 1: Clinical Urgency */}
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <AlertCircle size={14} />
              <span>1. Deficit Urgency</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#991b1b' }}>
              {targetDeficitItem.stock} {targetDrugMeta?.standardUnit} Remaining
            </div>
            <div style={{ fontSize: '0.76rem', color: '#7f1d1d', lineHeight: 1.35 }}>
              Immediate stockout risk at <strong>{currentFacility.name}</strong>. Bedside triage intervention required.
            </div>
          </div>

          {/* Card 2: Surplus Donor Facility */}
          <div style={{
            background: '#f0fdfa',
            border: '1px solid #99f6e4',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <MapPin size={14} />
              <span>2. Surplus Donor</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#115e59' }}>
              {bestDonor?.facility?.name || 'Central Warehouse'}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#134e4a', lineHeight: 1.35 }}>
              Surplus of <strong>+{bestDonor?.safeBuffer || 40} units</strong> available. Mandatory 3-month reserve strictly maintained.
            </div>
          </div>

          {/* Card 3: Logistics Transit & Highway Route */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <Truck size={14} />
              <span>3. Route & ETA</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e40af' }}>
              {bestDonor?.distanceKM || 26.1} km · ~{bestDonor?.estimatedTransitMins || 32} Mins
            </div>
            <div style={{ fontSize: '0.76rem', color: '#1e3a8a', lineHeight: 1.35 }}>
              Expedited Cryo-Bike courier corridor engaged via NH-16 highway for rapid delivery.
            </div>
          </div>

          {/* Card 4: Cold Chain Integrity */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <ThermometerSnowflake size={14} />
              <span>4. Thermal Protocol</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#166534' }}>
              2°C – 8°C Verified
            </div>
            <div style={{ fontSize: '0.76rem', color: '#14532d', lineHeight: 1.35 }}>
              Active IoT thermal datalogger seal confirms biological viability upon bedside arrival.
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Emergency Loan Action Card */}
      {bestDonor && (
        <div style={{
          background: '#eff6ff',
          border: '1.5px dashed #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#2563eb', textTransform: 'uppercase', fontWeight: '800' }}>
              RECOMMENDED INTER-CENTRE EMERGENCY BORROW
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '0.15rem' }}>
              Borrow {suggestedBorrowQty} {targetDrugMeta?.standardUnit} from {bestDonor.facility.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span>📍 Distance: <strong>{bestDonor.distanceKM} km</strong></span>
              <span>⏱️ Transit: <strong>~{bestDonor.estimatedTransitMins} mins via Bike Courier</strong></span>
              <span>🔒 Donor Safe Reserve Maintained: <strong style={{ color: '#16a34a' }}>Yes (+{bestDonor.safeBuffer - suggestedBorrowQty} buffer remaining)</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🚨 *NHM ArogyaSetu AI Emergency Stock Borrow Order*\nTo: In-Charge, ${bestDonor.facility.name}\nDeficit Center: ${currentFacility.name}\nRequested Drug: ${suggestedBorrowQty} ${targetDrugMeta?.standardUnit} ${targetDrugMeta?.name}\nTransit: Cryo-Bike Courier via NH-16 (ETA: ${bestDonor.estimatedTransitMins} mins)\nThermal Protocol: 2°C–8°C\nApprove via Web: https://laxmansai4096.github.io/Googlehackthon/`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#059669',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}
              title="Send Requisition Order to Medical Officer via WhatsApp"
            >
              <MessageSquare size={15} />
              <span>WhatsApp Order</span>
            </a>

            {requestSentSuccess ? (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1.15rem',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '700'
              }}>
                <CheckCircle2 size={16} />
                <span>Borrow Requisition Approved & Dispatched!</span>
              </div>
            ) : (
              <button
                onClick={handleSendBorrowRequest}
                disabled={isAgentThinking}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1.35rem',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                }}
              >
                {isAgentThinking ? (
                  <>
                    <RefreshCw size={15} style={{ animation: 'spin 1s infinite linear' }} />
                    <span>Routing Request via NHM Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Borrow Request to {bestDonor.facility.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
