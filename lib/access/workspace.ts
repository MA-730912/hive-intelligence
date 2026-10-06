export type HiveWorkspaceRole =
  | "clinician"
  | "clinical-director"
  | "credentialling-officer"
  | "simulation-educator"
  | "organisation-admin"
  | "executive";

export type HiveWorkspaceModule =
  | "today"
  | "clinical-ai"
  | "knowledge"
  | "documents"
  | "credentials"
  | "organisations"
  | "competencies"
  | "cpd"
  | "wallet"
  | "simulation"
  | "workforce-readiness"
  | "credentialling-admin"
  | "members"
  | "governance"
  | "analytics"
  | "adverse-events-learning";

export type HiveWorkspaceContext = {
  id: string;
  name: string;
  kind: "personal" | "organisation";
  role: HiveWorkspaceRole;
  subtitle: string;
};

export type HiveModuleDefinition = {
  id: HiveWorkspaceModule;
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export const MODULES: Record<HiveWorkspaceModule,HiveModuleDefinition> = {
  today:{id:"today",title:"Today",description:"Meetings, reminders, credentials and tasks that need your attention.",href:"/clinician/today"},
  "clinical-ai":{id:"clinical-ai",title:"Clinical Workspace",description:"Clinical reasoning, structured documentation and decision support.",href:"/workspace",badge:"AI"},
  knowledge:{id:"knowledge",title:"Clinical Knowledge",description:"Approved organisational guidelines and source-backed answers.",href:"/knowledge",badge:"RAG"},
  documents:{id:"documents",title:"Knowledge Documents",description:"Organisation-approved policies, guidelines and document intelligence.",href:"/knowledge/documents"},
  credentials:{id:"credentials",title:"My Credentials",description:"Registration, fellowship, provider numbers, indemnity and evidence.",href:"/clinician/credentials"},
  organisations:{id:"organisations",title:"My Organisations",description:"Memberships, roles, onboarding and readiness by organisation.",href:"/clinician/organisations"},
  competencies:{id:"competencies",title:"Competency Passport",description:"Skills, simulation evidence, sign-off and revalidation.",href:"/clinician/competencies"},
  cpd:{id:"cpd",title:"CPD & Education",description:"Learning record, certificates and professional development evidence.",href:"/clinician/cpd"},
  wallet:{id:"wallet",title:"Professional Wallet",description:"Professional fees, invoices, receipts and renewal reminders.",href:"/clinician/wallet"},
  simulation:{id:"simulation",title:"Simulation Studio",description:"Scenario delivery, learner assessment and debrief workflows.",href:"/architecture",badge:"STUDIO"},
  "workforce-readiness":{id:"workforce-readiness",title:"Workforce Readiness",description:"Organisation-wide credential and competency readiness overview.",href:"/dashboard",badge:"ORG"},
  "credentialling-admin":{id:"credentialling-admin",title:"Credentialling",description:"Review clinician evidence, expiries and onboarding requirements.",href:"/dashboard",badge:"ORG"},
  members:{id:"members",title:"Members & Roles",description:"Manage organisation members, roles and authorised access.",href:"/dashboard",badge:"ADMIN"},
  governance:{id:"governance",title:"AI Governance",description:"Model policy, audit, source provenance and safety controls.",href:"/architecture",badge:"GOV"},
  analytics:{id:"analytics",title:"Organisation Intelligence",description:"High-level readiness, utilisation and governance insights.",href:"/dashboard",badge:"EXEC"},
  "adverse-events-learning":{id:"adverse-events-learning",title:"Learning from Adverse Clinical Events",description:"Governance-led learning, simulation reconstruction, teaching and debrief from adverse clinical events.",href:"/architecture#adverse-events",badge:"LEARNING"},
};

const ROLE_MODULES: Record<HiveWorkspaceRole,readonly HiveWorkspaceModule[]> = {
  clinician:["today","clinical-ai","knowledge","credentials","organisations","competencies","cpd","wallet"],
  "clinical-director":["today","clinical-ai","knowledge","credentials","organisations","competencies","cpd","simulation","adverse-events-learning","workforce-readiness","governance"],
  "credentialling-officer":["knowledge","credentialling-admin","workforce-readiness","members"],
  "simulation-educator":["today","knowledge","simulation","adverse-events-learning","competencies","cpd","workforce-readiness"],
  "organisation-admin":["knowledge","documents","credentialling-admin","workforce-readiness","adverse-events-learning","members","governance","analytics"],
  executive:["workforce-readiness","adverse-events-learning","governance","analytics"],
};

export function modulesForRole(role:HiveWorkspaceRole){
  return ROLE_MODULES[role].map(id=>MODULES[id]);
}

/*
  Browser presentation contract only.

  This controls which modules are rendered in the interface. It is NOT
  an authorisation boundary. API routes, server components and database
  policies must independently verify identity, organisation membership,
  role and permission before returning protected data.
*/
