#!/bin/bash

# Script para sincronizar os modelos de vozes Piper do PC para a TV Box (Armbian)
# Uso: ./sync_voices_to_tvbox.sh <IP_TV_BOX> <UTILIZADOR> <SENHA>
# Exemplo: ./sync_voices_to_tvbox.sh 192.168.1.78 root senha123

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}Uso: $0 <IP_TV_BOX> <UTILIZADOR> [SENHA]${NC}"
    echo "Exemplo: $0 192.168.1.78 root"
    echo ""
    echo "Se não fornecer a senha, será pedida interativamente."
    exit 1
fi

TV_BOX_IP=$1
TV_BOX_USER=$2
TV_BOX_PASSWD=${3:-""}

# Diretório local com as vozes
LOCAL_VOICES_DIR="C:\\projetos\\GUARDADOS no GitHub - projetos zip\\PIPER-vozes\\Piper voices"

# Diretório remoto na TV Box
REMOTE_VOICES_DIR="/opt/piper/voices"

echo -e "${YELLOW}=== Sincronização de Vozes Piper para TV Box ===${NC}"
echo "IP da TV Box: $TV_BOX_IP"
echo "Utilizador: $TV_BOX_USER"
echo "Diretório local: $LOCAL_VOICES_DIR"
echo "Diretório remoto: $REMOTE_VOICES_DIR"
echo ""

# Verificar se o diretório local existe
if [ ! -d "$LOCAL_VOICES_DIR" ]; then
    echo -e "${RED}Erro: Diretório local não encontrado: $LOCAL_VOICES_DIR${NC}"
    exit 1
fi

# Contar ficheiros .onnx
ONNX_COUNT=$(find "$LOCAL_VOICES_DIR" -name "*.onnx" | wc -l)
echo -e "${GREEN}Encontrados $ONNX_COUNT ficheiros .onnx${NC}"
echo ""

# Se não foi fornecida senha, pedir interativamente
if [ -z "$TV_BOX_PASSWD" ]; then
    echo -e "${YELLOW}Introduza a senha para $TV_BOX_USER@$TV_BOX_IP:${NC}"
    read -s TV_BOX_PASSWD
    echo ""
fi

# Criar o diretório remoto se não existir
echo -e "${YELLOW}Criando diretório remoto...${NC}"
sshpass -p "$TV_BOX_PASSWD" ssh -o StrictHostKeyChecking=no "$TV_BOX_USER@$TV_BOX_IP" "mkdir -p $REMOTE_VOICES_DIR"

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao criar diretório remoto. Verifique as credenciais.${NC}"
    exit 1
fi

echo -e "${GREEN}Diretório remoto criado com sucesso${NC}"
echo ""

# Sincronizar os ficheiros usando rsync via SSH
echo -e "${YELLOW}Sincronizando ficheiros...${NC}"
echo "Isto pode levar alguns minutos dependendo do tamanho dos ficheiros..."
echo ""

sshpass -p "$TV_BOX_PASSWD" rsync -avz \
    --rsh="ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_VOICES_DIR/" \
    "$TV_BOX_USER@$TV_BOX_IP:$REMOTE_VOICES_DIR/"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=== Sincronização concluída com sucesso! ===${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Copie o ficheiro 'server_updated.py' para a TV Box:"
    echo "   scp server_updated.py $TV_BOX_USER@$TV_BOX_IP:/opt/piper/server.py"
    echo ""
    echo "2. Reinicie o servidor Piper na TV Box:"
    echo "   ssh $TV_BOX_USER@$TV_BOX_IP 'pkill -f \"uvicorn server:app\" && sleep 2 && cd /opt/piper && /opt/piper/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 &'"
    echo ""
    echo "3. Teste o servidor:"
    echo "   curl -X POST http://$TV_BOX_IP:8000/falar -H 'Content-Type: application/json' -d '{\"texto\": \"Olá\", \"voz\": \"pt_PT-tugão-medium\"}' --output teste.wav"
else
    echo -e "${RED}Erro durante a sincronização${NC}"
    exit 1
fi
