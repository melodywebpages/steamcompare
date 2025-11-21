export type SteamGame = {
  appid: number;
  name: string;
  playtime_forever: number; // in minutes
  achievement_count?: number; // number of achievements unlocked
};

export type OwnedGamesResponse = {
  response?: {
    game_count?: number;
    games?: Array<{
      appid: number;
      name?: string;
      playtime_forever?: number; // in minutes
    }>;
  };
};

const STEAM_API_BASE = "https://api.steampowered.com";

function isSteamId64(value: string): boolean {
  return /^\d{17}$/.test(value);
}

function extractPossibleIdentifier(rawInput: string): { type: "steamid" | "vanity"; value: string } {
  const input = rawInput.trim();

  // If it's already a 17-digit steamid64
  if (isSteamId64(input)) return { type: "steamid", value: input };

  // Try to extract from common profile URL formats
  const profilesMatch = input.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
  if (profilesMatch?.[1]) return { type: "steamid", value: profilesMatch[1] };

  const vanityMatch = input.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
  if (vanityMatch?.[1]) return { type: "vanity", value: decodeURIComponent(vanityMatch[1]) };

  // Fallback: treat as vanity string
  return { type: "vanity", value: input };
}

export async function resolveToSteamId64(input: string, apiKey: string): Promise<string> {
  console.log(`[resolveToSteamId64] Starting resolution for input: ${input}`);
  const candidate = extractPossibleIdentifier(input);
  console.log(`[resolveToSteamId64] Extracted identifier type: ${candidate.type}, value: ${candidate.value}`);
  
  if (candidate.type === "steamid") {
    console.log(`[resolveToSteamId64] Input is already a SteamID64: ${candidate.value}`);
    return candidate.value;
  }

  const url = new URL(`${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("vanityurl", candidate.value);
  
  console.log(`[resolveToSteamId64] Calling Steam API: ${url.toString().replace(apiKey, "***")}`);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    console.log(`[resolveToSteamId64] Steam API response status: ${res.status}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[resolveToSteamId64] Steam API error response: ${errorText}`);
      throw new Error(`Steam ResolveVanityURL error: ${res.status} - ${errorText}`);
    }
    
    const data = (await res.json()) as { response?: { success?: number; steamid?: string; message?: string } };
    console.log(`[resolveToSteamId64] Steam API response data:`, JSON.stringify(data));
    
    if (data.response?.success !== 1 || !data.response?.steamid) {
      const errorMsg = data.response?.message || "Could not resolve vanity URL to SteamID64";
      console.error(`[resolveToSteamId64] Resolution failed: ${errorMsg}, success code: ${data.response?.success}`);
      throw new Error(errorMsg);
    }
    
    console.log(`[resolveToSteamId64] Successfully resolved to SteamID64: ${data.response.steamid}`);
    return data.response.steamid;
  } catch (err) {
    console.error(`[resolveToSteamId64] Exception during resolution:`, err);
    throw err;
  }
}

export async function fetchOwnedGames(steamId64: string, apiKey: string): Promise<SteamGame[]> {
  console.log(`[fetchOwnedGames] Starting fetch for SteamID64: ${steamId64}`);
  
  const url = new URL(
    `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/`
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId64);
  url.searchParams.set("include_appinfo", "1");
  url.searchParams.set("format", "json");

  console.log(`[fetchOwnedGames] Calling Steam API: ${url.toString().replace(apiKey, "***")}`);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    console.log(`[fetchOwnedGames] Steam API response status: ${res.status}, ok: ${res.ok}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[fetchOwnedGames] Steam API error response (${res.status}): ${errorText}`);
      throw new Error(`Steam API error: ${res.status} - ${errorText}`);
    }
    
    const data: OwnedGamesResponse = await res.json();
    console.log(`[fetchOwnedGames] Steam API response structure:`, {
      hasResponse: !!data.response,
      gameCount: data.response?.game_count,
      gamesArrayLength: data.response?.games?.length,
      gamesArrayExists: !!data.response?.games
    });
    
    // Check if the response structure exists
    if (!data.response) {
      console.error(`[fetchOwnedGames] No response object in API response. Full data:`, JSON.stringify(data));
      throw new Error("Profile not found or private - game details are not public. The Steam API returned no response data.");
    }
    
    // Log the actual response for debugging
    console.log(`[fetchOwnedGames] Full response data:`, JSON.stringify(data, null, 2));
    
    // Check if games array exists (even if empty)
    const games = data.response.games ?? [];
    const gameCount = data.response.game_count ?? 0;
    
    console.log(`[fetchOwnedGames] Parsed data - game_count: ${gameCount}, games array length: ${games.length}`);
    
    // If game_count is 0 AND games array is empty/missing, it could mean:
    // 1. Profile is private (most common)
    // 2. Profile legitimately has 0 games (rare but possible)
    // We'll be more lenient - only throw error if we're certain it's private
    // The Steam API typically returns games array even if empty for public profiles
    if (gameCount === 0 && (!games || games.length === 0)) {
      console.warn(`[fetchOwnedGames] Profile has 0 games. This could mean private profile or no games.`);
      // Don't throw error - return empty array instead
      // The caller can decide what to do with empty results
      return [];
    }
    
    // Filter and map games
    const validGames = games
      .filter(g => {
        const isValid = typeof g.appid === "number";
        if (!isValid) {
          console.warn(`[fetchOwnedGames] Skipping invalid game entry:`, g);
        }
        return isValid;
      })
      .map(g => ({ 
        appid: g.appid, 
        name: g.name ?? `App ${g.appid}`,
        playtime_forever: g.playtime_forever ?? 0
      }));
    
    console.log(`[fetchOwnedGames] Successfully fetched ${validGames.length} games for SteamID64: ${steamId64}`);
    return validGames;
  } catch (err) {
    console.error(`[fetchOwnedGames] Exception during fetch for SteamID64 ${steamId64}:`, err);
    if (err instanceof Error) {
      console.error(`[fetchOwnedGames] Error message: ${err.message}`);
      console.error(`[fetchOwnedGames] Error stack: ${err.stack}`);
    }
    throw err;
  }
}

export type AchievementResponse = {
  playerstats?: {
    gameName?: string;
    achievements?: Array<{
      apiname: string;
      achieved: number; // 1 if unlocked, 0 if not
    }>;
  };
};

export async function fetchAchievementCounts(steamId64: string, appids: number[], apiKey: string): Promise<Map<number, number>> {
  console.log(`[fetchAchievementCounts] Fetching achievements for ${appids.length} games for SteamID64: ${steamId64}`);
  
  const achievementMap = new Map<number, number>();
  
  // Fetch achievements for each game in parallel (limit to avoid too many requests)
  const batchSize = 10;
  for (let i = 0; i < appids.length; i += batchSize) {
    const batch = appids.slice(i, i + batchSize);
    const promises = batch.map(async (appid) => {
      try {
        const url = new URL(`${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v0001/`);
        url.searchParams.set("key", apiKey);
        url.searchParams.set("steamid", steamId64);
        url.searchParams.set("appid", appid.toString());
        url.searchParams.set("l", "english");
        
        const res = await fetch(url.toString(), { next: { revalidate: 300 } });
        if (!res.ok) {
          console.warn(`[fetchAchievementCounts] Failed to fetch achievements for appid ${appid}: ${res.status}`);
          return { appid, count: 0 };
        }
        
        const data: AchievementResponse = await res.json();
        const achievements = data.playerstats?.achievements ?? [];
        const unlockedCount = achievements.filter(a => a.achieved === 1).length;
        
        console.log(`[fetchAchievementCounts] AppID ${appid}: ${unlockedCount} achievements unlocked`);
        return { appid, count: unlockedCount };
      } catch (err) {
        console.warn(`[fetchAchievementCounts] Error fetching achievements for appid ${appid}:`, err);
        return { appid, count: 0 };
      }
    });
    
    const results = await Promise.all(promises);
    results.forEach(({ appid, count }) => {
      achievementMap.set(appid, count);
    });
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < appids.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`[fetchAchievementCounts] Successfully fetched achievements for ${achievementMap.size} games`);
  return achievementMap;
}

export type ComparedGame = {
  appid: number;
  name: string;
  playtimeA: number; // in minutes
  playtimeB: number; // in minutes
  achievementA?: number;
  achievementB?: number;
  winner: "A" | "B" | "tie";
};

export function compareLibraries(
  a: SteamGame[], 
  b: SteamGame[], 
  compareBy: "playtime" | "achievements" = "playtime"
) {
  console.log(`[compareLibraries] Starting comparison - Library A: ${a.length} games, Library B: ${b.length} games, Compare by: ${compareBy}`);
  
  try {
    const byIdA = new Map(a.map(g => [g.appid, g] as const));
    const byIdB = new Map(b.map(g => [g.appid, g] as const));

    console.log(`[compareLibraries] Created maps - A: ${byIdA.size} entries, B: ${byIdB.size} entries`);

    const overlap: ComparedGame[] = [];
    const onlyA: SteamGame[] = [];
    const onlyB: SteamGame[] = [];

    for (const game of a) {
      if (byIdB.has(game.appid)) {
        const gameB = byIdB.get(game.appid)!;
        const playtimeA = game.playtime_forever;
        const playtimeB = gameB.playtime_forever;
        const achievementA = game.achievement_count ?? 0;
        const achievementB = gameB.achievement_count ?? 0;
        
        let winner: "A" | "B" | "tie" = "tie";
        if (compareBy === "playtime") {
          if (playtimeA > playtimeB) winner = "A";
          else if (playtimeB > playtimeA) winner = "B";
        } else {
          if (achievementA > achievementB) winner = "A";
          else if (achievementB > achievementA) winner = "B";
        }
        
        overlap.push({
          appid: game.appid,
          name: game.name,
          playtimeA,
          playtimeB,
          achievementA,
          achievementB,
          winner
        });
      } else {
        onlyA.push(game);
      }
    }
    for (const game of b) {
      if (!byIdA.has(game.appid)) {
        onlyB.push(game);
      }
    }

    console.log(`[compareLibraries] Comparison results - Overlap: ${overlap.length}, Only A: ${onlyA.length}, Only B: ${onlyB.length}`);

    // Sort based on comparison type
    if (compareBy === "playtime") {
      // Sort by playtime (most played first)
      overlap.sort((x, y) => {
        const totalX = x.playtimeA + x.playtimeB;
        const totalY = y.playtimeA + y.playtimeB;
        return totalY - totalX; // Descending order
      });
      onlyA.sort((x, y) => y.playtime_forever - x.playtime_forever);
      onlyB.sort((x, y) => y.playtime_forever - x.playtime_forever);
    } else {
      // Sort by achievements (most achievements first)
      overlap.sort((x, y) => {
        const totalX = (x.achievementA ?? 0) + (x.achievementB ?? 0);
        const totalY = (y.achievementA ?? 0) + (y.achievementB ?? 0);
        return totalY - totalX; // Descending order
      });
      onlyA.sort((x, y) => (y.achievement_count ?? 0) - (x.achievement_count ?? 0));
      onlyB.sort((x, y) => (y.achievement_count ?? 0) - (x.achievement_count ?? 0));
    }

    console.log(`[compareLibraries] Successfully completed comparison and sorted by ${compareBy}`);
    return { overlap, onlyA, onlyB };
  } catch (err) {
    console.error(`[compareLibraries] Exception during comparison:`, err);
    if (err instanceof Error) {
      console.error(`[compareLibraries] Error message: ${err.message}`);
      console.error(`[compareLibraries] Error stack: ${err.stack}`);
    }
    throw err;
  }
}

export { formatPlaytime } from "./format";


