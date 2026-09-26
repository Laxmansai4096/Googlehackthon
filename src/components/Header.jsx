import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  LogOut, 
  Globe,
  Activity,
  Layers
} from 'lucide-react';
import { DISTRICTS } from '../data/mockData';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/languageService';

export default function Header({ 
  currentUser,
  onLogout,
  currentDistrict, 
  setCurrentDistrict, 
  currentRole, 
  setCurrentRole,
  criticalAlertCount,
  onOpenGoogleAIModal,
  currentLanguage = 'en',
  onSelectLanguage
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const initial = (currentUser?.displayName || 'Laxman').charAt(0).toUpperCase();

  return (
    <header className="h2s-navbar">
      <div className="h2s-navbar-inner">
        {/* Left: Hack2Skill (H2S) Stylized Brand Logo + Track 2 Healthcare Identity */}
        <div className="brand-logo-wrap">
          <div className="h2s-logo-box" title="Hack2Skill Platform">
            <span className="h2s-brand-text">H<span className="h2s-brand-accent">2</span>S</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>
          <div className="brand-text">
            <span style={{ color: '#2563eb', fontWeight: '900' }}>आरोग्य</span>Setu<span style={{ color: '#2563eb' }}>.AI</span>
          </div>
          <span className="brand-badge-pill">
            Track 2 · Healthcare
          </span>
        </div>

        {/* Center: Authenticated Role Session Indicator (No free switching without logout) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {currentRole === 'cmo' && (
            <div className="badge-soft blue" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              🏛️ {getTranslation(currentLanguage, 'cmoRoleTitle')}
            </div>
          )}
          {currentRole === 'pharmacist' && (
            <div className="badge-soft safe" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              💊 {getTranslation(currentLanguage, 'pharmacistRoleTitle')}
            </div>
          )}
          {currentRole === 'asha' && (
            <div className="badge-soft warn" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              🩺 {getTranslation(currentLanguage, 'ashaRoleTitle')}
            </div>
          )}
        </div>

        {/* Right Section: Language, Home, Blogs, My Dashboard, Google AI, Bell, User Avatar */}
        <div className="nav-links-wrap">
          {/* Select Regional Language Dropdown with Auto Translation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem', color: '#1e40af', fontWeight: '700', background: '#eff6ff', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
            <Globe size={14} color="#2563eb" />
            <select
              value={currentLanguage}
              onChange={(e) => onSelectLanguage && onSelectLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1e40af',
                fontSize: '0.84rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              title="Select Regional Language (Translates UI while preserving proper nouns)"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: '#ffffff', color: '#0f172a' }}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Google AI Telemetry Badge Button */}
          <button
            onClick={onOpenGoogleAIModal}
            className="google-ai-header-btn"
            title="Inspect Google AI Integration & Gemini Flash Models"
          >
            <Sparkles size={13} color="#2563eb" />
            <span>Google AI</span>
          </button>

          {/* Notification Bell with Red Badge '2' (Matches Screenshot Exactly) */}
          <div 
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
            title={`${criticalAlertCount || 2} Active Stockout Notifications`}
          >
            <Bell size={21} color="#475569" strokeWidth={1.8} />
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-6px',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: '800',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff'
            }}>
              {criticalAlertCount > 0 ? criticalAlertCount : 2}
            </span>
          </div>

          {/* User Avatar Circle with Dark Brown Background & 'L' (Matches Screenshot Exactly) */}
          <div style={{ position: 'relative' }}>
            <div 
              className="user-avatar-circle"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={`${currentUser?.displayName || 'Laxman'} (${currentUser?.username || 'laxmanyadav4096@gmail.com'})`}
            >
              {initial}
            </div>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
                    {currentUser?.displayName || 'Laxman Budidha'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                    {currentUser?.username || 'laxmanyadav4096@gmail.com'}
                  </div>
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.35rem' }}>
                    <span className="pill-soft-blue" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Level 1</span>
                    <span className="pill-soft-green" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>INNOVATOR</span>
                  </div>
                </div>

                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active District</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}>
                    <MapPin size={13} color="#2563eb" />
                    <span>{currentDistrict.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    color: '#dc2626',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <LogOut size={14} />
                  <span>Switch Role / Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Visible Logout Button to Switch Roles */}
          <button
            onClick={onLogout}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
            title="Logout from this account to switch to another role"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
