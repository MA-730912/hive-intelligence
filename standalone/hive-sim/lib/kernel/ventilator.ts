export type VentMode = "VCV" | "PCV" | "PSV" | "SIMV" | "ASV";

export type VentilatorState = {
  status:"standby"|"ready"|"active"|"alarm";
  mode:VentMode;
  vtMl:number;
  rate:number;
  peep:number;
  fio2:number;
  patientConfigured:boolean;
};

export const initialVentilatorState:VentilatorState = {
  status:"standby",
  mode:"VCV",
  vtMl:450,
  rate:16,
  peep:5,
  fio2:0.60,
  patientConfigured:false,
};

export function configurePatient(v:VentilatorState):VentilatorState {
  return {...v,patientConfigured:true,status:v.status==="active"?"active":"standby"};
}

export function canStartVentilation(v:VentilatorState,circuitConnected:boolean){
  return v.patientConfigured && circuitConnected;
}

export function startVentilation(v:VentilatorState,circuitConnected:boolean):VentilatorState {
  if(!canStartVentilation(v,circuitConnected)) return v;
  return {...v,status:"active"};
}

export function stopVentilation(v:VentilatorState):VentilatorState {
  return {...v,status:"standby"};
}

export function setVentSetting<K extends keyof VentilatorState>(
  v:VentilatorState,
  key:K,
  value:VentilatorState[K]
):VentilatorState {
  return {...v,[key]:value};
}
