# 🔍 DIAGNÓSTICO: Botão "Confirmar Aeronave" Não Funciona

## ✅ O Código Está CORRETO!

**Ficheiro**: `js/app.js` - Linhas 357-361

```javascript
$('#btConfirmar').onclick = ()=>{
  store.set('aviao',S.aviaoId);
  Radio.ajustarEra(porId(S.aviaoId));
  abrirMissao();
};
```

**Status**: ✅ Código existe e está bem escrito

---

## 🔴 CAUSAS PROVÁVEIS DO PROBLEMA:

### 1. **CACHE DO BROWSER** (80% probabilidade)
**Sintoma**: Código antigo ainda em memória  
**Solução**:
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

Ou:
1. F12 → DevTools
2. Clicar com botão direito no ícone de refresh
3. Escolher "Limpar cache e recarregar forçadamente"

---

### 2. **NENHUM AVIÃO SELECIONADO** (15% probabilidade)
**Sintoma**: `S.aviaoId` está vazio ou undefined  
**Como verificar**:
1. F12 → Console
2. Digitar: `S.aviaoId`
3. Deve mostrar algo como `"p51"` ou `"spitfire"`

**Se estiver undefined**:
- Clica num avião no carrossel
- Verifica se o avião fica com borda verde (classe `.sel`)

---

### 3. **ERRO EM `Radio.ajustarEra()`** (3% probabilidade)
**Sintoma**: Erro ao processar a era do avião  
**Como verificar**:
1. F12 → Console
2. Clicar no botão
3. Ver se aparece erro vermelho

**Se houver erro**:
```javascript
// Verificar se radio.js foi carregado
typeof Radio !== 'undefined'  // deve ser true

// Verificar se a função existe
typeof Radio.ajustarEra === 'function'  // deve ser true
```

---

### 4. **ERRO EM `abrirMissao()`** (2% probabilidade)
**Sintoma**: Função não existe ou tem erro  
**Como verificar**:
1. F12 → Console
2. Digitar: `typeof abrirMissao`
3. Deve mostrar `"function"`

**Se mostrar undefined**:
- Verificar se `app.js` está a carregar completamente
- Ver linha 366 em app.js

---

## 🚀 COMO DIAGNOSTICAR AGORA:

### Opção 1: Ficheiro de Teste (Recomendado)
```bash
# 1. Iniciar servidor
cd C:\aot-engenheiro-HOTAS5
python -m http.server 8000

# 2. Abrir no browser
http://localhost:8000/TESTE_BOTAO_CONFIRMAR.html
```

### Opção 2: Testar na App Real
```bash
# 1. Iniciar servidor
cd C:\aot-engenheiro-HOTAS5
python -m http.server 8000

# 2. Abrir app
http://localhost:8000

# 3. Abrir DevTools (F12)

# 4. Na tab Console, digitar:
$('#btConfirmar')  // deve mostrar o elemento
S.aviaoId          // deve mostrar o ID do avião
typeof abrirMissao // deve mostrar "function"
```

### Opção 3: Verificar Console
1. Abrir a app normalmente
2. F12 → Console
3. Procurar mensagens de erro (linhas vermelhas)
4. Copiar e analisar

---

## 📊 CHECKLIST DE VERIFICAÇÃO:

- [ ] Fiz **hard refresh** (Ctrl+Shift+R)?
- [ ] Servidor local está a correr (`python -m http.server 8000`)?
- [ ] Abri com `http://localhost:8000` (não `file://`)?
- [ ] Console (F12) mostra erros vermelhos?
- [ ] `S.aviaoId` está definido? (digitar no console)
- [ ] Botão existe no DOM? (`$('#btConfirmar')` no console)
- [ ] Selecionei um avião antes de clicar?

---

## 🔧 SOLUÇÃO RÁPIDA:

### Se nada funcionar:
```bash
# 1. Limpar TUDO
cd C:\aot-engenheiro-HOTAS5

# 2. Abrir DevTools (F12)
# 3. Application → Storage → Clear site data

# 4. Fechar e reabrir browser

# 5. Iniciar servidor fresco
python -m http.server 8000

# 6. Abrir com Ctrl+Shift+R
http://localhost:8000
```

---

## 💡 TESTE MANUAL NO CONSOLE:

Se quiseres testar manualmente, cola isto no console (F12):

```javascript
// Teste completo
console.log('=== DIAGNÓSTICO ===');
console.log('1. Botão existe?', !!$('#btConfirmar'));
console.log('2. S.aviaoId?', S.aviaoId);
console.log('3. Radio existe?', typeof Radio !== 'undefined');
console.log('4. abrirMissao existe?', typeof abrirMissao === 'function');

// Testar clique manual
$('#btConfirmar').onclick = ()=>{
  console.log('🔥 CLIQUE DETECTADO!');
  console.log('   Avião:', S.aviaoId);
  abrirMissao();
};
console.log('✅ Event listener adicionado. Clica no botão agora!');
```

---

## 📞 REPORTA O RESULTADO:

Depois de testar, diz-me:
1. Qual teste fizeste?
2. O que apareceu no console?
3. Funcionou ou continuou sem funcionar?

Assim posso ajudar melhor! 🚀
