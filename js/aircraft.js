/* ============================================================
   AOT ENGENHEIRO — Base de dados de aeronaves
   29 aviões · Aces of Thunder (Gaijin)
   Dados: tabela oficial fornecida por José Duarte
   Campos: Aircraft · Era · Family · Role · Country · Manufacturer
           · Crew · Wiki · Standard Edition · Deluxe Edition
   ============================================================ */

const NACOES = {
  eua:      { flag:"🇺🇸", nome:"Estados Unidos",  voz:"Estados Unidos" },
  alemanha: { flag:"🇩🇪", nome:"Alemanha",        voz:"Alemanha" },
  uk:       { flag:"🇬🇧", nome:"Reino Unido",     voz:"Reino Unido" },
  urss:     { flag:"🇷🇺", nome:"URSS",            voz:"União Soviética" },
  japao:    { flag:"🇯🇵", nome:"Japão",           voz:"Japão" },
  wwi:      { flag:"🛩️", nome:"Primeira Guerra", voz:"Primeira Guerra Mundial" }
};

/* Papéis tal como aparecem no jogo, com tradução e ícone */
const PAPEIS = {
  Fighter: { pt:"Caça",             ic:"🔶", cor:"#f59e0b" },
  Bomber:  { pt:"Bombardeiro",      ic:"🔷", cor:"#2dd4bf" },
  Strike:  { pt:"Ataque",           ic:"🔸", cor:"#4ade80" }
};

/* ------------------------------------------------------------
   ESTILOS DE COMBATE (para o engenheiro aconselhar)
   bnz    = Boom & Zoom      (picar, disparar, subir)
   turn   = Turn Fighting    (curvar)
   energy = Energy Fighting  (vertical)
   misto  = versátil
   solo   = ataque ao solo
------------------------------------------------------------ */

const AVIOES = [
  /* ══════════════ 🇺🇸 ESTADOS UNIDOS ══════════════ */
  {
    id:"p51", nacao:"eua", nome:"P-51C-10", familia:'P-51 "Mustang"',
    voz:"P cinquenta e um C dez, Mustang",
    era:"WWII", role:"Fighter", pais:"USA", fabricante:"North American Aviation",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/p-51c-10-nt",
    estilo:"bnz", dificuldade:2,
    forte:"Velocidade altíssima, excelente em altitude, autonomia enorme, boa rolagem",
    fraco:"Curva mal a baixa velocidade, radiador frágil — um tiro no sistema de refrigeração mata-te",
    taticas:[
      "Sobe acima dos 4000 metros e fica lá. É o teu território.",
      "Pica, dispara uma rajada curta, e usa a velocidade para voltar a subir.",
      "Contra Bf 109: mantém-te acima dos 500 km/h. Ele não te acompanha.",
      "Nunca entres em curva sustentada com Zeros ou Spitfires."
    ]
  },
  {
    id:"p47", nacao:"eua", nome:"P-47D-22-RE", familia:'P-47 "Thunderbolt"',
    voz:"P quarenta e sete D, Thunderbolt",
    era:"WWII", role:"Fighter", pais:"USA", fabricante:"Seversky / Republic",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/p-47d_22_re",
    estilo:"bnz", dificuldade:3,
    forte:"Blindagem brutal, oito metralhadoras ponto cinquenta, pica como chumbo",
    fraco:"Sobe devagar, pesadíssimo em baixa velocidade, alvo enorme",
    taticas:[
      "A tua arma é a picada. Ganha altitude com paciência antes de lutar.",
      "Aguentas tiros que matam outros aviões — mas não abuses disso.",
      "Em baixa altitude estás em desvantagem contra tudo. Foge a picar."
    ]
  },
  {
    id:"p63", nacao:"eua", nome:"P-63A-5", familia:'P-63 "Kingcobra"',
    voz:"P sessenta e três A cinco, Kingcobra",
    era:"WWII", role:"Fighter", pais:"USA", fabricante:"Bell",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/p-63a-5",
    estilo:"misto", dificuldade:3,
    forte:"Canhão de 37 mm no nariz — tiro central, sem convergência para calcular",
    fraco:"Canhão lento e com pouca munição, fraco em grande altitude",
    taticas:[
      "Tiro central: aponta directo, não tens de pensar em convergência.",
      "Guarda o 37 mm para menos de 300 metros. Um acerto derruba.",
      "Fica abaixo dos 4000 metros."
    ]
  },
  {
    id:"p40", nacao:"eua", nome:"P-40E-1", familia:'P-40 "Warhawk"',
    voz:"P quarenta E um, Warhawk",
    era:"WWII", role:"Fighter", pais:"USA", fabricante:"Curtiss-Wright",
    tripulacao:1, std:false, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/p-40e",
    estilo:"bnz", dificuldade:2,
    forte:"Robusto, pica muito bem, boa rolagem, seis metralhadoras ponto cinquenta",
    fraco:"Sobe mal, fraco acima dos 4000 metros",
    taticas:[
      "Luta abaixo dos 3000 metros.",
      "Contra Zeros nunca curves: pica, dispara, sobe."
    ]
  },
  {
    id:"sb2c", nacao:"eua", nome:"SB2C-4", familia:'SBC "Helldiver"',
    voz:"S B dois C quatro, Helldiver",
    era:"WWII", role:"Bomber", pais:"USA", fabricante:"North American Aviation",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/sb2c_4",
    estilo:"solo", dificuldade:3,
    forte:"Boa carga de bombas, artilheiro traseiro",
    fraco:"Pesado, instável, perigoso a baixa velocidade",
    taticas:[
      "Missões de ataque ao solo apenas.",
      "Voa em grupo — o artilheiro traseiro só assusta, não salva."
    ]
  },
  {
    id:"sbd", nacao:"eua", nome:"SBD-3", familia:'SBD "Dauntless"',
    voz:"S B D três, Dauntless",
    era:"WWII", role:"Bomber", pais:"USA", fabricante:"North American Aviation",
    tripulacao:2, std:false, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/sbd-3",
    estilo:"solo", dificuldade:2,
    forte:"Travões de picada, muito preciso a bombardear",
    fraco:"Lento, praticamente indefeso contra caças",
    taticas:[
      "Abre os travões de picada e mergulha a setenta graus sobre o alvo.",
      "Larga a bomba e sai rasante.",
      "Se um caça te apanhar, pede ajuda. Não ganhas sozinho."
    ]
  },
  {
    id:"f4u", nacao:"eua", nome:"F4U-4", familia:'F4U "Corsair"',
    voz:"F quatro U quatro, Corsair",
    era:"WWII", role:"Fighter", pais:"USA", fabricante:"North American Aviation",
    tripulacao:1, std:false, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/f4u-4",
    estilo:"misto", dificuldade:3,
    forte:"Rápido, sobe bem, robusto, muito versátil",
    fraco:"Binário violento na descolagem, visibilidade péssima na aterragem",
    taticas:[
      "Na descolagem nunca dês acelerador de rajada. O binário capota-te.",
      "Aproxima em curva na aterragem, senão não vês a pista.",
      "Podes picar ou curvar — é dos mais equilibrados do jogo."
    ]
  },

  /* ══════════════ 🇩🇪 ALEMANHA ══════════════ */
  {
    id:"bf109f", nacao:"alemanha", nome:"Bf 109 F-4", familia:"Bf 109",
    voz:"Messerschmitt cento e nove Friedrich",
    era:"WWII", role:"Fighter", pais:"Germany", fabricante:"BFW / Messerschmitt",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/bf-109f-4",
    estilo:"energy", dificuldade:2,
    forte:"Subida excelente, canhão de 20 mm no eixo da hélice, rei da vertical",
    fraco:"Rola devagar em alta velocidade, pouca munição, trem de aterragem traiçoeiro",
    taticas:[
      "Luta na vertical. Sobe, vira em cima, volta a picar.",
      "Contra Spitfire nunca curves na horizontal. Ele ganha sempre. Vai para cima.",
      "O canhão central dispensa convergência — aponta directo.",
      "Cuidado na aterragem: o trem é estreito e capota com facilidade."
    ]
  },
  {
    id:"fw190", nacao:"alemanha", nome:"Fw 190 A-4", familia:'Fw 190 "Würger"',
    voz:"Focke-Wulf cento e noventa A quatro",
    era:"WWII", role:"Fighter", pais:"Germany", fabricante:"Focke-Wulf",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/fw-190a-4",
    estilo:"bnz", dificuldade:2,
    forte:"A melhor rolagem do jogo, armamento pesadíssimo, rápido e robusto",
    fraco:"Curva mal, entra em perda de repente e sem aviso, fraco em grande altitude",
    taticas:[
      "A tua arma secreta é a rolagem. Inverte e pica mais depressa do que qualquer um consegue seguir.",
      "Nunca entres em curvas lentas. A perda é súbita e mata.",
      "Uma rajada dos teus canhões desfaz qualquer caça. Aproxima-te e dispara curto."
    ]
  },
  {
    id:"bf109g", nacao:"alemanha", nome:"Bf 109 G-2/trop", familia:"Bf 109",
    voz:"Messerschmitt cento e nove Gustav dois",
    era:"WWII", role:"Fighter", pais:"Germany", fabricante:"BFW / Messerschmitt",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/bf-109g-2",
    estilo:"energy", dificuldade:3,
    forte:"Mais potência que o Friedrich, subida brutal",
    fraco:"Mais pesado, curva pior, rolagem lenta em alta velocidade",
    taticas:[
      "Igual ao F-4, mas ainda mais vertical.",
      "Usa o WEP para escapar a subir — poucos te acompanham."
    ]
  },
  {
    id:"bf110", nacao:"alemanha", nome:"Bf 110 G-2", familia:"Bf 110",
    voz:"Messerschmitt cento e dez Gustav dois",
    era:"WWII", role:"Strike", pais:"Germany", fabricante:"BFW / Messerschmitt",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/bf-110g-2",
    estilo:"bnz", dificuldade:3,
    forte:"Fogo frontal devastador, dois motores, artilheiro traseiro",
    fraco:"Grande, curva muito mal, presa fácil para caças ágeis",
    taticas:[
      "Ataca bombardeiros e alvos no solo.",
      "Nunca entres em dogfight com caças monomotores.",
      "Ataca sempre com vantagem de altitude e sai a direito."
    ]
  },

  /* ══════════════ 🇷🇺 URSS ══════════════ */
  {
    id:"yak9t", nacao:"urss", nome:"Yak-9T", familia:"Yak-9",
    voz:"Yak nove T",
    era:"WWII", role:"Fighter", pais:"USSR", fabricante:"Yakovlev",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/yak-9t",
    estilo:"misto", dificuldade:3,
    forte:"Canhão de 37 mm central — um acerto derruba qualquer coisa",
    fraco:"Cerca de 30 munições apenas, cadência baixa, o recuo desloca a mira",
    taticas:[
      "Tiro central: aponta directo, sem convergência.",
      "Aproxima-te a menos de 300 metros e dispara um tiro de cada vez.",
      "Contra bombardeiros és absolutamente letal."
    ]
  },
  {
    id:"la5fn", nacao:"urss", nome:"La-5FN", familia:"La-5",
    voz:"Lavochkin La cinco F N",
    era:"WWII", role:"Fighter", pais:"USSR", fabricante:"Lavochkin",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/la-5fn",
    estilo:"misto", dificuldade:2,
    forte:"Motor radial resistente, boa aceleração e subida a baixa altitude, dois canhões de 20 mm",
    fraco:"Sobreaquece muito depressa, visibilidade fraca, mau em altitude",
    taticas:[
      "Vigia a temperatura. Este avião ferve.",
      "Domina abaixo dos 3000 metros.",
      "Boa mistura de curva e energia — adapta-te ao adversário."
    ]
  },
  {
    id:"yak3", nacao:"urss", nome:"Yak-3", familia:"Yak-3",
    voz:"Yak três",
    era:"WWII", role:"Fighter", pais:"USSR", fabricante:"Yakovlev",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/yak-3",
    estilo:"turn", dificuldade:1,
    forte:"Curva fantástica, leve, ágil, subida rápida a baixa altitude. Dos melhores para começar",
    fraco:"Pouca munição, fraco acima dos 4000 metros, estrutura frágil",
    taticas:[
      "Luta abaixo dos 3000 metros. É o teu território.",
      "Aceita curvas com quase toda a gente, excepto o Zero.",
      "Dispara curto: tens muito pouca munição."
    ]
  },
  {
    id:"il2", nacao:"urss", nome:"IL-2M (1943)", familia:"IL-2",
    voz:"Ilyushin dois M",
    era:"WWII", role:"Strike", pais:"USSR", fabricante:"Ilyushin",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/il_2m_1943",
    estilo:"solo", dificuldade:2,
    forte:"Blindagem absurda, canhões e foguetes contra alvos no solo",
    fraco:"Lento, pesado, quase indefeso contra caças",
    taticas:[
      "Voa baixo e destrói tanques e camiões.",
      "Ataca em passagens rasantes, nunca circules sobre o alvo.",
      "Se um caça te apanhar, desce até às árvores e vira sempre."
    ]
  },

  /* ══════════════ 🇬🇧 REINO UNIDO ══════════════ */
  {
    id:"spitfirevb", nacao:"uk", nome:"Spitfire Mk Vb", familia:"Spitfire",
    voz:"Spitfire marca cinco B",
    era:"WWII", role:"Fighter", pais:"Great Britain", fabricante:"Supermarine",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/spitfire_mk5b_notrop",
    estilo:"turn", dificuldade:1,
    forte:"Curva magnífica, boa subida, mistura de canhões e metralhadoras, muito fácil de pilotar",
    fraco:"Frágil, sobreaquece, e o motor corta em G negativo por causa do carburador",
    taticas:[
      "Aceita curvas com quase tudo. O Bf 109 não te acompanha na horizontal.",
      "Nunca empurres o manche para picar de repente: o motor corta. Faz meio tonel e puxa.",
      "Contra Fw 190: força a horizontal. Ele não curva."
    ]
  },
  {
    id:"spitfireia", nacao:"uk", nome:"Spitfire Mk Ia", familia:"Spitfire",
    voz:"Spitfire marca um A",
    era:"WWII", role:"Fighter", pais:"Great Britain", fabricante:"Supermarine",
    tripulacao:1, std:false, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/spitfire_mk1",
    estilo:"turn", dificuldade:1,
    forte:"Ultra ágil, oito metralhadoras, perdoa erros — o melhor para aprender",
    fraco:"Só metralhadoras ponto trezentos e três, pouco poder de fogo, lento",
    taticas:[
      "O melhor avião do jogo para aprender a curvar.",
      "Precisas de rajadas longas para derrubar. Aproxima-te muito."
    ]
  },
  {
    id:"typhoon", nacao:"uk", nome:"Typhoon Mk Ib/L", familia:"Typhoon",
    voz:"Typhoon marca um B",
    era:"WWII", role:"Fighter", pais:"Great Britain", fabricante:"Hawker",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/typhoon_mk1b_late",
    estilo:"bnz", dificuldade:3,
    forte:"Rapidíssimo a baixa altitude, quatro canhões de 20 mm devastadores",
    fraco:"Curva mal, sobe mal, mau em altitude",
    taticas:[
      "Rasante e rápido. É a tua zona.",
      "Ataca alvos no solo e caças distraídos.",
      "Não subas para lutar. Perdes."
    ]
  },
  {
    id:"firefly", nacao:"uk", nome:"Firefly FR Mk V", familia:"Firefly",
    voz:"Firefly F R marca cinco",
    era:"WWII", role:"Strike", pais:"Great Britain", fabricante:"Fairey",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/firefly_mk5",
    estilo:"misto", dificuldade:3,
    forte:"Flaps Youngman permitem curvas surpreendentemente apertadas, quatro canhões de 20 mm",
    fraco:"Pesado, lento, e grande como alvo",
    taticas:[
      "Usa os flaps de combate para curvas fechadas.",
      "Não persigas caças rápidos. Não os apanhas."
    ]
  },
  {
    id:"mosquito", nacao:"uk", nome:"Mosquito FB Mk VI", familia:"Mosquito",
    voz:"Mosquito F B marca seis",
    era:"WWII", role:"Strike", pais:"Great Britain", fabricante:"de Havilland",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/mosquito_fb_mk6",
    estilo:"bnz", dificuldade:3,
    forte:"Quatro canhões de 20 mm mais quatro metralhadoras concentrados no nariz. Fogo aniquilador",
    fraco:"Grande, curva mal, e é feito de madeira — arde bem",
    taticas:[
      "Uma passagem, um alvo destruído. Não fiques a circular.",
      "Excelente contra alvos no solo e bombardeiros."
    ]
  },
  {
    id:"hurricane", nacao:"uk", nome:"Hurricane Mk IV", familia:"Hurricane",
    voz:"Hurricane marca quatro",
    era:"WWII", role:"Strike", pais:"Great Britain", fabricante:"Hawker",
    tripulacao:1, std:false, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/hurricane_mk4",
    estilo:"turn", dificuldade:2,
    forte:"Curva muito bem, estrutura tubular resistente, foguetes e canhões anti-tanque",
    fraco:"Lento e sobe mal",
    taticas:[
      "Perfeito para missões de ataque ao solo.",
      "Em combate aéreo, curva e espera que o inimigo se engane."
    ]
  },

  /* ══════════════ 🇯🇵 JAPÃO ══════════════ */
  {
    id:"a6m3", nacao:"japao", nome:"A6M3 mod. 22", familia:"A6M",
    voz:"A seis M três, Zero",
    era:"WWII", role:"Fighter", pais:"Japan", fabricante:"Mitsubishi",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/a6m3_mod22_zero",
    estilo:"turn", dificuldade:2,
    forte:"A melhor curva do jogo, autonomia enorme, muito ágil a baixa velocidade",
    fraco:"Sem blindagem nem depósitos auto-selantes — arde à primeira. Os ailerons endurecem acima dos 400 km/h",
    taticas:[
      "Força sempre a curva. Ninguém te ganha na horizontal a baixa velocidade.",
      "Acima dos 400 km/h quase não rolas. Evita picadas rápidas.",
      "Um avião que te acerte, mata-te. Nunca voes a direito."
    ]
  },
  {
    id:"ki61", nacao:"japao", nome:"Ki-61-I tei", familia:'Ki-61 "Hien"',
    voz:"Ki sessenta e um Tei, Hien",
    era:"WWII", role:"Fighter", pais:"Japan", fabricante:"Kawasaki",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/ki_61_1a_tei",
    estilo:"misto", dificuldade:2,
    forte:"Motor em linha, mais rápido e resistente que o Zero, pica bem",
    fraco:"Curva pior que o Zero, subida mediana",
    taticas:[
      "O caça japonês mais equilibrado. Podes picar e curvar.",
      "Boa escolha para quem vem de aviões alemães ou americanos."
    ]
  },
  {
    id:"j2m2", nacao:"japao", nome:"J2M2", familia:'J2M "Raiden"',
    voz:"J dois M dois, Raiden",
    era:"WWII", role:"Fighter", pais:"Japan", fabricante:"Mitsubishi",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/j2m2",
    estilo:"energy", dificuldade:3,
    forte:"Subida excepcional, canhões pesados, rápido",
    fraco:"Visibilidade fraca, curva medíocre para um caça japonês",
    taticas:[
      "Interceptor puro. Sobe e cai sobre bombardeiros.",
      "Usa a subida para desengatar sempre que estiveres em apuros."
    ]
  },
  {
    id:"d4y3", nacao:"japao", nome:"D4Y3 Ko", familia:'D4Y "Suisei"',
    voz:"D quatro Y três Ko, Suisei",
    era:"WWII", role:"Bomber", pais:"Japan", fabricante:"Yokosuka Naval Arsenal",
    tripulacao:2, std:true, dlx:true,
    wiki:"https://wiki.warthunder.com/unit/d4y3",
    estilo:"solo", dificuldade:3,
    forte:"Muito rápido para um bombardeiro",
    fraco:"Pouco armado e frágil",
    taticas:[
      "A velocidade é a tua única defesa. Entra, larga, sai."
    ]
  },

  /* ══════════════ 🛩️ PRIMEIRA GUERRA ══════════════ */
  {
    id:"dr1", nacao:"wwi", nome:"Fokker Dr.I", familia:"Fokker",
    voz:"Fokker Doutor um",
    era:"WWI", role:"Fighter", pais:"Germany", fabricante:"Fokker-Flugzeugwerke",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://pt.wikipedia.org/wiki/Fokker_Dr.I",
    estilo:"turn", dificuldade:2,
    forte:"Curva incrível, sobe bem, muito ágil. O avião do Barão Vermelho",
    fraco:"Lentíssimo, estrutura frágil, binário forte para a direita",
    taticas:[
      "O combate da Primeira Guerra é a baixa velocidade e curto alcance. Aproxima-te a cinquenta metros.",
      "Usa o binário: as curvas para a direita são muito mais rápidas.",
      "Nunca fujas a direito. Apanham-te sempre."
    ]
  },
  {
    id:"dvii", nacao:"wwi", nome:"Fokker D.VII", familia:"Fokker",
    voz:"Fokker D sete",
    era:"WWI", role:"Fighter", pais:"Germany", fabricante:"Fokker-Flugzeugwerke",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://pt.wikipedia.org/wiki/Fokker_D.VII",
    estilo:"misto", dificuldade:1,
    forte:"Estável, perdoa erros, bom em altitude, boa curva",
    fraco:"Não é o mais rápido do seu tempo",
    taticas:[
      "O melhor avião da Primeira Guerra para começar.",
      "Suficientemente estável para apontares com calma."
    ]
  },
  {
    id:"camel", nacao:"wwi", nome:"Sopwith F.1 Camel", familia:"Sopwith",
    voz:"Sopwith Camel",
    era:"WWI", role:"Fighter", pais:"Great Britain", fabricante:"Sopwith Aviation",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://pt.wikipedia.org/wiki/Sopwith_Camel",
    estilo:"turn", dificuldade:3,
    forte:"Curvas à direita fulminantes graças ao binário giroscópico do motor rotativo",
    fraco:"Muito instável, curva mal à esquerda, mata pilotos inexperientes",
    taticas:[
      "Vira sempre à direita. À esquerda é lento e perigoso.",
      "Exige leme constante. Não é avião para principiantes."
    ]
  },
  {
    id:"spadsxiii", nacao:"wwi", nome:"SPAD S.XIII", familia:"SPAD",
    voz:"SPAD S treze",
    era:"WWI", role:"Fighter", pais:"France", fabricante:"SPAD",
    tripulacao:1, std:true, dlx:true,
    wiki:"https://pt.wikipedia.org/wiki/SPAD_S.XIII",
    estilo:"bnz", dificuldade:2,
    forte:"Rápido e resistente para a época, pica muito bem",
    fraco:"Curva mal e perde velocidade depressa",
    taticas:[
      "O Boom and Zoom da Primeira Guerra: sobe, pica, dispara, sobe.",
      "Nunca aceites curvas com triplanos."
    ]
  }
];

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
const ESTILOS = {
  bnz:    { nome:"Boom & Zoom",     ic:"💥", classe:"e-bnz" },
  turn:   { nome:"Turn Fighting",   ic:"🔄", classe:"e-turn" },
  energy: { nome:"Energy Fighting", ic:"⚡", classe:"e-energy" },
  misto:  { nome:"Versátil",        ic:"🎭", classe:"e-misto" },
  solo:   { nome:"Ataque ao solo",  ic:"🎯", classe:"e-solo" }
};

const fotoDe   = a => `img/${a.id}.jpg`;
const porNacao = n => AVIOES.filter(a => a.nacao === n);
const porId    = id => AVIOES.find(a => a.id === id);

/* Ficha falada pelo engenheiro (sem símbolos, tudo por extenso) */
function fichaVoz(a, completa = false) {
  const trip = a.tripulacao === 1 ? "um tripulante, o piloto" : `${a.tripulacao} tripulantes`;
  const ed = a.std && a.dlx ? "Disponível nas edições Standard e Deluxe."
           : a.dlx ? "Disponível apenas na edição Deluxe." : "Edição Standard.";
  let t = `${a.voz}. ${PAPEIS[a.role].pt}, da ${NACOES[a.nacao].voz}. `
        + `Fabricante: ${a.fabricante}. ${trip}. `;
  if (!completa) return t + `Estilo de combate: ${ESTILOS[a.estilo].nome}.`;
  return t + `${ed} Estilo de combate: ${ESTILOS[a.estilo].nome}. `
       + `Pontos fortes: ${a.forte}. Pontos fracos: ${a.fraco}. `
       + `Como voar: ${a.taticas.join(". ")}`;
}
