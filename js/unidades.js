/* ============================================================
   AOT ENGENHEIRO — Unidades dos instrumentos
   ------------------------------------------------------------
   PROBLEMA QUE ISTO RESOLVE:
   No Aces of Thunder voa-se SEMPRE da cabina. Os mostradores são
   modelados conforme a nacionalidade real do avião e NÃO mudam
   com as definições do jogo (essas afectam só o HUD).
   Logo, o engenheiro tem de falar na unidade do MOSTRADOR,
   senão os números não batem certo com o que o piloto vê.
   ============================================================ */

const UNIDADES = {
  mph:  { sim:"mph",  nome:"milhas por hora", voz:"milhas por hora", vozCurta:"milhas",       kmh:1.609344 },
  kmh:  { sim:"km/h", nome:"km por hora",     voz:"quilómetros por hora", vozCurta:"quilómetros", kmh:1 },
  kt:   { sim:"kt",   nome:"nós",             voz:"nós",             vozCurta:"nós",          kmh:1.852 }
};

/* Unidade do mostrador por avião (chave = id em aircraft.js)
   conf: "alta"  = padrão nacional bem documentado
         "media" = inferido do padrão da nação/serviço — confirmar em voo */
const UNIDADE_AVIAO = {
  /* 🇺🇸 EUA — mph + pés */
  p51:{u:"mph",conf:"alta"}, p47:{u:"mph",conf:"alta"}, p63:{u:"mph",conf:"alta"},
  p40:{u:"mph",conf:"alta"}, sb2c:{u:"mph",conf:"alta"}, sbd:{u:"mph",conf:"alta"},
  f4u:{u:"mph",conf:"alta"},

  /* 🇬🇧 Reino Unido — mph, incluindo a Fleet Air Arm.
     A FAA só passou para nós no pós-guerra; na época do Firefly Mk V
     os mostradores britânicos eram todos em mph. (confirmado) */
  spitfirevb:{u:"mph",conf:"alta"}, spitfireia:{u:"mph",conf:"alta"},
  typhoon:{u:"mph",conf:"alta"},    hurricane:{u:"mph",conf:"alta"},
  mosquito:{u:"mph",conf:"alta"},   firefly:{u:"mph",conf:"alta"},

  /* 🇩🇪 Luftwaffe — km/h + metros */
  bf109f:{u:"kmh",conf:"alta"}, bf109g:{u:"kmh",conf:"alta"},
  fw190:{u:"kmh",conf:"alta"},  bf110:{u:"kmh",conf:"alta"},

  /* 🇷🇺 VVS — km/h + metros */
  yak9t:{u:"kmh",conf:"alta"}, yak3:{u:"kmh",conf:"alta"},
  la5fn:{u:"kmh",conf:"alta"}, il2:{u:"kmh",conf:"alta"},

  /* 🇯🇵 ATENÇÃO — o Japão usava DOIS sistemas
     Marinha Imperial (A6M, J2M, D4Y) → nós
     Exército Imperial (Ki-61)        → km/h */
  a6m3:{u:"kt",conf:"alta",  servico:"Marinha",
    nota:"Marinha Imperial Japonesa — mostrador em NÓS. Um número em nós é ~1,85× o valor em km/h."},
  j2m2:{u:"kt",conf:"alta",  servico:"Marinha",
    nota:"Marinha Imperial Japonesa — mostrador em NÓS."},
  d4y3:{u:"kt",conf:"alta",  servico:"Marinha",
    nota:"Marinha Imperial Japonesa — mostrador em NÓS."},
  ki61:{u:"kmh",conf:"alta", servico:"Exército",
    nota:"Exército Imperial Japonês — km/h, ao contrário dos aviões da Marinha."},

  /* 🛩️ Primeira Guerra */
  dr1:{u:"kmh",conf:"alta"},        // alemão
  dvii:{u:"kmh",conf:"alta"},       // alemão
  camel:{u:"mph",conf:"alta"},      // RFC/RAF britânico
  /* SPAD S.XIII — francês, anemómetro métrico. Confirmado pelo site oficial
     do Aces of Thunder, que publica a velocidade de cruzeiro em km/h. */
  spadsxiii:{u:"kmh",conf:"alta"}
};

/* ------------------------------------------------------------
   CONVERSÃO
   Fonte única de verdade: a wiki do War Thunder dá tudo em km/h.
   Converte-se daí para a unidade do mostrador. Nunca ao contrário.
------------------------------------------------------------ */
function deKmh(kmh, unidade) {
  return Math.round(kmh / UNIDADES[unidade].kmh);
}
function paraKmh(valor, unidade) {
  return Math.round(valor * UNIDADES[unidade].kmh);
}
function unidadeDe(idAviao) {
  return (UNIDADE_AVIAO[idAviao] || { u:"kmh", conf:"media" });
}

/* Texto para o ECRÃ: "190 mph (304 km/h)" */
function velocidadeEcra(kmh, idAviao) {
  const u = unidadeDe(idAviao).u;
  if (u === "kmh") return `${Math.round(kmh)} km/h`;
  return `${deKmh(kmh, u)} ${UNIDADES[u].sim} (${Math.round(kmh)} km/h)`;
}

/* Texto para a VOZ — número do mostrador PRIMEIRO, referência depois.
   O piloto está a olhar para o ponteiro: precisa do número que lá está, já. */
function velocidadeVoz(kmh, idAviao, comReferencia = true) {
  const u = unidadeDe(idAviao).u;
  if (u === "kmh") return `${Math.round(kmh)} quilómetros`;
  const n = deKmh(kmh, u);
  if (!comReferencia) return `${n} ${UNIDADES[u].vozCurta}`;
  return `${n} ${UNIDADES[u].vozCurta}, uns ${Math.round(kmh)} quilómetros`;
}

/* Aviso de arranque, quando o avião não usa km/h */
function avisoUnidade(idAviao) {
  const info = unidadeDe(idAviao);
  if (info.u === "kmh" && !info.nota) return null;
  return {
    unidade: info.u,
    simbolo: UNIDADES[info.u].sim,
    critico: info.u === "kt",
    servico: info.servico || null,
    conf: info.conf,
    ecra: info.nota || `Mostrador em ${UNIDADES[info.u].nome} (${UNIDADES[info.u].sim}).`,
    voz: info.u === "kt"
      ? "Atenção: este avião tem o mostrador em nós, não em quilómetros. Os números que eu disser são em nós."
      : `Atenção: mostrador em ${UNIDADES[info.u].voz}.`
  };
}

/* ------------------------------------------------------------
   IAS vs TAS — a segunda armadilha
   O mostrador mostra IAS (velocidade indicada). A wiki publica
   velocidade máxima em TAS (verdadeira). Em altitude, a IAS é
   MUITO menor que a TAS. Os limites estruturais (trem, flaps)
   são sempre em IAS — por isso é seguro anunciá-los.
------------------------------------------------------------ */
const NOTA_IAS = {
  titulo: "IAS vs TAS — porque o mostrador 'mente'",
  texto:
    "O mostrador da cabina indica IAS (velocidade indicada), medida pela pressão do ar. " +
    "A wiki e as fichas publicam a velocidade máxima em TAS (velocidade verdadeira). " +
    "Quanto mais alto voas, mais rarefeito é o ar e maior a diferença: a 6000 metros " +
    "um avião a 600 km/h TAS mostra só uns 430 km/h no ponteiro. " +
    "Por isso o engenheiro nunca te dá a velocidade máxima como alvo. " +
    "Dá-te os limites de trem e flaps, que são definidos em IAS e batem certo com o mostrador.",
  voz:
    "Nota importante. O mostrador indica velocidade indicada, não velocidade verdadeira. " +
    "Em altitude o ponteiro marca bastante menos do que a velocidade real. " +
    "Os limites de trem e de flaps que eu te dou são em velocidade indicada, " +
    "por isso batem certo com o que estás a ver."
};

/* ------------------------------------------------------------
   TABELA-RESUMO para o ecrã de ajuda
------------------------------------------------------------ */
const TABELA_UNIDADES = [
  { bandeira:"🇺🇸", grupo:"Estados Unidos",
    avioes:"P-51, P-47, P-63, P-40, F4U, SBD, SB2C", u:"mph" },
  { bandeira:"🇬🇧", grupo:"Reino Unido (RAF)",
    avioes:"Spitfire Ia/Vb, Typhoon, Mosquito, Hurricane, Firefly", u:"mph" },
  { bandeira:"🇩🇪", grupo:"Alemanha (Luftwaffe)",
    avioes:"Bf 109 F-4, Bf 109 G-2, Fw 190 A-4, Bf 110 G-2", u:"kmh" },
  { bandeira:"🇷🇺", grupo:"URSS (VVS)",
    avioes:"Yak-9T, Yak-3, La-5FN, IL-2M", u:"kmh" },
  { bandeira:"🇯🇵", grupo:"Japão — MARINHA Imperial",
    avioes:"A6M3 Zero, J2M2 Raiden, D4Y3 Suisei", u:"kt", alerta:true },
  { bandeira:"🇯🇵", grupo:"Japão — EXÉRCITO Imperial",
    avioes:"Ki-61-I tei", u:"kmh", alerta:true },
  { bandeira:"🛩️", grupo:"WWI — Alemanha / França",
    avioes:"Fokker Dr.I, Fokker D.VII, SPAD S.XIII", u:"kmh" },
  { bandeira:"🛩️", grupo:"WWI — Reino Unido",
    avioes:"Sopwith F.1 Camel", u:"mph" }
];
