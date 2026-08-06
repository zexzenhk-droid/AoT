# 🔍 Como Verificar se o Servidor Python está a Correr

## Opção 1: Teste Rápido no Browser

Abra o browser e aceda a:
```
http://192.168.1.78:8000/health
```

**Se o servidor está a correr:**
- Verá: `{"status":"ok"}`

**Se o servidor NÃO está a correr:**
- Verá: `Não foi possível aceder ao site` ou `Connection refused`

---

## Opção 2: Teste no Terminal/Linha de Comando

### No Windows (PowerShell ou CMD):
```powershell
curl http://192.168.1.78:8000/health
```

### No Linux/Mac:
```bash
curl http://192.168.1.78:8000/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

---

## Opção 3: Teste Completo (POST)

Se o `/health` funcionar, teste o endpoint `/falar`:

### Windows (PowerShell):
```powershell
$body = @{
    texto = "Olá mundo"
    voz = "pt_PT-tugão-medium"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://192.168.1.78:8000/falar" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Linux/Mac:
```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto":"Olá mundo","voz":"pt_PT-tugão-medium"}'
```

**Resultado esperado:**
- Receberá um ficheiro de áudio `.wav`

---

## 🚀 Se o Servidor NÃO está a Correr

### Passo 1: Abra um Terminal/PowerShell na TV Box

### Passo 2: Navegue até ao diretório do projeto
```bash
cd /caminho/para/aot-engenheiro-piper-tts
```

### Passo 3: Arranque o servidor
```bash
python3 server_updated.py
```

Ou, se estiver no Windows:
```powershell
python server_updated.py
```

### Passo 4: Verá algo como:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

## ✅ Checklist

- [ ] Consegue aceder a `http://192.168.1.78:8000/health`?
- [ ] Vê `{"status":"ok"}`?
- [ ] O servidor está a correr?
- [ ] Consegue fazer POST para `/falar`?

Se tudo está OK, a aplicação web deve conseguir comunicar com o servidor Piper!
