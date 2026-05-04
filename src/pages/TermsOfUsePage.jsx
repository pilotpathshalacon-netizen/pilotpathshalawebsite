import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Mail } from 'lucide-react';
import logo from '../assets/pilot-pathshala-logo.png';

const sections = [
  {
    title: 'Introduction',
    body: [
      'The day you accept and begin using Pilot Pathshala services or technology is the effective date of this agreement. This agreement is referred to as the Terms of Service, Terms of Use, or Software Services Agreement, and it applies to you personally or to the organization you represent, as applicable.',
      'These terms explain the legal and operational responsibilities between Pilot Pathshala and you as the client, individual, or entity. By clicking "I Agree" or by using Pilot Pathshala services, you formally consent to these terms.',
      'Pilot Pathshala may add new terms or modify existing clauses from time to time. When that happens, we may notify you through your preferred mode of communication within a reasonable time after the update takes effect. Your continued use of the services after such updates are published and communicated will be treated as acceptance of the revised terms.',
    ],
  },
  {
    title: 'Terms of the Agreement',
    body: [
      'You may act on behalf of yourself, a client, or an entity, and Pilot Pathshala represents the company providing the services. These terms govern that relationship.',
      'Pilot Pathshala may revise these terms from time to time and will make reasonable efforts to notify you when material changes take effect.',
    ],
  },
  {
    title: 'License',
    body: [
      'You are granted a limited, non-transferable license to use Pilot Pathshala software and services. This license cannot be assigned, sublicensed, or sold without the company’s express written consent.',
      'If you use the service on a trial basis, you also agree that the company may revoke or discontinue access at any time, including after the trial period ends.',
      'The company may suspend or terminate access immediately, with or without notice, if it determines that the services were used in an unauthorized way or that the company or its services were misrepresented.',
      'The services are provided on an "as is" basis. Your use of Pilot Pathshala may depend on third-party infrastructure such as broadband internet, Wi-Fi, or mobile data services. Interruptions in those channels are not considered defects in the company’s services, and applicable charges may still apply during such disruptions.',
      'You remain responsible for any material, text, display content, or other information you enter, upload, or store through the services. As between you and the company, you are treated as the owner of the information you submit unless otherwise required by law.',
    ],
  },
  {
    title: 'Service Tax and Fees',
    body: [
      'The pricing of Pilot Pathshala services may change in the future. Any free, trial, freemium, or low-cost offering may be modified, discontinued, or replaced without an upgrade path.',
      'If you upgrade from a freemium or trial plan to a paid plan, you will be billed according to the payment term selected at the time of sign-up or upgrade. Payments are charged in advance for the relevant subscription period.',
      'The company may cancel your subscription immediately in the event of a failed payment transaction, including cases involving internet issues, technical glitches, or expired or invalid banking credentials.',
      'Any upgrade or downgrade of a plan usually takes effect after the end of your current subscription period unless stated otherwise.',
    ],
    bullets: [
      'Quoted fees are exclusive of applicable taxes unless explicitly stated otherwise.',
      'Actual charges may vary based on tax laws in the country where services are offered and the country from which the services are subscribed.',
      'Your payment gateway or banking provider may apply separate transaction fees in addition to company fees.',
      'Paid subscriptions are purchased with your full knowledge and consent.',
    ],
  },
  {
    title: 'Payment Authorization and Responsibility',
    body: [
      'You confirm that any payment information or banking credentials provided for a subscription are lawfully yours to use.',
      'You should not use payment credentials when you are not legally permitted to do so. You agree to hold Pilot Pathshala harmless from contractual, legal, or regulatory issues arising from unauthorized use, including use by minors, children under 13, or any other unauthorized person.',
      'If you believe your payment credentials have been misused, you should contact us at mail@pilotpathshala.com. We will take reasonable steps to prevent future use of those credentials on our website or purchase channels from the date of your notice. Payments already completed, however, are not eligible for a refund solely on that basis.',
    ],
  },
  {
    title: 'Data',
    body: [
      'To provide services within the scope of this agreement, the company may store information that you voluntarily enter into its websites, software, or services. This information is held using reasonable safeguards.',
      'For more detail about how we collect, use, and protect data, please refer to our Privacy Policy.',
      'You also agree that the company may use this information to provide a smoother and better user experience across the software and related services.',
      'Internal departments such as research and development, accounting, sales, marketing, and support may access or share relevant data where needed to operate the service.',
      'Your name, address, and other information collected during your subscription period will be used to deliver the services you have selected.',
      'If the company is legally required to disclose personal or non-personal data to a third party or authority, you agree that the company may take reasonable lawful steps to evaluate the request, provide only the information required, and keep you informed where relevant and legally appropriate.',
    ],
  },
  {
    title: 'Confidentiality',
    body: [
      'Any data exchanged between the parties is subject to applicable confidentiality obligations. Information already in the public domain, whether during the subscription term or after cancellation, will not be treated as confidential information.',
      'The company will take reasonable measures to safeguard your data and limit disclosure to employees or departments that do not need access in connection with the service, subscription, or this agreement.',
    ],
  },
  {
    title: 'Inferring Information',
    body: [
      'Pilot Pathshala does not recognize or guarantee the accuracy of conclusions, inferences, or interpretations that you may derive using the subscription. Information made available through the service may originate from external sources and is provided on an "as is" basis.',
      'You expressly agree to hold the company harmless from liability relating to such inferred or externally sourced information, to the extent permitted by applicable law.',
    ],
  },
  {
    title: 'Rights',
    body: [
      'The company owns all rights, title, and interest in its trademarks, intellectual property, patents, and physical or digital assets.',
      'No ownership rights in those company assets are transferred to you as a client or user. Without prior written consent, you may not use, manipulate, reproduce, or falsely represent the company’s physical or digital assets.',
    ],
  },
];

export const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f2_0%,#ffffff_18%,#fffdfb_100%)] text-[#151515]">
      <header className="border-b border-[#f0ded3] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Pilot Pathshala" className="h-14 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#ffd2bb] px-4 py-2 text-sm font-semibold text-[#cc4b0a] transition hover:bg-[#fff2ea]"
          >
            <ChevronLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-[#f3ddd0] bg-white p-8 shadow-[0_16px_40px_rgba(255,90,10,0.08)] sm:p-10 lg:p-14">
            <div className="flex flex-col gap-6 border-b border-[#f5e4db] pb-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff1e8] px-4 py-2 text-sm font-semibold text-[#d35416]">
                <FileText size={18} />
                Legal Terms and Usage
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b16b45]">
                  Last updated: May 4, 2026
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight text-[#131313] sm:text-5xl">
                  Pilot Pathshala Terms of Use
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5b5b5b]">
                  These terms describe the conditions under which you may access and use Pilot Pathshala
                  services, subscriptions, software, and related technology.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-8">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[1.5rem] border border-[#f4e6dd] bg-[#fffdfa] p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">{section.title}</h2>

                  <div className="mt-4 space-y-4 text-base leading-8 text-[#4d4d4d] sm:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets?.length ? (
                    <ul className="mt-5 space-y-3 text-base leading-8 text-[#4d4d4d] sm:text-lg">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5a0a]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-[1.75rem] bg-[#111111] px-6 py-8 text-white sm:px-8">
              <h2 className="text-2xl font-bold">Questions or Clarifications</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                If you have questions about these terms or need clarification about how they apply, please
                contact us directly.
              </p>

              <div className="mt-6 flex flex-col gap-4 text-base sm:text-lg">
                <a
                  href="mailto:mail@pilotpathshala.com"
                  className="inline-flex items-center gap-3 text-white transition hover:text-[#ffb489]"
                >
                  <Mail size={20} />
                  mail@pilotpathshala.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
