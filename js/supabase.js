/* ===================================================================
   supabase.js — Supabase Client & Real-time Cloud Sync
   =================================================================== */

const DEFAULT_SB_URL = 'https://bkhgofrluwyqhnazabyp.supabase.co';
const DEFAULT_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraGdvZnJsdXd5cWhuYXphYnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjg0NzAsImV4cCI6MjA5OTAwNDQ3MH0.Y01ieiNS7-9HbSXOMOQ2R1KKZ4roeBewee-WQZC21rk';
const DEFAULT_SB_TABLE = 'training_logs';

const SUPABASE_CONFIG = {
    url: localStorage.getItem('syn_sb_url') || DEFAULT_SB_URL,
    anonKey: localStorage.getItem('syn_sb_key') || DEFAULT_SB_KEY,
    table: localStorage.getItem('syn_sb_table') || DEFAULT_SB_TABLE
};

let sbClient = null;
let sbSyncStatus = 'idle'; // 'idle' | 'connected' | 'error' | 'syncing'

function initSupabase() {
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && typeof supabase !== 'undefined') {
        try {
            sbClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('Supabase initialized successfully with project:', SUPABASE_CONFIG.url);
            sbSyncStatus = 'connected';
            syncFromSupabase();
        } catch (e) {
            sbSyncStatus = 'error';
            console.error('Supabase initialization error:', e);
        }
    }
}

function isSupabaseConnected() {
    return sbClient !== null && Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

/**
 * Fetch records from Supabase and populate Dashboard with 100% real cloud data
 */
async function syncFromSupabase() {
    if (!sbClient) return;
    try {
        sbSyncStatus = 'syncing';
        
        // Attempt query on the configured table
        let { data, error } = await sbClient
            .from(SUPABASE_CONFIG.table)
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            sbSyncStatus = 'error';
            console.warn(`Supabase notice on table [${SUPABASE_CONFIG.table}]:`, error.message);
            // If table doesn't exist or RLS issue
            return;
        }

        sbSyncStatus = 'connected';
        if (data && data.length > 0) {
            console.log(`[Supabase] Carregados ${data.length} registros reais da nuvem (tabela: ${SUPABASE_CONFIG.table})`);
            processSupabaseData(data);
        } else {
            console.log(`[Supabase] Conectado com sucesso. Tabela [${SUPABASE_CONFIG.table}] está aguardando os primeiros registros.`);
        }
    } catch (err) {
        sbSyncStatus = 'error';
        console.error('Supabase sync exception:', err);
    }
}

function processSupabaseData(remoteRows) {
    if (!remoteRows || !remoteRows.length) return;

    const formatted = remoteRows.map(function (r) {
        return {
            id: r.id,
            date: r.date || new Date().toISOString(),
            pse: Number(r.pse) || 0,
            dur: Number(r.dur || r.duration) || 0,
            tss: Number(r.tss) || 0,
            trimp: Number(r.trimp) || 0,
            hrv: Number(r.hrv) || 0,
            fcmedia: Number(r.fcmedia || r.avg_hr || r.fc_media) || 0,
            rhr: Number(r.rhr || r.resting_hr || r.fc_repouso) || 42,
            sonoQ: Number(r.sonoQ || r.sleep_quality || r.sono_q) || 7,
            sonoH: Number(r.sonoH || r.sleep_hours || r.sono_h) || 7.5,
            fadiga: Number(r.fadiga || r.fatigue) || 3,
            estresse: Number(r.estresse || r.stress) || 3,
            doms: Number(r.doms) || 3,
            humor: Number(r.humor || r.mood) || 7,
            tqr: Number(r.tqr) || 9,
            prs: Number(r.prs) || 6,
            dor: Number(r.dor || r.pain) || 2,
            motivacao: Number(r.motivacao || r.motivation) || 8,
            hooper: Number(r.hooper) || cHooper(Number(r.fadiga) || 3, Number(r.estresse) || 3, Number(r.doms) || 3, Number(r.humor) || 7),
            atl: Number(r.atl) || Number(r.tss) || 0,
            ctl: Number(r.ctl) || 45,
            tsb: Number(r.tsb) || 0,
            monotonia: Number(r.monotonia) || 1,
            prontidao: Number(r.prontidao) || 65,
            recuperacao: Number(r.recuperacao) || 65,
            workoutType: r.workoutType || r.workout_type || r.activity_type || '',
            notes: r.notes || ''
        };
    });

    // Sort chronologically
    formatted.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
    });

    localStorage.setItem(SK.DATA, JSON.stringify(formatted));
    if (typeof refreshAll === 'function') refreshAll();
}

/**
 * Save / Upsert entry to Supabase
 */
async function pushEntryToSupabase(entry) {
    if (!sbClient) {
        console.warn('Supabase client not initialized. Saved locally in browser.');
        return;
    }
    try {
        const u = currentUser || JSON.parse(localStorage.getItem(SK.USER) || 'null');
        const payload = {
            date: entry.date,
            pse: entry.pse,
            dur: entry.dur,
            tss: entry.tss,
            trimp: entry.trimp,
            hrv: entry.hrv,
            fcmedia: entry.fcmedia,
            rhr: entry.rhr,
            "sonoQ": entry.sonoQ,
            "sonoH": entry.sonoH,
            fadiga: entry.fadiga,
            estresse: entry.estresse,
            doms: entry.doms,
            humor: entry.humor,
            tqr: entry.tqr,
            prs: entry.prs,
            dor: entry.dor,
            motivacao: entry.motivacao,
            hooper: entry.hooper,
            atl: entry.atl,
            ctl: entry.ctl,
            tsb: entry.tsb,
            monotonia: entry.monotonia,
            prontidao: entry.prontidao,
            recuperacao: entry.recuperacao,
            workout_type: entry.workoutType || '',
            notes: entry.notes || '',
            user_id: u ? u.id : null,
            user_email: u ? u.email : null,
            updated_at: new Date().toISOString()
        };

        const { error } = await sbClient.from(SUPABASE_CONFIG.table).upsert(payload, { onConflict: 'date' });
        if (error) {
            console.error('Erro ao salvar no Supabase:', error.message);
            // If table doesn't exist yet, we inform the console and user
            if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
                alert('Atenção: A tabela "' + SUPABASE_CONFIG.table + '" ainda não foi criada no Supabase.\n\nOs dados foram salvos no dispositivo. Para salvar na nuvem, execute o script SQL no painel do Supabase.');
            }
        } else {
            console.log('✅ Registro salvo e sincronizado com sucesso no Supabase na tabela:', SUPABASE_CONFIG.table);
        }
    } catch (err) {
        console.error('Supabase push error:', err);
    }
}

/**
 * Save Supabase Credentials & Re-test
 */
function saveSupabaseConfig(url, key, table) {
    SUPABASE_CONFIG.url = url.trim();
    SUPABASE_CONFIG.anonKey = key.trim();
    SUPABASE_CONFIG.table = (table && table.trim()) ? table.trim() : DEFAULT_SB_TABLE;

    localStorage.setItem('syn_sb_url', SUPABASE_CONFIG.url);
    localStorage.setItem('syn_sb_key', SUPABASE_CONFIG.anonKey);
    localStorage.setItem('syn_sb_table', SUPABASE_CONFIG.table);

    initSupabase();
}
