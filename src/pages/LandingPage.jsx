import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Copyright,
  ExternalLink,
  Globe2,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import logo from '../assets/pilot-pathshala-logo.png';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

const learningStats = [
  { value: 'Free', label: 'online ground classes to begin your journey' },
  { value: '2+', label: 'offline centers active in Nagpur and Ranchi' },
  { value: 'Global', label: 'flying pathways in the USA and Philippines' },
];

const trainingPoints = [
  {
    title: 'DGCA Ground School',
    description: 'Structured preparation for PPL, CPL, and ATPL with exam-focused clarity.',
    icon: GraduationCap,
  },
  {
    title: 'Interactive Learning',
    description: 'Live classes, practice banks, and revision-friendly learning material.',
    icon: BookOpen,
  },
  {
    title: 'Mentorship Support',
    description: 'Guidance from experienced mentors and airline pilots at every stage.',
    icon: Users,
  },
  {
    title: 'Career-Ready Path',
    description: 'Training designed to build confident airline pilots, not just test takers.',
    icon: Target,
  },
];

const pathwaySteps = [
  {
    step: 'Step 1',
    title: 'Build your foundation',
    description: 'Start with accessible DGCA-focused theory classes and concept-first lessons.',
  },
  {
    step: 'Step 2',
    title: 'Practice with purpose',
    description: 'Use question banks, expert sessions, and guided revision to stay exam-ready.',
  },
  {
    step: 'Step 3',
    title: 'Move toward flight training',
    description: 'Continue with strong mentorship and international pathway support when you are ready.',
  },
];

const trustPoints = [
  'Designed for aspirants who need clarity, structure, and affordability.',
  'Blends online learning with offline support and real mentorship.',
  'Built to help students progress from preparation to professional aviation pathways.',
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const mode = searchParams.get('auth');
    if (mode === 'login' || mode === 'register') {
      setAuthMode(mode);
      return;
    }
    setAuthMode(null);
  }, [searchParams]);

  const openAuthModal = (mode) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('auth', mode);
    setSearchParams(nextParams);
  };

  const closeAuthModal = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('auth');
    setSearchParams(nextParams);
    setAuthError('');
    setAuthLoading(false);
  };

  const switchAuthMode = (mode) => {
    setAuthError('');
    openAuthModal(mode);
  };

  const handleSubmit = async (event, source = 'landing') => {
    event.preventDefault();

    try {
      setSubmittingEnquiry(true);
      await apiClient.submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
      window.setTimeout(() => setSubmitted(false), 2500);
    } catch (error) {
      window.alert(error.message || 'Failed to submit enquiry.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');

    if (registerData.password !== registerData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    setAuthLoading(true);

    try {
      await register(registerData.name, registerData.email, registerData.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f7] text-[#131313]">
      <header className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-12">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="Pilot Pathshala" className="h-16 w-auto object-contain" />
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium sm:text-base">
            <a href="#home" className="text-[#ff5a0a] transition hover:opacity-80">
              Home
            </a>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="rounded-full bg-[#ff5a0a] px-6 py-3 text-base font-medium text-white transition hover:bg-[#ea4f04]"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="border-b border-[#ececec] bg-[radial-gradient(circle_at_left,_rgba(255,90,10,0.06),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(255,255,255,0.96)),repeating-radial-gradient(circle_at_center,_rgba(15,23,42,0.05)_0,_rgba(15,23,42,0.05)_2px,_transparent_2px,_transparent_38px)]"
        >
          <div className="mx-auto grid min-h-[780px] max-w-[1600px] gap-16 px-6 py-14 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-20">
            <div className="max-w-2xl">
              <p className="text-xl font-medium text-[#666666] sm:text-2xl">
                Crafted for Curious Minds
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Explore <span className="text-[#ff5a0a]">Pilot</span>
                <br />
                <span className="text-[#ff5a0a]">Pathshala</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-normal leading-[1.6] text-[#5d5d5d] sm:text-xl">
                Turning curiosity into clarity, We have everything that you need to grow
              </p>

              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="mt-8 inline-flex rounded-full bg-[#ff5a0a] px-8 py-3.5 text-lg font-medium text-white transition hover:bg-[#ea4f04]"
              >
                Get Started
              </button>
            </div>

            <div className="rounded-[2rem] border border-[#e8e8e8] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-10">
              <h2 className="text-3xl font-semibold sm:text-4xl">Get in touch</h2>

              {submitted && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Enquiry received. We will get in touch soon.
                </div>
              )}

              <form onSubmit={(event) => handleSubmit(event, 'landing-hero')} className="mt-8 space-y-7">
                <div>
                  <label className="mb-3 block text-base font-medium text-[#545b78] sm:text-lg">
                    Your Name <span className="text-[#ff5a0a]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="Enter your Name"
                    className="w-full rounded-2xl border border-[#e2e5ee] px-5 py-4 text-lg text-[#444] outline-none transition focus:border-[#ff5a0a]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-[#545b78] sm:text-lg">
                    Your Email <span className="text-[#ff5a0a]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-[#e2e5ee] px-5 py-4 text-lg text-[#444] outline-none transition focus:border-[#ff5a0a]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-[#545b78] sm:text-lg">
                    Your Mobile Number <span className="text-[#ff5a0a]">*</span>
                  </label>
                  <div className="flex overflow-hidden rounded-2xl border border-[#d8dde9]">
                    <div className="flex items-center gap-2 border-r border-[#d8dde9] px-4 text-lg text-[#323232]">
                      <span className="text-xl">🇮🇳</span>
                      <span>+91</span>
                      <ChevronDown size={18} />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                      placeholder="074104 10123"
                      className="w-full px-5 py-4 text-lg text-[#444] outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="w-full rounded-full bg-[#ff5a0a] px-6 py-4 text-xl font-medium text-white transition hover:bg-[#ea4f04]"
                >
                  {submittingEnquiry ? 'Submitting...' : 'Submit Enquiry'}
                </button>

                <p className="text-base leading-7 text-[#8c8c8c]">
                  By providing your contact details, You agreed to our{' '}
                  <Link to="/privacy-policy" className="font-medium text-[#ff5a0a]">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms-of-use" className="font-medium text-[#ff5a0a]">
                    Terms of Service
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-24"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,90,10,0.12),transparent_60%)]" />
          <div className="mx-auto max-w-[1280px]">
            <div className="rounded-[2.25rem] border border-[#f3ddd0] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f4_100%)] p-8 shadow-[0_20px_70px_rgba(255,90,10,0.08)] sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd6c1] bg-white px-4 py-2 text-sm font-medium text-[#d85a18]">
                    <BadgeCheck size={18} />
                    Built for future pilots
                  </div>

                  <h2 className="mt-6 max-w-3xl text-4xl  leading-[1.05] tracking-[-0.04em] text-[#151515] sm:text-5xl lg:text-6xl">
                    Professional pilot training, made clear and accessible.
                  </h2>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f657d] sm:text-xl">
                    Learn with a program that is easier to understand, more practical to follow, and
                    designed to help you move from DGCA preparation to real flying opportunities with confidence.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href="#connect"
                      className="inline-flex items-center gap-2 rounded-full bg-[#ff5a0a] px-7 py-3.5 text-base font-medium text-white transition hover:bg-[#ea4f04]"
                    >
                      Talk to our team
                      <ArrowRight size={18} />
                    </a>
                    <button
                      type="button"
                      onClick={() => openAuthModal('register')}
                      className="inline-flex items-center gap-2 rounded-full border border-[#ffd6c1] bg-white px-7 py-3.5 text-base font-medium text-[#cb4f13] transition hover:bg-[#fff2ea]"
                    >
                      Start learning
                    </button>
                  </div>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {learningStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[1.5rem] border border-[#f3e2d7] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)]"
                      >
                        <div className="text-2xl font-semibold text-[#111111]">{stat.value}</div>
                        <p className="mt-2 text-sm leading-6 text-[#6a6f86]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#f2ded2] bg-[#111111] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ffb184]">
                        Why students choose us
                      </p>
                      <h3 className="mt-3 text-3xl leading-tight">
                        A training system that is easier to trust and easier to follow
                      </h3>
                    </div>
                    <ShieldCheck className="mt-1 h-9 w-9 shrink-0 text-[#ff8a4d]" />
                  </div>

                  <div className="mt-8 space-y-4">
                    {trustPoints.map((point) => (
                      <div
                        key={point}
                        className="flex gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4"
                      >
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#ff9d6b]" />
                        <p className="text-base leading-7 text-white/82">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-[#3f3f3f] bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Globe2 className="h-6 w-6 text-[#ff9d6b]" />
                      <p className="text-lg font-medium">International pathway support</p>
                    </div>
                    <p className="mt-3 text-base leading-7 text-white/75">
                      What sets us apart is our in-house flying base access in the USA and Philippines,
                      backed by academic support and mentorship throughout the journey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 grid gap-6 lg:grid-cols-4">
                {trainingPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.title}
                      className="group rounded-[1.7rem] border border-[#f1e2d9] bg-white p-6 shadow-[0_12px_30px_rgba(17,17,17,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(255,90,10,0.12)]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5a0a] transition group-hover:bg-[#ff5a0a] group-hover:text-white">
                        <Icon size={26} />
                      </div>
                      <h3 className="mt-5 text-xl font-medium text-[#151515]">{point.title}</h3>
                      <p className="mt-3 text-base leading-7 text-[#626883]">{point.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#cc6a34]">
                    Learning journey
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-[#141414] sm:text-4xl">
                    Understand the path before you commit to it
                  </h3>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-[#5f657d]">
                    Instead of leaving students overwhelmed, we structure the journey into clear stages so
                    they know what to do first, what to improve next, and where the path leads.
                  </p>
                </div>

                <div className="grid gap-4">
                  {pathwaySteps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[1.5rem] border border-[#f1e2d9] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]"
                    >
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#ff5a0a]">
                        {item.step}
                      </p>
                      <h4 className="mt-2 text-xl font-medium text-[#171717]">{item.title}</h4>
                      <p className="mt-2 text-base leading-7 text-[#626883]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="connect" className="px-6 py-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-[1180px] rounded-[1.8rem] bg-black p-6 text-white sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <h3 className="text-3xl font-semibold">Head Office</h3>
                <div className="mt-8 flex gap-3 text-lg leading-9 text-white/95">
                  <MapPin className="mt-1 h-6 w-6 shrink-0" />
                  <p>Royal Rudra, Income Tax Colony, L-4, Hingna Rd, Rajendra Nagar, Vasudev Nagar, Nagpur, Maharashtra 440036</p>
                </div>

                <h4 className="mt-14 text-2xl font-semibold">Support Enquiries</h4>
                <div className="mt-6 flex items-center gap-3 text-lg text-white/95">
                  <Mail className="h-6 w-6 shrink-0" />
                  <p>mail@pilotpathshala.com</p>
                </div>

                <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/55">
                    Visit our office
                  </p>
                  <p className="mt-4 max-w-md text-base leading-8 text-white/85">
                    Royal Rudra, Income Tax Colony, L-4, Hingna Rd, Rajendra Nagar, Vasudev Nagar,
                    Nagpur, Maharashtra 440036
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Royal%20Rudra%2C%20Income%20Tax%20Colony%2C%20L-4%2C%20Hingna%20Rd%2C%20Rajendra%20Nagar%2C%20Vasudev%20Nagar%2C%20Nagpur%2C%20Maharashtra%20440036"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#111111] transition hover:bg-[#f3f3f3]"
                  >
                    Open in Google Maps
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="rounded-[1.8rem] bg-white p-6 text-[#181818] sm:p-8 lg:p-10">
                <h3 className="text-3xl font-semibold sm:text-4xl">Connect with us</h3>

                <form onSubmit={(event) => handleSubmit(event, 'landing-contact')} className="mt-8 space-y-7">
                  <div>
                    <label className="mb-3 block text-base font-normal sm:text-lg">
                      Your Name <span className="text-[#ff5a0a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-[#d5d5d5] px-5 py-4 text-lg outline-none transition focus:border-[#ff5a0a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-base font-normal sm:text-lg">
                      Your Email <span className="text-[#ff5a0a]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-[#d5d5d5] px-5 py-4 text-lg outline-none transition focus:border-[#ff5a0a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-base font-normal sm:text-lg">
                      Your Mobile Number <span className="text-[#ff5a0a]">*</span>
                    </label>
                    <div className="flex overflow-hidden rounded-2xl border border-[#d5d5d5]">
                      <div className="flex items-center gap-2 border-r border-[#d5d5d5] px-4 text-lg">
                        <span className="text-xl">🇮🇳</span>
                        <span>+91</span>
                        <ChevronDown size={18} />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                        className="w-full px-5 py-4 text-lg outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full rounded-full bg-[#ff5a0a] px-6 py-4 text-xl font-medium text-white transition hover:bg-[#ea4f04]"
                  >
                    {submittingEnquiry ? 'Submitting...' : 'Submit Enquiry'}
                  </button>

                  <p className="text-base leading-7 text-[#959595]">
                    By providing your contact details, You agreed to our{' '}
                    <Link to="/privacy-policy" className="font-medium text-[#ff5a0a]">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link to="/terms-of-use" className="font-medium text-[#ff5a0a]">
                      Terms of Service
                    </Link>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e8e8e8] bg-[#f7f7f7] px-5 pb-8 pt-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col items-center justify-center">
            <img src={logo} alt="Pilot Pathshala logo" className="h-24 w-auto object-contain" />
            <a
              href="https://www.instagram.com/pilot_pathshala?igsh=MWcwa2wwMzMzOTFwMQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="mt-8 text-[#111111] transition hover:text-[#ff5a0a]"
            >
              <Instagram size={34} />
            </a>
          </div>

          <div className="mt-14 flex flex-col gap-8 text-lg text-[#2a2a2a] lg:flex-row lg:items-end lg:justify-between">
            <p className="flex flex-wrap items-center gap-2 leading-8">
              <Copyright size={22} />
              <span>Pilot Pathshala 2026. Designed by</span>
              <span className="font-medium text-[#ff5a0a]">Nrich Learning</span>
              <span>All rights reserved.</span>
            </p>

            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <a href="#certificate" className="transition hover:text-[#ff5a0a]">
                Validate Certificate
              </a>
              <a href="#connect" className="transition hover:text-[#ff5a0a]">
                Contact Us
              </a>
              <Link to="/terms-of-use" className="transition hover:text-[#ff5a0a]">
                Terms of Service
              </Link>
              <Link
                to="/privacy-policy"
                className="transition hover:text-[#ff5a0a]"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/917410410123"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_25px_rgba(37,211,102,0.45)] transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={34} />
      </a>

      {authMode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8">
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute right-4 top-4 rounded-full p-1 text-[#6f6f6f] transition hover:bg-[#f4f4f4] hover:text-[#222]"
              aria-label="Close auth modal"
            >
              <CircleX size={24} />
            </button>

            <h2 className="pr-10 text-2xl font-semibold text-primary-900">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-tertiary_text">
              {authMode === 'login' ? 'Sign in to continue to your dashboard.' : 'Join Pilot Pathshala and start learning.'}
            </p>

            {authError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-primary_text">Email</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-primary_text">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-full bg-[#ff5a0a] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#ea4f04] disabled:opacity-60"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-tertiary_text">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthMode('register')}
                    className="font-medium text-[#ff5a0a]"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-primary_text">Full Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(event) => setRegisterData({ ...registerData, name: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-primary_text">Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary_text">Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary_text">Confirm Password</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(event) => setRegisterData({ ...registerData, confirmPassword: event.target.value })}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-full bg-[#ff5a0a] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#ea4f04] disabled:opacity-60"
                >
                  {authLoading ? 'Creating account...' : 'Sign Up'}
                </button>

                <p className="text-center text-sm text-tertiary_text">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthMode('login')}
                    className="font-semibold text-[#ff5a0a]"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
