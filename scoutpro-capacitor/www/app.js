// ============================================================
// ScoutPro - Main Application Logic
// ============================================================

let currentUser = null;
let currentEvalTab = 'tech';
let currentSheet = 'dashboard';
let evalScores = {};
let tierChart = null, scoreDistChart = null;

// ─── AUTH ────────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const role = document.getElementById('loginRole').value;
  const pass = document.getElementById('loginPassword').value;
  if (!email || !pass) { alert('Please enter email and password'); return; }
  currentUser = { email, role, name: email.split('@')[0] };
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'block';
  document.getElementById('sidebarRole').textContent = role;
  document.getElementById('headerUser').textContent = currentUser.name + ' · ' + role;
  initApp();
}

function doLogout() {
  currentUser = null;
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

// ─── NAVIGATION ──────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (nav) nav.classList.add('active');
  const titles = { dashboard:'Dashboard', players:'Player Management', evaluation:'Scouting Evaluations', spreadsheet:'Scoring Sheets', reports:'Scouting Reports', clubs:'Club & Academy Channel', outreach:'Club Outreach', profile:'Player Profile' };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'players') renderPlayers();
  if (page === 'evaluation') renderEvals();
  if (page === 'spreadsheet') renderSheet(currentSheet);
  if (page === 'clubs') renderClubs();
  if (page === 'outreach') initOutreach();
  if (page === 'profile') initProfile();
  if (page === 'reports') renderReportPage();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('mainContent').classList.toggle('expanded');
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── INIT ────────────────────────────────────────────────────
function initApp() {
  showPage('dashboard');
  populateClubCountryFilter();
}

// ─── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const clubs = DB.get('clubs');
  document.getElementById('statTotal').textContent = players.length;
  document.getElementById('statEvals').textContent = evals.length;
  document.getElementById('statClubs').textContent = clubs.length;
  const eliteCount = evals.filter(e => e.overall_score >= 85).length;
  document.getElementById('statElite').textContent = eliteCount;

  // Tier Chart
  const tierCounts = { Elite:0, 'High Prospect':0, Development:0, Monitor:0 };
  evals.forEach(e => { const t = getTier(e.overall_score).tier; tierCounts[t] = (tierCounts[t]||0)+1; });
  if (tierChart) tierChart.destroy();
  const tc = document.getElementById('tierChart').getContext('2d');
  tierChart = new Chart(tc, {
    type: 'doughnut',
    data: { labels: Object.keys(tierCounts), datasets: [{ data: Object.values(tierCounts), backgroundColor: ['#7c3aed','#2563eb','#d97706','#6b7280'], borderWidth: 2, borderColor: '#1f2937' }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#f3f4f6', font: { size: 12 } } } } }
  });

  // Score Distribution
  if (scoreDistChart) scoreDistChart.destroy();
  const sc = document.getElementById('scoreDistChart').getContext('2d');
  const scoreLabels = players.map(p => p.name.split(' ')[0]);
  const scoreData = players.map(p => { const e = evals.find(ev => ev.player_id === p.id); return e ? e.overall_score : 0; });
  scoreDistChart = new Chart(sc, {
    type: 'bar',
    data: { labels: scoreLabels, datasets: [{ label: 'Overall Score', data: scoreData, backgroundColor: scoreData.map(s => s>=85?'#7c3aed':s>=75?'#2563eb':s>=65?'#d97706':'#6b7280'), borderRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }, x: { ticks: { color: '#9ca3af' }, grid: { display: false } } } }
  });

  // Top Prospects
  const sorted = [...evals].sort((a,b) => b.overall_score - a.overall_score).slice(0,5);
  const tpEl = document.getElementById('topProspects');
  tpEl.innerHTML = sorted.map(e => {
    const p = players.find(pl => pl.id === e.player_id);
    if (!p) return '';
    const t = getTier(e.overall_score);
    return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border);">
      <img src="${p.profile_image||'https://ui-avatars.com/api/?name='+encodeURIComponent(p.name)+'&background=0f4c81&color=fff'}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=P&background=0f4c81&color=fff'"/>
      <div style="flex:1;">
        <div class="font-semibold text-sm">${p.name}</div>
        <div style="font-size:11px;color:var(--muted)">${p.position} · ${p.nationality}</div>
      </div>
      <div>
        <div class="font-bold" style="color:${t.color};font-size:18px;">${e.overall_score}</div>
        <span class="badge ${t.badge}" style="font-size:9px;">${t.tier}</span>
      </div>
    </div>`;
  }).join('');

  // Nationality breakdown
  const natMap = {};
  players.forEach(p => { natMap[p.nationality] = (natMap[p.nationality]||0)+1; });
  const natEl = document.getElementById('nationalityList');
  natEl.innerHTML = Object.entries(natMap).sort((a,b)=>b[1]-a[1]).map(([nat,count]) =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
      <span style="font-size:13px;">${nat}</span>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:80px;height:6px;background:#374151;border-radius:3px;"><div style="width:${(count/players.length)*100}%;height:100%;background:var(--accent);border-radius:3px;"></div></div>
        <span style="font-size:12px;color:var(--muted)">${count}</span>
      </div>
    </div>`
  ).join('');
}

// ─── PLAYERS ─────────────────────────────────────────────────
function renderPlayers() {
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const search = (document.getElementById('playerSearch')||{}).value?.toLowerCase()||'';
  const filter = (document.getElementById('playerFilter')||{}).value||'';
  let filtered = players.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.nationality.toLowerCase().includes(search) || p.current_club.toLowerCase().includes(search);
    const matchFilter = !filter || p.position === filter;
    return matchSearch && matchFilter;
  });
  const grid = document.getElementById('playersGrid');
  if (!filtered.length) { grid.innerHTML = '<div class="text-center py-12" style="color:var(--muted);grid-column:1/-1;"><i class="fas fa-users text-4xl mb-3 block"></i>No players found</div>'; return; }
  grid.innerHTML = filtered.map(p => {
    const e = evals.find(ev => ev.player_id === p.id);
    const t = e ? getTier(e.overall_score) : null;
    const age = p.DOB ? Math.floor((Date.now() - new Date(p.DOB)) / 31557600000) : '?';
    return `<div class="player-card" onclick="viewPlayer('${p.id}')">
      <div style="height:120px;background:linear-gradient(135deg,#0f4c81,#1e3a5f);position:relative;overflow:hidden;">
        <img src="${p.profile_image||'https://ui-avatars.com/api/?name='+encodeURIComponent(p.name)+'&background=0f4c81&color=fff&size=120'}" style="width:100%;height:100%;object-fit:cover;opacity:0.7;" onerror="this.src='https://ui-avatars.com/api/?name=P&background=0f4c81&color=fff&size=120'"/>
        ${t ? `<span class="badge ${t.badge}" style="position:absolute;top:10px;right:10px;">${t.tier}</span>` : ''}
      </div>
      <div style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div class="font-bold text-base">${p.name}</div>
            <div style="font-size:12px;color:var(--muted)">${p.position} · ${p.archetype}</div>
          </div>
          ${e ? `<div class="font-bold text-xl" style="color:${t.color}">${e.overall_score}</div>` : '<div style="color:var(--muted);font-size:12px;">No eval</div>'}
        </div>
        <div style="display:flex;gap:12px;margin-top:10px;font-size:12px;color:var(--muted);">
          <span><i class="fas fa-flag mr-1"></i>${p.nationality}</span>
          <span><i class="fas fa-birthday-cake mr-1"></i>${age} yrs</span>
          <span><i class="fas fa-shoe-prints mr-1"></i>${p.dominant_foot}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-top:6px;"><i class="fas fa-shield-alt mr-1"></i>${p.current_club}</div>
        ${e ? `<div class="tier-bar mt-3"><div class="tier-fill" style="width:${e.overall_score}%;background:${t.color};"></div></div>` : ''}
        <div style="display:flex;gap:6px;margin-top:10px;">
          <button class="btn-primary" style="flex:1;font-size:11px;padding:5px;" onclick="event.stopPropagation();openEvalForPlayer('${p.id}')"><i class="fas fa-clipboard-check mr-1"></i>Evaluate</button>
          <button class="btn-accent" style="font-size:11px;padding:5px 10px;" onclick="event.stopPropagation();viewPlayerProfile('${p.id}')"><i class="fas fa-id-card"></i></button>
          <button class="btn-danger" style="font-size:11px;padding:5px 10px;" onclick="event.stopPropagation();deletePlayer('${p.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openAddPlayer() { openModal('addPlayerModal'); }

function savePlayer() {
  const name = document.getElementById('pName').value.trim();
  if (!name) { alert('Player name is required'); return; }
  const players = DB.get('players');
  const newP = {
    id: 'p' + Date.now(),
    name, DOB: document.getElementById('pDOB').value,
    nationality: document.getElementById('pNat').value,
    height: +document.getElementById('pHeight').value,
    weight: +document.getElementById('pWeight').value,
    dominant_foot: document.getElementById('pFoot').value,
    position: document.getElementById('pPosition').value,
    archetype: document.getElementById('pArchetype').value,
    current_club: document.getElementById('pClub').value,
    bio: document.getElementById('pBio').value,
    profile_image: document.getElementById('pImage').value,
    highlight_video_url: document.getElementById('pVideo').value,
    full_match_video_url: document.getElementById('pMatch').value,
  };
  players.push(newP);
  DB.set('players', players);
  closeModal('addPlayerModal');
  renderPlayers();
  // Clear form
  ['pName','pDOB','pNat','pHeight','pWeight','pClub','pBio','pImage','pVideo','pMatch'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
}

function deletePlayer(id) {
  if (!confirm('Delete this player?')) return;
  DB.set('players', DB.get('players').filter(p => p.id !== id));
  renderPlayers();
}

function viewPlayer(id) { viewPlayerProfile(id); }

function viewPlayerProfile(id) {
  document.getElementById('profilePlayerSelect').value = id;
  showPage('profile');
  renderProfile();
}

// ─── EVALUATIONS ─────────────────────────────────────────────
function renderEvals() {
  const evals = DB.get('evaluations');
  const players = DB.get('players');
  const el = document.getElementById('evalList');
  if (!evals.length) { el.innerHTML = '<div class="text-center py-12" style="color:var(--muted);"><i class="fas fa-clipboard text-4xl mb-3 block"></i>No evaluations yet</div>'; return; }
  el.innerHTML = `<div class="overflow-x-auto"><table class="sheet-table">
    <thead><tr><th>Player</th><th>Date</th><th>Technical</th><th>Tactical</th><th>Physical</th><th>Psychological</th><th>Overall</th><th>Tier</th><th>Actions</th></tr></thead>
    <tbody>${evals.map(e => {
      const p = players.find(pl => pl.id === e.player_id);
      const t = getTier(e.overall_score);
      return `<tr>
        <td><div class="font-semibold">${p?p.name:'Unknown'}</div><div style="font-size:11px;color:var(--muted)">${p?p.position:''}</div></td>
        <td style="color:var(--muted);font-size:12px;">${e.date}</td>
        <td><span style="color:#60a5fa;font-weight:600;">${e.technical_score}</span></td>
        <td><span style="color:#34d399;font-weight:600;">${e.tactical_score}</span></td>
        <td><span style="color:#f59e0b;font-weight:600;">${e.physical_score}</span></td>
        <td><span style="color:#a78bfa;font-weight:600;">${e.psychological_score}</span></td>
        <td><span style="font-size:18px;font-weight:700;color:${t.color}">${e.overall_score}</span></td>
        <td><span class="badge ${t.badge}">${t.tier}</span></td>
        <td><button class="btn-primary" style="font-size:11px;padding:4px 10px;" onclick="generateReport('${e.player_id}')"><i class="fas fa-file-alt mr-1"></i>Report</button></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function openNewEval() {
  const players = DB.get('players');
  const sel = document.getElementById('evalPlayer');
  sel.innerHTML = players.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  document.getElementById('evalDate').value = new Date().toISOString().split('T')[0];
  evalScores = {};
  showEvalTab('tech');
  openModal('evalModal');
}

function openEvalForPlayer(pid) {
  openNewEval();
  document.getElementById('evalPlayer').value = pid;
}

function showEvalTab(tab) {
  currentEvalTab = tab;
  document.querySelectorAll('#evalTabs .tab-btn').forEach((b,i) => {
    const tabs = ['tech','tact','phys','psych'];
    b.classList.toggle('active', tabs[i] === tab);
  });
  const kpiMap = { tech: KPIS.technical, tact: KPIS.tactical, phys: KPIS.physical, psych: KPIS.psychological };
  const kpis = kpiMap[tab] || [];
  const catMap = { tech:'technical', tact:'tactical', phys:'physical', psych:'psychological' };
  const cat = catMap[tab];
  document.getElementById('evalTabContent').innerHTML = `
    <table class="sheet-table">
      <thead><tr><th>KPI</th><th>Description</th><th>Weight</th><th>Score (0–100)</th></tr></thead>
      <tbody>${kpis.map((k,i) => `<tr>
        <td class="font-semibold">${k.name}</td>
        <td style="color:var(--muted);font-size:12px;">${k.desc}</td>
        <td style="color:var(--accent);">${(k.weight*100).toFixed(0)}%</td>
        <td><input type="number" min="0" max="100" class="score-input" id="kpi_${cat}_${i}" value="${evalScores[cat+'_'+i]||70}" oninput="updateEvalScores()"/></td>
      </tr>`).join('')}</tbody>
    </table>`;
  updateEvalScores();
}

function updateEvalScores() {
  const cats = ['technical','tactical','physical','psychological'];
  const kpiSets = [KPIS.technical, KPIS.tactical, KPIS.physical, KPIS.psychological];
  let catScores = {};
  cats.forEach((cat, ci) => {
    const kpis = kpiSets[ci];
    let weighted = 0, totalW = 0;
    kpis.forEach((k,i) => {
      const el = document.getElementById(`kpi_${cat}_${i}`);
      const val = el ? +el.value : 70;
      weighted += val * k.weight;
      totalW += k.weight;
    });
    catScores[cat] = Math.round(weighted / totalW);
  });
  const overall = Math.round((catScores.technical*0.28 + catScores.tactical*0.27 + catScores.physical*0.25 + catScores.psychological*0.20));
  const t = getTier(overall);
  const overallEl = document.getElementById('evalOverall');
  const tierEl = document.getElementById('evalTier');
  const leagueEl = document.getElementById('evalLeague');
  if (overallEl) overallEl.textContent = overall;
  if (tierEl) { tierEl.textContent = t.tier; tierEl.style.color = t.color; }
  if (leagueEl) leagueEl.textContent = getLeagueFit(overall);
}

function saveEval() {
  const pid = document.getElementById('evalPlayer').value;
  if (!pid) return;
  const cats = ['technical','tactical','physical','psychological'];
  const kpiSets = [KPIS.technical, KPIS.tactical, KPIS.physical, KPIS.psychological];
  let catScores = {};
  cats.forEach((cat, ci) => {
    const kpis = kpiSets[ci];
    let weighted = 0, totalW = 0;
    kpis.forEach((k,i) => {
      const el = document.getElementById(`kpi_${cat}_${i}`);
      const val = el ? +el.value : 70;
      weighted += val * k.weight;
      totalW += k.weight;
    });
    catScores[cat] = Math.round(weighted / totalW);
  });
  const overall = Math.round((catScores.technical*0.28 + catScores.tactical*0.27 + catScores.physical*0.25 + catScores.psychological*0.20));
  const evals = DB.get('evaluations');
  const newE = {
    id: 'e' + Date.now(), player_id: pid, evaluator_id: currentUser?.email || 'admin',
    date: document.getElementById('evalDate').value,
    technical_score: catScores.technical, tactical_score: catScores.tactical,
    physical_score: catScores.physical, psychological_score: catScores.psychological,
    archetype_score: Math.round((catScores.technical + catScores.tactical) / 2),
    overall_score: overall,
    risk_score: Math.round(100 - overall * 0.7),
    opportunity_score: overall,
    recommended_league: getLeagueFit(overall),
    recommended_clubs: document.getElementById('evalRecClubs').value,
    strengths: document.getElementById('evalStrengths').value,
    weaknesses: document.getElementById('evalWeaknesses').value,
    risk: document.getElementById('evalRisk').value,
  };
  evals.push(newE);
  DB.set('evaluations', evals);
  closeModal('evalModal');
  renderEvals();
}

// ─── SPREADSHEET ENGINE ──────────────────────────────────────
function showSheet(sheet, tabsId) {
  currentSheet = sheet;
  document.querySelectorAll(`#${tabsId} .tab-btn`).forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderSheet(sheet);
}

function renderSheet(sheet) {
  const el = document.getElementById('sheetContent');
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  if (sheet === 'dashboard') {
    el.innerHTML = `<div class="card"><h3 class="font-semibold mb-4" style="color:var(--accent)"><i class="fas fa-th-large mr-2"></i>Player Dashboard</h3>
      <div class="overflow-x-auto"><table class="sheet-table">
        <thead><tr><th>#</th><th>Player</th><th>Position</th><th>Archetype</th><th>Nationality</th><th>Age</th><th>Overall</th><th>Tier</th><th>Rec. League</th></tr></thead>
        <tbody>${players.map((p,i) => {
          const e = evals.find(ev => ev.player_id === p.id);
          const t = e ? getTier(e.overall_score) : null;
          const age = p.DOB ? Math.floor((Date.now()-new Date(p.DOB))/31557600000) : '?';
          return `<tr>
            <td style="color:var(--muted)">${i+1}</td>
            <td><div class="font-semibold">${p.name}</div><div style="font-size:11px;color:var(--muted)">${p.current_club}</div></td>
            <td>${p.position}</td><td style="font-size:12px;">${p.archetype}</td>
            <td>${p.nationality}</td><td>${age}</td>
            <td>${e?`<span style="font-weight:700;color:${t.color}">${e.overall_score}</span>`:'<span style="color:var(--muted)">N/A</span>'}</td>
            <td>${e?`<span class="badge ${t.badge}">${t.tier}</span>`:'—'}</td>
            <td style="font-size:12px;">${e?e.recommended_league:'—'}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div></div>`;
  } else if (['technical','tactical','physical','psychological'].includes(sheet)) {
    const kpis = KPIS[sheet];
    el.innerHTML = `<div class="card"><h3 class="font-semibold mb-4" style="color:var(--accent);text-transform:capitalize"><i class="fas fa-table mr-2"></i>${sheet} KPIs</h3>
      <div class="overflow-x-auto"><table class="sheet-table">
        <thead><tr><th>KPI</th><th>Description</th><th>Weight</th>${players.map(p=>`<th>${p.name.split(' ')[0]}</th>`).join('')}</tr></thead>
        <tbody>${kpis.map(k => `<tr>
          <td class="font-semibold">${k.name}</td>
          <td style="font-size:12px;color:var(--muted)">${k.desc}</td>
          <td style="color:var(--accent)">${(k.weight*100).toFixed(0)}%</td>
          ${players.map(p => { const e = evals.find(ev=>ev.player_id===p.id); const base = e?e[sheet+'_score']:0; const variance = Math.floor(Math.random()*20)-10; const score = Math.min(100,Math.max(0, base+variance)); return `<td><span style="color:${score>=80?'#34d399':score>=65?'#60a5fa':'#f87171'};font-weight:600;">${e?score:'—'}</span></td>`; }).join('')}
        </tr>`).join('')}
        <tr style="background:rgba(232,184,75,0.1);">
          <td colspan="3" class="font-bold" style="color:var(--accent)">Weighted Score</td>
          ${players.map(p => { const e = evals.find(ev=>ev.player_id===p.id); return `<td><span style="font-weight:700;color:var(--accent)">${e?e[sheet+'_score']:'—'}</span></td>`; }).join('')}
        </tr>
        </tbody>
      </table></div></div>`;
  } else if (sheet === 'archetype') {
    el.innerHTML = `<div class="card"><h3 class="font-semibold mb-4" style="color:var(--accent)"><i class="fas fa-chess-knight mr-2"></i>Archetype-Specific KPIs</h3>
      ${players.map(p => {
        const kpis = ARCHETYPE_KPIS[p.archetype] || [];
        const e = evals.find(ev=>ev.player_id===p.id);
        return `<div class="mb-6"><h4 class="font-semibold mb-2" style="color:#60a5fa">${p.name} — <span style="color:var(--muted)">${p.archetype}</span></h4>
          <table class="sheet-table"><thead><tr><th>KPI</th><th>Weight</th><th>Score</th></tr></thead>
          <tbody>${kpis.map(k => { const base = e?e.overall_score:70; const variance = Math.floor(Math.random()*24)-12; const score = Math.min(100,Math.max(0,base+variance)); return `<tr><td>${k.name}</td><td style="color:var(--accent)">${(k.weight*100).toFixed(0)}%</td><td><span style="color:${score>=80?'#34d399':score>=65?'#60a5fa':'#f87171'};font-weight:600;">${e?score:'—'}</span></td></tr>`; }).join('')}</tbody></table></div>`;
      }).join('')}</div>`;
  } else if (sheet === 'percentile') {
    el.innerHTML = `<div class="card"><h3 class="font-semibold mb-4" style="color:var(--accent)"><i class="fas fa-percentage mr-2"></i>Percentile Rankings</h3>
      <div class="overflow-x-auto"><table class="sheet-table">
        <thead><tr><th>Player</th><th>Technical %ile</th><th>Tactical %ile</th><th>Physical %ile</th><th>Psychological %ile</th><th>Overall %ile</th><th>Peer Group</th></tr></thead>
        <tbody>${players.map(p => {
          const e = evals.find(ev=>ev.player_id===p.id);
          if (!e) return `<tr><td>${p.name}</td><td colspan="6" style="color:var(--muted)">No evaluation</td></tr>`;
          const pct = s => Math.min(99, Math.round(s * 0.95 + Math.random()*8));
          return `<tr>
            <td class="font-semibold">${p.name}</td>
            <td><span style="color:#60a5fa;font-weight:600;">${pct(e.technical_score)}th</span></td>
            <td><span style="color:#34d399;font-weight:600;">${pct(e.tactical_score)}th</span></td>
            <td><span style="color:#f59e0b;font-weight:600;">${pct(e.physical_score)}th</span></td>
            <td><span style="color:#a78bfa;font-weight:600;">${pct(e.psychological_score)}th</span></td>
            <td><span style="color:var(--accent);font-weight:700;font-size:16px;">${pct(e.overall_score)}th</span></td>
            <td style="font-size:12px;color:var(--muted)">${p.position} / ${p.nationality}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div></div>`;
  } else if (sheet === 'finalmodel') {
    el.innerHTML = `<div class="card"><h3 class="font-semibold mb-4" style="color:var(--accent)"><i class="fas fa-calculator mr-2"></i>Final Scoring Model</h3>
      <div class="mb-4 p-4" style="background:#0f172a;border-radius:8px;border:1px solid var(--border);">
        <div class="font-semibold mb-2" style="color:#60a5fa;">Weighting Formula:</div>
        <div style="font-size:13px;color:#e2e8f0;line-height:2;">
          <span style="color:var(--accent);">Overall Score</span> = (Technical × 28%) + (Tactical × 27%) + (Physical × 25%) + (Psychological × 20%)<br/>
          <span style="color:var(--accent);">Elite</span>: ≥ 85 | <span style="color:#2563eb;">High Prospect</span>: 75–84 | <span style="color:#d97706;">Development</span>: 65–74 | <span style="color:#6b7280;">Monitor</span>: &lt; 65
        </div>
      </div>
      <div class="overflow-x-auto"><table class="sheet-table">
        <thead><tr><th>Player</th><th>Technical (28%)</th><th>Tactical (27%)</th><th>Physical (25%)</th><th>Psych (20%)</th><th>Overall</th><th>Tier</th><th>League Fit</th></tr></thead>
        <tbody>${players.map(p => {
          const e = evals.find(ev=>ev.player_id===p.id);
          if (!e) return `<tr><td>${p.name}</td><td colspan="7" style="color:var(--muted)">Awaiting evaluation</td></tr>`;
          const t = getTier(e.overall_score);
          const contrib = {
            tech: (e.technical_score*0.28).toFixed(1),
            tact: (e.tactical_score*0.27).toFixed(1),
            phys: (e.physical_score*0.25).toFixed(1),
            psych: (e.psychological_score*0.20).toFixed(1),
          };
          return `<tr>
            <td class="font-semibold">${p.name}</td>
            <td><span style="color:#60a5fa">${e.technical_score}</span> <span style="font-size:11px;color:var(--muted)">(+${contrib.tech})</span></td>
            <td><span style="color:#34d399">${e.tactical_score}</span> <span style="font-size:11px;color:var(--muted)">(+${contrib.tact})</span></td>
            <td><span style="color:#f59e0b">${e.physical_score}</span> <span style="font-size:11px;color:var(--muted)">(+${contrib.phys})</span></td>
            <td><span style="color:#a78bfa">${e.psychological_score}</span> <span style="font-size:11px;color:var(--muted)">(+${contrib.psych})</span></td>
            <td><span style="font-size:20px;font-weight:700;color:${t.color}">${e.overall_score}</span></td>
            <td><span class="badge ${t.badge}">${t.tier}</span></td>
            <td style="font-size:12px;">${e.recommended_league}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div></div>`;
  }
}

// ─── REPORTS ─────────────────────────────────────────────────
function renderReportPage() {
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const el = document.getElementById('reportView');
  el.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${players.filter(p => evals.find(e=>e.player_id===p.id)).map(p => {
      const e = evals.find(ev=>ev.player_id===p.id);
      const t = getTier(e.overall_score);
      return `<div class="card" style="cursor:pointer;" onclick="generateReport('${p.id}')">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <img src="${p.profile_image||'https://ui-avatars.com/api/?name='+encodeURIComponent(p.name)+'&background=0f4c81&color=fff'}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=P&background=0f4c81&color=fff'"/>
          <div>
            <div class="font-bold">${p.name}</div>
            <div style="font-size:12px;color:var(--muted)">${p.position} · ${p.archetype}</div>
          </div>
          <div style="margin-left:auto;text-align:center;">
            <div style="font-size:24px;font-weight:700;color:${t.color}">${e.overall_score}</div>
            <span class="badge ${t.badge}" style="font-size:10px;">${t.tier}</span>
          </div>
        </div>
        <button class="btn-accent w-full" style="font-size:12px;"><i class="fas fa-file-pdf mr-2"></i>View Full Report</button>
      </div>`;
    }).join('')}
  </div>`;
}

function openGenerateReport() {
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const withEvals = players.filter(p => evals.find(e=>e.player_id===p.id));
  if (!withEvals.length) { alert('No players with evaluations. Please evaluate a player first.'); return; }
  generateReport(withEvals[0].id);
}

function generateReport(pid) {
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const p = players.find(pl=>pl.id===pid);
  const e = evals.find(ev=>ev.player_id===pid);
  if (!p || !e) { alert('No evaluation found for this player'); return; }
  const t = getTier(e.overall_score);
  const age = p.DOB ? Math.floor((Date.now()-new Date(p.DOB))/31557600000) : '?';

  document.getElementById('reportContent').innerHTML = `
    <div style="font-family:'Segoe UI',sans-serif;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0f4c81,#0a1628);padding:24px;border-radius:12px;margin-bottom:20px;display:flex;align-items:center;gap:20px;">
        <img src="${p.profile_image||'https://ui-avatars.com/api/?name='+encodeURIComponent(p.name)+'&background=0f4c81&color=fff&size=80'}" style="width:80px;height:80px;border-radius:50%;border:3px solid var(--accent);object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=P&background=0f4c81&color=fff&size=80'"/>
        <div style="flex:1;">
          <div style="font-size:22px;font-weight:700;color:white;">${p.name}</div>
          <div style="color:var(--accent);font-size:14px;">${p.position} · ${p.archetype}</div>
          <div style="color:#9ca3af;font-size:12px;margin-top:4px;">${p.nationality} · ${age} years · ${p.dominant_foot} foot · ${p.height}cm / ${p.weight}kg</div>
          <div style="color:#9ca3af;font-size:12px;">${p.current_club}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:48px;font-weight:800;color:${t.color};line-height:1;">${e.overall_score}</div>
          <span class="badge ${t.badge}" style="font-size:13px;">${t.tier}</span>
          <div style="color:#9ca3af;font-size:11px;margin-top:4px;">Overall Score</div>
        </div>
      </div>

      <!-- Bio -->
      <div class="card mb-4">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:8px;"><i class="fas fa-user mr-2"></i>Player Biography</h4>
        <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${p.bio || 'No biography available.'}</p>
      </div>

      <!-- Scores Grid -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
        ${[['Technical',e.technical_score,'#60a5fa','fas fa-futbol'],['Tactical',e.tactical_score,'#34d399','fas fa-chess'],['Physical',e.physical_score,'#f59e0b','fas fa-running'],['Psychological',e.psychological_score,'#a78bfa','fas fa-brain']].map(([label,score,color,icon])=>`
          <div class="card" style="text-align:center;">
            <i class="${icon}" style="color:${color};font-size:20px;margin-bottom:8px;display:block;"></i>
            <div style="font-size:28px;font-weight:700;color:${color};">${score}</div>
            <div style="font-size:11px;color:var(--muted);">${label}</div>
            <div class="tier-bar mt-2"><div class="tier-fill" style="width:${score}%;background:${color};"></div></div>
          </div>`).join('')}
      </div>

      <!-- Radar Chart -->
      <div class="card mb-4">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:12px;"><i class="fas fa-chart-radar mr-2"></i>Performance Radar</h4>
        <div style="max-height:320px;position:relative;max-width:400px;margin:0 auto;">
          <canvas id="reportRadarChart"></canvas>
        </div>
      </div>

      <!-- KPI Table -->
      <div class="card mb-4">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:12px;"><i class="fas fa-table mr-2"></i>KPI Summary Table</h4>
        <table class="sheet-table">
          <thead><tr><th>Category</th><th>Score</th><th>Weight</th><th>Contribution</th><th>Rating</th></tr></thead>
          <tbody>
            ${[['Technical',e.technical_score,28,'#60a5fa'],['Tactical',e.tactical_score,27,'#34d399'],['Physical',e.physical_score,25,'#f59e0b'],['Psychological',e.psychological_score,20,'#a78bfa'],['Archetype',e.archetype_score,0,'var(--accent)']].map(([cat,score,w,color])=>`
              <tr>
                <td style="font-weight:600;">${cat}</td>
                <td><span style="color:${color};font-weight:700;font-size:16px;">${score}</span></td>
                <td style="color:var(--muted);">${w?w+'%':'—'}</td>
                <td style="color:${color};">${w?(score*w/100).toFixed(1):'—'}</td>
                <td><div class="tier-bar" style="width:120px;display:inline-block;"><div class="tier-fill" style="width:${score}%;background:${color};"></div></div></td>
              </tr>`).join('')}
            <tr style="background:rgba(232,184,75,0.1);">
              <td style="font-weight:700;color:var(--accent);">OVERALL</td>
              <td><span style="color:${t.color};font-weight:800;font-size:20px;">${e.overall_score}</span></td>
              <td>100%</td>
              <td style="color:${t.color};font-weight:700;">${e.overall_score}</td>
              <td><span class="badge ${t.badge}">${t.tier}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Strengths & Weaknesses -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card">
          <h4 style="color:#34d399;font-weight:600;margin-bottom:8px;"><i class="fas fa-plus-circle mr-2"></i>Strengths</h4>
          <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${e.strengths || 'Technical quality, work rate, and positioning.'}</p>
        </div>
        <div class="card">
          <h4 style="color:#f87171;font-weight:600;margin-bottom:8px;"><i class="fas fa-minus-circle mr-2"></i>Areas to Improve</h4>
          <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${e.weaknesses || 'Consistency and decision-making in final third.'}</p>
        </div>
      </div>

      <!-- Risk & Opportunity -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card">
          <h4 style="color:#f59e0b;font-weight:600;margin-bottom:8px;"><i class="fas fa-exclamation-triangle mr-2"></i>Risk Assessment</h4>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:24px;font-weight:700;color:#f87171;">${e.risk_score}%</span>
            <span style="font-size:12px;color:var(--muted);">Risk Level</span>
          </div>
          <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${e.risk || 'Standard development risk for player profile.'}</p>
        </div>
        <div class="card">
          <h4 style="color:#34d399;font-weight:600;margin-bottom:8px;"><i class="fas fa-arrow-trend-up mr-2"></i>Opportunity Score</h4>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:24px;font-weight:700;color:#34d399;">${e.opportunity_score}%</span>
            <span style="font-size:12px;color:var(--muted);">Opportunity</span>
          </div>
          <p style="font-size:13px;line-height:1.7;color:#d1d5db;">High potential for value appreciation in recommended leagues.</p>
        </div>
      </div>

      <!-- League & Club Recommendations -->
      <div class="card mb-4">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:12px;"><i class="fas fa-map-marker-alt mr-2"></i>Recommended League Fit</h4>
        <div style="background:#0f172a;border-radius:8px;padding:12px;font-size:14px;color:#60a5fa;font-weight:600;">
          <i class="fas fa-trophy mr-2" style="color:var(--accent);"></i>${e.recommended_league || getLeagueFit(e.overall_score)}
        </div>
        ${e.recommended_clubs ? `<div class="mt-3"><div style="font-size:12px;color:var(--muted);margin-bottom:6px;">Recommended Clubs:</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">${e.recommended_clubs.split(',').map(c=>`<span style="background:#1e3a5f;color:#60a5fa;padding:4px 10px;border-radius:20px;font-size:12px;">${c.trim()}</span>`).join('')}</div></div>` : ''}
      </div>

      <!-- Video Links -->
      ${(p.highlight_video_url || p.full_match_video_url) ? `<div class="card mb-4">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:10px;"><i class="fas fa-video mr-2"></i>Video Links</h4>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${p.highlight_video_url ? `<a href="${p.highlight_video_url}" target="_blank" style="background:#dc2626;color:white;padding:8px 16px;border-radius:8px;font-size:13px;text-decoration:none;"><i class="fab fa-youtube mr-2"></i>Highlight Reel</a>` : ''}
          ${p.full_match_video_url ? `<a href="${p.full_match_video_url}" target="_blank" style="background:#1d4ed8;color:white;padding:8px 16px;border-radius:8px;font-size:13px;text-decoration:none;"><i class="fas fa-film mr-2"></i>Full Match</a>` : ''}
        </div>
      </div>` : ''}

      <!-- Footer -->
      <div style="text-align:center;padding:16px;color:var(--muted);font-size:11px;border-top:1px solid var(--border);margin-top:8px;">
        Generated by ScoutPro Platform · FIFA-Licensed Football Agent System · ${new Date().toLocaleDateString()}
      </div>
    </div>`;

  openModal('reportModal');

  setTimeout(() => {
    const ctx = document.getElementById('reportRadarChart');
    if (!ctx) return;
    new Chart(ctx.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Technical', 'Tactical', 'Physical', 'Psychological', 'Archetype'],
        datasets: [{
          label: p.name,
          data: [e.technical_score, e.tactical_score, e.physical_score, e.psychological_score, e.archetype_score],
          backgroundColor: 'rgba(15,76,129,0.3)',
          borderColor: '#e8b84b',
          borderWidth: 2,
          pointBackgroundColor: '#e8b84b',
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        scales: { r: { min: 0, max: 100, ticks: { color: '#9ca3af', stepSize: 20 }, grid: { color: '#374151' }, pointLabels: { color: '#f3f4f6', font: { size: 12 } }, angleLines: { color: '#374151' } } },
        plugins: { legend: { labels: { color: '#f3f4f6' } } }
      }
    });
  }, 100);
}

// ─── CLUBS ───────────────────────────────────────────────────
function populateClubCountryFilter() {
  const clubs = DB.get('clubs');
  const countries = [...new Set(clubs.map(c=>c.country))].sort();
  const sel = document.getElementById('clubCountryFilter');
  if (sel) sel.innerHTML = '<option value="">All Countries</option>' + countries.map(c=>`<option>${c}</option>`).join('');
}

function renderClubs() {
  const clubs = DB.get('clubs');
  const search = (document.getElementById('clubSearch')||{}).value?.toLowerCase()||'';
  const country = (document.getElementById('clubCountryFilter')||{}).value||'';
  const style = (document.getElementById('clubStyleFilter')||{}).value||'';
  const filtered = clubs.filter(c => {
    const ms = !search || c.name.toLowerCase().includes(search) || c.country.toLowerCase().includes(search) || (c.ideal_archetypes||'').toLowerCase().includes(search);
    const mc = !country || c.country === country;
    const mst = !style || c.playing_style === style;
    return ms && mc && mst;
  });
  const styleColors = { 'High Press':'#dc2626','Possession':'#2563eb','Counter-Attack':'#16a34a','Direct Play':'#d97706','Hybrid':'#7c3aed' };
  const foreignColors = { High:'#34d399', Medium:'#f59e0b', Low:'#f87171' };
  const grid = document.getElementById('clubsGrid');
  if (!filtered.length) { grid.innerHTML = '<div class="text-center py-12" style="color:var(--muted);grid-column:1/-1;"><i class="fas fa-shield-alt text-4xl mb-3 block"></i>No clubs found</div>'; return; }
  grid.innerHTML = filtered.map(c => `
    <div class="club-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div class="font-bold text-base">${c.name}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;"><i class="fas fa-globe mr-1"></i>${c.country} · ${c.league_level}</div>
        </div>
        <span style="background:${styleColors[c.playing_style]||'#6b7280'}22;color:${styleColors[c.playing_style]||'#6b7280'};padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;">${c.playing_style}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        <span style="font-size:11px;background:#1e3a5f;color:#60a5fa;padding:2px 8px;border-radius:12px;"><i class="fas fa-users mr-1"></i>${c.age_profile}</span>
        <span style="font-size:11px;background:${foreignColors[c.foreign_player_openness]||'#6b7280'}22;color:${foreignColors[c.foreign_player_openness]||'#6b7280'};padding:2px 8px;border-radius:12px;"><i class="fas fa-passport mr-1"></i>Foreign: ${c.foreign_player_openness}</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px;"><i class="fas fa-chess-knight mr-1"></i>${c.ideal_archetypes}</div>
      ${c.notes ? `<div style="font-size:11px;color:#9ca3af;border-top:1px solid var(--border);padding-top:6px;margin-top:6px;">${c.notes}</div>` : ''}
      <div style="margin-top:8px;display:flex;gap:6px;">
        ${c.contact_email ? `<a href="mailto:${c.contact_email}" style="font-size:11px;background:#374151;color:#60a5fa;padding:4px 10px;border-radius:6px;text-decoration:none;"><i class="fas fa-envelope mr-1"></i>Contact</a>` : ''}
        <button class="btn-primary" style="font-size:11px;padding:4px 10px;" onclick="selectClubForOutreach('${c.id}')"><i class="fas fa-paper-plane mr-1"></i>Outreach</button>
      </div>
    </div>`).join('');
}

function openAddClub() { openModal('addClubModal'); }

function saveClub() {
  const name = document.getElementById('cName').value.trim();
  if (!name) { alert('Club name is required'); return; }
  const clubs = DB.get('clubs');
  clubs.push({
    id: 'c' + Date.now(),
    name, country: document.getElementById('cCountry').value,
    league_level: document.getElementById('cLeague').value,
    playing_style: document.getElementById('cStyle').value,
    age_profile: document.getElementById('cAge').value,
    foreign_player_openness: document.getElementById('cForeign').value,
    contact_email: document.getElementById('cEmail').value,
    ideal_archetypes: document.getElementById('cArchetypes').value,
    notes: document.getElementById('cNotes').value,
  });
  DB.set('clubs', clubs);
  closeModal('addClubModal');
  renderClubs();
  populateClubCountryFilter();
}

function selectClubForOutreach(cid) {
  showPage('outreach');
  setTimeout(() => { document.getElementById('outreachClub').value = cid; generateEmail(); }, 100);
}

// ─── OUTREACH ────────────────────────────────────────────────
function initOutreach() {
  const players = DB.get('players');
  const clubs = DB.get('clubs');
  const ps = document.getElementById('outreachPlayer');
  const cs = document.getElementById('outreachClub');
  ps.innerHTML = players.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  cs.innerHTML = clubs.map(c=>`<option value="${c.id}">${c.name} (${c.country})</option>`).join('');
  generateEmail();
  renderOutreachTracker();
}

function generateEmail() {
  const players = DB.get('players');
  const clubs = DB.get('clubs');
  const evals = DB.get('evaluations');
  const pid = document.getElementById('outreachPlayer')?.value;
  const cid = document.getElementById('outreachClub')?.value;
  const template = document.getElementById('emailTemplate')?.value || 'intro';
  const p = players.find(pl=>pl.id===pid);
  const c = clubs.find(cl=>cl.id===cid);
  const e = evals.find(ev=>ev.player_id===pid);
  if (!p || !c) return;
  const age = p.DOB ? Math.floor((Date.now()-new Date(p.DOB))/31557600000) : '?';
  const agentName = currentUser?.name || 'FIFA-Licensed Agent';
  let email = '';
  if (template === 'intro') {
    email = `Subject: Player Presentation – ${p.name} | ${p.position} | ${p.nationality}\n\nDear Scouting Department,\n\nMy name is ${agentName}, a FIFA-licensed football agent. I am writing to present ${p.name}, a ${age}-year-old ${p.position} (${p.archetype}) from ${p.nationality}, currently at ${p.current_club}.\n\nPlayer Overview:\n• Position: ${p.position}\n• Archetype: ${p.archetype}\n• Age: ${age} years\n• Height/Weight: ${p.height}cm / ${p.weight}kg\n• Dominant Foot: ${p.dominant_foot}\n${e ? `• Overall Scouting Score: ${e.overall_score}/100 (${getTier(e.overall_score).tier})\n• Recommended League: ${e.recommended_league}` : ''}\n\nBased on our analysis, ${p.name} would be an excellent fit for ${c.name}'s ${c.playing_style} system and ${c.age_profile} profile.\n\n${e && e.strengths ? `Key Strengths:\n${e.strengths}\n\n` : ''}I would be delighted to provide a full scouting report, video footage, and arrange a trial if of interest.\n\nKind regards,\n${agentName}\nFIFA-Licensed Football Agent\nScoutPro Platform`;
  } else if (template === 'trial') {
    email = `Subject: Trial Request – ${p.name} | ${p.position} | ${p.nationality}\n\nDear Technical Director / Head of Recruitment,\n\nFollowing our initial presentation of ${p.name}, I would like to formally request a trial opportunity at ${c.name}.\n\n${p.name} (${age}, ${p.position}) has shown exceptional qualities in recent evaluations${e ? ` with an overall score of ${e.overall_score}/100` : ''}. His profile aligns strongly with your club's ${c.playing_style} philosophy.\n\nProposed Trial Details:\n• Duration: 1–2 weeks (flexible)\n• Player is available: Immediately\n• Accommodation: Self-arranged\n\nI have attached a full scouting report and video links for your review. I am available for a call at your convenience.\n\nBest regards,\n${agentName}\nFIFA-Licensed Football Agent`;
  } else if (template === 'followup') {
    email = `Subject: Follow-Up – ${p.name} Presentation to ${c.name}\n\nDear Scouting Team,\n\nI wanted to follow up on my previous correspondence regarding ${p.name}, the ${age}-year-old ${p.position} from ${p.nationality}.\n\nSince our last communication, ${p.name} has continued to perform at a high level${e ? `, maintaining an overall scouting score of ${e.overall_score}/100` : ''}. His development trajectory remains very positive.\n\nI believe this could be an excellent opportunity for ${c.name} to secure a quality player who fits your profile and budget.\n\nWould you be available for a brief call this week to discuss further?\n\nWith kind regards,\n${agentName}\nFIFA-Licensed Football Agent\nScoutPro Platform`;
  } else if (template === 'report') {
    email = `Subject: Scouting Report Submission – ${p.name} | ${p.position}\n\nDear Head of Recruitment,\n\nPlease find attached the full scouting report for ${p.name}, prepared by our certified scouting team.\n\nReport Summary:\n• Player: ${p.name}\n• Age: ${age} | ${p.nationality} | ${p.position}\n• Archetype: ${p.archetype}\n${e ? `• Overall Score: ${e.overall_score}/100 | Tier: ${getTier(e.overall_score).tier}\n• Technical: ${e.technical_score} | Tactical: ${e.tactical_score} | Physical: ${e.physical_score} | Psychological: ${e.psychological_score}` : ''}\n${e && e.strengths ? `• Key Strengths: ${e.strengths}` : ''}\n\nThe report includes:\n✓ Full KPI breakdown\n✓ Percentile rankings vs peer group\n✓ Radar chart analysis\n✓ Risk & opportunity assessment\n✓ Video footage links\n✓ Recommended league & club fit\n\nWe are confident ${p.name} would be a valuable addition to ${c.name}. Please do not hesitate to contact me for further information.\n\nYours sincerely,\n${agentName}\nFIFA-Licensed Football Agent`;
  }
  const el = document.getElementById('emailPreview');
  if (el) el.textContent = email;
}

function copyEmail() {
  const text = document.getElementById('emailPreview')?.textContent || '';
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target.closest('button');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
    // Save to tracker
    const players = DB.get('players');
    const clubs = DB.get('clubs');
    const pid = document.getElementById('outreachPlayer')?.value;
    const cid = document.getElementById('outreachClub')?.value;
    const p = players.find(pl=>pl.id===pid);
    const c = clubs.find(cl=>cl.id===cid);
    if (p && c) {
      const outreach = DB.get('outreach');
      outreach.push({ id:'o'+Date.now(), player:p.name, club:c.name, date:new Date().toLocaleDateString(), status:'Sent', template:document.getElementById('emailTemplate')?.value });
      DB.set('outreach', outreach);
      renderOutreachTracker();
    }
  });
}

function renderOutreachTracker() {
  const outreach = DB.get('outreach');
  const el = document.getElementById('outreachTracker');
  if (!outreach.length) { el.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;font-size:13px;">No outreach emails sent yet</div>'; return; }
  el.innerHTML = `<table class="sheet-table"><thead><tr><th>Player</th><th>Club</th><th>Template</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${outreach.slice().reverse().map(o=>`<tr>
      <td class="font-semibold">${o.player}</td>
      <td>${o.club}</td>
      <td style="font-size:12px;color:var(--muted);text-transform:capitalize;">${o.template||'intro'}</td>
      <td style="color:var(--muted);font-size:12px;">${o.date}</td>
      <td><span style="background:#16a34a22;color:#34d399;padding:2px 8px;border-radius:12px;font-size:11px;">Sent</span></td>
      <td><button class="btn-success" style="font-size:11px;padding:3px 8px;" onclick="updateOutreachStatus('${o.id}')">Update</button></td>
    </tr>`).join('')}</tbody></table>`;
}

function updateOutreachStatus(id) {
  const statuses = ['Sent','Viewed','Interested','Not Interested','Trial Arranged'];
  const current = DB.get('outreach');
  const item = current.find(o=>o.id===id);
  if (!item) return;
  const next = statuses[(statuses.indexOf(item.status)+1) % statuses.length];
  item.status = next;
  DB.set('outreach', current);
  renderOutreachTracker();
}

// ─── PLAYER PROFILE PAGE ─────────────────────────────────────
function initProfile() {
  const players = DB.get('players');
  const sel = document.getElementById('profilePlayerSelect');
  sel.innerHTML = '<option value="">Select a player...</option>' + players.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  if (players.length) { sel.value = players[0].id; renderProfile(); }
}

function renderProfile() {
  const pid = document.getElementById('profilePlayerSelect')?.value;
  if (!pid) { document.getElementById('profileContent').innerHTML = '<div style="color:var(--muted);text-align:center;padding:40px;">Select a player to view profile</div>'; return; }
  const players = DB.get('players');
  const evals = DB.get('evaluations');
  const p = players.find(pl=>pl.id===pid);
  const e = evals.find(ev=>ev.player_id===pid);
  if (!p) return;
  const t = e ? getTier(e.overall_score) : null;
  const age = p.DOB ? Math.floor((Date.now()-new Date(p.DOB))/31557600000) : '?';
  const dob = p.DOB ? new Date(p.DOB).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}) : 'N/A';

  document.getElementById('profileContent').innerHTML = `
    <!-- Hero Banner -->
    <div style="background:linear-gradient(135deg,#0a1628 0%,#0f4c81 50%,#0a1628 100%);border-radius:16px;padding:32px;margin-bottom:20px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;right:0;width:300px;height:100%;background:linear-gradient(90deg,transparent,rgba(232,184,75,0.05));"></div>
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;">
        <div style="position:relative;">
          <img src="${p.profile_image||'https://ui-avatars.com/api/?name='+encodeURIComponent(p.name)+'&background=0f4c81&color=fff&size=120'}" style="width:120px;height:120px;border-radius:50%;border:4px solid var(--accent);object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=P&background=0f4c81&color=fff&size=120'"/>
          ${t ? `<span class="badge ${t.badge}" style="position:absolute;bottom:0;right:0;font-size:10px;">${t.tier}</span>` : ''}
        </div>
        <div style="flex:1;">
          <h2 style="font-size:28px;font-weight:800;color:white;margin-bottom:4px;">${p.name}</h2>
          <div style="color:var(--accent);font-size:15px;font-weight:600;margin-bottom:8px;">${p.position} · ${p.archetype}</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:#9ca3af;">
            <span><i class="fas fa-flag mr-1" style="color:var(--accent);"></i>${p.nationality}</span>
            <span><i class="fas fa-birthday-cake mr-1" style="color:var(--accent);"></i>${dob} (${age} yrs)</span>
            <span><i class="fas fa-ruler-vertical mr-1" style="color:var(--accent);"></i>${p.height} cm</span>
            <span><i class="fas fa-weight mr-1" style="color:var(--accent);"></i>${p.weight} kg</span>
            <span><i class="fas fa-shoe-prints mr-1" style="color:var(--accent);"></i>${p.dominant_foot} foot</span>
            <span><i class="fas fa-shield-alt mr-1" style="color:var(--accent);"></i>${p.current_club}</span>
          </div>
        </div>
        ${e ? `<div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:12px;padding:20px 28px;border:1px solid rgba(232,184,75,0.3);">
          <div style="font-size:52px;font-weight:900;color:${t.color};line-height:1;">${e.overall_score}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Overall Score</div>
          <span class="badge ${t.badge}" style="margin-top:6px;display:inline-block;">${t.tier}</span>
        </div>` : `<div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:12px;padding:20px 28px;">
          <div style="font-size:14px;color:var(--muted);">No Evaluation</div>
          <button class="btn-accent mt-2" style="font-size:12px;" onclick="openEvalForPlayer('${p.id}')">Evaluate Now</button>
        </div>`}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
      <!-- Bio -->
      <div class="card">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:10px;"><i class="fas fa-user mr-2"></i>Biography</h4>
        <p style="font-size:13px;line-height:1.8;color:#d1d5db;">${p.bio || 'No biography available. Click edit to add player bio.'}</p>
        ${p.highlight_video_url || p.full_match_video_url ? `<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
          ${p.highlight_video_url ? `<a href="${p.highlight_video_url}" target="_blank" style="background:#dc2626;color:white;padding:6px 12px;border-radius:6px;font-size:12px;text-decoration:none;"><i class="fab fa-youtube mr-1"></i>Highlights</a>` : ''}
          ${p.full_match_video_url ? `<a href="${p.full_match_video_url}" target="_blank" style="background:#1d4ed8;color:white;padding:6px 12px;border-radius:6px;font-size:12px;text-decoration:none;"><i class="fas fa-film mr-1"></i>Full Match</a>` : ''}
        </div>` : ''}
      </div>

      <!-- Radar Chart -->
      <div class="card">
        <h4 style="color:var(--accent);font-weight:600;margin-bottom:10px;"><i class="fas fa-chart-radar mr-2"></i>Performance Radar</h4>
        ${e ? `<div style="max-height:250px;position:relative;"><canvas id="profileRadar"></canvas></div>` : '<div style="color:var(--muted);text-align:center;padding:40px;font-size:13px;">Evaluate player to see radar</div>'}
      </div>
    </div>

    ${e ? `
    <!-- Score Bars -->
    <div class="card mb-4">
      <h4 style="color:var(--accent);font-weight:600;margin-bottom:14px;"><i class="fas fa-chart-bar mr-2"></i>Score Breakdown</h4>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
        ${[['Technical',e.technical_score,'#60a5fa'],['Tactical',e.tactical_score,'#34d399'],['Physical',e.physical_score,'#f59e0b'],['Psychological',e.psychological_score,'#a78bfa'],['Archetype',e.archetype_score,'var(--accent)']].map(([label,score,color])=>`
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="font-size:13px;">${label}</span>
              <span style="font-weight:700;color:${color};">${score}</span>
            </div>
            <div class="tier-bar"><div class="tier-fill" style="width:${score}%;background:${color};"></div></div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Strengths & Weaknesses -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div class="card">
        <h4 style="color:#34d399;font-weight:600;margin-bottom:8px;"><i class="fas fa-check-circle mr-2"></i>Strengths</h4>
        <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${e.strengths||'N/A'}</p>
      </div>
      <div class="card">
        <h4 style="color:#f87171;font-weight:600;margin-bottom:8px;"><i class="fas fa-times-circle mr-2"></i>Weaknesses</h4>
        <p style="font-size:13px;line-height:1.7;color:#d1d5db;">${e.weaknesses||'N/A'}</p>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="card mb-4">
      <h4 style="color:var(--accent);font-weight:600;margin-bottom:10px;"><i class="fas fa-map-marker-alt mr-2"></i>League & Club Fit</h4>
      <div style="background:#0f172a;border-radius:8px;padding:12px;margin-bottom:10px;">
        <span style="color:#60a5fa;font-weight:600;font-size:14px;"><i class="fas fa-trophy mr-2" style="color:var(--accent);"></i>${e.recommended_league||getLeagueFit(e.overall_score)}</span>
      </div>
      ${e.recommended_clubs ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${e.recommended_clubs.split(',').map(c=>`<span style="background:#1e3a5f;color:#60a5fa;padding:4px 10px;border-radius:20px;font-size:12px;">${c.trim()}</span>`).join('')}</div>` : ''}
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn-accent" onclick="generateReport('${p.id}')"><i class="fas fa-file-pdf mr-2"></i>Full Scouting Report</button>
      <button class="btn-primary" onclick="openEvalForPlayer('${p.id}')"><i class="fas fa-clipboard-check mr-2"></i>New Evaluation</button>
    </div>` : ''}
  `;

  if (e) {
    setTimeout(() => {
      const ctx = document.getElementById('profileRadar');
      if (!ctx) return;
      new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
          labels: ['Technical','Tactical','Physical','Psychological','Archetype'],
          datasets: [{ label: p.name, data: [e.technical_score,e.tactical_score,e.physical_score,e.psychological_score,e.archetype_score], backgroundColor:'rgba(15,76,129,0.3)', borderColor:'#e8b84b', borderWidth:2, pointBackgroundColor:'#e8b84b', pointRadius:4 }]
        },
        options: { responsive:true, maintainAspectRatio:true, scales:{ r:{ min:0, max:100, ticks:{color:'#9ca3af',stepSize:20}, grid:{color:'#374151'}, pointLabels:{color:'#f3f4f6',font:{size:11}}, angleLines:{color:'#374151'} } }, plugins:{ legend:{display:false} } }
      });
    }, 100);
  }
}

// ─── UTILITIES ───────────────────────────────────────────────
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) e.target.classList.remove('open');
});
