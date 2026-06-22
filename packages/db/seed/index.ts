/**
 * Seed script per docs/DATABASE_SCHEMA.md's seed data plan. Creates a
 * handful of profiles, global places, and trips/albums/posts spanning all
 * three visibility levels, plus friendships/follows, so the globe, trip
 * pages, and profiles are populated for visual QA without manual setup.
 *
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm --filter @wanderloom/db seed
 */
import { createServiceRoleClient } from "../src/client";
import { SEED_PLACES } from "./places";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createServiceRoleClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface SeedUserSpec {
  email: string;
  username: string;
  displayName: string;
  isPublicProfile: boolean;
}

const SEED_USERS: SeedUserSpec[] = [
  { email: "maya@example.com", username: "maya_travels", displayName: "Maya Chen", isPublicProfile: true },
  { email: "daniel@example.com", username: "daniel_family", displayName: "Daniel Okafor", isPublicProfile: false },
  { email: "priya@example.com", username: "priya_wanders", displayName: "Priya Sharma", isPublicProfile: true },
  { email: "alex@example.com", username: "alex_adventures", displayName: "Alex Thompson", isPublicProfile: true },
  { email: "sophie@example.com", username: "sophie_explores", displayName: "Sophie Laurent", isPublicProfile: true },
  { email: "james@example.com", username: "james_roaming", displayName: "James Wilson", isPublicProfile: false },
];

const SEED_PASSWORD = "wanderloom-seed-1234";

async function ensureUser(spec: SeedUserSpec): Promise<string> {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing.users.find((u) => u.email === spec.email);
  if (found) return found.id;

  const { data, error } = await supabase.auth.admin.createUser({
    email: spec.email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { username: spec.username, display_name: spec.displayName },
  });
  if (error || !data.user) throw error ?? new Error(`Failed to create user ${spec.email}`);

  await supabase
    .from("profiles")
    .update({ is_public_profile: spec.isPublicProfile, bio: `Hi, I'm ${spec.displayName}.` })
    .eq("id", data.user.id);

  return data.user.id;
}

async function ensurePlaces(): Promise<Record<string, string>> {
  const ids: Record<string, string> = {};
  for (const place of SEED_PLACES) {
    const { data: existing } = await supabase.from("places").select("id").eq("name", place.name).maybeSingle();
    if (existing) {
      ids[place.name] = existing.id;
      continue;
    }
    const { data, error } = await supabase
      .from("places")
      .insert({
        name: place.name,
        category: place.category,
        location: `SRID=4326;POINT(${place.lng} ${place.lat})`,
        country_code: place.countryCode,
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error(`Failed to create place ${place.name}`);
    ids[place.name] = data.id;
  }
  return ids;
}

async function ensureTrip(
  ownerId: string,
  title: string,
  slug: string,
  visibility: "private" | "friends" | "public",
  startDate: string,
  endDate: string,
): Promise<string> {
  const { data: existing } = await supabase.from("trips").select("id").eq("slug", slug).maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("trips")
    .insert({
      owner_id: ownerId,
      title,
      slug,
      visibility,
      start_date: startDate,
      end_date: endDate,
      description: `${title} — seeded sample trip.`,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error(`Failed to create trip ${title}`);
  return data.id;
}

async function ensureAlbum(tripId: string, title: string, sortOrder: number): Promise<string> {
  const { data: existing } = await supabase
    .from("albums")
    .select("id")
    .eq("trip_id", tripId)
    .eq("title", title)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("albums")
    .insert({ trip_id: tripId, title, sort_order: sortOrder })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error(`Failed to create album ${title}`);
  return data.id;
}

async function ensurePost(
  tripId: string,
  albumId: string | null,
  placeId: string,
  authorId: string,
  title: string,
  body: string,
  postDate: string,
  visibility: "private" | "friends" | "public",
) {
  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("trip_id", tripId)
    .eq("title", title)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      trip_id: tripId,
      album_id: albumId,
      place_id: placeId,
      author_id: authorId,
      title,
      body,
      post_date: postDate,
      visibility,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error(`Failed to create post ${title}`);
  return data.id;
}

async function ensureFriendship(a: string, b: string) {
  const { data: existing } = await supabase
    .from("friendships")
    .select("id")
    .or(`and(requester_id.eq.${a},addressee_id.eq.${b}),and(requester_id.eq.${b},addressee_id.eq.${a})`)
    .maybeSingle();
  if (existing) return;
  await supabase.from("friendships").insert({ requester_id: a, addressee_id: b, status: "accepted" });
}

async function ensureFollow(followerId: string, followeeId: string) {
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  if (existing) return;
  await supabase.from("follows").insert({ follower_id: followerId, followee_id: followeeId });
}

async function main() {
  console.log("Seeding Wanderloom comprehensive sample data...");

  const [mayaId, danielId, priyaId, alexId, sophieId, jamesId] = await Promise.all([
    ensureUser(SEED_USERS[0]!),
    ensureUser(SEED_USERS[1]!),
    ensureUser(SEED_USERS[2]!),
    ensureUser(SEED_USERS[3]!),
    ensureUser(SEED_USERS[4]!),
    ensureUser(SEED_USERS[5]!),
  ]);
  console.log("Seeded users:", { mayaId, danielId, priyaId, alexId, sophieId, jamesId });

  const places = await ensurePlaces();
  console.log(`Seeded ${Object.keys(places).length} places.`);

  // ===== MAYA: Public traveler, extensive public trips =====
  const americaTrip = await ensureTrip(mayaId, "America 2026", "america-2026", "public", "2026-03-10", "2026-03-20");
  const nycAlbum = await ensureAlbum(americaTrip, "New York", 0);
  const laAlbum = await ensureAlbum(americaTrip, "Los Angeles", 1);
  await ensurePost(
    americaTrip, nycAlbum, places["Statue of Liberty"]!, mayaId,
    "First morning in Manhattan", "Woke up early to catch the ferry out to Liberty Island.",
    "2026-03-11", "public",
  );
  await ensurePost(
    americaTrip, nycAlbum, places["Central Park"]!, mayaId,
    "Walk through the park", "Spent the afternoon wandering Central Park.",
    "2026-03-12", "public",
  );
  await ensurePost(
    americaTrip, nycAlbum, places["Empire State Building"]!, mayaId,
    "Top of the world", "The view from the 86th floor observation deck is breathtaking.",
    "2026-03-13", "public",
  );
  await ensurePost(
    americaTrip, nycAlbum, places["Brooklyn Bridge"]!, mayaId,
    "Sunset crossing", "Walking the Brooklyn Bridge at golden hour never gets old.",
    "2026-03-14", "public",
  );
  await ensurePost(
    americaTrip, laAlbum, places["Griffith Observatory"]!, mayaId,
    "Sunset at Griffith", "Best view of the city right before sunset.",
    "2026-03-16", "public",
  );
  await ensurePost(
    americaTrip, laAlbum, places["Venice Beach"]!, mayaId,
    "Boardwalk afternoon", "Skateboarders, street art, and an ocean breeze.",
    "2026-03-17", "public",
  );
  await ensurePost(
    americaTrip, laAlbum, places["Hollywood Sign"]!, mayaId,
    "Hollywood dreams", "Finally hiked up to the sign. The city sprawls below forever.",
    "2026-03-18", "public",
  );

  // Maya: another public trip to Europe
  const europeTrip1 = await ensureTrip(mayaId, "Paris & Beyond", "paris-and-beyond", "public", "2026-06-01", "2026-06-15");
  const parisAlbum = await ensureAlbum(europeTrip1, "Paris", 0);
  const italyAlbum = await ensureAlbum(europeTrip1, "Italy", 1);
  await ensurePost(
    europeTrip1, parisAlbum, places["Eiffel Tower"]!, mayaId,
    "Icon", "You never really get tired of looking at the Eiffel Tower.",
    "2026-06-02", "public",
  );
  await ensurePost(
    europeTrip1, parisAlbum, places["Louvre Museum"]!, mayaId,
    "Art overload", "Could spend weeks in the Louvre and still miss things.",
    "2026-06-03", "public",
  );
  await ensurePost(
    europeTrip1, parisAlbum, places["Arc de Triomphe"]!, mayaId,
    "Parisian grandeur", "The scale of Paris's monuments is just incredible.",
    "2026-06-04", "public",
  );
  await ensurePost(
    europeTrip1, italyAlbum, places["Colosseum"]!, mayaId,
    "Ancient Rome", "Standing in the Colosseum, you feel the weight of history.",
    "2026-06-07", "public",
  );
  await ensurePost(
    europeTrip1, italyAlbum, places["Trevi Fountain"]!, mayaId,
    "Coin toss", "Threw in my coin. Hope my wish comes true!",
    "2026-06-08", "public",
  );

  // ===== DANIEL: Private profile, friends-only family trip, private personal trip =====
  const japanTrip = await ensureTrip(danielId, "Family Trip to Japan", "family-trip-to-japan", "friends", "2026-04-01", "2026-04-10");
  const kyotoAlbum = await ensureAlbum(japanTrip, "Kyoto", 0);
  const tokyoAlbum = await ensureAlbum(japanTrip, "Tokyo", 1);
  await ensurePost(
    japanTrip, kyotoAlbum, places["Fushimi Inari Shrine"]!, danielId,
    "Thousand gates", "The kids loved counting the torii gates on the hike up.",
    "2026-04-05", "friends",
  );
  await ensurePost(
    japanTrip, tokyoAlbum, places["Shibuya Crossing"]!, danielId,
    "Tokyo chaos", "Crossing Shibuya with the whole family in one piece, barely.",
    "2026-04-02", "friends",
  );
  await ensurePost(
    japanTrip, tokyoAlbum, places["Senso-ji Temple"]!, danielId,
    "Temple visit", "Peaceful even with the crowds. The kids got fortunes.",
    "2026-04-03", "friends",
  );

  // Daniel: private trip only visible to himself
  const privateTrip = await ensureTrip(danielId, "Solo Retreat", "solo-retreat", "private", "2026-07-01", "2026-07-05");
  const mountainAlbum = await ensureAlbum(privateTrip, "Mountains", 0);
  await ensurePost(
    privateTrip, mountainAlbum, places["Mount Fuji"]!, danielId,
    "Peace and quiet", "Taking a solo trip to clear my head.",
    "2026-07-02", "private",
  );
  await ensurePost(
    privateTrip, mountainAlbum, places["Mount Fuji"]!, danielId,
    "Sunrise hike", "Woke up at 4am. Worth every tired step.",
    "2026-07-03", "private",
  );

  // ===== PRIYA: Public profile, mix of public and private trips =====
  const dreamTrip = await ensureTrip(priyaId, "Someday List", "someday-list", "private", "2026-01-01", "2026-12-31");
  await ensurePost(
    dreamTrip, null, places["Blue Lagoon"]!, priyaId,
    "Need to go here", "Saving this for whenever I make it to Iceland.",
    "2026-01-05", "private",
  );
  await ensurePost(
    dreamTrip, null, places["Noma"]!, priyaId,
    "Fine dining bucket list", "One day I'll splurge for Noma.",
    "2026-02-14", "private",
  );

  const europeTrip = await ensureTrip(priyaId, "Spain & Iceland", "spain-and-iceland", "public", "2026-05-01", "2026-05-14");
  const barcelonaAlbum = await ensureAlbum(europeTrip, "Barcelona", 0);
  const icelandAlbum = await ensureAlbum(europeTrip, "Iceland", 1);
  await ensurePost(
    europeTrip, barcelonaAlbum, places["Sagrada Familia"]!, priyaId,
    "Gaudi's masterpiece", "Still being built, still breathtaking.",
    "2026-05-03", "public",
  );
  await ensurePost(
    europeTrip, barcelonaAlbum, places["Park Güell"]!, priyaId,
    "Colorful views", "Gaudi's vision of a utopian suburb is magical.",
    "2026-05-04", "public",
  );
  await ensurePost(
    europeTrip, icelandAlbum, places["Blue Lagoon"]!, priyaId,
    "Finally made it", "Geothermal water in the middle of a lava field. Unreal.",
    "2026-05-12", "public",
  );

  // ===== ALEX: Public profile, public trips =====
  const asiaTrip = await ensureTrip(alexId, "Southeast Asia Adventure", "southeast-asia-adventure", "public", "2026-02-01", "2026-02-20");
  const bangkokAlbum = await ensureAlbum(asiaTrip, "Bangkok", 0);
  const phuketAlbum = await ensureAlbum(asiaTrip, "Phuket", 1);
  await ensurePost(
    asiaTrip, bangkokAlbum, places["Grand Palace"]!, alexId,
    "Thai royalty", "The Grand Palace is an architectural marvel.",
    "2026-02-05", "public",
  );
  await ensurePost(
    asiaTrip, bangkokAlbum, places["Wat Pho"]!, alexId,
    "Reclining Buddha", "Massive and serene. Spiritually moving.",
    "2026-02-06", "public",
  );
  await ensurePost(
    asiaTrip, phuketAlbum, places["Venice Beach"]!, alexId,
    "Beach time", "Crystal clear water and white sand beaches.",
    "2026-02-14", "public",
  );

  // ===== SOPHIE: Public profile, friends-only trip =====
  const friendsOnlyTrip = await ensureTrip(sophieId, "Girls Weekend in Barcelona", "girls-weekend-barcelona", "friends", "2026-05-20", "2026-05-24");
  const eventAlbum = await ensureAlbum(friendsOnlyTrip, "Celebrations", 0);
  await ensurePost(
    friendsOnlyTrip, eventAlbum, places["Park Güell"]!, sophieId,
    "Squad at Güell", "My favorite people in my favorite city.",
    "2026-05-21", "friends",
  );
  await ensurePost(
    friendsOnlyTrip, null, places["L'Astrance"]!, sophieId,
    "Michelin-starred dinner", "We splurged and it was amazing.",
    "2026-05-22", "friends",
  );

  // ===== JAMES: Private profile, private trip only =====
  const privateHongKongTrip = await ensureTrip(jamesId, "Hong Kong Business Trip", "hk-business-trip", "private", "2026-08-01", "2026-08-07");
  const officeAlbum = await ensureAlbum(privateHongKongTrip, "Work Stuff", 0);
  await ensurePost(
    privateHongKongTrip, officeAlbum, places["The Peninsula Hong Kong"]!, jamesId,
    "Fancy stay", "Company put me up at the Peninsula. Can't complain.",
    "2026-08-02", "private",
  );

  // ===== SOCIAL GRAPH =====
  // Maya and Daniel are friends
  await ensureFriendship(mayaId, danielId);

  // Maya and Sophie are friends
  await ensureFriendship(mayaId, sophieId);

  // Daniel and Priya are friends
  await ensureFriendship(danielId, priyaId);

  // Alex and Sophie are friends
  await ensureFriendship(alexId, sophieId);

  // Follows (people following public profiles)
  await ensureFollow(priyaId, mayaId);     // Priya follows Maya
  await ensureFollow(danielId, priyaId);   // Daniel follows Priya
  await ensureFollow(alexId, mayaId);      // Alex follows Maya
  await ensureFollow(sophieId, alexId);    // Sophie follows Alex
  await ensureFollow(jamesId, mayaId);     // James follows Maya (public only)

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
