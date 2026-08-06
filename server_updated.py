import subprocess
import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mapeamento de vozes para os ficheiros .onnx
MAPA_VOZES = {
    'pt-PT': 'pt_PT-tugão-medium',
    'pt-BR': 'pt_BR-faber-medium',
    'en-US': 'en_US-joe-medium',
    'en-GB': 'en_GB-alan-medium',
    'de-DE': 'de_DE-thorsten-medium',
    'fr-FR': 'fr_FR-tom-medium',
    'ru-RU': 'ru_RU-dmitri-medium',
    'es-ES': 'es_ES-davefx-medium'
}

# Diretório onde estão os modelos de vozes
MODELOS_DIR = "/opt/piper/voices"

class DadosVoz(BaseModel):
    texto: str
    voz: str = "pt_PT-tugão-medium"  # voz padrão se não for especificada

@app.post("/falar")
def gerar_voz(dados: DadosVoz):
    """
    Gera áudio usando o Piper com a voz especificada.
    
    Espera um JSON como:
    {
        "texto": "Olá mundo",
        "voz": "pt_PT-tugão-medium"  (opcional, usa pt_PT-tugão-medium por padrão)
    }
    
    Retorna um blob de áudio .wav
    """
    texto = dados.texto.strip()
    voz = dados.voz.strip()
    
    if not texto:
        return Response(status_code=400, content="Texto vazio")
    
    # Validar se a voz é conhecida
    if voz not in MAPA_VOZES.values():
        # Tentar encontrar a voz pelo código (ex: pt-PT -> pt_PT-tugão-medium)
        voz_encontrada = None
        for codigo, nome_voz in MAPA_VOZES.items():
            if codigo == voz or nome_voz == voz:
                voz_encontrada = nome_voz
                break
        
        if not voz_encontrada:
            # Se não encontrar, usar a voz padrão
            print(f"Aviso: Voz '{voz}' não encontrada. Usando voz padrão.")
            voz = "pt_PT-tugão-medium"
        else:
            voz = voz_encontrada
    
    # Construir o caminho do modelo .onnx
    modelo_path = os.path.join(MODELOS_DIR, voz, f"{voz}.onnx")
    
    # Verificar se o modelo existe
    if not os.path.exists(modelo_path):
        print(f"Erro: Modelo não encontrado em {modelo_path}")
        # Tentar procurar o modelo no diretório raiz (compatibilidade com versão antiga)
        modelo_path_alt = f"/opt/piper/{voz}.onnx"
        if os.path.exists(modelo_path_alt):
            modelo_path = modelo_path_alt
        else:
            return Response(
                status_code=404,
                content=f"Modelo de voz '{voz}' não encontrado"
            )
    
    # Ficheiro de saída temporário
    saida_wav = "/tmp/piper_saida.wav"
    
    try:
        # Executar o Piper com o modelo especificado
        cmd = f"echo '{texto}' | /opt/piper/piper --model {modelo_path} --output_file {saida_wav}"
        resultado = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if resultado.returncode != 0:
            print(f"Erro ao executar Piper: {resultado.stderr}")
            return Response(status_code=500, content="Erro ao gerar áudio")
        
        # Verificar se o ficheiro foi criado
        if not os.path.exists(saida_wav):
            print(f"Erro: Ficheiro de saída não foi criado")
            return Response(status_code=500, content="Erro ao gerar áudio")
        
        # Ler o ficheiro de áudio
        with open(saida_wav, "rb") as f:
            audio_data = f.read()
        
        # Limpar o ficheiro temporário
        try:
            os.remove(saida_wav)
        except:
            pass
        
        # Retornar o áudio com o tipo MIME correto
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={"Content-Disposition": "inline"}
        )
    
    except Exception as e:
        print(f"Erro ao gerar áudio: {str(e)}")
        return Response(status_code=500, content=f"Erro ao gerar áudio: {str(e)}")

@app.get("/vozes")
def listar_vozes():
    """
    Retorna a lista de vozes disponíveis.
    """
    return {
        "vozes": MAPA_VOZES,
        "vozes_disponiveis": list(MAPA_VOZES.keys())
    }

@app.get("/health")
def health_check():
    """
    Verifica se o servidor está a funcionar.
    """
    return {"status": "ok"}
