/* ============================================================
   AOT ENGENHEIRO — ESQUEMAS DE BOTÕES (múltiplos, HOTAS/joystick)
   ------------------------------------------------------------
   Mantém S.bindings com o MESMO formato de sempre para o
   Engenheiro/dialogo.js continuarem a funcionar sem alterações.
   ============================================================ */
(function(){
'use strict';

const BOTOES_HOTAS = [
  'R1','R2','R3','L1','L2','L3',
  'Rocker','Hat',
  'Supp. 1','Supp. 2',
  '△','○','X','□',
  'Aux 1','Aux 2'
];

function funcoesOmissao(){
  return [
    {id:'metralhadoras', nome:'Metralhadoras',      subtitulo:'gatilho do manche',              botoes:['R1']},
    {id:'canhoes',       nome:'Canhões',             subtitulo:'polegar do manche',              botoes:['L1']},
    {id:'foguetes',      nome:'Foguetes',            subtitulo:'polegar do manche',              botoes:['L3']},
    {id:'bombas',        nome:'Bombas',              subtitulo:'acelerador',                     botoes:['X']},
    {id:'recarregar',    nome:'Recarregar',          subtitulo:'acelerador',                     botoes:['□']},
    {id:'trem',          nome:'Trem de aterragem',   subtitulo:'acelerador',                     botoes:['△']},
    {id:'airbrake',      nome:'Travão aerodinâmico', subtitulo:'acelerador',                     botoes:['○']},
    {id:'flaps_baixar',  nome:'Flaps (baixar)',      subtitulo:'acelerador',                     botoes:['R2']},
    {id:'flaps_subir',   nome:'Flaps (subir)',       subtitulo:'acelerador',                     botoes:['L2']},
    {id:'leme',          nome:'Leme',                subtitulo:'basculante atrás do acelerador', botoes:['Rocker']},
    {id:'trim',          nome:'Trim',                subtitulo:'chapéu no topo do manche',        botoes:['Hat']},
    {id:'vista',         nome:'Recentrar vista',     subtitulo:'lateral do manche',               botoes:['R3']},
    {id:'wep',           nome:'WEP',                 subtitulo:'base do acelerador',              botoes:['Supp. 2']},
    {id:'motor_manual',  nome:'Motor auto/manual',   subtitulo:'base do acelerador',              botoes:['Supp. 1']},
    {id:'saltar',        nome:'Saltar',              subtitulo:'acelerador',                      botoes:['□','X']}
  ];
}

function novoId(pref){ return (pref||'e')+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

function aoLongPress(el, cb, ms){
  let t=null, disparou=false;
  const iniciar=()=>{ disparou=false; t=setTimeout(()=>{ disparou=true; cb(); }, ms||550); };
  const cancelar=()=>{ clearTimeout(t); };
  el.addEventListener('pointerdown', iniciar);
  el.addEventListener('pointerup', cancelar);
  el.addEventListener('pointerleave', cancelar);
  el.addEventListener('pointercancel', cancelar);
  return ()=>disparou;
}

let lista = [];
let rascunho = null;
let editandoId = null;

let modoSelEsq = false;   const selEsq = new Set();
let modoSelFn  = false;   const selFn  = new Set();

function carregar(){
  lista = store.get('esquemas', null);
  if(!lista || !lista.length){
    const antigo = store.get('bindings', null);
    let funcoes = funcoesOmissao();
    if(antigo){
      funcoes = funcoes.map(f=>{
        const a = antigo[f.id];
        if(!a) return f;
        const botoes = String(a.botao||'').split('+').map(s=>s.trim()).filter(Boolean);
        return {...f, subtitulo: a.onde || f.subtitulo, botoes: botoes.length?botoes:f.botoes};
      });
    }
    lista = [{ id:novoId(), nome:'Perfil HOTAS 5', ativo:true, funcoes }];
    guardarTudo();
  }
  if(!lista.some(e=>e.ativo)){ lista[0].ativo = true; guardarTudo(); }
  aplicarAtivoEmS();
}

function guardarTudo(){ store.set('esquemas', lista); }
function obterAtivo(){ return lista.find(e=>e.ativo) || lista[0]; }

function aplicarAtivoEmS(){
  const ativo = obterAtivo(); if(!ativo) return;
  const obj = {};
  ativo.funcoes.forEach(f=>{
    const texto = f.botoes.join(' + ');
    obj[f.id] = { onde:f.subtitulo, botao:texto, voz:texto };
  });
  S.bindings = obj;
  store.set('bindings', obj);
  if(S.eng) S.eng.bindings = obj;
}

function exportarFicheiro(nomeBase, objeto){
  const texto = JSON.stringify(objeto, null, 2);
  const b = new Blob([texto], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `${nomeBase.replace(/\s+/g,'_')}.json`;
  a.click(); URL.revokeObjectURL(a.href);
}

/* ============================================================
   MENU PRINCIPAL — lista de esquemas
   ============================================================ */
function abrirLista(){
  modoSelEsq = false; selEsq.clear();
  render();
  // botão "Importar esquema" ao lado do "Adicionar esquema"
  const btAdd = $('#btAdicionarEsquema');
  if(btAdd && !$('#btImportarEsquema')){
    const btImp = document.createElement('button');
    btImp.id = 'btImportarEsquema';
    btImp.className = 'btn ghost';
    btImp.style.marginTop = '8px';
    btImp.textContent = '📥 Importar esquema';
    btImp.onclick = importar;
    btAdd.insertAdjacentElement('afterend', btImp);
  }
  $('#modalDefs')?.classList.remove('on');
  $('#modalEsquemas').classList.add('on');
}

function render(){
  const box = $('#modalEsquemas .modal-box'); if(!box) return;

  let bar = $('#esqBarraSel');
  if(modoSelEsq){
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'esqBarraSel';
      bar.className = 'esq-toolbar';
      box.insertBefore(bar, box.children[1]);
    }
    bar.style.display = 'flex';
    bar.innerHTML = `
      <span>${selEsq.size} selecionado(s)</span>
      <span class="esq-toolbar-acoes">
        <button class="btn ghost" id="btEsqSelPartilhar">📤 Partilhar</button>
        <button class="btn ghost danger" id="btEsqSelApagar">🗑️ Apagar</button>
        <button class="btn ghost" id="btEsqSelCancelar">Cancelar</button>
      </span>`;
    $('#btEsqSelCancelar').onclick = ()=>{ modoSelEsq=false; selEsq.clear(); render(); };
    $('#btEsqSelApagar').onclick = ()=>apagarSelecionados();
    $('#btEsqSelPartilhar').onclick = ()=>partilharSelecionados();
  } else if(bar){
    bar.style.display = 'none';
  }

  const c = $('#listaEsquemas'); if(!c) return;
  c.innerHTML = lista.map(e=>`
    <div class="esq-item ${selEsq.has(e.id)?'sel':''}" data-id="${e.id}">
      <button class="esq-nome" data-abrir="${e.id}">${selEsq.has(e.id)?'☑️ ':''}${e.nome}</button>
      ${modoSelEsq ? '' : `<label class="sw"><input type="checkbox" data-lig="${e.id}" ${e.ativo?'checked':''}><i></i></label>`}
    </div>`).join('');

  $$('.esq-nome', c).forEach(b=>{
    const id = b.dataset.abrir;
    const foiLongPress = aoLongPress(b, ()=>{ modoSelEsq = true; selEsq.add(id); render(); });
    b.onclick = ()=>{
      if(foiLongPress()) return;
      if(modoSelEsq){
        if(selEsq.has(id)) selEsq.delete(id); else selEsq.add(id);
        if(selEsq.size===0) modoSelEsq=false;
        render();
      } else {
        abrirEditor(id);
      }
    };
  });

  $$('[data-lig]', c).forEach(b=>b.onchange=()=>{
    const id = b.dataset.lig;
    const alvo = lista.find(e=>e.id===id);
    if(!alvo.ativo){
      lista.forEach(e=>e.ativo=false);
      alvo.ativo = true;
      guardarTudo(); aplicarAtivoEmS();
      toast(`✅ Esquema ativo: ${alvo.nome}`);
      render();
    } else {
      b.checked = true;
      toast('Tem de haver sempre um esquema ativo. Liga outro para trocar.', true);
    }
  });
}

function fecharListaGuardando(){
  if(!lista.some(e=>e.ativo)){
    toast('Não podes sair sem um esquema ativo.', true);
    return;
  }
  modoSelEsq = false; selEsq.clear();
  $('#modalEsquemas').classList.remove('on');
}

function adicionar(){
  const e = { id:novoId(), nome:'Novo esquema', ativo: lista.length===0, funcoes: funcoesOmissao() };
  lista.push(e);
  guardarTudo();
  if(e.ativo) aplicarAtivoEmS();
  render();
  abrirEditor(e.id);
}

/* ---------- importar esquema(s) de um ficheiro .json ---------- */
function garantirInputImportar(){
  let input = $('#inImportarEsquema');
  if(!input){
    input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.id = 'inImportarEsquema';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', ()=>{
      const ficheiro = input.files[0]; if(!ficheiro) return;
      const leitor = new FileReader();
      leitor.onload = ()=>{
        try{
          const dados = JSON.parse(leitor.result);
          const novos = Array.isArray(dados) ? dados : [dados];
          novos.forEach(e=>{
            if(!e || !Array.isArray(e.funcoes)) return;
            lista.push({ id:novoId(), nome:(e.nome||'Esquema importado')+' (importado)', ativo:false, funcoes:e.funcoes });
          });
          guardarTudo();
          render();
          toast(`Importado(s) ${novos.length} esquema(s)`);
        }catch(err){
          toast('Ficheiro inválido — não é um esquema exportado por esta app.', true);
        }
        input.value = '';
      };
      leitor.readAsText(ficheiro);
    });
  }
  return input;
}
function importar(){ garantirInputImportar().click(); }

function apagarSelecionados(){
  if(selEsq.size >= lista.length){
    toast('Tem de sobrar sempre pelo menos um esquema.', true);
    return;
  }
  const eraAtivoApagado = lista.some(e=>selEsq.has(e.id) && e.ativo);
  lista = lista.filter(e=>!selEsq.has(e.id));
  if(eraAtivoApagado) lista[0].ativo = true;
  guardarTudo(); aplicarAtivoEmS();
  modoSelEsq = false; selEsq.clear();
  render();
  toast('Esquema(s) apagado(s)');
}

function partilharSelecionados(){
  const escolhidos = lista.filter(e=>selEsq.has(e.id));
  if(escolhidos.length === 1) exportarFicheiro(escolhidos[0].nome, escolhidos[0]);
  else exportarFicheiro('esquemas', escolhidos);
  toast('A descarregar…');
}

/* ============================================================
   EDITOR DE UM ESQUEMA
   ============================================================ */
function abrirEditor(id){
  const original = lista.find(e=>e.id===id); if(!original) return;
  editandoId = id;
  rascunho = JSON.parse(JSON.stringify(original));
  modoSelFn = false; selFn.clear();
  renderEditor();
  $('#modalEsquemas').classList.remove('on');
  $('#modalEsquemaEditor').classList.add('on');
}

function renderEditor(){
  $('#inNomeEsquema').value = rascunho.nome;
  // legendas nos ícones do topo, para ficar claro o que cada um faz
  const btAp = $('#btApagarEsquema'), btDup = $('#btDuplicarEsquema'), btPar = $('#btPartilharEsquema');
  if(btAp && !btAp.querySelector('small')) btAp.innerHTML = '🗑️<small>Apagar</small>';
  if(btDup && !btDup.querySelector('small')) btDup.innerHTML = '📄<small>Duplicar</small>';
  if(btPar && !btPar.querySelector('small')) btPar.innerHTML = '📤<small>Exportar</small>';
  const box = $('#modalEsquemaEditor .modal-box');
  const listaEl = $('#listaFuncoes');

  let bar = $('#fnBarraSel');
  if(modoSelFn){
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'fnBarraSel';
      bar.className = 'esq-toolbar';
      box.insertBefore(bar, listaEl);
    }
    bar.style.display = 'flex';
    bar.innerHTML = `
      <span>${selFn.size} selecionada(s)</span>
      <span class="esq-toolbar-acoes">
        <button class="btn ghost" id="btFnSelDuplicar">📄 Duplicar</button>
        <button class="btn ghost danger" id="btFnSelApagar">🗑️ Apagar</button>
        <button class="btn ghost" id="btFnSelCancelar">Cancelar</button>
      </span>`;
    $('#btFnSelCancelar').onclick = ()=>{ modoSelFn=false; selFn.clear(); renderEditor(); };
    $('#btFnSelDuplicar').onclick = ()=>{
      const novas = rascunho.funcoes.filter(f=>selFn.has(f.id)).map(f=>({
        ...JSON.parse(JSON.stringify(f)), id:novoId('f'), nome:f.nome+' (cópia)'
      }));
      rascunho.funcoes.push(...novas);
      modoSelFn = false; selFn.clear();
      renderEditor();
    };
    $('#btFnSelApagar').onclick = ()=>{
      if(selFn.size >= rascunho.funcoes.length){
        toast('Tem de sobrar sempre pelo menos uma função.', true);
        return;
      }
      rascunho.funcoes = rascunho.funcoes.filter(f=>!selFn.has(f.id));
      modoSelFn = false; selFn.clear();
      renderEditor();
    };
  } else if(bar){
    bar.style.display = 'none';
  }

  listaEl.innerHTML = rascunho.funcoes.map(f=>`
    <div class="esq-fn ${selFn.has(f.id)?'sel':''}" data-fn="${f.id}">
      <button class="fn-nome" data-editar="${f.id}">
        ${selFn.has(f.id)?'☑️ ':''}${f.nome}<small>${f.subtitulo||''}</small>
      </button>
      <button class="fn-botao" data-escolher="${f.id}">
        ${f.botoes.map(b=>`<span>${b}</span>`).join('<i>+</i>')}
      </button>
    </div>`).join('');

  $$('.fn-nome', listaEl).forEach(b=>{
    const id = b.dataset.editar;
    const foiLongPress = aoLongPress(b, ()=>{ modoSelFn = true; selFn.add(id); renderEditor(); });
    b.onclick = ()=>{
      if(foiLongPress()) return;
      if(modoSelFn){
        if(selFn.has(id)) selFn.delete(id); else selFn.add(id);
        if(selFn.size===0) modoSelFn=false;
        renderEditor();
      } else {
        abrirEditarNome(id);
      }
    };
  });
  $$('.fn-botao', listaEl).forEach(b=>b.onclick=()=>{
    if(modoSelFn) return;
    abrirSeletorBotao(b.dataset.escolher);
  });

  let btAdd = $('#btAdicionarFuncao');
  if(!btAdd){
    btAdd = document.createElement('button');
    btAdd.id = 'btAdicionarFuncao';
    btAdd.className = 'btn ghost';
    btAdd.textContent = '➕ Adicionar função';
    btAdd.style.marginTop = '10px';
    listaEl.insertAdjacentElement('afterend', btAdd);
  }
  btAdd.onclick = ()=>{
    const f = { id:novoId('f'), nome:'Nova função', subtitulo:'', botoes:['R1'] };
    rascunho.funcoes.push(f);
    renderEditor();
    abrirEditarNome(f.id);
  };
}

function fecharEditorSemGravar(){
  modoSelFn = false; selFn.clear();
  $('#modalEsquemaEditor').classList.remove('on');
  $('#modalEsquemas').classList.add('on');
  render();
}

function guardarEditor(){
  rascunho.nome = $('#inNomeEsquema').value.trim() || rascunho.nome;
  const i = lista.findIndex(e=>e.id===editandoId);
  if(i>=0) lista[i] = rascunho;
  guardarTudo();
  if(rascunho.ativo) aplicarAtivoEmS();
  toast('Esquema guardado');
  fecharEditorSemGravar();
}

function apagarDeDentroDoEditor(){
  if(lista.length<=1){
    toast('Tem de sobrar sempre pelo menos um esquema.', true);
    return;
  }
  const eraAtivo = lista.find(e=>e.id===editandoId)?.ativo;
  lista = lista.filter(e=>e.id!==editandoId);
  if(eraAtivo) lista[0].ativo = true;
  guardarTudo(); aplicarAtivoEmS();
  fecharEditorSemGravar();
}

function duplicar(id){
  const original = lista.find(e=>e.id===id); if(!original) return;
  const copia = JSON.parse(JSON.stringify(original));
  copia.id = novoId();
  copia.nome = original.nome + ' (cópia)';
  copia.ativo = false;
  const i = lista.findIndex(e=>e.id===id);
  lista.splice(i+1, 0, copia);
  guardarTudo();
  render();
  toast('Esquema duplicado');
}

function partilharEsquema(){
  exportarFicheiro(rascunho.nome, rascunho);
  toast('A descarregar…');
}

let editandoFnId = null;
function abrirEditarNome(fnId){
  editandoFnId = fnId;
  const f = rascunho.funcoes.find(x=>x.id===fnId); if(!f) return;
  $('#inNomeFuncao').value = f.nome;
  $('#inSubFuncao').value = f.subtitulo||'';
  $('#modalEditarFuncao').classList.add('on');
}
function guardarNomeFuncao(){
  const f = rascunho.funcoes.find(x=>x.id===editandoFnId); if(!f) return;
  f.nome = $('#inNomeFuncao').value.trim() || f.nome;
  f.subtitulo = $('#inSubFuncao').value.trim();
  $('#modalEditarFuncao').classList.remove('on');
  renderEditor();
}

let escolhendoFnId = null;
function abrirSeletorBotao(fnId){
  escolhendoFnId = fnId;
  const c = $('#listaBotoesSeletor');
  c.innerHTML = BOTOES_HOTAS.map(b=>`<button class="opt" data-b="${b}"><b>${b}</b></button>`).join('');
  $$('.opt', c).forEach(b=>b.onclick=()=>escolherBotao(b.dataset.b));
  $('#modalSeletorBotao').classList.add('on');
}

function escolherBotao(botao){
  const fn = rascunho.funcoes.find(x=>x.id===escolhendoFnId); if(!fn) return;
  const antigos = fn.botoes.slice();
  const outra = rascunho.funcoes.find(x=>x.id!==fn.id && x.botoes.length===1 && x.botoes[0]===botao);
  if(outra && antigos.length===1){ outra.botoes = antigos; }
  fn.botoes = [botao];
  $('#modalSeletorBotao').classList.remove('on');
  renderEditor();
  perguntarMaisUmBotao(fn.id);
}

function perguntarMaisUmBotao(fnId){
  if(confirm('Adicionar mais um botão a este combo?')){
    escolhendoFnId = fnId;
    const fn = rascunho.funcoes.find(x=>x.id===fnId);
    const c = $('#listaBotoesSeletor');
    c.innerHTML = BOTOES_HOTAS
      .filter(b=>!fn.botoes.includes(b))
      .map(b=>`<button class="opt" data-b="${b}"><b>${b}</b></button>`).join('');
    $$('.opt', c).forEach(b=>b.onclick=()=>{
      fn.botoes.push(b.dataset.b);
      $('#modalSeletorBotao').classList.remove('on');
      renderEditor();
      perguntarMaisUmBotao(fnId);
    });
    $('#modalSeletorBotao').classList.add('on');
  }
}

function ligarEventos(){
  $('#btBindings').onclick = abrirLista;
  $('#btFecharEsquemas').onclick = fecharListaGuardando;
  $('#btAdicionarEsquema').onclick = adicionar;

  $('#btFecharEditorEsquema').onclick = fecharEditorSemGravar;
  $('#btGuardarEsquema').onclick = guardarEditor;
  $('#btApagarEsquema').onclick = apagarDeDentroDoEditor;
  $('#btPartilharEsquema').onclick = partilharEsquema;
  $('#btDuplicarEsquema')?.addEventListener('click', ()=>duplicar(editandoId));

  $('#btFecharEditarFuncao').onclick = ()=>$('#modalEditarFuncao').classList.remove('on');
  $('#btGuardarEditarFuncao').onclick = guardarNomeFuncao;

  $('#btFecharSeletorBotao').onclick = ()=>$('#modalSeletorBotao').classList.remove('on');
}

window.Esquemas = { carregar, ligarEventos, obterAtivo, aplicarAtivoEmS };

document.addEventListener('DOMContentLoaded', ()=>{
  carregar();
  ligarEventos();
});

})();
