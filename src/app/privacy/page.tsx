export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 grid gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8D5FF]">
        <h1 className="text-4xl font-bold text-[#5A5A5A] mb-6 bg-gradient-to-r from-[#D4B3FF] via-[#B3D9FF] to-[#A8E6CF] bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-[#5A5A5A]">
          <p className="text-sm text-[#8B8B8B]">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">1. Introduction</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              Welcome to Steam Library Comparator. We respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold mb-2 text-[#5A5A5A]">2.1 Steam Data</h3>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              When you use our Service, we access publicly available data from the Steam Web API, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4 mb-4">
              <li>Steam usernames and SteamID64 numbers you provide</li>
              <li>Public game library information (game titles, app IDs)</li>
              <li>Playtime statistics for games</li>
              <li>Achievement counts and unlock status</li>
              <li>Public profile information</li>
            </ul>
            <p className="text-sm bg-[#FFF8F0] border-l-4 border-[#FFD5C8] p-4 rounded text-[#8B8B8B]">
              <strong className="text-[#5A5A5A]">Important:</strong> We <strong>only</strong> access data that is already publicly 
              available on Steam. If a profile is set to private, we cannot and will not access that data.
            </p>

            <h3 className="text-lg font-semibold mb-2 text-[#5A5A5A] mt-4">2.2 Usage Data</h3>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              We may collect non-personal information about your interaction with our Service, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>IP address (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">3. How We Use Your Information</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li><strong className="text-[#5A5A5A]">Provide the Service:</strong> Display and compare Steam game libraries</li>
              <li><strong className="text-[#5A5A5A]">Improve functionality:</strong> Understand how users interact with our tool</li>
              <li><strong className="text-[#5A5A5A]">Analytics:</strong> Monitor usage patterns to improve user experience</li>
              <li><strong className="text-[#5A5A5A]">Troubleshooting:</strong> Identify and fix technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">4. Data Storage and Security</h2>
            <div className="space-y-3 text-[#8B8B8B]">
              <p>
                <strong className="text-[#5A5A5A]">No Permanent Storage:</strong> We do not store your Steam IDs or game library 
                data in a server-side database. All comparisons are performed on-demand and results are displayed directly to you.
              </p>
              <p>
                <strong className="text-[#5A5A5A]">No Login Required:</strong> We never ask for your Steam login credentials. 
                You do not need to authenticate or connect your Steam account to use our Service.
              </p>
              <p>
                <strong className="text-[#5A5A5A]">HTTPS:</strong> Our website uses HTTPS encryption to protect data transmitted 
                between your browser and our servers.
              </p>
            </div>
          </section>

          <section className="bg-[#F5F0E8] rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">5. Third-Party Services</h2>
            
            <h3 className="text-lg font-semibold mb-2 text-[#5A5A5A]">5.1 Steam Web API</h3>
            <p className="text-sm leading-relaxed text-[#8B8B8B] mb-3">
              This Service uses the official Steam Web API provided by Valve Corporation. When you use our tool, requests are 
              made to Steam's servers to retrieve publicly available data. Please refer to{' '}
              <a 
                href="https://store.steampowered.com/privacy_agreement/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4B3FF] hover:text-[#C4A3EF] underline"
              >
                Steam's Privacy Policy
              </a> for information about how Valve handles data.
            </p>

            <h3 className="text-lg font-semibold mb-2 text-[#5A5A5A]">5.2 Google AdSense</h3>
            <p className="text-sm leading-relaxed text-[#8B8B8B] mb-3">
              We may display advertisements through Google AdSense. Google may use cookies and web beacons to collect information 
              about your visits to this and other websites to provide relevant advertisements. For more information, visit{' '}
              <a 
                href="https://policies.google.com/technologies/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4B3FF] hover:text-[#C4A3EF] underline"
              >
                Google's Advertising & Privacy page
              </a>.
            </p>
            <p className="text-xs text-[#8B8B8B]">
              You can opt out of personalized advertising by visiting{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4B3FF] hover:text-[#C4A3EF] underline"
              >
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">6. Cookies</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              Our Service may use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li><strong className="text-[#5A5A5A]">Essential Cookies:</strong> Required for the Service to function properly</li>
              <li><strong className="text-[#5A5A5A]">Analytics Cookies:</strong> Help us understand how visitors use our Service</li>
              <li><strong className="text-[#5A5A5A]">Advertising Cookies:</strong> Used by third parties like Google AdSense</li>
            </ul>
            <p className="text-sm text-[#8B8B8B] mt-3">
              You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">7. Private Profiles</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              If a Steam profile has game details set to private, the Steam API will return limited or no data. We cannot access 
              private information, and we will display an appropriate message indicating that the profile is private or has no 
              publicly available games.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">8. Children's Privacy</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from 
              children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">9. International Users</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              If you are accessing our Service from outside the United States, please be aware that your information may be 
              transferred to, stored, and processed in the United States or other countries where our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">10. Your Rights (GDPR/CCPA)</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              If you are in the European Union or California, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li>Right to access and receive a copy of your personal data</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to opt-out of the sale of personal information (CCPA)</li>
              <li>Right to data portability</li>
            </ul>
            <p className="text-sm text-[#8B8B8B] mt-3">
              Since we do not permanently store user data, most of these rights are automatically satisfied. For questions, 
              please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">11. Changes to This Privacy Policy</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated 
              "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">12. Contact Us</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, 
              please contact us:
            </p>
            <div className="mt-3 bg-[#F5F0E8] rounded-xl p-4">
              <p className="text-sm text-[#8B8B8B]">
                <strong className="text-[#5A5A5A]">Email:</strong>{' '}
                <a href="mailto:privacy@steamcompare.com" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">
                  privacy@steamcompare.com
                </a>
              </p>
              <p className="text-sm text-[#8B8B8B] mt-2">
                <strong className="text-[#5A5A5A]">Contact Page:</strong>{' '}
                <a href="/contact" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">
                  Visit our Contact page
                </a>
              </p>
            </div>
          </section>

          <section className="bg-[#FFF8F0] rounded-xl p-6 border-l-4 border-[#D4B3FF] text-center">
            <p className="text-sm text-[#8B8B8B]">
              By using Steam Library Comparator, you acknowledge that you have read and understood this Privacy Policy and 
              agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
