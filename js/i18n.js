/* ============================================================
   AOT ENGENHEIRO — Idiomas
   pt-PT (base) · pt-BR · en
   ------------------------------------------------------------
   Como usar no HTML:
     <h2 data-i18n="titulo">Texto por defeito</h2>
     <input data-i18n-ph="chave" placeholder="...">
     <button title="..." data-i18n-tt="chave">...</button>

   Como usar em JS:
     t('chave')                     → devolve o texto traduzido
     aplicarIdioma('en')            → aplica ao DOM inteiro
     vozDoIdioma()                  → devolve locale para TTS
   ============================================================ */

const IDIOMAS = {
  'pt-PT': { nome:'Português (Portugal)', bandeira:'🇵🇹', voz:'pt-PT' },
  'pt-BR': { nome:'Português (Brasil)',   bandeira:'🇧🇷', voz:'pt-BR' },
  'en':    { nome:'English',              bandeira:'🇬🇧', voz:'en-GB' }
};

const T = {
  'pt-PT': {
    /* splash / registo */
    assistente:'Assistente de bordo', iniciar:'Iniciar sistemas',
    identificacao:'Identificação', teuNome:'O teu nome',
    comoTratado:'Como queres ser tratado?', porTu:'Por tu', comandante:'Comandante',
    escolheEng:'Escolhe o teu engenheiro', continuar:'Continuar',
    podesTrocar:'Podes trocar depois — até a meio do voo.',
    dizNome:'Diz-me como te chamas.',
    /* hangar */
    hangar:'Hangar', escolheAviao:'Escolhe o avião',
    confirmar:'Confirmar aeronave', desliza:'← desliza para ver os aviões →',
    tocaWiki:'🔗 toca para abrir a wiki',
    fabricante:'Fabricante', tipo:'Tipo', tripulacao:'Tripulação',
    mostrador:'Mostrador', piloto:'piloto', membros:'membros',
    /* missão */
    configMissao:'Configurar missão', mapa:'Mapa', horaDia:'Hora do dia',
    meteo:'Meteorologia', combustivel:'Combustível limitado',
    desligado:'Desligado', ligado:'Ligado', recomendado:'Recomendado',
    maisLeve:'Mais leve, mais risco', armamento:'Armamento',
    tipoMissao:'Tipo de missão', briefing:'Briefing',
    verIdeais:'✈️ Ver aviões ideais para esta missão',
    ouvirBrief:'🔊 Ouvir briefing', paraCockpit:'Para o cockpit →',
    /* cockpit */
    emTerra:'Cockpit', aDescolar:'A descolar', emSubida:'Em subida',
    emCruzeiro:'Em cruzeiro', aproximacao:'Aproximação', emCombate:'Em combate',
    manterPremido:'Manter premido', tocaFalar:'Toca e mantém para falar',
    aOuvir:'A ouvir…', escutaContinua:'🎙️ Escuta contínua',
    escrever:'Escreve ao engenheiro…', pararFala:'🔇 Parar',
    radioDesligado:'Rádio desligado', tocaLigar:'toca em ▶ para ligar',
    falaInterrompida:'Fala interrompida',
    /* definições */
    definicoes:'Definições', tema:'🎨 Tema', modernos:'Modernos',
    classicos:'Clássicos — inspirados no jogo',
    engenheiro:'Engenheiro', tratamento:'Tratamento', nomePiloto:'Nome do piloto',
    vozEng:'Voz do engenheiro', falarAlto:'Falar em voz alta',
    velocidade:'Velocidade', tom:'Tom', testarVoz:'🔊 Testar esta voz',
    soFeminina:'❓ Só tenho voz feminina',
    radio:'📻 Rádio de época', playlist:'Playlist',
    volMusica:'Volume da música', volAmbiente:'Ambiente (estática, motor)',
    musicaVoo:'Música durante o voo', discricao:'Discrição em voo',
    aTocar:'▶ a tocar', configBotoes:'🕹️ Configurar botões do HOTAS',
    unidades:'📐 Unidades dos mostradores', registo:'📋 Registo das conversas',
    apagarTudo:'Apagar dados e recomeçar', idioma:'🌍 Idioma',
    manual:'📖 Manual da aplicação',
    /* geral */
    guardar:'Guardar', fechar:'Fechar', voltar:'Voltar', sim:'Sim', nao:'Não',
    verTodos:'Ver todos os aviões →', exportar:'💾 Exportar para ficheiro',
    limpar:'Limpar registo', reporPerfil:'Repor perfil recomendado',
    /* extras */
    inicio:'Início', anterior:'Anterior', seguinte:'Seguinte',
    tocarPausa:'Tocar/pausa', parar:'Parar', aleatorio:'Aleatório',
    menosVolume:'Menos volume', maisVolume:'Mais volume', escrever_tt:'Escrever',
    faixaSeguinte:'Faixa seguinte',

    /* ══════════ FASE 2 — novas chaves ══════════ */

    /* ── Hora do dia ── */
    hora_amanhecer:'Amanhecer',
    hora_dia:'Dia',
    hora_entardecer:'Entardecer',
    hora_noite:'Noite',
    hora_amanhecer_tatica:'Ataca sempre com o sol nas costas. Quem vem do sol é invisível.',
    hora_dia_tatica:'Vês tudo, mas também te vêem. Melhor opção para quem está a aprender.',
    hora_entardecer_tatica:'Bonito, mas traiçoeiro: perdes aviões contra o brilho. Usa o sol como cobertura.',
    hora_noite_tatica:'Muito difícil. Cintos sem tracejantes tornam-te invisível — mas também não vês onde acertas.',

    /* ── Meteorologia ── */
    meteo_limpo:'Céu limpo',
    meteo_nuvens:'Nublado',
    meteo_chuva:'Chuva / tempestade',
    meteo_limpo_tatica:'Nada onde te esconderes. Combate puro — o melhor para treinar.',
    meteo_nuvens_tatica:'As nuvens são o teu melhor esconderijo. Perseguido? Mergulha numa e muda de rumo lá dentro.',
    meteo_chuva_tatica:'Aterragem difícil: trava suave ou derrapas. E não vês o inimigo até estar em cima de ti.',

    /* ── Combustível ── */
    comb_on:'Combustível limitado: LIGADO',
    comb_off:'Combustível limitado: DESLIGADO',
    comb_on_cons:'Só liga isto quando já conheceres a duração das tuas missões.',
    comb_off_cons:'Para quem está a aprender, é a escolha certa. Concentra-te em voar.',

    /* ── Temas ── */
    temaCatModernos:'Modernos',
    temaCatClassicos:'Clássicos',
    tema_moderno1:'Moderno Índigo',
    tema_moderno2:'Moderno Turquesa',
    tema_moderno3:'Moderno Carmim',
    tema_cockpit:'Cockpit',
    tema_luftwaffe:'Luftwaffe',
    tema_pacifico:'Pacífico',
    tema_desert:'Deserto',
    tema_wwi:'Grande Guerra',
    tema_moderno1_desc:'Gradiente azul-violeta, cartões suaves',
    tema_moderno2_desc:'Azul-petróleo com brilho ciano',
    tema_moderno3_desc:'Escuro com acento vermelho-rosado',
    tema_cockpit_desc:'Verde fosforescente dos instrumentos nocturnos',
    tema_luftwaffe_desc:'Cinzento-azulado e amarelo do Bf 109',
    tema_pacifico_desc:'Azul-marinho da aviação naval americana',
    tema_desert_desc:'Areia e ocre da campanha do Norte de África',
    tema_wwi_desc:'Sépia e vermelho do Barão Vermelho',

    /* ── HOTAS ── */
    hotasTitulo:'Botões do HOTAS 5',
    hotasHint:'Escreve o botão que mapeaste no jogo. O engenheiro passa a dizer o teu.',
    rotMG:'Metralhadoras',
    rotCanhoes:'Canhões',
    rotFoguetes:'Foguetes',
    rotBombas:'Bombas',
    rotRecarregar:'Recarregar',
    rotTrem:'Trem de aterragem',
    rotAirbrake:'Travão aerodinâmico',
    rotFlapsB:'Flaps ↓',
    rotFlapsS:'Flaps ↑',
    rotLeme:'Leme',
    rotTrim:'Trim',
    rotVista:'Recentrar vista',
    rotMotor:'Motor auto/manual',
    rotSaltar:'Saltar',

    /* ── Mapas (nomes) ── */
    mapa_oahu:'Oahu (Pearl Harbor)',
    mapa_midway:'Midway',
    mapa_iwojima:'Iwo Jima',
    mapa_saipan:'Saipan',
    mapa_peleliu:'Peleliu',
    mapa_korsun:'Korsun',
    mapa_stalingrado:'Estalinegrado',
    mapa_kursk:'Kursk',
    mapa_berlim:'Berlim',
    mapa_bretanha:'Batalha da Bretanha',
    mapa_pasdecalais:'Pas-de-Calais',
    mapa_normandia:'Normandia',
    mapa_flandres:'Flandres',
    mapa_tunis:'Tunis',
    mapa_wwi_frente:'Frente Ocidental (Grande Guerra)',

    /* ── Teatros ── */
    teatro_pacifico:'Pacífico',
    teatro_oriental:'Frente Oriental',
    teatro_ocidental:'Frente Ocidental',
    teatro_mediterraneo:'Mediterrâneo',
    teatro_wwi:'Primeira Guerra',

    /* ── Modal "Instalar vozes masculinas" ── */
    voz_titulo:'Instalar vozes masculinas',
    voz_intro:'A app usa as vozes instaladas no sistema. Não as consigo criar — mas podes acrescentar mais, e depois aparecem na lista.',
    voz_android:'🤖 Android',
    voz_android_pass:'1. Definições → Gestão geral (ou Sistema) → Idioma → <b>Conversão de texto em voz</b><br>2. Motor preferido: <b>Voz do Google</b> → ⚙️<br>3. <b>Instalar dados de voz</b> → Português (Portugal)<br>4. Descarrega o pacote e escolhe uma voz masculina<br>5. Volta à app e recarrega — aparece no seletor',
    voz_windows:'🪟 Windows',
    voz_windows_pass:'O Windows traz só a <b>Maria</b> (feminina) em português. Para ter masculina:<br><br><b>Opção A — vozes naturais (recomendado)</b><br>Definições → Hora e idioma → Voz → <b>Adicionar voz</b><br>Escolhe Português (Portugal) ou Brasil.<br>As vozes <i>Natural</i> do Brasil incluem masculinas (<b>Antonio</b>, <b>Fabio</b>, <b>Julio</b>) e soam muito melhor.<br><br><b>Opção B — usar o Edge</b><br>O Microsoft Edge traz dezenas de vozes online, muitas masculinas. Abre a app no Edge em vez do Chrome e verás a lista maior.<br><br><b>Opção C — pacote de idioma completo</b><br>Definições → Idioma → Adicionar idioma → Português (Brasil) → marca <i>Conversão de texto em voz</i>',
    voz_dica:'💡 Sotaque brasileiro num engenheiro de bordo? Nada contra — e são as únicas vozes masculinas de qualidade em português no Windows.',

    /* ── Fase 2D — reorganização das definições ── */
    vozActivada:'Voz activada',
    volumeVoz:'Volume',
    dicaVoz:'Se a voz soar arrastada, sobe a <b>Velocidade</b>. Vozes com tom muito baixo perdem energia.',

    /* ── Fase 3 — sistema de versão ── */
    comoAtualizar:'Como atualizar?',
    updateTitulo:'🔄 Como atualizar',
    updateVersaoAtual:'Versão atual:',
    updateUltima:'Última no servidor:',
    updateAndroid:'1. Fecha completamente a app (arrasta para cima e liberta)<br>2. Volta a abrir — a nova versão instala sozinha<br><br><b>Se não atualizar:</b><br>1. Definições → Apps → AOT Engenheiro<br>2. Armazenamento → Limpar dados<br>3. Abre a app novamente',
    updatePC:'1. Pressiona <b>Ctrl + Shift + R</b><br>2. Ou fecha o browser todo e volta a abrir<br><br><b>Se não atualizar:</b><br>1. F12 → separador <b>Application</b><br>2. <b>Service Workers</b> → Unregister<br>3. Ctrl + Shift + R',
    updateDisponivel:'🆕 Nova versão disponível',
    updateVerDetalhes:'Ver detalhes'
  },

  'pt-BR': {
    assistente:'Assistente de bordo', iniciar:'Iniciar sistemas',
    identificacao:'Identificação', teuNome:'Seu nome',
    comoTratado:'Como quer ser chamado?', porTu:'Por você', comandante:'Comandante',
    escolheEng:'Escolha seu engenheiro', continuar:'Continuar',
    podesTrocar:'Pode trocar depois — até no meio do voo.',
    dizNome:'Me diga como se chama.',
    hangar:'Hangar', escolheAviao:'Escolha a aeronave',
    confirmar:'Confirmar aeronave', desliza:'← deslize para ver as aeronaves →',
    tocaWiki:'🔗 toque para abrir a wiki',
    fabricante:'Fabricante', tipo:'Tipo', tripulacao:'Tripulação',
    mostrador:'Instrumento', piloto:'piloto', membros:'membros',
    configMissao:'Configurar missão', mapa:'Mapa', horaDia:'Hora do dia',
    meteo:'Clima', combustivel:'Combustível limitado',
    desligado:'Desligado', ligado:'Ligado', recomendado:'Recomendado',
    maisLeve:'Mais leve, mais risco', armamento:'Armamento',
    tipoMissao:'Tipo de missão', briefing:'Briefing',
    verIdeais:'✈️ Ver aeronaves ideais para esta missão',
    ouvirBrief:'🔊 Ouvir briefing', paraCockpit:'Para a cabine →',
    emTerra:'Em solo', aDescolar:'Decolando', emSubida:'Subindo',
    emCruzeiro:'Em cruzeiro', aproximacao:'Aproximação', emCombate:'Em combate',
    manterPremido:'Manter pressionado', tocaFalar:'Toque e segure para falar',
    aOuvir:'Ouvindo…', escutaContinua:'🎙️ Escuta contínua',
    escrever:'Escreva ao engenheiro…', pararFala:'🔇 Parar',
    radioDesligado:'Rádio desligado', tocaLigar:'toque em ▶ para ligar',
    falaInterrompida:'Fala interrompida',
    definicoes:'Configurações', tema:'🎨 Tema', modernos:'Modernos',
    classicos:'Clássicos — inspirados no jogo',
    engenheiro:'Engenheiro', tratamento:'Tratamento', nomePiloto:'Nome do piloto',
    vozEng:'Voz do engenheiro', falarAlto:'Falar em voz alta',
    velocidade:'Velocidade', tom:'Tom', testarVoz:'🔊 Testar esta voz',
    soFeminina:'❓ Só tenho voz feminina',
    radio:'📻 Rádio de época', playlist:'Playlist',
    volMusica:'Volume da música', volAmbiente:'Ambiente (estática, motor)',
    musicaVoo:'Música durante o voo', discricao:'Discrição em voo',
    aTocar:'▶ tocando', configBotoes:'🕹️ Configurar botões do HOTAS',
    unidades:'📐 Unidades dos instrumentos', registo:'📋 Histórico de conversas',
    apagarTudo:'Apagar dados e recomeçar', idioma:'🌍 Idioma',
    manual:'📖 Manual do aplicativo',
    guardar:'Salvar', fechar:'Fechar', voltar:'Voltar', sim:'Sim', nao:'Não',
    verTodos:'Ver todas as aeronaves →', exportar:'💾 Exportar para arquivo',
    limpar:'Limpar histórico', reporPerfil:'Restaurar perfil recomendado',
    inicio:'Início', anterior:'Anterior', seguinte:'Próxima',
    tocarPausa:'Tocar/pausar', parar:'Parar', aleatorio:'Aleatório',
    menosVolume:'Menos volume', maisVolume:'Mais volume', escrever_tt:'Escrever',
    faixaSeguinte:'Próxima faixa',

    /* ══════════ FASE 2 — novas chaves ══════════ */

    hora_amanhecer:'Amanhecer',
    hora_dia:'Dia',
    hora_entardecer:'Entardecer',
    hora_noite:'Noite',
    hora_amanhecer_tatica:'Ataque sempre com o sol nas costas. Quem vem do sol é invisível.',
    hora_dia_tatica:'Você vê tudo, mas também é visto. Melhor opção para quem está aprendendo.',
    hora_entardecer_tatica:'Bonito, mas traiçoeiro: você perde aeronaves contra o brilho. Use o sol como cobertura.',
    hora_noite_tatica:'Muito difícil. Cintos sem traçantes o tornam invisível — mas você também não vê onde acerta.',

    meteo_limpo:'Céu limpo',
    meteo_nuvens:'Nublado',
    meteo_chuva:'Chuva / tempestade',
    meteo_limpo_tatica:'Nada onde se esconder. Combate puro — o melhor para treinar.',
    meteo_nuvens_tatica:'As nuvens são seu melhor esconderijo. Perseguido? Mergulhe numa e mude de rumo lá dentro.',
    meteo_chuva_tatica:'Pouso difícil: freie suave ou você derrapa. E não vê o inimigo até estar em cima de você.',

    comb_on:'Combustível limitado: LIGADO',
    comb_off:'Combustível limitado: DESLIGADO',
    comb_on_cons:'Só ligue isto quando já conhecer a duração das suas missões.',
    comb_off_cons:'Para quem está aprendendo, é a escolha certa. Concentre-se em voar.',

    temaCatModernos:'Modernos',
    temaCatClassicos:'Clássicos',
    tema_moderno1:'Moderno Índigo',
    tema_moderno2:'Moderno Turquesa',
    tema_moderno3:'Moderno Carmim',
    tema_cockpit:'Cabine',
    tema_luftwaffe:'Luftwaffe',
    tema_pacifico:'Pacífico',
    tema_desert:'Deserto',
    tema_wwi:'Grande Guerra',
    tema_moderno1_desc:'Gradiente azul-violeta, cartões suaves',
    tema_moderno2_desc:'Azul-petróleo com brilho ciano',
    tema_moderno3_desc:'Escuro com toque vermelho-rosado',
    tema_cockpit_desc:'Verde fosforescente dos instrumentos noturnos',
    tema_luftwaffe_desc:'Cinza-azulado e amarelo do Bf 109',
    tema_pacifico_desc:'Azul-marinho da aviação naval americana',
    tema_desert_desc:'Areia e ocre da campanha do Norte da África',
    tema_wwi_desc:'Sépia e vermelho do Barão Vermelho',

    hotasTitulo:'Botões do HOTAS 5',
    hotasHint:'Escreva o botão que mapeou no jogo. O engenheiro passa a dizer o seu.',
    rotMG:'Metralhadoras',
    rotCanhoes:'Canhões',
    rotFoguetes:'Foguetes',
    rotBombas:'Bombas',
    rotRecarregar:'Recarregar',
    rotTrem:'Trem de pouso',
    rotAirbrake:'Freio aerodinâmico',
    rotFlapsB:'Flaps ↓',
    rotFlapsS:'Flaps ↑',
    rotLeme:'Leme',
    rotTrim:'Trim',
    rotVista:'Recentralizar vista',
    rotMotor:'Motor auto/manual',
    rotSaltar:'Ejetar',

    mapa_oahu:'Oahu (Pearl Harbor)',
    mapa_midway:'Midway',
    mapa_iwojima:'Iwo Jima',
    mapa_saipan:'Saipan',
    mapa_peleliu:'Peleliu',
    mapa_korsun:'Korsun',
    mapa_stalingrado:'Stalingrado',
    mapa_kursk:'Kursk',
    mapa_berlim:'Berlim',
    mapa_bretanha:'Batalha da Grã-Bretanha',
    mapa_pasdecalais:'Pas-de-Calais',
    mapa_normandia:'Normandia',
    mapa_flandres:'Flandres',
    mapa_tunis:'Tunis',
    mapa_wwi_frente:'Frente Ocidental (Grande Guerra)',

    teatro_pacifico:'Pacífico',
    teatro_oriental:'Frente Oriental',
    teatro_ocidental:'Frente Ocidental',
    teatro_mediterraneo:'Mediterrâneo',
    teatro_wwi:'Primeira Guerra',

    /* ── Modal "Instalar vozes masculinas" ── */
    voz_titulo:'Instalar vozes masculinas',
    voz_intro:'O app usa as vozes instaladas no sistema. Não consigo criá-las — mas você pode adicionar mais, e depois aparecem na lista.',
    voz_android:'🤖 Android',
    voz_android_pass:'1. Configurações → Geral (ou Sistema) → Idioma → <b>Conversão de texto em voz</b><br>2. Motor preferido: <b>Voz do Google</b> → ⚙️<br>3. <b>Instalar dados de voz</b> → Português (Brasil)<br>4. Baixe o pacote e escolha uma voz masculina<br>5. Volte ao app e recarregue — aparece no seletor',
    voz_windows:'🪟 Windows',
    voz_windows_pass:'O Windows traz só vozes femininas em português. Para ter masculina:<br><br><b>Opção A — vozes naturais (recomendado)</b><br>Configurações → Hora e idioma → Voz → <b>Adicionar voz</b><br>Escolha Português (Brasil).<br>As vozes <i>Natural</i> incluem masculinas (<b>Antonio</b>, <b>Fabio</b>, <b>Julio</b>) e soam muito melhor.<br><br><b>Opção B — usar o Edge</b><br>O Microsoft Edge traz dezenas de vozes online, muitas masculinas. Abra o app no Edge em vez do Chrome e verá a lista maior.<br><br><b>Opção C — pacote de idioma completo</b><br>Configurações → Idioma → Adicionar idioma → Português (Brasil) → marque <i>Conversão de texto em voz</i>',
    voz_dica:'💡 As vozes brasileiras Natural são as melhores masculinas em português no Windows.',

    /* ── Fase 2D — reorganização das definições ── */
    vozActivada:'Voz ativada',
    volumeVoz:'Volume',
   dicaVoz:'Se a voz soar arrastada, aumente a <b>Velocidade</b>. Vozes com tom muito baixo perdem energia.',

    /* ── Fase 3 — sistema de versão ── */
    comoAtualizar:'Como atualizar?',
    updateTitulo:'🔄 Como atualizar',
    updateVersaoAtual:'Versão atual:',
    updateUltima:'Última no servidor:',
    updateAndroid:'1. Feche completamente o app (arraste para cima e solte)<br>2. Volte a abrir — a nova versão instala sozinha<br><br><b>Se não atualizar:</b><br>1. Configurações → Apps → AOT Engenheiro<br>2. Armazenamento → Limpar dados<br>3. Abra o app novamente',
    updatePC:'1. Pressione <b>Ctrl + Shift + R</b><br>2. Ou feche o navegador todo e volte a abrir<br><br><b>Se não atualizar:</b><br>1. F12 → aba <b>Application</b><br>2. <b>Service Workers</b> → Unregister<br>3. Ctrl + Shift + R',
    updateDisponivel:'🆕 Nova versão disponível',
    updateVerDetalhes:'Ver detalhes'
  },

  'en': {
    assistente:'Flight assistant', iniciar:'Start systems',
    identificacao:'Identification', teuNome:'Your name',
    comoTratado:'How should I address you?', porTu:'First name', comandante:'Commander',
    escolheEng:'Choose your engineer', continuar:'Continue',
    podesTrocar:'You can switch later — even mid-flight.',
    dizNome:'Tell me your name.',
    hangar:'Hangar', escolheAviao:'Choose your aircraft',
    confirmar:'Confirm aircraft', desliza:'← swipe to browse aircraft →',
    tocaWiki:'🔗 tap to open the wiki',
    fabricante:'Manufacturer', tipo:'Role', tripulacao:'Crew',
    mostrador:'Gauge', piloto:'pilot', membros:'crew',
    configMissao:'Mission setup', mapa:'Map', horaDia:'Time of day',
    meteo:'Weather', combustivel:'Limited fuel',
    desligado:'Off', ligado:'On', recomendado:'Recommended',
    maisLeve:'Lighter, riskier', armamento:'Armament',
    tipoMissao:'Mission type', briefing:'Briefing',
    verIdeais:'✈️ Best aircraft for this mission',
    ouvirBrief:'🔊 Hear briefing', paraCockpit:'To the cockpit →',
    emTerra:'On the ground', aDescolar:'Taking off', emSubida:'Climbing',
    emCruzeiro:'Cruising', aproximacao:'On approach', emCombate:'In combat',
    manterPremido:'Hold to talk', tocaFalar:'Tap and hold to speak',
    aOuvir:'Listening…', escutaContinua:'🎙️ Always listening',
    escrever:'Type to the engineer…', pararFala:'🔇 Stop',
    radioDesligado:'Radio off', tocaLigar:'tap ▶ to turn on',
    falaInterrompida:'Speech interrupted',
    definicoes:'Settings', tema:'🎨 Theme', modernos:'Modern',
    classicos:'Classic — inspired by the game',
    engenheiro:'Engineer', tratamento:'Form of address', nomePiloto:'Pilot name',
    vozEng:'Engineer voice', falarAlto:'Speak out loud',
    velocidade:'Speed', tom:'Pitch', testarVoz:'🔊 Test this voice',
    soFeminina:'❓ I only have female voices',
    radio:'📻 Period radio', playlist:'Playlist',
    volMusica:'Music volume', volAmbiente:'Ambience (static, engine)',
    musicaVoo:'Music during flight', discricao:'In-flight ducking',
    aTocar:'▶ now playing', configBotoes:'🕹️ Configure HOTAS buttons',
    unidades:'📐 Gauge units', registo:'📋 Conversation log',
    apagarTudo:'Erase data and start over', idioma:'🌍 Language',
    manual:'📖 App manual',
    guardar:'Save', fechar:'Close', voltar:'Back', sim:'Yes', nao:'No',
    verTodos:'See all aircraft →', exportar:'💾 Export to file',
    limpar:'Clear log', reporPerfil:'Restore recommended profile',
    inicio:'Home', anterior:'Previous', seguinte:'Next',
    tocarPausa:'Play/pause', parar:'Stop', aleatorio:'Shuffle',
    menosVolume:'Volume down', maisVolume:'Volume up', escrever_tt:'Type',
    faixaSeguinte:'Next track',

    /* ══════════ PHASE 2 — new keys ══════════ */

    /* ── Time of day ── */
    hora_amanhecer:'Dawn',
    hora_dia:'Day',
    hora_entardecer:'Dusk',
    hora_noite:'Night',
    hora_amanhecer_tatica:'Always attack with the sun at your back. Whoever comes from the sun is invisible.',
    hora_dia_tatica:'You see everything — and so do they. Best option while learning.',
    hora_entardecer_tatica:'Beautiful but tricky: you lose aircraft against the glare. Use the sun as cover.',
    hora_noite_tatica:'Very hard. Belts without tracers make you invisible — but you also cannot see your hits.',

    /* ── Weather ── */
    meteo_limpo:'Clear sky',
    meteo_nuvens:'Cloudy',
    meteo_chuva:'Rain / storm',
    meteo_limpo_tatica:'Nowhere to hide. Pure combat — best for training.',
    meteo_nuvens_tatica:'Clouds are your best hiding place. Being chased? Dive into one and change heading inside.',
    meteo_chuva_tatica:'Hard landing: brake gently or you skid. And you will not see the enemy until they are on top of you.',

    /* ── Fuel ── */
    comb_on:'Limited fuel: ON',
    comb_off:'Limited fuel: OFF',
    comb_on_cons:'Only turn this on once you know how long your missions last.',
    comb_off_cons:'Right choice while learning. Focus on flying.',

    /* ── Themes ── */
    temaCatModernos:'Modern',
    temaCatClassicos:'Classic',
    tema_moderno1:'Modern Indigo',
    tema_moderno2:'Modern Turquoise',
    tema_moderno3:'Modern Crimson',
    tema_cockpit:'Cockpit',
    tema_luftwaffe:'Luftwaffe',
    tema_pacifico:'Pacific',
    tema_desert:'Desert',
    tema_wwi:'Great War',
    tema_moderno1_desc:'Blue-violet gradient, soft cards',
    tema_moderno2_desc:'Petrol blue with cyan glow',
    tema_moderno3_desc:'Dark with rose-red accent',
    tema_cockpit_desc:'Phosphor green of night instruments',
    tema_luftwaffe_desc:'Blue-grey and yellow of the Bf 109',
    tema_pacifico_desc:'Navy blue of American naval aviation',
    tema_desert_desc:'Sand and ochre of the North Africa campaign',
    tema_wwi_desc:'Sepia and red of the Red Baron',

    /* ── HOTAS ── */
    hotasTitulo:'HOTAS 5 buttons',
    hotasHint:'Type the button you mapped in-game. The engineer will say yours instead.',
    rotMG:'Machine guns',
    rotCanhoes:'Cannons',
    rotFoguetes:'Rockets',
    rotBombas:'Bombs',
    rotRecarregar:'Reload',
    rotTrem:'Landing gear',
    rotAirbrake:'Airbrake',
    rotFlapsB:'Flaps ↓',
    rotFlapsS:'Flaps ↑',
    rotLeme:'Rudder',
    rotTrim:'Trim',
    rotVista:'Re-centre view',
    rotMotor:'Engine auto/manual',
    rotSaltar:'Eject',

    /* ── Maps (names) ── */
    mapa_oahu:'Oahu (Pearl Harbor)',
    mapa_midway:'Midway',
    mapa_iwojima:'Iwo Jima',
    mapa_saipan:'Saipan',
    mapa_peleliu:'Peleliu',
    mapa_korsun:'Korsun',
    mapa_stalingrado:'Stalingrad',
    mapa_kursk:'Kursk',
    mapa_berlim:'Berlin',
    mapa_bretanha:'Battle of Britain',
    mapa_pasdecalais:'Pas-de-Calais',
    mapa_normandia:'Normandy',
    mapa_flandres:'Flanders',
    mapa_tunis:'Tunis',
    mapa_wwi_frente:'Western Front (Great War)',

    /* ── Theatres ── */
    teatro_pacifico:'Pacific',
    teatro_oriental:'Eastern Front',
    teatro_ocidental:'Western Front',
    teatro_mediterraneo:'Mediterranean',
    teatro_wwi:'World War I',

    /* ── "Install male voices" modal ── */
    voz_titulo:'Install male voices',
    voz_intro:'The app uses the voices installed on your system. I cannot create them — but you can add more, and they will appear in the list.',
    voz_android:'🤖 Android',
    voz_android_pass:'1. Settings → General management (or System) → Language → <b>Text-to-speech output</b><br>2. Preferred engine: <b>Google Voice</b> → ⚙️<br>3. <b>Install voice data</b> → English (UK) or English (US)<br>4. Download the pack and pick a male voice<br>5. Return to the app and reload — it appears in the selector',
    voz_windows:'🪟 Windows',
    voz_windows_pass:'Windows ships only a few default voices. To add male voices:<br><br><b>Option A — natural voices (recommended)</b><br>Settings → Time & language → Speech → <b>Add voices</b><br>Choose English (UK) or English (US).<br>The <i>Natural</i> voices include male options (<b>Ryan</b>, <b>Guy</b>, <b>Davis</b>) and sound much better.<br><br><b>Option B — use Edge</b><br>Microsoft Edge ships dozens of online voices, many male. Open the app in Edge instead of Chrome and you will see a much larger list.<br><br><b>Option C — full language pack</b><br>Settings → Language → Add a language → English (any) → tick <i>Text-to-speech</i>',
    voz_dica:'💡 The <i>Natural</i> voices sound dramatically better than the classic ones — worth the small download.',

    /* ── Phase 2D — settings reorganization ── */
    vozActivada:'Voice enabled',
    volumeVoz:'Volume',
   dicaVoz:'If the voice sounds slurred, raise the <b>Speed</b>. Voices with very low pitch lose energy.',

    /* ── Phase 3 — version system ── */
    comoAtualizar:'How to update?',
    updateTitulo:'🔄 How to update',
    updateVersaoAtual:'Current version:',
    updateUltima:'Latest on server:',
    updateAndroid:'1. Close the app completely (swipe up and release)<br>2. Open it again — the new version installs automatically<br><br><b>If it does not update:</b><br>1. Settings → Apps → AOT Engenheiro<br>2. Storage → Clear data<br>3. Open the app again',
    updatePC:'1. Press <b>Ctrl + Shift + R</b><br>2. Or close the browser entirely and reopen<br><br><b>If it does not update:</b><br>1. F12 → <b>Application</b> tab<br>2. <b>Service Workers</b> → Unregister<br>3. Ctrl + Shift + R',
    updateDisponivel:'🆕 New version available',
    updateVerDetalhes:'View details'
  }
};

/* ---------- estado ---------- */
let IDIOMA_ACTUAL = 'pt-PT';

/* ---------- API pública ---------- */

/** Devolve o texto traduzido para a chave, com fallback para pt-PT */
function t(chave) {
  return (T[IDIOMA_ACTUAL] && T[IDIOMA_ACTUAL][chave])
      || T['pt-PT'][chave] || chave;
}

/** Aplica as traduções a TODOS os elementos com data-i18n* */
function aplicarIdioma(id) {
  IDIOMA_ACTUAL = T[id] ? id : 'pt-PT';
  document.documentElement.lang = IDIOMA_ACTUAL;

  /* 1. Conteúdo de texto: <h2 data-i18n="chave">…</h2> */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!k) return;
    el.textContent = t(k);
  });

  /* 2. Placeholders: <input data-i18n-ph="chave" placeholder="…"> */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.dataset.i18nPh;
    if (!k) return;
    el.placeholder = t(k);
  });

  /* 3. Tooltips: <button data-i18n-tt="chave" title="…"> */
  document.querySelectorAll('[data-i18n-tt]').forEach(el => {
    const k = el.dataset.i18nTt;
    if (!k) return;
    el.title = t(k);
  });

  /* 4. aria-label: <button data-i18n-aria="chave" aria-label="…"> */
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const k = el.dataset.i18nAria;
    if (!k) return;
    el.setAttribute('aria-label', t(k));
  });
   
  /* 5. HTML: <p data-i18n-html="chave">…</p> (permite tags como <b>, <br>) */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.dataset.i18nHtml;
    if (!k) return;
    el.innerHTML = t(k);
  });

  return IDIOMA_ACTUAL;
}

/** Devolve o locale de voz correspondente ao idioma actual */
function vozDoIdioma() {
  return (IDIOMAS[IDIOMA_ACTUAL] || IDIOMAS['pt-PT']).voz;
}

/** Devolve o código do idioma actualmente activo */
function idiomaActual() {
  return IDIOMA_ACTUAL;
}
