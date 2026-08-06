# Como Testar o Servidor Piper

## ✅ Servidor está a funcionar!

O servidor respondeu com sucesso ao endpoint `/health`:
```json
{"status":"ok"}
```

---

## 🧪 Testar com PowerShell (Windows)

### Teste 1: Listar vozes disponíveis

```powershell
Invoke-RestMethod -Uri "http://192.168.1.78:8000/vozes" -Method Get
```

### Teste 2: Gerar áudio em Português

```powershell
$body = @{
    texto = "Olá mundo, o servidor está a funcionar perfeitamente"
    voz = "pt_PT-tugão-medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "teste_pt.wav"
```

### Teste 3: Gerar áudio em Inglês

```powershell
$body = @{
    texto = "Hello world, the server is working perfectly"
    voz = "en_US-joe-medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "teste_en.wav"
```

### Teste 4: Gerar áudio em Francês

```powershell
$body = @{
    texto = "Bonjour le monde"
    voz = "fr_FR-tom-medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "teste_fr.wav"
```

---

## 🧪 Testar com curl (Linux/Mac/WSL)

### Teste 1: Listar vozes

```bash
curl http://192.168.1.78:8000/vozes
```

### Teste 2: Português

```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Olá mundo", "voz": "pt_PT-tugão-medium"}' \
  --output teste_pt.wav
```

### Teste 3: Inglês

```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Hello world", "voz": "en_US-joe-medium"}' \
  --output teste_en.wav
```

### Teste 4: Alemão

```bash
curl -X POST http://192.168.1.78:8000/falar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Hallo Welt", "voz": "de_DE-thorsten-medium"}' \
  --output teste_de.wav
```

---

## ❌ Erro: "There was an error parsing the body"

Este erro ocorre quando o JSON não está bem formatado. No PowerShell, use:

```powershell
# ✅ CORRETO - Usar @{} e ConvertTo-Json
$body = @{
    texto = "Olá"
    voz = "pt_PT-tugão-medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "teste.wav"
```

```powershell
# ❌ ERRADO - Usar string diretamente
Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"texto": "Olá", "voz": "pt_PT-tugão-medium"}' `
    -OutFile "teste.wav"
```

---

## 📋 Vozes Disponíveis

| Código | Nome | Idioma |
|--------|------|--------|
| `pt-PT` | pt_PT-tugão-medium | 🇵🇹 Português (Portugal) |
| `pt-BR` | pt_BR-faber-medium | 🇧🇷 Português (Brasil) |
| `en-US` | en_US-joe-medium | 🇺🇸 Inglês (EUA) |
| `en-GB` | en_GB-alan-medium | 🇬🇧 Inglês (Reino Unido) |
| `de-DE` | de_DE-thorsten-medium | 🇩🇪 Alemão |
| `fr-FR` | fr_FR-tom-medium | 🇫🇷 Francês |
| `ru-RU` | ru_RU-dmitri-medium | 🇷🇺 Russo |
| `es-ES` | es_ES-davefx-medium | 🇪🇸 Espanhol |

---

## 🎯 Próximos Passos

1. **Sincronizar os modelos de vozes** (se ainda não o fez):
   ```bash
   ./sync_voices_to_tvbox.sh 192.168.1.78 root
   ```

2. **Testar na aplicação web:**
   - Abra a aplicação em `http://localhost:3001`
   - Selecione uma voz nas definições
   - Teste o TTS na aplicação

3. **Verificar os logs do servidor:**
   ```bash
   ssh root@192.168.1.78 "tail -f /tmp/piper.log"
   ```

---

## 💡 Dica: Script PowerShell para Testar Todas as Vozes

Crie um ficheiro `testar_vozes.ps1`:

```powershell
$vozes = @(
    @{codigo="pt-PT"; nome="Português (Portugal)"; texto="Olá mundo"},
    @{codigo="pt-BR"; nome="Português (Brasil)"; texto="Olá mundo"},
    @{codigo="en-US"; nome="Inglês (EUA)"; texto="Hello world"},
    @{codigo="en-GB"; nome="Inglês (Reino Unido)"; texto="Hello world"},
    @{codigo="de-DE"; nome="Alemão"; texto="Hallo Welt"},
    @{codigo="fr-FR"; nome="Francês"; texto="Bonjour le monde"},
    @{codigo="ru-RU"; nome="Russo"; texto="Привет мир"},
    @{codigo="es-ES"; nome="Espanhol"; texto="Hola mundo"}
)

foreach ($voz in $vozes) {
    Write-Host "Testando $($voz.nome)..." -ForegroundColor Green
    
    $body = @{
        texto = $voz.texto
        voz = $voz.codigo
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://192.168.1.78:8000/falar" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -OutFile "teste_$($voz.codigo).wav"
        
        Write-Host "✓ Sucesso: teste_$($voz.codigo).wav" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erro: $_" -ForegroundColor Red
    }
}

Write-Host "Testes concluídos!" -ForegroundColor Green
```

Depois execute:
```powershell
.\testar_vozes.ps1
```
