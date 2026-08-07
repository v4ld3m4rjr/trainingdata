/* ===================================================================
   app.js — Application Initialization & Glue Code
   Entry point: restores session, wires up the dashboard
   =================================================================== */

/**
 * Show the main dashboard screen.
 * Called after successful login or on page load with a saved session.
 */
function showDashboard() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');

    // Set greeting
    document.getElementById('userName').textContent = currentUser.name.split(' ')[0];

    // Set date
    const now = new Date();
    document.getElementById('headerDate').textContent = now.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // Build chart variable chips
    buildVarChips();

    // Full refresh
    refreshAll();
}

/**
 * Refresh all dashboard components: indices, AI analysis, and chart.
 * Called whenever data changes.
 */
function refreshAll() {
    const data = getData();
    updateIndices(data);
    runAIAnalysis();
    renderChart();
}

/**
 * Initialize the app on DOM ready.
 * Checks for saved session and auto-logs in.
 */
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
        currentUser = JSON.parse(saved);
        showDashboard();
    }
});
