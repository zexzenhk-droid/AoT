/**
 * AOT Engenheiro v2.0
 * Sistema de Patentes Militares Autênticas - 2ª Guerra Mundial
 * Inclui indicativos de rádio (Call Signs) e fraseologia de combate
 */

// ============= PATENTES USAAF (USA) =============
const usaafPatentes = {
  'second-lieutenant': {
    rank: 'Second Lieutenant',
    portugu: '2º Tenente',
    abbreviation: '2nd Lt',
    callSignFormat: 'Ace-{pilotNumber}',
    radicalCallSign: ['Ace', 'Eagle', 'Thunder', 'Maverick'],
    formality: 'High',
    experienceLevel: 'Junior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Engaging enemy', phrase: 'Tallyho! Contact at...', english: 'Visual on target' },
      { situation: 'Low ammunition', phrase: 'Bingo! RTB', english: 'Returning to base' },
      { situation: 'Victory', phrase: 'Splash! One enemy down', english: 'Confirmed kill' }
    ]
  },
  'first-lieutenant': {
    rank: 'First Lieutenant',
    portugu: '1º Tenente',
    abbreviation: '1st Lt',
    callSignFormat: 'Eagle-{pilotNumber}',
    radicalCallSign: ['Eagle', 'Falcon', 'Hawk', 'Bandit'],
    formality: 'High',
    experienceLevel: 'Officer',
    aircraftTypes: ['Fighter', 'Bomber'],
    radioPhraseCatalog: [
      { situation: 'Leading flight', phrase: 'This is Lead. Bogey 12 o\'clock.', english: 'Enemy contact' },
      { situation: 'Coordinating', phrase: 'Check six, bandits incoming', english: 'Enemy behind' },
      { situation: 'Formation', phrase: 'Tighten up! Watch your six', english: 'Stay close and watch rear' }
    ]
  },
  'captain': {
    rank: 'Captain',
    portugu: 'Capitão',
    abbreviation: 'Capt',
    callSignFormat: 'Hawk-{pilotNumber}',
    radicalCallSign: ['Hawk', 'Viper', 'Titan', 'Alpha'],
    formality: 'High',
    experienceLevel: 'Senior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Command', phrase: 'All elements, this is Hawk Lead', english: 'Flight leader' },
      { situation: 'Attack', phrase: 'Buster! Attack the enemy formation', english: 'Maximum speed attack' },
      { situation: 'Retreat', phrase: 'Break off! Head for the deck', english: 'Tactical retreat' }
    ]
  },
  'major': {
    rank: 'Major',
    portugu: 'Major',
    abbreviation: 'Maj',
    callSignFormat: 'Titan-{pilotNumber}',
    radicalCallSign: ['Titan', 'Zeus', 'Overlord', 'Command'],
    formality: 'Very High',
    experienceLevel: 'Veteran Officer',
    aircraftTypes: ['Fighter', 'Bomber'],
    radioPhraseCatalog: [
      { situation: 'Strategic', phrase: 'Roger that. Mission is go.', english: 'Mission approved' },
      { situation: 'Victory', phrase: 'Excellent work. RTB with victory', english: 'Return to base victorious' }
    ]
  },
  'lieutenant-colonel': {
    rank: 'Lieutenant Colonel',
    portugu: 'Tenente-Coronel',
    abbreviation: 'Lt Col',
    callSignFormat: 'Command-{pilotNumber}',
    radicalCallSign: ['Command', 'Overlord', 'Crown', 'Phoenix'],
    formality: 'Very High',
    experienceLevel: 'Senior Commander',
    aircraftTypes: ['Fighter', 'Bomber', 'Command'],
    radioPhraseCatalog: [
      { situation: 'Strategic decision', phrase: 'All units, this is Command', english: 'Authority speaking' }
    ]
  },
  'colonel': {
    rank: 'Colonel',
    portugu: 'Coronel',
    abbreviation: 'Col',
    callSignFormat: 'Overlord-{pilotNumber}',
    radicalCallSign: ['Overlord', 'Crown', 'Supreme', 'Chief'],
    formality: 'Extreme',
    experienceLevel: 'Commander',
    aircraftTypes: ['Any']
  }
};

// ============= PATENTES RAF (REINO UNIDO) =============
const rafPatentes = {
  'pilot-officer': {
    rank: 'Pilot Officer',
    portugu: 'Oficial Piloto',
    abbreviation: 'P/O',
    callSignFormat: 'Rook-{pilotNumber}',
    radicalCallSign: ['Rook', 'Sparrow', 'Lark', 'Swift'],
    formality: 'High',
    experienceLevel: 'Junior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Engaging', phrase: 'Tally-ho! Enemy at...', english: 'Visual contact' },
      { situation: 'Fuel', phrase: 'Getting low on fuel, RTB', english: 'Returning to base' },
      { situation: 'Danger', phrase: 'Watch your six! Bandits!', english: 'Enemy behind' }
    ]
  },
  'flying-officer': {
    rank: 'Flying Officer',
    portugu: 'Oficial Aviador',
    abbreviation: 'F/O',
    callSignFormat: 'Hawk-{pilotNumber}',
    radicalCallSign: ['Hawk', 'Falcon', 'Condor', 'Phoenix'],
    formality: 'High',
    experienceLevel: 'Officer',
    aircraftTypes: ['Fighter', 'Bomber'],
    radioPhraseCatalog: [
      { situation: 'Leading', phrase: 'Right-oh lads, tally-ho!', english: 'Let\'s go!' },
      { situation: 'Formation', phrase: 'Number Two, stay tight', english: 'Hold formation' }
    ]
  },
  'flight-lieutenant': {
    rank: 'Flight Lieutenant',
    portugu: 'Tenente de Voo',
    abbreviation: 'F/L',
    callSignFormat: 'Falcon-{pilotNumber}',
    radicalCallSign: ['Falcon', 'Eagle', 'Typhoon', 'Victor'],
    formality: 'High',
    experienceLevel: 'Senior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Command', phrase: 'This is Flight Lead, weapons free', english: 'Cleared to fire' },
      { situation: 'Tactics', phrase: 'Bounce them from above!', english: 'Attack from altitude' }
    ]
  },
  'squadron-leader': {
    rank: 'Squadron Leader',
    portugu: 'Líder de Esquadrão',
    abbreviation: 'S/L',
    callSignFormat: 'Typhoon-{pilotNumber}',
    radicalCallSign: ['Typhoon', 'Hurricane', 'Spitfire', 'Command'],
    formality: 'Very High',
    experienceLevel: 'Squadron Commander',
    aircraftTypes: ['Fighter', 'Bomber'],
    radioPhraseCatalog: [
      { situation: 'Strategic', phrase: 'Squadron, form up on me for patrol', english: 'Lead orders' }
    ]
  },
  'wing-commander': {
    rank: 'Wing Commander',
    portugu: 'Comandante de Ala',
    abbreviation: 'W/C',
    callSignFormat: 'Command-{pilotNumber}',
    radicalCallSign: ['Command', 'Control', 'Crown', 'Overlord'],
    formality: 'Very High',
    experienceLevel: 'Wing Commander',
    aircraftTypes: ['Fighter', 'Bomber', 'Command']
  },
  'group-captain': {
    rank: 'Group Captain',
    portugu: 'Capitão de Grupo',
    abbreviation: 'G/C',
    callSignFormat: 'Control-{pilotNumber}',
    radicalCallSign: ['Control', 'Crown', 'Supreme', 'Chief'],
    formality: 'Extreme',
    experienceLevel: 'Group Commander',
    aircraftTypes: ['Any']
  }
};

// ============= PATENTES LUFTWAFFE (ALEMANHA) =============
const luftwaffePatentes = {
  'leutnant': {
    rank: 'Leutnant',
    portugu: 'Tenente',
    abbreviation: 'Lt',
    callSignFormat: 'Adler-{pilotNumber}',
    radicalCallSign: ['Adler', 'Falke', 'Sturm', 'Blitz'],
    formality: 'High',
    experienceLevel: 'Junior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Enemy contact', phrase: 'Pauke! Pauke! Feindliche Flugzeuge!', english: 'Contact! Enemy aircraft!' },
      { situation: 'Attack', phrase: 'Angriff! Angriff!', english: 'Attack! Attack!' },
      { situation: 'Low ammo', phrase: 'Rückkehr zur Basis', english: 'Return to base' }
    ]
  },
  'oberleutnant': {
    rank: 'Oberleutnant',
    portugu: 'Tenente Superior',
    abbreviation: 'Oblt',
    callSignFormat: 'Falke-{pilotNumber}',
    radicalCallSign: ['Falke', 'Habicht', 'Rabe', 'Adler'],
    formality: 'High',
    experienceLevel: 'Officer',
    aircraftTypes: ['Fighter', 'Bomber'],
    radioPhraseCatalog: [
      { situation: 'Leading', phrase: 'Dies ist Führer. Feind gesichtet.', english: 'This is leader. Enemy sighted.' },
      { situation: 'Formation', phrase: 'Halte Position!', english: 'Hold position!' }
    ]
  },
  'hauptmann': {
    rank: 'Hauptmann',
    portugu: 'Capitão',
    abbreviation: 'Hptm',
    callSignFormat: 'Adler-{pilotNumber}',
    radicalCallSign: ['Adler', 'Sturm', 'Jagd', 'Kommando'],
    formality: 'High',
    experienceLevel: 'Senior Officer',
    aircraftTypes: ['Fighter', 'Bomber', 'Reconnaissance'],
    radioPhraseCatalog: [
      { situation: 'Command', phrase: 'Achtung! Alle Verbände', english: 'Attention! All units!' },
      { situation: 'Victory', phrase: 'Abschuss bestätigt', english: 'Kill confirmed' }
    ]
  },
  'major': {
    rank: 'Major',
    portugu: 'Major',
    abbreviation: 'Maj',
    callSignFormat: 'Kommando-{pilotNumber}',
    radicalCallSign: ['Kommando', 'Geist', 'Donner', 'Überkommando'],
    formality: 'Very High',
    experienceLevel: 'Veteran Officer',
    aircraftTypes: ['Fighter', 'Bomber']
  },
  'oberstleutnant': {
    rank: 'Oberstleutnant',
    portugu: 'Tenente-Coronel',
    abbreviation: 'Obstlt',
    callSignFormat: 'Geist-{pilotNumber}',
    radicalCallSign: ['Geist', 'Donner', 'Überkommando', 'Reichswehr'],
    formality: 'Very High',
    experienceLevel: 'Senior Commander',
    aircraftTypes: ['Fighter', 'Bomber', 'Command']
  },
  'oberst': {
    rank: 'Oberst',
    portugu: 'Coronel',
    abbreviation: 'Obst',
    callSignFormat: 'Überkommando-{pilotNumber}',
    radicalCallSign: ['Überkommando', 'Reichswehr', 'Supreme', 'Chef'],
    formality: 'Extreme',
    experienceLevel: 'Commander',
    aircraftTypes: ['Any']
  }
};

// ============= FRASEOLOGIA DE RÁDIO INTERNACIONAL =============
const radioPhrasology = {
  affirmative: ['Roger', 'Affirmative', 'Wilco', 'Copy that'],
  negative: ['Negative', 'Denied', 'Unable', 'Cannot comply'],
  understood: ['Understood', 'Copy', 'Roger', 'Got it'],
  threat: ['Bogey', 'Bandit', 'Victor', 'Splash'],
  formation: ['Stay tight', 'Maintain position', 'Check six', 'Tally-ho'],
  attack: ['Buster!', 'Attack!', 'Engage!', 'Go go go!'],
  tactical: ['Break right', 'Break left', 'Climb out', 'Level off'],
  status: ['Tally', 'Negative contact', 'RTB', 'Mayday'],
  victory: ['Splash one', 'Confirmed kill', 'One down', 'Ace!'],
  warning: ['Watch six', 'Incoming', 'Bandits', 'Break!']
};

// ============= ALFABETO FONÉTICO INTERNACIONAL =============
const phoneticAlphabet = {
  'A': 'Alfa',
  'B': 'Bravo',
  'C': 'Charlie',
  'D': 'Delta',
  'E': 'Echo',
  'F': 'Foxtrot',
  'G': 'Golf',
  'H': 'Hotel',
  'I': 'India',
  'J': 'Juliett',
  'K': 'Kilo',
  'L': 'Lima',
  'M': 'Mike',
  'N': 'November',
  'O': 'Oscar',
  'P': 'Papa',
  'Q': 'Quebec',
  'R': 'Romeo',
  'S': 'Sierra',
  'T': 'Tango',
  'U': 'Uniform',
  'V': 'Victor',
  'W': 'Whiskey',
  'X': 'Xray',
  'Y': 'Yankee',
  'Z': 'Zulu'
};

// ============= FUNÇÕES UTILITÁRIAS =============
function getRankByFaction(faction, rankId) {
  switch(faction.toUpperCase()) {
    case 'USAAF':
    case 'USA':
      return usaafPatentes[rankId] || null;
    case 'RAF':
    case 'REINO_UNIDO':
      return rafPatentes[rankId] || null;
    case 'LUFTWAFFE':
    case 'ALEMANHA':
      return luftwaffePatentes[rankId] || null;
    default:
      return null;
  }
}

function getAllRanksByFaction(faction) {
  switch(faction.toUpperCase()) {
    case 'USAAF':
    case 'USA':
      return usaafPatentes;
    case 'RAF':
    case 'REINO_UNIDO':
      return rafPatentes;
    case 'LUFTWAFFE':
    case 'ALEMANHA':
      return luftwaffePatentes;
    default:
      return {};
  }
}

function generateCallSign(rankData, pilotNumber) {
  const format = rankData.callSignFormat;
  return format.replace('{pilotNumber}', pilotNumber);
}

function getRadioPhrase(category) {
  const phrases = radioPhrasology[category] || [];
  return phrases[Math.floor(Math.random() * phrases.length)] || '';
}

// Exportar para uso em app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    usaafPatentes,
    rafPatentes,
    luftwaffePatentes,
    radioPhrasology,
    phoneticAlphabet,
    getRankByFaction,
    getAllRanksByFaction,
    generateCallSign,
    getRadioPhrase
  };
}
