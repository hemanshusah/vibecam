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
      <header className="max-w-3xl mx-auto px-6 mb-16">
        <div className="inline-block py-1 px-3 rounded-md border border-border-light font-mono text-[10px] text-accent uppercase tracking-widest mb-6">
          Legal · Terms
        </div>
        <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">
          Terms & Conditions
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
              { id: 't1', text: 'Agreement to terms' },
              { id: 't2', text: 'The Service' },
              { id: 't3', text: 'Eligibility & accounts' },
              { id: 't4', text: 'Screen recording rules' },
              { id: 't5', text: 'Acceptable use' },
              { id: 't6', text: 'Your content & licence' },
              { id: 't7', text: 'Sharing & links' },
              { id: 't8', text: 'Support Me payments' },
              { id: 't9', text: 'Intellectual property' },
              { id: 't10', text: 'Disclaimer of warranties' },
              { id: 't11', text: 'Limitation of liability' },
              { id: 't12', text: 'Indemnification' },
              { id: 't13', text: 'Termination' },
              { id: 't14', text: 'Governing law' },
              { id: 't15', text: 'Changes to terms' },
              { id: 't16', text: 'Contact' },
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
            Use VibeCam for lawful purposes only. Don&apos;t record people without their knowledge. Don&apos;t share recordings that contain illegal content. Payments are voluntary contributions. We can suspend accounts that break these rules.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-24">
          <section id="t1" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">01</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Agreement to Terms</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of VibeCam (&quot;VibeCam&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), including our website, web application, and any related services.</p>
              <p>By accessing or using the Service you agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">Privacy Policy</Link>.</p>
            </div>
          </section>

          <section id="t2" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">02</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">The Service</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam provides a browser-based screen recording tool that allows users to capture screens, microphone audio, and camera video; trim recordings; and generate shareable links.</p>
              <p>The Service is provided &quot;as is&quot; and may be updated or modified at any time.</p>
            </div>
          </section>

          <section id="t3" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">03</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Eligibility & Accounts</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You must be at least 13 years old (or 16 in the EEA) to use VibeCam. You are responsible for maintaining the confidentiality of your account credentials.</p>
            </div>
          </section>

          <section id="t4" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">04</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Screen Recording Rules</h2>
            <div className="bg-red-dim border border-red/20 rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-red uppercase tracking-widest mb-3">Critical — Your Legal Responsibility</h3>
              <p className="text-muted leading-relaxed text-sm">Recording people without their consent may be illegal. You are solely responsible for ensuring your recordings comply with applicable law.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You must not record people without knowledge and consent, private communications, or content you do not have rights to (e.g. DRM-protected media).</p>
            </div>
          </section>

          <section id="t5" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">05</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Acceptable Use Policy</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You agree not to use the Service for illegal activities, copyright infringement, harassment, or to spread malware. Technical restrictions include no reverse engineering, scraping, or interfering with security features.</p>
            </div>
          </section>

          <section id="t6" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">06</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Your Content & Licence</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You own your recordings. By using the Share feature, you grant us a limited licence solely to store and deliver your recording to your intended recipients.</p>
            </div>
          </section>

          <section id="t7" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">07</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Sharing & Links</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You are responsible for who you share links with. We do not guarantee permanent availability of shared links. Report abusive content to <a href="mailto:connect@dazuservices.com" className="text-accent underline underline-offset-4 tracking-wider">connect@dazuservices.com</a>.</p>
            </div>
          </section>

          <section id="t8" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">08</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">&quot;Support Me&quot; Payments</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>Contributions are voluntary donations to support development. They are generally non-refundable. Payments are handled by Stripe, and we do not store your card details.</p>
            </div>
          </section>

          <section id="t9" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">09</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Intellectual Property</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>The VibeCam name, logo, and interface are protected ownership elements. You grant us a licence to use any feedback you provide for further development without obligation.</p>
            </div>
          </section>

          <section id="t10" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">10</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Disclaimer of Warranties</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>The Service is provided &quot;AS IS&quot; without warranties of any kind. We do not warrant that the Service will be error-free or that recordings will never be lost.</p>
            </div>
          </section>

          <section id="t11" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">11</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Limitation of Liability</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>Our total aggregate liability is limited to the amount you paid us in the last 12 months or £50, whichever is greater.</p>
            </div>
          </section>

          <section id="t12" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">12</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Indemnification</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You agree to indemnify VibeCam against any claims arising from your use of the Service, your recordings, or your violation of these Terms.</p>
            </div>
          </section>

          <section id="t13" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">13</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Termination</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You may stop using the Service anytime. We reserve the right to suspend or terminate access if you violate these Terms.</p>
            </div>
          </section>

          <section id="t14" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">14</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Governing Law</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms are governed by the laws of England and Wales. Informal resolution is encouraged before formal legal proceedings.</p>
            </div>
          </section>

          <section id="t15" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">15</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Changes to Terms</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>We update these Terms periodically. Continued use after changes take effect constitutes acceptance of the revised Terms.</p>
            </div>
          </section>

          <section id="t16" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">16</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Contact</h2>
            <div className="bg-surface border border-border-light rounded-xl p-8">
              <p className="font-syne font-bold text-text mb-2">VibeCam — Legal & Support</p>
              <p className="text-sm text-muted mb-4">Email: <a href="mailto:connect@dazuservices.com" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">connect@dazuservices.com</a></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
