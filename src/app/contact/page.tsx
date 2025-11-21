"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Note: This is a client-side only form. For production, you'd want to integrate with a backend service
    // or use a service like Formspree, Netlify Forms, or similar
  };

  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-10 grid gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8D5FF]">
        <h1 className="text-4xl font-bold text-[#5A5A5A] mb-6 bg-gradient-to-r from-[#D4B3FF] via-[#B3D9FF] to-[#A8E6CF] bg-clip-text text-transparent">
          Contact Us
        </h1>
        
        <div className="space-y-6 text-[#5A5A5A]">
          <section>
            <p className="text-base leading-relaxed text-[#8B8B8B] mb-6">
              Have questions, feedback, or need help? We'd love to hear from you! Feel free to reach out using the form below 
              or send us an email directly.
            </p>
          </section>

          <section className="bg-[#F5F0E8] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5A5A5A]">Common Questions</h2>
            <div className="space-y-3 text-sm text-[#8B8B8B]">
              <div>
                <strong className="text-[#5A5A5A]">Q: Why can't I see my friend's games?</strong>
                <p>A: Make sure their Steam profile and game details are set to public in their Steam privacy settings.</p>
              </div>
              <div>
                <strong className="text-[#5A5A5A]">Q: Where do I find my SteamID64?</strong>
                <p>A: Go to your Steam profile, right-click anywhere, select "Copy Page URL". Your ID is in the URL, or use your custom vanity name.</p>
              </div>
              <div>
                <strong className="text-[#5A5A5A]">Q: Is this tool free?</strong>
                <p>A: Yes! Steam Library Comparator is completely free to use.</p>
              </div>
            </div>
          </section>

          {!submitted ? (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#5A5A5A]">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#5A5A5A] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#5A5A5A] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#5A5A5A] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A]"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#5A5A5A] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full border-2 border-[#E8D5FF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4B3FF] focus:border-transparent transition-all text-[#5A5A5A] resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4B3FF] to-[#E8D5FF] text-white font-semibold hover:from-[#C4A3EF] hover:to-[#D8C5FF] transition-all shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </section>
          ) : (
            <section className="bg-gradient-to-br from-[#C8F7E5] to-[#E8F9F3] border-2 border-[#A8E6CF] rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-2xl font-bold text-[#5A5A5A] mb-2">Message Sent!</h2>
              <p className="text-[#8B8B8B] mb-4">
                Thank you for reaching out. We'll get back to you as soon as possible!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#D4B3FF] hover:text-[#C4A3EF] underline text-sm font-medium"
              >
                Send another message
              </button>
            </section>
          )}

          <section className="text-center pt-6 border-t border-[#E8D5FF]">
            <h3 className="text-lg font-semibold text-[#5A5A5A] mb-2">Direct Email</h3>
            <p className="text-[#8B8B8B] mb-3">Prefer email? You can reach us at:</p>
            <a 
              href="mailto:contact@steamcompare.com" 
              className="text-[#D4B3FF] hover:text-[#C4A3EF] font-semibold text-lg underline"
            >
              contact@steamcompare.com
            </a>
            <p className="text-xs text-[#8B8B8B] mt-4">
              We typically respond within 24-48 hours on business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}


