export type ImagingTeachingCase={
  id:string;
  modality:"X-ray"|"CT";
  bodyRegion:string;
  title:string;
  keyFindings:string[];
  report:string;
  teachingPoint:string;
};

export const imagingTeachingLibrary:ImagingTeachingCase[]=[
  {
    id:"cxr-pneumothorax",
    modality:"X-ray",
    bodyRegion:"Chest",
    title:"Large Right Pneumothorax",
    keyFindings:["Visible pleural line","Absent peripheral lung markings","Partial right-lung collapse"],
    report:"Synthetic frontal chest radiograph demonstrates a large right pneumothorax. No convincing mediastinal shift is shown in this teaching example.",
    teachingPoint:"Look for a visceral pleural line with absent lung markings peripheral to it."
  },
  {
    id:"cxr-pulmonary-oedema",
    modality:"X-ray",
    bodyRegion:"Chest",
    title:"Acute Pulmonary Oedema",
    keyFindings:["Bilateral perihilar air-space opacity","Interstitial oedema pattern","Possible small pleural effusions"],
    report:"Synthetic chest radiograph demonstrates bilateral predominantly perihilar interstitial and air-space opacity compatible with pulmonary oedema in the appropriate clinical context.",
    teachingPoint:"Integrate with cardiac size, pleural fluid and clinical volume status."
  },
  {
    id:"cxr-lobar-pneumonia",
    modality:"X-ray",
    bodyRegion:"Chest",
    title:"Right Lower Lobe Pneumonia",
    keyFindings:["Focal right basal air-space opacity","Air bronchogram pattern"],
    report:"Synthetic chest radiograph demonstrates right lower-zone consolidation suspicious for pneumonia.",
    teachingPoint:"Correlate with fever, respiratory symptoms and inflammatory markers."
  },
  {
    id:"pelvis-open-book",
    modality:"X-ray",
    bodyRegion:"Pelvis",
    title:"Open-book Pelvic Injury",
    keyFindings:["Pubic symphysis widening","Pelvic ring disruption pattern"],
    report:"Synthetic AP pelvis demonstrates traumatic widening of the pubic symphysis consistent with an open-book pelvic injury pattern.",
    teachingPoint:"In unstable trauma, treat pelvic-ring injury as a potential source of major haemorrhage."
  },
  {
    id:"ct-head-sah",
    modality:"CT",
    bodyRegion:"Brain",
    title:"Subarachnoid Haemorrhage",
    keyFindings:["Hyperdensity in basal cisterns","Sulcal hyperdensity pattern"],
    report:"Synthetic non-contrast CT brain demonstrates acute subarachnoid haemorrhage centred in the basal cisterns.",
    teachingPoint:"The basal cisterns and sylvian fissures are key review areas in suspected acute SAH."
  },
  {
    id:"ct-head-subdural",
    modality:"CT",
    bodyRegion:"Brain",
    title:"Acute Subdural Haematoma",
    keyFindings:["Crescentic extra-axial hyperdensity","Mass effect","Midline shift pattern"],
    report:"Synthetic CT brain demonstrates an acute left convexity subdural haematoma with mass effect and mild midline shift.",
    teachingPoint:"Subdural blood typically forms a crescentic collection that can cross sutures."
  },
  {
    id:"ct-head-ich",
    modality:"CT",
    bodyRegion:"Brain",
    title:"Basal Ganglia Intracerebral Haemorrhage",
    keyFindings:["Deep intraparenchymal hyperdensity","Surrounding oedema","Local mass effect"],
    report:"Synthetic CT brain demonstrates an acute basal ganglia intracerebral haemorrhage with surrounding oedema.",
    teachingPoint:"Deep ganglionic haemorrhage is a classic hypertensive distribution."
  },
  {
    id:"ct-head-large-mca",
    modality:"CT",
    bodyRegion:"Brain",
    title:"Large MCA Territory Infarct",
    keyFindings:["Loss of grey-white differentiation","Sulcal effacement","Insular ribbon loss pattern"],
    report:"Synthetic CT brain demonstrates established large MCA territory infarction with oedema and local mass effect.",
    teachingPoint:"Early CT signs include insular ribbon loss, obscuration of the lentiform nucleus and sulcal effacement."
  },
  {
    id:"ctpa-pe",
    modality:"CT",
    bodyRegion:"Chest",
    title:"Large Pulmonary Embolism",
    keyFindings:["Central pulmonary arterial filling defect","Right-heart strain pattern"],
    report:"Synthetic CTPA demonstrates a large pulmonary embolus with associated right-heart strain features.",
    teachingPoint:"Combine clot burden with haemodynamics and RV strain rather than relying on clot size alone."
  },
  {
    id:"ct-abdo-free-air",
    modality:"CT",
    bodyRegion:"Abdomen",
    title:"Perforated Viscus",
    keyFindings:["Free intraperitoneal gas","Focal bowel-wall inflammatory change","Free fluid"],
    report:"Synthetic CT abdomen demonstrates pneumoperitoneum and inflammatory change concerning for perforated viscus.",
    teachingPoint:"Free intraperitoneal gas plus focal inflammatory change should trigger urgent surgical assessment."
  }
];
