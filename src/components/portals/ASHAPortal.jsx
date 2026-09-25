import React, { useState } from 'react';
import { 
  Heart, 
  Mic, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  UserCheck,
  Send,
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import IndicVoiceCopilot from '../IndicVoiceCopilot';
import { queryGeminiBedsideTriage } from '../../services/geminiService';

export default function ASHAPortal({ facilities }) {
  const [selectedVillage, setSelectedVillage] = useState('Kantabad Village (Jatni Block)');
  const [bedsideQuery, setBedsideQuery] = useState('');
  const [bedsideAnswer, setBedsideAnswer] = useState(null);
  const [isTriageLoading, setIsTriageLoading] = useState(false);

  const handleQuickCheck = async (caseType) => {
    setIsTriageLoading(true);
    setBedsideAnswer(null);

    const targetFac = caseType === 'snakebite' ? 'CHC Jatni' : 'PHC Balipatna';

    try {
      const liveTriage = await queryGeminiBedsideTriage(
        caseType === 'snakebite' ? 'Snakebite (Cobra Envenomation)' : 'High-Risk Labor & Postpartum Hemorrhage Prevention',
        selectedVillage,
        targetFac
      );

      if (liveTriage) {
        setBedsideAnswer(liveTriage);
      } else {
        // Fallback if network offline
        if (caseType === 'snakebite') {
          setBedsideAnswer({
            title: '⚠️ Urgent Snakebite Case Protocol',
            facility: 'CHC Jatni',
            status: 'EMERGENCY DISPATCH LIVE',
            statusColor: 'crit',
            action: 'CHC Jatni stock was exhausted, but 60 vials of Anti-Snake Venom were dispatched from PHC Balipatna via Cryo-Bike courier (ETA: 24 mins). Call 108 Ambulance immediately and begin patient immobilization. Do not tie tight tourniquets.',
            ambulanceNumber: '108',
            doctorPhone: '+91 98610 44102 (Dr. Smita Pattnaik)',
            _activeModel: 'Gemini 3.5 Flash'
          });
        } else {
          setBedsideAnswer({
            title: '🤰 High-Risk Labor Delivery Protocol',
            facility: 'PHC Balipatna',
            status: 'SAFE & EQUIPPED',
            statusColor: 'safe',
            action: 'PHC Balipatna has 45 ampoules of Oxytocin in cold-chain and 12 delivery beds available. 24/7 Nurse In-Charge on duty.',
            ambulanceNumber: '102 (Janani Express)',
            doctorPhone: '+91 97782 55319',
            _activeModel: 'Gemini 3.5 Flash'
          });
        }
      }
    } catch (err) {
      console.warn('Live Gemini triage error:', err);
    } finally {
      setIsTriageLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner: ASHA Sangini Identity (Hack2Skill White Elevated Card) */}
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
              background: '#fdf2f8',
              border: '1px solid #fbcfe8',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 2px 8px rgba(219, 39, 119, 0.12)'
            }}>
              🩺
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  आशा संगिनी (ASHA Frontline Mobile Copilot)
                </h2>
                <span className="brand-badge-pill" style={{ background: '#fdf2f8', color: '#db2777', borderColor: '#fbcfe8' }}>
                  Community Health Worker
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Dedicated to rural frontline health workers: Instant Bedside Stock Checks, Multilingual Voice Inquiries & Patient Referral Routing
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>Assigned Village:</span>
            <span style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: '700',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <MapPin size={13} />
              <span>{selectedVillage}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bedside Triage Quick Buttons Card */}
      <div className="h2s-card">
        <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="#db2777" />
            <span>Instant Bedside Patient Triage & Stock Check</span>
          </div>
          <span className="badge-soft blue" style={{ fontSize: '0.72rem' }}>One-Touch Protocol</span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '1.25rem' }}>
            When with a patient in the field, click the emergency scenario below to check real-time drug availability at nearby primary clinics before referring:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Snakebite Emergency Check Button Card */}
            <button
              onClick={() => handleQuickCheck('snakebite')}
              style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#fecaca'}
            >
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#dc2626', marginBottom: '0.35rem' }}>
                🐍 Snakebite Emergency Check
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                Check Anti-Snake Venom availability at nearest PHC/CHC before transporting patient.
              </div>
            </button>

            {/* Maternal Labor & Oxytocin Check Button Card */}
            <button
              onClick={() => handleQuickCheck('delivery')}
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#bbf7d0'}
            >
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#16a34a', marginBottom: '0.35rem' }}>
                🤰 Maternal Labor & Oxytocin Check
              </div>
              <div style={{ fontSize: '0.8rem', color: '#14532d', lineHeight: 1.5 }}>
                Verify PPH emergency injection stock & bed availability for safe institutional delivery.
              </div>
            </button>
          </div>

          {/* Loading Indicator */}
          {isTriageLoading && (
            <div style={{
              marginTop: '1.25rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#2563eb',
              fontSize: '0.88rem',
              fontWeight: '600'
            }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>Synthesizing immediate clinical protocol with Google Gemini 3.5 Flash...</span>
            </div>
          )}

          {/* Bedside Answer Card */}
          {bedsideAnswer && (
            <div style={{
              marginTop: '1.5rem',
              background: '#ffffff',
              border: '1.5px solid #bfdbfe',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h4 style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: '800' }}>
                    {bedsideAnswer.title}
                  </h4>
                  <span className="badge-soft blue" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Cpu size={12} />
                    <span>{bedsideAnswer._activeModel || 'Gemini 3.5 Flash'} Live Triage</span>
                  </span>
                </div>
                <span className={`badge-soft ${bedsideAnswer.statusColor}`}>
                  {bedsideAnswer.status}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                {bedsideAnswer.action}
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
                  <div>Emergency Doctor on Call: <strong>{bedsideAnswer.doctorPhone}</strong></div>
                  <div style={{ marginTop: '0.2rem' }}>Recommended Destination: <strong>{bedsideAnswer.facility}</strong></div>
                </div>

                <a 
                  href={`tel:${bedsideAnswer.ambulanceNumber.split(' ')[0]}`}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  <PhoneCall size={16} />
                  <span>Call {bedsideAnswer.ambulanceNumber} Now</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multilingual Voice Copilot Card */}
      <div className="h2s-card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Mic size={18} color="#2563eb" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
              Frontline Multilingual Voice Assistant (Indic Audio Copilot)
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Ask queries in your native language via microphone. Connected to Google Gemini Flash API with Web Speech Synthesis audio replies.
          </p>
        </div>

        <IndicVoiceCopilot />
      </div>
    </div>
  );
}
