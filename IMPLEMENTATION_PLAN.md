# 🏥 ArogyaSetu AI (आरोग्यसेतु) — Implementation Plan
## End-to-End Build Roadmap & Google Cloud AI Integration

> **Hackathon**: Build with AI — Code for Communities (Second Edition)  
> **Track**: Track 2 — Healthcare & Supply Chain Resilience  
> **Goal**: Complete, deployable prototype with working Google AI integration, rich GIS visuals, and pitch assets.

---

## 🎯 Google AI Stack Integration Mapping

As required by the hackathon guidelines, here is exactly how Google AI and Google Cloud technologies are integrated into **ArogyaSetu AI**:

| Hackathon Technology Category | Supported Google Stack | How ArogyaSetu AI Uses It |
| :--- | :--- | :--- |
| **Generative AI & Agents** | **Gemini API / Google AI Studio / Vertex AI** | Clinical inventory triage agent, automated indent recommendation synthesizer, inter-facility transfer approval. |
| **Vision & Multimodal** | **Gemini Multimodal / Vertex AI Vision** | Real-time smartphone photo OCR analyzing medicine packaging, handwritten paper stock registers, blister counts, and batch numbers. |
| **Predictive Modelling** | **Vertex AI (AutoML / Time-Series Serving)** | Epidemiological outbreak-driven demand forecasting (correlating seasonal monsoon, flood index, and dengue spikes with medicine depletion). |
| **Language & Voice** | **Cloud Speech-to-Text & Text-to-Speech, Translation API** | Voice-first Indic clinical copilot supporting **Hindi, Odia, Telugu, Tamil, and English** for frontline ASHA/ANM workers. |
| **Geospatial & Mapping** | **Google Maps Platform / Open GIS** | District healthcare network topology, cold-chain route tracing, dynamic inter-clinic supply balancing route animations. |
| **Public Data & National Scale** | **data.gov.in, National Health Mission (NHM), WHO, IMD** | Indian National Essential Drugs List (EDL), rural disease incidence rates, district demographic datasets (Khordha, Odisha & Varanasi, UP). |

---

## 📅 The 5 Implementation Phases

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        AROGYASETU AI - 5-PHASE EXECUTION ROADMAP                       │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [ PHASE 1 ] ──> [ PHASE 2 ] ──> [ PHASE 3 ] ──> [ PHASE 4 ] ──> [ PHASE 5 ]
  Scaffolding     District GIS     Gemini Vision   Epidemic Surge   Cold-Chain &
  & Tactical      Command Center   Shelf & Ledger  & Inter-Clinic   ASHA Voice Copilot
  Design System   & Live Inventory Scanner         Re-Routing       + Pitch Package
```

---

### 📍 Phase 1: Project Foundation & Tactical Design System
* **Objective**: Create the core Vite + React application with high-end, responsive aesthetics.
* **Deliverables**:
  - Vite React frontend with custom CSS design tokens (deep slate/navy palette, glowing status badges, glassmorphic cards).
  - Modern typography and Lucide icons.
  - Interactive top bar with District selector (*Khordha, Odisha* / *Varanasi, UP* / *Guntur, AP*), live system ticker, and module navigation.

---

### 📍 Phase 2: District CMO GIS Command Center & Dynamic Inventory
* **Objective**: Provide district health administrators with real-time geospatial inventory visibility.
* **Deliverables**:
  - **Interactive District GIS Map**:
    - Central District Drug Warehouse (CDW) + 8 surrounding rural PHCs/CHCs.
    - Color-coded pins: 🟢 Safe (>30 days), 🟡 Low Stock (7–15 days), 🔴 Critical Stock-out (<7 days).
  - **Live Inventory Triage Table**:
    - Essential drug catalog: Anti-Snake Venom, Oxytocin, Anti-Rabies, Insulin, ORS, Amoxicillin, BCG, Pentavalent vaccines.
    - Filter by facility, stock level, expiry timeline, and temperature requirements.

---

### 📍 Phase 3: Gemini Multimodal Shelf & Ledger Digitizer (Google AI Core)
* **Objective**: Zero-effort smartphone photo intake replacing manual paper data entry.
* **Deliverables**:
  - Camera & file dropzone supporting photos of medicine packaging, blister packs, and handwritten registers.
  - Built-in sample test images (blister pack, hand-written ledger page, carton label) for one-click testing by judges.
  - **Gemini API integration**: Extracts structured JSON (Name, Manufacturer, Batch No, Expiry, Quantity, Cold-Chain flag).
  - One-click commit button to push extracted items into the live PHC database.

---

### 📍 Phase 4: Epidemiological Outbreak Forecaster & Dynamic Inter-Clinic Re-router
* **Objective**: Pre-landfall/pre-outbreak anticipatory action and inter-facility stock balancing.
* **Deliverables**:
  - **Outbreak Simulation Triggers**:
    - 🌧️ *Monsoon Flash Floods* -> 350% spike in snakebite & waterborne diarrhea.
    - 🦟 *Post-Rain Dengue Epidemic* -> 280% spike in IV fluids & paracetamol.
  - **Predictive Demand Curves (Vertex AI model simulation)**:
    - 30-day projection chart showing current stock depletion vs predicted demand.
    - Automated indent generation 10 days before zero-stock.
  - **Inter-Facility Redistribution Router**:
    - Identifies clinics with surplus near-expiry stock (e.g., PHC Balipatna) and deficit clinics (e.g., CHC Jatni).
    - Calculates the fastest route and renders an animated courier delivery path on the map.

---

### 📍 Phase 5: Cold-Chain Sentinel, Indic Voice Copilot & Submission Readiness
* **Objective**: Complete end-to-end polish, voice accessibility, and judge package.
* **Deliverables**:
  - **Cold-Chain Sentinel**:
    - Real-time IoT temperature telemetry for Ice-Lined Refrigerators (2°C to 8°C).
    - Power failure simulation with automated emergency alerts and FEFO (First-Expired, First-Out) dispensing order.
  - **Multilingual Indic Voice Copilot**:
    - Voice-enabled assistant supporting **Hindi, Odia, Telugu, Tamil, and English**.
    - Hands-free natural language queries for frontline ASHA/ANM workers.
  - **Submission Assets**:
    - Slide-by-slide Pitch Deck content (10–12 slides).
    - 3–5 minute demo video walkthrough script.
    - Production build verification.
