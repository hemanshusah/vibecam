import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Privacy Policy — VibeCam',
  description: 'VibeCam Privacy Policy - Our commitment to your data privacy.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-surface pt-32 pb-20">
      <Header />
      <header className="max-w-3xl mx-auto px-6 mb-16">
        <div className="inline-block py-1 px-3 rounded-md border border-border-light font-mono text-[10px] text-accent uppercase tracking-widest mb-6">
          Legal · Privacy
        </div>
        <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="flex flex-wrap gap-6 font-mono text-xs text-muted">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-muted" />
            Effective: 1 April 2025
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-muted" />
            Last updated: 1 April 2025
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-muted" />
            Version 1.0
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {/* TOC */}
        <div className="bg-surface border border-border border-l-4 border-l-accent rounded-xl p-8 mb-16">
          <h2 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-6">Contents</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-none">
            {[
              { id: 's1', text: 'Who we are' },
              { id: 's2', text: 'What data we collect' },
              { id: 's3', text: 'Screen & audio recording' },
              { id: 's4', text: 'How we use your data' },
              { id: 's5', text: 'Payments & billing' },
              { id: 's6', text: 'Data storage & retention' },
              { id: 's7', text: 'Sharing with third parties' },
              { id: 's8', text: 'Cookies & tracking' },
              { id: 's9', text: 'Your rights' },
              { id: 's10', text: 'Children\'s privacy' },
              { id: 's11', text: 'Changes to this policy' },
              { id: 's12', text: 'Contact us' },
            ].map((item, i) => (
              <li key={item.id} className="font-mono text-xs text-muted flex items-start gap-3 group">
                <span className="text-dim">{(i + 1).toString().padStart(2, '0')}.</span>
                <Link href={`#${item.id}`} className="hover:text-accent transition-colors">
                  {item.text}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* Plain English Summary */}
        <div className="bg-accent-dim border border-accent-border rounded-xl p-8 mb-16">
          <h3 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">Plain-English Summary</h3>
          <p className="text-muted leading-relaxed text-sm">
            VibeCam is built on a simple principle: your recordings belong to you. We do not watch, sell, or mine your screen recordings. We only collect what we need to run the service. You can delete your data at any time.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-24">
          <section id="s1" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">01</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Who We Are</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam (&quot;VibeCam&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a browser-based screen recording and sharing service operated as an independent product. Our registered contact address is listed in Section 12.</p>
              <p>This Privacy Policy explains how we collect, use, store, and protect personal information when you use VibeCam at <strong>vibecam.app</strong> and any related subdomains or services.</p>
              <p>By using VibeCam, you agree to the practices described in this policy. If you do not agree, please discontinue use of the Service.</p>
            </div>
          </section>

          <section id="s2" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">02</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">What Data We Collect</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <p>We collect only what is necessary to operate and improve the Service. Here is a full breakdown:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-[13px]">
                  <thead>
                    <tr className="bg-surface text-text font-mono text-[11px] uppercase tracking-wider">
                      <th className="border border-border p-4 text-left">Category</th>
                      <th className="border border-border p-4 text-left">Examples</th>
                      <th className="border border-border p-4 text-left">Why we collect it</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: 'Account data', ex: 'Email address (if you create an account or use "Support Me" payments)', why: 'Authentication, billing, service communications' },
                      { cat: 'Recording metadata', ex: 'Duration, trim points, creation date, file size', why: 'Deliver the sharing feature; storage management' },
                      { cat: 'Recording content', ex: 'Video/audio blob of your screen (and microphone if enabled)', why: 'Storage and delivery of your shared recordings' },
                      { cat: 'Usage data', ex: 'Pages visited, feature interactions, browser type, OS, viewport', why: 'Improve the product; debug errors' },
                      { cat: 'Payment data', ex: 'Transaction ID, amount, currency, billing country', why: 'Process "Support Me" contributions (card details never touch our servers)' },
                      { cat: 'Support data', ex: 'Messages and attachments you send us', why: 'Respond to your enquiries' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                        <td className="border border-border p-4 font-bold text-text">{row.cat}</td>
                        <td className="border border-border p-4">{row.ex}</td>
                        <td className="border border-border p-4">{row.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-syne font-bold text-lg text-text mb-4">Data we do NOT collect</h3>
                <ul className="space-y-2 list-none p-0">
                  {['We do not record or store anything you do not explicitly initiate a recording for.', 'We do not access your camera unless you turn the camera-bubble feature on.', 'We do not collect microphone audio unless you enable "Mic audio" before recording.', 'We do not sell personal data to advertisers or data brokers, ever.', 'We do not build advertising profiles.'].map((item, i) => (
                    <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="s3" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">03</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Screen Recording & Audio Capture</h2>
            <div className="bg-red-dim border border-red/20 rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">Important — Read Before Recording</h3>
              <p className="text-muted leading-relaxed text-sm">When you start a recording, your screen content (and optionally your microphone or camera) is captured. You are responsible for ensuring you have the right to record any content visible on your screen, including content belonging to third parties, confidential business information, or other people&apos;s personal data.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <div>
                <h3 className="font-syne font-bold text-lg text-text mb-2">How recording works technically</h3>
                <p>VibeCam uses the browser&apos;s native <code>getDisplayMedia()</code> and <code>getUserMedia()</code> APIs. These are standard, permission-gated Web APIs. Your browser will always prompt you for explicit permission before any capture begins.</p>
              </div>
              <div>
                <h3 className="font-syne font-bold text-lg text-text mb-4">What we capture</h3>
                <ul className="space-y-3 list-none p-0">
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Screen content:</strong> Exactly what you choose to share in the browser permission dialog.</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>System audio:</strong> Only on Chrome and Edge, and only if you tick &quot;Share system audio&quot;.</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Microphone audio:</strong> Only if you toggle &quot;Mic audio&quot; on in VibeCam.</li>
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Camera:</strong> Only if you toggle &quot;Camera bubble&quot; on.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-syne font-bold text-lg text-text mb-2">Where recordings are stored</h3>
                <p><strong>Version 1 (local):</strong> Recordings are stored in your browser&apos;s local storage. Nothing is sent to our servers unless you click Share.</p>
                <p><strong>Version 2 (cloud sharing):</strong> When you click Share, the recording is uploaded to our cloud storage (Cloudflare R2) so it can be accessed via a shareable link.</p>
              </div>
            </div>
          </section>

          <section id="s4" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">04</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">How We Use Your Data</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <p>We use the data we collect for the following purposes:</p>
              <ul className="space-y-2 list-none p-0">
                {['To operate the Service — storing, delivering, and sharing your recordings.', 'To authenticate you — managing your account via Supabase Auth.', 'To process payments — handling voluntary contributions.', 'To communicate with you — sending transactional emails.', 'To improve the product — analysing aggregated, anonymised usage data.', 'To ensure security — detecting abuse and fraud.', 'To comply with legal obligations.'].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full text-muted">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="s5" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">05</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Payments & &quot;Support Me&quot; Billing</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam offers an optional &quot;Support Me&quot; contribution feature. All payment processing is handled by a third-party payment processor (Stripe). <strong>We never see, store, or process your full card number.</strong></p>
              <p>Contributions are voluntary donations to support the development of VibeCam. As such, they are generally non-refundable. If you believe a transaction was made in error, contact us within 14 days.</p>
            </div>
          </section>

          <section id="s6" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">06</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Data Storage & Retention</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <p>VibeCam&apos;s infrastructure is hosted on <strong>Cloudflare</strong> and <strong>Supabase</strong> with data centres in the US and EU.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-[13px]">
                  <thead>
                    <tr className="bg-surface text-text font-mono text-[11px] uppercase tracking-wider">
                      <th className="border border-border p-4 text-left">Data type</th>
                      <th className="border border-border p-4 text-left">Retained for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Cloud-shared recordings', res: 'Until you delete them, or 90 days after account closure' },
                      { type: 'Local recordings', res: 'Until you clear your browser storage' },
                      { type: 'Account data', res: 'Until you delete your account + 30-day grace period' },
                      { type: 'Payment records', res: '7 years (legal / tax requirement)' },
                      { type: 'Usage analytics', res: '24 months rolling' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                        <td className="border border-border p-4 font-bold text-text">{row.type}</td>
                        <td className="border border-border p-4">{row.res}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="s7" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">07</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Sharing with Third Parties</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>We do not sell your data. We share data only with necessary service providers like <strong>Supabase</strong> (Auth), <strong>Cloudflare</strong> (Storage), and <strong>Stripe</strong> (Payments) solely for the purpose of operating the Service.</p>
              <p>We may disclose data if required by law, court order, or to protect the safety of VibeCam and our users.</p>
            </div>
          </section>

          <section id="s8" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">08</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Cookies & Tracking</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam uses a minimal set of cookies: secure session cookies for authentication and local storage for your capture preferences. We do not use advertising cookies or cross-site tracking pixels.</p>
            </div>
          </section>

          <section id="s9" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">09</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Your Rights</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>Depending on your location (e.g. EEA/UK), you have the right to access, correct, delete, or port your personal data. You may also withdraw consent for processing at any time.</p>
              <p>To exercise these rights, please contact us at the address in Section 12. We respond to all requests within 30 days.</p>
            </div>
          </section>

          <section id="s10" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">10</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Children&apos;s Privacy</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam is not directed at children under 13 (or 16 in the EEA). We do not knowingly collect data from children. If you believe a child has provided data, contact us and we will delete it immediately.</p>
            </div>
          </section>

          <section id="s11" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">11</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Changes to This Policy</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>We may update this policy periodically. Material changes will be highlighted with a revised &quot;Last updated&quot; date and, where appropriate, an email notification.</p>
            </div>
          </section>

          <section id="s12" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">12</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Contact Us</h2>
            <div className="bg-surface border border-border-light rounded-xl p-8">
              <p className="font-syne font-bold text-text mb-2">VibeCam — Privacy Team</p>
              <p className="text-sm text-muted mb-4">Email: <a href="mailto:connect@dazuservices.com" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">connect@dazuservices.com</a></p>
              <p className="text-xs text-dim">Response time: within 5 business days for general enquiries; within 30 days for data subject requests.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
