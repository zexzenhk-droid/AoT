# Instruções para Descobrir e Atualizar o Servidor Piper na TV Box

## 1. Descobrir o Script Python que está a correr na porta 8000

Execute os seguintes comandos na consola da TV Box (como root):

### Opção A: Procurar processos na porta 8000
```bash
netstat -tlnp | grep 8000
```
ou
```bash
ss -tlnp | grep 8000
```

Isto mostrará algo como:
```
tcp  0  0 0.0.0.0:8000  0.0.0.0:*  LISTEN  1234/python3
```

O número `1234` é o PID (Process ID). Com isso, pode fazer:

### Opção B: Ver o comando que iniciou o processo
```bash
ps aux | grep 8000
```

ou com o PID obtido acima:
```bash
ps aux | grep 1234
```

### Opção C: Procurar ficheiros Python no sistema
```bash
find /home -name "*.py" -type f 2>/dev/null | grep -i piper
find /opt -name "*.py" -type f 2>/dev/null | grep -i piper
find /root -name "*.py" -type f 2>/dev/null | grep -i piper
```

### Opção D: Ver o histórico de comandos executados
```bash
history | grep -i piper
history | grep -i python
```

---

## 2. Depois de encontrar o script

Uma vez encontrado o caminho do script (ex: `/root/piper_server.py`), execute:

```bash
cat /root/piper_server.py
```

Copie todo o conteúdo e partilhe comigo para que eu possa:
1. Atualizar o script para carregar dinamicamente os modelos .onnx corretos
2. Garantir que o áudio é enviado para o cliente (telemóvel/browser) e não para as colunas do PC

---

## 3. Verificar onde estão os modelos Piper atualmente

```bash
find /home -name "*.onnx" -type f 2>/dev/null
find /opt -name "*.onnx" -type f 2>/dev/null
find /root -name "*.onnx" -type f 2>/dev/null
```

Isto mostrará onde estão os modelos de vozes atualmente instalados.

---

## 4. Verificar a versão do Piper instalado

```bash
piper --version
which piper
```

---

Depois de executar estes comandos e partilhar os resultados, poderei:
- Criar um script de sincronização para copiar os modelos do seu PC para a TV Box
- Atualizar o servidor Python para suportar múltiplas vozes dinamicamente
- Garantir que o áudio é reproduzido no cliente correto
