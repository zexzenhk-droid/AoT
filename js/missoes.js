/* ============================================================
   AOT ENGENHEIRO — Conselheiro de missões (Custom Battles)
   ------------------------------------------------------------
   O jogo pede: Mapa → Hora do dia → Meteorologia →
                Combustível limitado → Create Session
   O engenheiro aconselha cada passo em função do avião escolhido.
   ------------------------------------------------------------
   TRADUÇÃO (i18n):
     mapa_<id>            → nome do mapa
     teatro_<chave>       → nome do teatro
     hora_<id>            → nome da hora
     hora_<id>_tatica     → conselho táctico
     meteo_<id>           → nome do clima
     meteo_<id>_tatica    → conselho táctico
     comb_on / comb_off   → nome
     comb_on_cons / comb_off_cons → conselho
   ============================================================ */

/* ------------------------------------------------------------
   MAPAS
------------------------------------------------------------ */
const MAPAS = [
  /* ══════════ PACÍFICO ══════════ */
  {
    id:"oahu", nome:"Oahu (Pearl Harbor)", teatro:"Pacífico", teatroKey:"pacifico", ano:"1941",
    terreno:"ilha/naval", altitude:"baixa-média",
    contexto:"Havai. Base naval americana e as montanhas verdes de Oahu.",
    facto:"A 7 de dezembro de 1941, 353 aviões japoneses atacaram em duas vagas. Roosevelt chamou-lhe 'uma data que viverá em infâmia'.",
    favorece:["turn","bnz","solo"],
    conselho:"Muito alvo naval e terrestre. O relevo das montanhas serve de cobertura em fuga.",
    recomendados:["a6m3","p40","d4y3","sbd","f4u"]
  },
  {
    id:"midway", nome:"Midway", teatro:"Pacífico", teatroKey:"pacifico", ano:"1942",
    terreno:"oceânico", altitude:"variável",
    contexto:"Atol perdido no Pacífico. Mar por todos os lados.",
    facto:"A 4 de junho de 1942, bombardeiros de picada americanos afundaram quatro porta-aviões japoneses em cerca de seis minutos. Foi a viragem da guerra no Pacífico.",
    favorece:["turn","solo"],
    conselho:"Mar aberto: sem referências no solo e sem sítio para aterrar de emergência. Vigia o combustível a sério.",
    recomendados:["a6m3","f4u","sbd","sb2c","p40"]
  },
  {
    id:"iwojima", nome:"Iwo Jima", teatro:"Pacífico", teatroKey:"pacifico", ano:"1945",
    terreno:"ilha vulcânica", altitude:"baixa",
    contexto:"Ilha de cinza negra dominada pelo monte Suribachi.",
    facto:"A fotografia do içar da bandeira em Suribachi tornou-se a imagem mais reproduzida da guerra do Pacífico. A batalha durou 36 dias.",
    favorece:["solo","bnz"],
    conselho:"Ilha pequena, muito alvo no solo e defesa antiaérea pesada. Não circules sobre o alvo.",
    recomendados:["f4u","p47","sb2c","j2m2","d4y3"]
  },
  {
    id:"saipan", nome:"Saipan", teatro:"Pacífico", teatroKey:"pacifico", ano:"1944",
    terreno:"ilha/naval", altitude:"média",
    contexto:"Ilha das Marianas, com aeródromos disputados e mar em redor.",
    facto:"A batalha aérea sobre as Marianas ficou conhecida como 'o tiro aos perus': os americanos abateram centenas de aviões japoneses em poucas horas.",
    favorece:["bnz","solo"],
    conselho:"Combate misto, ar e solo. Bom sítio para caças pesados americanos.",
    recomendados:["f4u","p47","sb2c","a6m3","j2m2"]
  },
  {
    id:"peleliu", nome:"Peleliu", teatro:"Pacífico", teatroKey:"pacifico", ano:"1944",
    terreno:"ilha", altitude:"baixa-média",
    contexto:"Ilha pequena e montanhosa, com pista de aviação disputada.",
    facto:"Estimavam quatro dias de combate; durou mais de dois meses. Foi das batalhas mais sangrentas do Pacífico.",
    favorece:["solo","bnz"],
    conselho:"Ilha pequena com relevo. Bom para ataque ao solo, mas o terreno esconde perseguidores.",
    recomendados:["f4u","p47","il2","typhoon","d4y3"]
  },

  /* ══════════ FRENTE ORIENTAL ══════════ */
  {
    id:"korsun", nome:"Korsun", teatro:"Frente Oriental", teatroKey:"oriental", ano:"1944",
    terreno:"planície nevada", altitude:"baixa",
    contexto:"Ucrânia no inverno. Campos abertos e neve até ao horizonte.",
    facto:"No cerco de Korsun-Shevchenkovsky, a Luftwaffe tentou abastecer por ar as tropas cercadas. Poucos conseguiram sair.",
    favorece:["turn","solo"],
    conselho:"Combate baixo sobre neve. O contraste ajuda a ver aviões — mas eles também te vêem a ti.",
    recomendados:["yak3","yak9t","la5fn","il2","bf109g","fw190"]
  },
  {
    id:"stalingrado", nome:"Estalinegrado", teatro:"Frente Oriental", teatroKey:"oriental", ano:"1942",
    terreno:"urbano/estepe", altitude:"baixa",
    contexto:"Cidade em ruínas e a estepe gelada em redor.",
    facto:"Os caças soviéticos foram concebidos para brilhar a baixa altitude — foi lá que se travou quase toda a guerra aérea no leste.",
    favorece:["turn","solo"],
    conselho:"Combate baixo. Território dos Yak e La-5. Aviões de grande altitude perdem aqui a vantagem.",
    recomendados:["yak3","yak9t","la5fn","il2","bf109f","fw190"]
  },
  {
    id:"kursk", nome:"Kursk", teatro:"Frente Oriental", teatroKey:"oriental", ano:"1943",
    terreno:"planície", altitude:"baixa-média",
    contexto:"Campos abertos da maior batalha de tanques da história.",
    facto:"Em Kursk, o Il-2 com bombas anti-tanque PTAB provou-se devastador contra as colunas blindadas alemãs.",
    favorece:["solo","turn"],
    conselho:"Terreno aberto e cheio de alvos no solo. Leva carga se a missão for de ataque.",
    recomendados:["il2","yak9t","la5fn","fw190","bf110"]
  },
  {
    id:"berlim", nome:"Berlim", teatro:"Frente Oriental", teatroKey:"oriental", ano:"1945",
    terreno:"urbano", altitude:"média-alta",
    contexto:"Céu sobre a capital do Reich nos últimos meses da guerra.",
    facto:"Em abril de 1945 a Luftwaffe já mal levantava voo por falta de combustível. Um caça alemão no ar era caça raro.",
    favorece:["bnz","energy"],
    conselho:"Mapa amplo e alto. Aviões rápidos e que subam bem dominam aqui.",
    recomendados:["p51","p47","bf109g","fw190","yak3","la5fn"]
  },

  /* ══════════ FRENTE OCIDENTAL ══════════ */
  {
    id:"bretanha", nome:"Batalha da Bretanha", teatro:"Frente Ocidental", teatroKey:"ocidental", ano:"1940",
    terreno:"costeiro", altitude:"média",
    contexto:"Falésias brancas de Dover e o Canal da Mancha, verão de 1940.",
    facto:"Churchill sobre os pilotos da RAF: 'Nunca, no campo do conflito humano, tanto foi devido por tantos a tão poucos.'",
    favorece:["turn","energy"],
    conselho:"Combate clássico a média altitude. Cuidado com o combustível se te afastares sobre o mar.",
    recomendados:["spitfireia","spitfirevb","hurricane","bf109f"]
  },
  {
    id:"pasdecalais", nome:"Pas-de-Calais", teatro:"Frente Ocidental", teatroKey:"ocidental", ano:"1943",
    terreno:"costeiro", altitude:"média",
    contexto:"O ponto mais estreito do Canal, entre França e Inglaterra.",
    facto:"Os Aliados fizeram os alemães acreditar que o desembarque seria aqui, e não na Normandia. Foi o maior embuste da guerra.",
    favorece:["bnz","energy"],
    conselho:"Travessias curtas sobre água. Bom para interceção e escolta.",
    recomendados:["spitfirevb","typhoon","fw190","bf109g","p51"]
  },
  {
    id:"normandia", nome:"Normandia", teatro:"Frente Ocidental", teatroKey:"ocidental", ano:"1944",
    terreno:"bocage/costa", altitude:"baixa-média",
    contexto:"Campos cercados por sebes altas e praias do desembarque.",
    facto:"Depois do Dia D, os Typhoon com foguetes tornaram-se o terror das colunas blindadas alemãs nas estradas normandas.",
    favorece:["solo","bnz"],
    conselho:"Muito ataque ao solo. Os caças-bombardeiros mandam aqui.",
    recomendados:["typhoon","p47","mosquito","f4u","fw190"]
  },
  {
    id:"flandres", nome:"Flandres", teatro:"Frente Ocidental", teatroKey:"ocidental", ano:"1944",
    terreno:"planície baixa", altitude:"baixa",
    contexto:"Terras baixas dos Países Baixos e da Bélgica, cortadas por canais.",
    facto:"Nos mesmos campos onde a Primeira Guerra se enterrou em trincheiras, travou-se depois a guerra aérea da Segunda.",
    favorece:["solo","bnz"],
    conselho:"Voo baixo sobre terreno plano. Bom para ataque, mau para esconder.",
    recomendados:["typhoon","mosquito","p47","fw190","bf110"]
  },

  /* ══════════ MEDITERRÂNEO ══════════ */
  {
    id:"tunis", nome:"Tunis", teatro:"Mediterrâneo", teatroKey:"mediterraneo", ano:"1943",
    terreno:"deserto/costa", altitude:"média",
    contexto:"Norte de África. Deserto, montanhas áridas e o Mediterrâneo.",
    facto:"A campanha da Tunísia terminou com a rendição de mais de 230 mil soldados do Eixo — comparável a Estalinegrado.",
    favorece:["bnz","energy"],
    conselho:"Visibilidade enorme sobre o deserto: vês tudo e és visto de longe. Altitude é decisiva.",
    recomendados:["p40","spitfirevb","bf109g","f4u","p47"]
  },

  /* ══════════ PRIMEIRA GUERRA ══════════ */
  {
    id:"wwi_frente", nome:"Frente Ocidental (WWI)", teatro:"Primeira Guerra", teatroKey:"wwi", ano:"1917-18",
    terreno:"trincheiras", altitude:"muito baixa",
    contexto:"Trincheiras, crateras e o céu dos primeiros combates aéreos.",
    facto:"Um piloto de caça em 1917 tinha uma esperança de vida média de poucas semanas. Não levavam pára-quedas — o comando achava que encorajava a cobardia.",
    favorece:["turn"],
    conselho:"Tudo é lento e perto. Combate de curvas a cinquenta metros. Esquece velocidade — aqui é agilidade.",
    recomendados:["dr1","dvii","camel","spadsxiii"]
  }
];


/* ------------------------------------------------------------
   HORA DO DIA
------------------------------------------------------------ */
const HORAS = [
  { id:"amanhecer", nome:"Amanhecer", ic:"🌅",
    efeito:"Sol baixo no horizonte, sombras longas.",
    tatica:"Ataca sempre com o sol nas costas. Quem vem do sol é invisível.",
    dificuldade:2 },
  { id:"dia", nome:"Dia", ic:"☀️",
    efeito:"Visibilidade máxima.",
    tatica:"Vês tudo, mas também te vêem. Melhor opção para quem está a aprender.",
    dificuldade:1 },
  { id:"entardecer", nome:"Entardecer", ic:"🌇",
    efeito:"Luz dourada, sol rasante, contraste difícil.",
    tatica:"Bonito, mas traiçoeiro: perdes aviões contra o brilho. Usa o sol como cobertura.",
    dificuldade:2 },
  { id:"noite", nome:"Noite", ic:"🌙",
    efeito:"Visibilidade quase nula. Só chamas de escape e tracejantes.",
    tatica:"Muito difícil. Cintos sem tracejantes tornam-te invisível — mas também não vês onde acertas.",
    dificuldade:3 }
];

/* ------------------------------------------------------------
   METEOROLOGIA
------------------------------------------------------------ */
const METEO = [
  { id:"limpo", nome:"Céu limpo", ic:"☀️",
    efeito:"Sem nuvens, sem turbulência.",
    tatica:"Nada onde te esconderes. Combate puro — o melhor para treinar.",
    dificuldade:1 },
  { id:"nuvens", nome:"Nublado", ic:"⛅",
    efeito:"Camadas de nuvens a várias altitudes.",
    tatica:"As nuvens são o teu melhor esconderijo. Perseguido? Mergulha numa e muda de rumo lá dentro.",
    dificuldade:2 },
  { id:"chuva", nome:"Chuva / tempestade", ic:"🌧️",
    efeito:"Visibilidade reduzida, turbulência, pista escorregadia.",
    tatica:"Aterragem difícil: trava suave ou derrapas. E não vês o inimigo até estar em cima de ti.",
    dificuldade:3 }
];

/* ------------------------------------------------------------
   COMBUSTÍVEL LIMITADO
------------------------------------------------------------ */
const COMBUSTIVEL = {
  ligado: {
    nome:"Combustível limitado: LIGADO",
    vantagem:"Menos peso ao início: subes melhor e curvas melhor.",
    risco:"Podes ficar sem combustível. Em mapas oceânicos como Midway, isso é fatal.",
    conselho:"Só liga isto quando já conheceres a duração das tuas missões."
  },
  desligado: {
    nome:"Combustível limitado: DESLIGADO",
    vantagem:"Nunca ficas sem combustível. Uma preocupação a menos.",
    risco:"Depósitos cheios: mais peso, pior subida e pior curva.",
    conselho:"Para quem está a aprender, é a escolha certa. Concentra-te em voar."
  }
};

/* ------------------------------------------------------------
   HELPERS DE TRADUÇÃO
   Usam i18n se disponível, com fallback ao valor original em PT
------------------------------------------------------------ */
function nomeMapa(id) {
  const m = mapaPorId(id);
  if (!m) return id;
  if (typeof t === 'function') {
    const tr = t('mapa_' + id);
    if (tr && tr !== 'mapa_' + id) return tr;
  }
  return m.nome;
}

function nomeTeatro(mapa) {
  if (!mapa) return '';
  if (typeof t === 'function' && mapa.teatroKey) {
    const tr = t('teatro_' + mapa.teatroKey);
    if (tr && tr !== 'teatro_' + mapa.teatroKey) return tr;
  }
  return mapa.teatro;
}

function nomeHora(id) {
  const h = HORAS.find(x => x.id === id);
  if (!h) return id;
  if (typeof t === 'function') {
    const tr = t('hora_' + id);
    if (tr && tr !== 'hora_' + id) return tr;
  }
  return h.nome;
}

function taticaHora(id) {
  const h = HORAS.find(x => x.id === id);
  if (!h) return '';
  if (typeof t === 'function') {
    const tr = t('hora_' + id + '_tatica');
    if (tr && tr !== 'hora_' + id + '_tatica') return tr;
  }
  return h.tatica;
}

function nomeMeteo(id) {
  const w = METEO.find(x => x.id === id);
  if (!w) return id;
  if (typeof t === 'function') {
    const tr = t('meteo_' + id);
    if (tr && tr !== 'meteo_' + id) return tr;
  }
  return w.nome;
}

function taticaMeteo(id) {
  const w = METEO.find(x => x.id === id);
  if (!w) return '';
  if (typeof t === 'function') {
    const tr = t('meteo_' + id + '_tatica');
    if (tr && tr !== 'meteo_' + id + '_tatica') return tr;
  }
  return w.tatica;
}

function textoCombustivel(ligado) {
  const c = ligado ? COMBUSTIVEL.ligado : COMBUSTIVEL.desligado;
  if (typeof t === 'function') {
    const chNome = ligado ? 'comb_on' : 'comb_off';
    const chCons = ligado ? 'comb_on_cons' : 'comb_off_cons';
    const nome = t(chNome);
    const cons = t(chCons);
    return {
      nome:     (nome && nome !== chNome) ? nome : c.nome,
      conselho: (cons && cons !== chCons) ? cons : c.conselho
    };
  }
  return { nome:c.nome, conselho:c.conselho };
}

/* ------------------------------------------------------------
   MOTOR DE CONSELHOS
------------------------------------------------------------ */
function mapaPorId(id) { return MAPAS.find(m => m.id === id); }

/* O avião escolhido encaixa neste mapa? */
function avaliarCombinacao(idMapa, aviao) {
  const m = mapaPorId(idMapa);
  if (!m || !aviao) return null;
  const bom = m.recomendados.includes(aviao.id);
  const estiloOk = m.favorece.includes(aviao.estilo);
  const mNome = nomeMapa(idMapa);

  let nivel, ecra, voz;
  if (bom) {
    nivel = "otimo";
    ecra = `✅ Boa escolha. O ${aviao.nome} é dos aviões certos para ${mNome}.`;
    voz  = `Boa escolha. O ${aviao.voz} encaixa bem em ${mNome}. ${m.conselho}`;
  } else if (estiloOk) {
    nivel = "bom";
    ecra = `👍 Serve. ${m.conselho}`;
    voz  = `Serve bem. ${m.conselho}`;
  } else {
    nivel = "cuidado";
    const sug = m.recomendados.slice(0,3)
      .map(id => (typeof porId === "function" ? porId(id)?.nome : id))
      .filter(Boolean).join(", ");
    ecra = `⚠️ Não é o ideal. ${m.conselho}\nMelhores aqui: ${sug}.`;
    voz  = `Atenção: não é o avião ideal para este mapa. ${m.conselho} Aqui davam-se melhor o ${sug}.`;
  }
  return { nivel, ecra, voz, mapa:m };
}

/* Briefing completo de uma sessão configurada */
function briefingMissao(cfg, aviao) {
  const m = mapaPorId(cfg.mapa);
  if (!m) return null;
  const h  = HORAS.find(x => x.id === cfg.hora)   || HORAS[1];
  const w  = METEO.find(x => x.id === cfg.meteo)  || METEO[0];
  const c  = cfg.combustivel ? COMBUSTIVEL.ligado : COMBUSTIVEL.desligado;
  const av = avaliarCombinacao(cfg.mapa, aviao);

  const dificuldade = Math.min(5, Math.round((h.dificuldade + w.dificuldade) / 2 * 1.6));

  /* textos traduzidos (com fallback ao PT) */
  const mNome  = nomeMapa(m.id);
  const hNome  = nomeHora(h.id);
  const hTat   = taticaHora(h.id);
  const wNome  = nomeMeteo(w.id);
  const wTat   = taticaMeteo(w.id);
  const cbInfo = textoCombustivel(cfg.combustivel);

  const partes = [];
  partes.push(`${mNome}, ${m.ano}. ${m.contexto}`);
  if (av) partes.push(av.voz);
  partes.push(`${hNome}: ${hTat}`);
  partes.push(`${wNome}: ${wTat}`);
  partes.push(cbInfo.conselho);

  return {
    mapa:m, hora:h, meteo:w, comb:c, avaliacao:av, dificuldade,
    ecra: partes.join("\n\n"),
    voz:  partes.join(" "),
    facto: m.facto
  };
}

/* Sugestão de configuração para quem está a aprender */
function sugerirConfig(aviao) {
  const wwi = aviao && aviao.era === "WWI";
  return {
    mapa: wwi ? "wwi_frente" : "bretanha",
    hora: "dia",
    meteo: "limpo",
    combustivel: false,
    porque: "Dia, céu limpo e sem limite de combustível. Sem distrações — só tu e o avião."
  };
}
