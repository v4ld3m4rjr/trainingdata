/* ===================================================================
   config.js — Constants & Variable Registry
   Shared configuration used by all other modules
   =================================================================== */

// Variable definitions: key → {label, color, category}
// Used by chart.js for chip rendering and data extraction
const VARS = {
    TSS:         { label: 'TSS',          color: '#7c3aed', cat: 'carga' },
    TRIMP:       { label: 'TRIMP',        color: '#9333ea', cat: 'carga' },
    ATL:         { label: 'ATL',          color: '#06b6d4', cat: 'carga' },
    CTL:         { label: 'CTL',          color: '#10b981', cat: 'carga' },
    TSB:         { label: 'TSB',          color: '#f59e0b', cat: 'carga' },
    Monotonia:   { label: 'Monotonia',    color: '#ef4444', cat: 'carga' },
    PSE:         { label: 'PSE',          color: '#e879f9', cat: 'treino' },
    Prontidao:   { label: 'Prontidão',    color: '#22d3ee', cat: 'subj' },
    Recuperacao: { label: 'Recuperação',  color: '#34d399', cat: 'subj' },
    Hooper:      { label: 'Hooper Idx',   color: '#fb923c', cat: 'subj' },
    TQR:         { label: 'TQR',          color: '#a78bfa', cat: 'subj' },
    PRS:         { label: 'PRS',          color: '#2dd4bf', cat: 'subj' },
    Dor:         { label: 'Dor',          color: '#f87171', cat: 'subj' },
    SonoQ:       { label: 'Sono Qual.',   color: '#60a5fa', cat: 'subj' },
    Motivacao:   { label: 'Motivação',    color: '#fbbf24', cat: 'subj' },
};

// Default active variables shown in the chart on first load
const DEFAULT_ACTIVE_VARS = ['TSS', 'ATL', 'CTL', 'TSB', 'Prontidao'];

// localStorage keys
const STORAGE_KEYS = {
    USER:     'syn_user',
    USERS:    'syn_users',
    DATA:     'syn_data',
    WORKOUTS: 'syn_workouts',
};
