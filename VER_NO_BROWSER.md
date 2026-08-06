# 🌐 Como Ver a Aplicação no Browser

## 📋 Pré-requisitos

Certifique-se que tem **dois servidores a correr**:

### ✅ Servidor Python (Piper TTS)
Deve estar a correr em `http://localhost:8000`

**Verificar:**
- Abra: `http://localhost:8000/health`
- Deve ver: `{"status":"ok"}`

### ✅ Servidor Vite (Aplicação Web)
Deve estar a correr em `http://localhost:3001`

**Verificar:**
- Abra: `http://localhost:3001/`
- Deve ver a aplicação a carregar

---

## 🚀 Passo 1: Abra o Browser

Abra o seu browser favorito (Chrome, Firefox, Edge, Safari, etc.)

---

## 🌐 Passo 2: Aceda à Aplicação

Na barra de endereço, digite:
```
http://localhost:3001/
```

E pressione **Enter**.

**Deve ver:**
- Ecrã de splash com o logo da aplicação
- Botão "Iniciar"

---

## 🎮 Passo 3: Navegue pela Aplicação

### 1. Clique em "Iniciar"
- Verá o ecrã de registo

### 2. Registe-se
- Digite um nome (ex: "Piloto")
- Escolha tratamento (tu/comandante)
- Escolha persona (militar/civil)
- Clique em "Registar"

### 3. Escolha um Avião
- Selecione uma nação (EUA, Alemanha, Japão, etc.)
- Escolha um avião (P-51, Bf-109, Zero, etc.)
- Clique em "Confirmar"

### 4. Configure a Missão
- Escolha mapa (Bretanha, Normandia, etc.)
- Escolha hora (dia, entardecer, noite)
- Escolha meteo (limpo, nublado, tempestade)
- Clique em "Para Voo"

### 5. Cockpit
- Verá o ecrã de voo com o engenheiro
- Pode falar com o engenheiro
- Pode usar o rádio

---

## ⚙️ Passo 4: Teste as Vozes Piper

### 1. Abra Definições
- Clique no ícone de engrenagem (⚙️) no canto superior direito

### 2. Procure "Voz do Engenheiro"
- Deve ver um dropdown com vozes disponíveis

### 3. Selecione uma Voz Piper
- Escolha uma voz (ex: 🇵🇹 Português (Portugal) — Tugão)

### 4. Teste a Voz
- Procure o botão "Testar voz"
- Clique nele
- **Deve ouvir a voz do servidor Piper!**

---

## 🕹️ Passo 5: Teste o Menu HOTAS

### 1. Abra Definições
- Clique no ícone de engrenagem (⚙️)

### 2. Procure "🕹️ Configurar botões do HOTAS"
- Deve estar na secção de definições

### 3. Clique nele
- Deve abrir o menu de esquemas
- Verá a lista de esquemas disponíveis

### 4. Edite um Esquema
- Clique num esquema para editar
- Pode adicionar/remover funções
- Pode configurar botões

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

### Página não carrega
1. Verifique se o servidor Vite está a correr
2. Tente recarregar a página (Ctrl+Shift+R)
3. Limpe o cache do browser (Ctrl+Shift+Delete)

### Vozes Piper não funcionam
1. Abra a consola do browser (F12)
2. Procure por erros vermelhos
3. Verifique se o servidor Python está a correr
4. Teste: `http://localhost:8000/health`

### Menu HOTAS não abre
1. Abra a consola do browser (F12)
2. Procure por erros JavaScript
3. Verifique se o ficheiro `js/esquemas.js` foi carregado

### Servidor Python não responde
1. Verifique se o servidor está a correr
2. Tente aceder a `http://localhost:8000/health`
3. Se não funcionar, reinicie o servidor

---

## 📝 Resumo dos URLs

| Página | URL |
|--------|-----|
| Aplicação | `http://localhost:3001/` |
| Health Check | `http://localhost:8000/health` |
| Vozes Disponíveis | `http://localhost:8000/vozes` |

---

## 🎯 Checklist Final

- [ ] Servidor Python a correr?
- [ ] Servidor Vite a correr?
- [ ] Browser consegue aceder a `http://localhost:3001/`?
- [ ] Aplicação carrega sem erros?
- [ ] Consegue registar-se?
- [ ] Consegue escolher um avião?
- [ ] Consegue configurar uma missão?
- [ ] Consegue entrar no cockpit?
- [ ] Consegue testar uma voz Piper?
- [ ] Consegue abrir o menu HOTAS?

Se tudo está OK, a aplicação está pronta para usar! 🚀

---

## 💡 Dicas

1. **Recarregar a página**: Ctrl+Shift+R (força recarregar sem cache)
2. **Abrir consola**: F12 (para ver erros)
3. **Testar servidor**: `http://localhost:8000/health`
4. **Testar vozes**: Selecione uma voz e clique "Testar voz"
5. **Testar HOTAS**: Clique em "🕹️ Configurar botões do HOTAS"

---

**Tudo pronto para testar!** 🎉
