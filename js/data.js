/* ===================================================================
   data.js — Data Layer & Scientific Calculations
   localStorage CRUD, seed data, 0-10 scales and TQR 0-13 scale
   =================================================================== */

function getData() {
    let d = JSON.parse(localStorage.getItem(SK.DATA) || '[]');
    if (!d.length) { d = seedData(); localStorage.setItem(SK.DATA, JSON.stringify(d)); }
    return d;
}
function saveData(d) { localStorage.setItem(SK.DATA, JSON.stringify(d)); }

/* ── 28-day realistic seed (Scales: 0-10, TQR: 0-13) ── */
function seedData() {
    const out = []; let ctl = 45;
    for (let i = 28; i >= 1; i--) {
        const dt = new Date(); dt.setDate(dt.getDate() - i);
        const pse = R(4, 9), dur = R(30, 90);
        const tss = Math.round(pse * dur / 10);
        const trimp = Math.round(dur * pse * 0.64);
        const hrv = R(45, 95);          // HRV rMSSD em ms
        const fcmedia = R(115, 170);    // FC média bpm
        const rhr = R(38, 48);          // FC repouso bpm
        const sonoQ = R(4, 9), sonoH = +(Math.random() * 3 + 6).toFixed(1);
        const fadiga = R(1, 6), estresse = R(1, 6), doms = R(1, 6), humor = R(5, 10);
        const tqr = R(6, 13), prs = R(4, 9), dor = R(0, 5), motivacao = R(5, 10);
        const hooper = cHooper(fadiga, estresse, doms, humor);
        const atl = tss;
        ctl = Math.round(ctl + (tss - ctl) / 42);
        const tsb = ctl - atl;
        const mono = +(Math.random() * 1.5 + .5).toFixed(2);
        const prontidao = cPront(tqr, prs, sonoQ, motivacao);
        const recuperacao = cRecup(tqr, prs, sonoQ, doms);
        out.push({
            date: dt.toISOString(), pse, dur, tss, trimp, hrv, fcmedia, rhr,
            sonoQ, sonoH, fadiga, estresse, doms, humor,
            tqr, prs, dor, motivacao, hooper, atl, ctl, tsb, monotonia: mono, prontidao, recuperacao
        });
    }
    return out;
}

/* ── Scientific formulas ── */

// Hooper Index (0 a 40): Fadiga (0-10) + Estresse (0-10) + DOMS (0-10) + (10 − Humor)
function cHooper(f, e, d, h) {
    return Math.max(0, Math.min(40, f + e + d + (10 - h)));
}

// Prontidão (0-100): TQR (0-13) 40%, PRS (0-10) 30%, Sono (0-10) 20%, Motivação (0-10) 10%
function cPront(tqr, prs, sonoQ, mot) {
    return CL(Math.round(((tqr / 13) * 40) + ((prs / 10) * 30) + ((sonoQ / 10) * 20) + ((mot / 10) * 10)), 0, 100);
}

// Recuperação (0-100): TQR (0-13) 35%, PRS (0-10) 35%, Sono (0-10) 20%, Inverso-DOMS (0-10) 10%
function cRecup(tqr, prs, sonoQ, doms) {
    const invDoms = (10 - Math.min(10, Math.max(0, doms))) / 10;
    return CL(Math.round(((tqr / 13) * 35) + ((prs / 10) * 35) + ((sonoQ / 10) * 20) + (invDoms * 10)), 0, 100);
}

// Daily Monotony = mean(TSS_7d) / sd(TSS_7d)
function cMono(arr) {
    if (arr.length < 2) return 0;
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    const sd = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1;
    return +(m / sd).toFixed(2);
}

// Extract variable value from entry for chart rendering
function exVar(e, k) {
    const n = v => Number(v) || 0;
    const map = {
        TSS: n(e.tss), TRIMP: n(e.trimp), ATL: n(e.atl), CTL: n(e.ctl), TSB: n(e.tsb),
        Monotonia: n(e.monotonia), PSE: n(e.pse), HRV: n(e.hrv), FCmedia: n(e.fcmedia),
        Prontidao: n(e.prontidao), Recuperacao: n(e.recuperacao), Hooper: n(e.hooper),
        TQR: n(e.tqr), PRS: n(e.prs), Dor: n(e.dor), SonoQ: n(e.sonoQ), Motivacao: n(e.motivacao)
    };
    return map[k] ?? 0;
}

/* ── Helpers ── */
function R(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function CL(v, lo, hi) { return Math.max(lo, Math.min(hi, Math.round(v))); }
