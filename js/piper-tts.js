/* ============================================================
    AOT ENGENHEIRO — Módulo Piper TTS (Servidor Externo)
    ============================================================
    Módulo simplificado que comunica com um servidor Piper externo
    em vez de tentar carregar o Piper localmente no browser.
    ============================================================ */

const MAPA_VOZES = {
  'pt-PT': 'pt_PT-tugão-medium',
  'pt-BR': 'pt_BR-faber-medium',
  'en-US': 'en_US-joe-medium',
  'en-GB': 'en_GB-alan-medium',
  'de-DE': 'de_DE-thorsten-medium',
  'fr-FR': 'fr_FR-tom-medium',
  'ru-RU': 'ru_RU-dmitri-medium',
  'es-ES': 'es_ES-davefx-medium'
};

const NOMES_VOZES = {
  'pt-PT': '🇵🇹 Português (Portugal) — Tugão',
  'pt-BR': '🇧🇷 Português (Brasil) — Faber',
  'en-US': '🇺🇸 Inglês (EUA) — Joe',
  'en-GB': '🇬🇧 Inglês (Reino Unido) — Alan',
  'de-DE': '🇩🇪 Alemão — Thorsten',
  'fr-FR': '🇫🇷 Francês — Tom',
  'ru-RU': '🇷🇺 Russo — Dmitri',
  'es-ES': '🇪🇸 Espanhol (Espanha) — Davefx'
};

// Guarda vozes que falharam (evita tentar repetidamente)
const vozesComFalha = new Set();

// URL do servidor Piper externo (PC local)
const PIPER_SERVER_URL = 'http://localhost:8000/falar';

window.PiperTTS = {
  vozes: MAPA_VOZES,
  nomes: NOMES_VOZES,
  pronto: true,
  temVoz(codigo){ return !!MAPA_VOZES[codigo]; },
  listaParaMenu(){
    return Object.keys(MAPA_VOZES).map(codigo => ({ codigo, nome: NOMES_VOZES[codigo] }));
  },
  async falar(texto, codigoVoz){
    // Se codigoVoz é um código de idioma (ex: pt-PT), converter para nome de voz
    let voiceId = MAPA_VOZES[codigoVoz];
    
    // Se não encontrou pelo código, tentar pelo nome direto
    if (!voiceId) {
      voiceId = codigoVoz; // Usar o valor diretamente (pode ser um nome de voz)
    }
    
    if(!voiceId) return false;
    if(vozesComFalha.has(voiceId)) return false;
    
    try {
      console.log('Piper: Enviando pedido para voz:', voiceId, 'Texto:', texto);
      
      // Fazer pedido HTTP POST ao servidor Piper externo
      const response = await fetch(PIPER_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          texto: texto,
          voz: voiceId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }
      
      // Receber o blob de áudio .wav
      const wavBlob = await response.blob();
      
      // Criar URL do blob e reproduzir com Audio nativo
      const url = URL.createObjectURL(wavBlob);
      const audio = new Audio(url);
      
      return await new Promise(resolve => {
        const limpar = () => URL.revokeObjectURL(url);
        audio.onended = () => { limpar(); resolve(true); };
        audio.onerror = () => { limpar(); resolve(false); };
        audio.play().catch(() => { limpar(); resolve(false); });
      });
    } catch(e){
      console.warn('Piper servidor falhou ("'+voiceId+'"), a usar voz do sistema.', e);
      vozesComFalha.add(voiceId);
      return false;
    }
  }
};

window.dispatchEvent(new Event('pipertts-pronto'));
