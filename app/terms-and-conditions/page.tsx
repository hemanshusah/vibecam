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
              Use VibeCam lawfully. Don&rsquo;t record people without consent where the law requires it. Don&rsquo;t share illegal content. Payments are processed by Razorpay in ₹ INR — they are voluntary contributions, not purchases of a specific service level. Governed by Indian law.
            </p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <h3 className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-3">What&apos;s New in v2.0</h3>
            <p className="text-muted leading-relaxed text-sm">
              Section 5 (Video Editing & Exports) is new. Section 9 updated for <strong>Razorpay (INR)</strong>. Section 10 (Consumer Protection) is new. Section 16 (Governing Law) updated to Indian courts.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-32">
          {/* 01 */}
          <section id="t1" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">01</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Agreement to Terms</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of VibeCam (&ldquo;VibeCam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), including our website, web application, video editor, and any related services (collectively, the &ldquo;Service&rdquo;).</p>
              <p>By accessing or using the Service &mdash; including by recording, editing, exporting, sharing, or watching a VibeCam recording &mdash; you agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-accent underline">Privacy Policy</Link>. If you do not agree, do not use the Service.</p>
              <p>If you use the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms, and that organisation accepts these Terms.</p>
            </div>
          </section>

          {/* 02 */}
          <section id="t2" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">02</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">The Service</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam provides a browser-based screen recording and video editing platform that allows users to:</p>
              <ul className="space-y-4 list-none p-0">
                {[
                  "Capture their screen, browser tab, or application window using native browser APIs",
                  "Optionally capture microphone audio and/or camera video",
                  "Edit recordings using a Remotion-powered timeline editor (trimming, splitting, overlays, zoom effects, blur/redaction, text annotations, speed ramping, intro/outro sequences, audio mixing)",
                  "Export a final rendered MP4 video via cloud rendering",
                  "Generate shareable links to recordings and exports",
                  "Make optional voluntary “Support Me” contributions via Razorpay in INR"
                ].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                ))}
              </ul>
              <p className="pt-4">The Service is provided &ldquo;as is&rdquo; and may be updated, modified, or discontinued at any time. We will make reasonable efforts to provide advance notice of material changes.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">No account required for basic recording (v1)</h3>
              <p>Basic recording and local storage does not require an account. Cloud storage, the Remotion editor, exports, and payment features require an account.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Beta features</h3>
              <p>Features marked &ldquo;beta&rdquo; or &ldquo;coming soon&rdquo; are provided without warranty and may change or be removed at any time.</p>
            </div>
          </section>

          {/* 03 */}
          <section id="t3" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">03</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Eligibility & Accounts</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You must be at least <strong>18 years old</strong> (consistent with Indian majority law under the Indian Majority Act, 1875) to create an account or make a payment. By using the Service you confirm you meet this requirement. For users between 13 and 17, use is permitted only under parental supervision and without making payments.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Account security</h3>
              <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorised access to your account. VibeCam is not liable for any loss arising from unauthorised use of your account where you have failed to keep credentials secure.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Accurate information</h3>
              <p>You agree to provide accurate, current, and complete information when creating an account and making payments, and to keep that information updated. Providing false information (including a false name or address for billing) may result in account suspension.</p>
            </div>
          </section>

          {/* 04 */}
          <section id="t4" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">04</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Screen Recording Rules</h2>
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-3">Critical — Your Legal Responsibility</h3>
              <p className="text-muted leading-relaxed text-sm">Recording other people&rsquo;s screens, calls, or communications without their knowledge or consent may violate Indian law (including Section&nbsp;66E of the IT Act, 2000 and applicable state-level privacy provisions) and the laws of other jurisdictions. You are solely and entirely responsible for ensuring your recordings comply with all applicable laws.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p className="font-bold text-text">You must not use VibeCam to record:</p>
              <ul className="space-y-2 list-none p-0">
                {[
                  "Any person without their knowledge and consent where required by law",
                  "Private communications, phone calls, or video meetings without informing all participants",
                  "Content you do not have the right to capture (e.g. DRM-protected streaming content)",
                  "Personal data of others without a lawful basis under the DPDP Act 2023",
                  "Confidential business information you are not authorised to disclose",
                  "Minors without the explicit consent of their parent or legal guardian"
                ].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 05 */}
          <section id="t5" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">05</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Video Editing & Exports</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>VibeCam&rsquo;s Remotion-powered video editor allows you to edit your recordings using a multi-track timeline. By using the editor, you agree to the following:</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Editing responsibility</h3>
              <p>You are solely responsible for the content of your edited videos, including any text overlays, annotations, zoom effects, blur/redaction choices, intro/outro sequences, and background music you add. VibeCam does not review edited content before export.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Background music and third-party audio</h3>
              <p>If you upload background music or audio to add to your recording, you represent and warrant that you have the necessary rights, licences, or permissions to use that audio in your video.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Exported MP4 files</h3>
              <p>Exported MP4 files are stored on Cloudflare R2 for 90 days from the export date, after which they are automatically deleted. You are responsible for downloading and retaining your own copies.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Render compute</h3>
              <p>Rendering is performed via cloud infrastructure (Remotion Lambda). We reserve the right to limit render duration, resolution, or frequency for fair use controls.</p>
            </div>
          </section>

          {/* 06 */}
          <section id="t6" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">06</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Acceptable Use Policy</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You agree not to use the Service to create, upload, edit, store, or share content that:</p>
              <ul className="space-y-4 list-none p-0">
                {[
                  "Is illegal under applicable Indian law or any other law",
                  "Infringes the copyright, trademark, or IP rights of any third party",
                  "Constitutes child sexual abuse material (CSAM) — violations reported immediately",
                  "Contains malware, ransomware, viruses, or other harmful code",
                  "Harasses, threatens, intimidates, defames, or discriminates against any group",
                  "Constitutes unsolicited bulk communications (spam)",
                  "Impersonates VibeCam or any entity in a misleading manner",
                  "Violates any person’s right to privacy under Indian law",
                  "Promotes religious or communal hatred, or is contrary to national integrity of India",
                  "Constitutes non-consensual intimate imagery (“revenge porn”) — Section 66E/67A IT Act"
                ].map((item, i) => (
                  <li key={i} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 07 */}
          <section id="t7" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">07</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Your Content & Licence</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <h3 className="font-syne font-bold text-text mb-4">You own your recordings and editing projects</h3>
              <p>You retain all ownership rights to recordings you create and editing projects you produce using VibeCam. We do not claim any ownership of your content.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Licence to us</h3>
              <p>By uploading content, you grant VibeCam a limited, non-exclusive, royalty-free, worldwide licence to store, reproduce, process (including render), and transmit your content solely to operate the Service. This licence terminates when you delete the content.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">No use for AI training</h3>
              <p>We do not use your recordings, editing projects, or exported videos to train AI or machine learning models without your explicit consent.</p>
            </div>
          </section>

          {/* 08 */}
          <section id="t8" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">08</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Sharing & Links</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <h3 className="font-syne font-bold text-text mb-4">Your responsibility</h3>
              <p>When you generate a shareable link, you are responsible for who you share it with. VibeCam links are secured with HTTPS but treat them as accessible to anyone who has the URL.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Link availability</h3>
              <p>We do not guarantee permanent availability. Links may become unavailable if content is deleted, accounts suspended, or infra changes. Render exports auto-expire after 90 days.</p>
            </div>
          </section>

          {/* 09 */}
          <section id="t9" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">09</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">“Support Me” Payments via Razorpay</h2>
            <div className="bg-accent-dim border border-accent-border rounded-xl p-8 mb-8">
              <h3 className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2">Payment Processor & Currency</h3>
              <p className="text-muted leading-relaxed text-sm">All payments are processed by <strong>Razorpay Software Private Limited</strong>, a PCI-DSS compliant gateway regulated by the Reserve Bank of India (RBI). All transactions are in <strong>Indian Rupees (₹ INR)</strong>.</p>
            </div>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Nature of payment</h3>
              <p>“Support Me” contributions are entirely voluntary donations to support VibeCam’s development. They do not constitute a purchase of goods or a subscription level.</p>
              <h3 className="font-syne font-bold text-text mt-8 mb-4">Refund and cancellation policy</h3>
              <p>Contributions are generally non-refundable. For technical errors resulting in double payment, email <a href="mailto:support@vibecam.app" className="text-accent underline">support@vibecam.app</a> with your Razorpay Payment ID within 7 days. Refunds take 5–7 business days.</p>
            </div>
          </section>

          {/* 10 */}
          <section id="t10" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">10</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Consumer Protection Rights (India)</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>If you are a consumer under the <strong>Consumer Protection Act, 2019</strong>, nothing in these Terms limits your rights. You have the right to seek redressal through the Consumer Disputes Redressal Commission if you have a grievance.</p>
              <p>You may file a complaint with the National Consumer Helpline (NCH) at 1800-11-4000 or via consumerhelpline.gov.in.</p>
            </div>
          </section>

          {/* 11 */}
          <section id="t11" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">11</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Intellectual Property</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>The VibeCam name, logo, interface design, source code, and Remotion compositions are owned by VibeCam and protected under Indian and international IP laws. You may not reproduce or modify any part of the Service without written permission.</p>
            </div>
          </section>

          {/* 12 */}
          <section id="t12" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">12</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Disclaimer of Warranties</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <div className="bg-surface border border-border-light rounded-xl p-8 mb-8">
                <p className="font-bold text-text pb-2 uppercase text-xs tracking-widest">No Warranty</p>
                <p>The Service is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without any warranty of any kind, express or implied, to the maximum extent permitted by applicable Indian law.</p>
              </div>
            </div>
          </section>

          {/* 13 */}
          <section id="t13" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">13</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Limitation of Liability</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed font-mono text-xs text-muted">
              <p>TO THE MAXIMUM EXTENT PERMITTED BY INDIAN LAW, OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT PAID BY YOU IN THE PRECEDING 12 MONTHS; OR (B) ₹ 500 (FIVE HUNDRED INDIAN RUPEES).</p>
            </div>
          </section>

          {/* 14 */}
          <section id="t14" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">14</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Indemnification</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You agree to defend and indemnify VibeCam against any claims arising out of your recordings, your use of the Service in violation of these Terms, or your infringement of third-party rights.</p>
            </div>
          </section>

          {/* 15 */}
          <section id="t15" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">15</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Termination</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>You may stop using the Service at any time. We reserve the right to suspend or terminate your access if we believe you have violated these Terms or if your activity poses a risk to other users.</p>
            </div>
          </section>

          {/* 16 */}
          <section id="t16" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">16</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Governing Law & Dispute Resolution</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>These Terms are governed by the laws of India. Disputes shall be settled by binding arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong>. The seat and venue of arbitration shall be Kathmandu, Nepal. The language shall be English.</p>
            </div>
          </section>

          {/* 17 */}
          <section id="t17" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">17</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Changes to These Terms</h2>
            <div className="prose prose-invert max-w-none text-muted space-y-4 text-sm leading-relaxed">
              <p>We may update these Terms from time to time. Your continued use after the effective date constitutes acceptance of the revised Terms.</p>
            </div>
          </section>

          {/* 18 */}
          <section id="t18" className="scroll-mt-32">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">18</div>
            <h2 className="font-syne font-bold text-2xl text-text border-b border-border pb-4 mb-8">Contact & Grievance Officer</h2>
            <div className="bg-surface border border-border-light rounded-[32px] p-10">
              <div className="font-syne font-bold text-xl text-text mb-6">Grievance Officer — VibeCam</div>
              <div className="space-y-4 font-mono text-sm leading-relaxed">
                <p className="text-muted">Email: <a href="mailto:grievance@vibecam.app" className="text-accent underline">grievance@vibecam.app</a></p>
                <p className="text-muted">Abuse reports: <a href="mailto:abuse@vibecam.app" className="text-accent underline">abuse@vibecam.app</a></p>
                <p className="text-muted">Legal & DMCA: <a href="mailto:legal@vibecam.app" className="text-accent underline">legal@vibecam.app</a></p>
                <p className="text-muted">Acknowledgement: within 24 hours. Resolution: within 30 days.</p>
              </div>
            </div>
            <p className="mt-8 text-xs text-dim font-mono italic">
              Required under Rule 3(11) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 mt-32 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-[10px] text-dim">&copy; 2025 VibeCam. Governed by the laws of India.</p>
        <div className="flex gap-8 font-mono text-[10px] text-dim uppercase tracking-widest">
          <Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-accent">Terms & Conditions</Link>
        </div>
      </footer>
    </div>
  );
}
