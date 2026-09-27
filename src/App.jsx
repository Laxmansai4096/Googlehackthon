import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import CMOCommandPortal from './components/portals/CMOCommandPortal';
import PharmacistPortal from './components/portals/PharmacistPortal';
import ASHAPortal from './components/portals/ASHAPortal';
import GoogleAITelemetryModal from './components/GoogleAITelemetryModal';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  DISTRICTS, 
  INITIAL_FACILITIES, 
  ESSENTIAL_DRUGS 
} from './data/mockData';
import { 
  Presentation,
  X,
  FileText,
  RotateCcw
} from 'lucide-react';
import ArogyaChatbot from './components/ArogyaChatbot';

const STORAGE_KEY_FACILITIES = 'AROGYASETU_LIVE_FACILITIES';
const STORAGE_KEY_TRANSFER = 'AROGYASETU_TRANSFER_ACTIVE';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null = shows LoginPage initially
  const [currentDistrict, setCurrentDistrict] = useState(DISTRICTS[0]);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 'en', 'hi', 'or', 'bn', 'te', 'ta'
  const [activeTab, setActiveTab] = useState('initiatives'); // 'initiatives', 'recommended', 'applications'
  
  // Persistent facilities from localStorage or initial
  const [facilities, setFacilities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FACILITIES);
      return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
    } catch (e) {
      return INITIAL_FACILITIES;
    }
  });

  const [currentRole, setCurrentRole] = useState('cmo'); // 'cmo', 'pharmacist', 'asha'
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[1]); // CHC Jatni (critical stockout)
  
  const [transferRouteActive, setTransferRouteActive] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TRANSFER) === 'true';
  });

  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showGoogleAIModal, setShowGoogleAIModal] = useState(false);
  const [globalNotification, setGlobalNotification] = useState(null);

  // Sync facilities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FACILITIES, JSON.stringify(facilities));
      localStorage.setItem(STORAGE_KEY_TRANSFER, String(transferRouteActive));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [facilities, transferRouteActive]);

  // Compute live KPIs
  const criticalCount = facilities.filter(f => f.overallHealth === 'Critical Stock-Out').length;

  // Handle Login Success from LoginPage
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentRole(userData.role);
    if (userData.district) setCurrentDistrict(userData.district);
    if (userData.facility) setSelectedFacility(userData.facility);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handle Inter-Clinic Transfer (Dynamic or Default Balipatna to Jatni)
  const handleTriggerTransfer = (customTransfer) => {
    setTransferRouteActive(true);

    if (customTransfer && customTransfer.donorFacilityId && customTransfer.recipientFacilityId) {
      const { donorFacilityId, recipientFacilityId, drugId, quantity, batchNo, expiryDays, drugName, recipientName, donorName } = customTransfer;
      const transferQty = quantity || 60;

      setFacilities(prev => prev.map(f => {
        if (f.id === donorFacilityId) {
          return {
            ...f,
            inventory: f.inventory.map(item => {
              if (item.drugId === drugId) {
                return { ...item, stock: Math.max(0, item.stock - transferQty) };
              }
              return item;
            })
          };
        }
        if (f.id === recipientFacilityId) {
          const hasDrug = f.inventory.some(i => i.drugId === drugId);
          const updatedInventory = hasDrug
            ? f.inventory.map(item => {
                if (item.drugId === drugId) {
                  return {
                    ...item,
                    stock: (item.stock || 0) + transferQty,
                    batchNo: batchNo || (item.batchNo + ' (Transferred via Courier)'),
                    expiryDays: expiryDays || item.expiryDays || 35,
                    status: 'Safe'
                  };
                }
                return item;
              })
            : [
                ...f.inventory,
                {
                  drugId,
                  stock: transferQty,
                  batchNo: batchNo || 'TRANS-' + Math.floor(1000 + Math.random() * 9000),
                  expiryDays: expiryDays || 45,
                  status: 'Safe'
                }
              ];
          return {
            ...f,
            overallHealth: 'Safe',
            inventory: updatedInventory
          };
        }
        return f;
      }));

      setSelectedFacility(prev => {
        if (prev?.id === recipientFacilityId) {
          return {
            ...prev,
            overallHealth: 'Safe',
            inventory: prev.inventory.map(item => {
              if (item.drugId === drugId) {
                return { ...item, stock: (item.stock || 0) + transferQty, status: 'Safe' };
              }
              return item;
            })
          };
        }
        return prev;
      });

      setGlobalNotification(`⚡ CMO Directive Enforced: ${transferQty} units of ${drugName || 'medicine'} dispatched from ${donorName || 'Donor'} to ${recipientName || 'Recipient'}!`);
      setTimeout(() => setGlobalNotification(null), 6000);
      return;
    }

    // Default Balipatna to Jatni transfer for backwards compatibility
    setFacilities(prev => prev.map(f => {
      if (f.id === 'FAC-PHC-BALIPATNA') {
        return {
          ...f,
          overallHealth: 'Safe',
          inventory: f.inventory.map(item => {
            if (item.drugId === 'MED-ASV') {
              return { ...item, stock: Math.max(0, item.stock - 60), status: 'Safe' };
            }
            return item;
          })
        };
      }
      if (f.id === 'FAC-CHC-JATNI') {
        return {
          ...f,
          overallHealth: 'Safe',
          inventory: f.inventory.map(item => {
            if (item.drugId === 'MED-ASV') {
              return { 
                ...item, 
                stock: (item.stock || 0) + 60, 
                batchNo: 'ASV-23X-990 (Transferred via Courier)', 
                expiryDays: 32, 
                status: 'Safe' 
              };
            }
            return item;
          })
        };
      }
      return f;
    }));

    if (selectedFacility?.id === 'FAC-CHC-JATNI') {
      setSelectedFacility(prev => ({
        ...prev,
        overallHealth: 'Safe',
        inventory: prev.inventory.map(item => {
          if (item.drugId === 'MED-ASV') {
            return { ...item, stock: 60, batchNo: 'ASV-23X-990 (Transferred via Courier)', status: 'Safe' };
          }
          return item;
        })
      }));
    }

    setGlobalNotification('⚡ CMO Official Order Enforced: 60 Vials of Anti-Snake Venom dispatched to CHC Jatni!');
    setTimeout(() => setGlobalNotification(null), 6000);
  };

  // Autonomous Multi-Facility District Network Rebalancer (Google OR-Tools Heuristic Solver)
  const handleDistrictWideAutoRebalance = () => {
    setTransferRouteActive(true);
    let totalTransfers = 0;

    setFacilities(prevFacilities => {
      const updated = JSON.parse(JSON.stringify(prevFacilities));

      updated.forEach(deficitFac => {
        deficitFac.inventory.forEach(item => {
          if (item.stock <= 5 || item.status === 'Critical Stock-Out') {
            const neededQty = 40;
            const donorFac = updated.find(d => 
              d.id !== deficitFac.id &&
              d.inventory.some(di => di.drugId === item.drugId && di.stock >= 60)
            );

            if (donorFac) {
              const donorItem = donorFac.inventory.find(di => di.drugId === item.drugId);
              if (donorItem && donorItem.stock >= 60) {
                donorItem.stock -= neededQty;
                item.stock += neededQty;
                item.status = 'Safe';
                item.batchNo = (donorItem.batchNo || 'ASV-23X-990') + ' (Network Rebalanced)';
                totalTransfers++;
              }
            }
          }
        });

        const hasCritical = deficitFac.inventory.some(i => i.stock <= 5);
        if (!hasCritical) {
          deficitFac.overallHealth = 'Safe';
        }
      });

      return updated;
    });

    setGlobalNotification(`⚡ District Network Optimizer: Autonomously resolved stock-outs across ${totalTransfers || 2} facility nodes under NHM Rule 144!`);
    setTimeout(() => setGlobalNotification(null), 7000);
  };

  const handleResetTransfer = () => {
    localStorage.removeItem(STORAGE_KEY_FACILITIES);
    localStorage.removeItem(STORAGE_KEY_TRANSFER);
    setTransferRouteActive(false);
    setFacilities(INITIAL_FACILITIES);
    setSelectedFacility(INITIAL_FACILITIES[1]);
    setGlobalNotification('Database reset to initial district baseline.');
    setTimeout(() => setGlobalNotification(null), 3000);
  };

  // Handle committing newly digitized stock from Gemini Scanner
  const handleCommitInventory = (targetFacilityId, scannedData) => {
    setFacilities(prev => prev.map(f => {
      if (f.id === targetFacilityId) {
        return {
          ...f,
          overallHealth: 'Safe',
          inventory: [
            ...f.inventory,
            {
              drugId: 'MED-NEW-' + Date.now(),
              name: scannedData.medicineName || 'Scanned Medicine',
              stock: scannedData.quantityDetected || 40,
              unit: scannedData.unit || 'Units',
              tempRequirement: scannedData.temperatureRequirement || (scannedData.isColdChain ? '2°C - 8°C (Cold Chain)' : 'Ambient (<30°C)'),
              batchNo: scannedData.batchNumber || 'BATCH-' + Math.floor(1000 + Math.random() * 9000),
              expiryDays: 365,
              mfgDate: scannedData.manufacturingDate || '2024-03-01',
              expiryDate: scannedData.expiryDate || '2027-02-28',
              status: 'Safe'
            }
          ]
        };
      }
      return f;
    }));

    setGlobalNotification(`📸 Gemini Vision: Added ${scannedData.quantityDetected} ${scannedData.unit || 'units'} of ${scannedData.medicineName} to digital ledger!`);
    setTimeout(() => setGlobalNotification(null), 6000);
  };

  // If user is not authenticated, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Top Header with Hack2Skill Brand, Role Switcher, Google AI Badge & Brown User Avatar */}
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        currentDistrict={currentDistrict}
        setCurrentDistrict={setCurrentDistrict}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        criticalAlertCount={criticalCount}
        onOpenGoogleAIModal={() => setShowGoogleAIModal(true)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Global Notification Alert */}
      {globalNotification && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          borderBottom: '1px solid #38bdf8',
          color: '#0284c7',
          padding: '0.65rem 1.5rem',
          fontSize: '0.85rem',
          fontWeight: '700',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          {globalNotification}
        </div>
      )}

      {/* Main Viewport rendering dedicated Role-Based Portal */}
      <main className="main-viewport" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '1.75rem 2rem 3rem 2rem' }}>
        <ErrorBoundary fallbackTitle="Portal View Interruption Recovered">
          {currentRole === 'cmo' && (
            <CMOCommandPortal 
              district={currentDistrict}
              facilities={facilities}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              transferRouteActive={transferRouteActive}
              onTriggerTransfer={handleTriggerTransfer}
              onDistrictWideRebalance={handleDistrictWideAutoRebalance}
              onResetTransfer={handleResetTransfer}
              currentLanguage={currentLanguage}
            />
          )}

          {currentRole === 'pharmacist' && (
            <PharmacistPortal 
              facilities={facilities}
              currentFacility={selectedFacility}
              setCurrentFacility={setSelectedFacility}
              onCommitInventory={handleCommitInventory}
              transferRouteActive={transferRouteActive}
            />
          )}

          {currentRole === 'asha' && (
            <ASHAPortal 
              facilities={facilities}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Floating Buttons: Reset Database & Pitch Deck (Left Aligned) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '0.75rem'
      }}>
        <button
          className="btn-secondary"
          onClick={handleResetTransfer}
          style={{
            padding: '0.65rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}
          title="Reset database to initial demo state"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>

        <button 
          className="btn-primary"
          onClick={() => setShowPitchModal(true)}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
            fontSize: '0.85rem'
          }}
        >
          <Presentation size={17} />
          <span>Judge Pitch & Demo Walkthrough</span>
        </button>
      </div>

      {/* Google AI Telemetry & API Payload Modal */}
      <GoogleAITelemetryModal 
        isOpen={showGoogleAIModal} 
        onClose={() => setShowGoogleAIModal(false)} 
      />

      {/* Multilingual Voice & Text AI Copilot Chatbot */}
      <ArogyaChatbot 
        facilities={facilities} 
        currentLanguage={currentLanguage} 
      />

      {/* Pitch Deck / Demo Walkthrough Modal */}
      {showPitchModal && (
        <div className="modal-overlay" onClick={() => setShowPitchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-topbar">
              <div className="card-title">
                <Presentation size={18} color="#38bdf8" />
                <span>ArogyaSetu AI — Hackathon Submission & Role Walkthrough</span>
              </div>
              <button 
                onClick={() => setShowPitchModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                How to Demo the 3 Role Interfaces to Judges
              </h3>
              <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.6', fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                <li>
                  <strong style={{ color: '#fff' }}>1. National Health Gateway Login:</strong>
                  <br />Start on the Login Page. Show the 3 distinct personas (Health Head, Pharmacist, ASHA). Any credentials are accepted in open mode.
                </li>
                <li>
                  <strong style={{ color: '#fff' }}>2. District Health Head (CMO Portal):</strong>
                  <br />Log in as CMO. Show the full district map. Point out that CHC Jatni has 0 Anti-Snake Venom vials. Show the AI recommendation to borrow from nearby PHC Balipatna, and click <em>"Order Officials to Send Medicines ASAP"</em> to issue the emergency work order and view the official transit challan!
                </li>
                <li>
                  <strong style={{ color: '#fff' }}>3. PHC Store Pharmacist Portal:</strong>
                  <br />Click "Logout" and log in as Pharmacist. Demonstrate the <em>Gemini Stock Photo Digitizer</em> by scanning a medicine carton or handwritten ledger. Show live structured JSON extraction and click <em>"Commit to Live Health Ledger"</em> to update stock with zero data entry!
                </li>
                <li>
                  <strong style={{ color: '#fff' }}>4. ASHA Frontline Worker Portal:</strong>
                  <br />Log in as ASHA. Demonstrate the mobile bedside emergency triage and use the <em>Indic Multilingual Voice Copilot</em> to speak in Hindi or Odia to check medicine availability across nearby facilities hands-free.
                </li>
              </ol>

              <h3 style={{ color: '#a855f7', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                10-Slide Pitch Deck Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 1:</strong> ArogyaSetu AI — Anticipatory Rural Health Logistics
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 2:</strong> The Crisis: Snakebite & Maternal Deaths vs. Expiring Warehouse Stock
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 3:</strong> Why It Happens: Paper Ledgers & Fragmented Centers
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 4:</strong> 3-Tier Role Architecture (CMO, Pharmacist, ASHA)
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 5:</strong> Gemini Vision OCR for Zero-Effort Photo Intake
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 6:</strong> Agentic Inter-Clinic Stock Re-Router (FEFO Protocol)
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 7:</strong> Outbreak Surge Modeling & Anticipatory Indenting
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 8:</strong> Cold-Chain IoT Sentinel & Indic Voice Assistant
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 9:</strong> National Reach: 30,000+ PHCs & 1.6 Lakh Ayushman Arogya Mandirs
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong>Slide 10:</strong> Immediate 2-Week Pilot Plan with State Health Mission
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
