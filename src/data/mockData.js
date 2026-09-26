// ArogyaSetu AI — Ground-Truth Healthcare Data for Rural India
// Real-world facilities, National Essential Drugs List (EDL), and Outbreak Vectors

export const DISTRICTS = [
  {
    id: 'khordha',
    name: 'Khordha District',
    state: 'Odisha',
    headquarters: 'Bhubaneswar',
    center: [20.18, 85.68],
    zoom: 11,
    population: '2,251,673',
    phcCount: 28,
    chcCount: 8,
    primaryRisks: ['Monsoon Flooding', 'Viper/Krait Snakebites', 'Waterborne Cholera', 'Post-Cyclone Vector Surges']
  },
  {
    id: 'varanasi',
    name: 'Varanasi District',
    state: 'Uttar Pradesh',
    headquarters: 'Varanasi',
    center: [25.32, 82.98],
    zoom: 11,
    population: '3,676,841',
    phcCount: 36,
    chcCount: 10,
    primaryRisks: ['Seasonal Dengue', 'Encephalitis Vector Spikes', 'Cold-Wave Hypothermia', 'Respiratory Infections']
  }
];

export const ESSENTIAL_DRUGS = [
  {
    id: 'MED-ASV',
    name: 'Anti-Snake Venom (Polyvalent 10ml)',
    category: 'Emergency Life-Saving Antidote',
    tier: 'Critical Emergency',
    standardUnit: 'Vials',
    tempRequirement: '2°C - 8°C (Cold Chain)',
    criticalThreshold: 15,
    unitCostINR: 650,
    dailyBurnRateAvg: 3,
    description: 'Lyophilized polyvalent enzyme refined equine immunoglobulin against Russell’s viper, Common krait, Cobra & Saw-scaled viper.'
  },
  {
    id: 'MED-OXY',
    name: 'Oxytocin Injection IP (10 IU/ml)',
    category: 'Maternal Delivery Care',
    tier: 'Life-Saving Maternal',
    standardUnit: 'Ampoules',
    tempRequirement: '2°C - 8°C (Cold Chain)',
    criticalThreshold: 25,
    unitCostINR: 42,
    dailyBurnRateAvg: 5,
    description: 'Uterotonic drug to prevent post-partum hemorrhage (PPH), the leading cause of rural maternal mortality.'
  },
  {
    id: 'MED-ARV',
    name: 'Anti-Rabies Vaccine (Purified Vero Cell 2.5 IU)',
    category: 'Post-Exposure Prophylaxis',
    tier: 'Critical Emergency',
    standardUnit: 'Vials',
    tempRequirement: '2°C - 8°C (Strict Cold Chain)',
    criticalThreshold: 20,
    unitCostINR: 380,
    dailyBurnRateAvg: 4,
    description: 'Essential post-exposure rabies prophylaxis for rural animal bites (canine/stray bites).'
  },
  {
    id: 'MED-INS',
    name: 'Human Insulin Regular (100 IU/ml)',
    category: 'Chronic Endocrine Care',
    tier: 'Essential Chronic',
    standardUnit: 'Vials',
    tempRequirement: '2°C - 8°C (Strict Cold Chain)',
    criticalThreshold: 30,
    unitCostINR: 145,
    dailyBurnRateAvg: 6,
    description: 'Short-acting biosynthetic human regular insulin for diabetic glycemic control.'
  },
  {
    id: 'MED-ORS',
    name: 'Oral Rehydration Salts (ORS IP 20.5g)',
    category: 'Dehydration & Diarrheal Care',
    tier: 'Essential Primary',
    standardUnit: 'Sachets',
    tempRequirement: 'Ambient (< 30°C)',
    criticalThreshold: 100,
    unitCostINR: 18,
    dailyBurnRateAvg: 22,
    description: 'WHO low-osmolarity formulation for dehydration in acute waterborne diarrheal epidemics.'
  },
  {
    id: 'MED-AMX',
    name: 'Amoxicillin Trihydrate Disp. (250mg)',
    category: 'Broad-Spectrum Antibiotic',
    tier: 'Essential Primary',
    standardUnit: 'Strips (10 tabs)',
    tempRequirement: 'Ambient (< 25°C)',
    criticalThreshold: 50,
    unitCostINR: 35,
    dailyBurnRateAvg: 12,
    description: 'First-line antimicrobial for childhood pneumonia and acute respiratory bacterial infections.'
  },
  {
    id: 'MED-PCM',
    name: 'Paracetamol IV Infusion (1000mg/100ml)',
    category: 'Analgesic & Antipyretic',
    tier: 'Essential Secondary',
    standardUnit: 'Bottles',
    tempRequirement: 'Ambient (< 25°C)',
    criticalThreshold: 40,
    unitCostINR: 65,
    dailyBurnRateAvg: 10,
    description: 'Intravenous antipyretic for severe viral fevers, malaria, and dengue hyperpyrexia.'
  },
  {
    id: 'MED-PVT',
    name: 'Pentavalent Vaccine (DTP-HepB-Hib 0.5ml)',
    category: 'Universal Child Immunization',
    tier: 'Strict Pediatric',
    standardUnit: 'Vials',
    tempRequirement: '2°C - 8°C (Never Freeze)',
    criticalThreshold: 20,
    unitCostINR: 120,
    dailyBurnRateAvg: 3,
    description: 'Immunization against Diphtheria, Pertussis, Tetanus, Hepatitis B, and Haemophilus influenzae b.'
  }
];

export const INITIAL_FACILITIES = [
  {
    id: 'FAC-CDW-01',
    districtId: 'khordha',
    name: 'Khordha District Central Drug Warehouse (CMHO)',
    type: 'Central Warehouse',
    coordinates: [20.2961, 85.8245],
    inCharge: 'Dr. Debabrata Mishra (District CMO)',
    phone: '+91 94371 88201',
    totalBeds: 0,
    distanceFromHQ_KM: 0,
    overallHealth: 'Safe',
    coldChainOnline: true,
    fridgeTempC: 4.2,
    inventory: [
      { drugId: 'MED-ASV', stock: 450, batchNo: 'ASV-24B-098', expiryDays: 140, mfgDate: '2024-03-10', expiryDate: '2027-02-28', status: 'Safe' },
      { drugId: 'MED-OXY', stock: 1200, batchNo: 'OXY-24G-412', expiryDays: 210, mfgDate: '2024-05-15', expiryDate: '2026-11-30', status: 'Safe' },
      { drugId: 'MED-ARV', stock: 320, batchNo: 'ARV-24H-119', expiryDays: 180, mfgDate: '2024-04-01', expiryDate: '2026-08-31', status: 'Safe' },
      { drugId: 'MED-INS', stock: 600, batchNo: 'INS-24C-801', expiryDays: 95, mfgDate: '2024-01-20', expiryDate: '2025-12-15', status: 'Safe' },
      { drugId: 'MED-ORS', stock: 8500, batchNo: 'ORS-24K-302', expiryDays: 520, mfgDate: '2024-06-01', expiryDate: '2027-05-31', status: 'Safe' },
      { drugId: 'MED-AMX', stock: 2400, batchNo: 'AMX-24J-551', expiryDays: 340, mfgDate: '2024-02-12', expiryDate: '2026-06-30', status: 'Safe' },
      { drugId: 'MED-PCM', stock: 1100, batchNo: 'PCM-24E-904', expiryDays: 280, mfgDate: '2024-04-18', expiryDate: '2026-09-30', status: 'Safe' },
      { drugId: 'MED-PVT', stock: 290, batchNo: 'PVT-24F-220', expiryDays: 160, mfgDate: '2024-03-22', expiryDate: '2026-07-31', status: 'Safe' }
    ]
  },
  {
    id: 'FAC-CHC-JATNI',
    districtId: 'khordha',
    name: 'CHC Jatni (Sub-Divisional Hospital)',
    type: 'Community Health Centre (Block Hub)',
    coordinates: [20.1652, 85.7063],
    inCharge: 'Dr. Smita Pattnaik (Medical Officer)',
    phone: '+91 98610 44102',
    totalBeds: 50,
    distanceFromHQ_KM: 18.5,
    overallHealth: 'Critical Stock-Out',
    coldChainOnline: true,
    fridgeTempC: 3.8,
    inventory: [
      { drugId: 'MED-ASV', stock: 0, batchNo: 'EXHAUSTED', expiryDays: 0, mfgDate: 'N/A', expiryDate: 'N/A', status: 'Critical Stock-Out' },
      { drugId: 'MED-OXY', stock: 14, batchNo: 'OXY-24B-110', expiryDays: 85, mfgDate: '2024-02-10', expiryDate: '2025-11-30', status: 'Low Stock' },
      { drugId: 'MED-ARV', stock: 2, batchNo: 'ARV-23M-902', expiryDays: 28, mfgDate: '2023-11-15', expiryDate: '2025-09-30', status: 'Critical Stock-Out' },
      { drugId: 'MED-INS', stock: 8, batchNo: 'INS-24A-440', expiryDays: 60, mfgDate: '2024-01-10', expiryDate: '2025-10-31', status: 'Critical Stock-Out' },
      { drugId: 'MED-ORS', stock: 180, batchNo: 'ORS-24D-712', expiryDays: 410, mfgDate: '2024-03-01', expiryDate: '2027-02-28', status: 'Safe' },
      { drugId: 'MED-AMX', stock: 35, batchNo: 'AMX-24C-091', expiryDays: 210, mfgDate: '2024-01-25', expiryDate: '2026-01-31', status: 'Low Stock' },
      { drugId: 'MED-PCM', stock: 12, batchNo: 'PCM-24A-210', expiryDays: 140, mfgDate: '2024-02-05', expiryDate: '2026-01-31', status: 'Critical Stock-Out' },
      { drugId: 'MED-PVT', stock: 18, batchNo: 'PVT-24C-714', expiryDays: 110, mfgDate: '2024-02-14', expiryDate: '2026-04-30', status: 'Safe' }
    ],
    subCentres: [
      {
        id: 'SC-JAT-01',
        name: 'Kantabad HWC / Sub-Centre',
        type: 'Health & Wellness Centre',
        inCharge: 'Sister Rita Swain (ANM Lead)',
        phone: '+91 94378 11029',
        distanceKM: 6.2,
        populationServed: '4,850',
        overallHealth: 'Critical Deficit',
        inventory: [
          { drugId: 'MED-ASV', stock: 0, batchNo: 'EXHAUSTED', expiryDays: 0, status: 'Critical Stock-Out' },
          { drugId: 'MED-OXY', stock: 2, batchNo: 'OXY-24A-090', expiryDays: 45, status: 'Critical Stock-Out' },
          { drugId: 'MED-ARV', stock: 0, batchNo: 'EXHAUSTED', expiryDays: 0, status: 'Critical Stock-Out' },
          { drugId: 'MED-INS', stock: 3, batchNo: 'INS-24A-210', expiryDays: 40, status: 'Critical Stock-Out' },
          { drugId: 'MED-ORS', stock: 95, batchNo: 'ORS-24D-712', expiryDays: 410, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 15, batchNo: 'AMX-24C-091', expiryDays: 210, status: 'Low Stock' },
          { drugId: 'MED-PCM', stock: 8, batchNo: 'PCM-24A-210', expiryDays: 140, status: 'Critical Stock-Out' },
          { drugId: 'MED-PVT', stock: 4, batchNo: 'PVT-24C-714', expiryDays: 110, status: 'Low Stock' }
        ]
      },
      {
        id: 'SC-JAT-02',
        name: 'Padanpur Sub-Centre',
        type: 'Sub-Centre',
        inCharge: 'Sister Manju Das (ANM)',
        phone: '+91 94371 44820',
        distanceKM: 8.5,
        populationServed: '3,200',
        overallHealth: 'Safe',
        inventory: [
          { drugId: 'MED-ASV', stock: 8, batchNo: 'ASV-24B-019', expiryDays: 120, status: 'Safe' },
          { drugId: 'MED-OXY', stock: 12, batchNo: 'OXY-24C-112', expiryDays: 150, status: 'Safe' },
          { drugId: 'MED-ARV', stock: 6, batchNo: 'ARV-24A-402', expiryDays: 95, status: 'Safe' },
          { drugId: 'MED-INS', stock: 10, batchNo: 'INS-24B-101', expiryDays: 80, status: 'Safe' },
          { drugId: 'MED-ORS', stock: 120, batchNo: 'ORS-24E-002', expiryDays: 390, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 40, batchNo: 'AMX-24D-119', expiryDays: 230, status: 'Safe' },
          { drugId: 'MED-PCM', stock: 25, batchNo: 'PCM-24C-302', expiryDays: 180, status: 'Safe' },
          { drugId: 'MED-PVT', stock: 8, batchNo: 'PVT-24E-901', expiryDays: 130, status: 'Safe' }
        ]
      },
      {
        id: 'SC-JAT-03',
        name: 'Jatni Ward-4 Urban Health Post',
        type: 'Urban Health Post',
        inCharge: 'Dr. R. K. Behera (MO In-Charge)',
        phone: '+91 98612 00192',
        distanceKM: 2.1,
        populationServed: '6,100',
        overallHealth: 'Low Stock',
        inventory: [
          { drugId: 'MED-ASV', stock: 4, batchNo: 'ASV-24B-088', expiryDays: 110, status: 'Low Stock' },
          { drugId: 'MED-OXY', stock: 18, batchNo: 'OXY-24D-001', expiryDays: 140, status: 'Safe' },
          { drugId: 'MED-ARV', stock: 3, batchNo: 'ARV-24B-210', expiryDays: 55, status: 'Low Stock' },
          { drugId: 'MED-INS', stock: 5, batchNo: 'INS-24B-119', expiryDays: 50, status: 'Low Stock' },
          { drugId: 'MED-ORS', stock: 210, batchNo: 'ORS-24F-110', expiryDays: 450, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 22, batchNo: 'AMX-24E-301', expiryDays: 190, status: 'Low Stock' },
          { drugId: 'MED-PCM', stock: 30, batchNo: 'PCM-24D-019', expiryDays: 160, status: 'Safe' },
          { drugId: 'MED-PVT', stock: 12, batchNo: 'PVT-24F-014', expiryDays: 140, status: 'Safe' }
        ]
      }
    ]
  },
  {
    id: 'FAC-PHC-BALIPATNA',
    districtId: 'khordha',
    name: 'PHC Balipatna (Rural Health Center)',
    type: 'Primary Health Centre (Hub)',
    coordinates: [20.1420, 85.9230],
    inCharge: 'Dr. Asit Mohanty (Pharmacist In-charge)',
    phone: '+91 97782 55319',
    totalBeds: 12,
    distanceFromHQ_KM: 24.2,
    overallHealth: 'Surplus Near Expiry',
    coldChainOnline: true,
    fridgeTempC: 4.5,
    inventory: [
      { drugId: 'MED-ASV', stock: 140, batchNo: 'ASV-23X-990', expiryDays: 32, mfgDate: '2023-09-12', expiryDate: '2025-10-30', status: 'Surplus Near Expiry' },
      { drugId: 'MED-OXY', stock: 45, batchNo: 'OXY-24D-812', expiryDays: 190, mfgDate: '2024-04-01', expiryDate: '2026-09-30', status: 'Safe' },
      { drugId: 'MED-ARV', stock: 48, batchNo: 'ARV-24D-303', expiryDays: 145, mfgDate: '2024-03-15', expiryDate: '2026-06-30', status: 'Safe' },
      { drugId: 'MED-INS', stock: 52, batchNo: 'INS-24B-605', expiryDays: 110, mfgDate: '2024-02-20', expiryDate: '2026-02-28', status: 'Safe' },
      { drugId: 'MED-ORS', stock: 420, batchNo: 'ORS-24F-881', expiryDays: 450, mfgDate: '2024-04-10', expiryDate: '2027-03-31', status: 'Safe' },
      { drugId: 'MED-AMX', stock: 95, batchNo: 'AMX-24E-419', expiryDays: 290, mfgDate: '2024-03-25', expiryDate: '2026-08-31', status: 'Safe' },
      { drugId: 'MED-PCM', stock: 68, batchNo: 'PCM-24C-710', expiryDays: 220, mfgDate: '2024-03-01', expiryDate: '2026-06-30', status: 'Safe' },
      { drugId: 'MED-PVT', stock: 24, batchNo: 'PVT-24E-101', expiryDays: 140, mfgDate: '2024-03-10', expiryDate: '2026-05-31', status: 'Safe' }
    ],
    subCentres: [
      {
        id: 'SC-BAL-01',
        name: 'Rajas Sub-Centre',
        type: 'Sub-Centre',
        inCharge: 'Sister Pramila Jena',
        phone: '+91 94373 99201',
        distanceKM: 4.8,
        populationServed: '3,800',
        overallHealth: 'Safe',
        inventory: [
          { drugId: 'MED-ASV', stock: 15, batchNo: 'ASV-23X-990', expiryDays: 32, status: 'Surplus Near Expiry' },
          { drugId: 'MED-OXY', stock: 10, batchNo: 'OXY-24D-812', expiryDays: 190, status: 'Safe' },
          { drugId: 'MED-ARV', stock: 8, batchNo: 'ARV-24D-303', expiryDays: 145, status: 'Safe' },
          { drugId: 'MED-INS', stock: 12, batchNo: 'INS-24B-605', expiryDays: 110, status: 'Safe' },
          { drugId: 'MED-ORS', stock: 110, batchNo: 'ORS-24F-881', expiryDays: 450, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 30, batchNo: 'AMX-24E-419', expiryDays: 290, status: 'Safe' },
          { drugId: 'MED-PCM', stock: 20, batchNo: 'PCM-24C-710', expiryDays: 220, status: 'Safe' },
          { drugId: 'MED-PVT', stock: 6, batchNo: 'PVT-24E-101', expiryDays: 140, status: 'Safe' }
        ]
      },
      {
        id: 'SC-BAL-02',
        name: 'Banamalipur HWC / Sub-Centre',
        type: 'Health & Wellness Centre',
        inCharge: 'ANM Bharati Mishra',
        phone: '+91 97781 44092',
        distanceKM: 7.2,
        populationServed: '4,200',
        overallHealth: 'Surplus Near Expiry',
        inventory: [
          { drugId: 'MED-ASV', stock: 20, batchNo: 'ASV-23X-990', expiryDays: 32, status: 'Surplus Near Expiry' },
          { drugId: 'MED-OXY', stock: 14, batchNo: 'OXY-24D-812', expiryDays: 190, status: 'Safe' },
          { drugId: 'MED-ARV', stock: 10, batchNo: 'ARV-24D-303', expiryDays: 145, status: 'Safe' },
          { drugId: 'MED-INS', stock: 14, batchNo: 'INS-24B-605', expiryDays: 110, status: 'Safe' },
          { drugId: 'MED-ORS', stock: 140, batchNo: 'ORS-24F-881', expiryDays: 450, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 35, batchNo: 'AMX-24E-419', expiryDays: 290, status: 'Safe' },
          { drugId: 'MED-PCM', stock: 22, batchNo: 'PCM-24C-710', expiryDays: 220, status: 'Safe' },
          { drugId: 'MED-PVT', stock: 8, batchNo: 'PVT-24E-101', expiryDays: 140, status: 'Safe' }
        ]
      }
    ]
  },
  {
    id: 'FAC-PHC-BEGUNIA',
    districtId: 'khordha',
    name: 'PHC Begunia (Tribal Belt Sub-Center)',
    type: 'Primary Health Centre (Hub)',
    coordinates: [20.2104, 85.4612],
    inCharge: 'Sister Laxmipriya Dash (ANM Lead)',
    phone: '+91 94380 12890',
    totalBeds: 10,
    distanceFromHQ_KM: 42.0,
    overallHealth: 'Low Stock',
    coldChainOnline: false,
    fridgeTempC: 7.9,
    inventory: [
      { drugId: 'MED-ASV', stock: 4, batchNo: 'ASV-24A-312', expiryDays: 90, mfgDate: '2024-01-15', expiryDate: '2025-12-31', status: 'Critical Stock-Out' },
      { drugId: 'MED-OXY', stock: 8, batchNo: 'OXY-24A-214', expiryDays: 75, mfgDate: '2024-01-12', expiryDate: '2025-11-15', status: 'Critical Stock-Out' },
      { drugId: 'MED-ARV', stock: 5, batchNo: 'ARV-24B-550', expiryDays: 80, mfgDate: '2024-02-01', expiryDate: '2025-11-30', status: 'Critical Stock-Out' },
      { drugId: 'MED-INS', stock: 6, batchNo: 'INS-24A-901', expiryDays: 65, mfgDate: '2024-01-18', expiryDate: '2025-11-20', status: 'Critical Stock-Out' },
      { drugId: 'MED-ORS', stock: 65, batchNo: 'ORS-24C-112', expiryDays: 380, mfgDate: '2024-02-15', expiryDate: '2027-01-31', status: 'Low Stock' },
      { drugId: 'MED-AMX', stock: 18, batchNo: 'AMX-24B-309', expiryDays: 160, mfgDate: '2024-02-01', expiryDate: '2026-03-31', status: 'Critical Stock-Out' },
      { drugId: 'MED-PCM', stock: 14, batchNo: 'PCM-24B-880', expiryDays: 170, mfgDate: '2024-02-10', expiryDate: '2026-04-30', status: 'Critical Stock-Out' },
      { drugId: 'MED-PVT', stock: 6, batchNo: 'PVT-24B-331', expiryDays: 85, mfgDate: '2024-02-05', expiryDate: '2025-12-31', status: 'Critical Stock-Out' }
    ],
    subCentres: [
      {
        id: 'SC-BEG-01',
        name: 'Siko Tribal HWC / Sub-Centre',
        type: 'Tribal Health & Wellness Centre',
        inCharge: 'ANM Sabitri Nayak',
        phone: '+91 94382 77014',
        distanceKM: 9.4,
        populationServed: '2,900',
        overallHealth: 'Critical Deficit',
        inventory: [
          { drugId: 'MED-ASV', stock: 0, batchNo: 'EXHAUSTED', expiryDays: 0, status: 'Critical Stock-Out' },
          { drugId: 'MED-OXY', stock: 1, batchNo: 'OXY-24A-214', expiryDays: 75, status: 'Critical Stock-Out' },
          { drugId: 'MED-ARV', stock: 0, batchNo: 'EXHAUSTED', expiryDays: 0, status: 'Critical Stock-Out' },
          { drugId: 'MED-INS', stock: 1, batchNo: 'INS-24A-901', expiryDays: 65, status: 'Critical Stock-Out' },
          { drugId: 'MED-ORS', stock: 25, batchNo: 'ORS-24C-112', expiryDays: 380, status: 'Low Stock' },
          { drugId: 'MED-AMX', stock: 6, batchNo: 'AMX-24B-309', expiryDays: 160, status: 'Critical Stock-Out' },
          { drugId: 'MED-PCM', stock: 5, batchNo: 'PCM-24B-880', expiryDays: 170, status: 'Critical Stock-Out' },
          { drugId: 'MED-PVT', stock: 2, batchNo: 'PVT-24B-331', expiryDays: 85, status: 'Critical Stock-Out' }
        ]
      },
      {
        id: 'SC-BEG-02',
        name: 'Bolagarh Border Post Sub-Centre',
        type: 'Sub-Centre',
        inCharge: 'ANM Kalyani Rout',
        phone: '+91 94389 55102',
        distanceKM: 12.0,
        populationServed: '3,400',
        overallHealth: 'Critical Deficit',
        inventory: [
          { drugId: 'MED-ASV', stock: 1, batchNo: 'ASV-24A-312', expiryDays: 90, status: 'Critical Stock-Out' },
          { drugId: 'MED-OXY', stock: 2, batchNo: 'OXY-24A-214', expiryDays: 75, status: 'Critical Stock-Out' },
          { drugId: 'MED-ARV', stock: 1, batchNo: 'ARV-24B-550', expiryDays: 80, status: 'Critical Stock-Out' },
          { drugId: 'MED-INS', stock: 2, batchNo: 'INS-24A-901', expiryDays: 65, status: 'Critical Stock-Out' },
          { drugId: 'MED-ORS', stock: 30, batchNo: 'ORS-24C-112', expiryDays: 380, status: 'Low Stock' },
          { drugId: 'MED-AMX', stock: 8, batchNo: 'AMX-24B-309', expiryDays: 160, status: 'Critical Stock-Out' },
          { drugId: 'MED-PCM', stock: 6, batchNo: 'PCM-24B-880', expiryDays: 170, status: 'Critical Stock-Out' },
          { drugId: 'MED-PVT', stock: 2, batchNo: 'PVT-24B-331', expiryDays: 85, status: 'Critical Stock-Out' }
        ]
      }
    ]
  },
  {
    id: 'FAC-CHC-BANAPUR',
    districtId: 'khordha',
    name: 'CHC Banapur (Chilika Lake Coast)',
    type: 'Community Health Centre (Block Hub)',
    coordinates: [19.7820, 85.1810],
    inCharge: 'Dr. N. K. Tripathy',
    phone: '+91 98532 99014',
    totalBeds: 40,
    distanceFromHQ_KM: 78.0,
    overallHealth: 'Safe',
    coldChainOnline: true,
    fridgeTempC: 4.1,
    inventory: [
      { drugId: 'MED-ASV', stock: 32, batchNo: 'ASV-24C-501', expiryDays: 180, mfgDate: '2024-03-10', expiryDate: '2026-08-31', status: 'Safe' },
      { drugId: 'MED-OXY', stock: 58, batchNo: 'OXY-24E-220', expiryDays: 240, mfgDate: '2024-04-12', expiryDate: '2026-10-31', status: 'Safe' },
      { drugId: 'MED-ARV', stock: 26, batchNo: 'ARV-24E-904', expiryDays: 190, mfgDate: '2024-04-01', expiryDate: '2026-09-30', status: 'Safe' },
      { drugId: 'MED-INS', stock: 45, batchNo: 'INS-24C-112', expiryDays: 130, mfgDate: '2024-03-05', expiryDate: '2026-04-30', status: 'Safe' },
      { drugId: 'MED-ORS', stock: 520, batchNo: 'ORS-24G-771', expiryDays: 480, mfgDate: '2024-05-01', expiryDate: '2027-04-30', status: 'Safe' },
      { drugId: 'MED-AMX', stock: 110, batchNo: 'AMX-24F-201', expiryDays: 310, mfgDate: '2024-04-15', expiryDate: '2026-09-30', status: 'Safe' },
      { drugId: 'MED-PCM', stock: 74, batchNo: 'PCM-24D-412', expiryDays: 240, mfgDate: '2024-03-20', expiryDate: '2026-07-31', status: 'Safe' },
      { drugId: 'MED-PVT', stock: 30, batchNo: 'PVT-24F-809', expiryDays: 175, mfgDate: '2024-04-02', expiryDate: '2026-08-31', status: 'Safe' }
    ],
    subCentres: [
      {
        id: 'SC-BAN-01',
        name: 'Chilika Lake Shore HWC',
        type: 'Coastal Health & Wellness Centre',
        inCharge: 'ANM Sujata Mohapatra',
        phone: '+91 98533 11045',
        distanceKM: 11.2,
        populationServed: '3,100',
        overallHealth: 'Safe',
        inventory: [
          { drugId: 'MED-ASV', stock: 6, batchNo: 'ASV-24C-501', expiryDays: 180, status: 'Safe' },
          { drugId: 'MED-OXY', stock: 12, batchNo: 'OXY-24E-220', expiryDays: 240, status: 'Safe' },
          { drugId: 'MED-ARV', stock: 5, batchNo: 'ARV-24E-904', expiryDays: 190, status: 'Safe' },
          { drugId: 'MED-INS', stock: 8, batchNo: 'INS-24C-112', expiryDays: 130, status: 'Safe' },
          { drugId: 'MED-ORS', stock: 180, batchNo: 'ORS-24G-771', expiryDays: 480, status: 'Safe' },
          { drugId: 'MED-AMX', stock: 35, batchNo: 'AMX-24F-201', expiryDays: 310, status: 'Safe' },
          { drugId: 'MED-PCM', stock: 24, batchNo: 'PCM-24D-412', expiryDays: 240, status: 'Safe' },
          { drugId: 'MED-PVT', stock: 8, batchNo: 'PVT-24F-809', expiryDays: 175, status: 'Safe' }
        ]
      }
    ]
  },
  {
    id: 'FAC-PHC-TANGI',
    districtId: 'khordha',
    name: 'PHC Tangi (Highway Trauma Sub-Center)',
    type: 'Primary Health Centre (Hub)',
    coordinates: [19.9230, 85.3940],
    inCharge: 'Dr. Rashmi Ranjan Sahoo',
    phone: '+91 97761 40381',
    totalBeds: 16,
    distanceFromHQ_KM: 61.5,
    overallHealth: 'Low Stock',
    coldChainOnline: true,
    fridgeTempC: 5.1,
    inventory: [
      { drugId: 'MED-ASV', stock: 6, batchNo: 'ASV-24B-109', expiryDays: 70, mfgDate: '2024-01-20', expiryDate: '2025-11-30', status: 'Critical Stock-Out' },
      { drugId: 'MED-OXY', stock: 9, batchNo: 'OXY-24C-401', expiryDays: 110, mfgDate: '2024-02-15', expiryDate: '2026-01-31', status: 'Critical Stock-Out' },
      { drugId: 'MED-ARV', stock: 12, batchNo: 'ARV-24C-719', expiryDays: 95, mfgDate: '2024-02-10', expiryDate: '2025-12-31', status: 'Low Stock' },
      { drugId: 'MED-INS', stock: 14, batchNo: 'INS-24B-220', expiryDays: 85, mfgDate: '2024-02-01', expiryDate: '2025-12-15', status: 'Low Stock' },
      { drugId: 'MED-ORS', stock: 90, batchNo: 'ORS-24E-330', expiryDays: 420, mfgDate: '2024-03-15', expiryDate: '2027-02-28', status: 'Low Stock' },
      { drugId: 'MED-AMX', stock: 28, batchNo: 'AMX-24D-190', expiryDays: 200, mfgDate: '2024-02-28', expiryDate: '2026-05-31', status: 'Low Stock' },
      { drugId: 'MED-PCM', stock: 22, batchNo: 'PCM-24C-091', expiryDays: 190, mfgDate: '2024-02-18', expiryDate: '2026-04-30', status: 'Low Stock' },
      { drugId: 'MED-PVT', stock: 10, batchNo: 'PVT-24D-402', expiryDays: 105, mfgDate: '2024-02-22', expiryDate: '2026-03-31', status: 'Low Stock' }
    ]
  }
];

export const EPIDEMIC_SURGE_SCENARIOS = [
  {
    id: 'surge-monsoon-flood',
    title: 'Monsoon Flash Flooding & Inundation',
    icon: 'CloudRain',
    description: 'Baitarani and Daya river cresting; waterlogging across agricultural fields drives venomous snakes into human dwellings and contaminates rural borewells.',
    impactedDrugs: [
      { drugId: 'MED-ASV', surgeMultiplier: 4.2, alertText: 'Extreme Snakebite surge (+320%)' },
      { drugId: 'MED-ORS', surgeMultiplier: 3.5, alertText: 'Acute Diarrhea / Cholera spike (+250%)' },
      { drugId: 'MED-AMX', surgeMultiplier: 2.1, alertText: 'Secondary respiratory & skin infections' }
    ],
    recommendedAction: 'Pre-position 80 vials of ASV at CHC Jatni and PHC Begunia. Activate bike courier from PHC Balipatna surplus.'
  },
  {
    id: 'surge-dengue-fever',
    title: 'Post-Monsoon Dengue & Febrile Epidemic',
    icon: 'Bug',
    description: 'Stagnant water vector breeding leading to acute dengue hemorrhagic fever outbreaks and hyperpyrexia.',
    impactedDrugs: [
      { drugId: 'MED-PCM', surgeMultiplier: 3.8, alertText: 'Severe Hyperpyrexia IV fluid surge (+280%)' },
      { drugId: 'MED-ORS', surgeMultiplier: 2.4, alertText: 'Dehydration electrolyte replenishment (+140%)' },
      { drugId: 'MED-AMX', surgeMultiplier: 1.8, alertText: 'Secondary bacterial prophylaxis' }
    ],
    recommendedAction: 'De-stock non-urgent facilities to supply Central Warehouse and high-footfall CHCs with Paracetamol IV bottles.'
  },
  {
    id: 'surge-canine-bite',
    title: 'Semi-Urban Stray Canine Aggression Cluster',
    icon: 'ShieldAlert',
    description: 'Seasonal rabies exposure clusters reported near rural market yards and slaughterhouse waste dumps.',
    impactedDrugs: [
      { drugId: 'MED-ARV', surgeMultiplier: 3.1, alertText: 'Critical Anti-Rabies post-exposure surge (+210%)' }
    ],
    recommendedAction: 'Emergency dispatch of 50 Anti-Rabies vials from CDW directly to CHC Jatni.'
  }
];

export const DEMO_PRESET_IMAGES = [
  {
    id: 'demo-asv-box',
    name: 'Anti-Snake Venom Packaging Box',
    type: 'Carton Cover with Drug Name & Batch',
    thumbUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%230b1329"/><rect x="40" y="40" width="520" height="320" rx="16" fill="%23ffffff" stroke="%2338bdf8" stroke-width="4"/><rect x="40" y="40" width="520" height="70" rx="16" fill="%230284c7"/><text x="70" y="85" fill="%23ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">GOVERNMENT OF INDIA - NHM SUPPLY</text><text x="70" y="150" fill="%230f172a" font-family="Arial, sans-serif" font-size="26" font-weight="900">ANTI-SNAKE VENOM SERUM IP</text><text x="70" y="180" fill="%230369a1" font-family="Arial, sans-serif" font-size="16" font-weight="bold">POLYVALENT LYOPHILIZED 10ml VIAL</text><rect x="70" y="200" width="460" height="2" fill="%23e2e8f0"/><g font-family="Courier, monospace" font-size="15" fill="%23334155" font-weight="bold"><text x="70" y="235">BATCH NO:   ASV-24K-8812</text><text x="70" y="265">MFG DATE:   APR 2024</text><text x="70" y="295">EXP DATE:   MAR 2027</text><text x="320" y="235">QTY: 40 VIALS</text><text x="320" y="265">STORAGE: 2°C - 8°C</text><text x="320" y="295">MFG: BHARAT SERUMS</text></g><rect x="70" y="315" width="220" height="26" rx="6" fill="%23eff6ff" stroke="%2338bdf8"/><text x="80" y="333" fill="%230284c7" font-family="Arial, sans-serif" font-size="12" font-weight="bold">❄️ COLD CHAIN REQUIRED</text><rect x="360" y="315" width="170" height="26" fill="%230f172a"/><g fill="%23ffffff"><rect x="370" y="318" width="4" height="20"/><rect x="378" y="318" width="2" height="20"/><rect x="384" y="318" width="6" height="20"/><rect x="394" y="318" width="3" height="20"/><rect x="402" y="318" width="5" height="20"/><rect x="412" y="318" width="2" height="20"/><rect x="418" y="318" width="7" height="20"/><rect x="430" y="318" width="4" height="20"/><rect x="438" y="318" width="2" height="20"/><rect x="446" y="318" width="5" height="20"/><rect x="456" y="318" width="3" height="20"/><rect x="464" y="318" width="6" height="20"/><rect x="476" y="318" width="3" height="20"/><rect x="484" y="318" width="8" height="20"/><rect x="496" y="318" width="4" height="20"/><rect x="504" y="318" width="5" height="20"/><rect x="514" y="318" width="3" height="20"/></g></svg>`,
    mockExtracted: {
      medicineName: 'Anti-Snake Venom (Polyvalent 10ml Lyophilized)',
      manufacturer: 'Bharat Serums and Vaccines Ltd',
      batchNumber: 'ASV-24K-8812',
      manufacturingDate: '2024-04-18',
      expiryDate: '2027-03-31',
      quantityDetected: 40,
      unit: 'Vials',
      temperatureRequirement: '2°C - 8°C (Refrigerated Cold-Chain)',
      isColdChain: true,
      confidenceScore: 0.99,
      notes: 'Freeze-dried enzyme-purified equine globulins. Reconstitute with 10ml sterile water for injection.'
    }
  },
  {
    id: 'demo-tablet-strip',
    name: 'Ciprofloxacin 500mg Tablet Blister Cover',
    type: 'Tablet Blister Foil with Printed Name',
    thumbUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%2309111e"/><rect x="40" y="40" width="520" height="320" rx="16" fill="%23f1f5f9" stroke="%2394a3b8" stroke-width="4"/><g opacity="0.15"><line x1="40" y1="90" x2="560" y2="90" stroke="%23475569" stroke-width="2"/><line x1="40" y1="150" x2="560" y2="150" stroke="%23475569" stroke-width="2"/><line x1="40" y1="210" x2="560" y2="210" stroke="%23475569" stroke-width="2"/><line x1="40" y1="270" x2="560" y2="270" stroke="%23475569" stroke-width="2"/><line x1="40" y1="330" x2="560" y2="330" stroke="%23475569" stroke-width="2"/></g><rect x="60" y="60" width="480" height="60" rx="8" fill="%231e293b"/><text x="80" y="100" fill="%2338bdf8" font-family="Arial, sans-serif" font-size="24" font-weight="900">CIPROFLOXACIN TABLETS IP 500mg</text><text x="80" y="145" fill="%23334155" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Each film coated tablet contains: Ciprofloxacin Hydrochloride IP eq. to Ciprofloxacin 500mg</text><rect x="60" y="165" width="480" height="2" fill="%23cbd5e1"/><g font-family="Courier, monospace" font-size="16" fill="%230f172a" font-weight="bold"><text x="80" y="205">B.No. CIP-24M-4019</text><text x="320" y="205">MFG. MAY 2024</text><text x="80" y="240">EXP.  DEC 2026</text><text x="320" y="240">PACK: 10 x 10 TABLETS</text><text x="80" y="275">M.R.P. GOVT SUPPLY (FREE)</text><text x="320" y="275">MFG: CIPLA PHARMA LTD</text></g><rect x="60" y="295" width="260" height="45" rx="8" fill="%23fee2e2" stroke="%23ef4444"/><text x="75" y="322" fill="%23b91c1c" font-family="Arial, sans-serif" font-size="12" font-weight="bold">SCHEDULE H PRESCRIPTION DRUG</text><rect x="360" y="300" width="180" height="35" fill="%230f172a" rx="4"/><text x="385" y="323" fill="%2338bdf8" font-family="Courier, monospace" font-size="14" font-weight="bold">SCAN VERIFIED %23OK</text></svg>`,
    mockExtracted: {
      medicineName: 'Ciprofloxacin Tablets IP 500mg',
      manufacturer: 'Cipla Pharmaceuticals (Govt Supply)',
      batchNumber: 'CIP-24M-4019',
      manufacturingDate: '2024-05-10',
      expiryDate: '2026-12-31',
      quantityDetected: 100,
      unit: 'Tablets (10 Strips)',
      temperatureRequirement: 'Store below 30°C. Protect from light.',
      isColdChain: false,
      confidenceScore: 0.97,
      notes: 'Broad-spectrum antibiotic. Strip printed label detected with high OCR fidelity.'
    }
  },
  {
    id: 'demo-handwritten-register',
    name: 'Handwritten Paper Stock Register / Slip',
    type: 'Paper Ledger Entry (Odia / English)',
    thumbUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%2309111e"/><rect x="40" y="40" width="520" height="320" rx="10" fill="%23fef9c3" stroke="%23ca8a04" stroke-width="3"/><g stroke="%2393c5fd" stroke-width="1.5"><line x1="40" y1="80" x2="560" y2="80"/><line x1="40" y1="120" x2="560" y2="120"/><line x1="40" y1="160" x2="560" y2="160"/><line x1="40" y1="200" x2="560" y2="200"/><line x1="40" y1="240" x2="560" y2="240"/><line x1="40" y1="280" x2="560" y2="280"/><line x1="40" y1="320" x2="560" y2="320"/></g><line x1="120" y1="40" x2="120" y2="360" stroke="%23f87171" stroke-width="2"/><text x="140" y="70" fill="%231e293b" font-family="Georgia, serif" font-size="18" font-weight="bold">PHC Dispensary Daily Stock Register (Entry %23104)</text><g font-family="Georgia, serif" font-size="17" fill="%231e3a8a" font-style="italic"><text x="140" y="110">Drug: ORS Sachets 20.5g (Oral Salt)</text><text x="140" y="150">Batch No: ORS-24F-319</text><text x="140" y="190">Received Qty: 250 Sachets (10 Boxes)</text><text x="140" y="230">Expiry: Feb 2027  |  Mfg: FDC Ltd</text><text x="140" y="270">Condition: Good, Dry Storage Box %233</text><text x="140" y="310">Verified by: P. Dash, Pharmacist In-Charge</text></g><rect x="420" y="315" width="130" height="36" rx="6" fill="%23dbeafe" stroke="%233b82f6"/><text x="432" y="338" fill="%231d4ed8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">OCR Extracted ✍️</text></svg>`,
    mockExtracted: {
      medicineName: 'Oral Rehydration Salts (ORS IP 20.5g Sachets)',
      manufacturer: 'FDC Limited (Govt Supply)',
      batchNumber: 'ORS-24F-319',
      manufacturingDate: '2024-03-10',
      expiryDate: '2027-02-28',
      quantityDetected: 250,
      unit: 'Sachets',
      temperatureRequirement: 'Ambient Dry (< 30°C)',
      isColdChain: false,
      confidenceScore: 0.95,
      notes: 'Handwritten ledger slip extracted via Multimodal OCR. Pharmacist signature verified.'
    }
  }
];

export const FEDERATED_STATE_NODES = [
  {
    stateId: 'ODISHA',
    stateName: 'Odisha State Health Grid',
    districtCluster: 'Khordha & Coastal Belt',
    nodeStatus: 'ONLINE (Edge Node #OD-08)',
    activeVectorModel: 'Monsoon Flash Flooding & Leptospirosis/ASV Vector',
    localEpoch: 48,
    dataPrivacyStatus: 'Differential Privacy (ε=0.5, δ=1e-5) Active — Raw Records Local',
    sharedSurgeMultiplier: 3.8,
    criticalDrugDemand: 'Anti-Snake Venom & ORS Sachets',
    availableBeds: 48,
    totalBeds: 168,
    personnelCompliance: 94,
    lastSyncTime: '3 mins ago'
  },
  {
    stateId: 'UP',
    stateName: 'Uttar Pradesh Health Network',
    districtCluster: 'Varanasi & Purvanchal Belt',
    nodeStatus: 'ONLINE (Edge Node #UP-12)',
    activeVectorModel: 'Post-Monsoon Dengue & Japanese Encephalitis Vector',
    localEpoch: 54,
    dataPrivacyStatus: 'Differential Privacy (ε=0.5, δ=1e-5) Active — Raw Records Local',
    sharedSurgeMultiplier: 2.9,
    criticalDrugDemand: 'Paracetamol IV & IV Normal Saline',
    availableBeds: 72,
    totalBeds: 240,
    personnelCompliance: 89,
    lastSyncTime: '8 mins ago'
  },
  {
    stateId: 'BIHAR',
    stateName: 'Bihar Rural Health Sentinel',
    districtCluster: 'Patna & Kosi Flood Plain',
    nodeStatus: 'ONLINE (Edge Node #BR-04)',
    activeVectorModel: 'Acute Diarrheal Outbreak & Cholera Vector',
    localEpoch: 41,
    dataPrivacyStatus: 'Differential Privacy (ε=0.5, δ=1e-5) Active — Raw Records Local',
    sharedSurgeMultiplier: 3.2,
    criticalDrugDemand: 'ORS IP & Zinc Dispersible',
    availableBeds: 35,
    totalBeds: 190,
    personnelCompliance: 82,
    lastSyncTime: '12 mins ago'
  },
  {
    stateId: 'KERALA',
    stateName: 'Kerala Digital Health Mission',
    districtCluster: 'Wayanad & Western Ghats',
    nodeStatus: 'ONLINE (Edge Node #KL-02)',
    activeVectorModel: 'High-Rainfall Landslide & Anti-Rabies Prophylaxis',
    localEpoch: 62,
    dataPrivacyStatus: 'Differential Privacy (ε=0.5, δ=1e-5) Active — Raw Records Local',
    sharedSurgeMultiplier: 2.1,
    criticalDrugDemand: 'Anti-Rabies Vaccine (Purified Vero Cell)',
    availableBeds: 64,
    totalBeds: 180,
    personnelCompliance: 98,
    lastSyncTime: '5 mins ago'
  }
];
