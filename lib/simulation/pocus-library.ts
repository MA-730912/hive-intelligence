export type PocusCase={
  id:string;
  title:string;
  view:string;
  category:string;
  findings:string[];
  impression:string;
  teachingPoint:string;
};

export const pocusLibrary:PocusCase[]=[
  {
    id:"fast-positive",
    title:"Positive FAST",
    view:"RUQ / Morrison's pouch",
    category:"Trauma",
    findings:["Anechoic free fluid between liver and right kidney","Free fluid tracks into hepatorenal recess"],
    impression:"Positive FAST for intraperitoneal free fluid.",
    teachingPoint:"In an unstable trauma patient, a positive FAST supports urgent haemorrhage control and should be interpreted with the overall clinical picture."
  },
  {
    id:"tamponade",
    title:"Pericardial Effusion with Tamponade Features",
    view:"Subcostal four-chamber",
    category:"Cardiac",
    findings:["Large circumferential pericardial effusion","Right atrial systolic collapse","Right ventricular diastolic collapse pattern"],
    impression:"Pericardial effusion with echocardiographic features concerning for tamponade physiology.",
    teachingPoint:"Correlate with haemodynamic instability, pulsus paradoxus/JVP and the clinical context; ultrasound supports but does not replace clinical diagnosis."
  },
  {
    id:"cholecystitis",
    title:"Inflamed Gallbladder",
    view:"RUQ gallbladder",
    category:"Abdominal",
    findings:["Gallbladder wall thickening","Pericholecystic fluid","Distended gallbladder","Synthetic echogenic calculus with posterior acoustic shadow"],
    impression:"Ultrasound pattern concerning for acute cholecystitis.",
    teachingPoint:"The strongest teaching combination is gallstones plus inflammatory changes and focal sonographic tenderness in the appropriate clinical setting."
  },
  {
    id:"pneumothorax",
    title:"Pneumothorax Pattern",
    view:"Anterior lung",
    category:"Lung",
    findings:["Absent lung sliding","Absent B-lines","Barcode/stratosphere pattern on M-mode","Lung point may be demonstrated"],
    impression:"POCUS findings compatible with pneumothorax.",
    teachingPoint:"Lung point is highly specific when seen. In unstable trauma, integrate POCUS with physiology and mechanism."
  },
  {
    id:"pulmonary-oedema",
    title:"Diffuse B-lines",
    view:"Anterior/lateral lung zones",
    category:"Lung",
    findings:["Multiple vertical B-lines","B-lines extend to far field","Bilateral distribution"],
    impression:"Interstitial syndrome pattern, such as pulmonary oedema in the appropriate context.",
    teachingPoint:"B-lines are not disease-specific; distribution and clinical context matter."
  },
  {
    id:"rv-strain",
    title:"Right Ventricular Strain Pattern",
    view:"Apical four-chamber",
    category:"Cardiac",
    findings:["Dilated RV","RV:LV ratio increased","Septal flattening pattern","Reduced RV free-wall excursion pattern"],
    impression:"POCUS pattern concerning for acute right-heart strain.",
    teachingPoint:"This pattern can support suspicion of massive/submassive PE but is not diagnostic on its own."
  },
  {
    id:"aaa",
    title:"Abdominal Aortic Aneurysm",
    view:"Transverse abdominal aorta",
    category:"Vascular",
    findings:["Dilated abdominal aorta","Synthetic maximal diameter > 5 cm","Mural thrombus pattern"],
    impression:"Large abdominal aortic aneurysm.",
    teachingPoint:"Measure outer wall to outer wall and scan from epigastrium to bifurcation where possible."
  },
  {
    id:"hydronephrosis",
    title:"Hydronephrosis",
    view:"Renal longitudinal",
    category:"Renal",
    findings:["Anechoic dilation of renal pelvis","Branching calyceal dilation pattern"],
    impression:"Moderate hydronephrosis pattern.",
    teachingPoint:"Distinguish collecting-system dilation from renal vessels and parapelvic cysts."
  }
];
