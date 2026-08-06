/* ============================================================
   AOT ENGENHEIRO — Temas visuais
   Paletas inspiradas nos teatros de operações do jogo
   ------------------------------------------------------------
   Nomes e descrições traduzidos via i18n:
     tema_<id>       → nome
     tema_<id>_desc  → descrição
   ============================================================ */

const TEMAS = {
  /* ══════════ MODERNOS — fundo gradiente, cartões suaves ══════════ */
  moderno1: {
    nome:"Moderno Índigo", icone:"🔮", moderno:true,
    desc:"Gradiente azul-violeta, cartões suaves",
    grad:"radial-gradient(1200px 800px at 15% -10%, #1e1b52 0%, transparent 55%),"+
         "radial-gradient(900px 700px at 100% 0%, #2a1a4d 0%, transparent 50%),"+
         "linear-gradient(180deg, #0f1020 0%, #08080f 100%)",
    v:{
      '--bg':'#0b0b18', '--bg2':'#12122a',
      '--card':'#191a33', '--card2':'#22234a', '--line':'#2e3060',
      '--txt':'#eceafd', '--muted':'#9a98c4', '--dim':'#6c6a96',
      '--acc':'#7c6cff', '--acc2':'#5a4ae3', '--acc3':'#241f52',
      '--amber':'#ffb84d', '--red':'#ff6b8a', '--blue':'#5ec8ff',
      '--r':'18px'
    }
  },
  moderno2: {
    nome:"Moderno Turquesa", icone:"💎", moderno:true,
    desc:"Azul-petróleo com brilho ciano",
    grad:"radial-gradient(1100px 800px at 85% -5%, #0d3d4d 0%, transparent 55%),"+
         "radial-gradient(800px 600px at 0% 20%, #10284a 0%, transparent 50%),"+
         "linear-gradient(180deg, #071018 0%, #050a10 100%)",
    v:{
      '--bg':'#060d14', '--bg2':'#0c1620',
      '--card':'#111f2b', '--card2':'#17293a', '--line':'#223d52',
      '--txt':'#e3f2f7', '--muted':'#8aa9bb', '--dim':'#5f7d8f',
      '--acc':'#22d3ee', '--acc2':'#0e93ad', '--acc3':'#0a3542',
      '--amber':'#fbbf47', '--red':'#ff7085', '--blue':'#67e8f9',
      '--r':'18px'
    }
  },
  moderno3: {
    nome:"Moderno Carmim", icone:"🌹", moderno:true,
    desc:"Escuro com acento vermelho-rosado",
    grad:"radial-gradient(1000px 700px at 10% -5%, #3d1030 0%, transparent 55%),"+
         "radial-gradient(900px 700px at 95% 10%, #2a1030 0%, transparent 50%),"+
         "linear-gradient(180deg, #14080f 0%, #0a0508 100%)",
    v:{
      '--bg':'#0d060a', '--bg2':'#160c13',
      '--card':'#1f1119', '--card2':'#2a1722', '--line':'#3f2233',
      '--txt':'#f6e9f0', '--muted':'#bb92a6', '--dim':'#8a6b7c',
      '--acc':'#ff5f7e', '--acc2':'#c9354f', '--acc3':'#3d1421',
      '--amber':'#ffb057', '--red':'#ff4d6d', '--blue':'#8fb6ff',
      '--r':'18px'
    }
  },

  /* ══════════ CLÁSSICOS — inspirados no jogo ══════════ */
  cockpit: {
    nome:"Cockpit", icone:"🎛️",
    desc:"Verde fosforescente dos instrumentos nocturnos",
    v:{
      '--bg':'#0a100e', '--bg2':'#0d1614',
      '--card':'#152220', '--card2':'#1b2b28', '--line':'#26403a',
      '--txt':'#dfeae6', '--muted':'#7f9a92', '--dim':'#5c7269',
      '--acc':'#39d98a', '--acc2':'#1f8f5c', '--acc3':'#0f3a2a',
      '--amber':'#ffb020', '--red':'#ff5555', '--blue':'#7dd3fc',
      '--r':'14px'
    }
  },
  luftwaffe: {
    nome:"Luftwaffe", icone:"🇩🇪",
    desc:"Cinzento-azulado e amarelo do Bf 109",
    v:{
      '--bg':'#0d1114', '--bg2':'#11171b',
      '--card':'#182026', '--card2':'#1f2930', '--line':'#2e3d47',
      '--txt':'#dde5ea', '--muted':'#8b9aa5', '--dim':'#63727d',
      '--acc':'#ffc845', '--acc2':'#b8860b', '--acc3':'#3d2f0a',
      '--amber':'#ff9d3c', '--red':'#e05252', '--blue':'#8ab4d8'
    }
  },
  pacifico: {
    nome:"Pacífico", icone:"🌊",
    desc:"Azul-marinho da aviação naval americana",
    v:{
      '--bg':'#080e16', '--bg2':'#0b131d',
      '--card':'#101c2a', '--card2':'#152436', '--line':'#22384f',
      '--txt':'#dae6f2', '--muted':'#7d94ab', '--dim':'#5a6f84',
      '--acc':'#4db8ff', '--acc2':'#1a6ba8', '--acc3':'#0d2c45',
      '--amber':'#ffb84d', '--red':'#ff6b6b', '--blue':'#8fd4ff'
    }
  },
  desert: {
    nome:"Deserto", icone:"🏜️",
    desc:"Areia e ocre da campanha do Norte de África",
    v:{
      '--bg':'#12100c', '--bg2':'#181510',
      '--card':'#221d15', '--card2':'#2c261c', '--line':'#453a29',
      '--txt':'#ede4d3', '--muted':'#a89880', '--dim':'#7d705d',
      '--acc':'#e8a33d', '--acc2':'#a86f1c', '--acc3':'#3d2a0d',
      '--amber':'#ffcc66', '--red':'#e06666', '--blue':'#9cb8c9'
    }
  },
  wwi: {
    nome:"Grande Guerra", icone:"🎖️",
    desc:"Sépia e vermelho do Barão Vermelho",
    v:{
      '--bg':'#120e0d', '--bg2':'#181312',
      '--card':'#231a18', '--card2':'#2e2320', '--line':'#4a3630',
      '--txt':'#ece0d8', '--muted':'#a89086', '--dim':'#7d6a62',
      '--acc':'#d4703f', '--acc2':'#9c4a22', '--acc3':'#3d1f10',
      '--amber':'#e8a866', '--red':'#d94f3d', '--blue':'#a39c8f'
    }
  }
};

/* Os clássicos não têm --r nem gradiente: herdam os valores base */
for (const t of Object.values(TEMAS)) if (!t.v['--r']) t.v['--r'] = '14px';

/* ------------------------------------------------------------
   Helpers de tradução — usam i18n se estiver disponível,
   caso contrário caem para o nome/desc em PT
------------------------------------------------------------ */
function nomeTema(id) {
  const tema = TEMAS[id];
  if (!tema) return '';
  if (typeof t === 'function') {
    const traduzido = t('tema_' + id);
    if (traduzido && traduzido !== 'tema_' + id) return traduzido;
  }
  return tema.nome;
}

function descTema(id) {
  const tema = TEMAS[id];
  if (!tema) return '';
  if (typeof t === 'function') {
    const traduzido = t('tema_' + id + '_desc');
    if (traduzido && traduzido !== 'tema_' + id + '_desc') return traduzido;
  }
  return tema.desc;
}

function aplicarTema(id) {
  const tema = TEMAS[id] || TEMAS.cockpit;
  const r = document.documentElement;
  for (const [k, v] of Object.entries(tema.v)) r.style.setProperty(k, v);

  /* fundo com gradiente nos temas modernos, cor lisa nos clássicos */
  document.body.style.background = tema.grad || tema.v['--bg'];
  document.body.style.backgroundAttachment = tema.grad ? 'fixed' : '';
  document.documentElement.classList.toggle('t-moderno', !!tema.moderno);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema.v['--bg']);
  return tema;
}
