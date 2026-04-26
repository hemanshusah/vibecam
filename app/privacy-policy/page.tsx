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
      <header className="max-w-4xl mx-auto px-6 mb-16">
        <div className="inline-block py-1 px-3 rounded-md border border-border-light font-mono text-[10px] text-accent uppercase tracking-widest mb-6">
          Legal · Privacy
        </div>
        <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="flex flex-wrap gap-6 font-mono text-xs text-muted mb-6">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-accent" />
            v2.0 — Updated 26 April 2025
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-muted" />
            Supersedes v1.0 (1 April 2025)
          </span>
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-[10px] text-dim uppercase tracking-wider">
          <span>Governing law: India</span>
          <span>Payments: Razorpay · ₹ INR</span>
          <span>Jurisdiction: India</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {/* TOC */}
        <div className="bg-surface border border-border border-l-4 border-l-accent rounded-xl p-8 mb-16">
          <h2 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-6">Contents</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-none">
            {[
              { id: 's1', text: 'Who we are' },
              { id: 's2', text: 'What data we collect' },
              { id: 's3', text: 'Screen, audio & editing data' },
              { id: 's4', text: 'How we use your data' },
              { id: 's5', text: 'Payments via Razorpay' },
              { id: 's6', text: 'Data storage & retention' },
              { id: 's7', text: 'Third-party sub-processors' },
              { id: 's8', text: 'Cookies & tracking' },
              { id: 's9', text: 'Your rights' },
              { id: 's10', text: 'Children\'s privacy' },
              { id: 's11', text: 'Data security' },
              { id: 's12', text: 'Changes to this policy' },
              { id: 's13', text: 'Grievance officer & contact' },
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

        {/* Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-accent-dim border border-accent-border rounded-xl p-8">
            <h3 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">Plain-English Summary</h3>
            <p className="text-muted leading-relaxed text-sm">
              Your recordings and editing projects belong to you. We do not watch, sell, or train AI on your content. Payments are processed by Razorpay in Indian Rupees (₹) — your card details never touch our servers. You can delete your data at any time.
            </p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <h3 className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-3">What&apos;s New in v2.0</h3>
            <p className="text-muted leading-relaxed text-sm">
              Payment processor updated from Stripe to <strong>Razorpay</strong> (INR). Section 3 covers Remotion video editing. Section 9 reflects <strong>DPDP Act 2023</strong> (India). Governing law updated to India. Grievance Officer added.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          <section id="s1" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">01</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Who We Are</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam (&ldquo;VibeCam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a browser-based screen recording, video editing, and sharing platform operated in India. Contact and Grievance Officer details are in Section 13.</p>
              <p>This Privacy Policy explains how we collect, use, store, share, and protect personal data when you use VibeCam at <strong>vibecam.app</strong> and related subdomains (collectively, the &ldquo;Service&rdquo;).</p>
              <p>By using the Service you agree to the practices described here. If you do not agree, please stop using the Service.</p>
              <h3 className="font-syne font-bold font-lg text-text mt-8 mb-4">Applicable law</h3>
              <p>This policy is governed by the laws of India, including the <strong>Information Technology Act, 2000</strong>, the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&ldquo;SPDI Rules&rdquo;), and the <strong>Digital Personal Data Protection Act, 2023</strong> (&ldquo;DPDP Act&rdquo;).</p>
            </div>
          </section>

          <section id="s2" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">02</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">What Data We Collect</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <p>We collect only what is necessary to operate and improve the Service.</p>
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
                      { cat: 'Account data', ex: 'Email address', why: 'Authentication, billing, transactional emails' },
                      { cat: 'Recording metadata', ex: 'Duration, trim points, cut list, creation date, file size', why: 'Deliver sharing and editing features; storage management' },
                      { cat: 'Recording content', ex: 'Video/audio of your screen, microphone (if enabled), camera (if enabled)', why: 'Store and deliver your recordings' },
                      { cat: 'Editing project data', ex: 'Timeline state, overlay configs, text content, zoom regions, intro/outro settings, audio envelopes', why: 'Save/restore editing sessions; render final video' },
                      { cat: 'Rendered export data', ex: 'Final MP4 file, render job status, resolution, format, duration', why: 'Deliver your exported video' },
                      { cat: 'Usage data', ex: 'Pages visited, feature interactions, browser type, OS, error logs', why: 'Improve the product; debug errors' },
                      { cat: 'Payment data', ex: 'Razorpay Order ID, Payment ID, amount (₹ INR), status, billing email', why: 'Process contributions; financial/tax records' },
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
                <ul className="space-y-2 list-none p-0 text-sm">
                  {[
                    "We never capture your screen without you explicitly starting a recording.",
                    "We never access your microphone unless you enable 'Mic audio'.",
                    "We never access your camera unless you enable 'Camera bubble'.",
                    "We never use your recordings or editing data to train AI or machine learning models.",
                    "We never sell personal data to advertisers, data brokers, or any third party.",
                    "We never build advertising profiles based on your usage."
                  ].map((item, i) => (
                    <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="s3" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">03</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Screen, Audio & Editing Data</h2>
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-3">Your Responsibility</h3>
              <p className="text-muted leading-relaxed text-sm italic">Content captured during a recording may include personal data of third parties. You are solely responsible for ensuring you have the legal right to capture and share that content and that you comply with all applicable recording consent laws.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
              <h3 className="font-syne font-bold font-lg text-text">How recording works technically</h3>
              <p>VibeCam uses the browser&rsquo;s native <code>getDisplayMedia()</code> and <code>getUserMedia()</code> APIs. Your browser always prompts for explicit permission before any capture begins.</p>
              <h3 className="font-syne font-bold font-lg text-text mt-8 mb-4">What we capture</h3>
              <ul className="space-y-2 list-none p-0">
                <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Screen content:</strong> Exactly what you choose to share in the browser permission dialog.</li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>System audio:</strong> Chrome/Edge only, if you tick &ldquo;Share system audio&rdquo;.</li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Microphone audio:</strong> Only if you toggle &ldquo;Mic audio&rdquo; on.</li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full"><strong>Camera:</strong> Only if you toggle &ldquo;Camera bubble&rdquo; on.</li>
              </ul>
              <h3 className="font-syne font-bold font-lg text-text mt-8 mb-4">Video editing data (Remotion Editor)</h3>
              <p>Your editing project is stored as a structured JSON (CompositionProps). This includes timeline clip positions, text overlay content, zoom/blur effects, speed ramp settings, and intro and outro sequence configurations. This data is used solely to operate your editing session and render exports.</p>
            </div>
          </section>

          <section id="s4" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">04</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">How We Use Your Data</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <ul className="space-y-2 list-none p-0">
                {[
                  "To operate the Service — storing, editing, rendering, and sharing.",
                  "To authenticate you — managing your account via Supabase Auth.",
                  "To process payments — handling 'Support Me' contributions via Razorpay in ₹ INR.",
                  "To communicate with you — sending transactional emails.",
                  "To render your exports — passing CompositionProps for video rendering.",
                  "To improve the product — analysing usage data.",
                  "To comply with legal obligations."
                ].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                ))}
              </ul>
              <h3 className="font-syne font-bold font-lg text-text mt-8 mb-4">Legal basis for processing</h3>
              <p>Under the DPDP Act 2023 (India), we process personal data on the basis of your <strong>consent</strong> and <strong>legitimate uses</strong> (security, legal compliance, service delivery).</p>
            </div>
          </section>

          <section id="s5" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">05</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Payments via Razorpay</h2>
            <div className="bg-accent-dim border border-accent-border rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2">Payment Processor</h3>
              <p className="text-muted leading-relaxed text-sm">All payments are processed by <strong>Razorpay Software Private Limited</strong>, a PCI-DSS compliant payment gateway regulated by the Reserve Bank of India (RBI). All transactions are in <strong>Indian Rupees (₹ INR)</strong>.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam stores Order IDs and Payment IDs, but <strong>we never see or store your full card number or private payment credentials.</strong></p>
              <h3 className="font-syne font-bold font-lg text-text mt-8 mb-4">Refund policy</h3>
              <p>&ldquo;Support Me&rdquo; contributions are voluntary donations and are generally non-refundable. Contact support within 7 days if you believe a charge was made in error.</p>
            </div>
          </section>

          <section id="s6" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">06</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Data Storage & Retention</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
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
                      { type: 'Rendered MP4 export files', res: '90 days from render date, or until you delete them' },
                      { type: 'Account data', res: 'Until account deletion + 30-day grace period' },
                      { type: 'Payment records', res: '8 years (Indian tax and accounting law)' },
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

          <section id="s13" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">13</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Grievance Officer & Contact</h2>
            <p className="text-muted text-sm mb-6">As required under Rule 5(9) of the IT Rules 2011 and DPDP Act 2023, we designate a Grievance Officer:</p>
            <div className="bg-surface border border-border-light rounded-[32px] p-10">
              <div className="font-syne font-bold text-xl text-text mb-6">Grievance Officer — VibeCam</div>
              <div className="space-y-4 font-mono text-sm">
                <p className="text-muted">Email: <a href="mailto:grievance@vibecam.app" className="text-accent underline">grievance@vibecam.app</a></p>
                <p className="text-muted">Privacy enquiries: <a href="mailto:privacy@vibecam.app" className="text-accent underline">privacy@vibecam.app</a></p>
                <p className="text-muted">Abuse reports: <a href="mailto:abuse@vibecam.app" className="text-accent underline">abuse@vibecam.app</a></p>
                <p className="mt-8 text-xs text-dim italic underline decoration-dim/30">Complaints are acknowledged within 48 hours and resolved within 30 days.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
