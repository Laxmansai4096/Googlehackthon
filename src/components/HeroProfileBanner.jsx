import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Stethoscope,
  Pill,
  ShieldAlert
} from 'lucide-react';

export default function HeroProfileBanner({ 
  currentUser, 
  currentRole, 
  setCurrentRole,
  currentDistrict
}) {
  const displayName = currentUser?.displayName || 'Laxman Budidha';
  const email = currentUser?.username || 'laxmanyadav4096@gmail.com';
  const initial = displayName.charAt(0).toUpperCase() || 'L';

  let rolePillText = 'INNOVATOR';
  let levelText = 'Level 1';

  if (currentRole === 'cmo') {
    rolePillText = 'CHIEF MEDICAL OFFICER';
    levelText = 'Level 1';
  } else if (currentRole === 'pharmacist') {
    rolePillText = 'DISPENSARY IN-CHARGE';
    levelText = 'Level 1';
  } else if (currentRole === 'asha') {
    rolePillText = 'ASHA SANGINI';
    levelText = 'Level 1';
  }

  return (
    <div className="hero-banner-section">
      {/* Cosmic Wave Lines Background with Glowing Dots (Matches Hack2Skill Banner) */}
      <svg 
        className="cosmic-wave-svg" 
        viewBox="0 0 1440 190" 
        fill="none" 
        preserveAspectRatio="none" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 1,
          opacity: 0.9 
        }}
      >
        <path d="M-100 130 C 250 30, 580 170, 1050 55 C 1260 15, 1420 90, 1550 65" stroke="rgba(99, 102, 241, 0.45)" strokeWidth="1.5" />
        <path d="M-50 160 C 320 50, 720 165, 1180 85 C 1350 55, 1500 115, 1600 85" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.2" />
        <path d="M-100 95 C 220 165, 620 45, 1020 135 C 1220 175, 1400 85, 1550 110" stroke="rgba(168, 85, 247, 0.35)" strokeWidth="1.4" />
        <path d="M0 165 C 380 105, 780 185, 1260 115 C 1410 85, 1530 135, 1600 125" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        
        {/* Luminous Glowing Particle Dots */}
        <circle cx="280" cy="55" r="3" fill="#38bdf8" />
        <circle cx="580" cy="140" r="2.5" fill="#818cf8" />
        <circle cx="720" cy="95" r="4" fill="#38bdf8" />
        <circle cx="940" cy="65" r="2.5" fill="#c084fc" />
        <circle cx="1180" cy="85" r="3.5" fill="#38bdf8" />
        <circle cx="1320" cy="115" r="2.5" fill="#818cf8" />
        <circle cx="150" cy="130" r="2.5" fill="#38bdf8" />
        <circle cx="430" cy="85" r="3" fill="#38bdf8" />
        <circle cx="860" cy="120" r="2.5" fill="#818cf8" />
      </svg>

      <div className="hero-banner-inner" style={{ zIndex: 2 }}>
        {/* Floating User Profile Card Over Banner (Matches Hack2Skill Screenshot Exactly) */}
        <div className="floating-profile-card">
          <div className="profile-card-top">
            <div className="profile-large-avatar" title={displayName}>
              {initial}
            </div>
            <div className="profile-user-info">
              <h3 title={displayName}>
                {displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName}
              </h3>
              <p title={email}>
                {email.length > 25 ? email.substring(0, 25) + '...' : email}
              </p>
            </div>
          </div>

          <div className="profile-pill-badges">
            <span className="pill-soft-blue">
              {levelText}
            </span>
            <span className="pill-soft-green">
              {rolePillText}
            </span>
          </div>
        </div>

        {/* 3 Profile Switcher Segmented Tabs (Matches Hack2Skill Screenshot Style) */}
        {setCurrentRole && (
          <div className="banner-tab-container">
            <div className="segmented-tab-bar">
              <button
                className={`segmented-tab-btn ${currentRole === 'cmo' ? 'active' : ''}`}
                onClick={() => setCurrentRole('cmo')}
              >
                🏛️ Health Head (CMO)
              </button>
              <button
                className={`segmented-tab-btn ${currentRole === 'pharmacist' ? 'active' : ''}`}
                onClick={() => setCurrentRole('pharmacist')}
              >
                💊 PHC Pharmacist
              </button>
              <button
                className={`segmented-tab-btn ${currentRole === 'asha' ? 'active' : ''}`}
                onClick={() => setCurrentRole('asha')}
              >
                🩺 ASHA Worker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
