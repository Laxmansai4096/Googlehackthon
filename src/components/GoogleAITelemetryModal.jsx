import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Key, 
  Code, 
  Activity, 
  Cpu, 
  X,
  Copy,
  Check
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/geminiService';

export default function GoogleAITelemetryModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyEndpoint = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div className="card-topbar">
          <div className="card-title">
            <Sparkles size={18} color="#38bdf8" />
            <span>Google AI Integration & Live Telemetry Inspector</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
          {/* Hackathon Rule 01 Verification Banner */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1.5px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>
                Rule 01 Compliant: Mandatory Google AI Integration Active
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem', lineHeight: '1.4' }}>
                This prototype strictly integrates official Google AI models (<strong>Gemini 1.5/2.5 Flash</strong>) for multimodal computer vision and clinical triage reasoning.
              </p>
            </div>
          </div>

          {/* Enter Free Google AI Studio API Key */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Key size={15} color="#38bdf8" />
                <span>Connect Your Free Google AI Studio Key (Live Mode)</span>
              </label>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.75rem',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                <span>Get 100% Free Key</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: '1.4' }}>
              Google AI Studio provides a free API key with no credit card required. Paste it below to execute live calls to Google's Gemini servers when analyzing photos or querying the voice copilot.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  background: '#070d18',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                className="btn-primary"
                onClick={handleSave}
                style={{ padding: '0.65rem 1.1rem', fontSize: '0.82rem' }}
              >
                {isSaved ? 'Key Saved!' : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Live Architecture Inspection for Judges */}
          <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} color="#a855f7" />
            <span>Google Cloud AI Architecture Payload Inspector</span>
          </h4>

          {/* Endpoint 1 */}
          <div style={{
            background: '#050a14',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: '700' }}>
              <span>1. Multimodal Vision OCR Endpoint</span>
              <button
                onClick={() => handleCopyEndpoint('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span style={{ fontSize: '0.7rem' }}>Copy</span>
              </button>
            </div>
            <div style={{ color: '#94a3b8', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
              POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.72rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
              // Payload sent by ShelfScanner:<br/>
              {`{ "contents": [{ "parts": [{ "text": "Extract medicineName, batchNo, expiryDate, quantity..." }, { "inline_data": { "mime_type": "image/jpeg", "data": "<base64_encoded_image>" } }] }] }`}
            </div>
          </div>

          {/* Endpoint 2 */}
          <div style={{
            background: '#050a14',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7', marginBottom: '0.5rem', fontWeight: '700' }}>
              <span>2. Indic Conversational Copilot Endpoint</span>
            </div>
            <div style={{ color: '#94a3b8', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
              POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.72rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
              // Payload sent by IndicVoiceCopilot:<br/>
              {`{ "contents": [{ "parts": [{ "text": "Rural India health copilot: Answer in Hindi/Odia..." }] }] }`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
