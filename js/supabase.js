/* ===================================================================
   supabase.js — Supabase Client & Real-time Cloud Sync
   =================================================================== */

const SUPABASE_CONFIG = {
    url: localStorage.getItem('syn_sb_url') || '',
    anonKey: localStorage.getItem('syn_sb_key') || '',
    table: localStorage.getItem('syn_sb_table') || 'training_logs'
};

let sbClient = null;

function initSupabase() {
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && typeof supabase !== 'undefined') {
        try {
            sbClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('Supabase initialized successfully');
            syncFromSupabase();
        } catch (e) {
            console.error('Supabase initialization error:', e);
        }
    }
}

function isSupabaseConnected() {
    return sbClient !== null && Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

/**
 * Fetch records from Supabase for current user
 */
async function syncFromSupabase() {
    if (!sbClient) return;
    try {
        const u = currentUser || JSON.parse(localStorage.getItem(SK.USER) || 'null');
        let query = sbClient.from(SUPABASE_CONFIG.table).select('*').order('date', { ascending: true });

        if (u && u.id) {
            // If table has user_id or email column, filter by user
            // We fetch all records or user-specific records
            query = query.or(`user_id.eq.${u.id},user_email.eq.${u.email}`);
        }

        const { data, error } = await query;
        if (error) {
            console.warn('Supabase fetch query error, attempting fallback fetch all:', error.message);
            const fallback = await sbClient.from(SUPABASE_CONFIG.table).select('*').order('date', { ascending: true });
            if (!fallback.error && fallback.data) {
                processSupabaseData(fallback.data);
            }
            return;
        }

        if (data && data.length) {
            processSupabaseData(data);
        }
    } catch (err) {
        console.error('Supabase sync error:', err);
    }
}

function processSupabaseData(remoteRows) {
    const formatted = remoteRows.map(r => ({
        id: r.id,
        date: r.date || new Date().toISOString(),
        pse: Number(r.pse) || 0,
        dur: Number(r.dur || r.duration) || 0,
        tss: Number(r.tss) || 0,
        trimp: Number(r.trimp) || 0,
        hrv: Number(r.hrv) || 0,
        fcmedia: Number(r.fcmedia || r.avg_hr) || 0,
        rhr: Number(r.rhr || r.resting_hr) || 42,
        sonoQ: Number(r.sonoQ || r.sleep_quality) || 7,
        sonoH: Number(r.sonoH || r.sleep_hours) || 7.5,
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
        workoutType: r.workoutType || r.activity_type || '',
        notes: r.notes || ''
    }));

    if (formatted.length) {
        localStorage.setItem(SK.DATA, JSON.stringify(formatted));
        if (typeof refreshAll === 'function') refreshAll();
    }
}

/**
 * Save / Upsert entry to Supabase
 */
async function pushEntryToSupabase(entry) {
    if (!sbClient) return;
    try {
        const u = currentUser || JSON.parse(localStorage.getItem(SK.USER) || 'null');
        const payload = {
            ...entry,
            user_id: u ? u.id : null,
            user_email: u ? u.email : null,
            updated_at: new Date().toISOString()
        };

        const { error } = await sbClient.from(SUPABASE_CONFIG.table).upsert(payload, { onConflict: 'date' });
        if (error) {
            console.error('Error pushing entry to Supabase:', error.message);
        } else {
            console.log('Entry successfully saved to Supabase');
        }
    } catch (err) {
        console.error('Supabase push error:', err);
    }
}

/**
 * Save Supabase Credentials
 */
function saveSupabaseConfig(url, key, table) {
    SUPABASE_CONFIG.url = url.trim();
    SUPABASE_CONFIG.anonKey = key.trim();
    SUPABASE_CONFIG.table = (table && table.trim()) ? table.trim() : 'training_logs';

    localStorage.setItem('syn_sb_url', SUPABASE_CONFIG.url);
    localStorage.setItem('syn_sb_key', SUPABASE_CONFIG.anonKey);
    localStorage.setItem('syn_sb_table', SUPABASE_CONFIG.table);

    initSupabase();
}
