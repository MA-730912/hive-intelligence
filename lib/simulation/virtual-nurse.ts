export type NurseAssistantResponse={
  reply:string;
  action?:string;
  scoreDelta?:number;
};

export function respondAsVirtualNurse(input:string):NurseAssistantResponse{
  const q=input.trim().toLowerCase();
  if(!q) return {reply:"I'm ready. Tell me what you would like me to do."};

  if(q.includes("blood pressure")||q.includes("repeat obs")||q.includes("observations")){
    return {reply:"Repeating a full set of observations now. The monitor values are current; I'll alert you to any major change.",action:"Virtual nurse repeated observations",scoreDelta:1};
  }
  if(q.includes("adrenaline")||q.includes("epinephrine")){
    return {reply:"Preparing IM adrenaline 1 mg/mL. Please confirm the intended adult dose before administration.",action:"Virtual nurse prepared adrenaline",scoreDelta:4};
  }
  if(q.includes("glucose")||q.includes("bgl")){
    return {reply:"I'll check a bedside glucose now and prepare ketone testing as well.",action:"Virtual nurse checked bedside glucose and ketones",scoreDelta:2};
  }
  if(q.includes("surgery")||q.includes("surgeon")||q.includes("theatre")){
    return {reply:"Calling the surgical registrar urgently and stating that this is a shocked patient with suspected necrotising soft-tissue infection.",action:"Virtual nurse escalated urgently to surgery",scoreDelta:8};
  }
  if(q.includes("icu")||q.includes("intensive care")){
    return {reply:"Calling ICU now for urgent review and likely admission.",action:"Virtual nurse escalated to ICU",scoreDelta:5};
  }
  if(q.includes("airway")||q.includes("intubat")){
    return {reply:"Airway trolley is at the bedside. Suction, capnography and ventilator are being checked. Please confirm your airway plan.",action:"Virtual nurse prepared airway equipment",scoreDelta:3};
  }
  if(q.includes("iv")||q.includes("cannula")||q.includes("access")){
    return {reply:"I'll establish a second large-bore IV and draw bloods if access is available.",action:"Virtual nurse established second IV access",scoreDelta:2};
  }
  if(q.includes("blood")||q.includes("vbg")||q.includes("abg")||q.includes("lactate")){
    return {reply:"I'll send the requested blood panel and lactate. Results will appear through the investigation workflow.",action:"Virtual nurse collected bloods",scoreDelta:1};
  }
  if(q.includes("allergy")||q.includes("penicillin")){
    return {reply:"The chart records an immediate anaphylactic reaction to a penicillin-class antibiotic during this scenario. I'll place a prominent allergy alert.",action:"Virtual nurse confirmed and flagged severe penicillin allergy",scoreDelta:6};
  }
  if(q.includes("fluid")||q.includes("hartmann")||q.includes("crystalloid")){
    return {reply:"I can prepare balanced crystalloid. Please specify the bolus volume and reassessment target.",action:"Virtual nurse prepared IV crystalloid",scoreDelta:1};
  }

  return {reply:"I can help with observations, access, bloods, airway equipment, adrenaline preparation, glucose/ketones, allergy checks, surgery or ICU escalation. Please give me a specific clinical task."};
}
