/* ===================================================================
   data.js — Data Layer & Scientific Calculations
   localStorage CRUD, seed data, all derived metrics
   =================================================================== */

function getData() {
    let d = JSON.parse(localStorage.getItem(SK.DATA) || '[]');
    if (!d.length) { d = seedData(); localStorage.setItem(SK.DATA, JSON.stringify(d)); }
    return d;
}
function saveData(d) { localStorage.setItem(SK.DATA, JSON.stringify(d)); }

/* ── 28-day realistic seed ── */
function seedData() {
    const out = []; let ctl = 45;
    for (let i = 28; i >= 1; i--) {
        const dt = new Date(); dt.setDate(dt.getDate() - i);
        const pse = R(4,9), dur = R(30,90);
        const tss = Math.round(pse * dur / 10);
        const trimp = Math.round(dur * pse * 0.64);
        const hrv = R(35,85);          // HRV rMSSD em ms
        const fcmedia = R(110,170);    // FC média bpm
        const sonoQ = R(2,5), sonoH = R(6,9);
        const fadiga = R(1,5), estresse = R(1,4), doms = R(1,5), humor = R(3,7);
        const tqr = R(10,18), prs = R(4,9), dor = R(0,5), motivacao = R(5,10);
        const hooper = cHooper(fadiga,estresse,doms,humor);
        const atl = tss;
        ctl = Math.round(ctl + (tss - ctl) / 42);
        const tsb = ctl - atl;
        const mono = +(Math.random()*1.5+.5).toFixed(2);
        const prontidao = cPront(tqr,prs,sonoQ,motivacao);
        const recuperacao = cRecup(tqr,prs,sonoQ,doms);
        out.push({ date:dt.toISOString(), pse,dur,tss,trimp,hrv,fcmedia,
            sonoQ,sonoH,fadiga,estresse,doms,humor,
            tqr,prs,dor,motivacao, hooper,atl,ctl,tsb,monotonia:mono,prontidao,recuperacao });
    }
    return out;
}

/* ── Scientific formulas ── */

// Hooper Index = Fadiga + Estresse + DOMS + (8 − Humor)
function cHooper(f,e,d,h) { return f + e + d + (8 - h); }

// Prontidão (0-100): TQR 40%, PRS 30%, Sono 20%, Motivação 10%
function cPront(tqr,prs,sonoQ,mot) {
    return CL(Math.round(((tqr-6)/14*40)+(prs/10*30)+(sonoQ/5*20)+(mot/10*10)),0,100);
}

// Recuperação (0-100): TQR 35%, PRS 35%, Sono 20%, inv-DOMS 10%
function cRecup(tqr,prs,sonoQ,doms) {
    return CL(Math.round(((tqr-6)/14*35)+(prs/10*35)+(sonoQ/5*20)+((7-doms)/6*10)),0,100);
}

// Daily Monotony = mean(TSS_7d) / sd(TSS_7d)
function cMono(arr) {
    if (arr.length < 2) return 0;
    const m = arr.reduce((a,b)=>a+b,0)/arr.length;
    const sd = Math.sqrt(arr.reduce((a,b)=>a+(b-m)**2,0)/arr.length)||1;
    return +(m/sd).toFixed(2);
}

// Extract variable value from entry for chart rendering
function exVar(e, k) {
    const n = v => Number(v)||0;
    const map = {
        TSS:n(e.tss), TRIMP:n(e.trimp), ATL:n(e.atl), CTL:n(e.ctl), TSB:n(e.tsb),
        Monotonia:n(e.monotonia), PSE:n(e.pse), HRV:n(e.hrv), FCmedia:n(e.fcmedia),
        Prontidao:n(e.prontidao), Recuperacao:n(e.recuperacao), Hooper:n(e.hooper),
        TQR:n(e.tqr), PRS:n(e.prs), Dor:n(e.dor), SonoQ:n(e.sonoQ), Motivacao:n(e.motivacao)
    };
    return map[k] ?? 0;
}

/* ── Helpers ── */
function R(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function CL(v,lo,hi){return Math.max(lo,Math.min(hi,Math.round(v)))}
