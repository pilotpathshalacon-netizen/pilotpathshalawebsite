import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, ShieldCheck } from 'lucide-react';
import logo from '../assets/pilot-pathshala-logo.png';

const sections = [
  {
    title: '1. Introduction: Why This Policy Matters',
    body: [
      'This Privacy Policy explains how Pilot Pathshala collects, uses, discloses, and protects the information you provide while using our platform. We want you to feel confident about how your data is handled, and this document is designed to make those practices clear.',
      'By using Pilot Pathshala, you agree to the terms of this Privacy Policy. If you do not agree, please refrain from using the platform.',
    ],
  },
  {
    title: '2. Information We Collect',
    body: [
      'We only collect information that is necessary to provide a secure and seamless learning experience.',
    ],
    bullets: [
      'Personal information: name, email address, phone number, user type (student, teacher, institute), location information when required for service access, and optional profile photo.',
      'Course and activity data: courses created, joined, or completed, lesson progress, quizzes, feedback, assignments, and content uploaded or interacted with.',
      'Technical information: device type, browser, operating system, IP address, cookies, usage logs, session timestamps, and interaction history.',
      'Payment information: we do not store your credit or debit card details. Payments are processed securely through trusted third-party providers such as Razorpay.',
    ],
  },
  {
    title: '3. How We Use Your Data',
    body: [
      'We use your information to operate, improve, and secure the platform.',
    ],
    bullets: [
      'Register and manage your account.',
      'Enable course creation, delivery, and access.',
      'Personalize your experience based on your preferences and activity.',
      'Provide support and troubleshoot issues.',
      'Communicate updates, policy changes, and important notifications.',
      'Prevent fraud and maintain platform security.',
      'Improve our services based on user behavior and platform performance.',
      'Create anonymized insights to understand usage patterns and success trends.',
    ],
  },
  {
    title: '4. Information Sharing and Third-Party Access',
    body: [
      'We do not sell or rent your personal information to third parties.',
      'We may share data only in limited situations that are necessary to run the platform or meet legal obligations.',
    ],
    bullets: [
      'With trusted service providers such as payment gateways, hosting providers, and analytics tools, strictly for platform functionality.',
      'When required by law, court order, or a regulatory authority.',
      'During a business transfer such as a merger, acquisition, or restructuring, with prior notice where applicable.',
      'With partners and vendors that are reviewed for compliance with applicable privacy standards, including the GDPR and India data protection requirements where relevant.',
    ],
  },
  {
    title: '5. Data Retention',
    body: [
      'We retain personal information only for as long as needed to provide our services or comply with legal obligations. You may request deletion of your data at any time as described below.',
    ],
  },
  {
    title: '6. Cookies and Tracking Technologies',
    body: [
      'We use cookies and similar technologies to support essential platform functionality and understand engagement.',
    ],
    bullets: [
      'Save your login session.',
      'Understand user behavior and platform engagement.',
      'Deliver more personalized content.',
    ],
    footer:
      'You can disable cookies through your browser settings, but doing so may affect certain platform features.',
  },
  {
    title: '7. Your Rights and Choices',
    body: [
      'You have control over your personal information and may exercise the following rights at any time.',
    ],
    bullets: [
      'Access the information we hold about you.',
      'Request correction of inaccurate data.',
      'Request deletion of your account and personal data.',
      'Withdraw consent where processing is based on consent.',
      'Opt out of non-essential emails and notifications.',
    ],
    footer: 'To exercise any of these rights, contact us at mail@pilotpathshala.com.',
  },
  {
    title: '8. Data Security',
    body: [
      'We take reasonable technical and organizational measures to protect your information.',
    ],
    bullets: [
      'Encrypted storage and communication, including SSL/TLS where applicable.',
      'Secure data centers and restricted access controls.',
      'Regular audits and compliance checks.',
      'Staff training and confidentiality obligations.',
    ],
    footer:
      'If a data breach occurs, we will notify affected users and authorities as required by applicable law.',
  },
  {
    title: '9. Responsibility for Compliance and User-Generated Content',
    body: [
      'You, and any end users you authorize to use Pilot Pathshala, are responsible for ensuring that your use of the platform complies with applicable laws, regulations, and industry standards.',
    ],
    bullets: [
      'Data protection and privacy laws, including India’s Digital Personal Data Protection Act, the GDPR, or comparable regional frameworks where applicable.',
      'Recording and consent laws, including informing participants and obtaining consent before recording audio, video, or screen content when required.',
      'Intellectual property and copyright laws, including restrictions on unauthorized use, reproduction, distribution, or modification of third-party content.',
    ],
    footer:
      'Pilot Pathshala does not control, review, or endorse user-generated content and is not liable for outcomes, disputes, claims, or damages arising from content created, shared, accessed, or used through the platform, to the extent permitted by law. You are responsible for obtaining all rights, permissions, and licenses needed for content you upload or distribute. In the event of a legal or regulatory inquiry or claim related to user-generated content, you agree to indemnify and hold harmless Pilot Pathshala, its affiliates, employees, and partners to the extent permitted by applicable law.',
  },
  {
    title: '10. Children’s Privacy',
    body: [
      'Pilot Pathshala is intended for users aged 13 and above. If we learn that a child under 13 has created an account without verifiable parental consent, we will delete the account and related data.',
    ],
  },
  {
    title: '11. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, platform features, or legal requirements. When we do, we may notify you by email or through a prominent notice on the platform. Please review this page periodically.',
    ],
  },
  {
    title: '12. Contact Us',
    body: [
      'If you have any questions, concerns, or feedback about this Privacy Policy or how we handle your data, please contact us.',
    ],
  },
];

const definitions = [
  'Personal Data: any information that identifies or can be used to identify an individual.',
  'Platform: the Pilot Pathshala LMS, website, and mobile applications.',
  'User: learners, educators, and visitors who access the platform.',
];

export const PrivacyPolicyPage = () => {
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
                <ShieldCheck size={18} />
                Privacy and Data Protection
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b16b45]">
                  Last updated: May 3, 2026
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight text-[#131313] sm:text-5xl">
                  Pilot Pathshala Privacy Policy
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5b5b5b]">
                  At Pilot Pathshala, your privacy and data security are a priority. This page explains
                  what information we collect, how we use it, when we may share it, and the choices you
                  have as a user of our platform.
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
                    {section.body?.map((paragraph) => (
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

                  {section.footer ? (
                    <p className="mt-5 text-base leading-8 text-[#4d4d4d] sm:text-lg">{section.footer}</p>
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-[1.5rem] border border-[#f4e6dd] bg-[#fffdfa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Definitions</h2>
              <ul className="mt-5 space-y-3 text-base leading-8 text-[#4d4d4d] sm:text-lg">
                {definitions.map((definition) => (
                  <li key={definition} className="flex gap-3">
                    <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5a0a]" />
                    <span>{definition}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 rounded-[1.75rem] bg-[#111111] px-6 py-8 text-white sm:px-8">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Your trust matters to us. If you have questions about this policy or want to exercise your
                privacy rights, please reach out directly.
              </p>

              <div className="mt-6 flex flex-col gap-4 text-base sm:text-lg">
                <a
                  href="mailto:mail@pilotpathshala.com"
                  className="inline-flex items-center gap-3 text-white transition hover:text-[#ffb489]"
                >
                  <Mail size={20} />
                  mail@pilotpathshala.com
                </a>
                <a
                  href="tel:8275778257"
                  className="inline-flex items-center gap-3 text-white transition hover:text-[#ffb489]"
                >
                  <Phone size={20} />
                  8275778257
                </a>
              </div>

              <p className="mt-6 text-sm leading-7 text-white/65">
                Final reminder: while we take privacy and security seriously, creators should also take
                proactive measures such as watermarks and branding to help protect their content from
                unauthorized external misuse beyond our technical boundaries.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
