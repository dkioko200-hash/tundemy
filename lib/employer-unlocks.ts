import { createClient } from "@supabase/supabase-js";

export const SINGLE_UNLOCK_PRICE_KES = 5000;
export const BUNDLE_PRICE_KES = 30000;
export const BUNDLE_PROFILE_COUNT = 10;
export const BUNDLE_DURATION_DAYS = 30;

export type UnlockType = "single" | "bundle";

const getServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function unlockCandidateForEmployer(employerId: string, candidateId: string) {
  const supabase = getServiceClient();
  const { error } = await supabase.from("employer_unlocks").upsert(
    { employer_id: employerId, candidate_id: candidateId },
    { onConflict: "employer_id,candidate_id" }
  );
  if (error) throw error;
}

export async function grantBundleToEmployer(employerId: string) {
  const supabase = getServiceClient();
  const { data: existing } = await supabase
    .from("employer_bundles")
    .select("profiles_remaining, expires_at")
    .eq("employer_id", employerId)
    .maybeSingle();

  const now = Date.now();
  const stillActive = existing && new Date(existing.expires_at).getTime() > now;
  const profilesRemaining = (stillActive ? existing.profiles_remaining : 0) + BUNDLE_PROFILE_COUNT;
  const expiresAt = new Date(now + BUNDLE_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("employer_bundles").upsert(
    { employer_id: employerId, profiles_remaining: profilesRemaining, expires_at: expiresAt },
    { onConflict: "employer_id" }
  );
  if (error) throw error;
}

export async function getEmployerBundle(employerId: string) {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("employer_bundles")
    .select("profiles_remaining, expires_at")
    .eq("employer_id", employerId)
    .maybeSingle();

  if (!data) return null;
  if (new Date(data.expires_at).getTime() <= Date.now()) return null;
  return data;
}

export async function useBundleCredit(employerId: string): Promise<boolean> {
  const supabase = getServiceClient();
  const bundle = await getEmployerBundle(employerId);
  if (!bundle || bundle.profiles_remaining <= 0) return false;

  const { error } = await supabase
    .from("employer_bundles")
    .update({ profiles_remaining: bundle.profiles_remaining - 1 })
    .eq("employer_id", employerId);
  if (error) throw error;
  return true;
}
