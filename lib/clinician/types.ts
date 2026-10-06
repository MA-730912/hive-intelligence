export type VerificationStatus =
  | "draft"
  | "pending"
  | "verified"
  | "needs_information"
  | "expired"
  | "rejected";

export type ClinicianCredential = {
  id:string;
  type:"ahpra"|"fellowship"|"provider"|"prescriber"|"indemnity"|"training"|"other";
  title:string;
  issuer:string;
  reference?:string;
  expiry?:string;
  status:VerificationStatus;
  evidence?:string;
};

export type ClinicianOrganisation = {
  id:string;
  name:string;
  role:string;
  facility?:string;
  status:"active"|"onboarding"|"inactive";
  readiness:number;
  outstanding:string[];
};

export type ClinicianCompetency = {
  id:string;
  title:string;
  category:string;
  status:"current"|"due_soon"|"expired"|"in_progress";
  evidence?:string;
  lastAssessed?:string;
  nextReview?:string;
  source:"credential"|"simulation"|"supervisor"|"course";
};

export type ProfessionalExpense = {
  id:string;
  provider:string;
  description:string;
  category:"registration"|"college"|"indemnity"|"education"|"subscription"|"other";
  amount:number;
  currency:"AUD";
  dueDate?:string;
  status:"upcoming"|"paid"|"overdue"|"awaiting_receipt";
  invoiceReference?:string;
  receiptReference?:string;
};

export type ClinicianProfessionalProfile = {
  id:string;
  title:string;
  fullName:string;
  displayName:string;
  specialty:string;
  subspecialty?:string;
  ahpraNumber:string;
  profession:string;
  registrationType:string;
  registrationExpiry?:string;
  fellowship?:string;
  providerNumber?:string;
  prescriberNumber?:string;
  credentials:ClinicianCredential[];
  organisations:ClinicianOrganisation[];
  competencies:ClinicianCompetency[];
  expenses:ProfessionalExpense[];
};
