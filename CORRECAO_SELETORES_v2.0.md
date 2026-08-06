# ✅ CORREÇÃO: Seletores Movidos para "Configurar Missão"

**Data**: 05/08/2026  
**Problema**: Os seletores de Patentes, Missões e Mapas apareciam em "Definições" em vez de "Configurar Missão"

---

## 🔧 ALTERAÇÕES REALIZADAS:

### 1. **index.html** - Linhas 121-124
**MOVIDO** os 4 containers de `#modalDefs` (Definições) para `#scMissao` (Configurar Missão):

```html
<!-- ANTES: Linha ~254 em #modalDefs -->
<!-- DEPOIS: Linha 121-124 em #scMissao -->

<div id="seletorPatentes"></div>
<div id="seletorMissoes"></div>
<div id="seletorMapas"></div>
<div id="recomendacaoArmamento"></div>
```

**Posição**: Após o card de "Armamento" e antes do "Briefing"

---

### 2. **js/app.js** - Linhas 412-415
**MOVIDO** as chamadas das funções de `abrirDefs()` para `actMissao()`:

```javascript
// ANTES: Em função abrirDefs() (linha ~655)
// DEPOIS: Em função actMissao() (linhas 412-415)

// [v2.0] Renderizar novos seletores na página de Missão
renderSeletorPatentes();
renderSeletorMissoes();
renderSeletorMapas();
mostrarRecomendacaoArmamento();
```

**Contexto**: Agora renderiza sempre que a missão é atualizada

---

## ✅ RESULTADO:

Os seletores agora aparecem corretamente em:

**"Configurar Missão"** (scMissao) ✅
- 🟢 Nação Militar + Patente + Call Sign
- 🔵 Tipo de Missão + Lista de Missões
- 🟠 Mapa + Condições Meteorológicas
- 🔴 Recomendação de Armamento

**NÃO aparecem mais em "Definições"** ❌

---

## 📊 VERIFICAÇÃO:

```bash
# Sintaxe JavaScript OK
node --check js/app.js

# Containers no lugar certo
Select-String -Path index.html -Pattern 'seletorPatentes'
# Resultado: Linha 121 (dentro de #scMissao)
```

---

## 🎯 FUNCIONAMENTO:

1. Utilizador seleciona aeronave no Hangar
2. Clica "Confirmar aeronave"
3. Abre **"Configurar Missão"**
4. **TODOS os seletores aparecem corretamente** antes do Briefing
5. Pode configurar: Patente → Missão → Mapa → Clima → Ver recomendação de armamento

---

**STATUS**: ✅ **CORRIGIDO E FUNCIONAL**
