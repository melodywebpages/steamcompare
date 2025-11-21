"use client";
import { useState, useRef, useEffect } from "react";
import { formatPlaytime } from "@/lib/format";
import LoadingSpinner from "@/components/LoadingSpinner";
import Fireworks from "@/components/Fireworks";

type ComparedGame = {
  appid: number;
  name: string;
  playtimeA: number;
  playtimeB: number;
  achievementA?: number;
  achievementB?: number;
  winner: "A" | "B" | "tie";
};

type CompareResult = {
  aCount: number;
  bCount: number;
  overlap: ComparedGame[];
  onlyA: { appid: number; name: string; playtime_forever: number; achievement_count?: number }[];
  onlyB: { appid: number; name: string; playtime_forever: number; achievement_count?: number }[];
  error?: string;
  warning?: string;
  compareBy?: "playtime" | "achievements";
};

type LibraryResult = {
  steamId64: string;
  gameCount: number;
  games: { appid: number; name: string; playtime_forever: number }[];
  error?: string;
  warning?: string;
};

export default function Home() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [singleSteamId, setSingleSteamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [libraryResult, setLibraryResult] = useState<LibraryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [compareBy, setCompareBy] = useState<"playtime" | "achievements">("playtime");
  const [cancelled, setCancelled] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [lastCompareInputs, setLastCompareInputs] = useState<{ a: string; b: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isCancelledRef = useRef(false);

  // Check if user wins and trigger fireworks
  useEffect(() => {
    if (result && result.overlap.length > 0) {
      const gamesWonByA = result.overlap.filter(g => g.winner === "A").length;
      const gamesWonByB = result.overlap.filter(g => g.winner === "B").length;
      
      if (gamesWonByA > gamesWonByB) {
        setShowFireworks(true);
        // Hide fireworks after 3 seconds
        const timer = setTimeout(() => {
          setShowFireworks(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [result]);

  // Cleanup on unmount (page refresh/navigation)
  useEffect(() => {
    return () => {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        console.log("[Home] Component unmounting - aborting ongoing requests");
        isCancelledRef.current = true;
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const stopRequest = () => {
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
      console.log("[Home] User cancelled request via stop button");
      isCancelledRef.current = true;
      abortControllerRef.current.abort();
      setCancelled(true);
      setLoading(false);
      setError("Request cancelled by user");
      // Clear the ref so we don't process any pending responses
      abortControllerRef.current = null;
    }
  };

  // Function to re-run comparison with a different mode
  async function reCompareWithMode(mode: "playtime" | "achievements") {
    if (!lastCompareInputs) return;
    
    setCompareBy(mode);
    setLoading(true);
    setError(null);
    setCancelled(false);
    setResult(null);
    setSearchQuery("");
    isCancelledRef.current = false;
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      console.log(`[Home] Re-running comparison with mode: ${mode}`);
      const res = await fetch(`/api/compare?a=${encodeURIComponent(lastCompareInputs.a)}&b=${encodeURIComponent(lastCompareInputs.b)}&compareBy=${mode}`, {
        signal
      });
      
      // Check if cancelled before processing response
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted before response - ignoring response");
        return;
      }
      
      const data = (await res.json()) as CompareResult;
      
      // Check again after parsing - user might have cancelled during parsing
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted during response parsing - ignoring data");
        return;
      }
      
      // Double check before updating state
      if (isCancelledRef.current) {
        console.log("[Home] Request was cancelled - not updating state");
        return;
      }
      
      if (!res.ok || (data as any).error) {
        if (!isCancelledRef.current) {
          setError((data as any).error || `Request failed (${res.status})`);
        }
      } else {
        if (!isCancelledRef.current) {
          setResult(data);
          console.log("[Home] Re-comparison completed successfully");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("[Home] Fetch aborted - request cancelled (AbortError caught)");
        if (!isCancelledRef.current) {
          setError("Request cancelled");
          setCancelled(true);
        }
      } else if (isCancelledRef.current) {
        console.log("[Home] Error occurred but request was cancelled - ignoring");
      } else {
        console.error("[Home] Comparison error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
      }
    }
  }

  async function onCompare(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCancelled(false);
    setResult(null);
    setLibraryResult(null);
    setSearchQuery("");
    isCancelledRef.current = false;
    
    // Store the inputs for re-comparison
    setLastCompareInputs({ a, b });
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      console.log("[Home] Starting comparison request");
      const res = await fetch(`/api/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&compareBy=${compareBy}`, {
        signal
      });
      
      // Check if cancelled before processing response
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted before response - ignoring response");
        return;
      }
      
      const data = (await res.json()) as CompareResult;
      
      // Check again after parsing - user might have cancelled during parsing
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted during response parsing - ignoring data");
        return;
      }
      
      // Double check before updating state
      if (isCancelledRef.current) {
        console.log("[Home] Request was cancelled - not updating state");
        return;
      }
      
      if (!res.ok || (data as any).error) {
        if (!isCancelledRef.current) {
          setError((data as any).error || `Request failed (${res.status})`);
        }
      } else {
        if (!isCancelledRef.current) {
          setResult(data);
          console.log("[Home] Comparison completed successfully");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("[Home] Fetch aborted - request cancelled (AbortError caught)");
        if (!isCancelledRef.current) {
          setError("Request cancelled");
          setCancelled(true);
        }
      } else if (isCancelledRef.current) {
        console.log("[Home] Error occurred but request was cancelled - ignoring");
      } else {
        console.error("[Home] Error during comparison:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }

  async function onViewLibrary(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCancelled(false);
    setResult(null);
    setLibraryResult(null);
    setLibrarySearchQuery("");
    isCancelledRef.current = false;
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      console.log("[Home] Starting library fetch request");
      const res = await fetch(`/api/library?steamid=${encodeURIComponent(singleSteamId)}`, {
        signal
      });
      
      // Check if cancelled before processing response
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted before response - ignoring response");
        return;
      }
      
      const data = (await res.json()) as LibraryResult;
      
      // Check again after parsing
      if (signal.aborted || isCancelledRef.current) {
        console.log("[Home] Request was aborted during response parsing - ignoring data");
        return;
      }
      
      // Double check before updating state
      if (isCancelledRef.current) {
        console.log("[Home] Request was cancelled - not updating state");
        return;
      }
      
      if (!res.ok || (data as any).error) {
        if (!isCancelledRef.current) {
          setError((data as any).error || `Request failed (${res.status})`);
        }
      } else {
        if (!isCancelledRef.current) {
          setLibraryResult(data);
          console.log("[Home] Library fetch completed successfully");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("[Home] Fetch aborted - request cancelled (AbortError caught)");
        if (!isCancelledRef.current) {
          setError("Request cancelled");
          setCancelled(true);
        }
      } else if (isCancelledRef.current) {
        console.log("[Home] Error occurred but request was cancelled - ignoring");
      } else {
        console.error("[Home] Error during library fetch:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Fireworks when user wins */}
      {showFireworks && <Fireworks />}
      
      {/* Hero Header */}
      <header className="text-center flex flex-col gap-4 py-8">
        <div className="inline-block">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#D4B3FF] via-[#B3D9FF] to-[#A8E6CF] bg-clip-text text-transparent mb-2">
            Steam Library Comparator
          </h1>
        </div>
        <p className="text-base sm:text-lg text-[#8B8B8B] max-w-2xl mx-auto">
          Discover shared games, compare playtime, and find your next gaming adventure with friends
        </p>
      </header>

      {/* How it works card */}
      <section aria-labelledby="how" className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5FF]">
        <h2 id="how" className="text-2xl font-semibold mb-4 text-[#5A5A5A]">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8D5FF] text-[#5A5A5A] font-semibold flex items-center justify-center text-sm">1</span>
            <span className="text-sm text-[#8B8B8B] pt-1">Enter a Steam username, SteamID64, or profile URL</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C8E5FF] text-[#5A5A5A] font-semibold flex items-center justify-center text-sm">2</span>
            <span className="text-sm text-[#8B8B8B] pt-1">View your library or compare with a friend's library</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C8F7E5] text-[#5A5A5A] font-semibold flex items-center justify-center text-sm">3</span>
            <span className="text-sm text-[#8B8B8B] pt-1">See all games or shared/unique games with playtime</span>
          </li>
        </ol>
      </section>

      {/* View Library Card */}
      <section id="library" aria-labelledby="library-tool" className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8E5FF]">
        <h2 id="library-tool" className="text-2xl font-semibold mb-4 text-[#5A5A5A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B3D9FF]"></span>
          View My Library
        </h2>
        <form onSubmit={onViewLibrary} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#8B8B8B]">Steam Username or ID</span>
            <input 
              value={singleSteamId} 
              onChange={e => setSingleSteamId(e.target.value)} 
              required 
              className="border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]" 
              placeholder="username or 7656119..." 
            />
          </label>
          <button 
            type="submit" 
            className="h-[52px] px-6 rounded-xl bg-gradient-to-r from-[#A8E6CF] to-[#C8F7E5] text-[#5A5A5A] font-semibold hover:from-[#98D6BF] hover:to-[#B8E7D5] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Loading..." : "View Library"}
          </button>
        </form>
      </section>

      {/* Compare Libraries Card */}
      <section id="compare" aria-labelledby="tool" className="bg-white rounded-2xl p-6 shadow-sm border border-[#FFD5C8]">
        <h2 id="tool" className="text-2xl font-semibold mb-4 text-[#5A5A5A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFC4B3]"></span>
          Compare Libraries
        </h2>
        {!result && (
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium text-[#8B8B8B]">Compare by:</span>
            <div className="flex gap-2 bg-[#F5F0E8] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setCompareBy("playtime")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  compareBy === "playtime"
                    ? "bg-white text-[#5A5A5A] shadow-sm"
                    : "text-[#8B8B8B] hover:text-[#5A5A5A]"
                }`}
              >
                ⏱️ Playtime
              </button>
              <button
                type="button"
                onClick={() => setCompareBy("achievements")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  compareBy === "achievements"
                    ? "bg-white text-[#5A5A5A] shadow-sm"
                    : "text-[#8B8B8B] hover:text-[#5A5A5A]"
                }`}
              >
                🏆 Achievements
              </button>
            </div>
          </div>
        )}
        <form onSubmit={onCompare} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#8B8B8B]">Your SteamID64</span>
            <input 
              value={a} 
              onChange={e => setA(e.target.value)} 
              required 
              className="border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]" 
              placeholder="7656119..." 
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#8B8B8B]">Friend's SteamID64</span>
            <input 
              value={b} 
              onChange={e => setB(e.target.value)} 
              required 
              className="border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]" 
              placeholder="7656119..." 
            />
          </label>
          <button 
            type="submit" 
            className="h-[52px] px-6 rounded-xl bg-gradient-to-r from-[#D4B3FF] to-[#E8D5FF] text-white font-semibold hover:from-[#C4A3EF] hover:to-[#D8C5FF] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </form>

        {/* Example Ad placement above results */}
        {/* Replace adSlotId with your unit id after AdSense approval */}
        {/* <AdSlot adSlotId="0000000000" className="my-2" /> */}

        {loading && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8D5FF]">
            <LoadingSpinner message="This could take a few seconds... We're fetching and comparing game libraries from Steam." />
            <div className="flex flex-col items-center gap-3 mt-6">
              <button
                onClick={stopRequest}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD5C8] to-[#FFC4B3] text-[#5A5A5A] font-semibold hover:from-[#FFC5B8] hover:to-[#FFB4A3] transition-all shadow-sm flex items-center gap-2"
              >
                <span>⏹️</span>
                <span>Stop Comparison</span>
              </button>
              <p className="text-xs text-[#8B8B8B] text-center max-w-md">
                Note: Server-side processing may continue, but the client will ignore the response.
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className={`border-2 rounded-xl p-4 text-sm text-[#5A5A5A] ${
            cancelled 
              ? "bg-[#C8E5FF] border-[#B3D9FF]" 
              : "bg-[#FFD5C8] border-[#FFC4B3]"
          }`}>
            <strong className="text-[#8B8B8B]">
              {cancelled ? "Cancelled:" : "Error:"}
            </strong> {error}
            {cancelled && (
              <p className="mt-2 text-xs text-[#8B8B8B]">
                The request was cancelled. You can start a new comparison when ready.
              </p>
            )}
          </div>
        )}

        {libraryResult && !loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8E5FF]">
            {libraryResult.warning && (
              <div className="bg-[#FFD5C8] border-2 border-[#FFC4B3] rounded-xl p-4 text-sm text-[#5A5A5A] mb-4">
                <strong className="text-[#8B8B8B]">Note:</strong> {libraryResult.warning}
              </div>
            )}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="bg-[#E8D5FF] rounded-lg px-3 py-2">
                <span className="text-[#8B8B8B]">SteamID64:</span> <span className="font-medium text-[#5A5A5A]">{libraryResult.steamId64}</span>
              </div>
              <div className="bg-[#C8E5FF] rounded-lg px-3 py-2">
                <span className="text-[#8B8B8B]">Total games:</span> <span className="font-medium text-[#5A5A5A]">{libraryResult.gameCount}</span>
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-xl font-semibold text-[#5A5A5A]">All Games ({libraryResult.games.length})</h3>
                <input
                  type="text"
                  placeholder="🔍 Search games..."
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  className="text-sm border-2 border-[#E8D5FF] rounded-xl px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]"
                />
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-4 max-h-96 overflow-auto">
                <ul className="grid gap-2">
                  {libraryResult.games
                    .filter(g => 
                      librarySearchQuery === "" || 
                      g.name.toLowerCase().includes(librarySearchQuery.toLowerCase())
                    )
                    .map(g => (
                      <li key={g.appid} className="bg-white rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow border border-[#E8D5FF]">
                        <img 
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/capsule_sm_120.jpg`}
                          alt={g.name}
                          className="w-12 h-12 object-cover rounded border border-[#E8D5FF] flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-sm font-medium text-[#5A5A5A] flex-1">{g.name}</span>
                        <span className="text-xs bg-[#C8F7E5] text-[#5A5A5A] px-2 py-1 rounded-lg font-medium flex-shrink-0">{formatPlaytime(g.playtime_forever)}</span>
                      </li>
                    ))}
                </ul>
                {librarySearchQuery && libraryResult.games.filter(g => 
                  g.name.toLowerCase().includes(librarySearchQuery.toLowerCase())
                ).length === 0 && (
                  <p className="text-sm text-[#8B8B8B] text-center py-4">No games found matching "{librarySearchQuery}"</p>
                )}
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#FFD5C8]">
            {result.warning && (
              <div className="bg-[#FFD5C8] border-2 border-[#FFC4B3] rounded-xl p-4 text-sm text-[#5A5A5A] mb-4">
                <strong className="text-[#8B8B8B]">Note:</strong> {result.warning}
              </div>
            )}
            
            {/* Mode Switcher for Re-comparison */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-[#8B8B8B]">Comparing by:</span>
              <div className="flex gap-2 bg-[#F5F0E8] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    if (compareBy !== "playtime") {
                      reCompareWithMode("playtime");
                    }
                  }}
                  disabled={compareBy === "playtime"}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    compareBy === "playtime"
                      ? "bg-white text-[#5A5A5A] shadow-sm cursor-default"
                      : "text-[#8B8B8B] hover:text-[#5A5A5A] hover:bg-white/50 cursor-pointer"
                  }`}
                >
                  ⏱️ Playtime
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (compareBy !== "achievements") {
                      reCompareWithMode("achievements");
                    }
                  }}
                  disabled={compareBy === "achievements"}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    compareBy === "achievements"
                      ? "bg-white text-[#5A5A5A] shadow-sm cursor-default"
                      : "text-[#8B8B8B] hover:text-[#5A5A5A] hover:bg-white/50 cursor-pointer"
                  }`}
                >
                  🏆 Achievements
                </button>
              </div>
            </div>
            
            {/* Summary Statistics */}
            {(() => {
              // Calculate statistics based on comparison mode
              const totalPlaytimeA = result.overlap.reduce((sum, g) => sum + g.playtimeA, 0);
              const totalPlaytimeB = result.overlap.reduce((sum, g) => sum + g.playtimeB, 0);
              const totalAchievementsA = result.overlap.reduce((sum, g) => sum + (g.achievementA ?? 0), 0);
              const totalAchievementsB = result.overlap.reduce((sum, g) => sum + (g.achievementB ?? 0), 0);
              const gamesWonByA = result.overlap.filter(g => g.winner === "A").length;
              const gamesWonByB = result.overlap.filter(g => g.winner === "B").length;
              const tiedGames = result.overlap.filter(g => g.winner === "tie").length;
              
              // Determine overall winner
              const isAWinner = gamesWonByA > gamesWonByB;
              const isBWinner = gamesWonByB > gamesWonByA;
              const isTie = gamesWonByA === gamesWonByB;
              
              return (
                <div className={`rounded-2xl p-6 mb-6 border-2 ${
                  isAWinner ? "bg-gradient-to-br from-[#C8F7E5] to-[#E8F9F3] border-[#A8E6CF]" :
                  isBWinner ? "bg-gradient-to-br from-[#FFD5C8] to-[#FFE8E0] border-[#FFC4B3]" :
                  "bg-gradient-to-br from-[#E8D5FF] to-[#F0E8FF] border-[#D4B3FF]"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#5A5A5A] flex items-center gap-2">
                      📊 Comparison Summary
                    </h3>
                    {!isTie && (
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border-2 border-[#A8E6CF]">
                        <span className="text-2xl">🎮</span>
                        <span className="font-bold text-[#5A5A5A]">
                          {isAWinner ? "You Win!" : "Friend Wins!"}
                        </span>
                        <span className="text-2xl">👑</span>
                      </div>
                    )}
                    {isTie && (
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border-2 border-[#D4B3FF]">
                        <span className="text-xl">🤝</span>
                        <span className="font-bold text-[#5A5A5A]">It's a Tie!</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Games */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8D5FF]">
                      <div className="text-xs text-[#8B8B8B] mb-1 font-medium">TOTAL GAMES</div>
                      <div className="flex justify-between items-baseline">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#8B8B8B]">You</span>
                          <span className="text-2xl font-bold text-[#5A5A5A]">{result.aCount}</span>
                        </div>
                        <span className="text-lg text-[#8B8B8B]">vs</span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-[#8B8B8B]">Friend</span>
                          <span className="text-2xl font-bold text-[#5A5A5A]">{result.bCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shared Games Winner */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#C8F7E5]">
                      <div className="text-xs text-[#8B8B8B] mb-1 font-medium">SHARED GAMES WON</div>
                      <div className="flex justify-between items-baseline">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#8B8B8B]">You</span>
                          <span className={`text-2xl font-bold ${isAWinner ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                            {gamesWonByA}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-[#8B8B8B]">Tied</span>
                          <span className="text-lg font-medium text-[#8B8B8B]">{tiedGames}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-[#8B8B8B]">Friend</span>
                          <span className={`text-2xl font-bold ${isBWinner ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                            {gamesWonByB}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-center text-[#8B8B8B]">
                        out of {result.overlap.length} shared
                      </div>
                    </div>
                    
                    {/* Total Playtime or Achievements on Shared Games */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#C8E5FF]">
                      <div className="text-xs text-[#8B8B8B] mb-1 font-medium">
                        {compareBy === "playtime" ? "SHARED GAMES PLAYTIME" : "SHARED GAMES ACHIEVEMENTS"}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#8B8B8B]">You</span>
                          {compareBy === "playtime" ? (
                            <span className={`text-sm font-bold ${totalPlaytimeA > totalPlaytimeB ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                              {formatPlaytime(totalPlaytimeA)}
                            </span>
                          ) : (
                            <span className={`text-2xl font-bold ${totalAchievementsA > totalAchievementsB ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                              {totalAchievementsA}
                            </span>
                          )}
                        </div>
                        <span className="text-lg text-[#8B8B8B]">vs</span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-[#8B8B8B]">Friend</span>
                          {compareBy === "playtime" ? (
                            <span className={`text-sm font-bold ${totalPlaytimeB > totalPlaytimeA ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                              {formatPlaytime(totalPlaytimeB)}
                            </span>
                          ) : (
                            <span className={`text-2xl font-bold ${totalAchievementsB > totalAchievementsA ? "text-[#A8E6CF]" : "text-[#5A5A5A]"}`}>
                              {totalAchievementsB}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Winner Declaration */}
                  <div className="mt-4 text-center">
                    {isAWinner && (
                      <p className="text-sm text-[#5A5A5A]">
                        <strong className="text-[#A8E6CF]">🏆 You</strong> have {compareBy === "playtime" ? "more hours played" : "more achievements"} in <strong>{gamesWonByA}</strong> shared games compared to your friend's <strong>{gamesWonByB}</strong>!
                      </p>
                    )}
                    {isBWinner && (
                      <p className="text-sm text-[#5A5A5A]">
                        <strong className="text-[#FFC4B3]">🏆 Your friend</strong> has {compareBy === "playtime" ? "more hours played" : "more achievements"} in <strong>{gamesWonByB}</strong> shared games compared to your <strong>{gamesWonByA}</strong>!
                      </p>
                    )}
                    {isTie && (
                      <p className="text-sm text-[#5A5A5A]">
                        Both of you have won the same number of games (<strong>{gamesWonByA}</strong> each) with <strong>{tiedGames}</strong> tied!
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
            
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-[#E8D5FF] rounded-lg px-3 py-2 text-sm">
                <span className="text-[#8B8B8B]">Your games:</span> <span className="font-semibold text-[#5A5A5A]">{result.aCount}</span>
              </div>
              <div className="bg-[#C8E5FF] rounded-lg px-3 py-2 text-sm">
                <span className="text-[#8B8B8B]">Friend's games:</span> <span className="font-semibold text-[#5A5A5A]">{result.bCount}</span>
              </div>
              <div className="bg-[#C8F7E5] rounded-lg px-3 py-2 text-sm">
                <span className="text-[#8B8B8B]">Shared:</span> <span className="font-semibold text-[#5A5A5A]">{result.overlap.length}</span>
              </div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Search games in all lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-[#F5F0E8] rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-[#5A5A5A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8F7E5]"></span>
                  Shared ({result.overlap.filter(g => 
                    searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})
                </h3>
                <div className="max-h-96 overflow-auto space-y-2">
                  {result.overlap
                    .filter(g => 
                      searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(g => (
                      <div key={g.appid} className="bg-white rounded-lg p-3 border border-[#E8D5FF] hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <img 
                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/capsule_sm_120.jpg`}
                            alt={g.name}
                            className="w-12 h-12 object-cover rounded border border-[#E8D5FF]"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="font-medium text-sm text-[#5A5A5A] flex-1">{g.name}</div>
                        </div>
                        <div className="flex justify-between items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded-lg font-medium ${g.winner === "A" ? "bg-[#C8F7E5] text-[#5A5A5A]" : g.winner === "B" ? "bg-[#FFD5C8] text-[#5A5A5A]" : "bg-[#E8D5FF] text-[#5A5A5A]"}`}>
                            You: {result.compareBy === "achievements" 
                              ? `${g.achievementA ?? 0} achievements`
                              : formatPlaytime(g.playtimeA)
                            }
                          </span>
                          <span className={`px-2 py-1 rounded-lg font-medium ${g.winner === "B" ? "bg-[#C8F7E5] text-[#5A5A5A]" : g.winner === "A" ? "bg-[#FFD5C8] text-[#5A5A5A]" : "bg-[#E8D5FF] text-[#5A5A5A]"}`}>
                            Friend: {result.compareBy === "achievements"
                              ? `${g.achievementB ?? 0} achievements`
                              : formatPlaytime(g.playtimeB)
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  {searchQuery && result.overlap.filter(g => 
                    g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-xs text-[#8B8B8B] text-center py-4">No shared games found</p>
                  )}
                </div>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-[#5A5A5A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8D5FF]"></span>
                  Only You ({result.onlyA.filter(g => 
                    searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})
                </h3>
                <div className="max-h-96 overflow-auto space-y-2">
                  {result.onlyA
                    .filter(g => 
                      searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(g => (
                      <div key={g.appid} className="bg-white rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow border border-[#E8D5FF]">
                        <img 
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/capsule_sm_120.jpg`}
                          alt={g.name}
                          className="w-12 h-12 object-cover rounded border border-[#E8D5FF] flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-sm font-medium text-[#5A5A5A] flex-1">{g.name}</span>
                        <span className="text-xs bg-[#C8F7E5] text-[#5A5A5A] px-2 py-1 rounded-lg font-medium flex-shrink-0">
                          {result.compareBy === "achievements"
                            ? `${g.achievement_count ?? 0} achievements`
                            : formatPlaytime(g.playtime_forever)
                          }
                        </span>
                      </div>
                    ))}
                  {searchQuery && result.onlyA.filter(g => 
                    g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-xs text-[#8B8B8B] text-center py-4">No games found</p>
                  )}
                </div>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-[#5A5A5A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8E5FF]"></span>
                  Only Friend ({result.onlyB.filter(g => 
                    searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})
                </h3>
                <div className="max-h-96 overflow-auto space-y-2">
                  {result.onlyB
                    .filter(g => 
                      searchQuery === "" || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(g => (
                      <div key={g.appid} className="bg-white rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow border border-[#E8D5FF]">
                        <img 
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/capsule_sm_120.jpg`}
                          alt={g.name}
                          className="w-12 h-12 object-cover rounded border border-[#E8D5FF] flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-sm font-medium text-[#5A5A5A] flex-1">{g.name}</span>
                        <span className="text-xs bg-[#C8F7E5] text-[#5A5A5A] px-2 py-1 rounded-lg font-medium flex-shrink-0">
                          {result.compareBy === "achievements"
                            ? `${g.achievement_count ?? 0} achievements`
                            : formatPlaytime(g.playtime_forever)
                          }
                        </span>
                      </div>
                    ))}
                  {searchQuery && result.onlyB.filter(g => 
                    g.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-xs text-[#8B8B8B] text-center py-4">No games found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tips & FAQs Card */}
      <section aria-labelledby="tips" className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8F7E5]">
        <h2 id="tips" className="text-2xl font-semibold mb-4 text-[#5A5A5A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A8E6CF]"></span>
          Tips & FAQs
        </h2>
        <div className="grid gap-3 text-sm text-[#8B8B8B]">
          <div className="flex gap-3 items-start">
            <span className="text-[#D4B3FF] mt-1">💡</span>
            <p>You can use Steam usernames, SteamID64, or profile URLs. Private profiles may return no data.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-[#B3D9FF] mt-1">🔒</span>
            <p>Game details must be set to public in Steam privacy settings for the API to work.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
