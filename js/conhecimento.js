/* ============================================================
   AOT ENGENHEIRO — Base de conhecimento
   Instruções · botões · armamento · factos · efemérides
   ============================================================ */

/* ------------------------------------------------------------
   1. BINDINGS — o que o engenheiro diz que tens de premir.
   Editável pelo utilizador; isto é só o perfil por omissão,
   baseado no manual do T.Flight HOTAS 5 (pág. 21).
------------------------------------------------------------ */
const BINDINGS_OMISSAO = {
  metralhadoras: { botao:"R1", voz:"R um",        onde:"gatilho do manche",        dedo:"indicador direito" },
  canhoes:       { botao:"L1", voz:"L um",        onde:"polegar do manche",        dedo:"polegar direito" },
  foguetes:      { botao:"L3", voz:"L três",      onde:"polegar do manche",        dedo:"polegar direito" },
  bombas:        { botao:"✕",  voz:"Cruz",        onde:"acelerador",               dedo:"polegar esquerdo" },
  recarregar:    { botao:"□",  voz:"Quadrado",    onde:"acelerador",               dedo:"polegar esquerdo" },
  trem:          { botao:"△",  voz:"Triângulo",   onde:"acelerador",               dedo:"polegar esquerdo" },
  airbrake:      { botao:"○",  voz:"Círculo",     onde:"acelerador",               dedo:"polegar esquerdo" },
  flaps_baixar:  { botao:"L2", voz:"L dois",      onde:"paddle traseiro do acelerador", dedo:"indicador esquerdo" },
  flaps_subir:   { botao:"R2", voz:"R dois",      onde:"paddle traseiro do acelerador", dedo:"médio esquerdo" },
  leme:          { botao:"Rocker", voz:"rocker",  onde:"basculante atrás do acelerador", dedo:"indicador esquerdo" },
  trim:          { botao:"Hat", voz:"hat switch", onde:"chapéu no topo do manche", dedo:"polegar direito" },
  vista:         { botao:"R3", voz:"R três",      onde:"lateral do manche",        dedo:"indicador direito" },
  wep:           { botao:"Supp. 2", voz:"botão extra dois", onde:"base do acelerador", dedo:"mão esquerda" },
  motor_manual:  { botao:"Supp. 1", voz:"botão extra um",   onde:"base do acelerador", dedo:"mão esquerda" },
  saltar:        { botao:"□ + ✕", voz:"Quadrado mais Cruz", onde:"acelerador",      dedo:"polegar esquerdo" }
};

/* Sinónimos por função — para o motor perceber do que falas */
const FUNCOES_SINONIMOS = {
  trem:          ["trem","trem de aterragem","rodas","rodagem","landing gear","pouso","gear"],
  flaps_baixar:  ["flaps","flap","abas","aba","flaps para baixo","baixar flaps"],
  flaps_subir:   ["recolher flaps","flaps para cima","subir flaps"],
  metralhadoras: ["metralhadoras","metralhadora","disparar","tiro","atirar","armas","balas","fogo"],
  canhoes:       ["canhao","canhoes","canhão","canhões","calibre grande","vinte milimetros"],
  foguetes:      ["foguetes","foguete","rockets","rocket"],
  bombas:        ["bomba","bombas","bombardear","largar bombas"],
  recarregar:    ["recarregar","recarga","municao","munições","municoes"],
  airbrake:      ["travao aerodinamico","travão","airbrake","aerofreio","travoes"],
  leme:          ["leme","rudder","direcao","direção"],
  trim:          ["trim","compensador","compensacao"],
  vista:         ["vista","recentrar","centrar","reset view","recentrar vista","olhar"],
  wep:           ["wep","potencia de emergencia","potência","turbo","boost","emergencia"],
  motor_manual:  ["motor manual","controlo do motor","radiador","passo de helice","helice","mistura"],
  saltar:        ["saltar","ejetar","ejectar","abandonar","paraquedas","bail out"]
};

/* ------------------------------------------------------------
   2. ARMAMENTO — o tablet do piloto
   Regras derivadas do modelo de danos do War Thunder,
   que o Aces of Thunder herda.
------------------------------------------------------------ */
const REGRAS_CINTOS = {
  titulo: "Cintos de munição",
  geral: [
    "Metralhadoras (7,7 a 12,7 mm): escolhe o cinto com mais AP-I ou API — normalmente 'Stealth' ou 'Universal'.",
    "Canhões (20 mm ou mais): escolhe o cinto com mais HE ou HEI — normalmente 'Air Targets'.",
    "'Stealth' não tem tracejantes: fazes mais dano e o inimigo não vê de onde vem o tiro. Mas é mais difícil de apontar.",
    "'Tracers' ajuda a aprender a apontar, mas denuncia-te e costuma dar menos dano.",
    "'Ground Targets' só se fores atacar alvos no solo."
  ],
  // conselho por avião: {cinto recomendado, alternativa, porquê}
  porAviao: {
    p51:  { arma:"12,7 mm M2 Browning", rec:"Stealth", alt:"Universal",
            porque:"São Brownings tardias: Stealth e Universal têm quase o mesmo poder, mas Stealth não te denuncia." },
    p47:  { arma:"8× 12,7 mm M2", rec:"Stealth", alt:"Universal",
            porque:"Com oito metralhadoras já tens volume de fogo que chegue. Não precisas de tracejantes." },
    p63:  { arma:"37 mm M4 + 4× 12,7 mm", rec:"Default (37mm)", alt:"Universal",
            porque:"No 37 mm o cinto Default é todo HEFI-T: máximo dano contra aviões." },
    p40:  { arma:"6× 12,7 mm M2 (early)", rec:"Stealth", alt:"Universal",
            porque:"Brownings antigas — evita 'Tracers', que aqui é quase só tracejante puro e faz pouco dano." },
    f4u:  { arma:"6× 12,7 mm M2", rec:"Stealth", alt:"Universal", porque:"Mesma regra das Brownings tardias." },
    sbd:  { arma:"2× 12,7 mm + bombas", rec:"Universal", alt:"Ground Targets",
            porque:"Vais atacar o solo: o que importa é a bomba, não o cinto." },
    sb2c: { arma:"4× 12,7 mm + 2× 20 mm", rec:"Air Targets (20mm)", alt:"Universal", porque:"Os canhões AN/M2 são dos melhores 20 mm do jogo com cinto Air Targets." },
    spitfirevb:{ arma:"2× 20 mm Hispano + 4× .303", rec:"Air Targets", alt:"Stealth",
            porque:"Nos Hispano Mk II o cinto Air Targets tem o máximo de HE — arranca asas." },
    spitfireia:{ arma:"8× .303 Browning", rec:"Stealth", alt:"Tracers",
            porque:"Só metralhadoras leves: precisas de todo o dano possível e de rajadas longas." },
    typhoon:{ arma:"4× 20 mm Hispano Mk II", rec:"Air Targets", alt:"Stealth",
            porque:"Quatro Hispano com HE é fogo devastador." },
    firefly:{ arma:"4× 20 mm Hispano Mk II", rec:"Air Targets", alt:"Stealth", porque:"Igual ao Typhoon." },
    mosquito:{arma:"4× 20 mm + 4× .303", rec:"Air Targets", alt:"Stealth",
            porque:"Tudo concentrado no nariz: sem convergência para calcular, é só apontar." },
    hurricane:{arma:"Canhões anti-tanque + foguetes", rec:"Ground Targets", alt:"—",
            porque:"Este avião é para alvos no solo." },
    bf109f:{ arma:"20 mm MG 151 + 2× 7,92 mm", rec:"Air Targets", alt:"Stealth",
            porque:"No MG 151/20 o Air Targets tem mais explosivo. Stealth é ligeiramente mais rápido." },
    bf109g:{ arma:"20 mm MG 151 + 2× 13 mm", rec:"Air Targets", alt:"Stealth", porque:"Igual ao F-4." },
    fw190: { arma:"4× 20 mm + 2× 7,92 mm", rec:"Air Targets", alt:"Stealth",
            porque:"Quatro canhões com HE: uma rajada curta desfaz um caça." },
    bf110: { arma:"2× 20 mm + 4× 7,92 mm", rec:"Air Targets", alt:"Stealth", porque:"Fogo frontal concentrado — usa HE." },
    yak9t: { arma:"37 mm NS-37 + 12,7 mm", rec:"Air Targets", alt:"Default",
            porque:"Só ~30 munições no 37 mm. Cada tiro tem de contar: usa o cinto com mais HE." },
    yak3:  { arma:"20 mm ShVAK + 12,7 mm", rec:"Tracers", alt:"Ground Targets",
            porque:"No ShVAK o cinto Tracers é FI-T, o obus mais forte destes canhões." },
    la5fn: { arma:"2× 20 mm ShVAK", rec:"Tracers", alt:"Ground Targets", porque:"Mesma regra do ShVAK." },
    il2:   { arma:"Canhões + bombas + foguetes", rec:"Ground Targets", alt:"—",
            porque:"És um avião de ataque ao solo. Carrega para tanques." },
    a6m3:  { arma:"2× 20 mm Type 99 + 2× 7,7 mm", rec:"Universal", alt:"Tracers",
            porque:"No Type 99 o Universal usa HEF com o dobro do explosivo." },
    ki61:  { arma:"2× 20 mm Ho-5 + 12,7 mm", rec:"Universal", alt:"Stealth",
            porque:"Nos Ho-5 a diferença é mínima — usa Universal, é mais fácil de apontar." },
    j2m2:  { arma:"2× 20 mm + 2× 7,7 mm", rec:"Universal", alt:"Tracers", porque:"Mesma regra dos canhões japoneses." },
    d4y3:  { arma:"Metralhadoras + bombas", rec:"Universal", alt:"—", porque:"Bombardeiro: o cinto pouco importa." },
    dr1:{arma:"2× 7,92 mm Spandau",rec:"—",alt:"—",porque:"Aviões da Primeira Guerra não têm escolha de cinto."},
    dvii:{arma:"2× 7,92 mm Spandau",rec:"—",alt:"—",porque:"Sem escolha de cinto."},
    camel:{arma:"2× 7,7 mm Vickers",rec:"—",alt:"—",porque:"Sem escolha de cinto."},
    spadsxiii:{arma:"2× 7,7 mm Vickers",rec:"—",alt:"—",porque:"Sem escolha de cinto."}
  }
};

/* Conselho de carga por tipo de missão */
const CARGA_POR_MISSAO = {
  cacar: {
    nome:"Caça a caças / superioridade aérea",
    conselho:"Sem carga. 'Without load'.",
    porque:"Bombas e foguetes são peso e resistência ao ar. Numa luta de caças, cada quilo a mais é uma curva pior e menos subida. Vais para o ar limpo."
  },
  bombardear: {
    nome:"Atacar alvos no solo",
    conselho:"Carga máxima de bombas que o avião aguente.",
    porque:"Vais largar tudo logo na primeira passagem e depois ficas leve. Escolhe a bomba maior disponível — o dano cresce mais depressa que o peso."
  },
  misto: {
    nome:"Missão mista / campanha",
    conselho:"Carga leve: uma bomba pequena ou foguetes.",
    porque:"Compromisso. Consegues atacar um alvo de oportunidade sem ficares indefeso se aparecer um caça."
  },
  interceptar: {
    nome:"Intercetar bombardeiros",
    conselho:"Sem carga, cinto com máximo de HE.",
    porque:"Precisas de subir depressa e de poder de fogo. Bombardeiros são grandes e resistentes: HE é o que os desfaz."
  }
};

/* ------------------------------------------------------------
   3. INSTRUÇÕES DE VOO — cada uma sabe o botão que precisa
------------------------------------------------------------ */
const INSTRUCOES = {
  descolar: {
    funcao:null, fase:"terra", proximaFase:"descolagem",
    variantes:[
      { ecra:"Acelerador a fundo — mas progressivo. Leme à direita para compensar o binário.",
        voz:"Acelerador a fundo, mas progressivo. E leme à direita, que o binário puxa o nariz." },
      { ecra:"Pista livre. Potência máxima, sem rajadas — o binário capota-te.",
        voz:"Pista livre. Potência máxima, sem rajadas, senão o binário capota-te." },
      { ecra:"Vamos a isso. Acelerador para a frente devagar, e corrige com leme.",
        voz:"Vamos a isso. Acelerador para a frente devagar, e vai corrigindo com o leme." }
    ]
  },
  recolher_trem: {
    funcao:"trem", fase:"descolagem", proximaFase:"subida",
    variantes:[
      { ecra:"Estás no ar. Trem em cima — {botao}.", voz:"Estás no ar. Recolhe o trem. {vozBotao}." },
      { ecra:"Razão de subida positiva. Recolhe o trem — {botao}.", voz:"Razão de subida positiva. Recolhe o trem, {vozBotao}." },
      { ecra:"Rodas para dentro — {botao}, {onde}.", voz:"Rodas para dentro. {vozBotao}, {onde}." }
    ]
  },
  recolher_flaps: {
    funcao:"flaps_subir", fase:"subida",
    variantes:[
      { ecra:"Flaps em cima — {botao}.", voz:"Flaps em cima. {vozBotao}." },
      { ecra:"Já tens velocidade. Recolhe os flaps — {botao}.", voz:"Já tens velocidade. Recolhe os flaps, {vozBotao}." }
    ]
  },
  subir: {
    funcao:null, fase:"subida", proximaFase:"cruzeiro",
    variantes:[
      { ecra:"Sobe. Radiador aberto. A altitude é a tua conta bancária.",
        voz:"Sobe. Mantém o radiador aberto. A altitude é a tua conta bancária." },
      { ecra:"Ganha altura antes de ires para a luta. Quem está por cima escolhe o combate.",
        voz:"Ganha altura antes de ires para a luta. Quem está por cima é quem escolhe o combate." }
    ]
  },
  aterrar: {
    funcao:"trem", fase:"cruzeiro", proximaFase:"aproximacao",
    variantes:[
      { ecra:"A caminho de casa. Reduz cedo, trem em baixo — {botao} — e flaps de aterragem.",
        voz:"A caminho de casa. Reduz cedo. Trem em baixo, {vozBotao}. E flaps de aterragem." },
      { ecra:"Aproximação. Trem em baixo ({botao}), curva final larga — não vês nada em frente.",
        voz:"Aproximação. Trem em baixo, {vozBotao}. Faz a curva final larga, porque com o nariz alto não vês a pista." }
    ]
  },
  emergencia_perseguido: {
    funcao:null, fase:"*",
    variantes:[
      { ecra:"Curva com força na direcção dele! Nunca a direito.",
        voz:"Curva com força na direcção dele! Nunca fujas a direito!" },
      { ecra:"Break! Curva máxima. Força-o a passar-te à frente.",
        voz:"Curva máxima! Força-o a passar-te à frente!" }
    ]
  },
  emergencia_fogo: {
    funcao:null, fase:"*",
    variantes:[
      { ecra:"Acelerador a zero e pica! O vento apaga as chamas.",
        voz:"Acelerador a zero e pica! O vento apaga as chamas." }
    ]
  },
  emergencia_parafuso: {
    funcao:null, fase:"*",
    variantes:[
      { ecra:"Acelerador a zero. Manche à frente. Leme ao contrário da rotação. Espera — só depois puxa.",
        voz:"Acelerador a zero. Manche à frente. Leme ao contrário da rotação. Espera. Só depois é que puxas." }
    ]
  }
};

/* ------------------------------------------------------------
   4. FACTOS E EFEMÉRIDES
   Fontes: site oficial acesofthunder.net, wiki War Thunder, Wikipédia
------------------------------------------------------------ */
const FACTOS = {
  p51: [
    { t:"historia", f:"O Mustang nasceu de uma encomenda britânica em 1940. A North American desenhou-o de raiz em 102 dias." },
    { t:"curiosidade", f:"Só ficou lendário quando lhe puseram o motor britânico Rolls-Royce Merlin. Com o motor original americano era medíocre acima dos 4500 metros." },
    { t:"combate", f:"Foi o Mustang que permitiu escoltar bombardeiros até Berlim e voltar. Mudou o curso da guerra aérea na Europa." }
  ],
  p47: [
    { t:"curiosidade", f:"Chamavam-lhe 'Jug', de jarro, pela silhueta atarracada. Pesava mais de sete toneladas — o caça monomotor mais pesado da guerra." },
    { t:"combate", f:"Há relatos de P-47 que voltaram para casa com metade de um cilindro do motor arrancado. A robustez era lendária." }
  ],
  p63: [
    { t:"curiosidade", f:"Tinha o motor atrás do piloto, com um veio a passar por baixo do assento até à hélice. Isso deixou espaço no nariz para o canhão de 37 milímetros." },
    { t:"historia", f:"Os Estados Unidos rejeitaram-no. Quase todos os Kingcobra foram para a União Soviética, onde foram muito apreciados." }
  ],
  p40: [{ t:"curiosidade", f:"As bocas de tubarão pintadas no nariz ficaram famosas com os Tigres Voadores na China — mas a ideia foi copiada de uma unidade alemã." }],
  f4u: [{ t:"curiosidade", f:"As asas em gaivota invertida não foram estética: a hélice era tão grande que precisava de espaço, e asas rectas obrigariam a um trem de aterragem altíssimo." },
        { t:"combate", f:"Os japoneses chamavam-lhe 'a morte sibilante', pelo som do ar nas entradas das asas." }],
  sbd: [{ t:"combate", f:"Em Midway, a 4 de junho de 1942, os Dauntless afundaram quatro porta-aviões japoneses em poucos minutos. Foi o ponto de viragem no Pacífico." }],
  sb2c:[{ t:"curiosidade", f:"As tripulações chamavam-lhe 'Beast'. Não era um elogio — era instável e difícil de aterrar num porta-aviões." }],
  bf109f:[
    { t:"historia", f:"O Friedrich é considerado o ponto de equilíbrio perfeito da linhagem 109: aerodinâmica limpa, sem os caroços de armamento das versões seguintes." },
    { t:"curiosidade", f:"Foram construídos quase 34 mil Bf 109. É o caça mais produzido da história." }],
  bf109g:[{ t:"curiosidade", f:"Os pilotos chamavam à versão G 'Beule', que significa inchaço, por causa das saliências sobre as metralhadoras." }],
  fw190:[
    { t:"historia", f:"Quando apareceu em 1941, a RAF pensou que fossem Curtiss Hawk franceses capturados. Foi um choque: superava o Spitfire V em tudo menos a curva." },
    { t:"curiosidade", f:"O apelido Würger significa picanço — um pássaro que empala as presas em espinhos." }],
  bf110:[{ t:"historia", f:"Foi concebido como 'Zerstörer', destruidor: um caça pesado de longo alcance. Falhou nesse papel na Batalha de Inglaterra, mas brilhou como caça nocturno." }],
  yak9t:[{ t:"curiosidade", f:"O canhão de 37 milímetros era tão potente que o avião abrandava visivelmente a cada disparo." }],
  yak3: [{ t:"historia", f:"Os alemães receberam uma ordem explícita: evitar o combate com caças Yak sem radiador de óleo debaixo do nariz, abaixo dos 5000 metros. Era o Yak-3." }],
  la5fn:[{ t:"curiosidade", f:"Ivan Kozhedub, o ás aliado mais bem sucedido da guerra com 64 vitórias, voou La-5FN." }],
  il2:  [
    { t:"historia", f:"Estaline enviou um telegrama a uma fábrica atrasada: 'O Exército Vermelho precisa do Il-2 como precisa de ar, como precisa de pão.' A produção acelerou." },
    { t:"curiosidade", f:"Com mais de 36 mil unidades, é o avião militar mais produzido de sempre. Os alemães chamavam-lhe 'a morte negra'." }],
  spitfirevb:[
    { t:"historia", f:"O desenho da asa elíptica não foi por estética: era a forma que permitia a asa mais fina possível a acomodar armamento e trem." },
    { t:"curiosidade", f:"O projectista R.J. Mitchell morreu em 1937, aos 42 anos, sem chegar a ver o Spitfire entrar em combate." }],
  spitfireia:[{ t:"combate", f:"Na Batalha de Inglaterra, no verão de 1940, os Spitfire Mk I enfrentaram os Bf 109 E enquanto os Hurricane atacavam os bombardeiros." }],
  typhoon:[{ t:"combate", f:"Na Normandia, em 1944, os Typhoon com foguetes tornaram-se o pesadelo das colunas blindadas alemãs." }],
  firefly:[{ t:"curiosidade", f:"Os flaps Youngman podiam ser estendidos em voo para apertar as curvas — raro num avião naval tão pesado." }],
  mosquito:[
    { t:"curiosidade", f:"Era feito de madeira: contraplacado de bétula e balsa. Chamavam-lhe 'a maravilha de madeira'. Nem sequer aparecia bem nos radares." },
    { t:"combate", f:"Em 1944, Mosquitos abriram a brecha na prisão de Amiens com bombardeamento de precisão a baixa altitude, para libertar prisioneiros da Resistência." }],
  hurricane:[{ t:"historia", f:"Na Batalha de Inglaterra os Hurricane derrubaram mais aviões alemães que os Spitfire e todas as defesas antiaéreas juntas. Mas foi o Spitfire que ficou com a fama." }],
  a6m3:[
    { t:"historia", f:"Nos primeiros meses da guerra do Pacífico o Zero era praticamente imbatível. Os Aliados criaram uma regra simples: nunca curvar com um Zero." },
    { t:"curiosidade", f:"A agilidade veio de um sacrifício brutal: nada de blindagem, nada de depósitos auto-selantes. Um único acerto certeiro incendiava-o." }],
  ki61:[{ t:"curiosidade", f:"Hien significa 'andorinha'. Os Aliados, ao verem o motor em linha, pensaram tratar-se de um Messerschmitt licenciado, e deram-lhe o nome de código 'Tony', de italiano." }],
  j2m2:[{ t:"historia", f:"Raiden significa 'trovão'. Foi desenhado especificamente para intercetar os B-29 que bombardeavam o Japão." }],
  d4y3:[{ t:"curiosidade", f:"Suisei significa 'cometa'. Era tão rápido que nas primeiras missões foi confundido com um caça." }],
  dr1: [
    { t:"historia", f:"Manfred von Richthofen, o Barão Vermelho, conseguiu as suas últimas 19 vitórias num Dr.I — e foi num Dr.I que morreu, a 21 de abril de 1918." },
    { t:"curiosidade", f:"Ao contrário do mito, nem todos os Dr.I eram vermelhos. Só o do Barão." }],
  dvii:[{ t:"historia", f:"O Tratado de Versalhes mencionou-o pelo nome: a Alemanha tinha de entregar 'todos os aviões D.VII'. É o único avião nomeado num tratado de paz." }],
  camel:[
    { t:"curiosidade", f:"O binário do motor rotativo era tão violento que muitos pilotos preferiam virar 270 graus à direita em vez de 90 à esquerda." },
    { t:"combate", f:"Derrubou mais aviões inimigos que qualquer outro avião aliado da Primeira Guerra: 1294 vitórias. Mas também matou 385 pilotos em acidentes de treino." }],
  spadsxiii:[
    { t:"historia", f:"René Fonck, o ás aliado mais condecorado da Primeira Guerra com 75 vitórias confirmadas, voava um SPAD S.XIII." },
    { t:"curiosidade", f:"Repara nos tubos de escape estranhamente compridos ao longo da fuselagem. Foram feitos assim de propósito, para as chamas do escape não encandearem o piloto." },
    { t:"efemeride", f:"Primeiro voo a 4 de abril de 1917. Foram construídos 8472 exemplares — o caça mais produzido da Primeira Guerra." }]
};

/* ------------------------------------------------------------
   5. AS DUAS PERSONALIDADES
------------------------------------------------------------ */
const PERSONALIDADES = {
  militar: {
    id:"militar", nome:"Sgt. Vieira", etiqueta:"Militar",
    descricao:"Seco, directo, eficiente. Diz o essencial e cala-se.",
    voz:{ rate:1.18, pitch:1.02 },   // rápido e firme, como uma ordem
    saudacao:[
      "Engenheiro de bordo em posição. Às ordens.",
      "Sistemas verificados. Pronto quando estiver."
    ],
    confirmacao:["Entendido.","Afirmativo.","Recebido.","Certo."],
    naoPercebi:[
      "Não percebi. Repete.",
      "Diz outra vez, mais devagar."
    ],
    elogio:["Bom trabalho.","Correcto."],
    // sufixo ocasional
    tempero:0        // 0 = nunca acrescenta comentários
  },
  veterano: {
    id:"veterano", nome:"Velho Aníbal", etiqueta:"Veterano",
    descricao:"Já viu de tudo. Ajuda bem, mas sempre com um comentário.",
    voz:{ rate:1.08, pitch:0.96 },   // mais calmo, mas nunca arrastado
    saudacao:[
      "Cá estamos outra vez. Vamos lá ver se hoje trazes o avião inteiro.",
      "Pronto para mais uma. Eu grito, tu carregas nos botões."
    ],
    confirmacao:["Está bem.","Certo.","Pois.","Vá lá."],
    naoPercebi:[
      "Isso não me diz nada. Tenta de outra maneira.",
      "Com o motor a rugir não te ouvi. Repete lá."
    ],
    elogio:["Não estiveste mal.","Ora aí está.","Até que enfim."],
    tempero:0.3,     // 30% das vezes acrescenta um comentário
    comentarios:[
      "E não me partas o avião, que a papelada é minha.",
      "Já vi pior. Já vi melhor, também.",
      "O mecânico agradece se voltares com as duas asas.",
      "Devagar. Estes aviões não perdoam pressa.",
      "Faz como te digo, não como te apetece."
    ]
  }
};

/* ------------------------------------------------------------
   6. FRASES DO SISTEMA (independentes da personalidade)
------------------------------------------------------------ */
const SISTEMA = {
  micLigado:  { ecra:"🎙️ Escuta contínua ligada", voz:"Escuta contínua. Estou aqui." },
  micDesligado:{ecra:"🔇 Escuta desligada",        voz:"Escuta desligada." },
  focoExpirado:{ecra:"Tecla para quê? Diz-me a manobra.",
                voz:"Tecla para quê? Diz-me a manobra: trem, flaps, travão?" },
  semFoco:    { ecra:"Não sei a que te referes. Diz o nome da manobra.",
                voz:"Não sei a que te referes. Diz-me o nome da manobra." }
};
