/**
 * AOT Engenheiro v2.0
 * Sistema centralizado de dados de missões
 * Contém: Single Missions, War Tales, Custom Battles e Test Flight
 */

// ============= SINGLE MISSIONS =============
const singleMissions = {
  'hunt-trains': {
    id: 'hunt-trains',
    name: 'Hunt for Trains',
    category: 'Single Mission',
    briefing: 'Locate and destroy enemy supply trains in the railway network.',
    date: '1943-06-15',
    timeOfDay: 'Day',
    weather: 'Clear',
    map: 'Eastern Front',
    difficulty: 'Medium',
    suggestedAircraft: ['P-47 Thunderbolt', 'P-51 Mustang', 'Bf 109 F-4'],
    recommendedArmament: {
      primary: 'Machine guns + Rockets',
      secondary: '500 lb bombs',
      recommendation: 'Use rockets for precise strikes on train cars'
    },
    objectives: [
      'Locate enemy supply trains',
      'Destroy at least 3 train cars',
      'Return to base safely'
    ],
    thumbnail: 'img/missions/hunt-trains.jpg'
  },
  'new-recruits': {
    id: 'new-recruits',
    name: 'New Recruits',
    category: 'Single Mission',
    briefing: 'Train new pilots in basic combat maneuvers and defensive tactics.',
    date: '1942-03-20',
    timeOfDay: 'Day',
    weather: 'Partly Cloudy',
    map: 'Training Area',
    difficulty: 'Easy',
    suggestedAircraft: ['Spitfire Mk V', 'Bf 109 F-4', 'Yak-9'],
    recommendedArmament: {
      primary: 'Machine guns only',
      secondary: 'None',
      recommendation: 'Focus on dogfighting skills'
    },
    objectives: [
      'Maintain formation with wingmen',
      'Practice evasive maneuvers',
      'Complete the training scenario'
    ],
    thumbnail: 'img/missions/new-recruits.jpg'
  },
  'surgical-strike': {
    id: 'surgical-strike',
    name: 'Surgical Strike',
    category: 'Single Mission',
    briefing: 'Perform a precision bombing run on enemy air base facilities.',
    date: '1943-08-12',
    timeOfDay: 'Dawn',
    weather: 'Hazy',
    map: 'North Africa',
    difficulty: 'Hard',
    suggestedAircraft: ['P-47 Thunderbolt', 'Mosquito FB Mk VI', 'Ju 87 Stuka'],
    recommendedArmament: {
      primary: '1000 lb bombs',
      secondary: 'Machine guns for escort defense',
      recommendation: 'Bombs must be released with precision on target'
    },
    objectives: [
      'Reach bombing target undetected',
      'Successfully bomb the airfield',
      'Evade enemy fighters',
      'Return to base'
    ],
    thumbnail: 'img/missions/surgical-strike.jpg'
  },
  'meek-mild': {
    id: 'meek-mild',
    name: 'Meek and Mild',
    category: 'Single Mission',
    briefing: 'Escort transport aircraft through contested airspace.',
    date: '1943-05-22',
    timeOfDay: 'Morning',
    weather: 'Clear',
    map: 'Mediterranean',
    difficulty: 'Medium',
    suggestedAircraft: ['Spitfire Mk VIII', 'P-51 Mustang', 'Me 109 G-2'],
    recommendedArmament: {
      primary: 'Machine guns',
      secondary: 'Cannons for air-to-air combat',
      recommendation: 'Prioritize protection of transport'
    },
    objectives: [
      'Protect transport aircraft',
      'Defend against enemy fighters',
      'Maintain escort formation',
      'Guide transport to destination'
    ],
    thumbnail: 'img/missions/meek-mild.jpg'
  },
  'guardian-angel': {
    id: 'guardian-angel',
    name: 'Guardian Angel',
    category: 'Single Mission',
    briefing: 'Provide fighter cover for bomber formations attacking enemy targets.',
    date: '1944-02-18',
    timeOfDay: 'Day',
    weather: 'Cloudy',
    map: 'Western Europe',
    difficulty: 'Hard',
    suggestedAircraft: ['P-51 Mustang', 'P-47 Thunderbolt', 'Bf 109 K-4'],
    recommendedArmament: {
      primary: 'Machine guns',
      secondary: 'Cannons + rockets',
      recommendation: 'Stay close to bomber formation for maximum protection'
    },
    objectives: [
      'Rendezvous with bomber formation',
      'Protect bombers from fighter attacks',
      'Intercept enemy fighters',
      'Return with bombers to base'
    ],
    thumbnail: 'img/missions/guardian-angel.jpg'
  },
  'jungle-cobra': {
    id: 'jungle-cobra',
    name: 'Jungle Cobra',
    category: 'Single Mission',
    briefing: 'Strike enemy positions deep in jungle terrain with precision.',
    date: '1943-11-07',
    timeOfDay: 'Noon',
    weather: 'Partly Cloudy',
    map: 'Pacific - Jungle',
    difficulty: 'Hard',
    suggestedAircraft: ['P-47 Thunderbolt', 'A6M Zero', 'Ki-61 Tony'],
    recommendedArmament: {
      primary: 'Rockets + bombs',
      secondary: 'Machine guns',
      recommendation: 'Low-level attack to avoid detection'
    },
    objectives: [
      'Locate enemy jungle encampment',
      'Destroy enemy installations',
      'Evade anti-aircraft fire',
      'Return to base'
    ],
    thumbnail: 'img/missions/jungle-cobra.jpg'
  },
  'intercept-shoot': {
    id: 'intercept-shoot',
    name: 'Intercept and Shoot Down',
    category: 'Single Mission',
    briefing: 'Intercept and destroy enemy reconnaissance aircraft.',
    date: '1942-09-14',
    timeOfDay: 'Dawn',
    weather: 'Clear',
    map: 'Channel Region',
    difficulty: 'Medium',
    suggestedAircraft: ['Bf 109 F-4', 'Spitfire Mk V', 'Yak-3'],
    recommendedArmament: {
      primary: 'Machine guns + cannons',
      secondary: 'None needed',
      recommendation: 'High-altitude interception required'
    },
    objectives: [
      'Intercept enemy reconnaissance',
      'Engage and destroy target',
      'Evade enemy fighters',
      'Return safely'
    ],
    thumbnail: 'img/missions/intercept-shoot.jpg'
  },
  'flight-mist': {
    id: 'flight-mist',
    name: 'Flight in the Mist',
    category: 'Single Mission',
    briefing: 'Navigate through fog and poor visibility to bombing target.',
    date: '1944-04-11',
    timeOfDay: 'Overcast',
    weather: 'Fog',
    map: 'Atlantic Coast',
    difficulty: 'Hard',
    suggestedAircraft: ['Mosquito FB Mk VI', 'Lancaster', 'B-17 Flying Fortress'],
    recommendedArmament: {
      primary: 'Heavy bombs',
      secondary: 'Machine guns',
      recommendation: 'Navigation and bomb accuracy crucial in poor visibility'
    },
    objectives: [
      'Navigate through fog',
      'Locate bombing target',
      'Deliver bomb load',
      'Return to base without visual reference'
    ],
    thumbnail: 'img/missions/flight-mist.jpg'
  },
  'leave-nowhere': {
    id: 'leave-nowhere',
    name: 'Leave Them Nowhere to Come Home To',
    category: 'Single Mission',
    briefing: 'Destroy enemy airfield facilities to prevent enemy operations.',
    date: '1943-07-23',
    timeOfDay: 'Day',
    weather: 'Clear',
    map: 'Sicily',
    difficulty: 'Hard',
    suggestedAircraft: ['P-47 Thunderbolt', 'Bf 110 G-2', 'A-20 Havoc'],
    recommendedArmament: {
      primary: '500 lb bombs + rockets',
      secondary: 'Machine guns',
      recommendation: 'Destroy hangars, fuel dumps, and runways'
    },
    objectives: [
      'Attack airfield buildings',
      'Destroy fuel storage',
      'Crater runway if possible',
      'Return to base'
    ],
    thumbnail: 'img/missions/leave-nowhere.jpg'
  },
  'spotters': {
    id: 'spotters',
    name: 'Spotters!',
    category: 'Single Mission',
    briefing: 'Provide reconnaissance and spotting for ground forces.',
    date: '1943-10-02',
    timeOfDay: 'Morning',
    weather: 'Cloudy',
    map: 'Italy',
    difficulty: 'Medium',
    suggestedAircraft: ['Spitfire Mk VIII', 'Bf 109 F-4', 'P-51 Mustang'],
    recommendedArmament: {
      primary: 'Machine guns',
      secondary: 'Rockets for ground targets',
      recommendation: 'Light armed - focus on reconnaissance'
    },
    objectives: [
      'Scout enemy positions',
      'Report findings to ground forces',
      'Engage opportunity targets',
      'Return with intelligence'
    ],
    thumbnail: 'img/missions/spotters.jpg'
  },
  'second-wave': {
    id: 'second-wave',
    name: 'The Second Wave',
    category: 'Single Mission',
    briefing: 'Support initial attack with second fighter wave.',
    date: '1944-06-20',
    timeOfDay: 'Day',
    weather: 'Partly Cloudy',
    map: 'Normandy',
    difficulty: 'Hard',
    suggestedAircraft: ['P-51 Mustang', 'Bf 109 K-4', 'Fw 190 D-9'],
    recommendedArmament: {
      primary: 'Machine guns + cannons',
      secondary: 'Rockets for ground targets',
      recommendation: 'Aggressive engagement with enemy fighters'
    },
    objectives: [
      'Engage enemy fighters',
      'Support ground operations',
      'Maintain air superiority',
      'Return safely'
    ],
    thumbnail: 'img/missions/second-wave.jpg'
  },
  'night-watch': {
    id: 'night-watch',
    name: 'Night Watch',
    category: 'Single Mission',
    briefing: 'Perform night combat patrol and intercept night bombers.',
    date: '1944-08-15',
    timeOfDay: 'Night',
    weather: 'Clear',
    map: 'German Reich',
    difficulty: 'Very Hard',
    suggestedAircraft: ['Bf 110 G-4 (Nachtjäger)', 'Mosquito NF Mk II', 'P-61 Black Widow'],
    recommendedArmament: {
      primary: 'Cannons for night interception',
      secondary: 'Machine guns',
      recommendation: 'Use radar or searchlights for target acquisition'
    },
    objectives: [
      'Patrol assigned sector',
      'Intercept enemy bombers',
      'Destroy night attackers',
      'Return to base'
    ],
    thumbnail: 'img/missions/night-watch.jpg'
  },
  'first-strike': {
    id: 'first-strike',
    name: 'The First Strike',
    category: 'Single Mission',
    briefing: 'Lead first wave attack on heavily defended target.',
    date: '1943-12-03',
    timeOfDay: 'Dawn',
    weather: 'Clear',
    map: 'Industrial Target',
    difficulty: 'Very Hard',
    suggestedAircraft: ['Bf 109 F-4', 'Fw 190 A-4', 'Spitfire Mk IX'],
    recommendedArmament: {
      primary: 'Maximum firepower - cannons + machine guns',
      secondary: 'Bombs if necessary',
      recommendation: 'Lead by example - aggressive tactics'
    },
    objectives: [
      'Lead first attack wave',
      'Engage enemy defenses',
      'Protect bombers',
      'Maintain squadron cohesion'
    ],
    thumbnail: 'img/missions/first-strike.jpg'
  },
  'paulus-tanks': {
    id: 'paulus-tanks',
    name: 'Paulus\' Last Tanks',
    category: 'Single Mission',
    briefing: 'Attack last enemy tank formations before strategic retreat.',
    date: '1943-01-28',
    timeOfDay: 'Afternoon',
    weather: 'Hazy',
    map: 'Stalingrad',
    difficulty: 'Hard',
    suggestedAircraft: ['Bf 110 G-2', 'Ju 87 Stuka', 'IL-2M'],
    recommendedArmament: {
      primary: 'Rockets + anti-tank guns',
      secondary: 'Bombs',
      recommendation: 'Armor-piercing projectiles essential'
    },
    objectives: [
      'Locate tank formation',
      'Attack with precision',
      'Destroy maximum armor',
      'Avoid ground fire'
    ],
    thumbnail: 'img/missions/paulus-tanks.jpg'
  }
};

// ============= WAR TALES =============
const warTales = {
  'becoming-pilot': {
    id: 'becoming-pilot',
    name: 'Becoming a Pilot',
    category: 'War Tale',
    description: 'The story of a young recruit\'s first steps in becoming a combat pilot.',
    chapters: 3,
    totalDuration: '45 minutes',
    historicalContext: 'Early war training programs and pilot attrition rates',
    missions: ['new-recruits', 'meek-mild', 'intercept-shoot'],
    rewards: 'Unlocks advanced aircraft',
    thumbnail: 'img/wartales/becoming-pilot.jpg'
  },
  'dont-let-blind': {
    id: 'dont-let-blind',
    name: 'Don\'t Let Us Go Blind',
    category: 'War Tale',
    description: 'Night fighters battle to maintain air supremacy in darkness.',
    chapters: 5,
    totalDuration: '90 minutes',
    historicalContext: 'Night defense operations against RAF bombers',
    missions: ['night-watch', 'first-strike', 'guardian-angel'],
    rewards: 'Night fighter aircraft unlocked',
    thumbnail: 'img/wartales/dont-let-blind.jpg'
  },
  'sometimes-comeback': {
    id: 'sometimes-comeback',
    name: 'Sometimes They Come Back',
    category: 'War Tale',
    description: 'Unexpected return of thought-to-be-defeated enemies.',
    chapters: 4,
    totalDuration: '60 minutes',
    historicalContext: 'Tactical reversals and strategic resilience',
    missions: ['guardian-angel', 'spotters', 'second-wave'],
    rewards: 'Rare aircraft variants unlocked',
    thumbnail: 'img/wartales/sometimes-comeback.jpg'
  },
  'hunt-hiryu': {
    id: 'hunt-hiryu',
    name: 'Hunt for the Hiryu',
    category: 'War Tale',
    description: 'Search and destroy missions targeting Japanese carriers.',
    chapters: 6,
    totalDuration: '120 minutes',
    historicalContext: 'Pacific naval aviation campaigns',
    missions: ['intercept-shoot', 'jungle-cobra', 'second-wave'],
    rewards: 'Carrier-based aircraft unlocked',
    thumbnail: 'img/wartales/hunt-hiryu.jpg'
  },
  'tanks-dust': {
    id: 'tanks-dust',
    name: 'Tanks in the Dust',
    category: 'War Tale',
    description: 'Ground support missions during desert operations.',
    chapters: 4,
    totalDuration: '75 minutes',
    historicalContext: 'North Africa campaign air support',
    missions: ['surgical-strike', 'hunt-trains', 'paulus-tanks'],
    rewards: 'Ground attack aircraft variants',
    thumbnail: 'img/wartales/tanks-dust.jpg'
  },
  'normandy-changes': {
    id: 'normandy-changes',
    name: 'Normandy Never Changes',
    category: 'War Tale',
    description: 'The pivotal Normandy operations and air superiority battles.',
    chapters: 8,
    totalDuration: '150 minutes',
    historicalContext: 'D-Day and post-invasion air campaigns',
    missions: ['guardian-angel', 'second-wave', 'flight-mist', 'leave-nowhere'],
    rewards: 'Late-war aircraft unlocked',
    thumbnail: 'img/wartales/normandy-changes.jpg'
  },
  'propeller-nozzle': {
    id: 'propeller-nozzle',
    name: 'Propeller Versus Nozzle',
    category: 'War Tale',
    description: 'The technological arms race between piston and jet aircraft.',
    chapters: 5,
    totalDuration: '100 minutes',
    historicalContext: 'Introduction of jet fighters and last piston aircraft',
    missions: ['first-strike', 'intercept-shoot', 'spotters'],
    rewards: 'Jet aircraft prototypes unlocked',
    thumbnail: 'img/wartales/propeller-nozzle.jpg'
  },
  'battle-iwo': {
    id: 'battle-iwo',
    name: 'Battle of Iwo',
    category: 'War Tale',
    description: 'Intense aerial battles over Iwo Jima.',
    chapters: 7,
    totalDuration: '130 minutes',
    historicalContext: 'Pacific island campaign air operations',
    missions: ['jungle-cobra', 'guardian-angel', 'surgical-strike'],
    rewards: 'Pacific theater aircraft',
    thumbnail: 'img/wartales/battle-iwo.jpg'
  },
  'operation-kikusui': {
    id: 'operation-kikusui',
    name: 'Operation Kikusui I',
    category: 'War Tale',
    description: 'Japanese last-ditch defensive operations near war\'s end.',
    chapters: 6,
    totalDuration: '110 minutes',
    historicalContext: 'Final kamikaze campaigns and Japanese air operations',
    missions: ['intercept-shoot', 'hunt-trains', 'second-wave'],
    rewards: 'Advanced Japanese aircraft',
    thumbnail: 'img/wartales/operation-kikusui.jpg'
  }
};

// ============= CUSTOM BATTLES =============
const customBattles = {
  'eastern-front': {
    id: 'eastern-front',
    name: 'Operation Barbarossa',
    region: 'Eastern Front',
    maps: ['smolensk-1943', 'kursk', 'korsun'],
    timeframes: ['1943-06', '1943-07', '1943-08'],
    difficulty: 'Medium',
    description: 'Massive air campaigns over the Eastern Front',
    thumbnail: 'img/battles/barbarossa.jpg'
  },
  'north-africa': {
    id: 'north-africa',
    name: 'North Africa Campaign',
    region: 'North Africa',
    maps: ['el-alamein'],
    timeframes: ['1942-10', '1942-11'],
    difficulty: 'Medium',
    description: 'Desert warfare and aerial superiority battles',
    thumbnail: 'img/battles/north-africa.jpg'
  },
  'western-europe': {
    id: 'western-europe',
    name: 'Western Europe Liberation',
    region: 'Western Europe',
    maps: ['normandy', 'berlin', 'hurtgen', 'bastogne'],
    timeframes: ['1944-06', '1944-07', '1945-01'],
    difficulty: 'Hard',
    description: 'Allied invasion and subsequent operations',
    thumbnail: 'img/battles/western-europe.jpg'
  },
  'pacific-theater': {
    id: 'pacific-theater',
    name: 'Pacific Campaign',
    region: 'Pacific',
    maps: ['midway', 'peleliu', 'iwo-jima', 'saipan', 'oahu'],
    timeframes: ['1942-06', '1944-09', '1945-02'],
    difficulty: 'Hard',
    description: 'Naval aviation and island-hopping campaigns',
    thumbnail: 'img/battles/pacific.jpg'
  },
  'air-domination-berlin': {
    id: 'air-dom-berlin',
    name: 'Air Domination: Berlin',
    region: 'Germany',
    mapType: 'Air Domination',
    players: '2-8',
    duration: '30 minutes',
    difficulty: 'Medium',
    description: 'Compete for air superiority over Berlin',
    thumbnail: 'img/battles/air-domination-berlin.jpg'
  },
  'air-domination-bulge': {
    id: 'air-dom-bulge',
    name: 'Air Domination: Bulge',
    region: 'Ardennes',
    mapType: 'Air Domination',
    players: '2-8',
    duration: '30 minutes',
    difficulty: 'Medium',
    description: 'Battle of the Bulge aerial variant',
    thumbnail: 'img/battles/air-domination-bulge.jpg'
  },
  'air-domination-midway': {
    id: 'air-dom-midway',
    name: 'Air Domination: Midway',
    region: 'Pacific',
    mapType: 'Air Domination',
    players: '2-8',
    duration: '30 minutes',
    difficulty: 'Hard',
    description: 'Naval air dominance at Midway',
    thumbnail: 'img/battles/air-domination-midway.jpg'
  },
  'air-domination-saipan': {
    id: 'air-dom-saipan',
    name: 'Air Domination: Saipan',
    region: 'Mariana Islands',
    mapType: 'Air Domination',
    players: '2-8',
    duration: '30 minutes',
    difficulty: 'Hard',
    description: 'Marianas Turkey Shoot aerial scenario',
    thumbnail: 'img/battles/air-domination-saipan.jpg'
  }
};

// ============= TEST FLIGHT =============
const testFlight = {
  id: 'test-flight',
  name: 'Test Flight',
  description: 'Free flight mode with full aircraft customization',
  features: [
    'Choose any aircraft',
    'Select any map',
    'Customize loadout',
    'Practice dogfighting',
    'Learn aircraft characteristics',
    'No time limits',
    'No objectives'
  ],
  weather: ['Clear', 'Cloudy', 'Foggy', 'Rainy', 'Stormy'],
  timeOfDay: ['Dawn', 'Day', 'Dusk', 'Night'],
  maxDuration: 'Unlimited',
  thumbnail: 'img/testflight.jpg'
};

// ============= DADOS GLOBAIS =============
const allMissionTypes = {
  singleMissions,
  warTales,
  customBattles,
  testFlight
};

// Função para obter missão por ID
function getMissionById(id) {
  for (const [type, missions] of Object.entries(singleMissions)) {
    if (missions.id === id) return missions;
  }
  for (const [type, missions] of Object.entries(warTales)) {
    if (missions.id === id) return missions;
  }
  return null;
}

// Função para obter recomendação de armamento
function getWeaponRecommendation(missionId, aircraftType) {
  const mission = getMissionById(missionId);
  if (mission && mission.recommendedArmament) {
    return mission.recommendedArmament;
  }
  return null;
}

// Exportar para uso em app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    singleMissions,
    warTales,
    customBattles,
    testFlight,
    allMissionTypes,
    getMissionById,
    getWeaponRecommendation
  };
}
