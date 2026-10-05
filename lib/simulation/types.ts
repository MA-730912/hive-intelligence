export type SimulationVitals = {
  hr: number;
  sbp: number;
  dbp: number;
  rr: number;
  spo2: number;
  etco2: number | null;
  temp: number;
  gcs: number;
  rhythm: string;
};

export type LabSet = {
  name: string;
  values: Array<{label:string;value:string;flag?:"high"|"low"|"critical"}>;
};

export type SimulationState = {
  id: string;
  label: string;
  summary: string;
  vitals: SimulationVitals;
  nurseCue: string;
  labs: LabSet[];
};

export type SimulationScenario = {
  id: string;
  title: string;
  subtitle: string;
  patient: {age:number;sex:string;weightKg:number};
  room: string;
  states: SimulationState[];
  medications: Array<{name:string;dose:string;route:string;note:string}>;
  imaging: Array<{name:string;report:string}>;
};
