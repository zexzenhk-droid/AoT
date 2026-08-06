# 🖥️ Como Testar a Aplicação no PC

## ✅ Pré-requisitos

Certifique-se que tem **dois servidores a correr**:

### 1️⃣ Servidor Python (Piper TTS)
```bash
python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000
```

**Verificar se está a correr:**
- Abra: `http://localhost:8000/health`
- Deve ver: `{"status":"ok"}`

### 2️⃣ Servidor Vite (Aplicação Web)
```bash
npm run dev
```

**Verificar se está a correr:**
- Abra: `http://localhost:3001/`
- Deve ver a aplicação a carregar

---

## 🚀 Passos para Testar

### Passo 1: Abra o Browser
```
http://localhost:3001/
```

### Passo 2: Clique em "Iniciar"
- Verá o ecrã de splash

### Passo 3: Registe-se
- Escolha um nome
- Escolha tratamento (tu/comandante)
- Escolha persona (militar/civil)
- Clique em "Registar"

### Passo 4: Escolha um Avião
- Selecione uma nação
- Escolha um avião
- Clique em "Confirmar"

### Passo 5: Configure a Missão
- Escolha mapa, hora, meteo
- Clique em "Para Voo"

### Passo 6: Teste as Vozes
1. Clique em "Definições" (⚙️)
2. Procure "Voz do Engenheiro"
3. Selecione uma voz Piper (ex: 🇵🇹 Português (Portugal) — Tugão)
4. Clique em "Testar voz"
5. Deve ouvir a voz do servidor Piper

### Passo 7: Teste o Menu HOTAS
1. Clique em "Definições" (⚙️)
2. Procure "🕹️ Configurar botões do HOTAS"
3. Clique nele
4. Deve abrir o menu de esquemas

---

## 🔍 Verificações Importantes

### ✅ Vozes Piper Funcionam?
- [ ] Consegue selecionar vozes Piper nas definições?
- [ ] Consegue ouvir a voz ao clicar "Testar voz"?
- [ ] A voz é diferente da voz do sistema?

### ✅ Menu HOTAS Funciona?
- [ ] Consegue abrir o menu de esquemas?
- [ ] Consegue ver a lista de esquemas?
- [ ] Consegue editar um esquema?
- [ ] Consegue adicionar um novo esquema?

### ✅ Aplicação Geral?
- [ ] A aplicação carrega sem erros?
- [ ] Consegue navegar entre ecrãs?
- [ ] Consegue falar com o engenheiro?
- [ ] A rádio funciona?

---

## 🐛 Se Algo Não Funcionar

### Vozes Piper não funcionam?
1. Abra a consola do browser (F12)
2. Procure por erros vermelhos
3. Verifique se o servidor Python está a correr
4. Teste: `http://localhost:8000/health`

### Menu HOTAS não abre?
1. Abra a consola do browser (F12)
2. Procure por erros JavaScript
3. Verifique se o ficheiro `js/esquemas.js` foi carregado

### Aplicação não carrega?
1. Verifique se o servidor Vite está a correr
2. Tente recarregar a página (Ctrl+Shift+R)
3. Limpe o cache do browser

---

## 📝 Comandos Rápidos

### Terminal 1 - Servidor Python
```bash
cd c:\projetos\GUARDADOS no GitHub - projetos zip\aot-engenheiro-piper-tts
python3 -m uvicorn server_updated:app --host 0.0.0.0 --port 8000
```

### Terminal 2 - Servidor Vite
```bash
cd c:\projetos\GUARDADOS no GitHub - projetos zip\aot-engenheiro-piper-tts
npm run dev
```

### Browser
```
http://localhost:3001/
```

---

## 🎯 Resumo

| Componente | URL | Status |
|-----------|-----|--------|
| Aplicação Web | `http://localhost:3001/` | ✅ Vite |
| Servidor Piper | `http://localhost:8000/` | ✅ Python |
| Health Check | `http://localhost:8000/health` | ✅ JSON |

Tudo pronto para testar! 🚀
