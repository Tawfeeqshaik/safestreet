export interface StreetIssue {
  type: 'lighting' | 'footpath' | 'crossing' | 'encroachment' | 'traffic';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface StreetScore {
  footpathCondition: number; // 0-2
  streetLighting: number; // 0-2
  pedestrianCrossings: number; // 0-2
  trafficSafety: number; // 0-2
  accessibility: number; // 0-2
}

export interface Street {
  id: string;
  name: string;
  coordinates: [number, number][];
  score: StreetScore;
  totalScore: number;
  status: 'safe' | 'moderate' | 'unsafe';
  issues: StreetIssue[];
  improvements: string[];
  neighborhood: string;
}

export const calculateTotalScore = (score: StreetScore): number => {
  return score.footpathCondition + score.streetLighting + score.pedestrianCrossings + score.trafficSafety + score.accessibility;
};

export const getStatus = (totalScore: number): 'safe' | 'moderate' | 'unsafe' => {
  if (totalScore >= 8) return 'safe';
  if (totalScore >= 5) return 'moderate';
  return 'unsafe';
};

export const sampleStreets: Street[] = [
  {
    id: '1',
    name: 'Green Valley Road',
    coordinates: [[28.6139, 77.2090], [28.6145, 77.2100]],
    score: {
      footpathCondition: 2,
      streetLighting: 2,
      pedestrianCrossings: 2,
      trafficSafety: 2,
      accessibility: 1,
    },
    totalScore: 9,
    status: 'safe',
    issues: [],
    improvements: ['Add tactile paving for visually impaired'],
    neighborhood: 'Central District'
  },
  {
    id: '2',
    name: 'Market Street',
    coordinates: [[28.6150, 77.2080], [28.6160, 77.2095]],
    score: {
      footpathCondition: 1,
      streetLighting: 2,
      pedestrianCrossings: 1,
      trafficSafety: 1,
      accessibility: 1,
    },
    totalScore: 6,
    status: 'moderate',
    issues: [
      { type: 'footpath', description: 'Uneven surfaces near shops', severity: 'medium' },
      { type: 'encroachment', description: 'Vendor stalls blocking walkway', severity: 'medium' },
    ],
    improvements: ['Repair footpath tiles', 'Designate vendor zones', 'Add mid-block crossing'],
    neighborhood: 'Market Zone'
  },
  {
    id: '3',
    name: 'Industrial Avenue',
    coordinates: [[28.6130, 77.2110], [28.6140, 77.2125]],
    score: {
      footpathCondition: 0,
      streetLighting: 1,
      pedestrianCrossings: 0,
      trafficSafety: 1,
      accessibility: 0,
    },
    totalScore: 2,
    status: 'unsafe',
    issues: [
      { type: 'footpath', description: 'No dedicated footpath', severity: 'high' },
      { type: 'lighting', description: 'Large dark stretches', severity: 'high' },
      { type: 'crossing', description: 'No pedestrian crossings on busy road', severity: 'high' },
      { type: 'traffic', description: 'Heavy truck traffic', severity: 'high' },
    ],
    improvements: ['Construct footpath', 'Install street lights every 30m', 'Add signal-controlled crossing', 'Install speed breakers'],
    neighborhood: 'Industrial Zone'
  },
  {
    id: '4',
    name: 'Park Lane',
    coordinates: [[28.6155, 77.2070], [28.6165, 77.2085]],
    score: {
      footpathCondition: 2,
      streetLighting: 2,
      pedestrianCrossings: 2,
      trafficSafety: 2,
      accessibility: 2,
    },
    totalScore: 10,
    status: 'safe',
    issues: [],
    improvements: [],
    neighborhood: 'Residential Area'
  },
  {
    id: '5',
    name: 'Old Town Road',
    coordinates: [[28.6125, 77.2075], [28.6135, 77.2088]],
    score: {
      footpathCondition: 1,
      streetLighting: 1,
      pedestrianCrossings: 1,
      trafficSafety: 2,
      accessibility: 0,
    },
    totalScore: 5,
    status: 'moderate',
    issues: [
      { type: 'footpath', description: 'Narrow and worn footpath', severity: 'medium' },
      { type: 'lighting', description: 'Dim lighting in evening', severity: 'low' },
    ],
    improvements: ['Widen footpath', 'Upgrade to LED lighting', 'Add wheelchair ramps'],
    neighborhood: 'Heritage Zone'
  },
  {
    id: '6',
    name: 'Station Road',
    coordinates: [[28.6148, 77.2115], [28.6158, 77.2130]],
    score: {
      footpathCondition: 0,
      streetLighting: 2,
      pedestrianCrossings: 1,
      trafficSafety: 0,
      accessibility: 0,
    },
    totalScore: 3,
    status: 'unsafe',
    issues: [
      { type: 'footpath', description: 'Broken tiles and potholes', severity: 'high' },
      { type: 'traffic', description: 'Speeding vehicles near station', severity: 'high' },
      { type: 'encroachment', description: 'Parked vehicles on footpath', severity: 'medium' },
    ],
    improvements: ['Complete footpath reconstruction', 'Add speed cameras', 'Enforce no-parking zone', 'Install pedestrian barriers'],
    neighborhood: 'Transit Hub'
  },
];

export const cityStats = {
  totalStreets: 156,
  safeStreets: 67,
  moderateStreets: 52,
  unsafeStreets: 37,
  averageScore: 6.2,
  totalKmMapped: 234.5,
};
