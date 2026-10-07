export type AirwayPropId =
  | "laryngoscope"
  | "ett"
  | "bougie"
  | "bvm"
  | "oxygen-mask"
  | "suction";

export type AirwayStep =
  | "available"
  | "selected"
  | "inserted"
  | "secured"
  | "circuit-connected";

export type AirwayWorkflowState = {
  prop: AirwayPropId | null;
  step: AirwayStep;
  tubeSizeMm: number;
  circuitConnected: boolean;
};

export const initialAirwayWorkflow: AirwayWorkflowState = {
  prop: null,
  step: "available",
  tubeSizeMm: 7.5,
  circuitConnected: false,
};

export const airwayProps: Array<{id:AirwayPropId;label:string;short:string}> = [
  {id:"laryngoscope",label:"Laryngoscope",short:"Laryngoscope"},
  {id:"ett",label:"ETT 7.5 mm",short:"ETT"},
  {id:"bougie",label:"Bougie",short:"Bougie"},
  {id:"bvm",label:"BVM + mask",short:"BVM"},
  {id:"oxygen-mask",label:"Oxygen mask",short:"O₂ mask"},
  {id:"suction",label:"Suction catheter",short:"Suction"},
];

export function insertETT(state:AirwayWorkflowState):AirwayWorkflowState {
  return {...state,prop:"ett",step:"inserted",circuitConnected:false};
}

export function secureETT(state:AirwayWorkflowState):AirwayWorkflowState {
  if(state.step!=="inserted") return state;
  return {...state,step:"secured"};
}

export function connectCircuit(state:AirwayWorkflowState):AirwayWorkflowState {
  if(state.step!=="secured") return state;
  return {...state,step:"circuit-connected",circuitConnected:true};
}

export function resetAirway():AirwayWorkflowState {
  return initialAirwayWorkflow;
}
