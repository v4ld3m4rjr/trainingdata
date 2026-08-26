/* ===================================================================
   app.js — Application Init & Tab Router
   =================================================================== */

function switchMainTab(tab) {
    const viewToday = document.getElementById('viewToday');
    const viewTrends = document.getElementById('viewTrends');
    const tabNavToday = document.getElementById('tabNavToday');
    const tabNavTrends = document.getElementById('tabNavTrends');

    if (tab === 'today') {
        if (viewToday) viewToday.style.display = 'block';
        if (viewTrends) viewTrends.style.display = 'none';
        if (tabNavToday) tabNavToday.classList.add('active');
        if (tabNavTrends) tabNavTrends.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'trends') {
        if (viewToday) viewToday.style.display = 'none';
        if (viewTrends) viewTrends.style.display = 'block';
        if (tabNavToday) tabNavToday.classList.remove('active');
        if (tabNavTrends) tabNavTrends.classList.add('active');
        buildVarChips();
        renderChart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showDashboard() {
    const authScreen = document.getElementById('authScreen');
    const mainScreen = document.getElementById('mainScreen');
    if (authScreen) authScreen.classList.remove('active');
    if (mainScreen) mainScreen.classList.add('active');

    const now = new Date();
    const dEl = document.getElementById('headerDate');
    if (dEl) {
        const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        const capDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        const uName = (currentUser && currentUser.name) ? currentUser.name.split(' ')[0] : 'Atleta';
        dEl.textContent = `${capDate} · ${uName}`;
    }

    buildVarChips();
    refreshAll();
    if (typeof syncFromSupabase === 'function') syncFromSupabase();
}

function refreshAll() {
    const data = getData();
    updateIndices(data);
    runAIAnalysis();
    renderChart();
}

function handleSaveSupabaseConfig() {
    const url = document.getElementById('sbUrlInput').value;
    const key = document.getElementById('sbKeyInput').value;
    const table = document.getElementById('sbTableInput').value;

    if (!url || !key) return alert('Por favor, informe a URL e a Anon Key do Supabase!');

    saveSupabaseConfig(url, key, table);
    closeModal('supabaseConfigModal');
    alert('Configurações do Supabase salvas com sucesso! Sincronizando dados...');
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initSupabase === 'function') {
        initSupabase();
    }

    const s = localStorage.getItem(SK.USER);
    if (s) {
        try {
            currentUser = JSON.parse(s);
            showDashboard();
        } catch (e) {
            console.error(e);
        }
    }
});
