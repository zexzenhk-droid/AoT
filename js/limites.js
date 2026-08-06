/* ============================================================
   AOT ENGENHEIRO — Limites e velocidades (IAS, km/h)
   ------------------------------------------------------------
   FONTE DIRECTA (wiki oficial do War Thunder, 28/07/2026):
     trem    Gear Speed Limit (IAS) — acima disto partes o trem
     flapsL  Flap Speed Limit, posição de aterragem (a mais frágil)
     flapsT  descolagem     flapsC  combate
     vne     Max Speed Limit (IAS) — limite estrutural
     corrida Takeoff Run (m)   curva Turn time (s)   wl carga alar (kg/m²)

   CALCULADO a partir da carga alar publicada:
     perda    velocidade de perda com flaps  Vs = √(2·(W/S)·g / (ρ·CLmax))
     rotacao  velocidade de rotação          ≈ 1,15 × Vs
     aprox_ap velocidade de aproximação      ≈ 1,30 × Vs
   Com ρ=1,225 kg/m³ ao nível do mar e CLmax≈2,0 (flaps em baixo).
   São ESTIMATIVAS de engenharia, não valores medidos no jogo —
   por isso o engenheiro diz 'por volta de' e não um número exacto.
   ============================================================ */

const LIMITES = {
  p51: {"trem": 287, "vne": 853, "corrida": 300, "flapsL": 433, "flapsT": 676, "flapsC": 676, "perda": 142, "rotacao": 164, "aprox_ap": 185, "wl": 195.0},
  p47: {"trem": 450, "vne": 885, "corrida": 600, "flapsL": 320, "flapsT": 469, "flapsC": 498, "perda": 153, "rotacao": 176, "aprox_ap": 199, "wl": 225.0},
  p63: {"trem": 304, "vne": 887, "corrida": 289, "flapsL": 262, "flapsT": 360, "flapsC": 378, "perda": 130, "rotacao": 149, "aprox_ap": 169, "wl": 162.0},
  p40: {"trem": 300, "vne": 819, "corrida": 342, "flapsL": 245, "flapsT": 530, "flapsC": 595, "perda": 135, "rotacao": 155, "aprox_ap": 175, "wl": 175.0},
  sb2c: {"trem": 333, "vne": 656, "corrida": 300, "flapsL": 250, "flapsT": 482, "flapsC": 504, "perda": 130, "rotacao": 149, "aprox_ap": 169, "wl": 162.0},
  sbd: {"trem": 450, "vne": 740, "corrida": 291, "flapsL": 320, "flapsT": 469, "flapsC": 498, "perda": 113, "rotacao": 129, "aprox_ap": 146, "wl": 122.0},
  f4u: {"trem": 730, "vne": 885, "corrida": 200, "flapsL": 253, "flapsT": 299, "flapsC": 388, "perda": 140, "rotacao": 161, "aprox_ap": 183, "wl": 190.0},
  bf109f: {"trem": 360, "vne": 790, "corrida": 363, "flapsL": 260, "flapsT": 409, "flapsC": 438, "perda": 136, "rotacao": 156, "aprox_ap": 176, "wl": 177.0},
  fw190: {"trem": 310, "vne": 912, "corrida": 420, "flapsL": 310, "flapsT": 700, "perda": 149, "rotacao": 171, "aprox_ap": 193, "wl": 213.0},
  bf109g: {"trem": 360, "vne": 790, "corrida": 300, "flapsL": 260, "flapsT": 409, "flapsC": 438, "perda": 139, "rotacao": 159, "aprox_ap": 180, "wl": 185.0},
  bf110: {"trem": 320, "vne": 745, "corrida": 444, "flapsL": 290, "flapsT": 439, "flapsC": 468, "perda": 151, "rotacao": 174, "aprox_ap": 197, "wl": 221.0},
  yak9t: {"trem": 320, "vne": 683, "corrida": 366, "flapsL": 280, "perda": 135, "rotacao": 155, "aprox_ap": 175, "wl": 175.0},
  la5fn: {"trem": 310, "vne": 735, "corrida": 341, "flapsL": 270, "flapsT": 419, "flapsC": 448, "perda": 140, "rotacao": 161, "aprox_ap": 183, "wl": 190.0},
  yak3: {"trem": 320, "vne": 685, "corrida": 348, "flapsL": 320, "perda": 136, "rotacao": 157, "aprox_ap": 177, "wl": 179.0},
  il2: {"trem": 320, "vne": 620, "corrida": 450, "flapsL": 270, "flapsT": 419, "perda": 124, "rotacao": 143, "aprox_ap": 161, "wl": 148.0},
  spitfirevb: {"trem": 270, "vne": 760, "corrida": 340, "flapsL": 260, "perda": 117, "rotacao": 135, "aprox_ap": 152, "wl": 132.0},
  spitfireia: {"trem": 270, "vne": 760, "corrida": 300, "flapsL": 260, "perda": 113, "rotacao": 129, "aprox_ap": 146, "wl": 122.0},
  typhoon: {"trem": 320, "vne": 845, "corrida": 450, "flapsL": 320, "flapsT": 394, "flapsC": 409, "perda": 141, "rotacao": 162, "aprox_ap": 184, "wl": 192.0},
  firefly: {"trem": 280, "vne": 720, "corrida": 450, "flapsL": 250, "flapsT": 327, "flapsC": 600, "perda": 140, "rotacao": 161, "aprox_ap": 183, "wl": 190.0},
  mosquito: {"trem": 315, "vne": 720, "corrida": 450, "flapsL": 264, "flapsT": 356, "flapsC": 390, "perda": 148, "rotacao": 170, "aprox_ap": 192, "wl": 211.0},
  hurricane: {"trem": 320, "vne": 660, "corrida": 359, "flapsL": 202, "flapsT": 247, "flapsC": 268, "perda": 120, "rotacao": 138, "aprox_ap": 156, "wl": 138.0},
  a6m3: {"trem": 240, "vne": 660, "corrida": 287, "flapsL": 220, "flapsT": 369, "flapsC": 398, "perda": 111, "rotacao": 127, "aprox_ap": 144, "wl": 118.0},
  ki61: {"trem": 250, "vne": 850, "corrida": 550, "flapsL": 230, "flapsT": 282, "flapsC": 292, "perda": 134, "rotacao": 154, "aprox_ap": 174, "wl": 172.0},
  j2m2: {"trem": 350, "vne": 820, "corrida": 300, "flapsL": 280, "flapsT": 455, "flapsC": 489, "perda": 128, "rotacao": 147, "aprox_ap": 166, "wl": 158.0},
  d4y3: {"trem": 350, "vne": 750, "corrida": 350, "flapsL": 280, "flapsT": 429, "flapsC": 458, "perda": 126, "rotacao": 145, "aprox_ap": 164, "wl": 153.0},

  /* WWI — sem dados na wiki. Valores históricos aproximados. */
  dr1: {"vne": 300, "corrida": 50, "perda": 75, "rotacao": 85, "aprox_ap": 100, "aprox": true},
  dvii: {"vne": 320, "corrida": 60, "perda": 80, "rotacao": 92, "aprox_ap": 105, "aprox": true},
  camel: {"vne": 290, "corrida": 55, "perda": 77, "rotacao": 88, "aprox_ap": 100, "aprox": true},
  spadsxiii: {"vne": 350, "corrida": 70, "perda": 90, "rotacao": 104, "aprox_ap": 118, "aprox": true}
};
