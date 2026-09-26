import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Truck, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Layers, 
  TrendingUp, 
  Search,
  Sparkles,
  PhoneCall,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  QrCode,
  X,
  MapPin,
  Flame,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Activity,
  Package,
  Bot,
  Globe,
  Radio,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DistrictMap from '../DistrictMap';
import AgenticBorrowRecommender from '../AgenticBorrowRecommender';
import DistrictLedgerAIIntelligence from '../DistrictLedgerAIIntelligence';
import FederatedHealthResourceGrid from '../FederatedHealthResourceGrid';
import { ESSENTIAL_DRUGS } from '../../data/mockData';
import { getTranslation } from '../../services/languageService';

export default function CMOCommandPortal({ 
  district, 
  facilities, 
  selectedFacility, 
  setSelectedFacility, 
  transferRouteActive, 
  onTriggerTransfer,
  onResetTransfer,
  currentLanguage = 'en'
}) {
  const [selectedDrugFilter, setSelectedDrugFilter] = useState('ALL');
  const [officialOrderSent, setOfficialOrderSent] = useState(transferRouteActive);
  const [activeOfficialNotice, setActiveOfficialNotice] = useState(null);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL'); // 'ALL', 'Critical', 'Low', 'Safe'
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'map', 'facilities', 'ledger', 'recommender', 'federated'

  // Compute District-wide critical emergencies
  const criticalFacilities = facilities.filter(f => f.overallHealth === 'Critical Stock-Out');
  const lowFacilities = facilities.filter(f => f.overallHealth === 'Low Stock');
  const safeFacilities = facilities.filter(f => f.overallHealth === 'Safe');

  const asvDeficitClinic = facilities.find(f => 
    f.inventory.some(i => i.drugId === 'MED-ASV' && i.stock <= 5)
  ) || facilities[1]; // default Jatni

  const asvSurplusClinic = facilities.find(f => 
    f.inventory.some(i => i.drugId === 'MED-ASV' && i.stock > 50)
  ) || facilities[2]; // default Balipatna

  const handleDispatchOfficialDirective = () => {
    setOfficialOrderSent(true);
    onTriggerTransfer();

    const orderNo = `NHM/OD-KHD/EMERGENCY-${Math.floor(1000 + Math.random() * 9000)}`;

    setActiveOfficialNotice({
      orderNo: orderNo,
      time: new Date().toLocaleTimeString(),
      directive: `URGENT EXECUTIVE DIRECTIVE: Chief Medical Officer orders Pharmacist at ${asvSurplusClinic.name} to immediately release 60 vials of Anti-Snake Venom to emergency cold-box courier for immediate delivery to ${asvDeficitClinic.name}.`,
      driverPhone: '+91 94372 10982 (Rabi Sahoo - Cryo-Bike Courier)',
      donor: asvSurplusClinic.name,
      recipient: asvDeficitClinic.name,
      drug: 'Anti-Snake Venom (Polyvalent 10ml)',
      quantity: 60,
      batchNo: 'ASV-23X-990',
      sha256Hash: 'e7a9b1c02f489371d5b304c861ef02a8394b21cde95721049bc83aef11029c7d',
      sanctionCode: 'NHM-RULE-144-EMERGENCY-DISPATCH',
      digitalSeal: 'COUNTERSIGNED BY DISTRICT CMO (ODISHA HEALTH GRID)'
    });
  };

  const currentFac = selectedFacility || facilities[0];

  const handleSwitchSubpage = (subpageKey) => {
    setActiveSection(subpageKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter facilities for Facilities Oversight Subpage
  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.inCharge.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (facilityFilter === 'Critical') return fac.overallHealth === 'Critical Stock-Out';
    if (facilityFilter === 'Low') return fac.overallHealth === 'Low Stock';
    if (facilityFilter === 'Safe') return fac.overallHealth === 'Safe' || fac.overallHealth === 'Surplus Near Expiry';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner: District Health Head Status Card (Modern Hack2Skill White Elevated Card) */}
      <div className="h2s-card" style={{ padding: '1.35rem 1.5rem' }}>
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
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'
            }}>
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Office of the Chief Medical Officer (CMO)
                </h2>
                <span className="brand-badge-pill">
                  District Command Center
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Jurisdiction: <strong style={{ color: '#1e293b' }}>{district.name} ({district.state})</strong> • Monitored: <strong style={{ color: '#1e293b' }}>{facilities.length} PHCs & CHCs</strong> • Population Protected: <strong style={{ color: '#1e293b' }}>{district.population}</strong>
              </p>
            </div>
          </div>

          {/* Quick Stat Pill Tiles */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div 
              onClick={() => handleSwitchSubpage('facilities')}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                minWidth: '105px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to view critical facilities"
            >
              <div style={{ fontSize: '0.68rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: '800' }}>
                Critical Stockouts
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#dc2626' }}>
                {criticalFacilities.length}
              </div>
            </div>

            <div 
              onClick={() => handleSwitchSubpage('facilities')}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                minWidth: '105px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to view warning facilities"
            >
              <div style={{ fontSize: '0.68rem', color: '#d97706', textTransform: 'uppercase', fontWeight: '800' }}>
                Low Stock Warnings
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#d97706' }}>
                {lowFacilities.length}
              </div>
            </div>

            <div 
              onClick={() => handleSwitchSubpage('facilities')}
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                minWidth: '105px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to view safe facilities"
            >
              <div style={{ fontSize: '0.68rem', color: '#16a34a', textTransform: 'uppercase', fontWeight: '800' }}>
                Safe Facilities
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#16a34a' }}>
                {safeFacilities.length}
              </div>
            </div>

            <div 
              onClick={() => handleSwitchSubpage('map')}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                minWidth: '115px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to open cold-chain GIS map"
            >
              <div style={{ fontSize: '0.68rem', color: '#2563eb', textTransform: 'uppercase', fontWeight: '800' }}>
                Cold-Chain Health
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2563eb' }}>
                100% OK
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Quick Navigation Shortcuts Bar (Segmented Tab Bar) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Officer Subpages:
          </span>
        </div>

        <div className="segmented-tab-bar" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
          <button
            className={`segmented-tab-btn ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('all')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>📊</span>
            <span>All Views</span>
          </button>

          <button
            className={`segmented-tab-btn ${activeSection === 'map' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('map')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>🗺️</span>
            <span>District GIS Network & Cold-Chain Route</span>
          </button>

          <button
            className={`segmented-tab-btn ${activeSection === 'facilities' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('facilities')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>🏥</span>
            <span>District Facilities Oversight ({facilities.length} Centers)</span>
          </button>

          <button
            className={`segmented-tab-btn ${activeSection === 'ledger' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('ledger')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>📦</span>
            <span>Detailed Medicine Ledger ({currentFac.name})</span>
          </button>

          <button
            className={`segmented-tab-btn ${activeSection === 'recommender' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('recommender')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>🤖</span>
            <span>Autonomous Agentic AI Borrow Recommender</span>
          </button>

          <button
            className={`segmented-tab-btn ${activeSection === 'federated' ? 'active' : ''}`}
            onClick={() => handleSwitchSubpage('federated')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <span>🌐</span>
            <span>Federated National Grid (Beds, Staff & Cross-State AI)</span>
          </button>
        </div>
      </div>

      {/* Subpage Breadcrumb Bar (Visible when inside any dedicated subpage) */}
      {activeSection !== 'all' && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => handleSwitchSubpage('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#2563eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={14} />
              <span>← Back to All Views</span>
            </button>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
              {activeSection === 'map' && '🗺️ District GIS Network & Cold-Chain Route'}
              {activeSection === 'facilities' && `🏥 District Facilities Oversight (${facilities.length} Centers)`}
              {activeSection === 'ledger' && `📦 Detailed Medicine Ledger (${currentFac.name})`}
              {activeSection === 'recommender' && '🤖 Autonomous Agentic AI Borrow Recommender'}
              {activeSection === 'federated' && '🌐 Federated National Grid (Beds, Staff & Cross-State AI)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
            <span>Dedicated Isolated Subpage Active</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 1: ALL VIEWS / EXECUTIVE OVERVIEW & SUBPAGE LAUNCH HUB            */}
      {/* ========================================================================= */}
      {activeSection === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Critical Recommendation Directive Card */}
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1.35rem 1.5rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: '290px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: '800', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                  <ShieldAlert size={19} />
                  <span>AI CRITICAL INTERVENTION DIRECTIVE FOR HEALTH HEAD</span>
                </div>

                <div style={{ fontSize: '1.05rem', color: '#991b1b', fontWeight: '800', marginBottom: '0.35rem' }}>
                  🚨 {asvDeficitClinic.name} is at ZERO vials of Anti-Snake Venom with heavy flood alerts in block.
                </div>

                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', lineHeight: '1.55' }}>
                  <strong>AI Solution:</strong> Restock immediately from <strong>{asvSurplusClinic.name}</strong>, which holds <strong>140 vials expiring in 32 days</strong> (surplus buffer exceeds its 3-month requirement). Distance is 24 km via NH-16 (ETA: 32 mins).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {officialOrderSent || transferRouteActive ? (
                  <>
                    <div style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 1.15rem',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      <CheckCircle2 size={17} />
                      <span>Executive Order Enforced & Courier Dispatched!</span>
                    </div>

                    <button
                      onClick={() => setShowChallanModal(true)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 1.15rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <FileText size={15} />
                      <span>View Official Transit Pass</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleDispatchOfficialDirective}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.5rem',
                      fontSize: '0.92rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Send size={16} />
                    <span>Order Officials to Send Medicines ASAP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Official Directive Notice Output */}
            {activeOfficialNotice && (
              <div style={{
                marginTop: '1.25rem',
                background: '#f8fafc',
                border: '1.5px solid #059669',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: '#ecfdf5', 
                      color: '#059669', 
                      border: '1px solid #a7f3d0', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '9999px', 
                      fontWeight: '800', 
                      fontSize: '0.72rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      🛡️ CRYPTOGRAPHIC AUDIT SEAL VERIFIED
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: '800' }}>
                      {activeOfficialNotice.orderNo} ({activeOfficialNotice.time})
                    </span>
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '600', lineHeight: 1.4 }}>
                    {activeOfficialNotice.directive}
                  </div>
                  <div style={{ color: '#475569', marginTop: '0.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                    <div>🚀 Courier: <strong style={{ color: '#0f172a' }}>{activeOfficialNotice.driverPhone}</strong></div>
                    <div>📜 Authority: <span style={{ color: '#059669', fontWeight: '700' }}>{activeOfficialNotice.sanctionCode}</span></div>
                    <div>🔐 SHA-256: <code style={{ background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.7rem' }}>{activeOfficialNotice.sha256Hash?.slice(0, 16)}...</code></div>
                  </div>
                </div>

                <button
                  onClick={() => setShowChallanModal(true)}
                  style={{
                    background: '#059669',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <span>📄</span>
                  <span>View Official E-Challan</span>
                </button>
              </div>
            )}
          </div>

          {/* Subpages Launcher Grid: 5 Quick Access Tiles */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  District Executive Command Subpages
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Click any subpage to open its dedicated dashboard view without scrolling through the entire portal.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Tile 1: GIS Map */}
              <div 
                className="h2s-card"
                onClick={() => handleSwitchSubpage('map')}
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      🗺️
                    </div>
                    <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                      {transferRouteActive ? '🚚 Route Active' : '● Live GPS'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                    District GIS Network & Cold-Chain Route
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    Interactive GIS map connecting 6 district health facilities with live GPS cold-box courier transit between Balipatna CHC and CHC Jatni.
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb' }}>
                    6 Facilities Mapped
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>
                    <span>Open GIS Map</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Tile 2: Facilities Oversight */}
              <div 
                className="h2s-card"
                onClick={() => handleSwitchSubpage('facilities')}
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: '#fef2f2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      🏥
                    </div>
                    <span className="badge-soft crit" style={{ fontSize: '0.72rem' }}>
                      {criticalFacilities.length} Stockout Alert
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                    District Facilities Oversight ({facilities.length} Centers)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    Real-time oversight across all 6 PHCs & CHCs: In-charge doctors, distance from CDW, digital cold storage compliance, and drug buffers.
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
                    {criticalFacilities.length} Crit · {lowFacilities.length} Low · {safeFacilities.length} Safe
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>
                    <span>Inspect Facilities</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Tile 3: Detailed Medicine Ledger */}
              <div 
                className="h2s-card"
                onClick={() => handleSwitchSubpage('ledger')}
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      📦
                    </div>
                    <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                      Multi-Tier & FEFO Active
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                    Detailed Medicine Ledger ({currentFac.name})
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    Hierarchical EDL drug stock register for CHC Jatni and 3 affiliated Sub-Centres (Kantabad, Padanpur, Ward-4) with live Gemini AI health analysis.
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>
                    Sub-Centres Included
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>
                    <span>Open Drug Ledger</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Tile 4: Agentic Recommender */}
              <div 
                className="h2s-card"
                onClick={() => handleSwitchSubpage('recommender')}
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: '#faf5ff',
                      color: '#9333ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      🤖
                    </div>
                    <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                      NHM Rule 144 Spatial
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                    Autonomous Agentic AI Borrow Recommender
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    Autonomous spatial search & bridge-supply negotiation for stock-out prevention. Automated cryo-courier dispatch with digital transit passes.
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9333ea' }}>
                    Spatial Rebalance Ready
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>
                    <span>Run AI Recommender</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Tile 5: Federated National Grid */}
              <div 
                className="h2s-card"
                onClick={() => handleSwitchSubpage('federated')}
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  gridColumn: 'span 1'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: '#f0fdfa',
                      color: '#0d9488',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      🌐
                    </div>
                    <span className="badge-soft safe" style={{ fontSize: '0.72rem' }}>
                      4 States · ε = 0.5
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                    Federated National Grid (Beds, Staff & Cross-State AI)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    Real-time national bed occupancy, biometric staff attendance (93.4%), and privacy-preserving cross-state edge learning across Odisha, UP, Bihar, and Kerala.
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0d9488' }}>
                    Beds · Biometrics · AI FedAvg
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>
                    <span>Open National Grid</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 2: DISTRICT GIS NETWORK & COLD-CHAIN ROUTE                        */}
      {/* ========================================================================= */}
      {activeSection === 'map' && (
        <div className="h2s-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  District GIS Network & Cold-Chain Route Telemetry
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Real-time geospatial monitoring of 6 district health facilities with automated cold-chain route tracking and transfer dispatch.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge-soft safe">● Safe Buffer</span>
              <span className="badge-soft warn">● Low Stock</span>
              <span className="badge-soft crit">● Stockout Alert</span>
              {transferRouteActive && (
                <span className="brand-badge-pill" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                  🚚 Courier in Transit (24 km)
                </span>
              )}
            </div>
          </div>

          {/* Facility Selector Dropdown (Vertical Selectbox) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.65rem 1rem',
            background: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap'
          }}>
            <label 
              htmlFor="facility-center-select"
              style={{ 
                fontSize: '0.82rem', 
                fontWeight: '800', 
                color: '#334155', 
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Building2 size={16} color="#2563eb" />
              <span>{getTranslation(currentLanguage, 'selectCenter')}</span>
            </label>

            <div style={{ position: 'relative', flex: 1, minWidth: '320px', maxWidth: '580px' }}>
              <select
                id="facility-center-select"
                value={currentFac.id}
                onChange={(e) => {
                  const fac = facilities.find(f => f.id === e.target.value);
                  if (fac) setSelectedFacility(fac);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 2.2rem 0.6rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #2563eb',
                  borderRadius: 'var(--radius-sm, 6px)',
                  boxShadow: '0 1px 3px rgba(37, 99, 235, 0.08)',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {facilities.map(fac => (
                  <option 
                    key={fac.id} 
                    value={fac.id}
                    style={{ color: '#0f172a', padding: '0.5rem', fontWeight: '600' }}
                  >
                    {fac.name} ({fac.overallHealth})
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ChevronDown size={16} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span 
                className={`badge-soft ${
                  currentFac.overallHealth.toLowerCase().includes('critical') 
                    ? 'crit' 
                    : currentFac.overallHealth.toLowerCase().includes('low') 
                      ? 'warn' 
                      : 'safe'
                }`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: '800' }}
              >
                Status: {currentFac.overallHealth}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                ({currentFac.type || 'Facility'})
              </span>
            </div>
          </div>

          {/* The District Interactive Map */}
          <div style={{ height: '540px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <DistrictMap 
              facilities={facilities}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              transferRouteActive={transferRouteActive}
              onInitiateTransfer={handleDispatchOfficialDirective}
            />
          </div>

          {/* Map Footer Information */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem'
          }}>
            <div>
              <strong style={{ color: '#0f172a' }}>Selected Center Details:</strong> {currentFac.name} · In-charge: <strong>{currentFac.inCharge}</strong> · Fridge: <strong style={{ color: currentFac.fridgeTempC > 6 ? '#d97706' : '#16a34a' }}>{currentFac.fridgeTempC}°C</strong> · CDW Distance: <strong>{currentFac.distanceFromHQ_KM} km</strong>
            </div>

            <button
              onClick={() => handleSwitchSubpage('ledger')}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Inspect Medicine Ledger</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 3: DISTRICT FACILITIES OVERSIGHT (6 CENTERS)                      */}
      {/* ========================================================================= */}
      {activeSection === 'facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="h2s-card" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="#2563eb" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                    District Facilities Oversight ({facilities.length} Centers)
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Comprehensive inspection of Block Primary & Community Health Centers across Khordha district.
                </p>
              </div>

              {/* Filter Pills & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search center or doctor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '0.45rem 0.75rem 0.45rem 2rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      width: '210px'
                    }}
                  />
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <div className="segmented-tab-bar" style={{ padding: '0.2rem' }}>
                  <button
                    className={`segmented-tab-btn ${facilityFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFacilityFilter('ALL')}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    All ({facilities.length})
                  </button>
                  <button
                    className={`segmented-tab-btn ${facilityFilter === 'Critical' ? 'active' : ''}`}
                    onClick={() => setFacilityFilter('Critical')}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', color: facilityFilter === 'Critical' ? '#dc2626' : '' }}
                  >
                    Critical ({criticalFacilities.length})
                  </button>
                  <button
                    className={`segmented-tab-btn ${facilityFilter === 'Low' ? 'active' : ''}`}
                    onClick={() => setFacilityFilter('Low')}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', color: facilityFilter === 'Low' ? '#d97706' : '' }}
                  >
                    Low ({lowFacilities.length})
                  </button>
                  <button
                    className={`segmented-tab-btn ${facilityFilter === 'Safe' ? 'active' : ''}`}
                    onClick={() => setFacilityFilter('Safe')}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', color: facilityFilter === 'Safe' ? '#16a34a' : '' }}
                  >
                    Safe ({safeFacilities.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of All 6 Facilities */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredFacilities.map(fac => {
              const isSelected = currentFac.id === fac.id;
              const isCritical = fac.overallHealth === 'Critical Stock-Out';
              const isSurplus = fac.overallHealth === 'Surplus Near Expiry';
              const isLow = fac.overallHealth === 'Low Stock';

              return (
                <div 
                  key={fac.id}
                  className="h2s-card"
                  style={{
                    padding: '1.35rem',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.12)' : 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: isSelected ? '#2563eb' : '#0f172a' }}>
                          {fac.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Type: {fac.name.includes('CHC') ? 'Community Health Centre (Block Hub)' : 'Primary Health Centre'}
                        </span>
                      </div>
                      <span className={`badge-soft ${isCritical ? 'crit' : isSurplus ? 'safe' : isLow ? 'warn' : 'safe'}`}>
                        {fac.overallHealth}
                      </span>
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <span style={{ color: '#64748b' }}>In-Charge:</span>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{fac.inCharge}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Cold Fridge:</span>
                        <div style={{ fontWeight: '700', color: fac.fridgeTempC > 6 ? '#d97706' : '#16a34a' }}>
                          {fac.fridgeTempC}°C (Optimal)
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>HQ Distance:</span>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{fac.distanceFromHQ_KM} km via Road</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Stock Status:</span>
                        <div style={{ fontWeight: '700', color: isCritical ? '#dc2626' : '#16a34a' }}>
                          {fac.inventory.filter(i => i.stock === 0).length} Stockouts
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Key Drug Stock Snapshot:
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {fac.inventory.map(item => {
                          const dm = ESSENTIAL_DRUGS.find(d => d.id === item.drugId);
                          const isZero = item.stock === 0;
                          const isLowStock = item.stock <= 5 && item.stock > 0;
                          return (
                            <span 
                              key={item.drugId}
                              style={{
                                fontSize: '0.7rem',
                                background: isZero ? '#fef2f2' : isLowStock ? '#fffbeb' : '#f8fafc',
                                color: isZero ? '#dc2626' : isLowStock ? '#d97706' : '#334155',
                                border: `1px solid ${isZero ? '#fecaca' : isLowStock ? '#fde68a' : '#e2e8f0'}`,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontWeight: isZero ? '800' : '600'
                              }}
                            >
                              {dm?.name.split(' ')[0]}: {item.stock} {isZero ? '⚠️' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => {
                        setSelectedFacility(fac);
                        handleSwitchSubpage('ledger');
                      }}
                      style={{
                        flex: 1,
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Package size={14} />
                      <span>Open Medicine Ledger</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedFacility(fac);
                        handleSwitchSubpage('map');
                      }}
                      style={{
                        background: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '0.55rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <MapPin size={14} />
                      <span>Map</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 4: DETAILED MEDICINE LEDGER (WITH LIVE GEMINI STOCK AI)           */}
      {/* ========================================================================= */}
      {activeSection === 'ledger' && (
        <div id="cmo-ledger-section">
          <DistrictLedgerAIIntelligence
            facilities={facilities}
            selectedFacilityId={currentFac?.id || facilities[0]?.id}
            onSelectFacility={(id) => {
              const fac = facilities.find(f => f.id === id);
              if (fac && setSelectedFacility) setSelectedFacility(fac);
            }}
            onTriggerChallan={() => setShowChallanModal(true)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 5: AUTONOMOUS AGENTIC AI BORROW RECOMMENDER                       */}
      {/* ========================================================================= */}
      {activeSection === 'recommender' && (
        <div id="cmo-recommender-section">
          <AgenticBorrowRecommender 
            deficitFacility={asvDeficitClinic}
            facilities={facilities}
            onTriggerTransfer={handleDispatchOfficialDirective}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 6: FEDERATED NATIONAL GRID (BEDS, STAFF & CROSS-STATE AI)         */}
      {/* ========================================================================= */}
      {activeSection === 'federated' && (
        <div id="cmo-federated-section">
          <FederatedHealthResourceGrid 
            facilities={facilities}
            onTriggerChallan={() => setShowChallanModal(true)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL GOVERNMENT TRANSIT CHALLAN MODAL                                 */}
      {/* ========================================================================= */}
      {showChallanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: 'var(--shadow-elevated)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowChallanModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} color="#64748b" />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.05em', color: '#64748b' }}>
                GOVERNMENT OF ODISHA · DEPARTMENT OF HEALTH & FAMILY WELFARE
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginTop: '0.25rem' }}>
                EMERGENCY INTER-FACILITY MEDICINE TRANSIT CHALLAN
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.78rem', color: '#475569', marginTop: '0.35rem' }}>
                <span><strong>FORM:</strong> NHM-LOG-144</span>
                <span>•</span>
                <span><strong>CHALLAN NO:</strong> {activeOfficialNotice?.orderNo || 'NHM/OD-KHD/EMERGENCY-2024'}</span>
                <span>•</span>
                <span><strong>DATE:</strong> {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>DISPATCH FACILITY (DONOR):</div>
                  <div style={{ fontWeight: '800', color: '#0f172a' }}>{asvSurplusClinic.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>In-charge: Dr. Asit Mohanty</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>RECEIVING FACILITY (DEFICIT):</div>
                  <div style={{ fontWeight: '800', color: '#dc2626' }}>{asvDeficitClinic.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>In-charge: Dr. Smita Pattnaik</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Batch No</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Cold Temp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>Anti-Snake Venom (Polyvalent 10ml)</td>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', fontFamily: 'monospace' }}>ASV-23X-990</td>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', fontWeight: '800', color: '#2563eb' }}>60 Vials</td>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>2°C – 8°C Verified</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: '800', color: '#1e40af' }}>AUTHORISED COURIER DISPATCH:</div>
                <div style={{ color: '#1e3a8a', marginTop: '0.2rem' }}>
                  Courier: Rabi Sahoo (Cryo-Box Bike Courier) · Phone: +91 94372 10982 · Vehicle: OD-02-AX-4410
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                  <div>Dispensary Pharmacist</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{asvSurplusClinic.name}</div>
                </div>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                  <div>Cryo-Courier Receiver</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Rabi Sahoo</div>
                </div>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                  <div>Chief Medical Officer</div>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>Approved Digitally ✓</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Printer size={15} />
                <span>Print Official Challan</span>
              </button>

              <button
                onClick={() => setShowChallanModal(false)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
