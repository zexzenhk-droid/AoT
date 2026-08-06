# Como Arrancar o Servidor Piper na TV Box

## 🚀 Método Rápido (Recomendado)

Execute este comando no seu PC (PowerShell ou Terminal):

```bash
ssh root@192.168.1.78 "cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000"
```

**Nota:** Será pedida a senha do utilizador `root` na TV Box.

---

## 📋 Passo-a-Passo Completo

### 1. Copiar o novo servidor para a TV Box

```bash
scp server_updated.py root@192.168.1.78:/opt/piper/server.py
```

### 2. Parar o servidor antigo (se estiver a correr)

```bash
ssh root@192.168.1.78 "pkill -f 'uvicorn server:app'"
```

### 3. Arrancar o novo servidor

```bash
ssh root@192.168.1.78 "cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000"
```

### 4. Verificar se está a funcionar

Abra outro terminal e execute:

```bash
curl http://192.168.1.78:8000/health
```

Deve retornar:
```json
{"status":"ok"}
```

---

## 🔄 Arrancar em Background (Sem Bloquear o Terminal)

Se quiser que o servidor continue a correr mesmo depois de fechar o terminal:

```bash
ssh root@192.168.1.78 "cd /opt/piper && nohup /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/piper.log 2>&1 &"
```

Para ver os logs:
```bash
ssh root@192.168.1.78 "tail -f /tmp/piper.log"
```

---

## 🔧 Arrancar Diretamente na Consola da TV Box

Se tem acesso direto à consola da TV Box (via HDMI ou SSH):

```bash
cd /opt/piper
/opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
```

---

## ⚙️ Arrancar Automaticamente (Ao Reiniciar a TV Box)

### Opção 1: Usar systemd (Recomendado)

1. Criar o ficheiro de serviço:

```bash
ssh root@192.168.1.78 << 'EOF'
cat > /etc/systemd/system/piper-server.service << 'SYSTEMD'
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
SYSTEMD
EOF
```

2. Ativar o serviço:

```bash
ssh root@192.168.1.78 "systemctl daemon-reload && systemctl enable piper-server && systemctl start piper-server"
```

3. Verificar o status:

```bash
ssh root@192.168.1.78 "systemctl status piper-server"
```

### Opção 2: Usar crontab

```bash
ssh root@192.168.1.78 "echo '@reboot cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/piper.log 2>&1' | crontab -"
```

---

## 🧪 Testar o Servidor

Depois de arrancar, teste com diferentes vozes:

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

## ❌ Troubleshooting

### Erro: "Conexão recusada"
- Verifique se a TV Box está ligada: `ping 192.168.1.78`
- Verifique se o servidor está a correr: `ssh root@192.168.1.78 "ps aux | grep uvicorn"`

### Erro: "Modelo não encontrado"
- Verifique se os modelos foram sincronizados: `ssh root@192.168.1.78 "ls -la /opt/piper/voices/"`

### Erro: "Permissão negada"
- Verifique a senha do utilizador `root`
- Tente com `sudo`: `ssh root@192.168.1.78 "sudo systemctl start piper-server"`

### Servidor não inicia
- Verifique os logs: `ssh root@192.168.1.78 "tail -f /tmp/piper.log"`
- Verifique se o Python está instalado: `ssh root@192.168.1.78 "/opt/piper/venv/bin/python --version"`

---

## 📝 Resumo Rápido

| Ação | Comando |
|------|---------|
| Copiar servidor | `scp server_updated.py root@192.168.1.78:/opt/piper/server.py` |
| Parar servidor | `ssh root@192.168.1.78 "pkill -f 'uvicorn server:app'"` |
| Arrancar servidor | `ssh root@192.168.1.78 "cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000"` |
| Verificar status | `curl http://192.168.1.78:8000/health` |
| Ver logs | `ssh root@192.168.1.78 "tail -f /tmp/piper.log"` |
| Arrancar automático | `ssh root@192.168.1.78 "systemctl enable piper-server"` |

---

## 💡 Dica Final

Se quiser um script que faz tudo automaticamente, crie um ficheiro `arrancar_servidor.sh`:

```bash
#!/bin/bash

echo "Copiando novo servidor..."
scp server_updated.py root@192.168.1.78:/opt/piper/server.py

echo "Parando servidor antigo..."
ssh root@192.168.1.78 "pkill -f 'uvicorn server:app'"

echo "Aguardando 2 segundos..."
sleep 2

echo "Arrancando novo servidor..."
ssh root@192.168.1.78 "cd /opt/piper && nohup /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/piper.log 2>&1 &"

echo "Aguardando 3 segundos..."
sleep 3

echo "Verificando status..."
curl http://192.168.1.78:8000/health

echo "Servidor iniciado com sucesso!"
```

Depois execute:
```bash
chmod +x arrancar_servidor.sh
./arrancar_servidor.sh
```
