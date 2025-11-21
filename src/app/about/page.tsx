export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 grid gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8D5FF]">
        <h1 className="text-4xl font-bold text-[#5A5A5A] mb-6 bg-gradient-to-r from-[#D4B3FF] via-[#B3D9FF] to-[#A8E6CF] bg-clip-text text-transparent">
          About Steam Library Comparator
        </h1>
        
        <div className="space-y-6 text-[#5A5A5A]">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">What is this tool?</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              Steam Library Comparator is a free web tool that helps you compare your Steam game library with your friends. 
              Discover which games you both own, see exclusive games in each library, and compare playtime or achievements 
              to find out who's the ultimate gamer!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">How does it work?</h2>
            <div className="bg-[#F5F0E8] rounded-xl p-6 space-y-4">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8D5FF] text-[#5A5A5A] font-semibold flex items-center justify-center">1</span>
                <div>
                  <h3 className="font-semibold text-[#5A5A5A] mb-1">Enter Steam Information</h3>
                  <p className="text-sm text-[#8B8B8B]">
                    Provide your Steam username, SteamID64, or profile URL. You can find this in your Steam profile.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C8E5FF] text-[#5A5A5A] font-semibold flex items-center justify-center">2</span>
                <div>
                  <h3 className="font-semibold text-[#5A5A5A] mb-1">Choose Comparison Mode</h3>
                  <p className="text-sm text-[#8B8B8B]">
                    Compare by playtime (hours spent) or achievements (unlocked milestones). You can switch between modes after results are shown.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C8F7E5] text-[#5A5A5A] font-semibold flex items-center justify-center">3</span>
                <div>
                  <h3 className="font-semibold text-[#5A5A5A] mb-1">View Results</h3>
                  <p className="text-sm text-[#8B8B8B]">
                    See shared games, unique games, total counts, and who's winning in playtime or achievements. Results include game thumbnails and sortable lists!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B]">
              <li>🎮 <strong className="text-[#5A5A5A]">Discover Shared Games:</strong> Find games you both own to play together</li>
              <li>⏱️ <strong className="text-[#5A5A5A]">Compare Playtime:</strong> See who has spent more time in each game</li>
              <li>🏆 <strong className="text-[#5A5A5A]">Track Achievements:</strong> Compare achievement progress and unlock counts</li>
              <li>📊 <strong className="text-[#5A5A5A]">Visual Statistics:</strong> Get detailed summaries with winner declarations</li>
              <li>🔍 <strong className="text-[#5A5A5A]">Search Functionality:</strong> Quickly find specific games in large libraries</li>
              <li>🎨 <strong className="text-[#5A5A5A]">Beautiful Interface:</strong> Enjoy a modern, pastel-themed design</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">Why we created this</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              Gaming is better with friends! We built this tool to make it easier for Steam users to discover common games 
              and friendly competition. Whether you're looking for your next co-op adventure or want to prove you're the 
              bigger gamer, Steam Library Comparator has you covered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">Data & Privacy</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              We use the official Steam Web API to fetch publicly available game data. No login required, no data stored permanently, 
              and no modifications to your Steam account. Your privacy matters to us - read our full{' '}
              <a href="/privacy" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">Privacy Policy</a> for details.
            </p>
          </section>

          <section className="bg-[#FFF8F0] rounded-xl p-6 border-l-4 border-[#D4B3FF]">
            <p className="text-sm text-[#8B8B8B]">
              <strong className="text-[#5A5A5A]">Disclaimer:</strong> This site is not affiliated with Valve Corporation or Steam. 
              Steam and the Steam logo are trademarks of Valve Corporation. All game data is retrieved from the public Steam Web API.
            </p>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">Ready to compare?</h2>
            <a 
              href="/" 
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4B3FF] to-[#E8D5FF] text-white font-semibold hover:from-[#C4A3EF] hover:to-[#D8C5FF] transition-all shadow-sm"
            >
              Start Comparing Now
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}


