/* ============================================================
   AOT ENGENHEIRO — Rádio de época (estilo GTA)
   ------------------------------------------------------------
   Três camadas:
     1. Ambiente  — gerado ao vivo com Web Audio API (sem ficheiros)
     2. Locutor   — voz TTS filtrada para soar a rádio de válvulas
     3. Música    — faixas de domínio público (opcional, ver notas)
   ============================================================ */
'use strict';

const Radio = {
  ctx:null, ligado:false, volume:0.35,
  nos:{},            // nós de áudio activos
  era:"wwii",        // "wwii" | "wwi"
  timerLocutor:null,

  /* ---------- arranque ---------- */
  iniciar() {
    /* BUG CORRIGIDO: antes fazia "return" sem valor quando o contexto já
       existia, o que devolvia undefined e cancelava tudo a seguir. */
    if (this.ctx) {
      // o browser suspende o áudio até haver interacção do utilizador
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  },

  /* ---------- 1. AMBIENTE (gerado, sem ficheiros) ---------- */

  /* Ruído rosa em loop = estática de rádio */
  _criarEstatica(nivel = 0.06) {
    const ctx = this.ctx, dur = 3;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    // ruído rosa aproximado (mais natural que branco)
    let b0=0,b1=0,b2=0;
    for (let i=0;i<d.length;i++){
      const w = Math.random()*2-1;
      b0 = 0.99765*b0 + w*0.0990460;
      b1 = 0.96300*b1 + w*0.2965164;
      b2 = 0.57000*b2 + w*1.0526913;
      d[i] = (b0+b1+b2+w*0.1848) * 0.15;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const g = ctx.createGain(); g.gain.value = nivel;
    // filtro passa-banda: soa a altifalante pequeno
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 1400; bp.Q.value = 0.7;
    src.connect(bp).connect(g);
    src.start();
    return { src, gain:g, out:g };
  },

  /* Zumbido de 50 Hz — a corrente eléctrica da época */
  _criarZumbido(nivel = 0.02) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine"; osc.frequency.value = 50;
    const g = ctx.createGain(); g.gain.value = nivel;
    osc.connect(g); osc.start();
    return { osc, gain:g, out:g };
  },

  /* Motor de avião: duas ondas dente-de-serra ligeiramente desafinadas */
  _criarMotor(rpmBase = 42, nivel = 0.05) {
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = nivel;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 320;
    const oscs = [];
    [rpmBase, rpmBase*1.005, rpmBase*2.02].forEach((f,i) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth"; o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = i===2 ? 0.35 : 1;
      o.connect(og).connect(lp); o.start();
      oscs.push(o);
    });
    lp.connect(g);
    return { oscs, gain:g, lp, out:g };
  },

  /* ---------- controlo do ambiente ---------- */
  ligarAmbiente(perfil = "hangar") {
    if (!this.iniciar()) return false;
    this.desligarAmbiente();
    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = this.volume;
    master.connect(ctx.destination);
    this.nos.master = master;

    if (perfil === "hangar" || perfil === "radio") {
      this.nos.estatica = this._criarEstatica(perfil === "radio" ? 0.05 : 0.03);
      this.nos.estatica.out.connect(master);
      this.nos.zumbido = this._criarZumbido(0.015);
      this.nos.zumbido.out.connect(master);
    }
    if (perfil === "hangar") {
      this.nos.motor = this._criarMotor(38, 0.035);
      this.nos.motor.out.connect(master);
    }
    this.ligado = true;
    return true;
  },

  desligarAmbiente() {
    Object.values(this.nos).forEach(n => {
      try {
        if (n.src) n.src.stop();
        if (n.osc) n.osc.stop();
        if (n.oscs) n.oscs.forEach(o => o.stop());
        if (n.disconnect) n.disconnect();
      } catch(e) {}
    });
    this.nos = {};
    this.ligado = false;
    clearInterval(this.timerLocutor);
  },

  definirVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.nos.master) this.nos.master.gain.value = this.volume;
    if (this.musica && this.musica.el) this.musica.el.volume = Math.min(1, this.factorMusica());
  },

  /* ---------- 2. LOCUTOR ---------- */

  /* Ruído de sintonização antes de falar */
  tocarSintonia(dur = 0.7) {
    if (!this.iniciar()) return;
    const ctx = this.ctx, t0 = ctx.currentTime;
    const st = this._criarEstatica(0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.9, t0 + 0.05);
    g.gain.setValueAtTime(0.9, t0 + dur - 0.15);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    // varrimento de frequência = "a procurar estação"
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = 8;
    bp.frequency.setValueAtTime(500, t0);
    bp.frequency.exponentialRampToValueAtTime(2600, t0 + dur);
    st.out.connect(bp).connect(g).connect(ctx.destination);
    setTimeout(() => { try { st.src.stop(); } catch(e){} }, dur*1000 + 100);
  },

  /* Fala com voz de rádio: TTS + estática por baixo.
     (o filtro passa-banda não se aplica ao TTS do browser,
      por isso simulamos com estática + volume) */
  locutor(texto, opcoes = {}) {
    if (!("speechSynthesis" in window)) return;
    const comSintonia = opcoes.sintonia !== false;
    if (comSintonia) this.tocarSintonia(0.6);

    setTimeout(() => {
      // sobe a estática enquanto o locutor fala
      let est = null;
      if (this.iniciar()) {
        est = this._criarEstatica(0.05);
        const g = this.ctx.createGain(); g.gain.value = 0.5;
        est.out.connect(g).connect(this.ctx.destination);
        est._g = g;
      }
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-PT";
      u.rate = 0.95;
      u.pitch = 0.85;          // mais grave = locutor de época
      const vs = speechSynthesis.getVoices();
      const pt = vs.find(v => /pt[-_]PT/i.test(v.lang)) || vs.find(v => /^pt/i.test(v.lang));
      if (pt) u.voice = pt;
      u.onend = () => { if (est) { try { est.src.stop(); } catch(e){} } };
      u.onerror = u.onend;
      speechSynthesis.speak(u);
    }, comSintonia ? 650 : 0);
  },

  /* ---------- 3. MÚSICA (ficheiros opcionais) ---------- */
  /* ------------------------------------------------------------
     PLAYLIST — todas as faixas verificadas em domínio público
     ------------------------------------------------------------
     WWI  : gravações originais de 1914-1920 (pré-1929 → domínio
            público nos EUA pelo Music Modernization Act)
     WWII : marchas militares. Gravações de 1901-1926 (pré-1929) e
            gravações das bandas oficiais da Marinha dos EUA, que
            são obra do governo federal e por isso domínio público.

     NOTA IMPORTANTE: swing dos anos 40 (Glenn Miller, Benny Goodman)
     NÃO é domínio público — essas gravações só entram entre 2035
     e 2040. Existem no Internet Archive mas sem licença válida.
     Por isso usei marchas militares da época, que são legais.
     ------------------------------------------------------------ */
  PLAYLIST: {
    wwi: [
      { t:"Over There",                  a:"Arthur Fields, 1917",
        u:"https://archive.org/download/SONGSOFWORLDWARI-NewTransfer/01.OverThere.mp3" },
      { t:"It's a Long, Long Way to Tipperary", a:"American Quartet, 1914",
        u:"https://archive.org/download/SONGSOFWORLDWARI-NewTransfer/02.ItsALongLongWayToTipperary.mp3" },
      { t:"Roses of Picardy",            a:"John McCormack, 1919",
        u:"https://archive.org/download/SONGSOFWORLDWARI-NewTransfer/03.RosesOfPicardy.mp3" },
      { t:"Keep the Home-Fires Burning",  a:"John McCormack, 1917",
        u:"https://archive.org/download/SONGSOFWORLDWARI-NewTransfer/06.KeepTheHomes-firesBurning.mp3" },
      { t:"Naval Reserve March",         a:"Sousa · Conway's Band, 1917",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/07.NavalReserveMarch.mp3" },
      { t:"Sabre and Spurs March",       a:"Sousa's Band, 1918",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/09.SabreAndSpursMarchmarchOfAmericanCavalry.mp3" },
      { t:"General Pershing March",      a:"Arthur Pryor's Band, 1926",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/17.GeneralPershing-March.mp3" },
      { t:"Battle of the Nations",       a:"Conway's Band, 1916",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/05.BattleOfTheNations.mp3" }
    ],
    wwii: [
      { t:"National Emblem March",       a:"US Marine Band, 1914",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/04.NationalEmblemMarch.mp3" },
      { t:"The Dauntless Battalion",     a:"Sousa's Band, 1923",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/14.TheDauntlessBattalion-March.mp3" },
      { t:"Nobles of the Mystic Shrine", a:"Sousa's Band, 1923",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/13.NoblesOfTheMysticShrine-March.mp3" },
      { t:"Repasz Band March",           a:"Arthur Pryor's Band, 1926",
        u:"https://archive.org/download/AMERICANMARCHINGBAND-Recordings1901-1926/18.RepaszBand-March.mp3" },
      { t:"Florentiner March",           a:"US Navy Band",
        u:"https://archive.org/download/WorldClassMarches/FlorentinerMarch.mp3" },
      { t:"In Storm and Sunshine",       a:"US Navy Band",
        u:"https://archive.org/download/WorldClassMarches/InStormAndSunshine.mp3" },
      { t:"March Grandioso",             a:"US Navy Band",
        u:"https://archive.org/download/WorldClassMarches/MarchGrandioso.mp3" },
      { t:"Belford's Carnival",          a:"US Navy Band",
        u:"https://archive.org/download/WorldClassMarches/BelfordsCarnival.mp3" }
    ]
  },

  musica:{ el:null, faixas:{ wwii:[], wwi:[], modern:[] }, indice:0,
           atual:null, aoMudar:null, playlist:"auto", locais:null,
           aleatorio:true, pausada:false, hist:[] },

  /* ------------------------------------------------------------
     PLAYLISTS LOCAIS — audio/playlists.json
     Se existirem ficheiros nas pastas audio/*, são usados em vez
     dos do Internet Archive (e funcionam offline).
     ------------------------------------------------------------ */
  async carregarPlaylists() {
    this.musica.locais = {};
    let j = null;
    try {
      const r = await fetch('audio/playlists.json', {cache:'no-cache'});
      if (r.ok) j = await r.json();
    } catch(e) {}

    for (const era of ['wwi','wwii','modern']) {
      const p = j && j[era];
      const nome  = (p && p.nome)  || (era==='wwi'?'Primeira Guerra':era==='wwii'?'Segunda Guerra':'Moderna');
      const icone = (p && p.icone) || (era==='wwi'?'🎖️':era==='wwii'?'✈️':'🎵');

      /* 1) faixas declaradas no JSON */
      if (p && Array.isArray(p.faixas) && p.faixas.length) {
        this.musica.locais[era] = { nome, icone,
          faixas: p.faixas.map(x => ({
            t: x.t || x.f.replace(/\.[^.]+$/,''), a: x.a || '',
            u: `audio/${era}/${encodeURIComponent(x.f)}`
          })) };
        continue;
      }

      /* 2) JSON vazio → tentar descobrir os ficheiros na pasta.
         O GitHub Pages não dá listagem de pastas, mas em muitos
         servidores (e no python -m http.server) dá. */
      const achados = await this.explorarPasta(era);
      if (achados.length) this.musica.locais[era] = { nome, icone, faixas: achados };
    }
    return Object.keys(this.musica.locais).length > 0;
  },

  /* Tenta ler o índice da pasta e extrair nomes de .mp3 */
  async explorarPasta(era) {
    try {
      const r = await fetch(`audio/${era}/`, {cache:'no-cache'});
      if (!r.ok) return [];
      const txt = await r.text();
      const nomes = new Set();
      // links href="ficheiro.mp3" (Apache, nginx, python http.server)
      for (const m of txt.matchAll(/href="([^"]+\.(?:mp3|ogg|m4a|opus))"/gi)) {
        const f = decodeURIComponent(m[1].split('/').pop());
        if (f) nomes.add(f);
      }
      return [...nomes].sort().map(f => ({
        t: f.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' '),
        a: '', u: `audio/${era}/${encodeURIComponent(f)}`
      }));
    } catch(e) { return []; }
  },

  /* Playlists disponíveis, para o menu */
  playlistsDisponiveis() {
    const L = this.musica.locais || {};
    const out = [
      { id:"auto", nome:"Automática — segue o avião", icone:"🔄" },
      { id:"mix",  nome:"Mistura — todas as eras",    icone:"🎲" }
    ];
    for (const era of ['wwi','wwii','modern']) {
      const n = this.listaDe(era).length;
      if (!n) continue;
      const local = !!(L[era] && L[era].faixas.length);
      out.push({
        id: era,
        nome: (local ? L[era].nome : (era==='wwi' ? 'Primeira Guerra' :
               era==='wwii' ? 'Segunda Guerra' : 'Moderna')) + ` (${n})`,
        icone: local ? L[era].icone : (era==='wwi' ? '🎖️' : era==='wwii' ? '✈️' : '🎵'),
        local
      });
    }
    return out;
  },
    playlistsInternet() {
    const out = [
      { id:"auto", nome:"Automatica - segue o aviao", icone:"🔄" },
      { id:"mix",  nome:"Mistura - todas as eras",    icone:"🎲" }
    ];
    for (const era of ["wwi","wwii"]) {
      const n = (this.PLAYLIST[era] || []).length;
      if (!n) continue;
      out.push({
        id: era,
        nome: (era==="wwi" ? "Primeira Guerra" : "Segunda Guerra") + " (" + n + ")",
        icone: era==="wwi" ? "🎖️" : "✈️",
        local: false
      });
    }
    return out;
  },
  escolherPlaylist(id) {
    this.musica.playlist = id;
    this.musica.indice = 0;
    if (this.musica.el) this.tocarMusica();
  },

  /* Lista efectiva: locais têm prioridade sobre o arquivo.
     "mix" junta as três eras numa só lista. */
  listaDe(era) {
    if (era === "mix") {
      return ['wwi','wwii','modern'].flatMap(e => this.listaDe(e));
    }
    const L = this.musica.locais || {};
    if (L[era] && L[era].faixas.length) return L[era].faixas;
    // compatibilidade com definirFaixas()
    const antigas = this.musica.faixas[era] || [];
    if (antigas.length) return antigas.map(u => (typeof u==="string" ? {t:"",a:"",u} : u));
    return this.PLAYLIST[era] || [];
  },

  /* Substituir por ficheiros locais, se quiseres (audio/wwii/*.mp3) */
  definirFaixas(era, lista) { this.musica.faixas[era] = lista || []; },

  tocarMusica(era) {
    /* Se o utilizador fixou uma playlist, ela manda. Só em "auto"
       é que a era segue o avião escolhido. */
    if (this.musica.playlist && this.musica.playlist !== "auto") {
      era = this.musica.playlist;
    } else {
      era = era || this.era;
    }
    const lista = this.listaDe(era);
    if (!lista.length) return false;
    this.pararMusica();

    /* aleatório: sorteia, evitando repetir a anterior */
    if (this.musica.aleatorio && lista.length > 1) {
      let n; let voltas = 0;
      do { n = Math.floor(Math.random() * lista.length); voltas++; }
      while (n === this.musica.indice && voltas < 8);
      this.musica.indice = n;
    }
    const i = ((this.musica.indice % lista.length) + lista.length) % lista.length;
    const faixa = lista[i];
    this.musica.hist.push(i);
    if (this.musica.hist.length > 30) this.musica.hist.shift();

    const el = new Audio(faixa.u);
    el.crossOrigin = "anonymous";
    el.volume = Math.min(1, this.factorMusica());
    el.onended = () => {
      if (!this.musica.aleatorio) this.musica.indice++;
      this.tocarMusica(era);
    };
    el.onerror = () => {                    // faixa em falta: salta para a seguinte
      this.musica.falhas = (this.musica.falhas || 0) + 1;
      if (this.musica.falhas > lista.length + 2) { this.musica.falhas = 0; return; }
      this.musica.indice++;
      setTimeout(()=>this.tocarMusica(era), 400);
    };
    el.onplaying = () => { this.musica.falhas = 0; };
    el.play().catch(()=>{});                // autoplay bloqueado: fica em silêncio
    this.musica.el = el;
    this.musica.atual = faixa;
    this.musica.pausada = false;
    this.era = era;
    if (typeof this.musica.aoMudar === "function") this.musica.aoMudar(faixa);
    return true;
  },

  /* ---------- transporte ---------- */
  pausar() {
    if (!this.musica.el) return false;
    if (this.musica.pausada) { this.musica.el.play().catch(()=>{}); this.musica.pausada = false; }
    else { this.musica.el.pause(); this.musica.pausada = true; }
    if (typeof this.musica.aoMudar === "function") this.musica.aoMudar(this.musica.atual);
    return !this.musica.pausada;
  },

  faixaAnterior() {
    const h = this.musica.hist;
    if (h.length > 1) { h.pop(); this.musica.indice = h.pop(); }
    else this.musica.indice--;
    const guarda = this.musica.aleatorio;
    this.musica.aleatorio = false;          // não sortear ao recuar
    const r = this.tocarMusica();
    this.musica.aleatorio = guarda;
    return r;
  },

  alternarAleatorio() {
    this.musica.aleatorio = !this.musica.aleatorio;
    return this.musica.aleatorio;
  },

  proximaFaixa() {
    if (!this.musica.aleatorio) this.musica.indice++;
    return this.tocarMusica();
  },

  pararMusica() {
    if (this.musica.el) {
      try {
        this.musica.el.onended = null; this.musica.el.onerror = null;
        this.musica.el.pause(); this.musica.el.src = "";
      } catch(e){}
      this.musica.el = null;
    }
    this.musica.atual = null;
    this.musica.pausada = false;
  },

  /* Troca automática conforme o avião escolhido (só em modo "auto") */
  ajustarEra(aviao) {
    if (this.musica.playlist && this.musica.playlist !== "auto") return;
    const nova = (aviao && aviao.era === "WWI") ? "wwi" : "wwii";
    if (nova !== this.era) {
      this.era = nova;
      this.musica.indice = 0;
      if (this.musica.el) this.tocarMusica(nova);   // só se já estava a tocar
    }
  },

  /* ------------------------------------------------------------
     MODOS
     Em voo a música continua, mas MUITO baixa e sem a estática —
     assim não tapa a voz do engenheiro nem o som do jogo.
     ------------------------------------------------------------ */
  emVoo: false,

  modoVoo() {
    this.emVoo = true;
    this.desligarAmbiente();          // corta estática e motor
    clearInterval(this.timerLocutor);
    if (!this.musicaEmVoo) this.pararMusica();
    else this.aplicarVolume();        // baixa a música, não a pára
  },

  modoMenu(perfil = "hangar") {
    this.emVoo = false;
    this.ligarAmbiente(perfil);
    if (!this.musica.el) this.tocarMusica(this.era);
    this.aplicarVolume();
  },

  /* Volume da música, independente do ambiente.
     volMusica 0..1 · em voo aplica-se ainda o factor de discrição. */
  volMusica: 0.55,
  musicaEmVoo: true,           // deixar tocar durante o voo?
  discricaoVoo: 0.35,          // quanto baixa em voo (0.35 = 35% do normal)

  factorMusica() {
    if (!this.emVoo) return this.volMusica;
    return this.musicaEmVoo ? this.volMusica * this.discricaoVoo : 0;
  },

  definirVolumeMusica(v) {
    this.volMusica = Math.max(0, Math.min(1, v));
    this.aplicarVolume();
  },

  /* Ajusta o volume de tudo de uma vez */
  aplicarVolume() {
    if (this.nos.master) this.nos.master.gain.value = this.volume;
    if (this.musica.el)  this.musica.el.volume = Math.min(1, this.factorMusica());
  }
};

/* ------------------------------------------------------------
   GUIÕES DO LOCUTOR
------------------------------------------------------------ */
const LOCUTOR_GUIOES = {
  abertura: [
    "Rádio de campanha, transmissão em curso. Boa sorte lá em cima, pilotos.",
    "Aqui é a estação de campanha. Boletim para todos os esquadrões.",
    "Transmissão a começar. Que os motores rujam e as asas aguentem."
  ],
  wwii: [
    "Boletim: formações inimigas avistadas a leste. Todos os esquadrões em prontidão.",
    "Recado da manutenção: quem trouxer o avião inteiro leva café a dobrar.",
    "Nota do comando: verifiquem o combustível antes de descolar. Não há postos lá em cima.",
    "Do hangar: se o motor sobreaquecer, abram o radiador. Não é vergonha nenhuma."
  ],
  wwi: [
    "Correio das trincheiras: o vento sopra de oeste esta manhã. Tenham-no em conta ao regressar.",
    "Do aeródromo: mantenham as máquinas leves e os olhos no sol.",
    "Aviso do comando: as máquinas do Circo Voador foram vistas neste sector."
  ],
  despedida: [
    "Fim da transmissão. Voltem inteiros.",
    "Aqui termina o boletim. Céus limpos para todos."
  ]
};

function guiaoAleatorio(cat) {
  const l = LOCUTOR_GUIOES[cat] || [];
  return l.length ? l[Math.floor(Math.random()*l.length)] : "";
}

