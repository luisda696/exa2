/**
 * ============================================
 * APP.JS - Lógica Principal Completa
 * ============================================
 * TODAS las funciones para registro de equipos y calendario
 */

// ============================================
// BASE DE DATOS DE JUGADORES PARA AUTO-LLENAR
// ============================================
const DB = {
    m: [['Alejandro García',6],['Carlos Rodríguez',5],['Diego Martínez',6],['Pablo López',4],['Javier González',5],['Luis Hernández',4],['David Pérez',6],['Sergio Sánchez',5],['Fernando Ruiz',3],['Miguel Díaz',4],['Roberto Moreno',5],['Antonio Muñoz',3],['Juan Álvarez',4],['Pedro Romero',5],['Marcos Alonso',3],['Daniel Gutiérrez',6],['Eduardo Torres',4],['Andrés Ramírez',5],['Nicolás Flores',3],['Adrián Castro',4],['Iván Ortega',5],['Víctor Rubio',3],['Óscar Navarro',4],['Hugo Domínguez',6],['Manuel Vargas',5],['Raúl Ibáñez',4],['Rafael Gil',3],['Álvaro Jiménez',5],['Gonzalo Cruz',4],['Rubén Reyes',3],['Tomás Vega',6],['Emilio Suárez',4],['Salvador Molina',5],['Ángel Blanco',3],['Rodrigo Ramos',4],['Ignacio Santos',5],['Mateo Herrera',3],['Felipe Mora',4],['Agustín Cabrera',5],['Bernardo Ríos',3],['César Delgado',4],['Clemente Fuentes',5],['Damián Ponce',3],['Enrique Salinas',6],['Facundo Vidal',4],['Gastón Medina',5],['Héctor Guerrero',3],['Isaac Peña',4],['Jairo Campos',5],['Kevin Espinoza',3]],
    f: [['María García',6],['Ana Rodríguez',5],['Laura Martínez',6],['Sofía López',4],['Carmen González',5],['Elena Hernández',4],['Isabel Pérez',6],['Lucía Sánchez',5],['Marta Ruiz',3],['Paula Díaz',4],['Cristina Moreno',5],['Andrea Muñoz',3],['Silvia Álvarez',4],['Raquel Romero',5],['Beatriz Alonso',3],['Natalia Gutiérrez',6],['Patricia Torres',4],['Verónica Ramírez',5],['Lorena Flores',3],['Miriam Castro',4],['Rebeca Ortega',5],['Sandra Rubio',3],['Pilar Navarro',4],['Rosa Domínguez',6],['Teresa Vargas',5],['Irene Ibáñez',4],['Claudia Gil',3],['Mónica Jiménez',5],['Alicia Cruz',4],['Esther Reyes',3],['Diana Vega',6],['Nuria Suárez',4],['Viviana Molina',5],['Valeria Blanco',3],['Ximena Ramos',4],['Yanira Santos',5],['Zara Herrera',3],['Amber Mora',4],['Brenda Cabrera',5],['Celia Ríos',3],['Delia Delgado',4],['Elvira Fuentes',5],['Fátima Ponce',3],['Gloria Salinas',6],['Hilda Vidal',4],['Ingrid Medina',5],['Jimena Guerrero',3],['Karen Peña',4],['Lina Campos',5],['Maite Espinoza',3]]
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

    // Datos del torneo (se cargan desde VersionedStorage)
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
        
        // Header glass effect on scroll
        window.addEventListener('scroll', () => {
            const hdr = document.getElementById('main-header');
            if (hdr) {
                hdr.classList.toggle('glass', window.scrollY > 30);
            }
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

        // Restore header state
        this._restoreHeaderState();

        // Load saved data from VersionedStorage
        setTimeout(() => {
            const data = VersionedStorage.load();
            if (data) {
                this.tourName = data.n || 'Torneo Pádel';
                this.config = data.c || null;
                this.teams = data.t || [];
                this.matches = data.m || [];
                this.tourLogo = data.logo || null;
                
                if (this.config && this.teams.length) {
                    document.getElementById('tour-name').textContent = this.tourName;
                    this.sv('dash');
                } else {
                    this.sv('config');
                }
            } else {
                this.sv('config');
            }
        }, 2300);

        // Check for shared tournament in URL
        try {
            const h = location.hash;
            if (h.startsWith('#d=')) {
                const d = JSON.parse(decodeURIComponent(escape(atob(h.slice(3)))));
                this.tourName = d.n || 'Torneo';
                this.config = d.c;
                this.teams = d.t;
                this.matches = d.m;
                this._save();
                location.hash = '';
            }
        } catch (e) {
            console.error('Error cargando torneo compartido:', e);
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
    // NAVEGACIÓN ENTRE VISTAS
    // ============================================
    sv(view) {
        const map = { config: 'v-config', register: 'v-register', dash: 'v-dash' };
        
        Object.entries(map).forEach(([k, id]) => {
            document.getElementById(id).style.display = k === view ? '' : 'none';
            const bn = document.getElementById('bn-' + k);
            if (bn) bn.style.color = k === view ? '#2563eb' : '#9ca3af';
        });

        // Update step pills
        const si = ['config', 'register', 'dash'].indexOf(view);
        [0, 1, 2].forEach(i => {
            const el = document.getElementById('step-' + i);
            if (el) el.style.background = i <= si ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.2)';
        });

        // Header toggle visibility
        const pill = document.getElementById('hdr-toggle');
        if (pill) pill.style.display = view === 'dash' ? 'block' : 'none';

        // View-specific initialization
        if (view === 'config') {
            if (this.tourLogo) {
                const prev = document.getElementById('tour-img-preview');
                const lbl = document.getElementById('cfg-img-lbl');
                const rmv = document.getElementById('cfg-img-remove');
                if (prev) { prev.src = this.tourLogo; prev.style.display = 'block'; }
                if (lbl) lbl.textContent = '✓ Imagen cargada';
                if (rmv) rmv.style.display = 'flex';
            }
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
            matchesPerDay: 4
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
    // REGISTRO DE EQUIPOS - ACTUALIZACIÓN
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

    // ============================================
    // RENDERIZAR LISTA DE EQUIPOS
    // ============================================
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

    // ============================================
    // ACTUALIZAR BOTÓN GENERAR
    // ============================================
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
    // ABRIR MODAL AGREGAR EQUIPO
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

        const title = document.getElementById('add-title');
        if (title) {
            title.innerHTML = `<span class="ico-badge ico-blue" style="margin-right:10px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg></span>${isEdit ? 'Editar Equipo' : 'Nuevo Equipo'}`;
        }

        const okBtn = document.getElementById('add-ok');
        if (okBtn) {
            okBtn.innerHTML = `${ICO.check} ${isEdit ? 'Guardar' : 'Agregar'}`;
        }

        const gnd = this.config.genderMode;
        const gOpts = gnd === 'male' ? [['male', 'Masculino']] : gnd === 'female' ? [['female', 'Femenino']] : [['male', 'Masculino'], ['female', 'Femenino'], ['mixed', 'Mixto']];
        const gSel = ex ? ex.gender : gOpts[0][0];
        const go = gOpts.map(([v, l]) => `<option value="${v}"${v === gSel ? ' selected' : ''}>${l}</option>`).join('');

        const ic = 'w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:border-blue-500 outline-none bg-white';
        const lc = 'display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px';

        const avUp = (pid, ep, isV) => {
            return `<div style="display:flex;align-items:center;gap:12px">
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
        };

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
<label style="${lc}">ELO</label>
<input type="number" id="ap-r${i}" class="${ic} text-center" min="0" max="9999" placeholder="0" value="${p.ranking || ''}">
</div>
</div>
</div>
</div>`;
        }

        const tn = ex?.name || '';
        const body = document.getElementById('add-body');
        if (body) {
            body.innerHTML = `<div><label style="${lc}">Logo Equipo</label>${avUp('team', ex?.photo || null, ex?.isVideo || false)}</div>
<div><label style="${lc}">Nombre del Equipo (opcional)</label><input id="ap-teamname" class="${ic}" placeholder="Ej: Los Ases" value="${Sanitizer.attribute(tn && !tn.includes('/') ? tn : '')}"></div>
<div><label style="${lc}">Categoría</label><select id="ap-category" class="${ic}">${catOpts}</select></div>
${playersHtml}
<label class="flex items-center gap-2 cursor-pointer pt-1">
<input type="checkbox" id="ap-seed" class="w-4 h-4 accent-yellow-500"${ex?.seed ? ' checked' : ''}>
<span class="text-sm text-gray-700">${ICO.star} Cabeza de serie</span>
</label>`;
        }

        const modal = document.getElementById('m-add');
        if (modal) modal.style.display = 'flex';
        
        setTimeout(() => {
            const firstInput = document.getElementById('ap-p0');
            if (firstInput) firstInput.focus();
        }, 100);
    },

    // ============================================
    // PREVISUALIZAR AVATAR
    // ============================================
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
                const b64c = canvas.toDataURL('image/jpeg', .82);

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

    // ============================================
    // REMOVER AVATAR
    // ============================================
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

    // ============================================
    // CERRAR MODAL AGREGAR
    // ============================================
    closeAdd() {
        const modal = document.getElementById('m-add');
        if (modal) modal.style.display = 'none';
        this._editIdx = -1;
    },

    // ============================================
    // ENVIAR/AGREGAR EQUIPO
    // ============================================
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
                ranking: +document.getElementById(`ap-r${i}`)?.value || 0,
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

        this._save();
        this.closeAdd();
        this._renderReg();
        this._updGenBtn();
        this._toast(this._editIdx >= 0 ? `${ICO.pen} Actualizado` : `${ICO.check} Agregado`);
        this._editIdx = -1;
    },

    // ============================================
    // EDITAR EQUIPO
    // ============================================
    editTeam(idx) {
        this._editIdx = idx;
        this.openAdd(idx);
    },

    // ============================================
    // ELIMINAR EQUIPO
    // ============================================
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
        this._save();
        this._renderReg();
        this._updGenBtn();
        
        if (document.getElementById('v-dash').style.display !== 'none') {
            this._ra();
        }
        
        this._toast(`${ICO.trash} Eliminado`);
    },

    // ============================================
    // BORRAR TODOS LOS EQUIPOS
    // ============================================
    clearAll() {
        if (!confirm('¿Eliminar todos los equipos?')) return;
        this.teams = [];
        this._save();
        this._renderReg();
        this._updGenBtn();
    },

    // ============================================
    // ABRIR AUTO-LLENAR
    // ============================================
    openAutoFill() {
        if (!this.config) {
            this._toast('⚠️ Primero configura el torneo');
            return;
        }

        const hint = document.getElementById('af-hint');
        if (hint) {
            hint.textContent = `Agrega equipos ficticios. Tienes ${this.teams.filter(t => !t.isBye).length}.`;
        }

        const count = document.getElementById('af-count');
        if (count) {
            count.value = Math.max(this.teams.filter(t => !t.isBye).length + 4, 8);
        }

        const modal = document.getElementById('m-autofill');
        if (modal) modal.style.display = 'flex';

        setTimeout(() => {
            const input = document.getElementById('af-count');
            if (input) {
                input.focus();
                input.select();
            }
        }, 150);
    },

    // ============================================
    // CERRAR AUTO-LLENAR
    // ============================================
    closeAutoFill() {
        const modal = document.getElementById('m-autofill');
        if (modal) modal.style.display = 'none';
    },

    // ============================================
    // EJECUTAR AUTO-LLENAR
    // ============================================
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
                    ranking: Math.floor(Math.random() * 2000) + 500,
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
                        ranking: Math.floor(Math.random() * 2000) + 500,
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
                this._save();
                this._renderReg();
                this._updGenBtn();
                this._toast(`✅ ${need} equipos agregados`);
            }
        };

        createBatch();
    },

    // ============================================
    // CALCULAR DURACIÓN DEL TORNEO
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
                case 'elimination':
                    totalMatches = numTeams - 1;
                    break;
                case 'league':
                    totalMatches = (numTeams * (numTeams - 1)) / 2;
                    break;
                case 'groups':
                    const nG = numTeams <= 8 ? 2 : numTeams <= 12 ? 3 : numTeams <= 16 ? 4 : Math.ceil(numTeams / 4);
                    const pg = Math.floor(numTeams / nG);
                    totalMatches = (nG * (pg * (pg - 1)) / 2) + Math.max(nG, 4);
                    break;
                case 'americano':
                    totalMatches = (numTeams - 1) * Math.floor(numTeams / 2);
                    break;
                case 'mexicano':
                    totalMatches = numTeams * 3;
                    break;
                case 'swiss':
                    totalMatches = numTeams * (Math.ceil(Math.log2(numTeams)) + 1) / 2;
                    break;
                case 'custom':
                    totalMatches = 3 * Math.floor(numTeams / 2);
                    break;
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
                    html += `<div class="calendar-day active" style="font-size:10px">${cur.getDate()}</div>`;
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
    // PADDING A POTENCIA DE 2
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

    // ============================================
    // GENERAR ELIMINACIÓN DIRECTA
    // ============================================
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

    // ============================================
    // GENERAR LIGA
    // ============================================
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

    // ============================================
    // GENERAR GRUPOS
    // ============================================
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
    // PERSISTENCIA
    // ============================================
    _save() {
        const data = {
            n: this.tourName,
            c: this.config,
            t: this.teams,
            m: this.matches
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

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    _toast(msg, dur = 2200) {
        const el = document.getElementById('toast');
        if (!el) return;
        
        el.innerHTML = msg;
        el.classList.add('show');
        clearTimeout(this._ti);
        this._ti = setTimeout(() => el.classList.remove('show'), dur);
    },

    // ============================================
    // LOADER DE GENERACIÓN
    // ============================================
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
                ['Set', this.config.setType === 'short' ? 'Short(4)' : this.config.setType === 'pro' ? 'Pro(8)' : this.config.setType === 'custom' ? `Custom(${this.config.gamesPerSet})` : 'Normal(6)']
            ].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#f8fafc;border-radius:10px;font-size:13px;font-weight:600"><span style="color:#64748b">${l}</span><span style="color:#1e293b">${v}</span></div>`).join('');
        }

        const confirm = document.getElementById('m-confirm');
        if (confirm) confirm.style.display = 'flex';
    },

    closeConfirm() {
        document.getElementById('m-confirm').style.display = 'none';
    },

    // ============================================
    // REINICIAR TODO
    // ============================================
    resetAll() {
        if (!confirm('¿Reiniciar todo? Se perderán todos los datos.')) return;
        this._stopBanner();
        VersionedStorage.clear();
        this.tourName = 'Torneo Pádel';
        this.config = null;
        this.teams = [];
        this.matches = [];
        this.tourLogo = null;
        document.getElementById('tour-name').textContent = 'Torneo Pádel';
        document.getElementById('hdr-sub').textContent = 'Configura y genera tu torneo';
        this.sv('config');
        this._toast('Torneo reiniciado');
    }
};

// ============================================
// INICIALIZAR APLICACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Exportar app globalmente
window.app = app;
