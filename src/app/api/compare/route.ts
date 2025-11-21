import { NextRequest, NextResponse } from "next/server";
import { compareLibraries, fetchAchievementCounts, fetchOwnedGames, resolveToSteamId64 } from "@/lib/steam";

export async function GET(req: NextRequest) {
  console.log(`[compare/GET] Request received`);
  
  // Check if request was cancelled (client disconnected)
  const checkCancelled = () => {
    // Note: Next.js doesn't expose request.aborted directly, but we can check the signal
    // This is a best-effort check
    return false; // Will be improved if Next.js adds better cancellation support
  };
  
  const { searchParams } = new URL(req.url);
  const aInput = searchParams.get("a");
  const bInput = searchParams.get("b");
  const compareBy = (searchParams.get("compareBy") || "playtime") as "playtime" | "achievements";
  const apiKey = process.env.STEAM_API_KEY;

  console.log(`[compare/GET] Request params - aInput: ${aInput}, bInput: ${bInput}, apiKey exists: ${!!apiKey}, apiKey length: ${apiKey?.length}`);

  if (!apiKey) {
    console.error(`[compare/GET] Missing STEAM_API_KEY environment variable`);
    return NextResponse.json({ error: "Missing STEAM_API_KEY" }, { status: 500 });
  }
  if (!aInput || !bInput) {
    console.error(`[compare/GET] Missing required query params - aInput: ${aInput}, bInput: ${bInput}`);
    return NextResponse.json({ error: "Missing steamid query params 'a' and 'b'" }, { status: 400 });
  }

  try {
    console.log(`[compare/GET] Resolving SteamID64 for both inputs - A: ${aInput}, B: ${bInput}`);
    const [aId, bId] = await Promise.all([
      resolveToSteamId64(aInput, apiKey),
      resolveToSteamId64(bInput, apiKey),
    ]);
    console.log(`[compare/GET] Resolved SteamID64s - A: ${aId}, B: ${bId}`);
    
    // Try to fetch games for both users with better error handling
    let gamesA: any[] = [];
    let gamesB: any[] = [];
    let errorA: string | null = null;
    let errorB: string | null = null;
    
    console.log(`[compare/GET] Fetching games for User A (${aId})`);
    try {
      gamesA = await fetchOwnedGames(aId, apiKey);
      console.log(`[compare/GET] Successfully fetched ${gamesA.length} games for User A (${aId})`);
    } catch (err) {
      errorA = err instanceof Error ? err.message : "Unknown error";
      console.error(`[compare/GET] Error fetching games for User A (${aId}): ${errorA}`);
      if (err instanceof Error && err.stack) {
        console.error(`[compare/GET] User A error stack: ${err.stack}`);
      }
    }
    
    console.log(`[compare/GET] Fetching games for User B (${bId})`);
    try {
      gamesB = await fetchOwnedGames(bId, apiKey);
      console.log(`[compare/GET] Successfully fetched ${gamesB.length} games for User B (${bId})`);
    } catch (err) {
      errorB = err instanceof Error ? err.message : "Unknown error";
      console.error(`[compare/GET] Error fetching games for User B (${bId}): ${errorB}`);
      if (err instanceof Error && err.stack) {
        console.error(`[compare/GET] User B error stack: ${err.stack}`);
      }
    }
    
    // If both users have errors, return a combined error
    if (errorA && errorB) {
      console.error(`[compare/GET] Both users have errors - A: ${errorA}, B: ${errorB}`);
      return NextResponse.json({ 
        error: `Both profiles have issues: User A (${aInput}): ${errorA}. User B (${bInput}): ${errorB}` 
      }, { status: 400 });
    }
    
    // If one user has an error, return specific error
    if (errorA) {
      console.error(`[compare/GET] User A has error: ${errorA}`);
      return NextResponse.json({ 
        error: `User A (${aInput}): ${errorA}. Please ask them to make their game details public.` 
      }, { status: 400 });
    }
    
    if (errorB) {
      console.error(`[compare/GET] User B has error: ${errorB}`);
      return NextResponse.json({ 
        error: `User B (${bInput}): ${errorB}. Please ask them to make their game details public.` 
      }, { status: 400 });
    }
    
    // Check if either user has no games (could be private or legitimately no games)
    if (gamesA.length === 0 && gamesB.length === 0) {
      console.warn(`[compare/GET] Both users have 0 games - A: ${aId}, B: ${bId}`);
      return NextResponse.json({
        aCount: 0,
        bCount: 0,
        overlap: [],
        onlyA: [],
        onlyB: [],
        warning: "Both profiles have no games. This could mean private profiles or no games. Please ensure game details are set to public in Steam settings."
      });
    }
    
    if (gamesA.length === 0) {
      console.warn(`[compare/GET] User A has 0 games: ${aId}`);
      return NextResponse.json({
        aCount: 0,
        bCount: gamesB.length,
        overlap: [],
        onlyA: [],
        onlyB: gamesB,
        warning: `User A (${aInput}) has no games. This could mean private profile or no games.`
      });
    }
    
    if (gamesB.length === 0) {
      console.warn(`[compare/GET] User B has 0 games: ${bId}`);
      return NextResponse.json({
        aCount: gamesA.length,
        bCount: 0,
        overlap: [],
        onlyA: gamesA,
        onlyB: [],
        warning: `User B (${bInput}) has no games. This could mean private profile or no games.`
      });
    }
    
    // If comparing by achievements, fetch achievement counts
    if (compareBy === "achievements") {
      console.log(`[compare/GET] Fetching achievements for comparison`);
      
      // Check if cancelled before starting achievement fetch
      if (checkCancelled()) {
        console.log(`[compare/GET] Request cancelled before achievement fetch - aborting`);
        return NextResponse.json({ error: "Request cancelled" }, { status: 499 }); // 499 = Client Closed Request
      }
      
      const appidsA = gamesA.map(g => g.appid);
      const appidsB = gamesB.map(g => g.appid);
      
      try {
        const [achievementsA, achievementsB] = await Promise.all([
          fetchAchievementCounts(aId, appidsA, apiKey),
          fetchAchievementCounts(bId, appidsB, apiKey),
        ]);
        
        // Check again after achievement fetch
        if (checkCancelled()) {
          console.log(`[compare/GET] Request cancelled after achievement fetch - aborting`);
          return NextResponse.json({ error: "Request cancelled" }, { status: 499 });
        }
        
        // Add achievement counts to games
        gamesA = gamesA.map(g => ({
          ...g,
          achievement_count: achievementsA.get(g.appid) ?? 0
        }));
        gamesB = gamesB.map(g => ({
          ...g,
          achievement_count: achievementsB.get(g.appid) ?? 0
        }));
        
        console.log(`[compare/GET] Achievement counts fetched - A: ${achievementsA.size}, B: ${achievementsB.size}`);
      } catch (err) {
        if (err instanceof Error && err.message.includes("cancelled")) {
          console.log(`[compare/GET] Achievement fetch was cancelled`);
          return NextResponse.json({ error: "Request cancelled" }, { status: 499 });
        }
        throw err;
      }
    }
    
    console.log(`[compare/GET] Comparing libraries - User A: ${gamesA.length} games, User B: ${gamesB.length} games, Compare by: ${compareBy}`);
    const { overlap, onlyA, onlyB } = compareLibraries(gamesA, gamesB, compareBy);
    console.log(`[compare/GET] Comparison complete - Overlap: ${overlap.length}, Only A: ${onlyA.length}, Only B: ${onlyB.length}`);
    
    return NextResponse.json({
      aCount: gamesA.length,
      bCount: gamesB.length,
      overlap,
      onlyA,
      onlyB,
      compareBy,
    });
  } catch (err: unknown) {
    console.error(`[compare/GET] Exception occurred:`, err);
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[compare/GET] Error message: ${message}`);
    if (err instanceof Error && err.stack) {
      console.error(`[compare/GET] Error stack: ${err.stack}`);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


