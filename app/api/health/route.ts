import {
  getHiveOrganisationId,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import { isEmbeddingConfigured } from "@/lib/ai/embeddings";
import { jsonResponse } from "@/lib/security/http";
import { randomUUID } from "crypto";

export const runtime="nodejs";

export async function GET(){
  const requestId=randomUUID();
  let organisationConfigured=false;
  try{
    organisationConfigured=Boolean(getHiveOrganisationId());
  }catch{
    organisationConfigured=false;
  }

  const checks={
    app:true,
    supabase:isSupabaseConfigured(),
    organisation:organisationConfigured,
    embeddings:isEmbeddingConfigured(),
    clinicalProvider:Boolean(process.env.HIVE_AI_BASE_URL && process.env.HIVE_AI_API_KEY && process.env.HIVE_AI_MODEL),
    mockClinicalFallback:process.env.HIVE_AI_ALLOW_MOCK==="true",
  };

  const ready=checks.app && checks.organisation;
  return jsonResponse({
    service:"HIVE Intelligence",
    status:ready?"ready":"degraded",
    checks,
    timestamp:new Date().toISOString(),
  },requestId,ready?200:503);
}
