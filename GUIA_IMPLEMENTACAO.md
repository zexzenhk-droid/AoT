# Guia de Implementação - Piper TTS com Múltiplas Vozes

## 📋 Resumo das Alterações

Este guia descreve como implementar o suporte a múltiplas vozes Piper na TV Box e sincronizar os modelos do seu PC.

---

## 1️⃣ Sincronizar os Modelos de Vozes para a TV Box

### Pré-requisitos:
- Acesso SSH à TV Box (Armbian)
- Ferramentas instaladas na TV Box: `sshpass`, `rsync`
- Ficheiros de vozes em: `C:\projetos\GUARDADOS no GitHub - projetos zip\PIPER-vozes\Piper voices`

### Opção A: Usar o Script Bash (Recomendado para Linux/Mac)

```bash
# Dar permissão de execução ao script
chmod +x sync_voices_to_tvbox.sh

# Executar o script
./sync_voices_to_tvbox.sh 192.168.1.78 root
# Será pedida a senha quando necessário
```

### Opção B: Usar SCP Manualmente (Windows/PowerShell)

```powershell
# Instalar sshpass no Windows (via Chocolatey ou WSL)
# Depois usar:
scp -r "C:\projetos\GUARDADOS no GitHub - projetos zip\PIPER-vozes\Piper voices\*" root@192.168.1.78:/opt/piper/voices/
```

### Opção C: Usar WinSCP (Interface Gráfica)

1. Abra WinSCP
2. Conecte-se a `192.168.1.78` com utilizador `root`
3. Navegue para `/opt/piper/voices/`
4. Arraste e solte as pastas de vozes do seu PC

---

## 2️⃣ Atualizar o Servidor Python na TV Box

### Passo 1: Copiar o novo servidor para a TV Box

```bash
# Via SCP
scp server_updated.py root@192.168.1.78:/opt/piper/server.py

# Ou via SSH + cat
ssh root@192.168.1.78 'cat > /opt/piper/server.py' < server_updated.py
```

### Passo 2: Parar o servidor antigo

```bash
ssh root@192.168.1.78 'pkill -f "uvicorn server:app"'
```

### Passo 3: Iniciar o novo servidor

```bash
ssh root@192.168.1.78 'cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 &'
```

### Passo 4: Verificar se o servidor está a funcionar

```bash
curl http://192.168.1.78:8000/health
# Deve retornar: {"status":"ok"}
```

---

## 3️⃣ Testar o Servidor com Diferentes Vozes

### Teste 1: Português (Portugal)
```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Olá mundo", "voz": "pt_PT-tugão-medium"}' \
  --output teste_pt.wav
```

### Teste 2: Inglês (EUA)
```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Hello world", "voz": "en_US-joe-medium"}' \
  --output teste_en.wav
```

### Teste 3: Listar vozes disponíveis
```bash
curl http://192.168.1.78:8000/vozes
```

---

## 4️⃣ Atualizar a Aplicação Web (app.js)

A aplicação web já foi atualizada em `js/piper-tts.js` para:
- Enviar a voz selecionada no JSON: `{"texto": "...", "voz": "..."}`
- Receber o blob de áudio .wav
- Reproduzir o áudio no cliente (telemóvel/browser)

**Nenhuma alteração adicional é necessária na aplicação web.**

---

## 5️⃣ Estrutura de Diretórios Esperada

Na TV Box, após sincronizar, a estrutura deve ser:

```
/opt/piper/
├── piper (binário)
├── venv/ (ambiente virtual Python)
├── server.py (novo servidor atualizado)
├── voices/
│   ├── pt_PT-tugão-medium/
│   │   ├── pt_PT-tugão-medium.onnx
│   │   └── pt_PT-tugão-medium.onnx.json
│   ├── en_US-joe-medium/
│   │   ├── en_US-joe-medium.onnx
│   │   └── en_US-joe-medium.onnx.json
│   ├── pt_BR-faber-medium/
│   ├── en_GB-alan-medium/
│   ├── de_DE-thorsten-medium/
│   ├── fr_FR-tom-medium/
│   ├── ru_RU-dmitri-medium/
│   └── es_ES-davefx-medium/
```

---

## 6️⃣ Troubleshooting

### Problema: "Modelo não encontrado"
**Solução:** Verifique se os ficheiros foram sincronizados corretamente:
```bash
ssh root@192.168.1.78 'ls -la /opt/piper/voices/'
```

### Problema: "Erro ao executar Piper"
**Solução:** Verifique se o binário do Piper está instalado:
```bash
ssh root@192.168.1.78 'which piper && piper --version'
```

### Problema: Áudio não é reproduzido no cliente
**Solução:** Verifique se o servidor está a retornar o áudio corretamente:
```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "teste", "voz": "pt_PT-tugão-medium"}' \
  -v
```

### Problema: Conexão SSH recusada
**Solução:** Verifique as credenciais e se a TV Box está ligada:
```bash
ping 192.168.1.78
ssh -v root@192.168.1.78
```

---

## 7️⃣ Fazer o Servidor Iniciar Automaticamente (Opcional)

Para que o servidor inicie automaticamente quando a TV Box reinicia:

### Opção A: Usar systemd (Recomendado)

1. Criar um ficheiro de serviço:
```bash
ssh root@192.168.1.78 'cat > /etc/systemd/system/piper-server.service' << 'EOF'
[Unit]
Description=Piper TTS Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/piper
ExecStart=/opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

2. Ativar o serviço:
```bash
ssh root@192.168.1.78 'systemctl daemon-reload && systemctl enable piper-server && systemctl start piper-server'
```

3. Verificar o status:
```bash
ssh root@192.168.1.78 'systemctl status piper-server'
```

### Opção B: Usar crontab

```bash
ssh root@192.168.1.78 'crontab -e'
# Adicionar a linha:
# @reboot cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 &
```

---

## 📝 Ficheiros Criados

1. **server_updated.py** - Servidor Python atualizado com suporte a múltiplas vozes
2. **sync_voices_to_tvbox.sh** - Script para sincronizar os modelos
3. **GUIA_IMPLEMENTACAO.md** - Este ficheiro
4. **js/piper-tts.js** - Módulo web atualizado (já modificado)

---

## ✅ Checklist de Implementação

- [ ] Sincronizar os modelos de vozes para a TV Box
- [ ] Copiar o novo `server.py` para a TV Box
- [ ] Parar o servidor antigo
- [ ] Iniciar o novo servidor
- [ ] Testar com `curl` (diferentes vozes)
- [ ] Testar na aplicação web
- [ ] Configurar inicialização automática (opcional)
- [ ] Verificar que o áudio é reproduzido no cliente

---

## 🎯 Resultado Final

Após completar estes passos:
- ✅ A aplicação web pode selecionar diferentes vozes
- ✅ O servidor carrega dinamicamente o modelo .onnx correto
- ✅ O áudio é gerado na TV Box
- ✅ O áudio é reproduzido no cliente (telemóvel/browser)
- ✅ Nenhum áudio é reproduzido nas colunas do PC
