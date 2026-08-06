# 📋 Resumo das Alterações Realizadas

## 🎯 Objetivo
Limpar o passado e migrar o Piper TTS de uma execução local no browser para um servidor externo.

---

## ✅ Alterações Realizadas

### 1. **vite.config.js** - Simplificado
**Antes:** Configurações complexas com headers e proxies para onnxruntime-web
**Depois:** Configuração simples e limpa
```javascript
export default defineConfig({
  server: {
    port: 3001
  },
  build: {
    target: 'esnext'
  }
});
```

---

### 2. **js/piper-tts.js** - Novo Módulo Piper Externo
**Antes:** Tentava carregar Piper localmente no browser
**Depois:** Comunica com servidor externo via HTTP POST

**Principais mudanças:**
- ✅ Faz pedidos HTTP POST para `http://localhost:8000/falar`
- ✅ Envia JSON: `{"texto": "...", "voz": "..."}`
- ✅ Recebe Blob de áudio .wav
- ✅ Reproduz com objeto Audio nativo do JavaScript
- ✅ Suporte a múltiplas vozes:
  - 🇵🇹 pt-PT (Tugão)
  - 🇧🇷 pt-BR (Faber)
  - 🇺🇸 en-US (Joe)
  - 🇬🇧 en-GB (Alan)
  - 🇩🇪 de-DE (Thorsten)
  - 🇫🇷 fr-FR (Tom)
  - 🇷🇺 ru-RU (Dmitri)
  - 🇪🇸 es-ES (Davefx)

**Código-chave:**
```javascript
const PIPER_SERVER_URL = 'http://localhost:8000/falar';

async falar(texto, codigoVoz){
  const response = await fetch(PIPER_SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: texto, voz: voiceId })
  });
  
  const wavBlob = await response.blob();
  const url = URL.createObjectURL(wavBlob);
  const audio = new Audio(url);
  audio.play();
}
```

---

### 3. **js/esquemas.js** - Sistema Completo de HOTAS
**Antes:** Versão anterior com funcionalidades limitadas
**Depois:** Sistema completo com:
- ✅ Múltiplos esquemas de botões
- ✅ Editor visual de esquemas
- ✅ Importação/exportação de ficheiros JSON
- ✅ Compatibilidade com `S.bindings` para o Engenheiro
- ✅ 15 funções HOTAS pré-configuradas
- ✅ Suporte a combos de botões (ex: R1 + L1)

**Funções HOTAS:**
- Metralhadoras, Canhões, Foguetes, Bombas
- Recarregar, Trem de aterragem, Travão aerodinâmico
- Flaps (baixar/subir), Leme, Trim
- Recentrar vista, WEP, Motor auto/manual, Saltar

---

### 4. **js/app.js** - Integração Piper
**Mudanças:**
- ✅ Integração com `window.PiperTTS`
- ✅ Seleção de vozes Piper nas definições
- ✅ Fallback para voz do sistema se Piper falhar
- ✅ Menu HOTAS acessível via `abrirLista()`

**Código-chave:**
```javascript
if(window.PiperTTS && window.PiperTTS.temVoz(vozAtual)){
  window.PiperTTS.falar(t, vozAtual).then(ok=>{
    if(!ok) this.dizSistema(t); // fallback
  });
}
```

---

### 5. **server_updated.py** - Servidor Piper FastAPI
**Novo ficheiro criado com:**
- ✅ Endpoint POST `/falar` para gerar áudio
- ✅ Suporte a múltiplas vozes
- ✅ CORS ativado para aceitar pedidos do browser
- ✅ Validação de entrada
- ✅ Fallback para voz padrão se não encontrar
- ✅ Endpoint GET `/health` para verificação
- ✅ Endpoint GET `/vozes` para listar vozes disponíveis

**Exemplo de uso:**
```bash
curl -X POST http://localhost:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto":"Olá mundo","voz":"pt_PT-tugão-medium"}'
```

---

## 📁 Ficheiros Criados/Modificados

| Ficheiro | Tipo | Descrição |
|----------|------|-----------|
| `vite.config.js` | ✏️ Modificado | Simplificado |
| `js/piper-tts.js` | ✏️ Modificado | Novo módulo Piper externo |
| `js/app.js` | ✏️ Modificado | Integração Piper |
| `js/esquemas.js` | ✏️ Modificado | Sistema completo HOTAS |
| `server_updated.py` | ✨ Novo | Servidor Piper FastAPI |
| `ARRANCAR_SERVIDORES.md` | ✨ Novo | Guia de arranque |
| `COMO_TESTAR_NO_PC.md` | ✨ Novo | Guia de teste |
| `VERIFICAR_SERVIDOR.md` | ✨ Novo | Verificação de conectividade |

---

## 🔄 Fluxo de Funcionamento

### Antes (Local no Browser):
```
Browser → Piper WASM → Áudio
```

### Depois (Servidor Externo):
```
Browser → HTTP POST → Servidor Piper → Piper CLI → Áudio WAV → Browser → Audio HTML5
```

---

## 🚀 Como Usar

### 1. Arrancar o Servidor Piper
```bash
python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000
```

### 2. Arrancar a Aplicação Web
```bash
npm run dev
```

### 3. Aceder à Aplicação
```
http://localhost:3001/
```

### 4. Testar Vozes Piper
1. Clique em "Definições"
2. Procure "Voz do Engenheiro"
3. Selecione uma voz Piper
4. Clique em "Testar voz"

### 5. Testar Menu HOTAS
1. Clique em "Definições"
2. Procure "🕹️ Configurar botões do HOTAS"
3. Clique para abrir o editor de esquemas

---

## ✨ Benefícios

- ✅ **Mais leve**: Sem WASM no browser
- ✅ **Mais rápido**: Processamento no servidor
- ✅ **Mais flexível**: Fácil adicionar vozes
- ✅ **Mais compatível**: Funciona em qualquer browser
- ✅ **Mais escalável**: Pode usar servidor remoto
- ✅ **Mais seguro**: Sem código nativo no browser

---

## 🔧 Configuração

### URL do Servidor Piper
Editar em `js/piper-tts.js`:
```javascript
const PIPER_SERVER_URL = 'http://localhost:8000/falar';
```

### Vozes Disponíveis
Editar em `js/piper-tts.js`:
```javascript
const MAPA_VOZES = {
  'pt-PT': 'pt_PT-tugão-medium',
  'pt-BR': 'pt_BR-faber-medium',
  // ... mais vozes
};
```

### Porta do Servidor
Editar em `server_updated.py`:
```python
python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000
```

---

## 📝 Notas Importantes

1. **Servidor Piper**: Precisa estar a correr para as vozes funcionarem
2. **Fallback**: Se o servidor falhar, usa a voz do sistema
3. **CORS**: Ativado no servidor para aceitar pedidos do browser
4. **Compatibilidade**: Mantém compatibilidade com código existente

---

## 🎯 Próximos Passos

1. **Ligar a TV Box Armbian** com o servidor Piper
2. **Atualizar URL** em `js/piper-tts.js` para o IP da TV Box
3. **Testar** a aplicação com o servidor remoto
4. **Otimizar** conforme necessário

---

**Tudo pronto para usar!** 🚀
