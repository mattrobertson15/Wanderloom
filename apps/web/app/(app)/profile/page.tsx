import { redirect } from "next/navigation";
import { getProfile, listTripsForOwner } from "@wanderloom/api";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import ProfilePageClient from "./client";

export default async function ProfilePage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const profile = await getProfile(supabase, user.id);
  const trips = await listTripsForOwner(supabase, user.id);

  return <ProfilePageClient profile={profile} trips={trips} />;
}
