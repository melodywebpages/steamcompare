export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Steam Library Comparator</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free tool to compare Steam game libraries with friends. Discover shared games, 
              compare playtime and achievements, and find your next co-op adventure. No login required, 
              completely free, and respects your privacy.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/report-bug" className="hover:text-white transition-colors">
                  Report a Bug
                </a>
              </li>
              <li>
                <a href="mailto:contact@steamcompare.com" className="hover:text-white transition-colors">
                  Email Support
                </a>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              Response time: 24-48 hours
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Steam Library Comparator. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          {/* Created by section with rotating G clef - DO NOT MODIFY THIS SECTION */}
          <div className="flex items-end justify-center gap-1.5 mt-6">
            <p className="text-sm text-gray-400" style={{ paddingBottom: '0.1px' }}>
              Created with love by <span className="text-white font-semibold">MelodyWebPages</span>
            </p>
            <style>{`
              @keyframes rotate3d {
                0% { transform: perspective(500px) rotateY(0deg); }
                100% { transform: perspective(500px) rotateY(360deg); }
              }
              .gclef-3d {
                animation: rotate3d 4s linear infinite;
                transform-style: preserve-3d;
                filter: drop-shadow(0 3px 6px rgba(249, 115, 22, 0.6));
                display: inline-block;
              }
            `}</style>
            <span 
              className="gclef-3d text-4xl font-bold"
              style={{
                color: '#f97316',
                fontWeight: 900,
                lineHeight: 1
              }}
              aria-label="G Clef"
            >
              𝄞
            </span>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            This site uses cookies for analytics and advertising. By using this site, you agree to our use of cookies.
          </p>
        </div>
      </div>
    </footer>
  );
}

