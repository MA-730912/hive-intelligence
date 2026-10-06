import type {HiveWorkspaceContext} from "./workspace";

export const demoWorkspaceContexts: HiveWorkspaceContext[] = [
  {
    id:"personal",
    name:"My professional workspace",
    kind:"personal",
    role:"clinician",
    subtitle:"Personal identity, clinical tools, credentials and professional development"
  },
  {
    id:"hospital",
    name:"HIVE Intelligence Demo Hospital",
    kind:"organisation",
    role:"clinical-director",
    subtitle:"Clinical Director · Emergency Medicine"
  },
  {
    id:"credentialling",
    name:"HIVE Credentialling Office",
    kind:"organisation",
    role:"credentialling-officer",
    subtitle:"Credentialling Officer"
  },
  {
    id:"simulation",
    name:"Simulation Faculty Network",
    kind:"organisation",
    role:"simulation-educator",
    subtitle:"Simulation Educator"
  },
  {
    id:"executive",
    name:"Hospital Executive View",
    kind:"organisation",
    role:"executive",
    subtitle:"Executive read-only intelligence"
  }
];
