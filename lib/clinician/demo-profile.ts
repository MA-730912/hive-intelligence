import type {ClinicianProfessionalProfile} from "./types";

export const demoClinicianProfile:ClinicianProfessionalProfile={
  id:"demo-clinician-001",
  title:"Dr",
  fullName:"Demo Emergency Physician",
  displayName:"Dr Demo Physician",
  specialty:"Emergency Medicine",
  subspecialty:"Clinical Simulation & Point-of-Care Ultrasound",
  ahpraNumber:"MED0000000000",
  profession:"Medical Practitioner",
  registrationType:"Specialist registration",
  registrationExpiry:"2027-09-30",
  fellowship:"FACEM",
  providerNumber:"DEMO123456",
  prescriberNumber:"DEMO654321",
  credentials:[
    {id:"cred-ahpra",type:"ahpra",title:"AHPRA Medical Registration",issuer:"AHPRA",reference:"MED0000000000",expiry:"2027-09-30",status:"verified"},
    {id:"cred-college",type:"fellowship",title:"Fellowship of the Australasian College for Emergency Medicine",issuer:"ACEM",reference:"FACEM",status:"verified"},
    {id:"cred-provider",type:"provider",title:"Medicare Provider Number",issuer:"Services Australia",reference:"DEMO123456",status:"verified"},
    {id:"cred-prescriber",type:"prescriber",title:"Prescriber Number",issuer:"Services Australia",reference:"DEMO654321",status:"verified"},
    {id:"cred-indemnity",type:"indemnity",title:"Medical Indemnity Insurance",issuer:"Demo Medical Defence",reference:"POL-DEMO-001",expiry:"2027-02-28",status:"verified",evidence:"Certificate of currency"}
  ],
  organisations:[
    {id:"org-1",name:"HIVE Intelligence Demo Hospital",role:"Emergency Medicine Consultant",facility:"Emergency Department",status:"active",readiness:96,outstanding:["Annual antimicrobial stewardship module"]},
    {id:"org-2",name:"HIVE Clinical",role:"Telehealth Clinician",status:"active",readiness:100,outstanding:[]},
    {id:"org-3",name:"Simulation Faculty Network",role:"Simulation Faculty",status:"onboarding",readiness:78,outstanding:["Faculty orientation","Supervisor declaration"]}
  ],
  competencies:[
    {id:"comp-1",title:"Advanced Life Support",category:"Resuscitation",status:"current",lastAssessed:"2026-04-20",nextReview:"2027-04-20",source:"course",evidence:"ALS certificate"},
    {id:"comp-2",title:"Emergency Airway / RSI",category:"Airway",status:"current",lastAssessed:"2026-06-15",nextReview:"2027-06-15",source:"supervisor"},
    {id:"comp-3",title:"eFAST",category:"POCUS",status:"current",lastAssessed:"2026-08-12",nextReview:"2027-08-12",source:"simulation"},
    {id:"comp-4",title:"Cardiac POCUS",category:"POCUS",status:"due_soon",lastAssessed:"2025-11-10",nextReview:"2026-11-10",source:"credential"},
    {id:"comp-5",title:"Paediatric Resuscitation",category:"Paediatrics",status:"in_progress",source:"simulation"}
  ],
  expenses:[
    {id:"exp-1",provider:"AHPRA",description:"Annual medical registration renewal",category:"registration",amount:995,currency:"AUD",dueDate:"2027-09-30",status:"upcoming",invoiceReference:"Demo renewal notice"},
    {id:"exp-2",provider:"ACEM",description:"Annual College subscription",category:"college",amount:2180,currency:"AUD",dueDate:"2027-01-31",status:"upcoming",invoiceReference:"Demo college invoice"},
    {id:"exp-3",provider:"Demo Medical Defence",description:"Medical indemnity premium",category:"indemnity",amount:3650,currency:"AUD",status:"paid",receiptReference:"Receipt DEMO-2026-01"},
    {id:"exp-4",provider:"Simulation Conference",description:"Faculty development course",category:"education",amount:720,currency:"AUD",status:"awaiting_receipt"}
  ]
};
