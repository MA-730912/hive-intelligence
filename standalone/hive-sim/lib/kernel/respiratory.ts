export type RespiratoryMechanics = {
  complianceMlPerCmH2O:number;
  resistanceCmH2OPerLps:number;
  deadSpaceMl:number;
  metabolismFactor:number;
  shuntFraction:number;
  spontaneousEffort:number;
};

export type VentilatorInputs = {
  vtMl:number;
  rate:number;
  peep:number;
  fio2:number;
  inspiratoryTimeSec:number;
};

export type RespiratoryOutputs = {
  peakPressure:number;
  plateauPressure:number;
  drivingPressure:number;
  minuteVentilationL:number;
  alveolarVentilationL:number;
  estimatedEtco2:number;
  estimatedSpo2:number;
  alarms:string[];
};

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export const mechanicsPresets = {
  normal:{
    complianceMlPerCmH2O:60,
    resistanceCmH2OPerLps:8,
    deadSpaceMl:150,
    metabolismFactor:1,
    shuntFraction:0.05,
    spontaneousEffort:0,
  },
  bronchospasm:{
    complianceMlPerCmH2O:55,
    resistanceCmH2OPerLps:24,
    deadSpaceMl:170,
    metabolismFactor:1.15,
    shuntFraction:0.10,
    spontaneousEffort:0,
  },
  ards:{
    complianceMlPerCmH2O:28,
    resistanceCmH2OPerLps:12,
    deadSpaceMl:210,
    metabolismFactor:1.15,
    shuntFraction:0.32,
    spontaneousEffort:0,
  },
  sepsis:{
    complianceMlPerCmH2O:42,
    resistanceCmH2OPerLps:10,
    deadSpaceMl:180,
    metabolismFactor:1.25,
    shuntFraction:0.20,
    spontaneousEffort:0,
  },
} satisfies Record<string,RespiratoryMechanics>;

export function calculateRespiratoryOutputs(
  mechanics:RespiratoryMechanics,
  inputs:VentilatorInputs
):RespiratoryOutputs {
  const vtL=clamp(inputs.vtMl,100,1200)/1000;
  const rate=clamp(inputs.rate,1,60);
  const ti=clamp(inputs.inspiratoryTimeSec,0.3,3);
  const flowLps=vtL/ti;

  const drivingPressure=(inputs.vtMl/Math.max(10,mechanics.complianceMlPerCmH2O));
  const plateauPressure=inputs.peep+drivingPressure;
  const resistivePressure=flowLps*mechanics.resistanceCmH2OPerLps;
  const peakPressure=plateauPressure+resistivePressure;

  const minuteVentilationL=vtL*rate;
  const alveolarVtL=Math.max(0.05,(inputs.vtMl-mechanics.deadSpaceMl)/1000);
  const alveolarVentilationL=alveolarVtL*rate;

  const co2Load=5*mechanics.metabolismFactor;
  const estimatedEtco2=clamp(35*(co2Load/Math.max(1.2,alveolarVentilationL)),18,80);

  const fio2Benefit=(inputs.fio2-0.21)*60;
  const shuntPenalty=mechanics.shuntFraction*45;
  const peepBenefit=Math.min(12,inputs.peep)*0.8;
  const estimatedSpo2=clamp(91+fio2Benefit+peepBenefit-shuntPenalty,65,100);

  const alarms:string[]=[];
  if(peakPressure>35)alarms.push("HIGH AIRWAY PRESSURE");
  if(plateauPressure>30)alarms.push("HIGH PLATEAU PRESSURE");
  if(inputs.vtMl<300)alarms.push("LOW TIDAL VOLUME");
  if(minuteVentilationL<4)alarms.push("LOW MINUTE VENTILATION");
  if(estimatedEtco2>50)alarms.push("HIGH CO₂");
  if(estimatedEtco2<25)alarms.push("LOW CO₂");
  if(estimatedSpo2<90)alarms.push("LOW OXYGEN SATURATION");

  return {
    peakPressure:Math.round(peakPressure*10)/10,
    plateauPressure:Math.round(plateauPressure*10)/10,
    drivingPressure:Math.round(drivingPressure*10)/10,
    minuteVentilationL:Math.round(minuteVentilationL*10)/10,
    alveolarVentilationL:Math.round(alveolarVentilationL*10)/10,
    estimatedEtco2:Math.round(estimatedEtco2),
    estimatedSpo2:Math.round(estimatedSpo2),
    alarms,
  };
}

export function mechanicsForScenario(scenarioId:string):RespiratoryMechanics {
  if(scenarioId==="anaphylaxis") return mechanicsPresets.bronchospasm;
  if(scenarioId==="septic-shock") return mechanicsPresets.sepsis;
  return mechanicsPresets.normal;
}
