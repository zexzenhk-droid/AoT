/* ============================================================
   AOT ENGENHEIRO — aplicação
   ============================================================ */
'use strict';

const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

const store = {
  get(k,d){ try{ const v=localStorage.getItem('aot_'+k); return v===null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem('aot_'+k,JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem('aot_'+k); }catch(e){} }
};

/* ---------- estado ---------- */
const S = {
  nome: store.get('nome',''),
  tratamento: store.get('tratamento','tu'),
  persona: store.get('persona','militar'),
  aviaoId: store.get('aviao','p51'),
  nacao: 'eua',
  // [v2.0] Sistema de Patentes Autênticas
  patente: store.get('patente','second-lieutenant'),
  nacao_militar: store.get('nacao_militar','USAAF'),
  callSign: store.get('callSign',''),
  // [v2.0] Sistema de Missões & Mapas
  missaoId: store.get('missaoId','hunt-trains'),
  tipoMissaoV2: store.get('tipoMissaoV2','single-mission'),
  mapaId: store.get('mapaId','smolensk-1943'),
  clima: store.get('clima','clear'),
  armamento: store.get('armamento',{}),
  voz: store.get('voz',true),
  radio: store.get('radio',false),
  volRadio: store.get('volRadio',35),
   vozVel: store.get('vozVel',100),
  vozTom: store.get('vozTom',100),
  vozVol: store.get('vozVol',100),
  bindings: store.get('bindings',null) || JSON.parse(JSON.stringify(BINDINGS_OMISSAO)),
  missao: store.get('missao',{mapa:'bretanha',hora:'dia',meteo:'limpo',combustivel:false}),
  tipoMissao: store.get('tipoMissao','cacar'),
  tema: store.get('tema','cockpit'),
  volMusica: store.get('volMusica',55),
  musVoo: store.get('musVoo',true),
  discVoo: store.get('discVoo',35),
  modoDiscricao: store.get('modoDiscricao','so_baixar'),
  estiloBotoes: store.get('estiloBotoes','moderno'), // 'antigo' | 'moderno' // 'so_baixar' | 'baixar_ate_desligar' | 'so_desligar'
  playlist: store.get('playlist','auto'),
  aleatorio: store.get('aleatorio',true),
  ecra: 'scSplash',
  idioma: store.get('idioma','pt-PT'),
  vozEngenheiro: store.get('vozEngenheiro', store.get('idioma','pt-PT')),
  eng: null
};

/* ---------- voz ----------
   O Android devolve a voz pt-PT por omissão, que costuma ser feminina.
   Damos ao utilizador a escolha e tentamos adivinhar uma masculina. */
const Voz = {
  vozes:[], escolhida:null,

  /* heurística: nomes que costumam indicar voz masculina */
  ehMasculina(v){
    const n=(v.name||'').toLowerCase();
    if(/female|feminin|mulher|woman/.test(n)) return false;
    if(/male|masculin|homem/.test(n)) return true;
    if(/joaquim|duarte|ricardo|antonio|antónio|daniel|felipe|joao|joão|cristiano|carlos|paulo|miguel/.test(n)) return true;
    if(/joana|ines|inês|catarina|maria|fernanda|francisca|luciana|vitoria|vitória/.test(n)) return false;
    return null; // desconhecido
  },

  init(){
    if(!('speechSynthesis' in window)) return;
    const carregar=()=>{
      const todas=speechSynthesis.getVoices();
      if(!todas.length) return;
      // prioridade: pt-PT → pt-* → resto
      this.vozes = todas.filter(v=>/^pt/i.test(v.lang))
                        .sort((a,b)=>(/pt[-_]PT/i.test(b.lang)?1:0)-(/pt[-_]PT/i.test(a.lang)?1:0));
      if(!this.vozes.length) this.vozes = todas;

      const guardada = store.get('vozNome',null);
      this.escolhida = this.vozes.find(v=>v.name===guardada)
        || this.vozes.find(v=>this.ehMasculina(v)===true)   // prefere masculina
        || this.vozes[0] || null;
      preencherSelVoz();
    };
    carregar();
    speechSynthesis.onvoiceschanged = carregar;
  },

  definir(nome){
    this.escolhida = this.vozes.find(v=>v.name===nome) || this.escolhida;
    store.set('vozNome', this.escolhida ? this.escolhida.name : null);
  },

  diz(t){
  if(!S.voz || !t) return;
  const vozAtual = S.vozEngenheiro;

  if(window.PiperTTS && window.PiperTTS.temVoz(vozAtual)){
    document.getElementById('btCalar')?.classList.add('on');
    window.PiperTTS.falar(t, vozAtual).then(ok=>{
      document.getElementById('btCalar')?.classList.remove('on');
      if(!ok) this.dizSistema(t);
    });
    return;
  }
  this.dizSistema(t);
},

dizSistema(t){
  if(!S.voz || !t || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);
  u.onstart = ()=>document.getElementById('btCalar')?.classList.add('on');
  u.onend   = ()=>document.getElementById('btCalar')?.classList.remove('on');
  u.onerror = ()=>document.getElementById('btCalar')?.classList.remove('on');
  u.lang = vozDoIdioma();
  u.volume = (S.vozVol||100)/100;
  const base = PERSONALIDADES[S.persona]?.voz || {rate:1.12, pitch:1.0};
  u.rate  = base.rate  * (S.vozVel/100);
  u.pitch = base.pitch * (S.vozTom/100);
  if(this.escolhida) u.voice=this.escolhida;
  speechSynthesis.speak(u);
},
  para(){
    try{ speechSynthesis.cancel(); }catch(e){}
    document.getElementById('btCalar')?.classList.remove('on');
  }
};

function preencherSelVoz(){
  const s=$('#selVoz'); if(!s) return;
  if(!Voz.vozes.length){ s.innerHTML='<option>Sem vozes disponíveis</option>'; return; }
  s.innerHTML = Voz.vozes.map(v=>{
    const g=Voz.ehMasculina(v);
    const et = g===true?' ♂':(g===false?' ♀':'');
    const sel = Voz.escolhida && v.name===Voz.escolhida.name ? ' selected':'';
    return `<option value="${v.name}"${sel}>${v.name}${et} · ${v.lang}</option>`;
  }).join('');
}
function preencherSelVozEngenheiro(){
  const s = $('#selVozEngenheiro'); if(!s || !window.PiperTTS) return;
  s.innerHTML = window.PiperTTS.listaParaMenu().map(v=>{
    const sel = v.codigo===S.vozEngenheiro ? ' selected':'';
    return `<option value="${v.codigo}"${sel}>${v.nome}</option>`;
  }).join('');
}

$('#selVozEngenheiro')?.addEventListener('change', e=>{
  S.vozEngenheiro = e.target.value;
  store.set('vozEngenheiro', S.vozEngenheiro);
});
/* ============================================================
   REGISTO DAS CONVERSAS
   Guarda por sessão, em localStorage. Máx. 20 sessões.
   ============================================================ */
const Log = {
  sessao: null,

  novaSessao(aviao, missao){
    this.sessao = {
      id: Date.now(),
      data: new Date().toISOString(),
      piloto: S.nome,
      engenheiro: PERSONALIDADES[S.persona].nome,
      aviao: aviao ? aviao.nome : '—',
      mapa: missao ? (mapaPorId(missao.mapa)?.nome || '—') : '—',
      linhas: []
    };
  },

  add(quem, texto){
    if(!this.sessao) this.novaSessao(porId(S.aviaoId), S.missao);
    this.sessao.linhas.push({ q:quem, t:texto, h:Date.now() });
    this.guardar();
  },

  guardar(){
    if(!this.sessao || !this.sessao.linhas.length) return;
    const todas = store.get('log', []);
    const i = todas.findIndex(s => s.id === this.sessao.id);
    if(i >= 0) todas[i] = this.sessao; else todas.push(this.sessao);
    while(todas.length > 20) todas.shift();
    store.set('log', todas);
  },

  todas(){ return store.get('log', []); },
  limpar(){ store.del('log'); this.sessao = null; },

  texto(){
    return this.todas().map(s => {
      const d = new Date(s.data);
      const cab = `═══ ${d.toLocaleDateString('pt-PT')} ${d.toLocaleTimeString('pt-PT')} ═══\n`
        + `Piloto: ${s.piloto} · Engenheiro: ${s.engenheiro}\n`
        + `Avião: ${s.aviao} · Mapa: ${s.mapa}\n`;
      const cp = s.linhas.map(l => {
        const hh = new Date(l.h).toLocaleTimeString('pt-PT');
        return `[${hh}] ${l.q==='p' ? s.piloto : s.engenheiro}: ${l.t}`;
      }).join("\n");
      return cab + cp;
    }).join("\n\n");
  }
};

/* ---------- toast ---------- */
let tT;
function toast(m,warn){
  const el=$('#toast'); el.textContent=m;
  el.classList.toggle('warn',!!warn); el.classList.add('on');
  clearTimeout(tT); tT=setTimeout(()=>el.classList.remove('on'),3000);
}

/* ---------- navegação ----------
   Cada ecrã sabe para onde voltar. O botão físico "voltar" do
   Android segue esta cadeia em vez de fechar a app. */
const ANTERIOR = {
  scRegisto:'scSplash', scHangar:'scSplash',
  scMissao:'scHangar',  scVoo:'scMissao',
  scEsquemas:'scDefs', scEsquemaEditor:'scDefs'
};

function ir(id, semHistorico){
  Voz.para();                     // muda de ecrã → cala o engenheiro
  $$('.screen').forEach(s=>s.classList.remove('on'));
  $('#'+id).classList.add('on');
  S.ecra = id;
  /* empurra um estado para o histórico do browser, para o botão
     "voltar" ser capturado por nós em vez de sair da app */
  if(!semHistorico){
    try{ history.pushState({ecra:id}, '', ''); }catch(e){}
  }
  if(id==='scVoo'){
    if(S.modoDiscricao==='so_desligar'){
      Radio.pararMusica(); mostrarFaixa(null);
    } else {
      Radio.modoVoo();                       // corta estática, música fica baixa
      Radio.aplicarVolume();                 // garante que a discrição em voo é aplicada já
      if(S.radio && !Radio.musica.el) Radio.tocarMusica(Radio.era);
      mostrarFaixa(S.radio ? Radio.musica.atual : null);
    }
  }
  else if(S.radio){
    Radio.modoMenu(id==='scHangar'?'hangar':'radio');
    if(S.modoDiscricao==='baixar_ate_desligar') Radio.aplicarVolume(); // mantém baixo mesmo fora do cockpit
  }
}
$$('[data-volta]').forEach(b=>b.onclick=()=>ir(b.dataset.volta));
/* botões presentes em todos os ecrãs */
$$('[data-home]').forEach(b=>b.onclick=()=>{ Voz.para(); ir('scSplash'); });
$$('[data-defs]').forEach(b=>b.onclick=()=>abrirDefs());

/* ============================================================
   1. SPLASH
   ============================================================ */
$('#btIniciar').onclick = ()=>{
  Voz.init();
  if(S.radio){ Radio.definirVolume(S.volRadio/100); Radio.modoMenu('radio'); }
  if(S.nome){ abrirHangar(); } else { ir('scRegisto'); }
};

/* ============================================================
   2. REGISTO
   ============================================================ */
$$('#optTrat .opt').forEach(b=>b.onclick=()=>{
  $$('#optTrat .opt').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); S.tratamento=b.dataset.t;
});
$$('#optPersona .opt').forEach(b=>b.onclick=()=>{
  $$('#optPersona .opt').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); S.persona=b.dataset.p;
});
$('#btRegistar').onclick = ()=>{
  const n=$('#inNome').value.trim().replace(/^comandante\s+/i,'');
  if(!n){ $('#errNome').textContent='Diz-me como te chamas.'; return; }
  S.nome=n; store.set('nome',n);
  store.set('tratamento',S.tratamento); store.set('persona',S.persona);
  abrirHangar();
};

/* ============================================================
   3. HANGAR
   ============================================================ */
function abrirHangar(){
  $('#hgSaud').textContent = S.tratamento==='comandante'
    ? `Comandante ${S.nome}` : `Olá, ${S.nome}`;
  renderChips(); renderCarrossel();
  ir('scHangar');
}

function renderChips(){
  const c=$('#chipsNacao');
  c.innerHTML = Object.entries(NACOES).map(([k,v])=>
    `<button class="chip ${k===S.nacao?'on':''}" data-n="${k}">${v.flag} ${v.nome}</button>`).join('');
  $$('.chip',c).forEach(b=>b.onclick=()=>{
    S.nacao=b.dataset.n;
    $$('.chip',c).forEach(x=>x.classList.remove('on')); b.classList.add('on');
    renderCarrossel();
  });
}

function renderCarrossel(){
  const lista = porNacao(S.nacao);
  const car = $('#carousel');
  car.innerHTML = lista.map(a=>{
    const u = unidadeDe(a.id);
    const kt = u.u==='kt';
    return `
    <div class="plane" data-id="${a.id}" data-wiki="${a.wiki}">
      <img class="ph" src="img/${a.id}.jpg" alt="${a.nome}" loading="lazy">
      <div class="bd">
        <div class="nm">${a.nome}</div>
        <div class="fam">${a.familia} · ${a.era}</div>
        <div class="grid">
          <span class="k">Fabricante</span><span class="v">${a.fabricante}</span>
          <span class="k">Tipo</span><span class="v">${PAPEIS[a.role].pt}</span>
          <span class="k">Tripulação</span><span class="v">${a.tripulacao===1?'1 (piloto)':a.tripulacao+' membros'}</span>
          <span class="k">Mostrador</span><span class="v">${UNIDADES[u.u].sim}</span>
        </div>
        <div class="badges">
          <span class="bdg ${ESTILOS[a.estilo].classe}">${ESTILOS[a.estilo].ic} ${ESTILOS[a.estilo].nome}</span>
          <span class="bdg ${a.std?'b-std':'b-dlx'}">${a.std?'Standard':'Deluxe'}</span>
          ${kt?'<span class="bdg b-kt">⚠ nós</span>':''}
        </div>
        <div class="wikihint">🔗 toca para abrir a wiki</div>
      </div>
    </div>`;
  }).join('');

  // selecção por scroll
  const obs = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){
      $$('.plane',car).forEach(p=>p.classList.remove('sel'));
      e.target.classList.add('sel');
      S.aviaoId = e.target.dataset.id;
    }});
  },{root:car,threshold:0.6});
  $$('.plane',car).forEach(p=>{
    obs.observe(p);
    /* Toque no cartão:
       — se não estiver centrado, centra-o (é assim que se escolhe)
       — se já estiver seleccionado, abre a wiki */
    p.onclick=()=>{
      if(p.classList.contains('sel')){
        const u=p.dataset.wiki;
        if(u){ window.open(u,'_blank','noopener'); toast('🔗 A abrir a wiki…'); }
      } else {
        p.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
      }
    };
  });
  const idx = lista.findIndex(a=>a.id===S.aviaoId);
  if(idx>=0) setTimeout(()=>$$('.plane',car)[idx]?.scrollIntoView({inline:'center',block:'nearest'}),60);
  else if(lista.length){ S.aviaoId=lista[0].id; $$('.plane',car)[0]?.classList.add('sel'); }
}

$('#btConfirmar').onclick = ()=>{
  store.set('aviao',S.aviaoId);
  Radio.ajustarEra(porId(S.aviaoId));
  abrirMissao();
};

/* ============================================================
   4. MISSÃO
   ============================================================ */
function abrirMissao(){
  const sel=$('#selMapa');
  sel.innerHTML = MAPAS.map(m=>`<option value="${m.id}">${nomeMapa(m.id)} · ${m.ano}</option>`).join('');
  sel.value = S.missao.mapa;
  $('#optHora').innerHTML = HORAS.map(h=>
    `<button class="opt ${h.id===S.missao.hora?'on':''}" data-h="${h.id}"><b>${h.ic} ${nomeHora(h.id)}</b></button>`).join('');
  $('#optMeteo').innerHTML = METEO.map(w=>
    `<button class="opt ${w.id===S.missao.meteo?'on':''}" data-w="${w.id}"><b>${w.ic} ${nomeMeteo(w.id)}</b></button>`).join('');
  $$('#optComb .opt').forEach(b=>b.classList.toggle('on', (b.dataset.c==='1')===!!S.missao.combustivel));

  sel.onchange = ()=>{ S.missao.mapa=sel.value; actMissao(); };
  $$('#optHora .opt').forEach(b=>b.onclick=()=>{
    $$('#optHora .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    S.missao.hora=b.dataset.h; actMissao(); });
  $$('#optMeteo .opt').forEach(b=>b.onclick=()=>{
    $$('#optMeteo .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    S.missao.meteo=b.dataset.w; actMissao(); });
  $$('#optComb .opt').forEach(b=>b.onclick=()=>{
    $$('#optComb .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    S.missao.combustivel = b.dataset.c==='1'; actMissao(); });

  actMissao(); ir('scMissao');
}

function actMissao(){
  store.set('missao',S.missao);
  const av = porId(S.aviaoId);
  const m  = mapaPorId(S.missao.mapa);
  const h  = HORAS.find(x=>x.id===S.missao.hora);
  const w  = METEO.find(x=>x.id===S.missao.meteo);
  const c  = S.missao.combustivel ? COMBUSTIVEL.ligado : COMBUSTIVEL.desligado;
  const aval = avaliarCombinacao(S.missao.mapa, av);

  $('#mapaInfo').innerHTML =
    `<b>${m.teatro}</b> · ${m.contexto}\n\n${aval?aval.ecra:''}\n\n<i style="color:var(--dim)">💡 ${m.facto}</i>`;
  $('#ttHora').textContent  = h.tatica;
  $('#ttMeteo').textContent = w.tatica;
  $('#ttComb').textContent  = c.conselho;

  renderArmamento();

  const b = briefingMissao(S.missao, av);
  $('#briefTxt').textContent = b ? b.ecra : '';
  $('#btOuvirBrief').onclick = ()=> b && Voz.diz(b.voz);
}

$('#btParaVoo').onclick = ()=>{ abrirVoo(); };

/* ---------- aviões ideais para a missão ---------- */
function abrirIdeais(){
  const m = mapaPorId(S.missao.mapa);
  const atual = porId(S.aviaoId);
  const ideais = m.recomendados.map(porId).filter(Boolean);
  $('#ttIdeais').textContent = `Ideais para ${m.nome}`;
  $('#subIdeais').textContent = ideais.some(a=>a.id===S.aviaoId)
    ? `O teu ${atual.nome} já é uma boa escolha. Podes trocar por outro destes.`
    : `O ${atual.nome} não é o ideal aqui. Estes dão-se melhor:`;
  $('#listaIdeais').innerHTML = ideais.map(a=>`
    <button class="ideal ${a.id===S.aviaoId?'atual':''}" data-id="${a.id}">
      <img src="img/${a.id}.jpg" alt="${a.nome}" loading="lazy">
      <span class="in">
        <b>${NACOES[a.nacao].flag} ${a.nome}</b>
        <small>${ESTILOS[a.estilo].ic} ${ESTILOS[a.estilo].nome} · ${a.std?'Standard':'Deluxe'}</small>
      </span>
      <span class="mk">${a.id===S.aviaoId?'✓':'›'}</span>
    </button>`).join('');
  $$('#listaIdeais .ideal').forEach(b=>b.onclick=()=>{
    trocarAviao(b.dataset.id);
    $('#modalIdeais').classList.remove('on');
  });
  $('#modalIdeais').classList.add('on');
}
function trocarAviao(id){
  const a = porId(id); if(!a) return;
  S.aviaoId = id; S.nacao = a.nacao;
  store.set('aviao', id);
  Radio.ajustarEra(a);
  if(S.eng) S.eng.aviao = a;
  actMissao();
  toast(`✈️ ${a.nome}`);
}
/* ---------- armamento no ecrã de missão ---------- */
function renderArmamento(){
  const cont = $('#optTipoMissao'); if(!cont) return;
  cont.innerHTML = Object.entries(CARGA_POR_MISSAO).map(([k,v])=>
    `<button class="opt ${k===S.tipoMissao?'on':''}" data-tm="${k}"><b>${v.nome}</b></button>`).join('');
  $$('#optTipoMissao .opt').forEach(b=>b.onclick=()=>{
    $$('#optTipoMissao .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    S.tipoMissao=b.dataset.tm; store.set('tipoMissao',S.tipoMissao); actArmamento();
  });
  actArmamento();
}
function actArmamento(){
  const av=porId(S.aviaoId);
  const c=REGRAS_CINTOS.porAviao[av.id];
  const m=CARGA_POR_MISSAO[S.tipoMissao] || CARGA_POR_MISSAO.cacar;
  let t = `Armamento: ${c ? c.arma : '—'}\n`;
  if(c && c.rec!=='—') t += `Cinto: ${c.rec}${c.alt!=='—'?`  (alt.: ${c.alt})`:''}\n${c.porque}\n\n`;
  else if(c) t += `${c.porque}\n\n`;
  t += `Carga: ${m.conselho}\n${m.porque}`;
  $('#armaInfo').textContent = t;
}
$('#btCalar').onclick = ()=>{ Voz.para(); toast('Fala interrompida'); };
$('#btIdeais').onclick = abrirIdeais;
$('#btFecharIdeais').onclick = ()=>$('#modalIdeais').classList.remove('on');
$('#btVerTodos').onclick = ()=>{ $('#modalIdeais').classList.remove('on'); abrirHangar(); };

/* ============================================================
   5. COCKPIT
   ============================================================ */
const ACOES = [
  {t:'🛫 Descolar',    m:'vamos descolar'},
  {t:'❓ Qual a tecla?', m:'qual é a tecla?'},
  {t:'🎯 Armamento',   m:'que armamento levo?'},
  {t:'📖 Sobre o avião', m:'conta-me algo sobre este avião'},
  {t:'⚔️ Tácticas',    m:'que tácticas uso?'},
  {t:'📐 Unidades',    m:'que unidades tem o mostrador?'},
  {t:'🛬 Aterrar',     m:'vamos aterrar'},
  {t:'🔥 Na cauda!',   m:'tenho um na cauda'},
  {t:'📻 Rádio',       m:'liga o rádio'},
  {t:'⏭ Mudar faixa',  m:'muda de faixa'}
];

function abrirVoo(){
  const av = porId(S.aviaoId);
  S.eng = new Engenheiro({
    piloto:S.nome, tratamento:S.tratamento, persona:S.persona,
    aviao:av, bindings:S.bindings, missao:S.missao
  });
  Log.novaSessao(av, S.missao);
  $('#vooAviao').textContent = `${NACOES[av.nacao].flag} ${av.nome}`;
  $('#vooFase').textContent  = t('emTerra');
  $('#chat').innerHTML='';
  $('#acoesRapidas').innerHTML = ACOES.map(a=>
    `<button class="acao" data-m="${a.m}">${a.t}</button>`).join('');
  $$('.acao').forEach(b=>b.onclick=()=>enviar(b.dataset.m));

  $('#radioBar').classList.remove('hide');
  mostrarFaixa(S.radio ? Radio.musica.atual : null);

  // saudação + aviso de unidades
  const s = S.eng.saudar();
  msgEng(s.ecra); Voz.diz(s.voz);
  const aviso = avisoUnidade(av.id);
  if(aviso && aviso.critico){
    setTimeout(()=>{ msgEng(`⚠️ ${aviso.ecra}`,'aviso');
      setTimeout(()=>Voz.diz(aviso.voz),400); },1400);
  }
  ir('scVoo');
}

function msg(txt, quem, cls){
  const d=document.createElement('div');
  d.className='msg '+(cls||quem);
  d.innerHTML=`<div class="quem">${quem==='eng'?(S.eng?S.eng.persona.nome:'Engenheiro'):S.nome||'Piloto'}</div>${txt}`;
  $('#chat').appendChild(d);
  $('#chat').scrollTop = $('#chat').scrollHeight;
}
const msgEng=(t,c)=>{ msg(t,'eng',c); Log.add('e',t); };
const msgPil=(t)=>{ msg(t,'pil');       Log.add('p',t); };

function enviar(texto){
  if(!texto || !S.eng) return;
  msgPil(texto);
  const r = S.eng.ouvir(texto);
  setTimeout(()=>{
    msgEng(r.ecra);
    Voz.diz(r.voz);
    $('#vooFase').textContent = {
      terra: t('emTerra'), descolagem: t('aDescolar'), subida: t('emSubida'),
  cruzeiro: t('emCruzeiro'), aproximacao: t('aproximacao'), combate: t('emCombate')
    }[S.eng.fase] || S.eng.fase;
    if(r.accao==='MIC_ON')  ligarEscuta(true);
    if(r.accao==='MIC_OFF') ligarEscuta(false);
    if(r.accao==='TROCAR_PERSONA'){ S.persona=r.persona; store.set('persona',r.persona); }
    if(r.accao==='TROCAR_AVIAO' && r.aviaoId){
      trocarAviao(r.aviaoId);
      const av=porId(r.aviaoId);
      if(Log.sessao) Log.sessao.aviao = av.nome;   // mesma sessão, avião novo
      $('#vooAviao').textContent = `${NACOES[av.nacao].flag} ${av.nome}`;
      const w=avisoUnidade(av.id);
      if(w && w.critico) setTimeout(()=>msgEng(`⚠️ ${w.ecra}`,'aviso'),500);
    }
    if(r.accao==='ABRIR_HANGAR') setTimeout(abrirHangar,700);
    if(r.accao==='RADIO_ON'){
      radioLigar(true, r.era);
      setTimeout(()=>{
        const f=Radio.musica.atual;
        if(f){ msgEng(`📻 ${f.t} — ${f.a}`); Voz.diz(`A tocar ${f.t}.`); }
      }, 900);
    }
    if(r.accao==='RADIO_OFF') radioLigar(false);
    if(r.accao==='RADIO_PROX'){
      if(!S.radio) radioLigar(true);
      else Radio.proximaFaixa();
      setTimeout(()=>{
        const f=Radio.musica.atual;
        if(f){ msgEng(`📻 ${f.t} — ${f.a}`); Voz.diz(f.t); mostrarFaixa(f); }
      }, 700);
    }
    if(r.accao==='RADIO_INFO'){
      const f=Radio.musica.atual;
      if(f){ msgEng(`📻 ${f.t}\n${f.a}`); Voz.diz(`${f.t}. ${f.a}.`); }
      else { msgEng('O rádio está desligado.'); Voz.diz('O rádio está desligado.'); }
    }
  },260);
}

/* ---------- reconhecimento de voz ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec=null, aOuvir=false, escutaCont=false, premido=false;

function initSR(){
  if(!SR){ $('#estadoMic').textContent='Voz não suportada — usa o teclado ⌨️'; return; }
 rec=new SR(); rec.lang=vozDoIdioma(); rec.continuous=false; rec.interimResults=false;
  rec.onstart = ()=>{ aOuvir=true; $('#btFalar').classList.add('grav');
    $('#estadoMic').textContent='A ouvir…'; };
  rec.onresult = e=>{ const t=e.results[0][0].transcript; if(t) enviar(t); };
  rec.onerror = e=>{
    if(e.error==='not-allowed'){ toast('Permissão do microfone negada',true);
      $('#estadoMic').textContent='Sem acesso ao microfone'; escutaCont=false;
      $('#btEscuta').classList.remove('on'); }
  };
  rec.onend = ()=>{
    aOuvir=false; $('#btFalar').classList.remove('grav');
    $('#estadoMic').textContent = escutaCont?'🎙️ Escuta contínua':'Toca e mantém para falar';
    // reinício com atraso — evita o ciclo que gastava bateria no v16
    if(escutaCont && !premido) setTimeout(()=>{ if(escutaCont&&!aOuvir) try{rec.start();}catch(e){} },700);
  };
}
function comecar(){ if(rec&&!aOuvir){ Voz.para(); try{rec.start();}catch(e){} } }
function parar(){ if(rec&&aOuvir) try{rec.stop();}catch(e){} }

function ligarEscuta(on){
  escutaCont=on;
  $('#btEscuta').classList.toggle('on',on);
  if(on){ comecar(); toast('🎙️ Escuta contínua ligada'); }
  else { parar(); toast('Escuta desligada'); }
  $('#estadoMic').textContent = on?'🎙️ Escuta contínua':'Toca e mantém para falar';
}
$('#btEscuta').onclick = ()=>ligarEscuta(!escutaCont);

/* premir-e-falar */
const bf=$('#btFalar');
const dn=e=>{ e.preventDefault(); premido=true; comecar(); };
const up=e=>{ e.preventDefault(); premido=false; setTimeout(parar,220); };
bf.addEventListener('touchstart',dn,{passive:false});
bf.addEventListener('touchend',up,{passive:false});
bf.addEventListener('mousedown',dn);
bf.addEventListener('mouseup',up);
bf.addEventListener('mouseleave',()=>{ if(premido){premido=false;parar();} });

/* teclado */
$('#btTeclado').onclick = ()=>{
  const z=$('#zonaTeclado'); z.classList.toggle('hide');
  $('#btTeclado').classList.toggle('on',!z.classList.contains('hide'));
  if(!z.classList.contains('hide')) $('#inTexto').focus();
};
const envTxt=()=>{ const v=$('#inTexto').value.trim(); if(v){ enviar(v); $('#inTexto').value=''; } };
$('#btEnviar').onclick = envTxt;
$('#inTexto').addEventListener('keydown',e=>{ if(e.key==='Enter') envTxt(); });

$('#btUnidades').onclick = ()=>window.open('unidades.html','_blank');

/* ============================================================
   DEFINIÇÕES
   ============================================================ */
function abrirDefs(){
  $$('#defPersona .opt').forEach(b=>b.classList.toggle('on',b.dataset.p===S.persona));
  $$('#defTrat .opt').forEach(b=>b.classList.toggle('on',b.dataset.t===S.tratamento));
  $('#defNome').value=S.nome;
  $('#swVoz').checked=S.voz; $('#swRadio').checked=S.radio;
  $('#volRadio').value=S.volRadio;
 $('#vozVel').value=S.vozVel; $('#vlVel').textContent=S.vozVel+'%';
$('#vozTom').value=S.vozTom; $('#vlTom').textContent=S.vozTom+'%';
$('#vozVol').value=S.vozVol; $('#vlVol').textContent=S.vozVol+'%';
  $('#vlRadio').textContent=S.volRadio+'%';
  $('#volMusica').value=S.volMusica; $('#vlMusica').textContent=S.volMusica+'%';
  $('#swMusVoo').checked=S.musVoo;
  $('#volDisc').value=S.discVoo; $('#vlDisc').textContent=S.discVoo+'%';
  renderModoDiscricao();
  const si=$('#selIdioma');
  if(si) si.innerHTML=Object.entries(IDIOMAS).map(([k,v])=>
    `<option value="${k}" ${k===S.idioma?'selected':''}>${v.bandeira} ${v.nome}</option>`).join('');
  renderTemas(); renderPlaylists();
  renderEstiloBotoes();
  preencherSelVozEngenheiro();
  mostrarFaixa(Radio.musica.atual);
  // [v2.0] Renderizar novos seletores
  renderSeletorPatentes();
  renderSeletorMissoes();
  renderSeletorMapas();
  mostrarRecomendacaoArmamento();
  $('#modalDefs').classList.add('on');
}
$('#selVoz')?.addEventListener('change',e=>{ Voz.definir(e.target.value); });
$('#vozVel')?.addEventListener('input',e=>{
  S.vozVel=+e.target.value; store.set('vozVel',S.vozVel);
  $('#vlVel').textContent=S.vozVel+'%';
});
$('#vozTom')?.addEventListener('input',e=>{
  S.vozTom=+e.target.value; store.set('vozTom',S.vozTom);
  $('#vlTom').textContent=S.vozTom+'%';
});
$('#vozVol')?.addEventListener('input',e=>{
  S.vozVol=+e.target.value; store.set('vozVol',S.vozVol);
  $('#vlVol').textContent=S.vozVol+'%';
});

/* ---------- registo ---------- */
$('#btAjudaVoz')?.addEventListener('click',()=>{
  $('#modalDefs').classList.remove('on');
  $('#modalVoz').classList.add('on');
});
$('#btFecharVoz')?.addEventListener('click',()=>$('#modalVoz').classList.remove('on'));
$('#btComoAtualizar')?.addEventListener('click',()=>abrirModalUpdate());
$('#btFecharUpdate')?.addEventListener('click',()=>$('#modalUpdate').classList.remove('on'));

$('#btManual')?.addEventListener('click',()=>window.open('manual.html','_blank'));
$('#selIdioma')?.addEventListener('change',e=>{
  S.idioma=e.target.value; store.set('idioma',S.idioma);
  aplicarIdioma(S.idioma);
  /* re-renderiza componentes dinâmicos com nova tradução */
  try { renderTemas(); } catch(e){}
  try { abrirMissao(); } catch(e){}
  try { if(window.Esquemas) window.Esquemas.aplicarAtivoEmS(); } catch(e){}
  /* actualiza motor de voz */
  if (rec) { try { rec.stop(); } catch(e){} rec.lang = vozDoIdioma(); }

  if(window.PiperTTS && window.PiperTTS.temVoz(S.idioma)){
    S.vozEngenheiro = S.idioma;
    store.set('vozEngenheiro', S.idioma);
    preencherSelVozEngenheiro();
    toast(`${IDIOMAS[S.idioma].bandeira} ${IDIOMAS[S.idioma].nome} · 🎙️ voz atualizada para ${window.PiperTTS.nomes[S.idioma]}`);
  } else {
    toast(`${IDIOMAS[S.idioma].bandeira} ${IDIOMAS[S.idioma].nome}`);
  }
});

$('#btLog').onclick=()=>{
  const todas=Log.todas();
  $('#logInfo').textContent = todas.length
    ? `${todas.length} sessão(ões) guardada(s). Mais recentes primeiro.`
    : '';
  $('#listaLog').innerHTML = todas.length ? todas.slice().reverse().map(s=>{
    const d=new Date(s.data);
    return `<div class="logses">
      <h4>${d.toLocaleDateString('pt-PT')} ${d.toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})}
           · ${s.aviao} · ${s.mapa}</h4>
      ${s.linhas.map(l=>`<div class="logln ${l.q}">
        <span class="h">${new Date(l.h).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})}</span>
        <b>${l.q==='p'?s.piloto:s.engenheiro}:</b> ${l.t.replace(/\n/g,' ')}</div>`).join('')}
    </div>`;
  }).join('') : '<p class="logvaz">Ainda não há conversas registadas.</p>';
  $('#modalDefs').classList.remove('on');
  $('#modalLog').classList.add('on');
};
$('#btFecharLog').onclick=()=>$('#modalLog').classList.remove('on');
$('#btExportarLog').onclick=()=>{
  const t=Log.texto();
  if(!t){ toast('Nada para exportar',true); return; }
  const b=new Blob([t],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);
  a.download=`aot-engenheiro-${new Date().toISOString().slice(0,10)}.txt`;
  a.click(); URL.revokeObjectURL(a.href);
  toast('Registo exportado');
};
$('#btLimparLog').onclick=()=>{
  if(confirm('Apagar todo o registo?')){ Log.limpar(); $('#btLog').click(); toast('Registo apagado'); }
};
$('#btTestarVoz')?.addEventListener('click',()=>{
  const p = PERSONALIDADES[S.persona];
  const antes = S.voz; S.voz = true;
  Voz.diz(`${p.saudacao[0]} Trem em cima. Triângulo.`);
  S.voz = antes || true;
});
$('#btFecharDefs').onclick=()=>$('#modalDefs').classList.remove('on');

$$('#defPersona .opt').forEach(b=>b.onclick=()=>{
  $$('#defPersona .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  S.persona=b.dataset.p; store.set('persona',S.persona);
  if(S.eng){ S.eng.persona=PERSONALIDADES[S.persona]; toast('Engenheiro: '+S.eng.persona.nome); }
});
$$('#defTrat .opt').forEach(b=>b.onclick=()=>{
  $$('#defTrat .opt').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  S.tratamento=b.dataset.t; store.set('tratamento',S.tratamento);
  if(S.eng) S.eng.tratamento=S.tratamento;
});
$('#defNome').addEventListener('input',e=>{
  S.nome=e.target.value.trim(); store.set('nome',S.nome); if(S.eng) S.eng.piloto=S.nome;
});
$('#swVoz').onchange=e=>{ S.voz=e.target.checked; store.set('voz',S.voz); if(!S.voz) Voz.para(); };
/* ============================================================
   RÁDIO — controlos visíveis + comandos de voz
   ============================================================ */
/* ---------- modo de discrição da música em voo ---------- */
const MODOS_DISCRICAO = [
  {id:'so_baixar',          nome:'Só baixar',           desc:'Baixa o volume no cockpit; volta ao normal fora dele'},
  {id:'baixar_ate_desligar',nome:'Baixar até desligar', desc:'Fica baixo mesmo fora do cockpit, até desligares o rádio'},
  {id:'so_desligar',        nome:'Só desligar',         desc:'Desliga por completo ao entrar no cockpit'}
];
function renderModoDiscricao(){
  let c = $('#optModoDiscricao');
  if(!c){
    const ancora = $('#volDisc');
    if(!ancora) return;
    const lbl = document.createElement('label');
    lbl.className = 'lbl'; lbl.style.marginTop = '10px';
    lbl.textContent = 'Ao entrar no cockpit';
    c = document.createElement('div');
    c.id = 'optModoDiscricao';
    c.className = 'opts';
    c.style.gridTemplateColumns = '1fr';
    ancora.insertAdjacentElement('afterend', c);
    c.insertAdjacentElement('beforebegin', lbl);
  }
  c.innerHTML = MODOS_DISCRICAO.map(m=>`
    <button class="opt ${m.id===S.modoDiscricao?'on':''}" data-modo="${m.id}">
      <b>${m.nome}</b><small>${m.desc}</small>
    </button>`).join('');
  $$('#optModoDiscricao .opt').forEach(b=>b.onclick=()=>{
    S.modoDiscricao = b.dataset.modo; store.set('modoDiscricao', S.modoDiscricao);
    renderModoDiscricao();
    if(S.ecra==='scVoo') Radio.aplicarVolume();
  });
}

/* ---------- estilo dos botões: old school vs moderno ---------- */
function aplicarEstiloBotoes(){
  document.body.classList.toggle('estilo-antigo', S.estiloBotoes==='antigo');
  document.body.classList.toggle('estilo-moderno', S.estiloBotoes==='moderno');
}
function renderEstiloBotoes(){
  let c = $('#optEstiloBotoes');
  if(!c){
    const ancora = $('#optTema');
    if(!ancora) return;
    const lbl = document.createElement('label');
    lbl.className = 'lbl'; lbl.style.marginTop = '18px';
    lbl.textContent = '🔘 Estilo dos botões';
    c = document.createElement('div');
    c.id = 'optEstiloBotoes';
    c.className = 'opts';
    ancora.insertAdjacentElement('afterend', c);
    ancora.insertAdjacentElement('afterend', lbl);
  }
  c.innerHTML = `
    <button class="opt ${S.estiloBotoes==='antigo'?'on':''}" data-estilo="antigo">
      <b>🎖️ Old school</b><small>Traço de época, cantos direitos</small></button>
    <button class="opt ${S.estiloBotoes==='moderno'?'on':''}" data-estilo="moderno">
      <b>✨ Moderno</b><small>Gradiente, cantos arredondados</small></button>`;
  $$('#optEstiloBotoes .opt').forEach(b=>b.onclick=()=>{
    S.estiloBotoes = b.dataset.estilo; store.set('estiloBotoes', S.estiloBotoes);
    aplicarEstiloBotoes(); renderEstiloBotoes();
  });
}

function mostrarFaixa(f){
  // painel das definições
  const box=$('#agora');
  if(box){
    if(!f || !S.radio){ box.classList.add('hide'); }
    else {
      box.classList.remove('hide');
      $('#agTitulo').textContent = f.t || 'Faixa';
      $('#agArtista').textContent = f.a || '';
    }
  }
  // barra do cockpit
  const bar=$('#radioBar');
  if(bar){
    if(S.radio && f){
      $('#rbTitulo').textContent  = f.t || 'A tocar';
      $('#rbArtista').textContent = f.a || '';
    } else {
      $('#rbTitulo').textContent  = 'Rádio desligado';
      $('#rbArtista').textContent = 'toca em ▶ para ligar';
    }
    if(typeof actLeitor==='function') actLeitor();
  }
}
Radio.musica.aoMudar = mostrarFaixa;

/* ---------- temas ---------- */
function renderTemas(){
  const c=$('#optTema'); if(!c) return;
  const linha = ([k,tema])=>`
    <button class="temaop ${k===S.tema?'on':''}" data-tema="${k}">
      <span class="amostra" style="background:${tema.grad || tema.v['--card']};
        border-color:${tema.v['--acc']}">${tema.icone}</span>
      <span class="tn"><b>${nomeTema(k)}</b><small>${descTema(k)}</small></span>
      <span class="tick">\u2713</span>
    </button>`;
  const mods = Object.entries(TEMAS).filter(([,tema])=>tema.moderno);
  const clas = Object.entries(TEMAS).filter(([,tema])=>!tema.moderno);
  c.className = 'temalista';
  c.innerHTML =
    `<div class="grupo-lbl">${t('temaCatModernos')}</div>` + mods.map(linha).join('') +
    `<div class="grupo-lbl">${t('temaCatClassicos')} \u2014 ${t('classicos').replace(/^Cl\u00e1ssicos\s*\u2014\s*/,'')}</div>` + clas.map(linha).join('');
  $$('#optTema .temaop').forEach(b=>b.onclick=()=>{
    S.tema=b.dataset.tema; store.set('tema',S.tema);
    aplicarTema(S.tema);
    aplicarIdioma(S.idioma); renderTemas();
    toast(`${TEMAS[S.tema].icone} ${nomeTema(S.tema)}`);
  });
}

/* ---------- playlists ---------- */
function escolherFontePlaylist(fonte){
  store.set("fontePlaylist", fonte);
  renderPlaylists();
  const sel=$("#selPlaylist");
  if(sel) Radio.escolherPlaylist(sel.value);
}
function renderPlaylists(){
  const sel=$("#selPlaylist"); if(!sel) return;
  const fonte = store.get("fontePlaylist","auto");
  const btnL=$("#btFonteLocal"), btnI=$("#btFonteInternet");
  if(btnL && btnI){
    btnL.classList.toggle("on", fonte==="local");
    btnI.classList.toggle("on", fonte==="internet");
    btnL.onclick=()=>escolherFontePlaylist("local");
    btnI.onclick=()=>escolherFontePlaylist("internet");
  }
  const ls = fonte==="internet" ? Radio.playlistsInternet() : Radio.playlistsDisponiveis();
  sel.innerHTML = ls.map(p=>
    `<option value="${p.id}" ${p.id===S.playlist?'selected':''}>
       ${p.icone} ${p.nome}${p.local?' · local':''}</option>`).join('');
  const temLocais = Radio.musica.locais && Object.keys(Radio.musica.locais).length;
  const h=$('#hintAudio');
  if(h) h.innerHTML = temLocais
    ? 'A usar as tuas músicas de <code>audio/</code> — funcionam offline.'
    : 'Sem músicas locais. A usar domínio público do Internet Archive (precisa de internet).<br>Para usar as tuas: põe os MP3 em <code>audio/wwii/</code> e lista-os em <code>audio/playlists.json</code>.';
}

/* liga/desliga a partir de qualquer sítio */
function radioLigar(on, era){
  S.radio = on; store.set('radio', S.radio);
  const sw=$('#swRadio'); if(sw) sw.checked = on;
  if(on){
    Radio.definirVolume(S.volRadio/100);
    Radio.definirVolumeMusica(S.volMusica/100);
    if(era && era!==Radio.era){ Radio.era=era; Radio.musica.indice=0; }
    // no cockpit não liga a estática, só a música
    if($('#scVoo').classList.contains('on')){
      Radio.emVoo = true; Radio.tocarMusica(Radio.era);
    } else {
      Radio.modoMenu('radio');
    }
    setTimeout(()=>mostrarFaixa(Radio.musica.atual), 500);
  } else {
    Radio.pararMusica(); Radio.desligarAmbiente(); mostrarFaixa(null);
  }
}

/* ---------- leitor de música (cockpit) ---------- */
function actLeitor(){
  const bar=$('#radioBar'); if(!bar) return;
  const m=Radio.musica;
  const tocando = !!(m.el && !m.pausada);
  bar.classList.toggle('on', tocando);
  $('#rbPlay').textContent = tocando ? '⏸' : '▶';
  $('#rbPlay').classList.toggle('acc', true);
  $('#rbAlea').classList.toggle('on', m.aleatorio);
  $('#rbVolTxt').textContent = S.volMusica + '%';
}

$('#rbPlay')?.addEventListener('click', ()=>{
  if(!S.radio){ radioLigar(true); }
  else if(Radio.musica.el){ Radio.pausar(); }
  else { Radio.tocarMusica(); }
  setTimeout(()=>{ mostrarFaixa(Radio.musica.atual); actLeitor(); },300);
});
$('#rbStop')?.addEventListener('click', ()=>{
  Radio.pararMusica(); mostrarFaixa(null); actLeitor(); toast('⏹ Música parada');
});
$('#rbAnt')?.addEventListener('click', ()=>{
  if(!S.radio){ radioLigar(true); return; }
  Radio.faixaAnterior();
  setTimeout(()=>{ mostrarFaixa(Radio.musica.atual); actLeitor(); },300);
});
$('#rbProx')?.addEventListener('click', ()=>{
  if(!S.radio){ radioLigar(true); return; }
  Radio.proximaFaixa();
  setTimeout(()=>{ mostrarFaixa(Radio.musica.atual); actLeitor(); },300);
});
$('#rbAlea')?.addEventListener('click', ()=>{
  const on=Radio.alternarAleatorio();
  S.aleatorio=on; store.set('aleatorio',on);
  actLeitor(); toast(on?'🔀 Aleatório':'➡️ Ordem da lista');
});
function ajustarVolMusica(d){
  S.volMusica = Math.max(0, Math.min(100, S.volMusica + d));
  store.set('volMusica', S.volMusica);
  Radio.definirVolumeMusica(S.volMusica/100);
  const r=$('#volMusica'); if(r) r.value=S.volMusica;
  const v=$('#vlMusica'); if(v) v.textContent=S.volMusica+'%';
  actLeitor();
  toast(S.volMusica ? `🔊 ${S.volMusica}%` : '🔇 Sem som');
}
$('#rbMenos')?.addEventListener('click', ()=>ajustarVolMusica(-15));
$('#rbMais') ?.addEventListener('click', ()=>ajustarVolMusica(+15));

$('#swRadio').onchange=e=>{
  S.radio=e.target.checked; store.set('radio',S.radio);
  if(S.radio){
    Radio.definirVolume(S.volRadio/100);
    Radio.modoMenu('radio');
    toast('Rádio ligado');
    setTimeout(()=>mostrarFaixa(Radio.musica.atual),600);
  } else {
    Radio.pararMusica(); Radio.desligarAmbiente(); mostrarFaixa(null);
  }
};
$('#volRadio').oninput=e=>{
  S.volRadio=+e.target.value; store.set('volRadio',S.volRadio);
  $('#vlRadio').textContent=S.volRadio+'%';
  Radio.definirVolume(S.volRadio/100);
};
$('#volMusica')?.addEventListener('input',e=>{
  S.volMusica=+e.target.value; store.set('volMusica',S.volMusica);
  $('#vlMusica').textContent=S.volMusica+'%';
  Radio.definirVolumeMusica(S.volMusica/100);
});
$('#swMusVoo')?.addEventListener('change',e=>{
  S.musVoo=e.target.checked; store.set('musVoo',S.musVoo);
  Radio.musicaEmVoo=S.musVoo;
  if(Radio.emVoo){ if(!S.musVoo) Radio.pararMusica();
    else if(S.radio && !Radio.musica.el) Radio.tocarMusica(); }
  Radio.aplicarVolume();
});
$('#volDisc')?.addEventListener('input',e=>{
  S.discVoo=+e.target.value; store.set('discVoo',S.discVoo);
  $('#vlDisc').textContent=S.discVoo+'%';
  Radio.discricaoVoo=S.discVoo/100; Radio.aplicarVolume();
});
$('#selPlaylist')?.addEventListener('change',e=>{
  S.playlist=e.target.value; store.set('playlist',S.playlist);
  Radio.escolherPlaylist(S.playlist);
  if(S.radio) setTimeout(()=>mostrarFaixa(Radio.musica.atual),400);
});
$('#btProxima')?.addEventListener('click',()=>{
  Radio.proximaFaixa();
  setTimeout(()=>mostrarFaixa(Radio.musica.atual),300);
});
$('#btVerUnidades').onclick=()=>window.open('unidades.html','_blank');
$('#btReset').onclick=()=>{
  if(confirm('Apagar tudo e recomeçar?')){
    ['nome','tratamento','persona','aviao','voz','radio','volRadio','bindings','missao','esquemas']
      .forEach(k=>store.del(k));
    location.reload();
  }
};

/* ---------- bindings ----------
   Substituído pelo esquemas.js (múltiplos esquemas). Ver js/esquemas.js. */

/* ---------- botão "voltar" do Android ----------
   Ordem: fecha modal → volta ao ecrã anterior → só no splash é que sai. */
function voltarAtras(){
  // 1. há um modal aberto? fecha-o
  const modal = $$('.modal.on')[0];
  if(modal){ modal.classList.remove('on'); return true; }
  // 2. está a falar? cala primeiro
  if($('#btCalar')?.classList.contains('on')){ Voz.para(); return true; }
  // 3. volta ao ecrã anterior
  const anterior = ANTERIOR[S.ecra];
  if(anterior){ ir(anterior, true); return true; }
  return false;   // já no splash → deixa sair
}

window.addEventListener('popstate', ()=>{
  if(voltarAtras()){
    // consumimos o "voltar": repõe o estado para continuar a apanhar o próximo
    try{ history.pushState({ecra:S.ecra}, '', ''); }catch(e){}
  } else {
    // no ecrã inicial: deixa a app fechar
    try{ history.back(); }catch(e){}
  }
});

/* Esc no teclado faz o mesmo (útil no PC) */
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') voltarAtras();
});

/* ---------- ecrã sempre ligado ---------- */
async function wake(){ try{ if('wakeLock' in navigator) await navigator.wakeLock.request('screen'); }catch(e){} }
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible') wake(); });



/* ============================================================
   SISTEMA DE VERSÃO (Fase 3)
   ------------------------------------------------------------
   - Lê version.json do servidor
   - Mostra número da versão no splash e nas definições
   - Detecta versões novas e avisa o utilizador
   ============================================================ */
const VERSAO = {
  atual: null,       // versão que a app tem carregada (do sw.js)
  servidor: null,    // versão que está no version.json
  info: null         // objecto completo do version.json

};

async function carregarVersao(){
  try {
    /* pede sempre a versão fresca ao servidor (evita cache) */
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('fetch falhou');
    VERSAO.info = await r.json();
    VERSAO.servidor = VERSAO.info.versao;

    /* a versão "atual" é a que está guardada — do último arranque */
    const guardada = store.get('versaoAtual', null);
    VERSAO.atual = guardada || VERSAO.servidor;

    /* mostra no splash e definições */
    const nomeVersao = VERSAO.info.nome || ('v' + VERSAO.servidor);
    const spSplash = document.getElementById('versaoSplash');
    const spDefs   = document.getElementById('versaoDefs');
    if (spSplash) spSplash.textContent = nomeVersao;
    if (spDefs)   spDefs.textContent   = nomeVersao;

    /* se a versão do servidor for MAIOR que a guardada, é nova! */
    if (guardada && VERSAO.servidor > guardada) {
      mostrarBannerUpdate();
    }

    /* actualiza a versão guardada só quando o utilizador realmente
       tiver a versão nova (isto acontece no próximo arranque, depois
       do service worker fazer o update) */
    store.set('versaoAtual', VERSAO.servidor);
store.set('nomeVersaoAtual', VERSAO.info?.nome || ('v' + VERSAO.servidor));
  } catch(e) {
    console.warn('Não foi possível carregar version.json:', e);
  }
}

function mostrarBannerUpdate(){
  /* toast simples com botão para abrir modal */
  const div = document.createElement('div');
  div.className = 'update-banner';
  div.style.cssText = `
    position:fixed; top:12px; left:50%; transform:translateX(-50%);
    background:var(--acc); color:#fff; padding:10px 16px;
    border-radius:12px; z-index:9999; box-shadow:0 6px 20px rgba(0,0,0,.4);
    cursor:pointer; font-weight:600; display:flex; gap:12px; align-items:center;
    max-width:90vw`;
  div.innerHTML = `
    <span>${t('updateDisponivel')} (${VERSAO.info.nome})</span>
    <span style="opacity:.85; font-weight:400; font-size:.9em">${t('updateVerDetalhes')} →</span>`;
  div.onclick = ()=>{
  try {
    div.style.display = 'none';
    abrirModalUpdate();
    setTimeout(()=>{ div.remove(); }, 500);
  } catch(e) {
    console.error('Erro ao abrir modal update:', e);
    div.remove();
  }
};
  document.body.appendChild(div);
}

function abrirModalUpdate(){
  const modal = document.getElementById('modalUpdate');
  if (!modal) return;

  /* garante que o modal está no <body> (não dentro de outro modal) */
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  modal.style.zIndex = '10000';
  modal.style.opacity = '1';

  /* preenche os números */
  const nomeGuardada = store.get('nomeVersaoAtual') || ('v' + (store.get('versaoAtual') || VERSAO.servidor));
const nomeServidor = VERSAO.info?.nome || ('v' + VERSAO.servidor);
  const spA = document.getElementById('updateVersaoAtual');
  const spN = document.getElementById('updateVersaoNova');
  if (spA) spA.textContent = nomeGuardada;
  if (spN) spN.textContent = nomeServidor;

  /* novidades no idioma actual */
  const nov = document.getElementById('updateNovidades');
  if (nov && VERSAO.info?.novidades) {
    const idi = idiomaActual();
    const texto = VERSAO.info.novidades[idi]
               || VERSAO.info.novidades['pt-PT']
               || '';
    nov.innerHTML = texto ? `<b>📋 ${nomeServidor}</b><br>${texto}` : '';
    nov.style.display = texto ? 'block' : 'none';
  }

  modal.classList.add('on');
}
/* ---------- arranque ---------- */
(function(){
  try{
    history.replaceState({ecra:'scSplash'}, '', '');
    history.pushState({ecra:'scSplash'}, '', '');   // estado extra: reforça o histórico para o botão físico "voltar" nunca fechar a app por engano
  }catch(e){}
  aplicarTema(S.tema);                       // tema guardado
  aplicarEstiloBotoes();                     // estilo de botões guardado
  aplicarIdioma(S.idioma);                   // idioma guardado
  carregarVersao();
  Radio.volMusica   = S.volMusica/100;
  Radio.musicaEmVoo = S.musVoo;
  Radio.discricaoVoo= S.discVoo/100;
  Radio.musica.playlist = S.playlist;
  Radio.musica.aleatorio = S.aleatorio;
  Radio.carregarPlaylists().then(()=>renderPlaylists());
  Voz.init(); initSR(); wake();
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  // desbloqueia áudio/voz ao primeiro toque
  const unlock=()=>{ if('speechSynthesis' in window){
      const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u); }
    Radio.iniciar();
    document.removeEventListener('touchstart',unlock); document.removeEventListener('click',unlock); };
  document.addEventListener('touchstart',unlock,{once:true});
  document.addEventListener('click',unlock,{once:true});
})();

/* ============================================================
   [v2.0] SISTEMA DE PATENTES, MISSÕES, MAPAS E ARMAMENTO
   ============================================================ */

function renderSeletorPatentes() {
  const container = $('#seletorPatentes');
  if (!container) return;
  
  const nacoesDisponíveis = ['USAAF', 'RAF', 'LUFTWAFFE'];
  
  let html = '<div class="patentes-wrapper">';
  html += '<label>Nação Militar:</label>';
  html += '<select id="selNacao" class="sel-nacao">';
  nacoesDisponíveis.forEach(nacao => {
    const sel = S.nacao_militar === nacao ? ' selected' : '';
    html += `<option value="${nacao}"${sel}>${nacao === 'USAAF' ? 'USA (USAAF)' : nacao === 'RAF' ? 'Reino Unido (RAF)' : 'Alemanha (Luftwaffe)'}</option>`;
  });
  html += '</select>';
  
  html += '<label>Patente:</label>';
  html += '<select id="selPatente" class="sel-patente">';
  const ranks = getAllRanksByFaction(S.nacao_militar);
  Object.keys(ranks).forEach(rankId => {
    const rank = ranks[rankId];
    const sel = S.patente === rankId ? ' selected' : '';
    html += `<option value="${rankId}"${sel}>${rank.rank} (${rank.portugu})</option>`;
  });
  html += '</select>';
  
  html += '<div class="callsign-display">';
  html += `<strong>Call Sign:</strong> <span id="displayCallSign">${S.callSign || 'Pendente'}</span>`;
  html += '</div>';
  html += '</div>';
  container.innerHTML = html;
  
  $('#selNacao')?.addEventListener('change', (e) => {
    S.nacao_militar = e.target.value;
    store.set('nacao_militar', S.nacao_militar);
    renderSeletorPatentes();
  });
  
  $('#selPatente')?.addEventListener('change', (e) => {
    S.patente = e.target.value;
    store.set('patente', S.patente);
    const rankData = getRankByFaction(S.nacao_militar, S.patente);
    if (rankData) {
      S.callSign = generateCallSign(rankData, 1);
      store.set('callSign', S.callSign);
    }
    $('#displayCallSign').textContent = S.callSign;
  });
}

function renderSeletorMissoes() {
  const container = $('#seletorMissoes');
  if (!container) return;
  
  let html = '<div class="missoes-wrapper">';
  html += '<label>Tipo de Missão:</label>';
  html += '<select id="selTipoMissao" class="sel-tipo-missao">';
  html += '<option value="single-mission"' + (S.tipoMissaoV2 === 'single-mission' ? ' selected' : '') + '>Single Mission</option>';
  html += '<option value="war-tale"' + (S.tipoMissaoV2 === 'war-tale' ? ' selected' : '') + '>War Tale</option>';
  html += '<option value="custom-battle"' + (S.tipoMissaoV2 === 'custom-battle' ? ' selected' : '') + '>Custom Battle</option>';
  html += '<option value="test-flight"' + (S.tipoMissaoV2 === 'test-flight' ? ' selected' : '') + '>Test Flight</option>';
  html += '</select>';
  
  html += '<label>Missão:</label>';
  html += '<select id="selMissao" class="sel-missao">';
  
  if (S.tipoMissaoV2 === 'single-mission' && typeof singleMissions !== 'undefined') {
    Object.keys(singleMissions).forEach(missaoId => {
      const missao = singleMissions[missaoId];
      const sel = S.missaoId === missaoId ? ' selected' : '';
      html += `<option value="${missaoId}"${sel}>${missao.name}</option>`;
    });
  } else if (S.tipoMissaoV2 === 'war-tale' && typeof warTales !== 'undefined') {
    Object.keys(warTales).forEach(taleId => {
      const tale = warTales[taleId];
      const sel = S.missaoId === taleId ? ' selected' : '';
      html += `<option value="${taleId}"${sel}>${tale.name}</option>`;
    });
  } else if (S.tipoMissaoV2 === 'custom-battle' && typeof customBattles !== 'undefined') {
    Object.keys(customBattles).forEach(battleId => {
      const battle = customBattles[battleId];
      const sel = S.missaoId === battleId ? ' selected' : '';
      html += `<option value="${battleId}"${sel}>${battle.name}</option>`;
    });
  } else {
    html += `<option value="test-flight" selected>Free Flight</option>`;
  }
  html += '</select>';
  
  html += '<div class="missao-briefing">';
  const missao = S.tipoMissaoV2 === 'single-mission' && typeof singleMissions !== 'undefined' ? singleMissions[S.missaoId] :
                 S.tipoMissaoV2 === 'war-tale' && typeof warTales !== 'undefined' ? warTales[S.missaoId] :
                 S.tipoMissaoV2 === 'custom-battle' && typeof customBattles !== 'undefined' ? customBattles[S.missaoId] :
                 (typeof testFlight !== 'undefined' ? testFlight : null);
  
  if (missao) {
    html += `<h4>${missao.name || 'Test Flight'}</h4>`;
    html += `<p>${missao.briefing || missao.description || 'Free flight mode - no objectives'}</p>`;
    if (missao.difficulty) html += `<p><strong>Dificuldade:</strong> ${missao.difficulty}</p>`;
    if (missao.date) html += `<p><strong>Data:</strong> ${missao.date}</p>`;
  }
  html += '</div>';
  html += '</div>';
  container.innerHTML = html;
  
  $('#selTipoMissao')?.addEventListener('change', (e) => {
    S.tipoMissaoV2 = e.target.value;
    store.set('tipoMissaoV2', S.tipoMissaoV2);
    renderSeletorMissoes();
  });
  
  $('#selMissao')?.addEventListener('change', (e) => {
    S.missaoId = e.target.value;
    store.set('missaoId', S.missaoId);
    renderSeletorMissoes();
  });
}

function renderSeletorMapas() {
  const container = $('#seletorMapas');
  if (!container) return;
  
  let html = '<div class="mapas-wrapper">';
  html += '<label>Mapa:</label>';
  html += '<select id="selMapa" class="sel-mapa">';
  if (typeof mapasGameData !== 'undefined') {
    Object.keys(mapasGameData).forEach(mapaId => {
      const mapa = mapasGameData[mapaId];
      const sel = S.mapaId === mapaId ? ' selected' : '';
      html += `<option value="${mapaId}"${sel}>${mapa.name} (${mapa.region})</option>`;
    });
  }
  html += '</select>';
  
  html += '<label>Condição Meteorológica:</label>';
  html += '<select id="selClima" class="sel-clima">';
  if (typeof weatherConditions !== 'undefined') {
    Object.keys(weatherConditions).forEach(climaId => {
      const clima = weatherConditions[climaId];
      const sel = S.clima === climaId ? ' selected' : '';
      html += `<option value="${climaId}"${sel}>${clima.name}</option>`;
    });
  }
  html += '</select>';
  
  html += '<div class="mapa-info">';
  const mapa = typeof mapasGameData !== 'undefined' ? mapasGameData[S.mapaId] : null;
  const clima = typeof weatherConditions !== 'undefined' ? weatherConditions[S.clima] : null;
  
  if (mapa) {
    html += `<h4>${mapa.name}</h4>`;
    html += `<p><strong>Região:</strong> ${mapa.region}</p>`;
    html += `<p><strong>Data Histórica:</strong> ${mapa.date}</p>`;
    html += `<p><strong>Tamanho do Mapa:</strong> ${mapa.mapSize}</p>`;
  }
  
  if (clima) {
    html += `<p><strong>Clima:</strong> ${clima.name} - Visibilidade: ${clima.visibility}</p>`;
    html += `<p><strong>Teto:</strong> ${clima.ceiling} | <strong>Vento:</strong> ${clima.windEffect}</p>`;
  }
  
  html += '</div>';
  html += '</div>';
  container.innerHTML = html;
  
  $('#selMapa')?.addEventListener('change', (e) => {
    S.mapaId = e.target.value;
    store.set('mapaId', S.mapaId);
    renderSeletorMapas();
  });
  
  $('#selClima')?.addEventListener('change', (e) => {
    S.clima = e.target.value;
    store.set('clima', S.clima);
    renderSeletorMapas();
  });
}

function mostrarRecomendacaoArmamento() {
  const container = $('#recomendacaoArmamento');
  if (!container) return;
  
  const missao = S.tipoMissaoV2 === 'single-mission' && typeof singleMissions !== 'undefined' ? singleMissions[S.missaoId] :
                 S.tipoMissaoV2 === 'war-tale' && typeof warTales !== 'undefined' ? warTales[S.missaoId] : null;
  
  if (!missao || !missao.recommendedArmament) {
    container.innerHTML = '<p>Sem recomendações de armamento para este tipo de missão.</p>';
    return;
  }
  
  const rec = missao.recommendedArmament;
  let html = '<div class="armamento-recomendado">';
  html += '<h4>Recomendação de Armamento</h4>';
  html += `<p><strong>Primário:</strong> ${rec.primary}</p>`;
  html += `<p><strong>Secundário:</strong> ${rec.secondary}</p>`;
  html += `<p><strong>Tática:</strong> ${rec.recommendation}</p>`;
  html += '</div>';
  
  container.innerHTML = html;
}

