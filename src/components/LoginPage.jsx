import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Key,
  BadgeCheck,
  Info
} from 'lucide-react';
import { DISTRICTS, INITIAL_FACILITIES } from '../data/mockData';

const PRESET_USERS = {
  cmo: {
    roleId: 'cmo',
    roleName: 'Chief Medical Officer (CMO)',
    roleIcon: '🏛️',
    badge: 'District Health Department Head',
    defaultUsername: 'cmo.khordha@nhm.gov.in',
    displayName: 'Dr. Debabrata Mishra (CMO)',
    district: DISTRICTS[0],
    facility: INITIAL_FACILITIES[0] // Central Warehouse
  },
  pharmacist: {
    roleId: 'pharmacist',
    roleName: 'PHC / CHC Pharmacist',
    roleIcon: '💊',
    badge: 'Dispensary & Stock In-Charge',
    defaultUsername: 'pharma.jatni@nhm.gov.in',
    displayName: 'Smita Pattnaik (Pharmacist)',
    district: DISTRICTS[0],
    facility: INITIAL_FACILITIES[1] // CHC Jatni
  },
  asha: {
    roleId: 'asha',
    roleName: 'ASHA / ANM Frontline Worker',
    roleIcon: '🩺',
    badge: 'Village Health Worker (NHM)',
    defaultUsername: 'asha.kantabad@nhm.gov.in',
    displayName: 'Sister Laxmipriya Dash (ASHA Lead)',
    district: DISTRICTS[0],
    facility: INITIAL_FACILITIES[3] // PHC Begunia / Kantabad
  }
};

export default function LoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('cmo');
  const [username, setUsername] = useState(PRESET_USERS.cmo.defaultUsername);
  const [password, setPassword] = useState('pass1234');
  const [selectedFacilityId, setSelectedFacilityId] = useState(INITIAL_FACILITIES[1].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch role and pre-populate suggested credentials
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const userPreset = PRESET_USERS[roleKey];
    setUsername(userPreset.defaultUsername);
    setPassword('pass1234');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const userPreset = PRESET_USERS[selectedRole];
      const facility = INITIAL_FACILITIES.find(f => f.id === selectedFacilityId) || userPreset.facility;

      // Extract a clean display name if user typed custom credentials
      let formattedDisplayName = userPreset.displayName;
      if (username && username !== userPreset.defaultUsername) {
        const rawName = username.includes('@') ? username.split('@')[0] : username;
        formattedDisplayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      }

      // Allow any credentials given according to the chosen role
      onLoginSuccess({
        role: selectedRole,
        username: username,
        displayName: formattedDisplayName,
        roleName: userPreset.roleName,
        district: userPreset.district,
        facility: facility
      });
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 60%), #070d18',
      position: 'relative'
    }}>
      {/* Decorative Brand Header */}
      <div style={{ maxWidth: '850px', width: '100%' }}>
        {/* Brand Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            <span>National Health Mission AI Gateway • Build with AI India</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(180deg, #ffffff 40%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.4rem'
          }}>
            आरोग्य<span style={{ color: '#38bdf8' }}>Setu</span> AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Predictive Medical Logistics, Computer Vision Inventory & Frontline Clinical Intelligence
          </p>
        </div>

        {/* Main Login Card */}
        <div className="tactical-card" style={{
          background: 'rgba(12, 21, 39, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
        }}>
          <div className="card-topbar" style={{ padding: '1.25rem 1.75rem' }}>
            <div className="card-title">
              <ShieldCheck size={20} color="#38bdf8" />
              <span>Select Your Role & Enter Credentials</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BadgeCheck size={14} />
              Open Credential Mode
            </span>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ padding: '1.75rem' }}>
            {/* Step 1: Role Selection Cards */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
                1. Choose User Role (Select Portal Persona):
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                {Object.values(PRESET_USERS).map(user => {
                  const isSelected = selectedRole === user.roleId;
                  return (
                    <div
                      key={user.roleId}
                      onClick={() => handleSelectRole(user.roleId)}
                      style={{
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
                        {user.roleIcon}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: isSelected ? '#38bdf8' : '#fff', marginBottom: '0.2rem' }}>
                        {user.roleName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: '1.3' }}>
                        {user.badge}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Credentials Inputs (Allows whatever user enters!) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>
                  NHM Employee ID / Email (Any text allowed)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem'
                }}>
                  <User size={15} color="var(--text-dim)" />
                  <input
                    type="text"
                    value={username}
                    placeholder="Enter any username or email"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>
                  Password / Security Token (Any text allowed)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem'
                }}>
                  <Lock size={15} color="var(--text-dim)" />
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter any password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Optional Specific Facility Selection for Pharmacist/ASHA */}
            {selectedRole !== 'cmo' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>
                  Assigned Health Facility / Dispensary
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 0.85rem'
                }}>
                  <MapPin size={15} color="#38bdf8" />
                  <select
                    value={selectedFacilityId}
                    onChange={(e) => setSelectedFacilityId(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    {INITIAL_FACILITIES.map(fac => (
                      <option key={fac.id} value={fac.id} style={{ background: '#0c1527', color: '#fff' }}>
                        {fac.name} ({fac.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* RBAC Notice (Explain future real authentication) */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: '1.4'
            }}>
              <Info size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#38bdf8' }}>Development Sandbox Mode:</strong> Any credentials you type will be accepted and granted access to the chosen role portal. In production, <strong>National Health Mission RBAC (Role-Based Access Control)</strong> validates employee SSO to strictly prevent unauthorized role elevation (e.g. pharmacists cannot access CMO executive command directives).
              </div>
            </div>

            {/* Submit & Enter Gateway Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: '800',
                justifyContent: 'center'
              }}
            >
              <span>{isSubmitting ? 'Authenticating Role...' : `Enter Gateway as ${PRESET_USERS[selectedRole].roleName}`}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

        {/* Demo Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Tip: You can use the auto-filled credentials or type any custom username & password you prefer.
        </div>
      </div>
    </div>
  );
}
