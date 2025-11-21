export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 grid gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8D5FF]">
        <h1 className="text-4xl font-bold text-[#5A5A5A] mb-6 bg-gradient-to-r from-[#D4B3FF] via-[#B3D9FF] to-[#A8E6CF] bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-[#5A5A5A]">
          <p className="text-sm text-[#8B8B8B]">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">1. Acceptance of Terms</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              By accessing and using Steam Library Comparator ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">2. Description of Service</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              Steam Library Comparator is a free web tool that allows users to compare Steam game libraries using publicly 
              available data from the Steam Web API. The Service provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li>Game library comparisons between Steam accounts</li>
              <li>Playtime and achievement statistics</li>
              <li>Visual representations of shared and unique games</li>
              <li>Search and filtering capabilities</li>
            </ul>
          </section>

          <section className="bg-[#FFF8F0] rounded-xl p-6 border-l-4 border-[#FFD5C8]">
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">3. Important Disclaimers</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#5A5A5A] mb-1">Not Affiliated with Valve or Steam</h3>
                <p className="text-sm leading-relaxed text-[#8B8B8B]">
                  This Service is <strong>not affiliated with, endorsed by, or sponsored by Valve Corporation or Steam</strong>. 
                  Steam and the Steam logo are trademarks of Valve Corporation. All game-related trademarks and copyrights belong 
                  to their respective owners.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#5A5A5A] mb-1">Informational Purposes Only</h3>
                <p className="text-sm leading-relaxed text-[#8B8B8B]">
                  The Service is provided for <strong>informational and entertainment purposes only</strong>. We make no guarantees 
                  about the accuracy, completeness, or timeliness of the data provided.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">4. Data and Privacy</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              All data displayed by the Service is retrieved directly from the public Steam Web API:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li>We only access <strong>publicly available</strong> Steam profile data</li>
              <li>No Steam account login or authentication is required</li>
              <li>We do not store, modify, or transmit your Steam credentials</li>
              <li>Private profiles may return limited or no data</li>
              <li>See our <a href="/privacy" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">Privacy Policy</a> for more details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">5. User Responsibilities</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-3">
              By using the Service, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4">
              <li>Only compare Steam profiles that are publicly accessible</li>
              <li>Respect the privacy settings of other Steam users</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not attempt to interfere with or disrupt the Service</li>
              <li>Comply with all applicable local, state, national, and international laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">6. Limitations and Accuracy</h2>
            <div className="space-y-3 text-[#8B8B8B]">
              <p>
                <strong className="text-[#5A5A5A]">Data Limitations:</strong> The Service relies entirely on the Steam Web API. 
                We cannot control or guarantee the availability, accuracy, or completeness of data provided by Steam.
              </p>
              <p>
                <strong className="text-[#5A5A5A]">Private Profiles:</strong> If a Steam profile's game details are set to private, 
                the Service will not be able to retrieve or display that user's game library.
              </p>
              <p>
                <strong className="text-[#5A5A5A]">Service Availability:</strong> We do not guarantee uninterrupted access to the Service. 
                The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">7. Limitation of Liability</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, STEAM LIBRARY COMPARATOR AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER 
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#8B8B8B] ml-4 mt-3">
              <li>Your use or inability to use the Service</li>
              <li>Any inaccuracy or error in the data provided</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">8. Intellectual Property</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              The design, layout, and functionality of Steam Library Comparator are owned by us and protected by copyright and 
              other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service 
              without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">9. Third-Party Services</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              The Service may display advertisements or contain links to third-party websites or services. We are not responsible 
              for the content, privacy policies, or practices of any third-party services. Your interactions with third parties 
              are solely between you and that third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">10. Changes to Terms</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by 
              updating the "Last Updated" date at the top of this page. Your continued use of the Service after any changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">11. Termination</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              We reserve the right to terminate or suspend access to the Service immediately, without prior notice or liability, 
              for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">12. Governing Law</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to 
              its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-[#5A5A5A]">13. Contact Us</h2>
            <p className="text-base leading-relaxed text-[#8B8B8B]">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="/contact" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">our contact page</a> or via email at{' '}
              <a href="mailto:contact@steamcompare.com" className="text-[#D4B3FF] hover:text-[#C4A3EF] underline">
                contact@steamcompare.com
              </a>.
            </p>
          </section>

          <section className="bg-[#F5F0E8] rounded-xl p-6 text-center">
            <p className="text-sm text-[#8B8B8B]">
              By using Steam Library Comparator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}


