/**
 * app.js - Lógica Principal de Pádel Manager Pro
 * Conecta todos los módulos y maneja la interfaz
 */

// Datos de ejemplo para auto-llenar
const DB = {
    m: [['Alejandro García',6],['Carlos Rodríguez',5],['Diego Martínez',6],['Pablo López',4],['Javier González',5]],
    f: [['María García',6],['Ana Rodríguez',5],['Laura Martínez',6],['Sofía López',4],['Carmen González',5]]
};

// Iconos SVG
const ICO = {
    ball: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M4 12 Q12 7 20 12"/><path d="M4 12 Q12 17 20 12"/></svg>',
    trophy: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2h12v7a6 6 0 01-12 0V2z"/><path d="M6 5H2v2a4 4 0 004 4"/><path d="M18 5h4v2a4 4 0 01-4 4"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
    star: '<svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    pen: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    sparkles: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>'
};

// Estado de la aplicación
const app = {
    _cm: null,
    _lt: null,
    _ti: null,
    _tt: null,
    _bannerTimer: null,
    _bannerIdx: 0,
    _bannerSlots: 0,
    _editIdx: -1,
    _peIdx: -1,
    _peMedia: null,
    _peIsVideo: false,

    // Estado del torneo
    state: {
        tourName: 'Torneo Pádel',
        config: null,
        teams: [],
        matches: [],
        tourLogo: null
    },

    /**
     * Inicializa la aplicación
     */
    init() {
        this._splash();
        
        // Header glass effect on scroll
        window.addEventListener('scroll', () => {
            const hdr = document.getElementById('main-header');
            if (hdr) hdr.classList.toggle('glass', window.scrollY > 30);
        }, { passive: true });

        // Ripple effect on buttons
        document.addEventListener('pointerdown', e => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const r = document.createElement('span');
            r.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const sz = Math.max(rect.width, rect.height) * 2;
            r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rect.left - sz/2}px;top:${e.clientY - rect.top - sz/2}px`;
            btn.appendChild(r);
            setTimeout(() => r.remove(), 600);
        });

        this._restoreHeaderState();

        // Cargar datos guardados
        setTimeout(() => {
            const saved = VersionedStorage.load();
            if (saved && saved.c && saved.t && saved.t.length > 0) {
                this.state.tourName = saved.n || 'Torneo Pádel';
                this.state.config = saved.c;
                this.state.teams = saved.t;
                this.state.matches = saved.m || [];
                this.state.tourLogo = saved.logo || null;
                document.getElementById('tour-name').textContent = this.state.tourName;
                this.sv('dash');
            } else {
                this.sv('config');
            }
        }, 2300);
    },

    /**
     * Splash screen animado
     */
    _splash() {
        const bar = document.getElementById('splash-bar');
        const msg = document.getElementById('splash-msg');
        const msgs = ['Cargando datos...', 'Preparando interfaz...', '¡Listo para jugar!'];
        let p = 0, mi = 0;

        const tick = () => {
            p += (100 - p) * 0.04 + 0.5;
            if (p > 99) p = 100;
            bar.style.width = p + '%';
            if (p > 40 && mi === 0) { msg.textContent = msgs[1]; mi = 1; }
            if (p > 90 && mi === 1) { msg.textContent = msgs[2]; mi = 2; }
            if (p < 100) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        setTimeout(() => {
            const s = document.getElementById('splash');
            s.style.transition = 'opacity .5s ease';
            s.style.opacity = '0';
            setTimeout(() => { s.style.display = 'none'; }, 500);
        }, 2200);
    },

    /**
     * Cambia de vista
     * @param {string} v - Vista (config, register, dash)
     */
    sv(v) {
        const map = { config: 'v-config', register: 'v-register', dash: 'v-dash' };
        
        Object.entries(map).forEach(([k, id]) => {
            document.getElementById(id).style.display = k === v ? '' : 'none';
            const bn = document.getElementById('bn-' + k);
            if (bn) bn.style.color = k === v ? '#2563eb' : '#9ca3af';
        });

        // Step indicators
        const si = ['config', 'register', 'dash'].indexOf(v);
        [0, 1, 2].forEach(i => {
            const el = document.getElementById('step-' + i);
            if (el) el.style.background = i <= si ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.2)';
        });

        // Header toggle visibility
        const pill = document.getElementById('hdr-toggle');
        if (pill) pill.style.display = v === 'dash' ? 'block' : 'none';

        if (v === 'config') {
            if (this.state.tourLogo) {
                const prev = document.getElementById('tour-img-preview');
                const lbl = document.getElementById('cfg-img-lbl');
                const rmv = document.getElementById('cfg-img-remove');
                if (prev) { prev.src = this.state.tourLogo; prev.style.display = 'block'; }
                if (lbl) lbl.textContent = '✓ Imagen cargada';
                if (rmv) rmv.style.display = 'flex';
            }
            document.getElementById('hdr-sub').textContent = 'Configura y genera tu torneo';
        }

        if (v === 'register') this._updReg();
        if (v === 'dash') requestAnimationFrame(() => this._ra());
    },

    /**
     * Ir a registro desde configuración
     */
    goRegister(e) {
        e.preventDefault();
        
        const playersPerTeam = +document.getElementById('f-playersPerTeam')?.value || 2;
        if (playersPerTeam < 1 || playersPerTeam > 20) {
            alert('Jugadores por equipo: 1-20');
            return;
        }

        const format = document.getElementById('f-format').value;
        const setType = document.getElementById('f-settype').value;
        let gamesPerSet = 6;
        
        if (setType === 'short') gamesPerSet = 4;
        else if (setType === 'pro') gamesPerSet = 8;
        else if (setType === 'custom') gamesPerSet = +document.getElementById('f-custom-games')?.value || 6;

        const tiebreakType = document.getElementById('f-tiebreak-type').value;
        let tiebreakPoints = 7;
        
        if (tiebreakType === 'match' || tiebreakType === 'champions') tiebreakPoints = 10;
        else if (tiebreakType === 'custom') tiebreakPoints = +document.getElementById('f-tiebreak-points')?.value || 7;

        this.state.config = {
            genderMode: document.querySelector('input[name="genderMode"]:checked').value,
            playersPerTeam,
            format,
            matchType: document.getElementById('f-matchtype').value,
            numCourts: 2,
            ptsWin: +document.getElementById('f-win').value || 3,
            ptsLoss: +document.getElementById('f-loss').value || 1,
            ptsDraw: +document.getElementById('f-draw').value || 2,
            setType,
            gamesPerSet,
            tiebreakType,
            tiebreakPoints,
            startDate: '',
            matchesPerDay: 4
        };

        this.sv('register');
    },

    /**
     * Configura tipo de equipo
     */
    setTeamType(val) {
        document.getElementById('custom-players-container').style.display = val === 'custom' ? 'block' : 'none';
        if (val !== 'custom') document.getElementById('f-playersPerTeam').value = 2;
    },

    /**
     * Muestra/oculta opciones de set custom
     */
    toggleSetOptions() {
        const type = document.getElementById('f-settype')?.value;
        const c = document.getElementById('custom-set-container');
        if (c) c.style.display = type === 'custom' ? 'block' : 'none';
    },

    /**
     * Muestra/oculta opciones de tie-break custom
     */
    toggleCustomTiebreak() {
        const type = document.getElementById('f-tiebreak-type')?.value;
        const c = document.getElementById('custom-tiebreak-container');
        if (c) c.style.display = type === 'custom' ? 'block' : 'none';
    },

    /**
     * Actualiza resumen de configuración
     */
    updateConfigSummary() {
        const format = document.getElementById('f-format')?.value;
        const ci = document.getElementById('custom-format-info');
        if (ci) ci.classList.toggle('hidden', format !== 'custom');
    },

    /**
     * Actualiza vista de registro
     */
    _updReg() {
        if (!this.state.config) return;

        const gndL = { male: 'Masculino', female: 'Femenino', mixed: 'Mixto' };
        const fmtL = { 
            elimination: '🏆 Elim.', 
            league: '📋 Liga', 
            groups: '🏟️ Grupos', 
            americano: '🌎 Americano', 
            mexicano: '🇲🇽 Mexicano', 
            swiss: '♟️ Suizo' 
        };

        document.getElementById('reg-hint').textContent = `Mínimo 4 equipos · ${this.state.config.playersPerTeam} jugador${this.state.config.playersPerTeam === 1 ? '' : 'es'}/equipo`;
        document.getElementById('reg-mode').textContent = `${fmtL[this.state.config.format] || this.state.config.format} · ${gndL[this.state.config.genderMode]}`;

        if (this.state.config.numCourts) {
            const ce = document.getElementById('f-courts');
            if (ce) ce.value = this.state.config.numCourts;
        }
        if (this.state.config.startDate) {
            const sd = document.getElementById('f-startdate');
            if (sd) sd.value = this.state.config.startDate;
        }
        if (this.state.config.matchesPerDay) {
            const md = document.getElementById('f-matchesperday');
            if (md) md.value = this.state.config.matchesPerDay;
        }

        this._renderReg();
        this._updGenBtn();
        this.calculateDuration();
    },

    /**
     * Renderiza lista de equipos (CON SANITIZACIÓN XSS)
     */
    _renderReg() {
        const c = document.getElementById('reg-list');
        const n = this.state.teams.filter(t => !t.isBye).length;
        
        document.getElementById('reg-count').textContent = n + (n === 1 ? ' equipo' : ' equipos');
        const rct = document.getElementById('reg-cal-teams');
        if (rct) rct.textContent = n;

        this.calculateDuration();

        const all = this.state.teams.filter(t => !t.isBye);
        if (!all.length) {
            c.innerHTML = `<div class="text-center py-10 text-gray-400"><p class="font-bold">Sin equipos registrados</p><p class="text-sm mt-1">Pulsa Agregar o Auto-llenar</p></div>`;
            return;
        }

        c.innerHTML = all.map((t, i) => {
            const bg = t.gender === 'male' ? 'linear-gradient(135deg,#60a5fa,#2563eb)' : 
                       t.gender === 'female' ? 'linear-gradient(135deg,#f472b6,#be185d)' : 
                       'linear-gradient(135deg,#a78bfa,#7c3aed)';
            
            const hasPhoto = t.photo && t.photo.length > 10;
            const av = hasPhoto ? 
                (t.isVideo ? `<video src="${t.photo}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0" autoplay muted loop playsinline></video>` : 
                `<img src="${t.photo}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0">`) : 
                `<div style="width:44px;height:44px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:white;flex-shrink:0">${Sanitizer.text(t.name.charAt(0).toUpperCase())}</div>`;

            const pl = t.players.map(p => `<span style="background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${Sanitizer.text(p.name)}</span>`).join(' ');
            const catDisplay = t.category ? t.category + 'CAT' : '';
            const realIdx = this.state.teams.indexOf(t);

            return `<div style="display:flex;align-items:center;gap:12px;padding:12px;border:2px solid #f1f5f9;border-radius:14px;margin-bottom:8px;background:white">
${av}<div style="flex:1;min-width:0">
<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">${t.seed ? `<span style="background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${ICO.star} Cabeza de serie</span>` : ''} ${catDisplay ? `<span style="background:#e0e7ff;color:#3730a3;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px">${catDisplay}</span>` : ''}</div>
<div style="font-weight:800;color:#1e293b;margin-bottom:4px">${Sanitizer.text(t.name)}</div>
<div style="display:flex;gap:4px;flex-wrap:wrap">${pl}</div>
</div>
<div style="display:flex;gap:4px;flex-shrink:0">
<button onclick="app.editTeam(${realIdx})" style="width:28px;height:28px;border-radius:8px;background:#dbeafe;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#2563eb">${ICO.pen}</button>
<button onclick="app.removeTeam(${realIdx})" style="width:28px;height:28px;border-radius:8px;background:#fee2e2;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#dc2626">${ICO.trash}</button>
</div>
</div>`;
        }).join('');
    },

    // ... CONTINÚA CON EL RESTO DE MÉTODOS DE LA APP ...
    // (Para brevedad, incluyo los métodos críticos restantes)

    _updGenBtn() {
        if (!this.state.config) return;
        const n = this.state.teams.filter(t => !t.isBye).length;
        const min = 4;
        const ok = n >= min;
        
        const btn = document.getElementById('gen-btn');
        const badge = document.getElementById('gen-badge');
        
        btn.disabled = !ok;
        
        if (ok) {
            btn.className = 'w-full text-white font-black py-4 rounded-xl text-sm transition-all bg-gradient-to-r from-blue-900 to-blue-500 hover:shadow-lg cursor-pointer btn-shine btn-pulse flex items-center justify-center gap-2';
            btn.innerHTML = `${ICO.sparkles}Generar Torneo · ${n} equipos`;
        } else {
            btn.className = 'w-full bg-gray-300 text-white font-black py-4 rounded-xl text-sm transition-all opacity-60 cursor-not-allowed flex items-center justify-center gap-2';
            btn.innerHTML = `${ICO.sparkles}Generar Torneo`;
        }
        
        badge.className = `font-black text-xs px-3 py-1 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`;
        badge.textContent = ok ? `${n} equipos` : `Faltan ${min - n}`;
        
        document.getElementById('gen-status').textContent = ok ? `${n} equipos · ${this.state.config.playersPerTeam} jugadores c/u` : `Mínimo ${min} equipos para generar`;
    },

    /**
     * Genera el torneo
     */
    generate() {
        if (!this.state.config || this.state.teams.filter(t => !t.isBye).length < 4) {
            this._toast('⚠️ Necesitas mínimo 4 equipos');
            return;
        }

        this.state.config.numCourts = +document.getElementById('f-courts')?.value || 2;
        this.state.config.startDate = document.getElementById('f-startdate')?.value || '';
        this.state.config.matchesPerDay = +document.getElementById('f-matchesperday')?.value || 4;
        this.state.matches = [];

        const fmt = this.state.config.format;
        const teams = this.state.teams.filter(t => !t.isBye);

        // Generar según formato
        if (fmt === 'elimination') this._mkElim(teams);
        else if (fmt === 'league') this._mkLeague(teams);
        else if (fmt === 'groups') this._mkGroups(teams);
        else if (fmt === 'americano') this.state.matches = AmericanoFormat.generateMatches(teams, this.state.config);
        else if (fmt === 'mexicano') this.state.matches = MexicanoFormat.generateMatches(teams, this.state.config);
        else if (fmt === 'swiss') this.state.matches = SwissFormat.generateMatches(teams, this.state.config);

        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        VersionedStorage.saveHistory({
            tourName: this.state.tourName,
            config: this.state.config,
            teams: this.state.teams,
            matches: this.state.matches
        });

        this._startLoader();
    },

    // ... Métodos restantes para generación de partidos ...
    _mkElim(teams) {
        // Implementación de eliminación directa
        const ts = [...teams];
        const n = ts.length;
        const size = Math.pow(2, Math.ceil(Math.log2(n)));
        
        // Agregar BYEs si necesario
        for (let i = 0; i < size - n; i++) {
            ts.push({ id: 'bye' + i, name: 'BYE', isBye: true });
        }

        const rounds = Math.log2(size);
        for (let r = 0; r < rounds; r++) {
            const mr = size / Math.pow(2, r + 1);
            for (let m = 0; m < mr; m++) {
                const t1 = r === 0 ? ts[m * 2] : { id: `r${r-1}m${m*2}w` };
                const t2 = r === 0 ? ts[m * 2 + 1] : { id: `r${r-1}m${m*2+1}w` };
                
                this.state.matches.push({
                    id: `r${r}m${m}`,
                    round: r,
                    matchNum: this.state.matches.length,
                    t1: [t1.id],
                    t2: [t2.id],
                    t1name: t1.name || 'Por definir',
                    t2name: t2.name || 'Por definir',
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((m % this.state.config.numCourts) + 1),
                    isBye: t1.isBye || t2.isBye
                });
            }
        }
    },

    _mkLeague(teams) {
        let idx = 0;
        for (let i = 0; i < teams.length - 1; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                this.state.matches.push({
                    id: `lg${idx}`,
                    round: 0,
                    matchNum: idx++,
                    t1: [teams[i].id],
                    t2: [teams[j].id],
                    t1name: teams[i].name,
                    t2name: teams[j].name,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((idx % this.state.config.numCourts) + 1),
                    isBye: false
                });
            }
        }
    },

    _mkGroups(teams) {
        const n = teams.length;
        const nG = n <= 8 ? 2 : n <= 12 ? 3 : n <= 16 ? 4 : Math.ceil(n / 4);
        const groups = Array.from({ length: nG }, () => []);
        
        teams.forEach((t, i) => groups[i % nG].push(t));
        
        let idx = 0;
        groups.forEach((g, gi) => {
            for (let i = 0; i < g.length - 1; i++) {
                for (let j = i + 1; j < g.length; j++) {
                    this.state.matches.push({
                        id: `g${gi}m${idx}`,
                        round: 0,
                        matchNum: idx++,
                        t1: [g[i].id],
                        t2: [g[j].id],
                        t1name: g[i].name,
                        t2name: g[j].name,
                        sets: [],
                        done: false,
                        winner: null,
                        court: ((idx % this.state.config.numCourts) + 1),
                        isBye: false,
                        group: gi
                    });
                }
            }
        });
    },

    _startLoader() {
        const loader = document.getElementById('gen-loader');
        if (loader) loader.style.display = 'flex';
        
        let p = 0, mi = 0;
        const msgs = ['Creando cuadro...', 'Asignando partidos...', 'Preparando canchas...', '¡Casi listo!'];
        
        if (this._lt) clearInterval(this._lt);
        
        this._lt = setInterval(() => {
            p += 2.5;
            if (p >= 100) {
                p = 100;
                clearInterval(this._lt);
                this._lt = null;
                setTimeout(() => this._finishLoader(), 300);
            }
            
            const bar = document.getElementById('gl-bar');
            const pct = document.getElementById('gl-pct');
            const msg = document.getElementById('gl-msg');
            
            if (bar) bar.style.width = p + '%';
            if (pct) pct.textContent = Math.round(p) + '%';
            if (p > 25 && mi === 0) { if (msg) msg.textContent = msgs[1]; mi = 1; }
            else if (p > 50 && mi === 1) { if (msg) msg.textContent = msgs[2]; mi = 2; }
            else if (p > 75 && mi === 2) { if (msg) msg.textContent = msgs[3]; mi = 3; }
        }, 80);
    },

    skipLoader() {
        if (this._lt) {
            clearInterval(this._lt);
            this._lt = null;
        }
        this._finishLoader();
    },

    _finishLoader() {
        const loader = document.getElementById('gen-loader');
        if (loader) loader.style.display = 'none';
        
        document.getElementById('tour-name').textContent = this.state.tourName;
        this.sv('dash');
        
        const total = this.state.matches.length;
        document.getElementById('cfm-sub').textContent = `${this.state.teams.filter(t => !t.isBye).length} equipos · ${total} partidos`;
        
        const cfmRows = document.getElementById('cfm-rows');
        if (cfmRows) {
            cfmRows.innerHTML = [
                ['Formato', this.state.config.format],
                ['Partidos', total],
                ['Canchas', this.state.config.numCourts]
            ].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#f8fafc;border-radius:10px;font-size:13px;font-weight:600"><span style="color:#64748b">${l}</span><span style="color:#1e293b">${v}</span></div>`).join('');
        }
        
        document.getElementById('m-confirm').style.display = 'flex';
    },

    closeConfirm() {
        document.getElementById('m-confirm').style.display = 'none';
    },

    /**
     * Render refresh para dashboard
     */
    _ra() {
        if (!this.state.config || !this.state.matches.length) {
            this.sv('config');
            return;
        }

        const total = this.state.matches.filter(m => !m.isBye).length;
        const done = this.state.matches.filter(m => m.done && !m.isBye).length;
        const pct = total > 0 ? Math.round(done / total * 100) : 0;
        const n = this.state.teams.filter(t => !t.isBye).length;

        document.getElementById('d-teams').textContent = n;
        document.getElementById('d-done').textContent = done;
        document.getElementById('d-pend').textContent = total - done;
        document.getElementById('dash-prog').style.width = pct + '%';
        document.getElementById('dash-prog-lbl').textContent = `${done}/${total}`;
        document.getElementById('dash-prog-pct').textContent = pct + '%';

        const activeTab = document.querySelector('[id^=tab-].bg-blue-100')?.id.replace('tab-', '') || 'bracket';
        this.showTab(activeTab);
    },

    showTab(t) {
        ['bracket', 'matches', 'standings', 'players', 'stats'].forEach(id => {
            const btn = document.getElementById('tab-' + id);
            const tc = document.getElementById('tc-' + id);
            if (btn) btn.className = `px-3 py-2 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-1.5 ${id === t ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`;
            if (tc) tc.style.display = id === t ? '' : 'none';
        });

        if (t === 'bracket') this._rBracket();
        if (t === 'matches') this._rMatches();
        if (t === 'standings') this._rStandings();
        if (t === 'players') this._rPlayers();
        if (t === 'stats') this._rStats();
    },

    // ... Métodos de renderizado con sanitización ...
    _rBracket() {
        const wrap = document.getElementById('bracket-wrap');
        if (!wrap) return;

        const fmt = this.state.config?.format;
        if (['league', 'americano', 'mexicano', 'swiss'].includes(fmt)) {
            wrap.innerHTML = `<div style="color:#64748b;font-size:14px;padding:20px">Este formato no tiene cuadro eliminatorio. Revisa Posiciones.</div>`;
            return;
        }

        const rounds = [...new Set(this.state.matches.map(m => m.round))].sort((a, b) => a - b);
        const rNames = { 0: 'Ronda 1', 1: 'Cuartos', 2: 'Semifinal', 3: 'Final' };

        wrap.innerHTML = rounds.map(r => {
            const ms = this.state.matches.filter(m => m.round === r && !m.isBye);
            if (!ms.length) return '';

            return `<div class="bcol"><div class="bcol-title">${rNames[r] || `Ronda ${r + 1}`}</div>${ms.map(m => {
                const t1 = Sanitizer.text(m.t1name || '?');
                const t2 = Sanitizer.text(m.t2name || '?');
                const isFinal = r === Math.max(...rounds);
                const s1 = m.sets.map(s => s[0]).join('-') || '—';
                const s2 = m.sets.map(s => s[1]).join('-') || '—';
                const t1w = m.winner && m.t1.includes(m.winner);
                const t2w = m.winner && m.t2.includes(m.winner);

                return `<div class="bmatch${m.done ? ' done' : ''}${isFinal ? ' final' : ''}" onclick="app.openScore('${m.id}')">
<div class="bteam${t1w ? ' winner' : t2w ? ' loser' : ''}"><span>${t1}</span><span class="bscore">${s1}</span></div>
<div class="bteam${t2w ? ' winner' : t1w ? ' loser' : ''}"><span>${t2}</span><span class="bscore">${s2}</span></div>
</div>`;
            }).join('')}</div>`;
        }).join('');
    },

    _rStandings() {
        const tbl = document.getElementById('standings-table');
        if (!tbl) return;

        const fmt = this.state.config?.format;

        // Americano: ranking individual
        if (fmt === 'americano') {
            const players = [];
            this.state.teams.forEach((t, ti) => {
                t.players.forEach((p, pi) => {
                    players.push({ id: `p_${ti}_${pi}`, name: p.name, teamName: t.name });
                });
            });
            const ranking = AmericanoFormat.calculateRanking(this.state.matches, players);
            tbl.innerHTML = AmericanoFormat.renderStandings(ranking);
            return;
        }

        // Mexicano
        if (fmt === 'mexicano') {
            const standings = MexicanoFormat.updateStandings(this.state.matches, this.state.teams, this.state.config);
            tbl.innerHTML = MexicanoFormat.renderStandings(standings);
            return;
        }

        // Suizo
        if (fmt === 'swiss') {
            const standings = SwissFormat.updateStandings(this.state.matches, this.state.teams, this.state.config);
            tbl.innerHTML = SwissFormat.renderStandings(standings);
            return;
        }

        // Eliminación/Liga/Grupos - Tabla tradicional
        const stats = {};
        this.state.teams.filter(t => !t.isBye).forEach(t => {
            stats[t.id] = { id: t.id, name: t.name, pts: 0, gp: 0, gw: 0, gl: 0, sw: 0, sl: 0, gwTotal: 0, glTotal: 0 };
        });

        this.state.matches.filter(m => m.done && !m.isBye).forEach(m => {
            const w = m.winner;
            if (w) {
                const l = m.t1.includes(w) ? m.t2[0] : m.t1[0];
                if (stats[w]) { stats[w].pts += this.state.config.ptsWin; stats[w].gp++; stats[w].gw++; }
                if (stats[l]) { stats[l].pts += this.state.config.ptsLoss; stats[l].gp++; stats[l].gl++; }
            } else if (ScoringEngine.allowsDraws(fmt)) {
                if (stats[m.t1[0]]) { stats[m.t1[0]].pts += this.state.config.ptsDraw; stats[m.t1[0]].gp++; }
                if (stats[m.t2[0]]) { stats[m.t2[0]].pts += this.state.config.ptsDraw; stats[m.t2[0]].gp++; }
            }
        });

        const arr = Object.values(stats).sort((a, b) => b.pts - a.pts || b.gw - a.gw);
        const allowsDraws = ScoringEngine.allowsDraws(fmt);

        // Columnas según formato
        let header = '<thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th>';
        if (allowsDraws) header += '<th>PE</th>';
        header += '<th>PP</th><th>Pts</th></tr></thead>';

        const rows = arr.map((s, i) => {
            const draws = allowsDraws ? s.gp - s.gw - s.gl : 0;
            return `<tr>
                <td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td><span style="font-weight:700">${Sanitizer.text(s.name)}</span></td>
                <td>${s.gp}</td>
                <td style="color:#15803d;font-weight:700">${s.gw}</td>
                ${allowsDraws ? `<td>${draws}</td>` : ''}
                <td style="color:#dc2626">${s.gl}</td>
                <td style="font-weight:900;font-size:15px">${s.pts}</td>
            </tr>`;
        }).join('');

        tbl.innerHTML = `<table class="ltable">${header}<tbody>${rows}</tbody></table>`;
    },

    _rMatches() {
        const el = document.getElementById('matches-list');
        if (!el) return;

        const byRound = {};
        this.state.matches.filter(m => !m.isBye).forEach(m => {
            (byRound[m.round] = byRound[m.round] || []).push(m);
        });

        el.innerHTML = Object.entries(byRound).sort(([a], [b]) => +a - +b).map(([r, ms]) => {
            return `<div class="bg-white rounded-2xl shadow-sm p-4 mb-3"><h4 class="font-black text-gray-700 text-sm mb-3">Ronda ${+r + 1}</h4>${ms.map(m => {
                const t1 = Sanitizer.text(m.t1name || '?');
                const t2 = Sanitizer.text(m.t2name || '?');
                const won = m.done ? `<span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${ICO.check} Jugado</span>` : `<span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${ICO.clock} Pendiente</span>`;

                return `<div class="mcard${m.done ? ' won' : ''}" onclick="app.openScore('${m.id}')"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:800;color:#1e293b;margin-bottom:5px">${t1}</div><div style="font-size:13px;font-weight:800;color:#1e293b">${t2}</div></div><div style="text-align:right;flex-shrink:0"><div style="margin-bottom:4px">${won}</div></div></div></div>`;
            }).join('')}</div>`;
        }).join('');
    },

    _rPlayers() {
        const el = document.getElementById('players-list');
        if (!el) return;

        const teams = this.state.teams.filter(t => !t.isBye);
        el.innerHTML = `<div class="bg-white rounded-2xl shadow-sm overflow-hidden"><div class="p-4 border-b border-gray-100"><h3 class="font-black text-gray-900">Participantes (${teams.length})</h3></div>${teams.map((t, i) => {
            const realIdx = this.state.teams.indexOf(t);
            return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f1f5f9"><div style="flex:1;min-width:0"><p style="font-weight:800;color:#1e293b">${Sanitizer.text(t.name)}</p><p style="font-size:12px;color:#64748b;margin-top:1px">${t.players.map(p => Sanitizer.text(p.name)).join(' · ')}</p></div><button onclick="app.openPlayerEdit(${realIdx})" style="font-size:10px;background:#dbeafe;color:#2563eb;font-weight:700;padding:4px 10px;border-radius:6px;border:none;cursor:pointer">${ICO.pen} Editar</button></div>`;
        }).join('')}</div>`;
    },

    _rStats() {
        const el = document.getElementById('top-list');
        if (!el) return;

        const total = this.state.matches.filter(m => !m.isBye).length;
        const done = this.state.matches.filter(m => m.done && !m.isBye).length;

        document.getElementById('gen-stats').innerHTML = [
            ['Total partidos', total],
            ['Jugados', done],
            ['Pendientes', total - done],
            ['Equipos', this.state.teams.filter(t => !t.isBye).length]
        ].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;font-size:13px"><span style="color:#64748b;font-weight:600">${l}</span><span style="font-weight:800;color:#1e293b">${v}</span></div>`).join('');
    },

    openScore(mid) {
        const m = this.state.matches.find(x => x.id === mid);
        if (!m) return;

        const t1 = Sanitizer.text(m.t1name || '?');
        const t2 = Sanitizer.text(m.t2name || '?');

        document.getElementById('score-badge').textContent = m.done ? 'Jugado' : 'Pendiente';
        document.getElementById('score-badge').className = `text-xs font-bold px-2 py-0.5 rounded-full ${m.done ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`;

        document.getElementById('score-teams').innerHTML = `<div style="text-align:center;flex:1"><p style="font-weight:900;font-size:13px">${t1}</p></div><div style="padding:0 10px">vs</div><div style="text-align:center;flex:1"><p style="font-weight:900;font-size:13px">${t2}</p></div>`;

        let sets = 2;
        if (this.state.config?.setType === 'short') sets = 3;
        else if (this.state.config?.setType === 'pro') sets = 1;
        else if (this.state.config?.setType === 'champions') sets = 3;
        else if (this.state.config?.setType === 'custom') sets = 2;

        const hdrCols = `repeat(${sets + 1}, 1fr)`;
        document.getElementById('score-hdr').style.gridTemplateColumns = hdrCols;
        document.getElementById('score-hdr').innerHTML = `<span></span>${[...Array(sets)].map((_, i) => `<span>Set ${i + 1}</span>`).join('')}`;

        document.getElementById('score-t1').style.gridTemplateColumns = hdrCols;
        document.getElementById('score-t2').style.gridTemplateColumns = hdrCols;

        const ic = 'border-2 border-gray-200 rounded-xl py-2 font-black text-center text-gray-700 text-xl focus:border-blue-500 outline-none';
        document.getElementById('score-t1').innerHTML = `<span style="display:flex;align-items:center;font-weight:800;font-size:13px">${t1}</span>${[...Array(sets)].map((_, i) => `<input type="number" id="st1s${i}" min="0" max="99" class="${ic}" value="${m.sets[i] ? m.sets[i][0] : ''}" placeholder="0">`).join('')}`;
        document.getElementById('score-t2').innerHTML = `<span style="display:flex;align-items:center;font-weight:800;font-size:13px">${t2}</span>${[...Array(sets)].map((_, i) => `<input type="number" id="st2s${i}" min="0" max="99" class="${ic}" value="${m.sets[i] ? m.sets[i][1] : ''}" placeholder="0">`).join('')}`;

        // Tie-break zone
        const tbZone = document.getElementById('tiebreak-zone');
        const checkTiebreak = () => {
            let hasTiebreak = false;
            for (let i = 0; i < sets; i++) {
                const a = parseInt(document.getElementById(`st1s${i}`)?.value) || 0;
                const b = parseInt(document.getElementById(`st2s${i}`)?.value) || 0;
                if (a === this.state.config?.gamesPerSet && b === this.state.config?.gamesPerSet) {
                    hasTiebreak = true;
                    break;
                }
            }
            if (tbZone) tbZone.style.display = hasTiebreak ? 'block' : 'none';
        };

        for (let i = 0; i < sets; i++) {
            const inp1 = document.getElementById(`st1s${i}`);
            const inp2 = document.getElementById(`st2s${i}`);
            if (inp1) inp1.addEventListener('input', checkTiebreak);
            if (inp2) inp2.addEventListener('input', checkTiebreak);
        }
        checkTiebreak();

        this._cm = mid;
        this._startTimer();
        document.getElementById('m-score').style.display = 'flex';
    },

    closeScore() {
        const modal = document.getElementById('m-score');
        if (modal) modal.style.display = 'none';
        this._stopTimer();
        this._cm = null;
    },

    _startTimer() {
        this._stopTimer();
        let s = 0;
        const el = document.getElementById('score-timer');
        this._tt = setInterval(() => {
            s++;
            el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
        }, 1000);
    },

    _stopTimer() {
        if (this._tt) {
            clearInterval(this._tt);
            this._tt = null;
        }
    },

    saveScore(e) {
        e.preventDefault();
        if (!this._cm) return;

        const m = this.state.matches.find(x => x.id === this._cm);
        if (!m) return;

        let sets = 2;
        if (this.state.config?.setType === 'short') sets = 3;
        else if (this.state.config?.setType === 'pro') sets = 1;
        else if (this.state.config?.setType === 'champions') sets = 3;

        const newSets = [];
        for (let i = 0; i < sets; i++) {
            const a = parseInt(document.getElementById(`st1s${i}`)?.value) || 0;
            const b = parseInt(document.getElementById(`st2s${i}`)?.value) || 0;
            newSets.push([a, b]);
        }

        // Validar tie-break si hay empate
        const gamesPerSet = this.state.config?.gamesPerSet || 6;
        const tiebreakPoints = this.state.config?.tiebreakPoints || 7;

        for (let i = 0; i < sets; i++) {
            const a = newSets[i][0], b = newSets[i][1];
            if (a === gamesPerSet && b === gamesPerSet) {
                const tbP1 = parseInt(document.getElementById('tb-p1')?.value) || 0;
                const tbP2 = parseInt(document.getElementById('tb-p2')?.value) || 0;
                
                const tbValid = ScoringEngine.validateTiebreak(tbP1, tbP2, tiebreakPoints);
                if (!tbValid.valid) {
                    alert(`⚠️ ${tbValid.message}`);
                    return;
                }
                newSets[i].push(tbP1, tbP2);
            }
        }

        // Determinar ganador
        const t1w = newSets.filter(s => s[0] > s[1]).length;
        const t2w = newSets.filter(s => s[1] > s[0]).length;
        const winner = t1w > t2w ? m.t1[0] : t2w > t1w ? m.t2[0] : null;

        // Eliminación directa no permite empates
        if (!winner && this.state.config?.format === 'elimination') {
            alert('⚠️ Eliminación directa requiere ganador');
            return;
        }

        m.sets = newSets;
        m.done = true;
        m.winner = winner;

        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        this.closeScore();
        this._ra();
        this._checkChamp();
        this._toast(`${ICO.trophy} Resultado guardado`);
    },

    _checkChamp() {
        const total = this.state.matches.filter(m => !m.isBye).length;
        const done = this.state.matches.filter(m => m.done && !m.isBye).length;
        
        if (total === 0 || done < total) return;

        const lastRound = Math.max(...this.state.matches.map(m => m.round));
        const finals = this.state.matches.filter(m => m.round === lastRound && m.done && !m.isBye);
        
        if (!finals.length) return;

        const champId = finals[finals.length - 1].winner;
        if (!champId) return;

        const champ = this.state.teams.find(t => t.id === champId);
        if (!champ) return;

        document.getElementById('champ-name').textContent = champ.name;
        document.getElementById('champ').style.display = 'flex';
        this._confetti();
    },

    _confetti() {
        const c = document.getElementById('confetti');
        if (!c) return;
        
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const ctx = c.getContext('2d');
        const cols = ['#fbbf24', '#3b82f6', '#22c55e', '#ec4899', '#a78bfa', '#f97316'];
        
        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * c.width,
            y: -10,
            v: Math.random() * 4 + 2,
            h: Math.random() * 3 - 1.5,
            r: Math.random() * 360,
            dr: Math.random() * 10 - 5,
            w: Math.random() * 10 + 5,
            h2: Math.random() * 5 + 5,
            col: cols[Math.floor(Math.random() * cols.length)],
            alpha: 1
        }));

        let frames = 0;
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            pieces.forEach(p => {
                p.y += p.v;
                p.x += p.h;
                p.r += p.dr;
                if (frames > 120) p.alpha = Math.max(0, p.alpha - 0.015);
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.r * Math.PI / 180);
                ctx.fillStyle = p.col;
                ctx.fillRect(-p.w / 2, -p.h2 / 2, p.w, p.h2);
                ctx.restore();
            });
            frames++;
            if (pieces.some(p => p.alpha > 0)) requestAnimationFrame(draw);
        };
        draw();
    },

    openAdd(editIdx = -1) {
        this._editIdx = editIdx;
        if (!this.state.config) return;

        const isEdit = editIdx >= 0;
        const ex = isEdit ? this.state.teams[editIdx] : null;
        const numPlayers = this.state.config.playersPerTeam || 2;

        document.getElementById('add-title').innerHTML = `<span class="ico-badge ico-blue" style="margin-right:10px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></span>${isEdit ? 'Editar Equipo' : 'Nuevo Equipo'}`;
        document.getElementById('add-ok').innerHTML = `${ICO.check} ${isEdit ? 'Guardar' : 'Agregar'}`;

        const gnd = this.state.config.genderMode;
        const gOpts = gnd === 'male' ? [['male', 'Masculino']] : 
                      gnd === 'female' ? [['female', 'Femenino']] : 
                      [['male', 'Masculino'], ['female', 'Femenino'], ['mixed', 'Mixto']];

        const gSel = ex ? ex.gender : gOpts[0][0];
        const go = gOpts.map(([v, l]) => `<option value="${v}"${v === gSel ? ' selected' : ''}>${l}</option>`).join('');

        const ic = 'w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:border-blue-500 outline-none bg-white';
        const lc = 'display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px';

        const catOpts = [3, 4, 5, 6, 7].map(c => `<option value="${c}"${ex?.category == c ? ' selected' : ''}>${c}CAT</option>`).join('');

        let playersHtml = '';
        for (let i = 0; i < numPlayers; i++) {
            const p = ex?.players[i] || { name: '', gender: gSel };
            playersHtml += `<div style="border-top:2px solid #f1f5f9;padding-top:12px"><p style="font-size:11px;font-weight:800;color:#3b82f6;text-transform:uppercase;margin-bottom:8px">${ICO.ball} Jugador ${i + 1}${i === 0 ? ' (Capitán)' : ''}</p><div class="space-y-2"><div><label style="${lc}">Nombre</label><input id="ap-p${i}" class="${ic}" placeholder="Nombre completo" value="${Sanitizer.text(p.name)}" ${i === 0 ? 'required' : ''}></div></div></div>`;
        }

        const tn = ex?.name || '';
        document.getElementById('add-body').innerHTML = `<div><label style="${lc}">Nombre del Equipo</label><input id="ap-teamname" class="${ic}" placeholder="Ej: Los Ases" value="${Sanitizer.text(tn)}"></div><div><label style="${lc}">Categoría</label><select id="ap-category" class="${ic}">${catOpts}</select></div>${playersHtml}<label class="flex items-center gap-2 cursor-pointer pt-1"><input type="checkbox" id="ap-seed" class="w-4 h-4 accent-yellow-500"${ex?.seed ? ' checked' : ''}><span class="text-sm text-gray-700">${ICO.star} Cabeza de serie</span></label>`;

        document.getElementById('m-add').style.display = 'flex';
        setTimeout(() => document.getElementById('ap-p0')?.focus(), 100);
    },

    closeAdd() {
        document.getElementById('m-add').style.display = 'none';
        this._editIdx = -1;
    },

    submitAdd() {
        if (!this.state.config) return;

        const numPlayers = this.state.config.playersPerTeam || 2;
        const p1n = document.getElementById('ap-p0')?.value.trim();
        
        if (!p1n) {
            alert('Ingresa el nombre del primer jugador');
            return;
        }

        const seed = document.getElementById('ap-seed')?.checked || false;
        const category = +document.getElementById('ap-category')?.value || 7;

        const players = [];
        for (let i = 0; i < numPlayers; i++) {
            const nm = document.getElementById(`ap-p${i}`)?.value.trim();
            if (!nm && i > 0) continue;
            players.push({ name: nm || `Jugador ${i + 1}`, gender: this.state.config.genderMode });
        }

        const tn = document.getElementById('ap-teamname')?.value.trim() || players.map(p => p.name).join(' / ');
        const g = players.every(p => p.gender === 'male') ? 'male' : players.every(p => p.gender === 'female') ? 'female' : 'mixed';

        const existing = this._editIdx >= 0 ? this.state.teams[this._editIdx] : null;
        const team = {
            id: existing ? existing.id : 't' + Date.now(),
            name: tn,
            gender: g,
            category,
            seed,
            photo: null,
            isVideo: false,
            players
        };

        if (this._editIdx >= 0) {
            this.state.teams[this._editIdx] = team;
        } else {
            this.state.teams.push(team);
        }

        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        this.closeAdd();
        this._renderReg();
        this._updGenBtn();
        this._toast(this._editIdx >= 0 ? `${ICO.pen} Actualizado` : `${ICO.check} Agregado`);
        this._editIdx = -1;
    },

    editTeam(idx) {
        this._editIdx = idx;
        this.openAdd(idx);
    },

    removeTeam(i) {
        const t = this.state.teams[i];
        if (!t) return;

        if (!confirm(`¿Eliminar "${t.name}"?`)) return;

        this.state.teams.splice(i, 1);
        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        this._renderReg();
        this._updGenBtn();
        if (document.getElementById('v-dash').style.display !== 'none') this._ra();
        this._toast(`${ICO.trash} Eliminado`);
    },

    clearAll() {
        if (!confirm('¿Eliminar todos los equipos?')) return;
        this.state.teams = [];
        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });
        this._renderReg();
        this._updGenBtn();
    },

    openAutoFill() {
        if (!this.state.config) return;
        document.getElementById('af-count').value = Math.max(this.state.teams.filter(t => !t.isBye).length + 4, 8);
        document.getElementById('m-autofill').style.display = 'flex';
        setTimeout(() => {
            const input = document.getElementById('af-count');
            if (input) { input.focus(); input.select(); }
        }, 150);
    },

    closeAutoFill() {
        const modal = document.getElementById('m-autofill');
        if (modal) modal.style.display = 'none';
    },

    calculateDuration() {
        if (!this.state.config) return;

        const format = this.state.config.format;
        const numTeams = this.state.teams.filter(t => !t.isBye).length || 0;
        const matchesPerDay = +document.getElementById('f-matchesperday')?.value || 4;
        const startDate = document.getElementById('f-startdate')?.value;

        let totalMatches = 0;
        if (numTeams >= 2) {
            switch (format) {
                case 'elimination': totalMatches = numTeams - 1; break;
                case 'league': totalMatches = (numTeams * (numTeams - 1)) / 2; break;
                case 'groups': totalMatches = numTeams * 2; break;
                case 'americano': totalMatches = (numTeams - 1) * Math.floor(numTeams / 2); break;
                case 'mexicano': totalMatches = numTeams * 3; break;
                case 'swiss': totalMatches = numTeams * (Math.ceil(Math.log2(numTeams)) + 1) / 2; break;
            }
        }

        const cm = document.getElementById('calc-matches');
        if (cm) cm.textContent = totalMatches || '—';

        const days = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerDay) : 0;
        const cd = document.getElementById('calc-days');
        if (cd) cd.textContent = days > 0 ? `${days} día${days === 1 ? '' : 's'}` : '—';

        if (startDate && days > 0) {
            const d = new Date(startDate + ' 00:00:00');
            const end = new Date(d);
            end.setDate(d.getDate() + days - 1);
            const cdates = document.getElementById('calc-dates');
            if (cdates) cdates.textContent = `Del ${d.toLocaleDateString('es')} al ${end.toLocaleDateString('es')}`;
        }
    },

    loadCfgImage(inp) {
        if (!inp.files[0]) return;
        const file = inp.files[0];
        const r = new FileReader();
        
        r.onload = e => {
            const raw = e.target.result;
            this.state.tourLogo = raw;
            VersionedStorage.save({
                n: this.state.tourName,
                c: this.state.config,
                t: this.state.teams,
                m: this.state.matches,
                logo: this.state.tourLogo
            });

            const prev = document.getElementById('tour-img-preview');
            const lbl = document.getElementById('cfg-img-lbl');
            const rmv = document.getElementById('cfg-img-remove');
            
            if (prev) { prev.src = raw; prev.style.display = 'block'; }
            if (lbl) lbl.textContent = '✓ Imagen cargada';
            if (rmv) rmv.style.display = 'flex';
            
            this._toast('✓ Imagen guardada');
        };
        r.readAsDataURL(file);
    },

    removeCfgImage() {
        this.state.tourLogo = null;
        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: null
        });

        const prev = document.getElementById('tour-img-preview');
        const lbl = document.getElementById('cfg-img-lbl');
        const rmv = document.getElementById('cfg-img-remove');
        const inp = document.getElementById('cfg-tour-img');

        if (prev) { prev.src = ''; prev.style.display = 'none'; }
        if (lbl) lbl.textContent = 'Toca para agregar logo/imagen';
        if (rmv) rmv.style.display = 'none';
        if (inp) inp.value = '';

        this._toast('Imagen eliminada');
    },

    openShare() {
        const d = { n: this.state.tourName, c: this.state.config, t: this.state.teams, m: this.state.matches };
        const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(d))));
        const url = `${location.origin}${location.pathname}#d=${b64}`;
        document.getElementById('share-url').textContent = url;
        document.getElementById('m-share').style.display = 'flex';
    },

    closeShare() {
        document.getElementById('m-share').style.display = 'none';
    },

    copyShare() {
        const txt = document.getElementById('share-url').textContent;
        navigator.clipboard.writeText(txt).then(() => {
            this._toast(`${ICO.check} ¡Enlace copiado!`);
        }).catch(() => {
            this._toast(`${ICO.check} Copiado`);
        });
        this.closeShare();
    },

    openHistory() {
        const h = VersionedStorage.getHistory();
        const el = document.getElementById('hist-list');
        
        if (!h.length) {
            el.innerHTML = '<p class="text-center py-8 text-sm text-gray-400">No hay torneos guardados</p>';
            document.getElementById('m-history').style.display = 'flex';
            return;
        }

        el.innerHTML = h.map((t, i) => `<div style="border:2px solid #f1f5f9;border-radius:14px;padding:14px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="flex:1;min-width:0"><p style="font-weight:900;color:#1e293b">${ICO.trophy} ${Sanitizer.text(t.n)}</p><p style="font-size:12px;color:#64748b;margin-top:3px">${t.date} · ${t.fmt} · ${t.teams} equipos</p></div><div style="display:flex;gap:4px"><button onclick="app.loadHist(${i})" style="background:#dbeafe;color:#2563eb;font-weight:700;font-size:12px;padding:5px 10px;border-radius:8px;border:none;cursor:pointer">Cargar</button><button onclick="app.delHist(${i})" style="background:#fee2e2;color:#dc2626;font-weight:700;font-size:12px;padding:5px 8px;border-radius:8px;border:none;cursor:pointer">${ICO.trash}</button></div></div></div>`).join('');
        
        document.getElementById('m-history').style.display = 'flex';
    },

    closeHistory() {
        document.getElementById('m-history').style.display = 'none';
    },

    loadHist(i) {
        if (!confirm('¿Cargar este torneo? Se perderá el actual.')) return;
        
        const h = VersionedStorage.getHistory();
        const t = h[i];
        
        if (!t || !t.snap) return;
        
        const d = JSON.parse(t.snap);
        this.state.tourName = d.n || 'Torneo';
        this.state.config = d.c;
        this.state.teams = d.t;
        this.state.matches = d.m;
        
        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        document.getElementById('tour-name').textContent = this.state.tourName;
        this.closeHistory();
        this.sv('dash');
    },

    delHist(i) {
        if (!confirm('¿Eliminar del historial?')) return;
        
        const h = VersionedStorage.getHistory();
        h.splice(i, 1);
        VersionedStorage.saveHistory({ tourName: '', config: null, teams: [], matches: [] });
        // Re-save without the deleted item
        localStorage.setItem('pm12h', JSON.stringify(h));
        this.openHistory();
    },

    editName() {
        const inp = document.getElementById('name-inp');
        if (inp) inp.value = this.state.tourName;
        document.getElementById('m-name').style.display = 'flex';
        setTimeout(() => inp?.select(), 100);
    },

    saveName() {
        const v = document.getElementById('name-inp')?.value.trim();
        if (!v) return;
        
        this.state.tourName = v;
        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        document.getElementById('tour-name').textContent = v;
        this.closeNameM();
        this._toast(`${ICO.check} Nombre guardado`);
    },

    closeNameM() {
        document.getElementById('m-name').style.display = 'none';
    },

    openPlayerEdit(idx) {
        this._peIdx = idx;
        const t = this.state.teams[idx];
        if (!t) return;
        
        const p = t.players[0];
        if (!p) return;

        document.getElementById('pe-player-name').textContent = `${t.name} - ${p.name}`;
        document.getElementById('pe-name').value = p.name;
        document.getElementById('pe-category').value = t.category || 7;
        document.getElementById('pe-seed').checked = t.seed || false;

        document.getElementById('player-edit-zone').style.display = 'block';
    },

    previewPlayerMedia(inp) {
        const file = inp.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();

        reader.onload = e => {
            const raw = e.target.result;
            if (isVideo) {
                const vid = document.createElement('video');
                vid.src = raw;
                vid.onloadedmetadata = () => {
                    if (vid.duration > 10) {
                        alert('El video debe durar máximo 10 segundos');
                        return;
                    }
                    this._peMedia = raw;
                    this._peIsVideo = true;
                    this._updatePlayerEditPreview();
                };
            } else {
                this._peMedia = raw;
                this._peIsVideo = false;
                this._updatePlayerEditPreview();
            }
        };
        reader.readAsDataURL(file);
    },

    _updatePlayerEditPreview() {
        const placeholder = document.getElementById('pe-placeholder');
        const preview = document.getElementById('pe-media-preview');
        const video = document.getElementById('pe-video-preview');
        const badge = document.getElementById('pe-media-badge');

        if (this._peMedia) {
            placeholder.style.display = 'none';
            if (this._peIsVideo) {
                preview.style.display = 'none';
                video.style.display = 'block';
                video.src = this._peMedia;
                video.play();
                badge.textContent = 'VIDEO';
                badge.classList.add('show');
            } else {
                preview.style.display = 'block';
                video.style.display = 'none';
                preview.src = this._peMedia;
                badge.classList.remove('show');
            }
        } else {
            placeholder.style.display = 'flex';
            preview.style.display = 'none';
            video.style.display = 'none';
            badge.classList.remove('show');
        }
    },

    savePlayerEdit(e) {
        e.preventDefault();
        if (this._peIdx < 0) return;

        const t = this.state.teams[this._peIdx];
        const p = t.players[0];

        const name = document.getElementById('pe-name')?.value.trim();
        if (!name) {
            alert('Ingresa el nombre');
            return;
        }

        p.name = name;
        t.category = +document.getElementById('pe-category')?.value || 7;
        t.seed = document.getElementById('pe-seed')?.checked || false;

        if (this._peMedia) {
            p.photo = this._peMedia;
            p.isVideo = this._peIsVideo;
        }

        VersionedStorage.save({
            n: this.state.tourName,
            c: this.state.config,
            t: this.state.teams,
            m: this.state.matches,
            logo: this.state.tourLogo
        });

        this.closePlayerEdit();
        this._renderReg();
        this._toast(`${ICO.check} Jugador actualizado`);
    },

    closePlayerEdit() {
        document.getElementById('player-edit-zone').style.display = 'none';
        this._peIdx = -1;
        this._peMedia = null;
        this._peIsVideo = false;
    },

    toggleHeader() {
        const body = document.getElementById('hdr-body');
        const strip = document.getElementById('hdr-strip');
        const pill = document.getElementById('hdr-toggle');

        if (!body) return;

        const isHidden = body.classList.contains('hdr-hidden');
        if (isHidden) {
            body.classList.remove('hdr-hidden');
            if (strip) strip.classList.remove('visible');
            if (pill) pill.classList.remove('collapsed');
        } else {
            body.classList.add('hdr-hidden');
            if (strip) strip.classList.add('visible');
            if (pill) pill.classList.add('collapsed');
        }

        try {
            localStorage.setItem('pm12_hdr_collapsed', !isHidden ? '1' : '0');
        } catch (e) {}
    },

    _restoreHeaderState() {
        try {
            if (localStorage.getItem('pm12_hdr_collapsed') === '1') {
                const body = document.getElementById('hdr-body');
                const strip = document.getElementById('hdr-strip');
                const pill = document.getElementById('hdr-toggle');
                if (body) body.classList.add('hdr-hidden');
                if (strip) strip.classList.add('visible');
                if (pill) pill.classList.add('collapsed');
            }
        } catch (e) {}
    },

    _toast(msg, dur = 2200) {
        const el = document.getElementById('toast');
        el.innerHTML = msg;
        el.classList.add('show');
        clearTimeout(this._ti);
        this._ti = setTimeout(() => el.classList.remove('show'), dur);
    },

    resetAll() {
        if (!confirm('¿Reiniciar todo? Se perderán todos los datos.')) return;
        
        this._stopBanner();
        VersionedStorage.clear();
        
        this.state.tourName = 'Torneo Pádel';
        this.state.config = null;
        this.state.teams = [];
        this.state.matches = [];
        this.state.tourLogo = null;

        document.getElementById('tour-name').textContent = 'Torneo Pádel';
        document.getElementById('hdr-sub').textContent = 'Configura y genera tu torneo';
        this.sv('config');
        this._toast('Torneo reiniciado');
    },

    _startBanner() {
        // Implementación simplificada del banner
        this._stopBanner();
        const banner = document.getElementById('tour-banner');
        if (banner) banner.style.display = 'none';
    },

    _stopBanner() {
        if (this._bannerTimer) {
            clearInterval(this._bannerTimer);
            this._bannerTimer = null;
        }
    },

    openAdManager() {
        document.getElementById('m-ads').style.display = 'flex';
        this._renderAdList();
    },

    closeAdManager() {
        document.getElementById('m-ads').style.display = 'none';
    },

    _renderAdList() {
        const el = document.getElementById('ad-list');
        if (!el) return;

        const ads = VersionedStorage.getAds();
        if (!ads.length) {
            el.innerHTML = '<p class="text-center py-4 text-xs text-gray-400">No hay anuncios.</p>';
            return;
        }

        el.innerHTML = `<p class="text-xs font-black text-gray-500 uppercase mb-2">Anuncios (${ads.length})</p>` + ads.map(a => `<div class="ad-card"><div style="flex:1"><p style="font-weight:700;font-size:13px">${Sanitizer.text(a.text)}</p></div><button onclick="app.deleteAd('${a.id}')" style="width:28px;height:28px;border-radius:8px;background:#fee2e2;border:none;cursor:pointer;color:#dc2626">${ICO.trash}</button></div>`).join('');
    },

    saveAd() {
        const text = document.getElementById('ad-text')?.value.trim();
        if (!text) {
            this._toast('⚠ Escribe el texto del anuncio');
            return;
        }

        const ads = VersionedStorage.getAds();
        ads.push({
            id: 'ad' + Date.now(),
            text: text,
            url: document.getElementById('ad-url')?.value.trim() || '',
            emoji: document.getElementById('ad-emoji')?.value.trim() || '📣',
            subtext: document.getElementById('ad-subtext')?.value.trim() || '',
            created: new Date().toLocaleDateString('es')
        });

        VersionedStorage.saveAds(ads);
        this._renderAdList();
        this._toast('✓ Anuncio agregado');
    },

    deleteAd(id) {
        const ads = VersionedStorage.getAds().filter(a => a.id !== id);
        VersionedStorage.saveAds(ads);
        this._renderAdList();
        this._toast('Anuncio eliminado');
    }
};

// Inicializar aplicación
app.init();

// Cargar datos desde URL hash (compartir)
try {
    const h = location.hash;
    if (h.startsWith('#d=')) {
        const d = JSON.parse(decodeURIComponent(escape(atob(h.slice(3)))));
        app.state.tourName = d.n || 'Torneo';
        app.state.config = d.c;
        app.state.teams = d.t;
        app.state.matches = d.m;
        VersionedStorage.save({
            n: app.state.tourName,
            c: app.state.config,
            t: app.state.teams,
            m: app.state.matches,
            logo: app.state.tourLogo
        });
        location.hash = '';
    }
} catch (e) {
    console.error('Hash load error:', e);
}
