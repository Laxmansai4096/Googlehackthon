// Automated End-to-End Live AI Feature Test Suite
// Tests all 6 AI capabilities live with Google Gemini API

import { 
  analyzeMedicinePresetWithGemini,
  analyzeMedicineImageWithGemini,
  queryGeminiLogisticsRationale,
  queryGeminiClinicalCopilot,
  queryGeminiBedsideTriage,
  queryGeminiEpidemicSurgeForecast,
  queryGeminiDistrictStockInsights,
  queryGeminiCustomStockQuestion,
  queryGeminiFederatedResourceAudit,
  getGeminiApiKey 
} from '../src/services/geminiService.js';

console.log('===============================================================');
console.log('🔬 AROGYASETU AI — FULL END-TO-END LIVE GEMINI AI VERIFICATION');
console.log('===============================================================');
console.log(`API Key active: ${getGeminiApiKey().slice(0, 10)}...`);
console.log('---------------------------------------------------------------\n');

let totalTests = 0;
let passedTests = 0;

async function runTest(name, fn) {
  totalTests++;
  process.stdout.write(`[TEST ${totalTests}] ${name} ... `);
  const start = Date.now();
  try {
    const result = await fn();
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    if (result && result.passed) {
      passedTests++;
      console.log(`✅ PASSED (${duration}s)`);
      if (result.detail) {
        console.log(`   ↳ Detail: ${result.detail.replace(/\n/g, '\n      ')}`);
      }
    } else {
      console.log(`❌ FAILED (${duration}s)`);
      console.log(`   ↳ Reason: ${result?.reason || 'No data returned'}`);
    }
  } catch (err) {
    console.log(`❌ ERROR`);
    console.log(`   ↳ Exception: ${err.message}`);
  }
  console.log('');
}

async function runSuite() {
  // Test 1: Live Medicine Digitization (Preset OCR)
  await runTest('Feature 1: Live Medicine Digitization (Anti-Snake Venom)', async () => {
    const res = await analyzeMedicinePresetWithGemini('Anti-Snake Venom Lyophilized 10ml', 'CHC Jatni');
    if (!res || !res.medicineName) return { passed: false, reason: 'Failed to extract JSON' };
    return {
      passed: true,
      detail: `Model: ${res._activeModel} | Extracted: ${res.medicineName}, Batch: ${res.batchNumber}, Expiry: ${res.expiryDate}, ColdChain: ${res.isColdChain}`
    };
  });

  // Test 2: Live Autonomous Agentic Logistics Engine
  await runTest('Feature 2: Autonomous Agentic Borrow Rationale', async () => {
    const rationale = await queryGeminiLogisticsRationale('CHC Jatni', 'PHC Balipatna', 'Anti-Snake Venom', 21.4);
    if (!rationale || rationale.length < 30) return { passed: false, reason: 'Short or empty response' };
    return {
      passed: true,
      detail: rationale.slice(0, 160) + '...'
    };
  });

  // Test 3: Indic Voice Copilot - Hindi
  await runTest('Feature 3A: Indic Voice Copilot (Hindi)', async () => {
    const ans = await queryGeminiClinicalCopilot('बेगुनिया पीएचसी में इंसुलिन का कितना स्टॉक बचा है?', 'Hindi');
    if (!ans || ans.length < 20) return { passed: false, reason: 'Empty Hindi response' };
    return {
      passed: true,
      detail: ans
    };
  });

  // Test 4: Indic Voice Copilot - Telugu
  await runTest('Feature 3B: Indic Voice Copilot (Telugu)', async () => {
    const ans = await queryGeminiClinicalCopilot('ఆక్సిటోసిన్ ఇంజెక్షన్ నిల్వలు ఎక్కడ ఉన్నాయి?', 'Telugu');
    if (!ans || ans.length < 20) return { passed: false, reason: 'Empty Telugu response' };
    return {
      passed: true,
      detail: ans
    };
  });

  // Test 5: Indic Voice Copilot - Odia
  await runTest('Feature 3C: Indic Voice Copilot (Odia)', async () => {
    const ans = await queryGeminiClinicalCopilot('ଜଟଣୀ ସିଏଚସିରେ ଆଣ୍ଟି-ରାବିସ୍ ଇଞ୍ଜେକ୍ସନ ଅଛି କି?', 'Odia');
    if (!ans || ans.length < 20) return { passed: false, reason: 'Empty Odia response' };
    return {
      passed: true,
      detail: ans
    };
  });

  // Test 6: Indic Voice Copilot - English
  await runTest('Feature 3D: Indic Voice Copilot (English)', async () => {
    const ans = await queryGeminiClinicalCopilot('A child was bitten by a cobra in Jatni. Does CHC Jatni have Anti-Snake Venom?', 'English');
    if (!ans || ans.length < 20) return { passed: false, reason: 'Empty English response' };
    return {
      passed: true,
      detail: ans
    };
  });

  // Test 7: ASHA Frontline Bedside Triage Protocol
  await runTest('Feature 4: ASHA Frontline Bedside Emergency Triage', async () => {
    const triage = await queryGeminiBedsideTriage('Snakebite (Cobra Envenomation)', 'Kantabad Village', 'CHC Jatni');
    if (!triage || !triage.title) return { passed: false, reason: 'No triage JSON output' };
    return {
      passed: true,
      detail: `Title: "${triage.title}" | Model: ${triage._activeModel} | Action: ${triage.action?.slice(0, 100)}...`
    };
  });

  // Test 8: Epidemiological Outbreak Surge Forecast
  await runTest('Feature 5: Epidemiological Outbreak Surge Forecast (Monsoon Flood & Leptospirosis)', async () => {
    const forecast = await queryGeminiEpidemicSurgeForecast('Monsoon Flash Flood & Waterborne Enteric Surge', 'Khordha District');
    if (!forecast || forecast.length < 30) return { passed: false, reason: 'Empty forecast' };
    return {
      passed: true,
      detail: forecast.slice(0, 150) + '...'
    };
  });

  // Test 9: District Stock Executive AI Intelligence for Block Hub & Sub-Centres
  await runTest('Feature 6A: District Stock Executive AI Intelligence (Hub + Sub-Centres)', async () => {
    const summarySample = `BLOCK HUB: CHC Jatni (Community Health Centre)
Main Hub Inventory:
 - Anti-Snake Venom: Stock=0 (Threshold=15), Batch=EXHAUSTED, Expiry=0d, Status=Critical Stock-Out
 - Oxytocin: Stock=14, Batch=OXY-24B-110, Expiry=85d, Status=Low Stock
Affiliated Sub-Centres (3):
 Sub-Centre: Kantabad HWC / Sub-Centre (Dist: 6.2km, Pop: 4,850)
   * ALERT: Anti-Snake Venom: Stock=0, Expiry=0d, Status=Critical Stock-Out
   * ALERT: Anti-Rabies: Stock=0, Expiry=0d, Status=Critical Stock-Out`;

    const insights = await queryGeminiDistrictStockInsights('CHC Jatni', summarySample);
    if (!insights || !insights.statusVerdict) return { passed: false, reason: 'No structured insights returned' };
    return {
      passed: true,
      detail: `Verdict: "${insights.statusVerdict}" | Score: ${insights.stockHealthScore}% | Model: ${insights._activeModel} | Plan: ${insights.prescriptiveTransferPlan?.slice(0, 80)}...`
    };
  });

  // Test 10: Interactive Natural Language Stock Q&A for CMO
  await runTest('Feature 6B: Interactive Natural Language Stock Q&A for CMO', async () => {
    const context = `CHC Jatni: 0 Anti-Snake Venom. Kantabad HWC: 0 Anti-Snake Venom. PHC Balipatna: 140 Anti-Snake Venom (surplus, 32 days expiry).`;
    const ans = await queryGeminiCustomStockQuestion('CHC Jatni', 'Which sub-centre has zero Anti-Snake Venom and where can we borrow from?', context);
    if (!ans || ans.length < 25) return { passed: false, reason: 'Empty Q&A response' };
    return {
      passed: true,
      detail: ans
    };
  });

  // Test 11: National Federated AI Platform & Cross-State Shared Model Exchange
  await runTest('Feature 7: National Federated AI Platform & Cross-State Shared Model Exchange', async () => {
    const stateSummary = `STATE: Odisha State Health Grid (Khordha Cluster)
- Active Model: Monsoon Flash Flooding & Leptospirosis/ASV Vector
- Available Beds: 48/168, Staff Attendance: 94%

STATE: Uttar Pradesh Health Network (Varanasi Cluster)
- Active Model: Post-Monsoon Dengue & Japanese Encephalitis Vector
- Available Beds: 72/240, Staff Attendance: 89%`;

    const fedAudit = await queryGeminiFederatedResourceAudit(stateSummary, 'Odisha & Uttar Pradesh');
    if (!fedAudit || !fedAudit.federatedConsensusVerdict) return { passed: false, reason: 'No federated consensus returned' };
    return {
      passed: true,
      detail: `Verdict: "${fedAudit.federatedConsensusVerdict}" | National Index: ${fedAudit.nationalHealthIndex}% | Model: ${fedAudit._activeModel} | Directives: ${fedAudit.crossStateRedistributionDirectives?.[0]?.slice(0, 90)}...`
    };
  });

  console.log('===============================================================');
  console.log(`🎯 SUMMARY: ${passedTests} / ${totalTests} LIVE AI FEATURES PASSED (100% REAL LIVE GEMINI APIS)`);
  console.log('===============================================================');
}

runSuite();
