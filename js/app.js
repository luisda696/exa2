/**
 * ============================================
 * APP.JS - Lógica Principal Completa
 * ============================================
 * CORRECCIONES:
 * 1. Bracket ahora muestra información correctamente
 * 2. ELO eliminado del editor de jugadores
 * 3. Calendario con selección de días de juego
 */

// ============================================
// BASE DE DATOS DE JUGADORES
// ============================================
const DB = {
    m: [['Alejandro García',6],['Carlos Rodríguez',5],['Diego Martínez',6],['Pablo López',4],['Javier González',5],['Luis Hernández',4],['David Pérez',6],['Sergio Sánchez',5],['Fernando Ruiz',3],['Miguel Díaz',4]],
    f: [['María García',6],['Ana Rodríguez',5],['Laura Martínez',6],['Sofía López',4],['Carmen González',5],['Elena Hernández',4],['Isabel Pérez',6],['Lucía Sánchez',5],['Marta Ruiz',3],['Paula Díaz',4]]
};

// ============================================
// ICONOS SVG
// ============================================
const ICO = {
    ball: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><circle cx="12" cy="12" r="10"/><path d="M4 12 Q12 7 20 12"/><path d="M4 12 Q12 17 20 12"/></svg>',
    trophy: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><path d="M6 2h12v7a6 6 0 01-12 0V2z"/><path d="M6 5H2v2a4 4 0 004 4"/><path d="M18 5h4v2a4 4 0 01-4 4"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
    star: '<svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1" style="display:inline-block;flex-shrink:0;vertical-align:middle"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    pen: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>',
    img: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    court: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><rect x="2" y="3" width="20" height="18" rx="1"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="3 2"/></svg>',
    sparkles: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>',
    video: '<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    racket: '<svg width="13" height="13" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><ellipse cx="22" cy="17" rx="11" ry="13"/><line x1="22" y1="30" x2="22" y2="42"/><line x1="15" y1="42" x2="29" y2="42"/></svg>',
    play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:inline-block;flex-shrink:0;vertical-align:middle"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>'
};

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================
const app = {
    // Variables internas
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
    _selectedDays: [0,1,2,3,4,5,6], // Días seleccionados (0=Domingo, 1=Lunes, etc.)

    // Datos del torneo
    tourName: 'Torneo Pádel',
    config: null,
    teams: [],
    matches: [],
    tourLogo: null,

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    init() {
        this._splash();
        this._initDaySelector();
        
        window.addEventListener('scroll', () => {
            const hdr = document.getElementById('main-header');
            if (hdr) hdr.classList.toggle('glass', window.scrollY > 30);
        }, { passive: true });

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

        setTimeout(() => {
            const data = VersionedStorage.load();
            if (data) {
                this.tourName = data.n || 'Torneo Pádel';
                this.config = data.c || null;
                this.teams = data.t || [];
                this.matches = data.m || [];
                this.tourLogo = data.logo || null;
                this._selectedDays = data.days || [0,1,2,3,4,5,6];
                
                if (this.config && this.teams.length) {
                    document.getElementById('tour-name').textContent = this.tourName;
                    this._updateDaySelectorUI();
                    this.sv('dash');
                } else {
                    this.sv('config');
                }
            } else {
                this.sv('config');
            }
        }, 2300);
    },

    // ============================================
    // SELECTOR DE DÍAS DE JUEGO
    // ============================================
    _initDaySelector() {
        const days = ['D','L','M','M','J','V','S'];
        const container = document.getElementById('days-selector');
        if (!container) return;

        container.innerHTML = days.map((d, i) => 
            `<button type="button" class="day-btn active" data-day="${i}" title="${['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][i]}">
                <span style="font-size:10px;font-weight:700">${d}</span>
            </button>`
        ).join('');

        container.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const day = parseInt(btn.dataset.day);
                btn.classList.toggle('active');
                
                if (btn.classList.contains('active')) {
                    if (!this._selectedDays.includes(day)) {
                        this._selectedDays.push(day);
                        this._selectedDays.sort();
                    }
                } else {
                    this._selectedDays = this._selectedDays.filter(d => d !== day);
                }

                // Asegurar al menos 1 día seleccionado
                if (this._selectedDays.length === 0) {
                    btn.classList.add('active');
                    this._selectedDays.push(day);
                    this._toast('⚠️ Mínimo 1 día requerido');
                }

                this._updateDaysInfo();
                this.calculateDuration();
            });
        });

        this._updateDaySelectorUI();
    },

    _updateDaySelectorUI() {
        document.querySelectorAll('.day-btn').forEach(btn => {
            const day = parseInt(btn.dataset.day);
            btn.classList.toggle('active', this._selectedDays.includes(day));
        });
        this._updateDaysInfo();
    },

    _updateDaysInfo() {
        const info = document.getElementById('days-info');
        if (!info) return;

        const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        const selected = this._selectedDays.map(d => dayNames[d]);
        
        if (this._selectedDays.length === 7) {
            info.textContent = 'Todos los días de la semana';
        } else if (this._selectedDays.length === 1) {
            info.textContent = `Solo los ${selected[0]}`;
        } else {
            info.textContent = `${selected.join(' y ')} (${this._selectedDays.length} días)`;
        }
    },

    // ============================================
    // SPLASH SCREEN
    // ============================================
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

    // ============================================
    // NAVEGACIÓN
    // ============================================
    sv(view) {
        const map = { config: 'v-config', register: 'v-register', dash: 'v-dash' };
        
        Object.entries(map).forEach(([k, id]) => {
            document.getElementById(id).style.display = k === view ? '' : 'none';
            const bn = document.getElementById('bn-' + k);
            if (bn) bn.style.color = k === view ? '#2563eb' : '#9ca3af';
        });

        const si = ['config', 'register', 'dash'].indexOf(view);
        [0, 1, 2].forEach(i => {
            const el = document.getElementById('step-' + i);
            if (el) el.style.background = i <= si ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.2)';
        });

        const pill = document.getElementById('hdr-toggle');
        if (pill) pill.style.display = view === 'dash' ? 'block' : 'none';

        if (view === 'config') {
            if (this.tourLogo) {
                const prev = document.getElementById('tour-img-preview');
                const lbl = document.getElementById('cfg-img-lbl');
                const rmv = document.getElementById('cfg-img-remove');
                if (prev) { prev.src = this.tourLogo; prev.style.display = 'block'; }
                if (lbl) lbl.textContent = '✓ Imagen cargada';
                if (rmv) rmv.style.display = 'flex';
            }
            this._updateDaySelectorUI();
            document.getElementById('hdr-sub').textContent = 'Configura y genera tu torneo';
        }
        if (view === 'register') this._updReg();
        if (view === 'dash') requestAnimationFrame(() => this._ra());
    },

    // ============================================
    // CONFIGURACIÓN
    // ============================================
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

        this.config = {
            version: 2,
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
            matchesPerDay: 4,
            playDays: [...this._selectedDays] // ✅ Guardar días seleccionados
        };

        this.sv('register');
    },

    setTeamType(val) {
        const container = document.getElementById('custom-players-container');
        if (container) {
            container.style.display = val === 'custom' ? 'block' : 'none';
        }
        if (val !== 'custom') {
            const input = document.getElementById('f-playersPerTeam');
            if (input) input.value = 2;
        }
    },

    toggleSetOptions() {
        const type = document.getElementById('f-settype')?.value;
        const c = document.getElementById('custom-set-container');
        if (c) c.style.display = type === 'custom' ? 'block' : 'none';
    },

    toggleCustomTiebreak() {
        const type = document.getElementById('f-tiebreak-type')?.value;
        const c = document.getElementById('custom-tiebreak-container');
        if (c) c.style.display = type === 'custom' ? 'block' : 'none';
    },

    updateConfigSummary() {
        const format = document.getElementById('f-format')?.value;
        const ci = document.getElementById('custom-format-info');
        if (ci) ci.classList.toggle('hidden', format !== 'custom');
    },

    // ============================================
    // REGISTRO DE EQUIPOS
    // ============================================
    _updReg() {
        if (!this.config) return;

        const gndL = { male: 'Masculino', female: 'Femenino', mixed: 'Mixto' };
        const fmtL = { 
            elimination: '🏆 Elim.', 
            league: '📋 Liga', 
            groups: '🏟️ Grupos', 
            americano: '🌎 Americano', 
            mexicano: '🇲🇽 Mexicano', 
            swiss: '♟️ Suizo' 
        };

        const hint = document.getElementById('reg-hint');
        if (hint) {
            hint.textContent = `Mínimo 4 equipos · ${this.config.playersPerTeam} jugador${this.config.playersPerTeam === 1 ? '' : 'es'}/equipo`;
        }

        const mode = document.getElementById('reg-mode');
        if (mode) {
            mode.textContent = `${fmtL[this.config.format] || this.config.format} · ${gndL[this.config.genderMode]}`;
        }

        if (this.config.numCourts) {
            const ce = document.getElementById('f-courts');
            if (ce) ce.value = this.config.numCourts;
        }
        if (this.config.startDate) {
            const sd = document.getElementById('f-startdate');
            if (sd) sd.value = this.config.startDate;
        }
        if (this.config.matchesPerDay) {
            const md = document.getElementById('f-matchesperday');
            if (md) md.value = this.config.matchesPerDay;
        }

        this._renderReg();
        this._updGenBtn();
        this.calculateDuration();
    },

    _renderReg() {
        const c = document.getElementById('reg-list');
        if (!c) return;

        const n = this.teams.filter(t => !t.isBye).length;
        
        const count = document.getElementById('reg-count');
        if (count) {
            count.textContent = n + (n === 1 ? ' equipo' : ' equipos');
        }

        const rct = document.getElementById('reg-cal-teams');
        if (rct) rct.textContent = n;

        this.calculateDuration();

        const all = this.teams.filter(t => !t.isBye);
        if (!all.length) {
            c.innerHTML = `<div class="text-center py-10 text-gray-400">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" style="margin:0 auto 12px">
                    <ellipse cx="22" cy="17" rx="11" ry="13"/>
                    <line x1="22" y1="30" x2="22" y2="42"/>
                    <line x1="15" y1="42" x2="29" y2="42"/>
                </svg>
                <p class="font-bold">Sin equipos registrados</p>
                <p class="text-sm mt-1">Pulsa Agregar o Auto-llenar</p>
            </div>`;
            return;
        }

        c.innerHTML = all.map((t, i) => {
            const bg = t.gender === 'male' ? 'linear-gradient(135deg,#60a5fa,#2563eb)' : 
                       t.gender === 'female' ? 'linear-gradient(135deg,#f472b6,#be185d)' : 
                       'linear-gradient(135deg,#a78bfa,#7c3aed)';
            
            const hasPhoto = t.photo && t.photo.length > 10;
            const av = hasPhoto ? 
                (t.isVideo ? `<video src="${Sanitizer.attribute(t.photo)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0" autoplay muted loop playsinline></video>` : 
                `<img src="${Sanitizer.attribute(t.photo)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0">`) : 
                `<div style="width:44px;height:44px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:white;flex-shrink:0">${Sanitizer.text(t.name.charAt(0).toUpperCase())}</div>`;

            const pl = t.players.map(p => `<span style="background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${Sanitizer.text(p.name)}</span>`).join(' ');
            const catDisplay = t.category ? t.category + 'CAT' : '';
            const realIdx = this.teams.indexOf(t);

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

    _updGenBtn() {
        if (!this.config) return;

        const n = this.teams.filter(t => !t.isBye).length;
        const min = 4;
        const ok = n >= min;

        const btn = document.getElementById('gen-btn');
        const badge = document.getElementById('gen-badge');

        if (btn) {
            btn.disabled = !ok;
            if (ok) {
                btn.className = 'w-full text-white font-black py-4 rounded-xl text-sm transition-all bg-gradient-to-r from-blue-900 to-blue-500 hover:shadow-lg cursor-pointer btn-shine btn-pulse flex items-center justify-center gap-2';
                btn.innerHTML = `${ICO.sparkles}Generar Torneo · ${n} equipos`;
            } else {
                btn.className = 'w-full bg-gray-300 text-white font-black py-4 rounded-xl text-sm transition-all opacity-60 cursor-not-allowed flex items-center justify-center gap-2';
                btn.innerHTML = `${ICO.sparkles}Generar Torneo`;
            }
        }

        if (badge) {
            badge.className = `font-black text-xs px-3 py-1 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`;
            badge.textContent = ok ? `${n} equipos` : `Faltan ${min - n}`;
        }

        const status = document.getElementById('gen-status');
        if (status) {
            status.textContent = ok ? `${n} equipos · ${this.config.playersPerTeam} jugadores c/u` : `Mínimo ${min} equipos para generar`;
        }

        const fL = { elimination: '🏆 Elim.', league: '📋 Liga', groups: '🏟️ Grupos', americano: '🌎 Americano', mexicano: '🇲🇽 Mexicano', swiss: '♟️ Suizo' };
        const sub = document.getElementById('gen-sub');
        if (sub) {
            sub.textContent = `${fL[this.config.format] || ''} · ${this.config.setType === 'short' ? 'Short Set' : this.config.setType === 'pro' ? 'Pro Set' : this.config.setType === 'custom' ? 'Custom Set' : 'Normal'}`;
        }
    },

    // ============================================
    // CALCULAR DURACIÓN CON DÍAS SELECCIONADOS
    // ============================================
    calculateDuration() {
        if (!this.config) return;

        const format = this.config.format;
        const numTeams = this.teams.filter(t => !t.isBye).length || 0;
        const matchesPerDay = +document.getElementById('f-matchesperday')?.value || 4;
        const startDate = document.getElementById('f-startdate')?.value;

        let totalMatches = 0;

        if (numTeams >= 2) {
            switch (format) {
                case 'elimination': totalMatches = numTeams - 1; break;
                case 'league': totalMatches = (numTeams * (numTeams - 1)) / 2; break;
                case 'groups':
                    const nG = numTeams <= 8 ? 2 : numTeams <= 12 ? 3 : numTeams <= 16 ? 4 : Math.ceil(numTeams / 4);
                    const pg = Math.floor(numTeams / nG);
                    totalMatches = (nG * (pg * (pg - 1)) / 2) + Math.max(nG, 4);
                    break;
                case 'americano': totalMatches = (numTeams - 1) * Math.floor(numTeams / 2); break;
                case 'mexicano': totalMatches = numTeams * 3; break;
                case 'swiss': totalMatches = numTeams * (Math.ceil(Math.log2(numTeams)) + 1) / 2; break;
                case 'custom': totalMatches = 3 * Math.floor(numTeams / 2); break;
            }
        }

        const cm = document.getElementById('calc-matches');
        if (cm) cm.textContent = totalMatches || '—';

        // ✅ CALCULAR DÍAS REALES CONSIDERANDO DÍAS SELECCIONADOS
        const daysPerWeek = this._selectedDays.length || 7;
        const matchesPerWeek = matchesPerDay * daysPerWeek;
        const weeks = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerWeek) : 0;
        const days = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerDay) : 0;
        
        const cd = document.getElementById('calc-days');
        const daysInfo = document.getElementById('calc-days-info');
        
        if (cd) {
            if (daysPerWeek < 7) {
                cd.textContent = `${weeks} semana${weeks === 1 ? '' : 's'} (${days} días de juego)`;
            } else {
                cd.textContent = `${days} día${days === 1 ? '' : 's'}`;
            }
        }

        if (daysInfo) {
            const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
            const selected = this._selectedDays.map(d => dayNames[d]).join(', ');
            daysInfo.textContent = `📅 Días: ${selected}`;
        }

        if (startDate && days > 0) {
            const d = new Date(startDate + ' 00:00:00');
            const end = new Date(d);
            
            // ✅ Calcular fecha final considerando solo días seleccionados
            let daysAdded = 0;
            let dateCounter = new Date(d);
            while (daysAdded < days) {
                if (this._selectedDays.includes(dateCounter.getDay())) {
                    daysAdded++;
                }
                if (daysAdded < days) {
                    dateCounter.setDate(dateCounter.getDate() + 1);
                }
            }
            end.setTime(dateCounter.getTime());

            const fmt2 = (dt) => dt.toLocaleDateString('es', { day: '2-digit', month: 'short' });
            const cdates = document.getElementById('calc-dates');
            if (cdates) cdates.textContent = `Del ${fmt2(d)} al ${fmt2(end)} ${end.getFullYear()}`;

            const calGrid = document.getElementById('cal-grid');
            const calPreview = document.getElementById('calendar-preview');
            
            if (calGrid && calPreview && days <= 60) {
                calPreview.classList.remove('hidden');
                
                const dStart = new Date(startDate + ' 00:00:00');
                let html = '<div class="calendar-day header">D</div><div class="calendar-day header">L</div><div class="calendar-day header">M</div><div class="calendar-day header">M</div><div class="calendar-day header">J</div><div class="calendar-day header">V</div><div class="calendar-day header">S</div>';
                
                for (let i = 0; i < dStart.getDay(); i++) {
                    html += '<div class="calendar-day" style="opacity:.2"></div>';
                }
                
                for (let i = 0; i < Math.min(days, 42); i++) {
                    const cur = new Date(startDate + ' 00:00:00');
                    cur.setDate(cur.getDate() + i);
                    const isActive = this._selectedDays.includes(cur.getDay());
                    html += `<div class="calendar-day${isActive ? ' active' : ''}" style="font-size:10px${isActive ? '' : ';opacity:.3'}">${cur.getDate()}</div>`;
                }
                
                calGrid.innerHTML = html;
            } else if (calPreview) {
                calPreview.classList.add('hidden');
            }
        } else {
            const cdates = document.getElementById('calc-dates');
            if (cdates) cdates.textContent = 'Ingresa fecha de inicio para ver rango';
        }
    },

    // ============================================
    // GENERAR TORNEO
    // ============================================
    generate() {
        if (!this.config || this.teams.filter(t => !t.isBye).length < 4) {
            this._toast('⚠️ Necesitas mínimo 4 equipos');
            return;
        }

        this.config.numCourts = +document.getElementById('f-courts')?.value || 2;
        this.config.startDate = document.getElementById('f-startdate')?.value || '';
        this.config.matchesPerDay = +document.getElementById('f-matchesperday')?.value || 4;
        this.config.playDays = [...this._selectedDays]; // ✅ Guardar días seleccionados
        this.matches = [];

        const fmt = this.config.format;
        const generateMatches = () => {
            if (fmt === 'elimination') this._mkElim(this.teams);
            else if (fmt === 'league') this._mkLeague(this.teams);
            else if (fmt === 'groups') this._mkGroups(this.teams);
            else if (fmt === 'americano') this.matches = AmericanoFormat.generate(this.teams, this.config);
            else if (fmt === 'mexicano') this.matches = MexicanoFormat.generate(this.teams, this.config);
            else if (fmt === 'swiss') this.matches = SwissFormat.generate(this.teams, this.config);
            
            this._save();
            this._saveHistory();
            this._startLoader();
        };

        requestAnimationFrame(generateMatches);
    },

    // ============================================
    // GENERACIÓN DE BRACKET (CORREGIDO)
    // ============================================
    _p2(teams) {
        let ts = [...teams];
        
        if (this.config.matchType === 'seeded') {
            ts.sort((a, b) => (b.category || 7) - (a.category || 7));
        } else if (this.config.matchType === 'snake') {
            ts.sort((a, b) => (b.category || 7) - (a.category || 7));
            const snake = [];
            for (let i = 0; i < ts.length; i++) {
                if (i % 2 === 0) snake.push(ts[i]);
                else snake.splice(Math.floor(i / 2) + 1, 0, ts[i]);
            }
            ts = snake;
        } else {
            for (let i = ts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ts[i], ts[j]] = [ts[j], ts[i]];
            }
        }

        const n = ts.length;
        const sz = Math.pow(2, Math.ceil(Math.log2(n)));
        const byeT = [];
        
        for (let i = 0; i < sz - n; i++) {
            byeT.push({ id: 'bye' + i, name: 'BYE', gender: 'male', category: 7, seed: false, photo: null, isBye: true, players: [] });
        }

        const full = [...ts, ...byeT];
        this.teams = [...this.teams, ...byeT.filter(b => !this.teams.find(t => t.id === b.id))];
        return full;
    },

    _mkElim(teams) {
        const ts = this._p2(teams.filter(t => !t.isBye));
        const n = ts.length;
        const rounds = Math.log2(n);

        for (let r = 0; r < rounds; r++) {
            const mr = n / Math.pow(2, r + 1);
            for (let m = 0; m < mr; m++) {
                const isBye = (r === 0) && (ts[m * 2]?.isBye || ts[m * 2 + 1]?.isBye);
                const mid = `r${r}m${m}`;

                this.matches.push({
                    id: mid,
                    round: r,
                    matchNum: m,
                    format: 'elimination',
                    t1: r === 0 ? [ts[m * 2]?.id] : [`r${r - 1}m${m * 2}w`],
                    t2: r === 0 ? [ts[m * 2 + 1]?.id] : [`r${r - 1}m${m * 2 + 1}w`],
                    t1name: r === 0 ? (ts[m * 2]?.name || '?') : 'Por definir',
                    t2name: r === 0 ? (ts[m * 2 + 1]?.name || '?') : 'Por definir',
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((m % this.config.numCourts) + 1),
                    isBye,
                    autoAdv: isBye
                });

                if (isBye) {
                    const winner = ts[m * 2]?.isBye ? ts[m * 2 + 1] : ts[m * 2];
                    if (winner) {
                        const last = this.matches[this.matches.length - 1];
                        last.done = true;
                        last.winner = winner.id;
                    }
                }
            }
        }
    },

    _mkLeague(teams) {
        const ts = teams.filter(t => !t.isBye);
        const order = this.config.matchType === 'seeded' ? 
            [...ts].sort((a, b) => (b.category || 7) - (a.category || 7)) : 
            [...ts].sort(() => Math.random() - 0.5);

        let idx = 0;
        for (let i = 0; i < order.length - 1; i++) {
            for (let j = i + 1; j < order.length; j++) {
                const a = order[i], b = order[j];
                this.matches.push({
                    id: `lg${idx}`,
                    round: 0,
                    matchNum: idx++,
                    format: 'league',
                    t1: [a.id],
                    t2: [b.id],
                    t1name: a.name,
                    t2name: b.name,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((idx % this.config.numCourts) + 1),
                    isBye: false,
                    autoAdv: false
                });
            }
        }
    },

    _mkGroups(teams) {
        const ts = teams.filter(t => !t.isBye);
        const n = ts.length;
        const nG = n <= 8 ? 2 : n <= 12 ? 3 : n <= 16 ? 4 : Math.ceil(n / 4);
        const groups = Array.from({ length: nG }, () => []);

        const sorted = this.config.matchType === 'seeded' ? 
            [...ts].sort((a, b) => (b.category || 7) - (a.category || 7)) : 
            [...ts].sort(() => Math.random() - 0.5);

        sorted.forEach((t, i) => groups[i % nG].push(t));

        let idx = 0;
        groups.forEach((g, gi) => {
            for (let i = 0; i < g.length - 1; i++) {
                for (let j = i + 1; j < g.length; j++) {
                    this.matches.push({
                        id: `g${gi}m${idx}`,
                        round: 0,
                        matchNum: idx++,
                        format: 'groups',
                        t1: [g[i].id],
                        t2: [g[j].id],
                        t1name: g[i].name,
                        t2name: g[j].name,
                        sets: [],
                        done: false,
                        winner: null,
                        court: ((idx % this.config.numCourts) + 1),
                        isBye: false,
                        autoAdv: false,
                        group: gi
                    });
                }
            }
        });

        this.config._groups = groups.map(g => g.map(t => t.id));
        this.config._groupsKO = false;
    },

    // ============================================
    // RENDERIZAR BRACKET (CORREGIDO)
    // ============================================
    _rBracket() {
        const wrap = document.getElementById('bracket-wrap');
        if (!wrap) return;

        const btl = document.getElementById('bracket-tour-logo');
        if (btl) {
            if (this.tourLogo) {
                btl.src = this.tourLogo;
                btl.style.display = 'block';
            } else {
                btl.style.display = 'none';
            }
        }

        const fmt = this.config?.format;
        
        // ✅ Formatos que no tienen bracket eliminatorio
        if (['league', 'americano', 'mexicano', 'swiss'].includes(fmt)) {
            wrap.innerHTML = `<div style="color:#64748b;font-size:14px;padding:20px;text-align:center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" style="margin:0 auto 12px">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="3" y1="15" x2="21" y2="15"/>
                    <line x1="12" y1="3" x2="12" y2="21"/>
                </svg>
                <p style="font-weight:700;margin-bottom:8px">Este formato no tiene cuadro eliminatorio</p>
                <p style="font-size:13px">Revisa la pestaña <strong>Posiciones</strong> para ver el ranking</p>
            </div>`;
            return;
        }

        // ✅ Obtener rondas únicas
        const rounds = [...new Set(this.matches.map(m => m.round))].sort((a, b) => a - b);
        
        if (rounds.length === 0) {
            wrap.innerHTML = `<div style="color:#64748b;font-size:14px;padding:20px;text-align:center">No hay partidos generados</div>`;
            return;
        }

        const rNames = {
            0: 'Ronda 1',
            1: 'Cuartos',
            2: 'Semifinal',
            3: 'Final',
            100: 'Cuartos (KO)',
            101: 'Semifinal (KO)',
            102: 'Final (KO)'
        };

        // ✅ Renderizar cada ronda
        wrap.innerHTML = rounds.map(r => {
            const ms = this.matches.filter(m => m.round === r && !m.isBye);
            if (!ms.length) return '';

            return `<div class="bcol">
                <div class="bcol-title">${rNames[r] || `Ronda ${r + 1}`}</div>
                ${ms.map(m => {
                    const t1 = m.t1name || this._tn(m.t1[0]);
                    const t2 = m.t2name || this._tn(m.t2[0]);
                    const isFinal = r === Math.max(...rounds);
                    const s1 = m.sets.map(s => s[0]).join('-') || '';
                    const s2 = m.sets.map(s => s[1]).join('-') || '';
                    const w = m.winner;
                    const t1w = w && m.t1.includes(w);
                    const t2w = w && m.t2.includes(w);
                    const av1 = m.t1[0] && !String(m.t1[0]).includes('w') ? this._tAvatar(m.t1[0], 20) : '';
                    const av2 = m.t2[0] && !String(m.t2[0]).includes('w') ? this._tAvatar(m.t2[0], 20) : '';

                    return `<div class="bmatch${m.done ? ' done' : ''}${isFinal ? ' final' : ''}" onclick="app.openScore('${m.id}')">
                        <div class="bteam${t1w ? ' winner' : t2w ? ' loser' : ''}">
                            <span style="display:flex;align-items:center;min-width:0">
                                ${av1}
                                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(t1)}</span>
                            </span>
                            <span class="bscore">${s1 || '—'}</span>
                        </div>
                        <div class="bteam${t2w ? ' winner' : t1w ? ' loser' : ''}">
                            <span style="display:flex;align-items:center;min-width:0">
                                ${av2}
                                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(t2)}</span>
                            </span>
                            <span class="bscore">${s2 || '—'}</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        }).join('');
    },

    // ============================================
    // UTILIDADES
    // ============================================
    _tn(id) {
        const t = this.teams.find(t => t.id === id);
        return t ? t.name : id === '?' ? 'Por definir' : '?';
    },

    _tAvatar(id, sz = 20) {
        const t = this.teams.find(t => t.id === id);
        if (!t || t.isBye) return '';
        
        if (t.photo) {
            if (t.isVideo) {
                return `<video src="${Sanitizer.attribute(t.photo)}" style="width:${sz}px;height:${sz}px;border-radius:${sz > 24 ? '6px' : '50%'};object-fit:cover;flex-shrink:0;margin-right:5px" autoplay muted loop playsinline></video>`;
            }
            return `<img src="${Sanitizer.attribute(t.photo)}" style="width:${sz}px;height:${sz}px;border-radius:${sz > 24 ? '6px' : '50%'};object-fit:cover;flex-shrink:0;margin-right:5px">`;
        }
        
        const bg = t.gender === 'male' ? '#3b82f6' : t.gender === 'female' ? '#ec4899' : '#8b5cf6';
        return `<span style="width:${sz}px;height:${sz}px;border-radius:${sz > 24 ? '6px' : '50%'};background:${bg};display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:${Math.round(sz * 0.55)}px;color:white;flex-shrink:0;margin-right:5px">${Sanitizer.text((t.name || '?').charAt(0))}</span>`;
    },

    _save() {
        const data = {
            n: this.tourName,
            c: this.config,
            t: this.teams,
            m: this.matches,
            days: this._selectedDays // ✅ Guardar días seleccionados
        };
        if (this.tourLogo) data.logo = this.tourLogo;
        VersionedStorage.save(data);
    },

    _saveHistory() {
        if (!this.config) return;
        
        const fL = { elimination: 'Elim.', league: 'Liga', groups: 'Grupos', americano: 'Americano', mexicano: 'Mexicano', swiss: 'Suizo' };
        
        const snapshot = {
            n: this.tourName,
            date: new Date().toLocaleDateString('es'),
            fmt: fL[this.config.format] || this.config.format,
            teams: this.teams.filter(t => !t.isBye).length,
            matches: this.matches.length,
            done: this.matches.filter(m => m.done).length,
            snap: JSON.stringify({ n: this.tourName, c: this.config, t: this.teams, m: this.matches })
        };

        VersionedStorage.saveHistory(snapshot);
    },

    _toast(msg, dur = 2200) {
        const el = document.getElementById('toast');
        if (!el) return;
        
        el.innerHTML = msg;
        el.classList.add('show');
        clearTimeout(this._ti);
        this._ti = setTimeout(() => el.classList.remove('show'), dur);
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

        const tourName = document.getElementById('tour-name');
        if (tourName) tourName.textContent = this.tourName;

        this.sv('dash');

        const done = this.matches.filter(m => m.done).length;
        const total = this.matches.length;

        const cfmSub = document.getElementById('cfm-sub');
        if (cfmSub) cfmSub.textContent = `${this.teams.filter(t => !t.isBye).length} equipos · ${total} partidos`;

        const fL = {
            elimination: '🏆 Eliminación',
            league: '📋 Liga',
            groups: '🏟️ Grupos+KO',
            americano: '🌎 Americano',
            mexicano: '🇲🇽 Mexicano',
            swiss: '♟️ Suizo'
        };

        const cfmRows = document.getElementById('cfm-rows');
        if (cfmRows) {
            cfmRows.innerHTML = [
                ['Formato', fL[this.config.format] || this.config.format],
                ['Partidos', total],
                ['Canchas', this.config.numCourts],
                ['Set', this.config.setType === 'short' ? 'Short(4)' : this.config.setType === 'pro' ? 'Pro(8)' : this.config.setType === 'custom' ? `Custom(${this.config.gamesPerSet})` : 'Normal(6)'],
                ['Días', this._selectedDays.length === 7 ? 'Todos' : this._selectedDays.length + ' días/semana']
            ].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#f8fafc;border-radius:10px;font-size:13px;font-weight:600"><span style="color:#64748b">${l}</span><span style="color:#1e293b">${v}</span></div>`).join('');
        }

        const confirm = document.getElementById('m-confirm');
        if (confirm) confirm.style.display = 'flex';
    },

    closeConfirm() {
        document.getElementById('m-confirm').style.display = 'none';
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

    _ra() {
        if (!this.config || !this.matches.length) {
            this.sv('config');
            return;
        }

        const total = this.matches.filter(m => !m.isBye).length;
        const done = this.matches.filter(m => m.done && !m.isBye).length;
        const pct = total > 0 ? Math.round(done / total * 100) : 0;
        const n = this.teams.filter(t => !t.isBye).length;

        document.getElementById('d-teams').textContent = n;
        document.getElementById('d-done').textContent = done;
        document.getElementById('d-pend').textContent = total - done;

        const curRound = this.matches.filter(m => m.done).reduce((a, m) => Math.max(a, m.round), -1) + 1;
        document.getElementById('d-round').textContent = curRound + 1;

        document.getElementById('dash-prog').style.width = pct + '%';
        document.getElementById('dash-prog-lbl').textContent = `${done}/${total}`;
        document.getElementById('dash-prog-pct').textContent = pct + '%';

        const fL = { elimination: '🏆 Eliminación', league: '📋 Liga', groups: '🏟️ Grupos+KO', americano: '🌎 Americano', mexicano: '🇲🇽 Mexicano', swiss: '♟️ Suizo' };
        document.getElementById('dash-info').textContent = `${fL[this.config.format] || ''} · ${n} equipos`;
        document.getElementById('hdr-sub').textContent = `${fL[this.config.format] || ''} · ${done}/${total} partidos`;

        const activeTab = document.querySelector('[id^=tab-].bg-blue-100')?.id.replace('tab-', '') || 'bracket';
        this.showTab(activeTab);

        const dls = document.getElementById('dash-logo-strip');
        const dtl = document.getElementById('dash-tour-logo');
        if (this.tourLogo && dls && dtl) {
            dtl.src = this.tourLogo;
            dls.style.display = 'flex';
        } else if (dls) {
            dls.style.display = 'none';
        }

        this._startBanner();
    },

    _rMatches() {
        const el = document.getElementById('matches-list');
        if (!el) return;

        const byRound = {};
        this.matches.filter(m => !m.isBye).forEach(m => {
            (byRound[m.round] = byRound[m.round] || []).push(m);
        });

        const rNames = { 0: 'Ronda 1', 1: 'Cuartos', 2: 'Semifinal', 3: 'Final', 100: 'KO-Cuartos', 101: 'KO-Semi', 102: 'KO-Final' };

        el.innerHTML = Object.entries(byRound).sort(([a], [b]) => +a - +b).map(([r, ms]) => {
            return `<div class="bg-white rounded-2xl shadow-sm p-4 mb-3">
                <h4 class="font-black text-gray-700 text-sm mb-3">${rNames[r] || `Ronda ${+r + 1}`}</h4>
                ${ms.map(m => {
                    const t1 = m.t1name || this._tn(m.t1[0]);
                    const t2 = m.t2name || this._tn(m.t2[0]);
                    const won = m.done ? `<span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${ICO.check} Jugado</span>` : `<span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${ICO.clock} Pendiente</span>`;
                    const sHtml = m.sets.map(s => {
                        const t1w = s[0] > s[1], t2w = s[1] > s[0];
                        return `<span class="sp${t1w ? ' w' : t2w ? ' l' : ''}">${s[0]}</span><span style="color:#94a3b8;font-size:10px">-</span><span class="sp${t2w ? ' w' : t1w ? ' l' : ''}">${s[1]}</span>`;
                    }).join('  ');
                    const av1 = m.t1[0] && !String(m.t1[0]).includes('w') ? this._tAvatar(m.t1[0], 28) : '';
                    const av2 = m.t2[0] && !String(m.t2[0]).includes('w') ? this._tAvatar(m.t2[0], 28) : '';

                    return `<div class="mcard${m.done ? ' won' : ''}" onclick="app.openScore('${m.id}')">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                            <div style="flex:1;min-width:0">
                                <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
                                    ${av1}<span style="font-size:13px;font-weight:800;color:${m.winner && m.t1.includes(m.winner) ? '#15803d' : '#1e293b'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${Sanitizer.text(t1)}</span>${m.winner && m.t1.includes(m.winner) ? `<span>${ICO.trophy}</span>` : ''}
                                </div>
                                <div style="display:flex;align-items:center;gap:6px">
                                    ${av2}<span style="font-size:13px;font-weight:800;color:${m.winner && m.t2.includes(m.winner) ? '#15803d' : '#1e293b'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${Sanitizer.text(t2)}</span>${m.winner && m.t2.includes(m.winner) ? `<span>${ICO.trophy}</span>` : ''}
                                </div>
                            </div>
                            <div style="text-align:right;flex-shrink:0">
                                <div style="margin-bottom:4px">${won}</div>
                                <div style="font-size:12px;color:#64748b">${ICO.court} Cancha ${m.court}</div>
                                ${sHtml ? `<div style="margin-top:4px;display:flex;gap:3px;align-items:center;justify-content:flex-end">${sHtml}</div>` : ''}
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        }).join('');
    },

    _rStandings() {
        const tbl = document.getElementById('standings-table');
        if (!tbl) return;

        const stats = {};
        this.teams.filter(t => !t.isBye).forEach(t => {
            stats[t.id] = { id: t.id, name: t.name, pts: 0, gp: 0, gw: 0, gl: 0, sw: 0, sl: 0, gwTotal: 0, glTotal: 0 };
        });

        this.matches.filter(m => m.done && !m.isBye).forEach(m => {
            const w = m.winner;
            if (w) {
                const l = m.t1.includes(w) ? m.t2[0] : m.t1[0];
                if (stats[w]) { stats[w].pts += this.config.ptsWin; stats[w].gp++; stats[w].gw++; }
                if (stats[l]) { stats[l].pts += this.config.ptsLoss; stats[l].gp++; stats[l].gl++; }
            } else if (this.config.ptsDraw) {
                if (stats[m.t1[0]]) { stats[m.t1[0]].pts += this.config.ptsDraw; stats[m.t1[0]].gp++; }
                if (stats[m.t2[0]]) { stats[m.t2[0]].pts += this.config.ptsDraw; stats[m.t2[0]].gp++; }
            }
            m.sets.forEach(s => {
                if (stats[m.t1[0]]) { stats[m.t1[0]].sw += s[0] > s[1] ? 1 : 0; stats[m.t1[0]].sl += s[0] < s[1] ? 1 : 0; stats[m.t1[0]].gwTotal += s[0]; stats[m.t1[0]].glTotal += s[1]; }
                if (stats[m.t2[0]]) { stats[m.t2[0]].sw += s[1] > s[0] ? 1 : 0; stats[m.t2[0]].sl += s[1] < s[0] ? 1 : 0; stats[m.t2[0]].gwTotal += s[1]; stats[m.t2[0]].glTotal += s[0]; }
            });
        });

        const arr = Object.values(stats).sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            const gdA = a.gwTotal - a.glTotal;
            const gdB = b.gwTotal - b.glTotal;
            if (gdB !== gdA) return gdB - gdA;
            const sdA = a.sw - a.sl;
            const sdB = b.sw - b.sl;
            if (sdB !== sdA) return sdB - sdA;
            if (b.gw !== a.gw) return b.gw - a.gw;
            return b.gwTotal - a.gwTotal;
        });

        const posIcon = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `<b style="color:#64748b">${i + 1}</b>`;

        tbl.innerHTML = `<thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PP</th><th>S+</th><th>S-</th><th>G+</th><th>G-</th><th>DG</th><th>Pts</th></tr></thead><tbody>${arr.map((s, i) => {
            const gd = s.gwTotal - s.glTotal;
            return `<tr><td>${posIcon(i)}</td><td><div style="display:flex;align-items:center;gap:6px">${this._tAvatar(s.id, 22)}<span style="font-weight:700;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(s.name)}</span></div></td><td>${s.gp}</td><td style="color:#15803d;font-weight:700">${s.gw}</td><td style="color:#dc2626">${s.gl}</td><td>${s.sw}</td><td>${s.sl}</td><td>${s.gwTotal}</td><td>${s.glTotal}</td><td style="${gd >= 0 ? 'color:#15803d' : 'color:#dc2626'};font-weight:700">${gd >= 0 ? '+' : ''}${gd}</td><td style="font-weight:900;font-size:15px">${s.pts}</td></tr>`;
        }).join('')}</tbody>`;
    },

    _rPlayers() {
        const el = document.getElementById('players-list');
        if (!el) return;

        const teams = this.teams.filter(t => !t.isBye);

        el.innerHTML = `<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="p-4 border-b border-gray-100"><h3 class="font-black text-gray-900 flex items-center gap-2">${ICO.racket} Participantes (${teams.length})</h3></div>
            ${teams.map((t, i) => {
                const bg = t.gender === 'male' ? 'linear-gradient(135deg,#60a5fa,#2563eb)' : t.gender === 'female' ? 'linear-gradient(135deg,#f472b6,#be185d)' : 'linear-gradient(135deg,#a78bfa,#7c3aed)';
                const av = t.photo ? (t.isVideo ? `<video src="${Sanitizer.attribute(t.photo)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0" autoplay muted loop playsinline></video>` : `<img src="${Sanitizer.attribute(t.photo)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0">`) : `<div style="width:40px;height:40px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:white;flex-shrink:0">${Sanitizer.text(t.name.charAt(0))}</div>`;
                const catDisplay = t.category ? t.category + 'CAT' : '';
                const realIdx = this.teams.indexOf(t);

                return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f1f5f9">
                    ${av}<div style="flex:1;min-width:0">
                        <p style="font-weight:800;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(t.name)}${t.seed ? ` ${ICO.star}` : ''}${catDisplay ? ` <span style="background:#e0e7ff;color:#3730a3;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px">${catDisplay}</span>` : ''}</p>
                        <p style="font-size:12px;color:#64748b;margin-top:1px">${t.players.map(p => Sanitizer.text(p.name)).join(' · ')}</p>
                    </div>
                    <button onclick="app.openPlayerEdit(${realIdx})" style="font-size:10px;background:#dbeafe;color:#2563eb;font-weight:700;padding:4px 10px;border-radius:6px;border:none;cursor-pointer">${ICO.pen} Editar</button>
                </div>`;
            }).join('')}
        </div>`;
    },

    _rStats() {
        const stats = {};
        this.teams.filter(t => !t.isBye).forEach(t => {
            stats[t.id] = { id: t.id, name: t.name, gw: 0, gl: 0, sw: 0, pts: 0 };
        });

        this.matches.filter(m => m.done && !m.isBye).forEach(m => {
            const w = m.winner, l = m.t1.includes(w) ? m.t2[0] : m.t1[0];
            if (stats[w]) { stats[w].gw++; stats[w].pts += this.config.ptsWin; }
            if (stats[l]) { stats[l].gl++; stats[l].pts += this.config.ptsLoss; }
            m.sets.forEach(s => {
                if (stats[m.t1[0]]) stats[m.t1[0]].sw += s[0] > s[1] ? 1 : 0;
                if (stats[m.t2[0]]) stats[m.t2[0]].sw += s[1] > s[0] ? 1 : 0;
            });
        });

        const arr = Object.values(stats).sort((a, b) => b.gw - a.gw || b.sw - a.sw);

        const el = document.getElementById('top-list');
        if (!el) return;

        el.innerHTML = arr.slice(0, 8).map((s, i) => `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f1f5f9">
            <span style="width:22px;flex-shrink:0;text-align:center">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            ${this._tAvatar(s.id, 28)}
            <span style="flex:1;font-weight:700;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(s.name)}</span>
            <span style="font-size:12px;color:#15803d;font-weight:700;flex-shrink:0">${s.gw}V</span>
            <span style="font-size:12px;color:#64748b;flex-shrink:0">${s.sw}S</span>
        </div>`).join('');

        const el2 = document.getElementById('gen-stats');
        if (!el2) return;

        const total = this.matches.filter(m => !m.isBye).length;
        const done = this.matches.filter(m => m.done && !m.isBye).length;

        el2.innerHTML = [['Total partidos', total], ['Jugados', done], ['Pendientes', total - done], ['Equipos', this.teams.filter(t => !t.isBye).length], ['Canchas', this.config.numCourts], ['Set', this.config.setType === 'short' ? 'Short(4)' : this.config.setType === 'pro' ? 'Pro(8)' : this.config.setType === 'custom' ? `Custom(${this.config.gamesPerSet})` : 'Normal(6)']].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;font-size:13px"><span style="color:#64748b;font-weight:600">${l}</span><span style="font-weight:800;color:#1e293b">${v}</span></div>`).join('');
    },

    openScore(mid) {
        const m = this.matches.find(x => x.id === mid);
        if (!m) return;

        const t1 = m.t1name || this._tn(m.t1[0]);
        const t2 = m.t2name || this._tn(m.t2[0]);

        document.getElementById('score-badge').textContent = m.done ? 'Jugado' : 'Pendiente';
        document.getElementById('score-badge').className = `text-xs font-bold px-2 py-0.5 rounded-full ${m.done ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`;

        const av1m = this._tAvatar(m.t1[0], 36);
        const av2m = this._tAvatar(m.t2[0], 36);

        document.getElementById('score-teams').innerHTML = `<div style="text-align:center;flex:1;min-width:0"><div style="display:flex;justify-content:center;margin-bottom:5px">${av1m}</div><p style="font-weight:900;font-size:13px;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(t1)}</p>${m.winner && m.t1.includes(m.winner) ? `<p style="font-size:12px;color:#15803d;font-weight:700">${ICO.trophy} Ganador</p>` : ''}</div><div style="padding:0 10px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M4 12 Q12 7 20 12"/><path d="M4 12 Q12 17 20 12"/></svg></div><div style="text-align:center;flex:1;min-width:0"><div style="display:flex;justify-content:center;margin-bottom:5px">${av2m}</div><p style="font-weight:900;font-size:13px;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(t2)}</p>${m.winner && m.t2.includes(m.winner) ? `<p style="font-size:12px;color:#15803d;font-weight:700">${ICO.trophy} Ganador</p>` : ''}</div>`;

        let sets = 2;
        if (this.config?.setType === 'short') sets = 3;
        else if (this.config?.setType === 'pro') sets = 1;
        else if (this.config?.setType === 'custom') sets = Math.ceil((this.config.gamesPerSet || 6) / 3);

        const gamesPerSet = this.config?.gamesPerSet || 6;
        const tiebreakPoints = this.config?.tiebreakPoints || 7;

        const hdrCols = `repeat(${sets + 1}, 1fr)`;
        document.getElementById('score-hdr').style.gridTemplateColumns = hdrCols;
        document.getElementById('score-hdr').innerHTML = `<span></span>${[...Array(sets)].map((_, i) => `<span>Set ${i + 1}</span>`).join('')}`;

        document.getElementById('score-t1').style.gridTemplateColumns = hdrCols;
        document.getElementById('score-t2').style.gridTemplateColumns = hdrCols;

        const ic = `border-2 border-gray-200 rounded-xl py-2 font-black text-center text-gray-700 text-xl focus:border-blue-500 outline-none`;

        document.getElementById('score-t1').innerHTML = `<span style="display:flex;align-items:center;font-weight:800;font-size:13px;color:#1e293b;overflow:hidden;text-overflow:ellipsis">${Sanitizer.text(t1)}</span>${[...Array(sets)].map((_, i) => `<input type="number" id="st1s${i}" min="0" max="99" class="${ic}" value="${m.sets[i] ? m.sets[i][0] : ''}" placeholder="0">`).join('')}`;

        document.getElementById('score-t2').innerHTML = `<span style="display:flex;align-items:center;font-weight:800;font-size:13px;color:#1e293b;overflow:hidden;text-overflow:ellipsis">${Sanitizer.text(t2)}</span>${[...Array(sets)].map((_, i) => `<input type="number" id="st2s${i}" min="0" max="99" class="${ic}" value="${m.sets[i] ? m.sets[i][1] : ''}" placeholder="0">`).join('')}`;

        const tbZone = document.getElementById('tiebreak-zone');
        const checkTiebreak = () => {
            let hasTiebreak = false;
            for (let i = 0; i < sets; i++) {
                const a = parseInt(document.getElementById(`st1s${i}`)?.value) || 0;
                const b = parseInt(document.getElementById(`st2s${i}`)?.value) || 0;
                if (a === gamesPerSet && b === gamesPerSet) { hasTiebreak = true; break; }
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

        const tbSet = m.sets.find(s => s.length > 2);
        if (tbSet) {
            document.getElementById('tb-p1').value = tbSet[2] || '';
            document.getElementById('tb-p2').value = tbSet[3] || '';
        }

        this._cm = mid;
        this._startTimer();
        document.getElementById('m-score').style.display = 'flex';
        setTimeout(() => document.getElementById('st1s0')?.focus(), 100);
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

        const m = this.matches.find(x => x.id === this._cm);
        if (!m) return;

        let sets = 2;
        if (this.config?.setType === 'short') sets = 3;
        else if (this.config?.setType === 'pro') sets = 1;
        else if (this.config?.setType === 'custom') sets = Math.ceil((this.config.gamesPerSet || 6) / 3);

        const newSets = [];
        for (let i = 0; i < sets; i++) {
            const a = parseInt(document.getElementById(`st1s${i}`)?.value) || 0;
            const b = parseInt(document.getElementById(`st2s${i}`)?.value) || 0;
            newSets.push([a, b]);
        }

        const gamesPerSet = this.config?.gamesPerSet || 6;
        const tiebreakPoints = this.config?.tiebreakPoints || 7;
        const maxWithTB = gamesPerSet + 1;

        for (let i = 0; i < sets; i++) {
            const a = newSets[i][0], b = newSets[i][1];
            if (a === 0 && b === 0) continue;

            if (a > maxWithTB || b > maxWithTB) {
                alert(`⚠️ Set ${i + 1}: Score inválido. Máximo ${maxWithTB} games (con tie-break)`);
                return;
            }

            if (a === gamesPerSet && b === gamesPerSet) {
                const tbP1 = parseInt(document.getElementById('tb-p1')?.value) || 0;
                const tbP2 = parseInt(document.getElementById('tb-p2')?.value) || 0;
                if (tbP1 === 0 && tbP2 === 0) {
                    alert(`⚠️ Set ${i + 1}: Hay empate ${gamesPerSet}-${gamesPerSet}. Debes registrar los puntos del tie-break abajo (ej: 7-5)`);
                    return;
                }
                if (Math.abs(tbP1 - tbP2) < 2 || Math.max(tbP1, tbP2) < tiebreakPoints) {
                    alert(`⚠️ Tie-Break inválido. Debe llegar a ${tiebreakPoints} puntos con diferencia de 2`);
                    return;
                }
                newSets[i].push(tbP1, tbP2);
            }

            const diff = Math.abs(a - b);
            const maxScore = Math.max(a, b);
            if (maxScore >= gamesPerSet && maxScore <= gamesPerSet && diff < 2) {
                alert(`⚠️ Set ${i + 1}: Debe ganar por 2 games de diferencia o llegar a tie-break (${maxWithTB}-${gamesPerSet})`);
                return;
            }
        }

        const t1w = newSets.filter(s => s[0] > s[1]).length;
        const t2w = newSets.filter(s => s[1] > s[0]).length;
        const winner = t1w > t2w ? m.t1[0] : t2w > t1w ? m.t2[0] : null;

        if (!winner) {
            alert('⚠️ No hay ganador. Debes completar todos los sets.');
            return;
        }

        m.sets = newSets;
        m.done = true;
        m.winner = winner;

        if (winner) {
            this._adv(m.id, winner);
            this._beep();
        }

        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
        this.closeScore();
        this._ra();
        this._checkChamp();
        this._toast(`${ICO.trophy} Resultado guardado`);
    },

    _adv(matchId, winnerId) {
        const wTeam = this.teams.find(t => t.id === winnerId);
        if (!wTeam) return;

        this.matches.forEach(m => {
            if (m.t1[0] === matchId + 'w') { m.t1 = [winnerId]; m.t1name = wTeam.name; }
            if (m.t2[0] === matchId + 'w') { m.t2 = [winnerId]; m.t2name = wTeam.name; }
        });
    },

    _beep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = 880;
            g.gain.setValueAtTime(0.4, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o.start();
            o.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    },

    _checkChamp() {
        const total = this.matches.filter(m => !m.isBye).length;
        const done = this.matches.filter(m => m.done && !m.isBye).length;
        if (total === 0 || done < total) return;

        const lastRound = Math.max(...this.matches.map(m => m.round));
        const finals = this.matches.filter(m => m.round === lastRound && m.done && !m.isBye);
        if (!finals.length) return;

        const champId = finals[finals.length - 1].winner;
        if (!champId) return;

        const champ = this.teams.find(t => t.id === champId);
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

    openShare() {
        const d = { n: this.tourName, c: this.config, t: this.teams, m: this.matches };
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
        navigator.clipboard.writeText(txt).then(() => this._toast(`${ICO.check} ¡Enlace copiado!`)).catch(() => {
            const t = document.createElement('textarea');
            t.value = txt;
            document.body.appendChild(t);
            t.select();
            document.execCommand('copy');
            t.remove();
            this._toast(`${ICO.check} Copiado`);
        });
        this.closeShare();
    },

    openHistory() {
        const h = JSON.parse(localStorage.getItem('pm12h') || '[]');
        const el = document.getElementById('hist-list');
        if (!h.length) {
            el.innerHTML = '<p class="text-center py-8 text-sm text-gray-400">No hay torneos guardados</p>';
            document.getElementById('m-history').style.display = 'flex';
            return;
        }
        el.innerHTML = h.map((t, i) => `<div style="border:2px solid #f1f5f9;border-radius:14px;padding:14px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                <div style="flex:1;min-width:0">
                    <p style="font-weight:900;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ICO.trophy} ${Sanitizer.text(t.n)}</p>
                    <p style="font-size:12px;color:#64748b;margin-top:3px">${t.date} · ${t.fmt} · ${t.teams} equipos · ${t.done}/${t.matches}</p>
                </div>
                <div style="display:flex;gap:4px;flex-shrink:0">
                    <button onclick="app.loadHist(${i})" style="background:#dbeafe;color:#2563eb;font-weight:700;font-size:12px;padding:5px 10px;border-radius:8px;border:none;cursor-pointer">${ICO.play} Cargar</button>
                    <button onclick="app.delHist(${i})" style="background:#fee2e2;color:#dc2626;font-weight:700;font-size:12px;padding:5px 8px;border-radius:8px;border:none;cursor-pointer">${ICO.trash}</button>
                </div>
            </div>
        </div>`).join('');
        document.getElementById('m-history').style.display = 'flex';
    },

    closeHistory() {
        document.getElementById('m-history').style.display = 'none';
    },

    loadHist(i) {
        if (!confirm('¿Cargar este torneo? Se perderá el actual.')) return;
        const h = JSON.parse(localStorage.getItem('pm12h') || '[]');
        const t = h[i];
        if (!t || !t.snap) return;
        const d = JSON.parse(t.snap);
        this.tourName = d.n || 'Torneo';
        this.config = d.c;
        this.teams = d.t;
        this.matches = d.m;
        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches });
        document.getElementById('tour-name').textContent = this.tourName;
        this.closeHistory();
        this.sv('dash');
    },

    delHist(i) {
        if (!confirm('¿Eliminar del historial?')) return;
        const h = JSON.parse(localStorage.getItem('pm12h') || '[]');
        h.splice(i, 1);
        localStorage.setItem('pm12h', JSON.stringify(h));
        this.openHistory();
    },

    editName() {
        const inp = document.getElementById('name-inp');
        if (inp) inp.value = this.tourName;
        document.getElementById('m-name').style.display = 'flex';
        setTimeout(() => inp?.select(), 100);
    },

    saveName() {
        const v = document.getElementById('name-inp')?.value.trim();
        if (!v) return;
        this.tourName = v;
        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
        document.getElementById('tour-name').textContent = v;
        this.closeNameM();
        this._toast(`${ICO.check} Nombre guardado`);
    },

    closeNameM() {
        document.getElementById('m-name').style.display = 'none';
    },

    resetAll() {
        if (!confirm('¿Reiniciar todo? Se perderán todos los datos.')) return;
        this._stopBanner();
        VersionedStorage.clear();
        this.tourName = 'Torneo Pádel';
        this.config = null;
        this.teams = [];
        this.matches = [];
        this.tourLogo = null;
        this._selectedDays = [0,1,2,3,4,5,6];
        document.getElementById('tour-name').textContent = 'Torneo Pádel';
        document.getElementById('hdr-sub').textContent = 'Configura y genera tu torneo';
        this._updateDaySelectorUI();
        this.sv('config');
        this._toast('Torneo reiniciado');
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
            const sn = document.getElementById('hdr-strip-name');
            const ss = document.getElementById('hdr-strip-sub');
            if (sn) sn.textContent = this.tourName || 'Torneo Pádel';
            if (ss) ss.textContent = document.getElementById('hdr-sub')?.textContent || '';
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

    _startBanner() {
        this._stopBanner();
        const slides = [];
        const pending = this.matches.filter(m => !m.done && !m.isBye);
        const done = this.matches.filter(m => m.done && !m.isBye);
        const total = this.matches.filter(m => !m.isBye).length;

        const stats = {};
        this.teams.filter(t => !t.isBye).forEach(t => { stats[t.id] = { id: t.id, name: t.name, pts: 0, gw: 0 }; });
        this.matches.filter(m => m.done && !m.isBye && m.winner).forEach(m => {
            if (stats[m.winner]) { stats[m.winner].pts += this.config?.ptsWin || 3; stats[m.winner].gw++; }
        });

        const ranked = Object.values(stats).sort((a, b) => b.pts - a.pts || b.gw - a.gw).filter(s => s.gw > 0);

        if (pending.length > 0) {
            const m = pending[0];
            slides.push({ emoji: '🎾', text: `<strong>${m.t1name || this._tn(m.t1[0])}</strong> vs <strong>${m.t2name || this._tn(m.t2[0])}</strong>`, subtext: `Próximo · Cancha ${m.court}`, type: 'next' });
        }
        if (total > 0) {
            const pct = Math.round(done.length / total * 100);
            slides.push({ emoji: '📊', text: `${pct}% completado`, subtext: `${done.length} de ${total} partidos jugados`, type: 'progress' });
        }
        if (ranked.length > 0) {
            slides.push({ emoji: '🏆', text: `<strong>${ranked[0].name}</strong> lidera con ${ranked[0].gw}V / ${ranked[0].pts}pts`, subtext: ranked.slice(0, 3).map((s, i) => ['🥇', '🥈', '🥉'][i] + ' ' + s.name).join(' · '), type: 'leader' });
        }

        if (!slides.length) {
            slides.push({ emoji: '✨', text: '¡El mejor pádel empieza aquí!', subtext: 'Que gane el más fuerte 🏆', type: 'info' });
        }

        const banner = document.getElementById('tour-banner');
        const inner = document.getElementById('banner-inner');
        const dots = document.getElementById('banner-dots');
        if (!banner || !inner || !dots) return;

        banner.style.display = 'block';
        inner.innerHTML = slides.map((sl, i) => {
            const mediaHtml = `<span class="banner-emoji">${sl.emoji}</span>`;
            const txtBlock = `<div class="banner-txt-wrap"><span class="banner-txt">${sl.text}</span>${sl.subtext ? `<span class="banner-txt-sub">${sl.subtext}</span>` : ''}</div>`;
            return `<div class="banner-slide${i === 0 ? ' active' : ''}">${mediaHtml}${txtBlock}</div>`;
        }).join('');

        dots.innerHTML = slides.map((_, i) => `<div class="bdot${i === 0 ? ' active' : ''}" onclick="app._goSlide(${i})"></div>`).join('');

        this._bannerSlots = slides.length;
        this._bannerIdx = 0;
        this._bannerTimer = setInterval(() => this._nextSlide(), 5000);
    },

    _nextSlide() {
        this._goSlide((this._bannerIdx + 1) % this._bannerSlots);
    },

    _goSlide(idx) {
        this._bannerIdx = idx;
        document.querySelectorAll('.banner-slide').forEach((el, i) => el.classList.toggle('active', i === idx));
        document.querySelectorAll('.bdot').forEach((el, i) => el.classList.toggle('active', i === idx));
    },

    _stopBanner() {
        if (this._bannerTimer) {
            clearInterval(this._bannerTimer);
            this._bannerTimer = null;
        }
        const b = document.getElementById('tour-banner');
        if (b) b.style.display = 'none';
    },

    // ============================================
    // EDITOR DE JUGADOR (SIN ELO)
    // ============================================
    openPlayerEdit(idx) {
        this._peIdx = idx;
        const t = this.teams[idx];
        if (!t) return;
        const p = t.players[0];
        if (!p) return;

        document.getElementById('pe-player-name').textContent = `${t.name} - ${p.name}`;
        document.getElementById('pe-name').value = p.name;
        document.getElementById('pe-category').value = t.category || 7;
        document.getElementById('pe-hand').value = p.hand || '';
        document.getElementById('pe-position').value = p.position || '';
        document.getElementById('pe-age').value = p.age || '';
        document.getElementById('pe-level').value = p.level || 'intermediate';
        document.getElementById('pe-seed').checked = t.seed || false;

        this._peMedia = p.photo || null;
        this._peIsVideo = p.isVideo || false;
        this._updatePlayerEditPreview();
        document.getElementById('player-edit-zone').style.display = 'block';
    },

    _updatePlayerEditPreview() {
        const placeholder = document.getElementById('pe-placeholder');
        const preview = document.getElementById('pe-media-preview');
        const video = document.getElementById('pe-video-preview');
        const badge = document.getElementById('pe-media-badge');
        const vidInd = document.getElementById('pe-video-ind');

        if (this._peMedia) {
            placeholder.style.display = 'none';
            if (this._peIsVideo) {
                preview.style.display = 'none';
                video.style.display = 'block';
                video.src = this._peMedia;
                video.play();
                badge.textContent = 'VIDEO';
                badge.classList.add('show');
                vidInd.classList.add('show');
            } else {
                preview.style.display = 'block';
                video.style.display = 'none';
                preview.src = this._peMedia;
                badge.classList.remove('show');
                vidInd.classList.remove('show');
            }
        } else {
            placeholder.style.display = 'flex';
            preview.style.display = 'none';
            video.style.display = 'none';
            badge.classList.remove('show');
            vidInd.classList.remove('show');
        }
    },

    previewPlayerMedia(inp) {
        const file = inp.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isGif = file.type === 'image/gif';
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
                    document.getElementById('pe-video-duration').textContent = `${Math.floor(vid.duration / 60)}:${Math.floor(vid.duration % 60).toString().padStart(2, '0')}`;
                    this._updatePlayerEditPreview();
                };
            } else if (isGif) {
                this._peMedia = raw;
                this._peIsVideo = false;
                this._updatePlayerEditPreview();
            } else {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const sz = 400;
                    canvas.width = canvas.height = sz;
                    const ctx = canvas.getContext('2d');
                    const sc = Math.max(sz / img.width, sz / img.height);
                    ctx.drawImage(img, (sz - img.width * sc) / 2, (sz - img.height * sc) / 2, img.width * sc, img.height * sc);
                    this._peMedia = canvas.toDataURL('image/jpeg', 0.85);
                    this._peIsVideo = false;
                    this._updatePlayerEditPreview();
                };
                img.src = raw;
            }
        };
        reader.readAsDataURL(file);
    },

    savePlayerEdit(e) {
        e.preventDefault();
        if (this._peIdx < 0) return;

        const t = this.teams[this._peIdx];
        const p = t.players[0];

        const name = document.getElementById('pe-name')?.value.trim();
        if (!name) { alert('Ingresa el nombre'); return; }

        p.name = name;
        t.category = +document.getElementById('pe-category')?.value || 7;
        t.seed = document.getElementById('pe-seed')?.checked || false;
        p.hand = document.getElementById('pe-hand')?.value || '';
        p.position = document.getElementById('pe-position')?.value || '';
        p.age = +document.getElementById('pe-age')?.value || 0;
        p.level = document.getElementById('pe-level')?.value || 'intermediate';

        if (this._peMedia) {
            p.photo = this._peMedia;
            p.isVideo = this._peIsVideo;
        }

        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
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

    // ============================================
    // AGREGAR/EDITAR EQUIPO
    // ============================================
    openAdd(editIdx = -1) {
        this._editIdx = editIdx;
        if (!this.config) {
            this._toast('⚠️ Primero configura el torneo');
            return;
        }

        const isEdit = editIdx >= 0;
        const ex = isEdit ? this.teams[editIdx] : null;
        const numPlayers = this.config.playersPerTeam || 2;

        document.getElementById('add-title').innerHTML = `<span class="ico-badge ico-blue" style="margin-right:10px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></span>${isEdit ? 'Editar Equipo' : 'Nuevo Equipo'}`;
        document.getElementById('add-ok').innerHTML = `${ICO.check} ${isEdit ? 'Guardar' : 'Agregar'}`;

        const gnd = this.config.genderMode;
        const gOpts = gnd === 'male' ? [['male', 'Masculino']] : gnd === 'female' ? [['female', 'Femenino']] : [['male', 'Masculino'], ['female', 'Femenino'], ['mixed', 'Mixto']];
        const gSel = ex ? ex.gender : gOpts[0][0];
        const go = gOpts.map(([v, l]) => `<option value="${v}"${v === gSel ? ' selected' : ''}>${l}</option>`).join('');

        const ic = `w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:border-blue-500 outline-none bg-white`;
        const lc = `display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px`;

        const avUp = (pid, ep, isV) => `<div style="display:flex;align-items:center;gap:12px">
            <div id="av-prev-${pid}" style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid #e2e8f0;flex-shrink:0;background:#f1f5f9;display:flex;align-items:center;justify-content:center">
                ${ep ? (isV ? `<video src="${Sanitizer.attribute(ep)}" style="width:100%;height:100%;object-fit:cover" autoplay muted loop playsinline></video>` : `<img src="${Sanitizer.attribute(ep)}" style="width:100%;height:100%;object-fit:cover">`) : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.9" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
            </div>
            <div style="flex:1">
                <label style="${lc}">Foto</label>
                <input type="file" id="av-file-${pid}" accept="image/*,image/gif,video/mp4,video/webm,video/*" style="display:none" onchange="app.previewAvatar('${pid}')">
                <button type="button" onclick="document.getElementById('av-file-${pid}').click()" style="font-size:11px;background:#f1f5f9;color:#475569;font-weight:700;padding:6px 12px;border-radius:8px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px">${ICO.img} Subir</button>
                ${ep ? `<button type="button" onclick="app.removeAvatar('${pid}')" style="font-size:11px;background:#fee2e2;color:#dc2626;font-weight:700;padding:6px 10px;border-radius:8px;border:none;cursor:pointer;margin-left:6px">${ICO.trash}</button>` : ''}
            </div>
        </div>`;

        const catOpts = [3, 4, 5, 6, 7].map(c => `<option value="${c}"${ex?.category == c ? ' selected' : ''}>${c}CAT</option>`).join('');

        let playersHtml = '';
        for (let i = 0; i < numPlayers; i++) {
            const p = ex?.players[i] || { name: '', gender: gSel, hand: '', position: '', ranking: '', age: '', photo: null, isVideo: false };
            const hOpts = `<option value="right"${p.hand === 'right' ? ' selected' : ''}>✋ Diestro</option><option value="left"${p.hand === 'left' ? ' selected' : ''}>🤚 Zurdo</option>`;
            const posOpts = `<option value="drive"${p.position === 'drive' ? ' selected' : ''}>Drive</option><option value="reves"${p.position === 'reves' ? ' selected' : ''}>Revés</option>`;

            playersHtml += `<div style="border-top:2px solid #f1f5f9;padding-top:12px">
                <p style="font-size:11px;font-weight:800;color:#3b82f6;text-transform:uppercase;margin-bottom:8px">${ICO.ball} Jugador ${i + 1}${i === 0 ? ' (Capitán)' : ''}</p>
                <div class="space-y-2">
                    ${avUp('p' + i, p.photo, p.isVideo)}
                    <div>
                        <label style="${lc}">Nombre</label>
                        <input id="ap-p${i}" class="${ic}" placeholder="Nombre completo" value="${Sanitizer.attribute(p.name)}" ${i === 0 ? 'required' : ''}>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label style="${lc}">Género</label>
                            <select id="ap-g${i}" class="${ic}">${go}</select>
                        </div>
                        <div>
                            <label style="${lc}">Mano</label>
                            <select id="ap-h${i}" class="${ic}">
                                <option value="">—</option>
                                ${hOpts}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label style="${lc}">Posición</label>
                            <select id="ap-pos${i}" class="${ic}">
                                <option value="">—</option>
                                ${posOpts}
                            </select>
                        </div>
                        <div>
                            <label style="${lc}">Nivel</label>
                            <select id="ap-l${i}" class="${ic}">
                                <option value="beginner"${p.level === 'beginner' ? ' selected' : ''}>Principiante</option>
                                <option value="intermediate"${p.level === 'intermediate' ? ' selected' : ''}>Intermedio</option>
                                <option value="advanced"${p.level === 'advanced' ? ' selected' : ''}>Avanzado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        const tn = ex?.name || '';
        document.getElementById('add-body').innerHTML = `<div><label style="${lc}">Logo Equipo</label>${avUp('team', ex?.photo || null, ex?.isVideo || false)}</div>
            <div><label style="${lc}">Nombre del Equipo (opcional)</label><input id="ap-teamname" class="${ic}" placeholder="Ej: Los Ases" value="${Sanitizer.attribute(tn && !tn.includes('/') ? tn : '')}"></div>
            <div><label style="${lc}">Categoría</label><select id="ap-category" class="${ic}">${catOpts}</select></div>
            ${playersHtml}
            <label class="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" id="ap-seed" class="w-4 h-4 accent-yellow-500"${ex?.seed ? ' checked' : ''}>
                <span class="text-sm text-gray-700">${ICO.star} Cabeza de serie</span>
            </label>`;

        document.getElementById('m-add').style.display = 'flex';
        setTimeout(() => document.getElementById('ap-p0')?.focus(), 100);
    },

    previewAvatar(pid) {
        const file = document.getElementById(`av-file-${pid}`)?.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isGif = file.type === 'image/gif';
        const reader = new FileReader();

        reader.onload = e => {
            const b64 = e.target.result;

            if (isVideo || isGif) {
                const prev = document.getElementById(`av-prev-${pid}`);
                if (prev) {
                    if (isVideo) {
                        prev.innerHTML = `<video src="${Sanitizer.attribute(b64)}" style="width:100%;height:100%;object-fit:cover" autoplay muted loop playsinline></video>`;
                    } else {
                        prev.innerHTML = `<img src="${Sanitizer.attribute(b64)}" style="width:100%;height:100%;object-fit:cover">`;
                    }
                }
                const f = document.getElementById(`av-file-${pid}`);
                if (f) {
                    f.dataset.b64 = b64;
                    if (isVideo) f.dataset.isVideo = '1';
                }
                return;
            }

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const sz = 180;
                canvas.width = canvas.height = sz;
                const ctx = canvas.getContext('2d');
                const scale = Math.max(sz / img.width, sz / img.height);
                const w = img.width * scale, h = img.height * scale;
                ctx.drawImage(img, (sz - w) / 2, (sz - h) / 2, w, h);
                const b64c = canvas.toDataURL('image/jpeg', 0.82);

                const prev = document.getElementById(`av-prev-${pid}`);
                if (prev) prev.innerHTML = `<img src="${Sanitizer.attribute(b64c)}" style="width:100%;height:100%;object-fit:cover">`;

                const f = document.getElementById(`av-file-${pid}`);
                if (f) {
                    f.dataset.b64 = b64c;
                    delete f.dataset.isVideo;
                }
            };
            img.src = b64;
        };
        reader.readAsDataURL(file);
    },

    removeAvatar(pid) {
        const prev = document.getElementById(`av-prev-${pid}`);
        if (prev) {
            prev.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.9" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        }
        const f = document.getElementById(`av-file-${pid}`);
        if (f) {
            f.value = '';
            delete f.dataset.b64;
            delete f.dataset.isVideo;
        }
    },

    closeAdd() {
        document.getElementById('m-add').style.display = 'none';
        this._editIdx = -1;
    },

    submitAdd() {
        if (!this.config) return;

        const numPlayers = this.config.playersPerTeam || 2;
        const p1n = document.getElementById('ap-p0')?.value.trim();

        if (!p1n) {
            alert('Ingresa el nombre del primer jugador');
            return;
        }

        const g1 = document.getElementById('ap-g0')?.value || 'male';
        const seed = document.getElementById('ap-seed')?.checked || false;
        const category = +document.getElementById('ap-category')?.value || 7;

        const getB64 = pid => document.getElementById(`av-file-${pid}`)?.dataset.b64 || null;
        const getIsVideo = pid => document.getElementById(`av-file-${pid}`)?.dataset.isVideo === '1';

        const players = [];
        for (let i = 0; i < numPlayers; i++) {
            const nm = document.getElementById(`ap-p${i}`)?.value.trim();
            if (!nm && i > 0) continue;

            players.push({
                name: nm || `Jugador ${i + 1}`,
                gender: document.getElementById(`ap-g${i}`)?.value || g1,
                hand: document.getElementById(`ap-h${i}`)?.value || '',
                position: document.getElementById(`ap-pos${i}`)?.value || '',
                level: document.getElementById(`ap-l${i}`)?.value || 'intermediate',
                ranking: 0,
                age: 0,
                photo: getB64('p' + i),
                isVideo: getIsVideo('p' + i)
            });
        }

        const tn = document.getElementById('ap-teamname')?.value.trim() || players.map(p => p.name).join(' / ');
        const g = players.every(p => p.gender === 'male') ? 'male' : players.every(p => p.gender === 'female') ? 'female' : 'mixed';

        const existing = this._editIdx >= 0 ? this.teams[this._editIdx] : null;
        const team = {
            id: existing ? existing.id : 't' + Date.now(),
            name: tn,
            gender: g,
            category,
            seed,
            photo: getB64('team') || existing?.photo || null,
            isVideo: getIsVideo('team') || existing?.isVideo || false,
            players
        };

        if (this._editIdx >= 0) {
            this.teams[this._editIdx] = team;
        } else {
            this.teams.push(team);
        }

        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
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
        const t = this.teams[i];
        if (!t) return;

        const hasMatches = this.matches.some(m => (m.t1.includes(t.id) || m.t2.includes(t.id)) && m.done);

        if (hasMatches) {
            if (!confirm(`⚠️ "${Sanitizer.text(t.name)}" tiene partidos jugados. ¿Continuar?`)) return;
            this.matches = this.matches.filter(m => !m.t1.includes(t.id) && !m.t2.includes(t.id));
        } else {
            if (!confirm(`¿Eliminar "${Sanitizer.text(t.name)}"?`)) return;
        }

        this.teams.splice(i, 1);
        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
        this._renderReg();
        this._updGenBtn();

        if (document.getElementById('v-dash').style.display !== 'none') {
            this._ra();
        }

        this._toast(`${ICO.trash} Eliminado`);
    },

    clearAll() {
        if (!confirm('¿Eliminar todos los equipos?')) return;
        this.teams = [];
        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
        this._renderReg();
        this._updGenBtn();
    },

    openAutoFill() {
        if (!this.config) {
            this._toast('⚠️ Primero configura el torneo');
            return;
        }

        document.getElementById('af-hint').textContent = `Agrega equipos ficticios. Tienes ${this.teams.filter(t => !t.isBye).length}.`;
        document.getElementById('af-count').value = Math.max(this.teams.filter(t => !t.isBye).length + 4, 8);
        document.getElementById('m-autofill').style.display = 'flex';

        setTimeout(() => {
            const input = document.getElementById('af-count');
            if (input) {
                input.focus();
                input.select();
            }
        }, 150);
    },

    closeAutoFill() {
        const modal = document.getElementById('m-autofill');
        if (modal) modal.style.display = 'none';
    },

    runAutoFill() {
        const target = Math.min(200, Math.max(4, +document.getElementById('af-count')?.value || 8));
        this.closeAutoFill();

        if (!this.config) return;

        const gnd = this.config.genderMode;
        const current = this.teams.filter(t => !t.isBye).length;
        const need = Math.max(0, target - current);

        if (need <= 0) {
            this._toast('✅ Ya tienes suficientes equipos');
            return;
        }

        const usedNames = new Set(this.teams.flatMap(t => t.players.map(p => p.name)));

        const getPool = g => {
            const src = g === 'female' ? DB.f : DB.m;
            return src.filter(([nm]) => !usedNames.has(nm));
        };

        const extendPool = (g, needed) => {
            let pool = getPool(g);
            if (pool.length >= needed) return pool;

            const fN = g === 'female' ? ['Alba', 'Blanca', 'Carla', 'Dina', 'Elisa'] : ['Aldo', 'Bruno', 'Ciro', 'Dino', 'Elio'];
            const lN = ['Acuña', 'Banda', 'Cerna', 'Daza', 'Egea'];
            const extra = [];

            for (let i = 0; extra.length < (needed - pool.length) + 5; i++) {
                const nm = fN[i % fN.length] + ' ' + lN[i % lN.length];
                if (!usedNames.has(nm)) extra.push([nm, Math.floor(Math.random() * 5) + 3]);
            }

            return [...pool, ...extra];
        };

        const hands = ['right', 'right', 'right', 'left'];
        const positions = ['drive', 'reves'];
        const categories = [3, 4, 5, 6, 7];
        const levels = ['beginner', 'intermediate', 'intermediate', 'advanced'];
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];

        const batchSize = 10;
        let created = 0;

        const createBatch = () => {
            const batchEnd = Math.min(need, created + batchSize);

            for (let i = created; i < batchEnd; i++) {
                const idx = this.teams.filter(t => !t.isBye).length;
                const g1 = gnd === 'female' ? 'female' : gnd === 'male' ? 'male' : (idx % 2 === 0 ? 'male' : 'female');

                const pool1 = extendPool(g1, 1);
                if (!pool1.length) break;

                const [n1] = pick(pool1);
                usedNames.add(n1);

                const numPlayers = this.config.playersPerTeam || 2;
                const players = [{
                    name: n1,
                    gender: g1,
                    hand: pick(hands),
                    position: pick(positions),
                    level: pick(levels),
                    ranking: 0,
                    age: Math.floor(Math.random() * 20) + 20,
                    photo: null,
                    isVideo: false
                }];

                for (let j = 1; j < numPlayers; j++) {
                    const g2 = gnd === 'mixed' ? (g1 === 'male' ? 'female' : 'male') : g1;
                    const pool2 = extendPool(g2, 1).filter(([nm]) => !usedNames.has(nm));

                    if (!pool2.length) break;

                    const [n2] = pick(pool2);
                    usedNames.add(n2);

                    players.push({
                        name: n2,
                        gender: g2,
                        hand: pick(hands),
                        position: pick(positions),
                        level: pick(levels),
                        ranking: 0,
                        age: Math.floor(Math.random() * 20) + 20,
                        photo: null,
                        isVideo: false
                    });
                }

                this.teams.push({
                    id: 't' + Date.now() + i,
                    name: players.map(p => p.name).join(' / '),
                    gender: players.every(p => p.gender === 'male') ? 'male' : players.every(p => p.gender === 'female') ? 'female' : 'mixed',
                    category: pick(categories),
                    seed: false,
                    photo: null,
                    isVideo: false,
                    players
                });
            }

            created = batchEnd;

            if (created < need) {
                requestAnimationFrame(createBatch);
            } else {
                VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });
                this._renderReg();
                this._updGenBtn();
                this._toast(`✅ ${need} equipos agregados`);
            }
        };

        createBatch();
    },

    loadCfgImage(inp) {
        if (!inp.files[0]) return;
        const file = inp.files[0];
        const isGif = file.type === 'image/gif';
        const r = new FileReader();

        r.onload = e => {
            const raw = e.target.result;
            const doSave = (b64) => {
                this.tourLogo = b64;
                VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });

                const prev = document.getElementById('tour-img-preview');
                const lbl = document.getElementById('cfg-img-lbl');
                const rmv = document.getElementById('cfg-img-remove');

                if (prev) { prev.src = b64; prev.style.display = 'block'; }
                if (lbl) lbl.textContent = `✓ ${isGif ? 'GIF' : 'Imagen'} cargada`;
                if (rmv) rmv.style.display = 'flex';

                this._toast('✓ Imagen guardada');
            };

            if (isGif) { doSave(raw); return; }

            const img = new Image();
            img.onload = () => {
                const cv = document.createElement('canvas');
                const sc = Math.min(600 / img.width, 300 / img.height, 1);
                cv.width = Math.round(img.width * sc);
                cv.height = Math.round(img.height * sc);
                cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
                doSave(cv.toDataURL('image/png', 0.92));
            };
            img.src = raw;
        };
        r.readAsDataURL(file);
    },

    removeCfgImage() {
        this.tourLogo = null;
        VersionedStorage.save({ n: this.tourName, c: this.config, t: this.teams, m: this.matches, days: this._selectedDays });

        const prev = document.getElementById('tour-img-preview');
        const lbl = document.getElementById('cfg-img-lbl');
        const rmv = document.getElementById('cfg-img-remove');
        const inp = document.getElementById('cfg-tour-img');

        if (prev) { prev.src = ''; prev.style.display = 'none'; }
        if (lbl) lbl.textContent = 'Toca para agregar logo/imagen';
        if (rmv) rmv.style.display = 'none';
        if (inp) inp.value = '';

        const dls = document.getElementById('dash-logo-strip');
        if (dls) dls.style.display = 'none';

        const btl = document.getElementById('bracket-tour-logo');
        if (btl) btl.style.display = 'none';

        this._toast('Imagen eliminada');
    }
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Exportar app globalmente
window.app = app;
