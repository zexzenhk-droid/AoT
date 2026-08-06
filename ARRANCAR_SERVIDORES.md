# 🚀 Como Arrancar os Servidores

## 📋 Pré-requisitos

Certifique-se que tem:
- ✅ Node.js instalado (`npm`)
- ✅ Python 3 instalado (`python3`)
- ✅ Dependências Python instaladas (`pip install fastapi uvicorn pydantic`)
- ✅ Dependências Node instaladas (`npm install`)

---

## 🔧 Passo 1: Abra Dois Terminais

### Terminal 1 (Servidor Python)
1. Abra PowerShell ou CMD
2. Navegue até ao diretório do projeto:
   ```powershell
   cd "c:\projetos\GUARDADOS no GitHub - projetos zip\aot-engenheiro-piper-tts"
   ```

### Terminal 2 (Servidor Vite)
1. Abra outro PowerShell ou CMD
2. Navegue até ao diretório do projeto:
   ```powershell
   cd "c:\projetos\GUARDADOS no GitHub - projetos zip\aot-engenheiro-piper-tts"
   ```

---

## 🐍 Passo 2: Arranque o Servidor Python (Terminal 1)

No **Terminal 1**, execute:
```powershell
python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000
```

**Deve ver:**
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ **Servidor Python está a correr!**

---

## 📦 Passo 3: Arranque o Servidor Vite (Terminal 2)

No **Terminal 2**, execute:
```powershell
npm run dev
```

**Deve ver:**
```
VITE v8.2.0  ready in 323 ms

➜  Local:   http://localhost:3001/
➜  Network: http://192.168.1.67:3001/
➜  press h + enter to show help
```

✅ **Servidor Vite está a correr!**

---

## 🌐 Passo 4: Abra o Browser

Abra o seu browser favorito e aceda a:
```
http://localhost:3001/
```

**Deve ver a aplicação a carregar!**

---

## ✅ Verificação Rápida

### Verificar Servidor Python
Abra uma nova aba do browser e aceda a:
```
http://localhost:8000/health
```

Deve ver:
```json
{"status":"ok"}
```

### Verificar Servidor Vite
Abra uma nova aba do browser e aceda a:
```
http://localhost:3001/
```

Deve ver a aplicação a carregar.

---

## 🐛 Se Algo Não Funcionar

### Erro: "Port 8000 already in use"
O servidor Python já está a correr noutro terminal.
- Feche o outro terminal
- Ou use outra porta: `python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8001`

### Erro: "Port 3001 already in use"
O servidor Vite já está a correr noutro terminal.
- Feche o outro terminal
- Ou use outra porta: `npm run dev -- --port 3002`

### Erro: "ModuleNotFoundError: No module named 'fastapi'"
As dependências Python não estão instaladas.
- Execute: `pip install fastapi uvicorn pydantic`

### Erro: "npm: command not found"
Node.js não está instalado.
- Instale Node.js de: https://nodejs.org/

### Erro: "python3: command not found"
Python não está instalado.
- Instale Python de: https://www.python.org/

---

## 📝 Resumo dos Comandos

| Ação | Comando |
|------|---------|
| Ir para o diretório | `cd "c:\projetos\GUARDADOS no GitHub - projetos zip\aot-engenheiro-piper-tts"` |
| Arrancar Servidor Python | `python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000` |
| Arrancar Servidor Vite | `npm run dev` |
| Testar Servidor Python | `http://localhost:8000/health` |
| Testar Servidor Vite | `http://localhost:3001/` |

---

## 🎯 Checklist Final

- [ ] Terminal 1 aberto com Servidor Python a correr?
- [ ] Terminal 2 aberto com Servidor Vite a correr?
- [ ] Browser consegue aceder a `http://localhost:3001/`?
- [ ] Browser consegue aceder a `http://localhost:8000/health`?
- [ ] Vê `{"status":"ok"}` no health check?

Se tudo está OK, pode começar a testar a aplicação! 🚀
