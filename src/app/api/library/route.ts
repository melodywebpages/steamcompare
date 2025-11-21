import { NextRequest, NextResponse } from "next/server";
import { fetchOwnedGames, resolveToSteamId64 } from "@/lib/steam";

export async function GET(req: NextRequest) {
  console.log(`[library/GET] Request received`);
  const { searchParams } = new URL(req.url);
  const steamInput = searchParams.get("steamid");
  const apiKey = process.env.STEAM_API_KEY || "BAAA15D57A3961980B0B0C950E7A72F8";

  console.log(`[library/GET] Request params - steamInput: ${steamInput}, apiKey exists: ${!!apiKey}, apiKey length: ${apiKey?.length}`);

  if (!apiKey) {
    console.error(`[library/GET] Missing STEAM_API_KEY environment variable`);
    return NextResponse.json({ error: "Missing STEAM_API_KEY" }, { status: 500 });
  }
  if (!steamInput) {
    console.error(`[library/GET] Missing steamid query parameter`);
    return NextResponse.json({ error: "Missing steamid query param" }, { status: 400 });
  }

  try {
    console.log(`[library/GET] Resolving SteamID64 for input: ${steamInput}`);
    const steamId64 = await resolveToSteamId64(steamInput, apiKey);
    console.log(`[library/GET] Resolved SteamID64: ${steamId64}`);
    
    console.log(`[library/GET] Fetching owned games for SteamID64: ${steamId64}`);
    const games = await fetchOwnedGames(steamId64, apiKey);
    console.log(`[library/GET] Fetched ${games.length} games for SteamID64: ${steamId64}`);
    
    if (games.length === 0) {
      console.warn(`[library/GET] No games found for SteamID64: ${steamId64}. This could mean private profile or no games.`);
      return NextResponse.json({
        steamId64,
        gameCount: 0,
        games: [],
        warning: "No games found. This profile may be private or have no games. Please ensure game details are set to public in Steam settings."
      });
    }
    
    // Sort by playtime (most played first)
    const sortedGames = games.sort((a, b) => b.playtime_forever - a.playtime_forever);
    console.log(`[library/GET] Successfully returning ${sortedGames.length} games sorted by playtime for SteamID64: ${steamId64}`);
    
    return NextResponse.json({
      steamId64,
      gameCount: sortedGames.length,
      games: sortedGames
    });
  } catch (err: unknown) {
    console.error(`[library/GET] Exception occurred:`, err);
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[library/GET] Error message: ${message}`);
    if (err instanceof Error && err.stack) {
      console.error(`[library/GET] Error stack: ${err.stack}`);
    }
    
    // Provide more helpful error messages
    if (message.includes("private") || message.includes("not public")) {
      console.error(`[library/GET] Profile privacy error detected: ${message}`);
      return NextResponse.json({ 
        error: `Profile is private: ${message}. Please make your game details public in Steam settings.` 
      }, { status: 400 });
    }
    
    console.error(`[library/GET] Returning generic error response: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
