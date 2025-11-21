export default function ReportBug() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Report a Bug</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Found a Bug?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We appreciate you taking the time to report bugs and help us improve Steam Library Comparator. 
              Your feedback helps us make the tool better for everyone!
            </p>
          </section>

          <section className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How to Report a Bug</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Please email us at <a href="mailto:contact@steamcompare.com" className="text-blue-600 hover:text-blue-800 font-semibold">contact@steamcompare.com</a> with the following information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-3 ml-4">
              <li>
                <strong>Description:</strong> Detailed explanation of what went wrong
              </li>
              <li>
                <strong>Steps to Reproduce:</strong> What actions led to the bug?
              </li>
              <li>
                <strong>Expected Behavior:</strong> What should have happened?
              </li>
              <li>
                <strong>Actual Behavior:</strong> What actually happened?
              </li>
              <li>
                <strong>Browser & OS:</strong> Which browser and operating system are you using?
              </li>
              <li>
                <strong>Screenshots:</strong> If applicable, include screenshots showing the issue
              </li>
              <li>
                <strong>SteamIDs Used:</strong> Include the SteamIDs or usernames you were comparing
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Issues</h2>
            <div className="space-y-4">
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Profile Shows No Games / Private Profile Error</h3>
                <p className="text-gray-700">
                  <strong>Solution:</strong> The Steam profile's game details must be set to public. Go to Steam &rarr; Profile &rarr; 
                  Edit Profile &rarr; Privacy Settings &rarr; Set "Game details" to Public. This is the most common issue!
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Comparison Takes Too Long / Times Out</h3>
                <p className="text-gray-700">
                  <strong>Solution:</strong> If comparing achievement mode with users who have 500+ games, it may take 30-60 seconds. 
                  Use the "Stop Comparison" button if needed. Try switching to playtime mode for faster results.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Username Not Found / "No match" Error</h3>
                <p className="text-gray-700">
                  <strong>Solution:</strong> Make sure you're using the correct Steam vanity URL name (the custom name in your profile URL). 
                  If unsure, use your SteamID64 instead (the 17-digit number). You can find it by visiting your Steam profile and 
                  copying the number from the URL.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Achievements Not Showing / Showing 0</h3>
                <p className="text-gray-700">
                  <strong>Solution:</strong> Some games don't have achievements, or achievement data may not be publicly accessible. 
                  The API may also rate-limit achievement requests for users with many games. Try refreshing or using playtime mode instead.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Time</h2>
            <p className="text-gray-700 leading-relaxed">
              We typically respond to bug reports within 24-48 hours during business days. 
              Critical bugs affecting many users will be prioritized.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Want to Suggest a Feature Instead?</h2>
            <p className="text-gray-700 leading-relaxed">
              Have an idea for a new feature? Email us at <a href="mailto:contact@steamcompare.com" className="text-blue-600 hover:text-blue-800 font-semibold">contact@steamcompare.com</a> with 
              your feature request. We love hearing from our users!
            </p>
          </section>
        </div>

        <div className="mt-8">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Steam Library Comparator
          </a>
        </div>
      </div>
    </main>
  );
}

