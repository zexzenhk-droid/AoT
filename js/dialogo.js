/* ============================================================
   AOT ENGENHEIRO — Motor de conversação
   ------------------------------------------------------------
   Substitui os 56 if/else em cascata por:
     · intenções declarativas com sinónimos, regex e negação
     · memória de foco (resolve "qual é a tecla?")
     · desempate pela fase do voo
     · variantes de resposta (nunca repete)
     · separação total ecrã / voz
   ============================================================ */
'use strict';

/* ------------------------------------------------------------
   NORMALIZAÇÃO — tira acentos, pontuação, espaços a mais
------------------------------------------------------------ */
function normalizar(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // acentos
    .replace(/[^\w\s]/g, " ")                           // pontuação
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------
   INTENÇÕES
   fases: em que fases do voo é válida ("*" = sempre)
   bloqueia: palavras que impedem o disparo (negação)
   peso: desempate quando várias batem
------------------------------------------------------------ */
const INTENCOES = [
  {
    id:"DESCOLAR", peso:8, fases:["terra"],
    frases:["descolar","levantar voo","levantar","vamos voar","vamos la","vamos",
            "partir","arrancar","decolar","voar","ir para o ar","bora","comecar",
            "iniciar voo","quero voar","podemos ir","estou pronto","pronto"],
    regex:[/vamos\s+(voar|nessa|la|embora)/, /(quero|posso|podemos)\s+.*(voar|descolar|ir)/],
    bloqueia:["nao","ainda nao","espera","calma"]
  },
  {
    id:"JA_NO_AR", peso:9, fases:["descolagem"],
    frases:["ja estou no ar","estou no ar","levantei","ja levantei","no ar","subi",
            "ja subi","descolei","ja descolei","estou a voar","consegui","ja esta"],
    regex:[/(ja|estou)\s+.*(ar|voar|voo|cima)/],
    bloqueia:["nao","ainda nao"]
  },
  {
    id:"AINDA_EM_TERRA", peso:14, fases:["terra","descolagem","subida"],
    frases:["ainda nao","nao levantei","ainda estou em terra","estou em terra",
            "na pista","ainda na pista","nao consegui","falhei","cai","despistei",
            "ainda estou no chao","estou no chao","no chao","ainda em terra"],
    regex:[/(ainda\s+)?nao\s+(levantei|descolei|consegui|estou)/,
           /(ainda\s+)?(estou\s+)?(em terra|no chao|na pista)/]
  },
  {
    id:"QUAL_BOTAO", peso:10, fases:["*"],
    frases:["qual e a tecla","qual a tecla","que tecla","qual e o botao","qual o botao",
            "que botao","onde carrego","onde e","onde fica","como faco","como e que faco",
            "que carrego","em que carrego","qual","onde"],
    regex:[/(qual|que|onde).*(tecla|botao|carrego|premir|clicar|carregar|usar)/,
           /como\s+(faco|e que faco|se faz)/,
           /como\s+(disparar|atirar|largar|recolher|baixar|subir|abrir|fechar|ativar|activar)/,
           /(o que|que)\s+(faco|fazer)\s+(a|ao|aos|as|com|com o|com os)/]
  },
  {
    id:"ATERRAR", peso:8, fases:["cruzeiro","subida","combate"],
    frases:["aterrar","aterragem","voltar","regressar","voltar a base","ir para casa",
            "pousar","descer","terminar","acabar","voltar para tras"],
    regex:[/(quero|vamos|podemos)\s+.*(aterrar|voltar|pousar|casa)/],
    bloqueia:["nao","ainda nao"]
  },
  {
    id:"PERSEGUIDO", peso:12, fases:["*"],
    frases:["tenho um na cauda","estao atras de mim","perseguido","na minha cauda",
            "atras de mim","socorro","ajuda","estou a levar tiros","levei um tiro",
            "estao a disparar","inimigo atras"],
    regex:[/(tenho|esta|estao)\s+.*(atras|cauda|cima)/, /(levo|estou a levar)\s+tiros?/]
  },
  {
    id:"FOGO", peso:13, fases:["*"],
    frases:["estou a arder","motor a arder","fogo","incendio","estou em chamas",
            "o motor pegou fogo","fumo","estou a deitar fumo"],
    regex:[/(arder|chamas|fogo|incendio|fumo)/]
  },
  {
    id:"PARAFUSO", peso:13, fases:["*"],
    frases:["parafuso","estou em parafuso","perdi o controlo","estou a rodopiar",
            "entrei em perda","perda","stall","spin","nao controlo"],
    regex:[/(parafuso|perda|rodopi|sem controlo|perdi o controlo)/]
  },
  {
    id:"INFO_AVIAO", peso:7, fases:["*"],
    frases:["fala me do aviao","informacao","informacoes","descricao","descreve",
            "ficha","dados","caracteristicas","este aviao","sobre o aviao",
            "conta me algo","curiosidade","historia","facto","factos"],
    regex:[/(fala|conta|diz).*(aviao|avioes|sobre|dele)/,
           /(que|qual).*(aviao|historia|curiosidade)/]
  },
  {
    /* história / contexto / efeméride do MAPA (não do avião) */
    id:"INFO_MAPA", peso:11, fases:["*"],
    frases:["fala me do mapa","sobre o mapa","que mapa e este","onde estamos",
            "contexto","historia do mapa","que batalha","que operacao",
            "o que aconteceu aqui","efemeride","efemerides","curiosidade do mapa"],
    regex:[/(fala|conta|diz|sobre).*(mapa|batalha|local|teatro|operacao)/,
           /(que|qual).*(mapa|batalha|teatro)/, /onde\s+(estamos|e isto)/,
           /efemerid/]
  },
  {
    id:"COMO_VOAR", peso:8, fases:["*"],
    frases:["como voo","como piloto","taticas","tatica","conselhos",
            "conselho","dicas","dica","como luto","como combato","estrategia"],
    /* NÃO apanha "como disparar" nem "o que faço aos flaps" —
       essas são perguntas de comando, tratadas por QUAL_BOTAO */
    regex:[/como\s+(voo|piloto|luto|combato)/, /(dicas?|conselhos?|taticas?)/]
  },
  {
    id:"ARMAMENTO", peso:9, fases:["terra","hangar"],
    frases:["armamento","armas","que armas","cinto","cintos","municao","municoes",
            "carga","bombas","que levo","o que levo","loadout","equipar"],
    regex:[/(que|qual).*(arma|cinto|municao|carga|levo)/, /(armamento|loadout)/]
  },
  {
    id:"VELOCIDADE", peso:8, fases:["*"],
    frases:["velocidade","a que velocidade","quantos","limite","limites",
            "quao rapido","que velocidade"],
    regex:[/(que|qual|quanta?)\s+.*velocidade/, /limites?\s+de/]
  },
  {
    id:"UNIDADES", peso:9, fases:["*"],
    frases:["que unidades","unidades","mostrador","velocimetro","milhas ou quilometros",
            "esta em que","nos ou quilometros"],
    regex:[/(unidade|mostrador|velocimetro|milhas|nos|knots)/]
  },
  {
    id:"REPETIR", peso:11, fases:["*"], exigirCurto:true,
    frases:["repete","outra vez","o que disseste","nao ouvi","nao percebi",
            "podes repetir","repete la"],
    regex:[/^(repete|repetir|outra vez)$/, /nao (ouvi|percebi)/]
  },
  {
    /* "E agora?" · "mais alguma coisa?" · "o que faço a seguir?"
       → o engenheiro avança para o passo seguinte da fase actual */
    id:"PROXIMO_PASSO", peso:12, fases:["*"],
    frases:["e agora","o que faco","o que faco agora","proximo","a seguir",
            "mais alguma coisa","mais alguma","que mais","e depois","continua",
            "o que se segue","falta alguma coisa","tenho que fazer algo",
            "algo mais","que faco","e a seguir"],
    regex:[/(e )?agora\s*\?*$/, /(o que|que)\s+(faco|fazer|falta|se segue)/,
           /mais alguma/, /(tenho|ha)\s+que\s+fazer/]
  },
  {
    /* "troca para o Spitfire" · "muda de avião para o P-51" */
    id:"TROCAR_AVIAO", peso:13, fases:["*"],
    frases:["troca de aviao","muda de aviao","trocar aviao","mudar de aviao",
            "quero outro aviao","outro aviao","mudar aeronave","troca para"],
    regex:[/(troca|muda|mudar|trocar)\s+(de\s+)?(aviao|aeronave|para)/]
  },
  {
    id:"MIC_CONTINUO", peso:11, fases:["*"],
    frases:["fica a escuta","sempre a escuta","escuta continua","fica a ouvir",
            "mantem te a escuta","ouve sempre","modo continuo","maos livres"],
    regex:[/(fica|mantem|estar|modo)\s+.*(escuta|ouvir|continuo|livres)/]
  },
  {
    id:"MIC_PARAR", peso:11, fases:["*"],
    frases:["para de ouvir","desliga o microfone","cala te","silencio",
            "nao ouvas","desliga a escuta"],
    regex:[/(para de ouvir|desliga.*(microfone|escuta)|cala te|silencio)/]
  },
  {
    id:"TROCAR_ENGENHEIRO", peso:11, fases:["*"],
    frases:["troca de engenheiro","outro engenheiro","muda de engenheiro",
            "quero o outro","trocar engenheiro","muda a personalidade"],
    regex:[/(troca|muda|outro)\s+.*(engenheiro|personalidade)/]
  },
  /* SIM/NÃO só disparam em frases MUITO curtas — senão "não levantei"
     seria lido como um simples "não". Daí o peso baixo e o exigirCurto. */
  {
    id:"SIM", peso:6, fases:["*"], exigirCurto:true,
    frases:["sim","ok","esta bem","certo","exacto","exato","isso","afirmativo",
            "correcto","correto","pois","claro","yes"],
    regex:[/^(sim|ok|certo|isso|exato|exacto|claro|afirmativo)$/]
  },
  {
    id:"NAO", peso:6, fases:["*"], exigirCurto:true,
    frases:["nao","negativo","nada disso","errado","nem por isso"],
    regex:[/^(nao|negativo|errado|nada disso)$/]
  },
  {
    id:"AJUDA", peso:5, fases:["*"],
    frases:["ajuda","o que posso perguntar","o que sabes","o que fazes",
            "opcoes","menu","comandos"],
    regex:[/(o que|que).*(posso|sabes|fazes)/]
  }
];

/* ------------------------------------------------------------
   RECONHECEDOR
------------------------------------------------------------ */
function reconhecer(texto, fase) {
  const t = normalizar(texto);
  if (!t) return null;
  const palavras = t.split(" ");
  const resultados = [];

  for (const intencao of INTENCOES) {
    // negação bloqueia
    if (intencao.bloqueia && intencao.bloqueia.some(b => t.includes(normalizar(b)))) continue;
    // SIM/NÃO só valem em respostas curtas (evita apanhar "não levantei")
    if (intencao.exigirCurto && palavras.length > 2) continue;

    let pontos = 0;

    // frases exactas ou contidas
    for (const f of intencao.frases) {
      const nf = normalizar(f);
      if (t === nf) { pontos = Math.max(pontos, 100); }
      else if (t.includes(nf)) {
        // frases mais longas valem mais (evita que "sim" ganhe a tudo)
        pontos = Math.max(pontos, 40 + nf.split(" ").length * 8);
      }
    }
    // regex
    if (intencao.regex) {
      for (const r of intencao.regex) if (r.test(t)) pontos = Math.max(pontos, 70);
    }
    if (!pontos) continue;

    // bónus se a fase bate certo
    if (intencao.fases.includes("*")) pontos += 2;
    else if (intencao.fases.includes(fase)) pontos += 25;
    else pontos -= 20;   // fora de contexto: penaliza mas não elimina

    pontos += intencao.peso;
    resultados.push({ id:intencao.id, pontos });
  }

  if (!resultados.length) return null;
  resultados.sort((a,b) => b.pontos - a.pontos);

  /* Uma acção concreta ganha sempre a um pedido genérico.
     "Vamos descolar. O que tenho que fazer?" → DESCOLAR, não PRÓXIMO_PASSO. */
  const CONCRETAS = ["DESCOLAR","JA_NO_AR","ATERRAR","AINDA_EM_TERRA",
                     "PERSEGUIDO","FOGO","PARAFUSO","TROCAR_AVIAO","QUAL_BOTAO"];
  const topo = resultados[0];
  if (topo.id === "PROXIMO_PASSO") {
    const alt = resultados.find(r => CONCRETAS.includes(r.id) && r.pontos >= 30);
    if (alt) return alt;
  }
  return topo.pontos >= 30 ? topo : null;
}

/* Procura uma função (trem, flaps...) mencionada no texto */
function detectarFuncao(texto) {
  const t = normalizar(texto);
  let melhor = null, maxLen = 0;
  for (const [funcao, sins] of Object.entries(FUNCOES_SINONIMOS)) {
    for (const s of sins) {
      const ns = normalizar(s);
      if (t.includes(ns) && ns.length > maxLen) { melhor = funcao; maxLen = ns.length; }
    }
  }
  return melhor;
}

/* ------------------------------------------------------------
   O ENGENHEIRO
------------------------------------------------------------ */
const FOCO_VALIDADE_MS = 90000;   // 90 s

class Engenheiro {
  constructor(opcoes = {}) {
    this.piloto      = opcoes.piloto || "";
    this.tratamento  = opcoes.tratamento || "tu";        // "tu" | "comandante"
    this.persona     = PERSONALIDADES[opcoes.persona || "militar"];
    this.aviao       = opcoes.aviao || null;             // objecto de AVIOES
    this.missao      = opcoes.missao || null;            // {mapa,hora,meteo,combustivel}
    this.bindings    = opcoes.bindings || BINDINGS_OMISSAO;
    this.fase        = "terra";
    this.foco        = null;
    this.focoEm      = 0;
    this.pendente    = null;      // pergunta à espera de sim/não
    this.ultimaResposta = null;
    this.usadas      = {};        // variantes já usadas por chave
    this.historico   = [];
  }

  /* --- foco --- */
  definirFoco(funcao) { if (funcao) { this.foco = funcao; this.focoEm = Date.now(); } }
  focoValido() { return this.foco && (Date.now() - this.focoEm) < FOCO_VALIDADE_MS; }

  /* --- escolher variante sem repetir a anterior --- */
  escolher(chave, lista) {
    if (!lista || !lista.length) return null;
    if (lista.length === 1) return lista[0];
    const ultima = this.usadas[chave];
    const opcoes = lista.filter((_, i) => i !== ultima);
    const i = Math.floor(Math.random() * opcoes.length);
    const escolhida = opcoes[i];
    this.usadas[chave] = lista.indexOf(escolhida);
    return escolhida;
  }

  /* --- preencher {botao} {vozBotao} {onde} {dedo} --- */
  preencher(txt, funcao) {
    if (!txt) return txt;
    const b = this.bindings[funcao];
    if (!b) return txt.replace(/\{\w+\}/g, "");
    return txt
      .replace(/\{botao\}/g,    b.botao)
      .replace(/\{vozBotao\}/g, b.voz)
      .replace(/\{onde\}/g,     b.onde)
      .replace(/\{dedo\}/g,     b.dedo);
  }

  /* --- tratamento --- */
  tratar() {
    if (this.tratamento === "comandante")
      return this.piloto ? `Comandante ${this.piloto}` : "Comandante";
    return this.piloto || "";
  }

  /* --- tempero da personalidade --- */
  temperar(r) {
    const p = this.persona;
    if (p.tempero && p.comentarios && Math.random() < p.tempero) {
      const c = p.comentarios[Math.floor(Math.random() * p.comentarios.length)];
      return { ecra: r.ecra + " " + c, voz: r.voz + " " + c };
    }
    return r;
  }

  /* --- emitir uma instrução --- */
  instrucao(chave) {
    const inst = INSTRUCOES[chave];
    if (!inst) return null;
    const v = this.escolher("i_" + chave, inst.variantes);
    if (inst.funcao) this.definirFoco(inst.funcao);
    if (inst.proximaFase) this.fase = inst.proximaFase;
    let r = { ecra: this.preencher(v.ecra, inst.funcao),
              voz:  this.preencher(v.voz,  inst.funcao) };

    /* A descolagem tem SEMPRE de trazer a velocidade de rotação —
       é a primeira coisa que um piloto precisa de saber. */
    if (chave === "descolar") {
      const vr = this.velocidadeRotacao();
      if (vr) { r.ecra += "\n" + vr.ecra; r.voz += " " + vr.voz; }
    }
    /* A aterragem traz a velocidade de aproximação. */
    if (chave === "aterrar") {
      const va = this.velocidadeAproximacao();
      if (va) { r.ecra += "\n" + va.ecra; r.voz += " " + va.voz; }
    }
    return this.temperar(r);
  }

  /* --- velocidade de rotação (descolagem) --- */
  velocidadeRotacao() {
    if (!this.aviao || typeof LIMITES === "undefined") return null;
    const lim = LIMITES[this.aviao.id];
    if (!lim || !lim.rotacao) return null;
    const id = this.aviao.id;
    const vE = k => (typeof velocidadeEcra === "function") ? velocidadeEcra(k, id) : k + " km/h";
    const vV = k => (typeof velocidadeVoz  === "function") ? velocidadeVoz(k, id)  : k + " quilómetros";
    return {
      ecra: `Puxa por volta dos ${vE(lim.rotacao)}.`,
      voz:  `Puxa por volta dos ${vV(lim.rotacao)}.`
    };
  }

  /* --- velocidade de aproximação (aterragem) --- */
  velocidadeAproximacao() {
    if (!this.aviao || typeof LIMITES === "undefined") return null;
    const lim = LIMITES[this.aviao.id];
    if (!lim || !lim.aprox_ap) return null;
    const id = this.aviao.id;
    const vE = k => (typeof velocidadeEcra === "function") ? velocidadeEcra(k, id) : k + " km/h";
    const vV = k => (typeof velocidadeVoz  === "function") ? velocidadeVoz(k, id)  : k + " quilómetros";
    return {
      ecra: `Aproxima a uns ${vE(lim.aprox_ap)}.`,
      voz:  `Aproxima a uns ${vV(lim.aprox_ap)}.`
    };
  }

  /* --- responder "qual é a tecla?" --- */
  responderBotao(funcaoExplicita) {
    const funcao = funcaoExplicita
      || (this.focoValido() ? this.foco : null);

    if (!funcao) {
      // Se HOUVE um foco mas expirou, o palpite mais provável é esse mesmo
      // — não outra função qualquer. Perguntar-lhe é mais honesto.
      if (this.foco) {
        const b = this.bindings[this.foco];
        this.pendente = { tipo:"confirmar_funcao", funcao:this.foco };
        return { ecra:`Já lá vai algum tempo. Ainda falas ${this.nomeFuncao(this.foco)}?`,
                 voz: `Já lá vai algum tempo. Ainda estás a falar d${this.nomeFuncao(this.foco).startsWith("o ")?"o":"a"} ${this.nomeFuncao(this.foco).replace(/^[oa]s? /,"")}?` };
      }
      // nunca houve foco: adivinha pela fase, mas confirma
      const palpite = { descolagem:"trem", subida:"flaps_subir",
                        aproximacao:"trem", combate:"metralhadoras" }[this.fase];
      if (palpite) {
        const b = this.bindings[palpite];
        this.pendente = { tipo:"confirmar_funcao", funcao:palpite };
        return { ecra:`Presumo que seja ${this.nomeFuncao(palpite)} — ${b.botao}. É isso?`,
                 voz: `Presumo que seja ${this.nomeFuncao(palpite)}. ${b.voz}. É isso?` };
      }
      return SISTEMA.semFoco;
    }

    const b = this.bindings[funcao];
    if (!b) return SISTEMA.semFoco;
    this.definirFoco(funcao);   // renova o foco
    return {
      ecra: `${b.botao} — ${b.onde}, ${b.dedo}.`,
      voz:  `${b.voz}. ${b.onde}, ${b.dedo}.`
    };
  }

  nomeFuncao(f) {
    return { trem:"o trem", flaps_baixar:"os flaps", flaps_subir:"recolher os flaps",
             metralhadoras:"as metralhadoras", canhoes:"os canhões", bombas:"as bombas",
             foguetes:"os foguetes", airbrake:"o travão aerodinâmico",
             vista:"recentrar a vista", wep:"o WEP", saltar:"saltar" }[f] || f;
  }

  /* ==========================================================
     PONTO DE ENTRADA
     ========================================================== */
  ouvir(texto) {
    const r = this._processar(texto);
    this.historico.push({ piloto: texto, engenheiro: r.ecra, t: Date.now() });
    if (this.historico.length > 10) this.historico.shift();
    this.ultimaResposta = r;
    return r;
  }

  _processar(texto) {
    const funcaoDita = detectarFuncao(texto);
    const m = reconhecer(texto, this.fase);

    /* resposta a uma pergunta pendente */
    if (this.pendente && m) {
      if (m.id === "SIM") {
        const p = this.pendente; this.pendente = null;
        if (p.tipo === "confirmar_funcao") return this.responderBotao(p.funcao);
      }
      if (m.id === "NAO") {
        this.pendente = null;
        return { ecra:"Então diz-me qual é a manobra.",
                 voz:"Então diz-me qual é a manobra." };
      }
    }

    if (!m) {
      // não reconheceu a intenção, mas percebeu a função → dá o botão
      if (funcaoDita) return this.responderBotao(funcaoDita);
      const np = this.escolher("naoPercebi", this.persona.naoPercebi);
      return { ecra: np, voz: np };
    }

    switch (m.id) {

      case "QUAL_BOTAO":
        return this.responderBotao(funcaoDita);

      case "PROXIMO_PASSO":
        /* Se a pergunta nomeia uma função ("o que faço aos flaps?"),
           o piloto quer o comando dessa função — não o passo seguinte. */
        if (funcaoDita) return this.responderBotao(funcaoDita);
        return this.proximoPasso();

      case "TROCAR_AVIAO": {
        const alvo = this.detectarAviaoNoTexto(texto);
        if (alvo) return { ecra:`A trocar para ${alvo.nome}.`,
                           voz:`A trocar para o ${alvo.voz}.`,
                           accao:"TROCAR_AVIAO", aviaoId:alvo.id };
        return { ecra:"Qual avião queres?", voz:"Qual avião queres?",
                 accao:"ABRIR_HANGAR" };
      }

      case "DESCOLAR": {
        const r = this.instrucao("descolar");
        const t = this.tratar();
        if (t && Math.random() < 0.4) {
          return { ecra:`${t}, ${r.ecra.charAt(0).toLowerCase()}${r.ecra.slice(1)}`,
                   voz: `${t}, ${r.voz.charAt(0).toLowerCase()}${r.voz.slice(1)}` };
        }
        return r;
      }

      case "JA_NO_AR":
        return this.instrucao("recolher_trem");

      case "AINDA_EM_TERRA":
        this.fase = "terra";
        return { ecra:"Entendido, ainda em terra. Acelerador a fundo e leme à direita.",
                 voz:"Entendido, ainda em terra. Acelerador a fundo e leme à direita." };

      case "ATERRAR":
        return this.instrucao("aterrar");

      case "PERSEGUIDO":
        return this.instrucao("emergencia_perseguido");

      case "FOGO":
        return this.instrucao("emergencia_fogo");

      case "PARAFUSO":
        return this.instrucao("emergencia_parafuso");

      case "INFO_AVIAO":
        return this.factoAviao(texto);

      case "INFO_MAPA":
        return this.factoMapa(texto);

      case "COMO_VOAR": {
        if (!this.aviao) return { ecra:"Escolhe primeiro o avião.", voz:"Escolhe primeiro o avião." };
        const t = this.aviao.taticas;
        const dica = t[Math.floor(Math.random() * t.length)];
        return { ecra: dica, voz: dica };
      }

      case "ARMAMENTO":
        return this.conselhoArmamento();

      case "VELOCIDADE": {
        const t = normalizar(texto);
        const ctx = /aterr|pousar|aproxim|descer/.test(t) ? "aterrar" : null;
        return this.conselhoVelocidade(ctx);
      }

      case "UNIDADES": {
        if (!this.aviao) return { ecra:"Escolhe primeiro o avião.", voz:"Escolhe primeiro o avião." };
        const a = (typeof avisoUnidade === "function") ? avisoUnidade(this.aviao.id) : null;
        if (!a) return { ecra:"Mostrador em km/h. Sem conversões.", voz:"Mostrador em quilómetros por hora. Sem conversões." };
        return { ecra:a.ecra, voz:a.voz };
      }

      case "REPETIR":
        return this.ultimaResposta || { ecra:"Ainda não disse nada.", voz:"Ainda não disse nada." };

      case "MIC_CONTINUO":
        return { ...SISTEMA.micLigado, accao:"MIC_ON" };

      case "MIC_PARAR":
        return { ...SISTEMA.micDesligado, accao:"MIC_OFF" };

      case "TROCAR_ENGENHEIRO": {
        const novo = this.persona.id === "militar" ? "veterano" : "militar";
        this.persona = PERSONALIDADES[novo];
        const s = this.escolher("saud", this.persona.saudacao);
        return { ecra:`[${this.persona.nome}] ${s}`, voz:s, accao:"TROCAR_PERSONA", persona:novo };
      }

      case "SIM":
      case "NAO": {
        const c = this.escolher("conf", this.persona.confirmacao);
        return { ecra:c, voz:c };
      }

      case "AJUDA":
        return {
          ecra:"Podes pedir: descolar · aterrar · qual é a tecla · informação do avião · " +
               "tácticas · armamento · velocidades. Em emergência: 'tenho um na cauda', " +
               "'estou a arder', 'entrei em parafuso'.",
          voz:"Podes pedir para descolar ou aterrar, perguntar qual é a tecla, " +
              "pedir informação sobre o avião, tácticas, armamento ou velocidades. " +
              "Em emergência, diz: tenho um na cauda, estou a arder, ou entrei em parafuso."
        };

      default: {
        const np = this.escolher("naoPercebi", this.persona.naoPercebi);
        return { ecra:np, voz:np };
      }
    }
  }

  /* --- guião de fase: o que vem a seguir ---
     Isto é o que faltava: o engenheiro CONDUZ o voo em vez de
     esperar sempre que lhe perguntem. */
  proximoPasso() {
    const guiao = {
      terra: [
        { ecra:"Confirma o esquema de controlo em HOTAS e recentra a vista — {botao}.", f:"vista" },
        { ecra:"Canópia fechada, acelerador em ralenti. Quando quiseres, dizemos vamos.", f:null },
        { ecra:"Pronto para descolar? Diz-me quando.", f:null }
      ],
      descolagem: [
        { ecra:"Acelerador a fundo, progressivo. Leme à direita para compensar o binário.", f:null },
        { ecra:"À velocidade de rotação, puxa suave. Diz-me quando estiveres no ar.", f:null }
      ],
      subida: [
        { ecra:"Trem em cima — {botao}.", f:"trem" },
        { ecra:"Agora os flaps: recolhe-os — {botao}.", f:"flaps_subir" },
        { ecra:"Radiador aberto e sobe. A altitude é a tua conta bancária.", f:null },
        { ecra:"Estás em cruzeiro. Verifica a cauda de vez em quando.", f:null }
      ],
      cruzeiro: [
        { ecra:"Mantém a velocidade e vigia a temperatura do motor.", f:null },
        { ecra:"Verifica a cauda — vira mesmo a cabeça, estás em VR.", f:null },
        { ecra:"Quando quiseres voltar, diz-me e preparo a aproximação.", f:null }
      ],
      aproximacao: [
        { ecra:"Reduz a potência bem cedo. Estes aviões não travam no ar.", f:null },
        { ecra:"Trem em baixo — {botao}. Confirma com os olhos, olha para a asa.", f:"trem" },
        { ecra:"Flaps de aterragem — {botao}.", f:"flaps_baixar" },
        { ecra:"Curva final larga. Com o nariz alto não vês a pista em frente.", f:null },
        { ecra:"Arredonda com o nariz em cima e trava suave. Travar a fundo capota-te.", f:null }
      ],
      combate: [
        { ecra:"Mantém a energia. Nunca voes a direito.", f:null },
        { ecra:"Rajadas curtas a 300 metros. Estabiliza antes de disparar.", f:null }
      ]
    };
    const lista = guiao[this.fase] || guiao.cruzeiro;
    this.passo = (this.passo || {});
    const i = this.passo[this.fase] || 0;
    const p = lista[Math.min(i, lista.length - 1)];
    this.passo[this.fase] = Math.min(i + 1, lista.length - 1);
    if (p.f) this.definirFoco(p.f);
    const txt = this.preencher(p.ecra, p.f);
    const vozTxt = this.preencher(
      p.ecra.replace(/\{botao\}/g, "{vozBotao}"), p.f);
    return this.temperar({ ecra: txt, voz: vozTxt });
  }

  /* --- encontrar um avião mencionado por nome --- */
  detectarAviaoNoTexto(texto) {
    if (typeof AVIOES === "undefined") return null;
    const t = normalizar(texto);
    let melhor = null, max = 0;
    for (const a of AVIOES) {
      const cands = [a.nome, a.familia, a.id];
      for (const c of cands) {
        const nc = normalizar(String(c).replace(/["']/g, ""));
        if (nc.length > 2 && t.includes(nc) && nc.length > max) { melhor = a; max = nc.length; }
      }
    }
    return melhor;
  }

  /* --- factos --- */
  factoAviao(texto) {
    if (!this.aviao) return { ecra:"Escolhe primeiro o avião.", voz:"Escolhe primeiro o avião." };
    const lista = FACTOS[this.aviao.id];
    if (!lista || !lista.length) {
      return { ecra: this.aviao.forte, voz: this.aviao.forte };
    }
    const t = normalizar(texto);
    let filtrada = lista;
    if (/histori/.test(t))     filtrada = lista.filter(f => f.t === "historia").concat(lista);
    if (/curiosidade/.test(t)) filtrada = lista.filter(f => f.t === "curiosidade").concat(lista);
    if (/combate|guerra/.test(t)) filtrada = lista.filter(f => f.t === "combate").concat(lista);
    const f = this.escolher("facto_" + this.aviao.id, filtrada);
    return { ecra: f.f, voz: f.f };
  }

  /* --- história e efemérides do mapa --- */
  factoMapa(texto) {
    if (typeof mapaPorId !== "function" || !this.missao)
      return { ecra:"Ainda não escolheste a missão.", voz:"Ainda não escolheste a missão." };
    const m = mapaPorId(this.missao.mapa);
    if (!m) return { ecra:"Não sei em que mapa estamos.", voz:"Não sei em que mapa estamos." };

    const t = normalizar(texto);
    /* efeméride / o que aconteceu → o facto histórico
       contexto / onde estamos    → a descrição do terreno */
    if (/efemerid|aconteceu|historia|batalha|curiosidade/.test(t)) {
      return { ecra:`${m.nome}, ${m.ano}.\n${m.facto}`,
               voz:  `${m.nome}, ${m.ano}. ${m.facto}` };
    }
    return {
      ecra: `${m.nome}, ${m.ano} — ${m.teatro}.\n${m.contexto}\n\n${m.conselho}\n\n💡 ${m.facto}`,
      voz:  `${m.nome}, ${m.ano}. ${m.contexto} ${m.conselho} ${m.facto}`
    };
  }

  /* --- armamento --- */
  conselhoArmamento(missao) {
    if (!this.aviao) return { ecra:"Escolhe primeiro o avião.", voz:"Escolhe primeiro o avião." };
    const c = REGRAS_CINTOS.porAviao[this.aviao.id];
    if (!c) return { ecra:"Sem dados de armamento para este avião.", voz:"Não tenho dados de armamento para este avião." };
    if (c.rec === "—") {
      return { ecra:`${c.arma}. ${c.porque}`, voz:`${c.arma}. ${c.porque}` };
    }
    const ecra = `${c.arma}\nCinto: ${c.rec}${c.alt !== "—" ? ` (alternativa: ${c.alt})` : ""}\n${c.porque}`;
    const voz  = `Armamento: ${c.arma}. Recomendo o cinto ${c.rec}. ${c.porque}`;
    return { ecra, voz };
  }

  /* --- velocidades --- */
  conselhoVelocidade(contexto) {
    if (!this.aviao) return { ecra:"Escolhe primeiro o avião.", voz:"Escolhe primeiro o avião." };
    const id = this.aviao.id;
    const lim = (typeof LIMITES !== "undefined") ? LIMITES[id] : null;
    const u = (typeof unidadeDe === "function") ? unidadeDe(id) : { u:"kmh" };
    if (!lim) {
      return { ecra:`Mostrador em ${UNIDADES[u.u].sim}. Sem limites publicados para este avião.`,
               voz:`O mostrador está em ${UNIDADES[u.u].voz}. Não tenho limites publicados para este avião.` };
    }
    const vE = k => (typeof velocidadeEcra === "function") ? velocidadeEcra(k, id) : k + " km/h";
    const vV = k => (typeof velocidadeVoz  === "function") ? velocidadeVoz(k, id)  : k + " quilómetros";

    const linhas = [], falas = [];
    // Em aproximação, o que interessa é aterrar
    const aterrar = contexto === "aterrar" || this.fase === "aproximacao";
    if (aterrar) {
      if (lim.flapsL){ linhas.push(`Flaps de aterragem: máx ${vE(lim.flapsL)}`);
                       falas.push(`Flaps de aterragem até ${vV(lim.flapsL)}`); }
      if (lim.trem)  { linhas.push(`Trem: máx ${vE(lim.trem)}`);
                       falas.push(`trem até ${vV(lim.trem)}`); }
      linhas.push("Aproxima um pouco acima da perda e trava suave.");
      falas.push("Aproxima um pouco acima da velocidade de perda. E trava suave, senão capotas.");
    } else {
      if (lim.trem)  { linhas.push(`Trem: máx ${vE(lim.trem)}`);
                       falas.push(`Trem até ${vV(lim.trem)}`); }
      if (lim.flapsL){ linhas.push(`Flaps aterragem: ${vE(lim.flapsL)}`);
                       falas.push(`flaps de aterragem até ${vV(lim.flapsL)}`); }
      if (lim.flapsC){ linhas.push(`Flaps combate: ${vE(lim.flapsC)}`); }
      if (lim.vne)   { linhas.push(`Limite estrutural: ${vE(lim.vne)}`);
                       falas.push(`e o limite estrutural são ${vV(lim.vne)}`); }
    }
    if (lim.aprox) {
      linhas.push("⚠️ Valores aproximados — a wiki não publica dados deste avião.");
      falas.push("Atenção: são valores aproximados.");
    }
    return { ecra: linhas.join("\n"), voz: falas.join(". ") + "." };
  }

  /* --- saudação inicial --- */
  saudar() {
    const s = this.escolher("saud", this.persona.saudacao);
    const t = this.tratar();
    const ecra = t ? `${s} ${t}.` : s;
    return { ecra, voz: ecra };
  }
}

/* exportar para Node (testes) */
if (typeof module !== "undefined") {
  module.exports = { Engenheiro, reconhecer, detectarFuncao, normalizar, INTENCOES };
}
