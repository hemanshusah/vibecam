import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Terms & Conditions — VibeCam',
  description: 'VibeCam Terms and Conditions - The legal agreement for using our service.',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-surface pt-32 pb-20">
      <Header />
      <header className="max-w-4xl mx-auto px-6 mb-16">
        <div className="inline-block py-1 px-3 rounded-md border border-border-light font-mono text-[10px] text-accent uppercase tracking-widest mb-6">
          Legal · Terms
        </div>
        <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">
          Terms & Conditions
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
          <span>Jurisdiction: Indian courts</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {/* TOC */}
        <div className="bg-surface border border-border border-l-4 border-l-accent rounded-xl p-8 mb-16">
          <h2 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-6">Contents</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-none">
            {[
              { id: 't1', text: 'Agreement to terms' },
              { id: 't2', text: 'The Service' },
              { id: 't3', text: 'Eligibility & accounts' },
              { id: 't4', text: 'Screen recording rules' },
              { id: 't5', text: 'Video editing & exports' },
              { id: 't6', text: 'Acceptable use' },
              { id: 't7', text: 'Your content & licence' },
              { id: 't8', text: 'Sharing & links' },
              { id: 't9', text: 'Support Me payments (Razorpay)' },
              { id: 't10', text: 'Consumer protection rights' },
              { id: 't11', text: 'Intellectual property' },
              { id: 't12', text: 'Disclaimer of warranties' },
              { id: 't13', text: 'Limitation of liability' },
              { id: 't14', text: 'Indemnification' },
              { id: 't15', text: 'Termination' },
              { id: 't16', text: 'Governing law & disputes' },
              { id: 't17', text: 'Changes to terms' },
              { id: 't18', text: 'Contact & grievance officer' },
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
              Use VibeCam lawfully. Don&rsquo;t record people without consent. Don&rsquo;t share illegal content. Payments are voluntary contributions via Razorpay (INR). We can suspend accounts that break these rules. Governed by Indian law.
            </p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <h3 className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-3">What&apos;s New in v2.0</h3>
            <p className="text-muted leading-relaxed text-sm">
              Section 5 covers <strong>Video Editing & Exports</strong>. Section 9 updated for <strong>Razorpay (INR)</strong> and Indian consumer law. Section 16 updated to <strong>Indian courts</strong> and Arbitration Act 1996.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          <section id="t1" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">01</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Agreement to Terms</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of VibeCam (&ldquo;VibeCam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), including our website, web application, video editor, and any related services (collectively, the &ldquo;Service&rdquo;).</p>
              <p>By accessing or using the Service you agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-accent underline">Privacy Policy</Link>.</p>
            </div>
          </section>

          <section id="t2" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">02</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">The Service</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed text-sm">
              <p>VibeCam provides a browser-based screen recording and video editing platform that allows users to:</p>
              <ul className="space-y-2 list-none p-0">
                {[
                  "Capture screen, browser tab, or application window",
                  "Optionally capture microphone audio and/or camera video",
                  "Edit recordings using a Remotion-powered timeline editor",
                  "Export a final rendered MP4 video via cloud rendering",
                  "Generate shareable links",
                  "Make voluntary 'Support Me' contributions via Razorpay in INR"
                ].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="t4" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">04</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Screen Recording Rules</h2>
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-3">Critical — Your Legal Responsibility</h3>
              <p className="text-muted leading-relaxed text-sm italic">Recording other people&rsquo;s screens or communications without consent may violate Indian law (Section 66E IT Act, 2000). You are solely responsible for ensuring compliance.</p>
            </div>
          </section>

          <section id="t9" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">09</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">&ldquo;Support Me&rdquo; Payments via Razorpay</h2>
            <div className="bg-accent-dim border border-accent-border rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2">Payment Processor & Currency</h3>
              <p className="text-muted leading-relaxed text-sm">All payments are processed by <strong>Razorpay Software Private Limited</strong>, regulated by the RBI. All transactions are in <strong>Indian Rupees (₹ INR)</strong>.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>Contributions are voluntary donations and generally non-refundable. Refund requests for technical errors can be made within 7 days via <a href="mailto:support@vibecam.app" className="text-accent">support@vibecam.app</a>.</p>
            </div>
          </section>

          <section id="t16" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">16</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Governing Law & Dispute Resolution</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms are governed by the laws of India. Any disputes shall be settled by binding arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong>. The seat of arbitration shall be Kathmandu, Nepal (or as updated).</p>
            </div>
          </section>

          <section id="t18" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">18</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Contact & Grievance Officer</h2>
            <div className="bg-surface border border-border-light rounded-[32px] p-10">
              <div className="font-syne font-bold text-xl text-text mb-6">Grievance Officer — VibeCam</div>
              <div className="space-y-4 font-mono text-sm leading-relaxed">
                <p className="text-muted">Email: <a href="mailto:grievance@vibecam.app" className="text-accent underline">grievance@vibecam.app</a></p>
                <p className="text-muted">Legal & DMCA: <a href="mailto:legal@vibecam.app" className="text-accent underline">legal@vibecam.app</a></p>
                <p className="text-muted">Abuse reports: <a href="mailto:abuse@vibecam.app" className="text-accent underline">abuse@vibecam.app</a></p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
