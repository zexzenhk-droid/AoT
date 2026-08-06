/**
 * AOT Engenheiro v2.0
 * Sistema centralizado de dados de mapas
 */

const mapasGameData = {
  // ============= CUSTOM BATTLE MAPS =============
  'smolensk-1943': {
    id: 'smolensk-1943',
    name: 'Smolensk 1943',
    region: 'Eastern Front - Russia',
    date: 'June 15, 1943',
    description: 'Continuation of operations in western Russia after previous Soviet offensives.',
    historicalContext: 'German forces defending against Soviet attacks near Smolensk',
    weatherOptions: ['Clear', 'Cloudy', 'Hazy'],
    timeOptions: ['Day', 'Noon', 'Evening', 'Dusk'],
    airbases: [
      { name: 'Smolensk North', faction: 'Axis' },
      { name: 'Soviet Forward', faction: 'Allies' }
    ],
    mapSize: 'Large',
    thumbnail: 'img/maps/smolensk-1943.jpg'
  },
  'kursk': {
    id: 'kursk',
    name: 'Kursk',
    region: 'Eastern Front - Russia',
    date: 'July 5, 1943',
    description: 'The largest tank battle combined with intense air operations.',
    historicalContext: 'Operation Citadel - German attempt to pinch off Soviet salient at Kursk',
    weatherOptions: ['Clear', 'Partly Cloudy', 'Hazy'],
    timeOptions: ['Dawn', 'Day', 'Afternoon'],
    airbases: [
      { name: 'Kursk South', faction: 'Axis' },
      { name: 'Kursk North', faction: 'Allies' },
      { name: 'Forward Strip', faction: 'Allies' }
    ],
    mapSize: 'Very Large',
    thumbnail: 'img/maps/kursk.jpg'
  },
  'korsun': {
    id: 'korsun',
    name: 'Korsun',
    region: 'Eastern Front - Ukraine',
    date: 'January 28, 1944',
    description: 'Soviet encirclement operations in winter conditions.',
    historicalContext: 'Soviet counteroffensive trapping German forces',
    weatherOptions: ['Clear', 'Cloudy', 'Snowy', 'Fog'],
    timeOptions: ['Dawn', 'Day', 'Dusk'],
    airbases: [
      { name: 'Korsun East', faction: 'Axis' },
      { name: 'Soviet Central', faction: 'Allies' }
    ],
    mapSize: 'Large',
    thumbnail: 'img/maps/korsun.jpg'
  },
  'berlin': {
    id: 'berlin',
    name: 'Berlin',
    region: 'Germany',
    date: 'April 16, 1945',
    description: 'Final operations over German capital in the closing days of war.',
    historicalContext: 'Soviet assault on Berlin with Luftwaffe defending',
    weatherOptions: ['Clear', 'Cloudy', 'Smoke'],
    timeOptions: ['Day', 'Afternoon'],
    airbases: [
      { name: 'Berlin Central', faction: 'Axis' },
      { name: 'Soviet Forward', faction: 'Allies' }
    ],
    mapSize: 'Medium',
    thumbnail: 'img/maps/berlin.jpg'
  },
  'el-alamein': {
    id: 'el-alamein',
    name: 'El Alamein',
    region: 'North Africa - Egypt',
    date: 'October 23, 1942',
    description: 'Crucial desert battle determining North African campaign.',
    historicalContext: 'British and Commonwealth forces defeat Axis powers',
    weatherOptions: ['Clear', 'Dusty', 'Sandstorm'],
    timeOptions: ['Day', 'Afternoon', 'Dusk'],
    airbases: [
      { name: 'El Alamein', faction: 'Allies' },
      { name: 'Luftwaffe Forward', faction: 'Axis' }
    ],
    mapSize: 'Large',
    thumbnail: 'img/maps/el-alamein.jpg'
  },
  'normandy': {
    id: 'normandy',
    name: 'Normandy',
    region: 'France - Normandy',
    date: 'June 6, 1944',
    description: 'The D-Day landings and subsequent operations.',
    historicalContext: 'Allied invasion of occupied France',
    weatherOptions: ['Overcast', 'Cloudy', 'Rainy', 'Hazy'],
    timeOptions: ['Dawn', 'Day', 'Afternoon'],
    airbases: [
      { name: 'Normandy Beach', faction: 'Allies' },
      { name: 'Luftwaffe France', faction: 'Axis' }
    ],
    mapSize: 'Very Large',
    thumbnail: 'img/maps/normandy.jpg'
  },
  'hurtgen': {
    id: 'hurtgen',
    name: 'Hürtgen',
    region: 'Germany - Rhineland',
    date: 'November 8, 1944',
    description: 'Forest combat with dense vegetation and poor visibility.',
    historicalContext: 'Fighting in dense Hürtgen Forest',
    weatherOptions: ['Cloudy', 'Rainy', 'Fog', 'Overcast'],
    timeOptions: ['Dawn', 'Day'],
    airbases: [
      { name: 'Hürtgen North', faction: 'Axis' },
      { name: 'American Forward', faction: 'Allies' }
    ],
    mapSize: 'Medium',
    thumbnail: 'img/maps/hurtgen.jpg'
  },
  'bastogne': {
    id: 'bastogne',
    name: 'Battle for Bastogne',
    region: 'Belgium - Ardennes',
    date: 'December 20, 1944',
    description: 'Winter offensive and encircled town defense.',
    historicalContext: 'Battle of the Bulge - Bastogne encirclement',
    weatherOptions: ['Overcast', 'Snowy', 'Fog'],
    timeOptions: ['Day', 'Afternoon', 'Dawn'],
    airbases: [
      { name: 'Bastogne', faction: 'Allies' },
      { name: 'German Rear', faction: 'Axis' }
    ],
    mapSize: 'Large',
    thumbnail: 'img/maps/bastogne.jpg'
  },
  'midway': {
    id: 'midway',
    name: 'Midway',
    region: 'Pacific Ocean',
    date: 'June 4, 1942',
    description: 'Pivotal naval air battle in the Pacific War.',
    historicalContext: 'Turning point in Pacific naval aviation',
    weatherOptions: ['Clear', 'Partly Cloudy', 'Hazy'],
    timeOptions: ['Dawn', 'Day', 'Afternoon'],
    airbases: [
      { name: 'Midway Atoll', faction: 'Allies' },
      { name: 'Japanese Carrier Fleet', faction: 'Axis' }
    ],
    mapSize: 'Large',
    waterMap: true,
    thumbnail: 'img/maps/midway.jpg'
  },
  'peleliu': {
    id: 'peleliu',
    name: 'Peleliu',
    region: 'Pacific - Palau',
    date: 'September 15, 1944',
    description: 'Island assault with intense air support operations.',
    historicalContext: 'American island-hopping campaign',
    weatherOptions: ['Clear', 'Cloudy', 'Rainy', 'Partly Cloudy'],
    timeOptions: ['Day', 'Afternoon', 'Dusk'],
    airbases: [
      { name: 'Peleliu', faction: 'Axis' },
      { name: 'American Carrier', faction: 'Allies' }
    ],
    mapSize: 'Medium',
    island: true,
    thumbnail: 'img/maps/peleliu.jpg'
  },
  'iwo-jima': {
    id: 'iwo-jima',
    name: 'Iwo Jima',
    region: 'Pacific - Bonin Islands',
    date: 'February 19, 1945',
    description: 'Volcanic island battle with intense Japanese defense.',
    historicalContext: 'Strategic island for bomber operations',
    weatherOptions: ['Clear', 'Partly Cloudy', 'Hazy'],
    timeOptions: ['Day', 'Afternoon'],
    airbases: [
      { name: 'Iwo Airfield', faction: 'Axis' },
      { name: 'American Escort', faction: 'Allies' }
    ],
    mapSize: 'Medium',
    island: true,
    thumbnail: 'img/maps/iwo-jima.jpg'
  },
  'saipan': {
    id: 'saipan',
    name: 'Saipan',
    region: 'Pacific - Mariana Islands',
    date: 'June 15, 1944',
    description: 'The Great Marianas Turkey Shoot naval air battle.',
    historicalContext: 'Decisive Japanese air losses in the Pacific',
    weatherOptions: ['Clear', 'Partly Cloudy', 'Rainy'],
    timeOptions: ['Day', 'Afternoon'],
    airbases: [
      { name: 'Saipan Field', faction: 'Axis' },
      { name: 'Task Force 58', faction: 'Allies' }
    ],
    mapSize: 'Large',
    island: true,
    waterMap: true,
    thumbnail: 'img/maps/saipan.jpg'
  },
  'operation-uranus': {
    id: 'operation-uranus',
    name: 'Operation Uranus',
    region: 'Eastern Front - Russia',
    date: 'November 19, 1942',
    description: 'Soviet counteroffensive encircling German forces at Stalingrad.',
    historicalContext: 'Beginning of German strategic reversal',
    weatherOptions: ['Overcast', 'Snowy', 'Cloudy'],
    timeOptions: ['Dawn', 'Day', 'Dusk'],
    airbases: [
      { name: 'Stalingrad', faction: 'Allies' },
      { name: 'Luftwaffe', faction: 'Axis' }
    ],
    mapSize: 'Large',
    thumbnail: 'img/maps/operation-uranus.jpg'
  },
  'oahu-exercise': {
    id: 'oahu-exercise',
    name: 'Military Exercise on Oahu',
    region: 'Pacific - Hawaii',
    date: 'Training Scenario',
    description: 'Training exercises over Pearl Harbor area.',
    historicalContext: 'Practice operations in Hawaiian theater',
    weatherOptions: ['Clear', 'Cloudy', 'Partly Cloudy'],
    timeOptions: ['Day', 'Afternoon'],
    airbases: [
      { name: 'Pearl Harbor', faction: 'Allies' },
      { name: 'Wheeler Field', faction: 'Allies' }
    ],
    mapSize: 'Medium',
    training: true,
    thumbnail: 'img/maps/oahu-exercise.jpg'
  }
};

// ============= CONDIÇÕES METEOROLÓGICAS =============
const weatherConditions = {
  'clear': {
    id: 'clear',
    name: 'Clear',
    visibility: 'Excellent',
    flightConditions: 'Optimal',
    ceiling: 'Unlimited',
    windEffect: 'Minimal'
  },
  'cloudy': {
    id: 'cloudy',
    name: 'Cloudy',
    visibility: 'Good',
    flightConditions: 'Normal',
    ceiling: '5000 ft',
    windEffect: 'Moderate'
  },
  'partly-cloudy': {
    id: 'partly-cloudy',
    name: 'Partly Cloudy',
    visibility: 'Good',
    flightConditions: 'Good',
    ceiling: '3000 ft',
    windEffect: 'Moderate'
  },
  'overcast': {
    id: 'overcast',
    name: 'Overcast',
    visibility: 'Fair',
    flightConditions: 'Challenging',
    ceiling: '1500 ft',
    windEffect: 'Strong'
  },
  'fog': {
    id: 'fog',
    name: 'Fog',
    visibility: 'Poor',
    flightConditions: 'Difficult',
    ceiling: '200 ft',
    windEffect: 'Calm'
  },
  'rain': {
    id: 'rain',
    name: 'Rain',
    visibility: 'Fair',
    flightConditions: 'Difficult',
    ceiling: '2000 ft',
    windEffect: 'Strong'
  },
  'hazy': {
    id: 'hazy',
    name: 'Hazy',
    visibility: 'Fair',
    flightConditions: 'Normal',
    ceiling: '4000 ft',
    windEffect: 'Minimal'
  },
  'low-cloud': {
    id: 'low-cloud',
    name: 'Low Cloud Cover',
    visibility: 'Good',
    flightConditions: 'Challenging',
    ceiling: '800 ft',
    windEffect: 'Moderate'
  },
  'thin-clouds': {
    id: 'thin-clouds',
    name: 'Thin Clouds',
    visibility: 'Good',
    flightConditions: 'Good',
    ceiling: '6000 ft',
    windEffect: 'Light'
  },
  'storm': {
    id: 'storm',
    name: 'Thunderstorm',
    visibility: 'Very Poor',
    flightConditions: 'Hazardous',
    ceiling: '500 ft',
    windEffect: 'Severe'
  },
  'dusty': {
    id: 'dusty',
    name: 'Dusty',
    visibility: 'Fair',
    flightConditions: 'Challenging',
    ceiling: '3000 ft',
    windEffect: 'Strong'
  },
  'sandstorm': {
    id: 'sandstorm',
    name: 'Sandstorm',
    visibility: 'Very Poor',
    flightConditions: 'Hazardous',
    ceiling: '500 ft',
    windEffect: 'Severe'
  },
  'snowy': {
    id: 'snowy',
    name: 'Snowy',
    visibility: 'Fair',
    flightConditions: 'Difficult',
    ceiling: '1000 ft',
    windEffect: 'Moderate'
  }
};

// ============= FUNÇÕES UTILITÁRIAS =============
function getMapById(id) {
  return mapasGameData[id] || null;
}

function getWeatherCondition(id) {
  return weatherConditions[id] || null;
}

function getAllMaps() {
  return Object.values(mapasGameData);
}

// Exportar para uso em app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    mapasGameData,
    weatherConditions,
    getMapById,
    getWeatherCondition,
    getAllMaps
  };
}
