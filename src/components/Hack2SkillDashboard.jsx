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
  Download,
  Printer,
  QrCode,
  X,
  Compass,
  MapPin,
  Calendar,
  Flame,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CornerDownLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DistrictMap from './DistrictMap';
import AgenticBorrowRecommender from './AgenticBorrowRecommender';
import PharmacistPortal from './portals/PharmacistPortal';
import ASHAPortal from './portals/ASHAPortal';
import { ESSENTIAL_DRUGS } from '../data/mockData';

export default function Hack2SkillDashboard({
  currentUser,
  currentRole,
  setCurrentRole,
  currentDistrict,
  setCurrentDistrict,
  facilities,
  setFacilities,
  selectedFacility,
  setSelectedFacility,
  transferRouteActive,
  onTriggerTransfer,
  onResetTransfer,
  onCommitInventory,
  onOpenGoogleAIModal,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab
}) {
  const [internalActiveTab, setInternalActiveTab] = useState('initiatives');
  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = propSetActiveTab || setInternalActiveTab;

  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);

  // Compute live statistics matching Hack2Skill screenshot
  const criticalCount = facilities.filter(f => f.overallHealth === 'Critical Stock-Out').length;
  const safeCount = facilities.filter(f => f.overallHealth === 'Safe').length;
  const totalFacilities = facilities.length;

  const asvDeficitClinic = facilities.find(f => 
    f.inventory.some(i => i.drugId === 'MED-ASV' && i.stock <= 5)
  ) || facilities[1]; // default Jatni

  const asvSurplusClinic = facilities.find(f => 
    f.inventory.some(i => i.drugId === 'MED-ASV' && i.stock > 50)
  ) || facilities[2]; // default Balipatna

  // Handle Dispatching Emergency Medicine Order
  const handleDispatchOfficialDirective = () => {
    onTriggerTransfer();

    const orderNo = `NHM/OD-KHD/EMERGENCY-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveNotice({
      orderNo: orderNo,
      time: new Date().toLocaleTimeString(),
      directive: `URGENT EXECUTIVE DIRECTIVE: Chief Medical Officer orders Pharmacist at ${asvSurplusClinic.name} to immediately release 60 vials of Anti-Snake Venom to emergency cold-box courier for delivery to ${asvDeficitClinic.name}.`,
      driverPhone: '+91 94372 10982 (Rabi Sahoo - Cryo-Bike Courier)',
      donor: asvSurplusClinic.name,
      recipient: asvDeficitClinic.name,
      drug: 'Anti-Snake Venom (Polyvalent 10ml)',
      quantity: 60,
      batchNo: 'ASV-23X-990'
    });

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // Initiatives Table Rows (Matches Hack2Skill Screenshot Structure)
  const initiativesData = [
    {
      id: 'INIT-JATNI',
      name: `${asvDeficitClinic.name} — Anti-Snake Venom Emergency Deficit`,
      subtext: `${asvDeficitClinic.block} · 14.2 km · Immediate restocking required`,
      tags: [
        { label: 'PHC Emergency', color: 'crit' },
        { label: 'EDL-01 ASV', color: 'blue' },
        { label: transferRouteActive ? 'Stock: 60 Vials' : 'Stock: 0 Vials', color: transferRouteActive ? 'safe' : 'crit' }
      ],
      ongoingRound: transferRouteActive 
        ? 'Round 1: Rapid Inter-Facility Transit Active (Courier En Route)' 
        : 'Round 1: Rapid Inter-Facility Borrowing (45km)',
      actionText: transferRouteActive ? 'View Transit Challan' : '⚡ Order Dispatch ASAP',
      isDispatched: transferRouteActive,
      onClick: () => {
        if (!transferRouteActive) {
          handleDispatchOfficialDirective();
        } else {
          setShowChallanModal(true);
        }
      }
    },
    {
      id: 'INIT-BALIPATNA',
      name: `${asvSurplusClinic.name} — ASV Surplus Buffer Redistribution`,
      subtext: `${asvSurplusClinic.block} · Surplus inventory flagged for inter-clinic borrowing`,
      tags: [
        { label: 'Surplus Buffer', color: 'safe' },
        { label: 'Donor Facility', color: 'blue' },
        { label: 'Cold-Chain Safe', color: 'safe' }
      ],
      ongoingRound: 'Round 2: Central Restock Synchronization',
      actionText: 'View Facility Stock',
      isDispatched: false,
      onClick: () => setSelectedFacility(asvSurplusClinic)
    },
    {
      id: 'INIT-TANGI',
      name: 'CHC Tangi — Oxytocin High Risk Labor Depletion',
      subtext: 'Chilika Coastal Belt · 12 Ampoules remaining · Active maternity load',
      tags: [
        { label: 'Vital EDL', color: 'warn' },
        { label: 'Obstetric Care', color: 'blue' }
      ],
      ongoingRound: 'Round 1: Safety Buffer Surveillance',
      actionText: 'Inspect Cold Box',
      isDispatched: false,
      onClick: () => {
        const found = facilities.find(f => f.id === 'FAC-CHC-TANGI');
        if (found) setSelectedFacility(found);
      }
    },
    {
      id: 'INIT-BANAPUR',
      name: 'PHC Banapur — Anti-Rabies Near-Expiry Reallocation',
      subtext: 'Banapur Block · 45 Vials expiring in 18 days · Reverse logistics flagged',
      tags: [
        { label: 'Expiring in 18d', color: 'warn' },
        { label: 'ARV Vaccine', color: 'blue' }
      ],
      ongoingRound: 'Round 2: Reverse Logistics Reallocation',
      actionText: 'Rotate Stock',
      isDispatched: false,
      onClick: () => {
        const found = facilities.find(f => f.id === 'FAC-PHC-BANAPUR');
        if (found) setSelectedFacility(found);
      }
    },
    {
      id: 'INIT-WAREHOUSE',
      name: 'District Warehouse Khordha — Central Restock Buffer',
      subtext: 'Central Medical Stores Depot · Bulk shipment receiving dock',
      tags: [
        { label: 'Central Hub', color: 'blue' },
        { label: 'NHM Odisha', color: 'safe' }
      ],
      ongoingRound: 'Round 3: District Indent Allocation',
      actionText: 'Review Indents',
      isDispatched: false,
      onClick: () => {
        const found = facilities.find(f => f.id === 'FAC-WAREHOUSE-KHD');
        if (found) setSelectedFacility(found);
      }
    }
  ];

  const filteredInitiatives = initiativesData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h2s-dashboard-layout">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Statistics Sidebar (Matches Screenshot Exactly)  */}
      {/* ============================================================== */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Statistics Card (Exact visual replica of Hack2Skill screenshot) */}
        <div className="h2s-card">
          <div className="sidebar-title">
            <span style={{ fontSize: '1.1rem' }}>🔍</span>
            <span>Statistics</span>
          </div>

          <div style={{ padding: '0.25rem 0' }}>
            {/* Stat Row 1: Active Initiatives (Ongoing : 1) */}
            <div className="stat-item-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-tile stat-tile-crit" style={{ background: '#fef2f2' }}>
                  <Flame size={18} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#1e293b' }}>
                    Active Initiatives
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Ongoing : {criticalCount > 0 ? criticalCount : 1}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a' }}>
                {criticalCount > 0 ? criticalCount : 1}
              </div>
            </div>

            {/* Stat Row 2: Submitted (0 or 1 if dispatched) */}
            <div className="stat-item-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-tile stat-tile-warn" style={{ background: '#fffbeb' }}>
                  <Calendar size={18} color="#d97706" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#1e293b' }}>
                    Submitted
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {transferRouteActive ? 'Dispatched : 1' : 'Pending : 0'}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a' }}>
                {transferRouteActive ? 1 : 0}
              </div>
            </div>

            {/* Stat Row 3: Cold-Chain Safe Centers */}
            <div className="stat-item-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-tile stat-tile-safe" style={{ background: '#f0fdf4' }}>
                  <ShieldCheck size={18} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#1e293b' }}>
                    Safe Facilities
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Cold-Chain Compliant
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#16a34a' }}>
                {safeCount}
              </div>
            </div>

            {/* Stat Row 4: AI OCR Digitized */}
            <div className="stat-item-row" style={{ borderBottom: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-tile stat-tile-blue" style={{ background: '#eff6ff' }}>
                  <Sparkles size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#1e293b' }}>
                    AI Scans & Audits
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Gemini Multimodal
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#2563eb' }}>
                24
              </div>
            </div>
          </div>
        </div>

        {/* District Overview Quick Card */}
        <div className="h2s-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MapPin size={16} color="#2563eb" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
              District Jurisdiction
            </h4>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
            <div><strong>District:</strong> {currentDistrict.name} ({currentDistrict.state})</div>
            <div><strong>Monitored Facilities:</strong> {totalFacilities} PHCs/CHCs</div>
            <div><strong>Critical Deficit:</strong> {asvDeficitClinic.name} (0 ASV)</div>
            <div><strong>Surplus Donor:</strong> {asvSurplusClinic.name} (140 ASV)</div>
          </div>
          
          <button
            onClick={onOpenGoogleAIModal}
            style={{
              marginTop: '1rem',
              width: '100%',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={14} />
            <span>Inspect Google AI Models</span>
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Main Content Area (Matches Screenshot Layout)    */}
      {/* ============================================================== */}
      <main className="main-content-panel">
        {/* Section Header: Title + Subtitle + Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🧘</span>
              <span>
                {activeTab === 'initiatives' && 'My Initiatives'}
                {activeTab === 'recommended' && 'Recommended AI Initiatives'}
                {activeTab === 'applications' && 'My Applications & Portals'}
              </span>
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginTop: '0.25rem'
            }}>
              {activeTab === 'initiatives' && 'Access a comprehensive listing of all initiatives you have registered for and participated .'}
              {activeTab === 'recommended' && 'AI-driven autonomous borrowing recommendations bridging PHC stockouts with surplus clinics within 45km.'}
              {activeTab === 'applications' && 'Specialized execution portals for District CMO, Dispensary Pharmacist, and Frontline ASHA Workers.'}
            </p>
          </div>

          {/* Search Bar with Return/Enter Icon (Matches Hack2Skill Screenshot) */}
          <div className="h2s-search-input-wrap">
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search Initiatives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={{
              background: '#f1f5f9',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.72rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ↵
            </div>
          </div>
        </div>

        {/* Blue Info Alert Banner (Matches Hack2Skill Screenshot Exactly) */}
        <div className="blue-info-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>This is your Primary Dashboard. Change it </span>
            <a 
              href="#change-portal" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(activeTab === 'initiatives' ? 'applications' : 'initiatives');
              }}
              style={{ color: '#0284c7', textDecoration: 'underline', fontStyle: 'italic', fontWeight: '700' }}
            >
              Here
            </a>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: '600' }}>
            Google Gemini 3.5 Flash Connected · Verified Active
          </div>
        </div>

        {/* Pagination & Rows Per Page Control Bar (Matches Screenshot) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.82rem',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="10">10 ∨</option>
              <option value="20">20 ∨</option>
              <option value="50">50 ∨</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              disabled 
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94a3b8'
              }}
            >
              &lt;
            </button>
            <div style={{
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.82rem'
            }}>
              1
            </div>
            <button 
              disabled 
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94a3b8'
              }}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: MY INITIATIVES — DATA TABLE + MAP + DIRECTIVE CARD       */}
        {/* ============================================================== */}
        {activeTab === 'initiatives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* The Main Initiatives Table (Matches Hack2Skill Screenshot Headers) */}
            <div className="h2s-card" style={{ overflowX: 'auto' }}>
              <table className="h2s-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Initiative name</th>
                    <th style={{ width: '22%' }}>Tags</th>
                    <th style={{ width: '23%' }}>Ongoing round</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInitiatives.map((init) => (
                    <tr key={init.id}>
                      {/* Column 1: Initiative Name & Location Description */}
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.92rem' }}>
                          {init.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {init.subtext}
                        </div>
                      </td>

                      {/* Column 2: Tags */}
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {init.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className={`badge-soft ${tag.color}`}
                              style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Column 3: Ongoing Round */}
                      <td>
                        <div style={{ fontSize: '0.84rem', color: '#334155', fontWeight: '600' }}>
                          {init.ongoingRound}
                        </div>
                      </td>

                      {/* Column 4: Action Button */}
                      <td style={{ textAlign: 'center' }}>
                        {init.isDispatched ? (
                          <button
                            onClick={init.onClick}
                            style={{
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#16a34a',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <FileText size={13} />
                            <span>Transit Challan</span>
                          </button>
                        ) : (
                          <button
                            onClick={init.onClick}
                            style={{
                              background: init.id === 'INIT-JATNI' ? '#2563eb' : '#f8fafc',
                              border: `1px solid ${init.id === 'INIT-JATNI' ? '#1d4ed8' : '#cbd5e1'}`,
                              color: init.id === 'INIT-JATNI' ? '#ffffff' : '#334155',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {init.actionText}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency Action Banner if Jatni is Stocked Out */}
            {!transferRouteActive && (
              <div style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
                border: '1.5px solid #fecaca',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 4px 15px -3px rgba(220, 38, 38, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#991b1b' }}>
                      EMERGENCY STOCKOUT: CHC Jatni has ZERO vials of Anti-Snake Venom
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '2px' }}>
                      Balipatna PHC has 140 vials buffer (32 km away, 42 min cryo-transit). One-click executive order notifies courier.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDispatchOfficialDirective}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  <Send size={16} />
                  <span>Order Officials to Send Medicines ASAP</span>
                </button>
              </div>
            )}

            {/* Interactive District GIS Map with Courier Transfer Route */}
            <div className="h2s-card" style={{ padding: '1.25rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    District Supply Chain GIS Network
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Live GPS coordinates for all 6 Primary Healthcare Centers and emergency inter-clinic transit routes.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge-soft safe">Safe Buffer</span>
                  <span className="badge-soft warn">Low Stock</span>
                  <span className="badge-soft crit">Critical Stock-Out</span>
                </div>
              </div>

              <div style={{ height: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <DistrictMap 
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={(fac) => setSelectedFacility(fac)}
                  transferRouteActive={transferRouteActive}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: RECOMMENDED INITIATIVES — AUTONOMOUS AGENTIC AI BORROW  */}
        {/* ============================================================== */}
        {activeTab === 'recommended' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AgenticBorrowRecommender 
              deficitFacility={asvDeficitClinic}
              facilities={facilities}
              onTriggerTransfer={handleDispatchOfficialDirective}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MY APPLICATIONS — ROLE WORKBENCH                        */}
        {/* ============================================================== */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Role Switcher Inside Workbench */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
                  Select Application Workbench Role
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Switch between District Command, Dispensary Vision Scanner, and ASHA Bedside Copilot.
                </p>
              </div>

              <div className="role-segmented-control">
                <button
                  className={`role-pill-btn ${currentRole === 'cmo' ? 'active' : ''}`}
                  onClick={() => setCurrentRole('cmo')}
                >
                  <span>🏛️</span>
                  <span>Health Head (CMO)</span>
                </button>
                <button
                  className={`role-pill-btn ${currentRole === 'pharmacist' ? 'active' : ''}`}
                  onClick={() => setCurrentRole('pharmacist')}
                >
                  <span>💊</span>
                  <span>PHC Pharmacist</span>
                </button>
                <button
                  className={`role-pill-btn ${currentRole === 'asha' ? 'active' : ''}`}
                  onClick={() => setCurrentRole('asha')}
                >
                  <span>🩺</span>
                  <span>ASHA Worker</span>
                </button>
              </div>
            </div>

            {/* Render Role-Specific Component */}
            {currentRole === 'cmo' && (
              <div className="h2s-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>
                  District Transit Authority Documentation
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Official inter-facility transfer challans mandated by National Health Mission Odisha.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowChallanModal(true)}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FileText size={16} />
                    <span>Open Printable Form NHM-LOG-144 Challan</span>
                  </button>

                  <button
                    onClick={onResetTransfer}
                    style={{
                      background: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Reset District Baseline Simulation
                  </button>
                </div>
              </div>
            )}

            {currentRole === 'pharmacist' && (
              <PharmacistPortal 
                facilities={facilities}
                currentFacility={selectedFacility}
                setCurrentFacility={setSelectedFacility}
                onCommitInventory={onCommitInventory}
                transferRouteActive={transferRouteActive}
              />
            )}

            {currentRole === 'asha' && (
              <ASHAPortal 
                facilities={facilities}
              />
            )}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: Printable Official Transit Challan (Form NHM-LOG-144)   */}
      {/* ============================================================== */}
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
            {/* Modal Close Button */}
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

            {/* Official Header */}
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
                <span><strong>CHALLAN NO:</strong> NHM/OD-KHD/2026/092</span>
                <span>•</span>
                <span><strong>DATE:</strong> {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Challan Details Table */}
            <div style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ISSUING FACILITY (DONOR):</div>
                  <div style={{ fontWeight: '800', color: '#0f172a' }}>{asvSurplusClinic.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Dispensary Reg: #OD-BALI-PHC-88</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>RECEIVING FACILITY (DEFICIT):</div>
                  <div style={{ fontWeight: '800', color: '#dc2626' }}>{asvDeficitClinic.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Urgent Emergency Indent #REQ-9921</div>
                </div>
              </div>

              {/* Medicine Table */}
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

              {/* Courier & Vehicle */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: '800', color: '#1e40af' }}>AUTHORISED COURIER DISPATCH:</div>
                <div style={{ color: '#1e3a8a', marginTop: '0.2rem' }}>
                  Courier: Rabi Sahoo (Cryo-Box Bike Courier) · Phone: +91 94372 10982 · Vehicle: OD-02-AX-4410
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                  <div>Dispensary Pharmacist</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>PHC Balipatna</div>
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

            {/* Modal Actions */}
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
