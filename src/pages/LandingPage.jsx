import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CircleX, MessageCircle } from 'lucide-react';

import logo from '../assets/pilot-pathshala-logo.png';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';


const contactTrackOptions = [
  'India Training Pathway',
  'Foreign Training Pathway',
];

const aboutHighlights = [
  {
    icon: 'flight_class',
    title: 'Airline Culture',
    description: 'Immersion in professional standards from day one.',
  },
  {
    icon: 'psychology',
    title: 'Expert Mentors',
    description: 'Guided by aviators with 15+ years of experience.',
  },
  {
    icon: 'model_training',
    title: 'Real Prep',
    description: 'Intense training for PPL, CPL, and ATPL exams.',
  },
  {
    icon: 'safety_check',
    title: 'Aviation Ethics',
    description: 'Discipline and communication in the cockpit.',
  },
];

const pathwaySteps = [
  {
    number: '01',
    icon: 'medical_services',
    title: 'Eligibility & Medicals',
    items: ['10+2 with Physics/Math', 'Minimum 17 Years Old', 'Class 2 Medical Certificate'],
  },
  {
    number: '02',
    icon: 'school',
    title: 'Ground Classes',
    items: ['DGCA Core Subjects', 'RTR & Technical Prep', 'Theory Exams Clearance'],
  },
  {
    number: '03',
    icon: 'connecting_airports',
    title: 'Flight Training',
    items: ['200 Flight Hours', 'Instrument Rating', 'Multi-Engine Experience'],
  },
  {
    number: '04',
    icon: 'verified',
    title: 'Advanced Ratings',
    items: ['Type Rating Support', 'Multi-Engine Rating', 'DGCA Endorsements'],
  },
  {
    number: '05',
    icon: 'work',
    title: 'Job Readiness',
    items: ['Career Mentorship', 'Airline Interview Prep', 'Placement Guidance'],
  },
];

const feeBreakdown = [
  { label: 'Aviation Meteorology', amount: '₹35,000' },
  { label: 'Air Navigation', amount: '₹55,000' },
  { label: 'Radio Telephony (RTR)', amount: '₹40,000' },
  { label: 'Air Regulations', amount: '₹40,000' },
  { label: 'Technical General', amount: '₹50,000' },
];

const packageOptions = [
  {
    title: 'India Track',
    description: 'Full ground school training for cadets staying in India.',
    price: '₹2,20,000',
  },
  {
    title: 'Foreign Track',
    description: 'Course guidance for overseas pilot training programs.',
    price: '₹1,70,000',
  },
];

const galleryImages = [
  '/brochure/4.jpg',
  '/brochure/1.jpg',
  '/brochure/2.jpg',
  '/brochure/3.jpg',
  '/brochure/5.jpg',
];

const galleryVideos = ['video1.mp4', 'video2.mp4'];
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.pilotpathshalanew.app&pcampaignid=web_share';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    track: contactTrackOptions[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    computerNumber: '',
    password: '',
    confirmPassword: '',
    selectedExamCourses: [],
    hasStartedFlyingTraining: null,
    totalFlyingHours: '',
    acceptedTerms: false,
  });

  const keepVideoMuted = (event) => {
    event.currentTarget.muted = true;
    event.currentTarget.volume = 0;
  };

  const normalizeDecimalInput = (value) => {
    const cleaned = String(value || '').replace(/[^0-9.]/g, '');
    if (!cleaned) return '';
    const parts = cleaned.split('.');
    const integerPart = parts[0] || '';
    const fractionalPart = parts.length > 1 ? parts.slice(1).join('') : '';
    if (parts.length === 1) return integerPart;
    if (cleaned.startsWith('.')) return `0.${fractionalPart}`;
    return `${integerPart}.${fractionalPart}`;
  };

  useEffect(() => {
    const mode = searchParams.get('auth');
    if (mode === 'login' || mode === 'register') {
      setAuthMode(mode);
    } else {
      setAuthMode(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  // AUTO-PLAY EFFECT FOR MOBILE CAROUSEL
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (carouselRef.current && window.innerWidth < 768) {
        const nextIndex = activeAppIndex === 0 ? 1 : 0;
        const cardWidth = carouselRef.current.clientWidth * 0.86 + 20; // 86% width + gap
        carouselRef.current.scrollTo({
          left: nextIndex === 0 ? 0 : cardWidth,
          behavior: 'smooth',
        });
        setActiveAppIndex(nextIndex);
      }
    }, 4000); // Switches every 4 seconds

    return () => clearInterval(timer);
  }, [activeAppIndex, isPaused]);

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

  const toggleRegisterCourse = (courseTitle) => {
    setRegisterData((prev) => ({
      ...prev,
      selectedExamCourses: prev.selectedExamCourses.includes(courseTitle)
        ? prev.selectedExamCourses.filter((title) => title !== courseTitle)
        : [...prev.selectedExamCourses, courseTitle],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmittingEnquiry(true);
      await apiClient.submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        track: formData.track,
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', track: contactTrackOptions[0], message: '' });
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
    if (registerData.hasStartedFlyingTraining === null) {
      setAuthError('Please select whether you have started flying training.');
      return;
    }
    if (!registerData.acceptedTerms) {
      setAuthError('Please accept the terms and conditions to continue.');
      return;
    }
    let parsedFlyingHours = null;
    if (registerData.hasStartedFlyingTraining) {
      parsedFlyingHours = Number.parseFloat(String(registerData.totalFlyingHours).trim());
      if (Number.isNaN(parsedFlyingHours)) {
        setAuthError('Please enter total flying hours (for example, 45 or 45.5).');
        return;
      }
      if (parsedFlyingHours < 0 || parsedFlyingHours > 20000) {
        setAuthError('Total flying hours must be between 0 and 20,000.');
        return;
      }
    }
    setAuthLoading(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        computerNumber: registerData.computerNumber.trim() || null,
        selectedExamCourses: registerData.selectedExamCourses,
        hasStartedFlyingTraining: Boolean(registerData.hasStartedFlyingTraining),
        totalFlyingHours: registerData.hasStartedFlyingTraining ? parsedFlyingHours : null,
      });
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]" style={{ fontFamily: 'Montserrat, Hanken Grotesk, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-[#d7d7dc] bg-white/95 backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#000a1e]/5">
          <div className="h-full bg-[#feb316] shadow-[0_0_18px_rgba(254,179,22,0.65)] transition-[width] duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Pilot Pathshala Logo" className="h-11 w-auto object-contain" />
            <span className="hidden sm:inline-block text-base font-semibold uppercase tracking-[0.18em] text-[#1c1b1b]">Pilot Pathshala</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#1c1b1b]">
            <a href="#about" className="transition hover:text-[#feb316]">About</a>
            <a href="#pathway" className="transition hover:text-[#feb316]">Pathway</a>
          
            <a href="#contact" className="transition hover:text-[#feb316]">Contact</a>
            <button type="button" onClick={() => openAuthModal('login')} className="rounded-full bg-[#feb316] px-6 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#1c1b1b] transition hover:bg-[#e4a700]">Login</button>
          </nav>
          <button type="button" onClick={() => openAuthModal('login')} className="inline-flex lg:hidden items-center justify-center rounded-full bg-[#feb316] p-3 text-[#1c1b1b] transition hover:bg-[#e4a700]">
            <span className="material-symbols-outlined text-2xl">login</span>
          </button>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden bg-[#000a1e] text-white">
          <div className="absolute inset-0">
            <img
              src="/hero-pilot-pathshala-ai.png"
              alt="Pilot Pathshala flight training"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000a1e]/80 via-[#000a1e]/46 to-[#000a1e]/18" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-24 md:px-12 lg:py-32">
            <div className="max-w-3xl space-y-8" data-scroll-reveal="hero">
              <span className="inline-flex rounded-full bg-[#feb316] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1c1b1b] shadow-sm">Take Flight Today</span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Become a <span className="text-[#feb316]">Commercial Pilot</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#e6e6e8] sm:text-xl">
                India&apos;s premier aviation academy for aspirants who want world-class mentorship, exam readiness, and real-world simulator training.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button type="button" onClick={() => openAuthModal('register')} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#feb316] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-[#1c1b1b] shadow-lg transition hover:bg-[#e4a700]">
                  Explore Pathway
                  <span className="material-symbols-outlined text-base">flight_takeoff</span>
                </button>
                <button type="button" onClick={() => openAuthModal('register')} className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/20">
                  Start Learning
                  <span className="material-symbols-outlined text-base">school</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 overflow-hidden leading-[0]">
            <svg viewBox="0 0 1440 120" className="h-[120px] w-full" preserveAspectRatio="none">
              <path d="M0,0 C320,120 760,0 1440,100 L1440,120 L0,120 Z" fill="#fcf9f8" />
            </svg>
          </div>
        </section>

        <section id="about" className="bg-[#fcf9f8] py-[100px]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white bg-[#000a1e] shadow-[0_30px_80px_rgba(0,10,30,0.15)]" data-scroll-reveal>
                <img
                  src="/brochure/3.jpg"
                  alt="Pilot Pathshala cadet group"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-8" data-scroll-reveal>
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#feb316]">Our vision</p>
                  <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#1c1b1b] sm:text-5xl">Beyond Academics: Creating Industry-Ready Aviators</h2>
                  <p className="max-w-xl text-lg leading-8 text-[#44474e]">
                    Pilot Pathshala is a premier pilot training institute built with a vision to create highly skilled, knowledgeable, and industry-ready aviators for the future of aviation.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {aboutHighlights.map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-3xl border border-[#e5e5e5] bg-white p-6 shadow-sm" data-scroll-reveal>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#000a1e] text-[#feb316]">
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#1c1b1b]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#5f6670]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f7f7] py-[100px]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8" data-scroll-reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#feb316]">Digital Excellence</p>
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#1c1b1b] sm:text-5xl">Learn Anywhere, Anytime with our E-Learning Portal</h2>
                <p className="max-w-xl text-lg leading-8 text-[#44474e]">
                  Access comprehensive ground school materials, recorded lectures, and interactive mock exams from the comfort of your home.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Recorded Sessions', description: 'Replay expert-led classes at your own pace.' },
                    { title: 'Online Question Bank', description: 'Practice with thousands of DGCA-pattern mock questions.' },
                    { title: 'Digital Study Material', description: 'Instant access to curated aviation manuals and notes.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border border-[#e5e5e5] bg-white p-6 shadow-sm" data-scroll-reveal>
                      <h3 className="text-base font-semibold text-[#1c1b1b]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#5f6670]">{item.description}</p>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => openAuthModal('register')} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#000a1e] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-[#262a33]">
                  Start Learning
                </button>
              </div>
              
              {/* MOBILE CAROUSEL UPDATED SECTION (AUTO-PLAY + TOUCH SUPPORT) */}
              <div className="relative" data-scroll-reveal>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(254,179,22,0.22),transparent_36%)]" />
                <div
                  ref={carouselRef}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setTimeout(() => setIsPaused(false), 5000)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onScroll={(e) => {
                    const { scrollLeft, clientWidth } = e.currentTarget;
                    const index = Math.round(scrollLeft / (clientWidth * 0.8));
                    if (index !== activeAppIndex && index >= 0 && index <= 1) {
                      setActiveAppIndex(index);
                    }
                  }}
                  className="relative flex w-full gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 scroll-smooth md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:pt-0 md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {[
                    {
                      platform: 'iPhone',
                      eyebrow: 'Get it on',
                      store: 'App Store',
                      href: null,
                      icon: 'phone_iphone',
                      device: 'ios',
                      badgeIcon: 'amp_stories',
                      screenClass: 'from-[#f9fafb] via-[#dfe8ff] to-[#feb316]/40',
                    },
                    {
                      platform: 'Android',
                      eyebrow: 'Get it on',
                      store: 'Google Play',
                      href: playStoreUrl,
                      icon: 'android',
                      device: 'android',
                      badgeIcon: 'shop',
                      screenClass: 'from-[#f8fbf7] via-[#dff5e8] to-[#feb316]/35',
                    },
                  ].map((item) => (
                    <div key={item.platform} className="flex min-h-[30rem] w-[86%] sm:w-[350px] shrink-0 snap-center flex-col justify-between rounded-[1.75rem] border border-white/10 bg-[#111a2b] p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] md:w-auto md:shrink md:snap-align-none">
                      <div className={`relative mx-auto h-[21rem] w-full max-w-[12.25rem] rounded-[2.35rem] bg-[#0b1220] p-[0.65rem] shadow-[0_24px_55px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.12)] ${item.device === 'ios' ? 'border-[5px] border-[#202938]' : 'border-[4px] border-[#151c2a]'}`}>
                        <span className="absolute -left-[0.45rem] top-[4.5rem] h-8 w-1 rounded-l-full bg-[#2a3446]" />
                        <span className="absolute -left-[0.45rem] top-[7.1rem] h-12 w-1 rounded-l-full bg-[#2a3446]" />
                        <span className="absolute -right-[0.45rem] top-[6rem] h-14 w-1 rounded-r-full bg-[#2a3446]" />
                        <div className={`relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br ${item.screenClass} p-4 text-[#000a1e] shadow-[inset_0_0_28px_rgba(0,10,30,0.1)] ${item.device === 'ios' ? 'rounded-[1.75rem]' : 'rounded-[1.45rem]'}`}>
                          {item.device === 'ios' ? (
                            <div className="absolute left-1/2 top-2 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-[#030917] shadow-sm">
                              <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#1f2937]" />
                            </div>
                          ) : (
                            <>
                              <span className="absolute left-1/2 top-3 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#0b1220]/25" />
                              <span className="absolute right-5 top-4 z-10 h-2.5 w-2.5 rounded-full border border-white/70 bg-[#030917]" />
                            </>
                          )}
                          <div>
                            <div className="mt-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#000a1e] text-[#feb316]">
                              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#5f6670]">Pilot Pathshala</p>
                            <h3 className="mt-2 text-2xl font-black leading-tight">{item.platform} App</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 rounded-full bg-[#000a1e]/20" />
                            <div className="h-2 w-3/4 rounded-full bg-[#000a1e]/15" />
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <span className="h-10 rounded-xl bg-white/60" />
                              <span className="h-10 rounded-xl bg-white/60" />
                              <span className="h-10 rounded-xl bg-white/60" />
                            </div>
                            {item.device === 'ios' ? (
                              <span className="mx-auto mt-3 block h-1 w-20 rounded-full bg-[#000a1e]/35" />
                            ) : (
                              <div className="mx-auto mt-3 flex w-24 items-center justify-center gap-4 text-[#000a1e]/35">
                                <span className="h-2 w-2 rounded-full border border-current" />
                                <span className="h-1 w-8 rounded-full bg-current" />
                                <span className="h-2 w-2 rotate-45 border-b border-r border-current" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#feb316] px-5 py-4 text-left text-[#1c1b1b] shadow-lg transition hover:bg-[#e4a700]">
                          <span className="material-symbols-outlined text-3xl">{item.badgeIcon}</span>
                          <span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1b1b]/70">{item.eyebrow}</span>
                            <span className="block text-lg font-black leading-tight">{item.store}</span>
                          </span>
                        </a>
                      ) : (
                        <button type="button" disabled className="mt-6 inline-flex w-full cursor-not-allowed items-center gap-4 rounded-2xl border border-white/10 bg-[#111a2b] px-5 py-4 text-left text-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                          <span className="material-symbols-outlined text-3xl">{item.badgeIcon}</span>
                          <span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{item.eyebrow}</span>
                            <span className="block text-lg font-black leading-tight text-white/80">{item.store}</span>
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Carousel Indicators */}
                <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
                  {[0, 1].map((idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        if (carouselRef.current) {
                          const cardWidth = carouselRef.current.clientWidth * 0.86 + 20;
                          carouselRef.current.scrollTo({ left: idx === 0 ? 0 : cardWidth, behavior: 'smooth' });
                          setActiveAppIndex(idx);
                        }
                      }}
                      className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                        activeAppIndex === idx ? 'w-6 bg-[#000a1e]' : 'w-2 bg-[#000a1e]/25'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* END OF UPDATED SECTION */}

            </div>
          </div>
        </section>

        <section id="pathway" className="bg-[#fcf9f8] py-[100px]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center mb-16" data-scroll-reveal>
              <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#1c1b1b] sm:text-5xl">Your Roadmap to the Skies</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#44474e]">
                A structured path regulated by the DGCA India for becoming a Commercial Pilot.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-5">
              {pathwaySteps.map((step) => (
                <div key={step.number} className="relative overflow-hidden rounded-[2rem] border border-[#e5e5e5] bg-white p-8 text-center shadow-sm" data-scroll-reveal>
                  <div className="absolute right-6 top-6 text-[4.5rem] font-black text-[#000a1e]/10">
                    {step.number}
                  </div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#feb316]/10 text-[#feb316] text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-base font-semibold text-[#1c1b1b]">{step.title}</h3>
                  <div className="mt-5 space-y-2 text-sm leading-6 text-[#5f6670]">
                    {step.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0c1831] py-[70px] text-white">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center mb-16" data-scroll-reveal>
              <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Students Become Family</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#c6c9d9]">Life at the academy is more than just learning; it&apos;s about building a brotherhood of aviators.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[10rem]">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.22)] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <img src={galleryImages[0]} alt="Student life cockpit" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>

              <div className="aspect-video overflow-hidden rounded-3xl shadow-[0_22px_60px_rgba(0,0,0,0.18)] md:aspect-[4/3] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <video
                  src={`/videos/${galleryVideos[0]}`}
                  controls
                  muted
                  defaultMuted
                  onPlay={keepVideoMuted}
                  onVolumeChange={keepVideoMuted}
                  className="h-full w-full object-cover bg-black"
                />
              </div>

              <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <img src={galleryImages[1]} alt="Student life two" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>

              <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <img src={galleryImages[2]} alt="Pilot Pathshala cadets on the ramp" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>

              <div className="aspect-video overflow-hidden rounded-3xl bg-[#09122f] shadow-[0_22px_60px_rgba(0,0,0,0.2)] md:aspect-[4/3] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <video
                  src={`/videos/${galleryVideos[1]}`}
                  controls
                  muted
                  defaultMuted
                  onPlay={keepVideoMuted}
                  onVolumeChange={keepVideoMuted}
                  className="h-full w-full object-cover bg-black"
                />
              </div>

              <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] lg:col-span-4 lg:row-span-2 lg:aspect-auto" data-scroll-reveal>
                <img src={galleryImages[4]} alt="Student life five" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#fcf9f8] py-[90px]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="max-w-xl space-y-6" data-scroll-reveal>
                <span className="text-[#feb316] text-[12px] font-bold uppercase tracking-[0.24em]">Get in touch</span>
                <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#1c1b1b] sm:text-5xl">Small team. Big results.</h2>
                <p className="max-w-xl text-lg leading-8 text-[#44474e]">
                  Send a quick enquiry and our admissions team will contact you with the fastest next step.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm" data-scroll-reveal>
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-3xl text-[#feb316]">location_on</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1b1b]">Nagpur campus</p>
                        <p className="mt-2 text-sm leading-6 text-[#5f6670]">402, Royal Rudra, Vasudev Nagar, Hingna Road</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm" data-scroll-reveal>
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-3xl text-[#feb316]">call</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1b1b]">Admissions line</p>
                        <p className="mt-2 text-sm leading-6 text-[#5f6670]">+91 76201 57166</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm sm:col-span-2" data-scroll-reveal>
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-3xl text-[#feb316]">mail</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1b1b]">Email support</p>
                        <p className="mt-2 text-sm leading-6 text-[#5f6670]">mail@pilotpathshala.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#e5e5e5] bg-white p-8 shadow-sm" data-scroll-reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#feb316]">Quick enquiry</p>
                <h3 className="mt-4 text-2xl font-semibold text-[#1c1b1b]">Start your training in minutes</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6670]">Fill the form and our team will help you choose the right pathway.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-[#1c1b1b]">
                      Full Name
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                        required
                        className="mt-2 w-full rounded-2xl border border-[#c4c6cf] bg-[#fcf9f8] px-4 py-3 text-sm outline-none transition focus:border-[#feb316]"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-[#1c1b1b]">
                      Email Address
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                        required
                        className="mt-2 w-full rounded-2xl border border-[#c4c6cf] bg-[#fcf9f8] px-4 py-3 text-sm outline-none transition focus:border-[#feb316]"
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-[#1c1b1b]">
                      Phone Number
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                        required
                        className="mt-2 w-full rounded-2xl border border-[#c4c6cf] bg-[#fcf9f8] px-4 py-3 text-sm outline-none transition focus:border-[#feb316]"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-[#1c1b1b]">
                      Interested Track
                      <select
                        value={formData.track}
                        onChange={(event) => setFormData({ ...formData, track: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-[#c4c6cf] bg-[#fcf9f8] px-4 py-3 text-sm outline-none transition focus:border-[#feb316]"
                      >
                        {contactTrackOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-[#1c1b1b]">
                    Message
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-[#c4c6cf] bg-[#fcf9f8] px-4 py-3 text-sm outline-none transition focus:border-[#feb316]"
                      placeholder="Tell us what you would like to learn next"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submittingEnquiry || submitted}
                    className="w-full rounded-2xl bg-[#feb316] px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-[#1c1b1b] transition hover:bg-[#e4a700] disabled:opacity-60"
                  >
                    {submitted ? 'Sent' : submittingEnquiry ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  {submitted && <p className="text-sm text-[#1c1b1b]/80">Thanks! We will contact you shortly.</p>}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#000a1e] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Pilot Pathshala" className="h-14 w-auto object-contain" />
              <span className="text-xl font-semibold uppercase tracking-[0.12em]">Pilot Pathshala</span>
            </div>
            <p className="mt-8 max-w-lg text-sm leading-7 text-white/70">
              Empowering the next generation of pilots with practical training, exam readiness, and the confidence to succeed in Indian aviation.
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#feb316]">Quick Links</h5>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#pathway" className="transition hover:text-white">Pathway</a></li>
              <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#feb316]">Download App</h5>
            <div className="mt-6 flex flex-col gap-4">
              <a href={playStoreUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white transition hover:bg-white/20">
                <span className="material-symbols-outlined text-3xl">shop</span>
                <div className="text-sm">
                  <div className="uppercase tracking-[0.18em] text-white/60">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
              <button type="button" disabled className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white/55">
                <span className="material-symbols-outlined text-3xl">amp_stories</span>
                <div className="text-sm">
                  <div className="uppercase tracking-[0.18em] text-white/60">Download on</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 px-6 pt-8 text-sm text-white/60 md:px-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© 2024 Pilot Pathshala. India&apos;s Pathway To The Skies. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="transition hover:text-white">Privacy Policy</a>
            <a href="#" className="transition hover:text-white">Terms of Service</a>
            <a href="#" className="transition hover:text-white">Refund Policy</a>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/917410410123"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_25px_rgba(37,211,102,0.45)] transition hover:scale-105"
        aria-label="WhatsApp chat"
      >
        <MessageCircle size={34} />
      </a>

      {authMode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8">
            <button type="button" onClick={closeAuthModal} className="absolute right-4 top-4 rounded-full p-1 text-[#6f6f6f] transition hover:bg-[#f4f4f4] hover:text-[#222]" aria-label="Close auth modal">
              <CircleX size={24} />
            </button>
            <h2 className="pr-10 text-2xl font-semibold text-[#1c1b1b]">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              {authMode === 'login' ? 'Sign in to continue to your dashboard.' : 'Join Pilot Pathshala and start learning.'}
            </p>

            {authError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{authError}</div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-[#374151]">
                  Email
                  <input type="email" value={loginData.email} onChange={(event) => setLoginData({ ...loginData, email: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="you@example.com" />
                </label>
                <label className="block text-sm font-medium text-[#374151]">
                  Password
                  <input type="password" value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="••••••••" />
                </label>
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    onClick={() => {
                      setAuthError('');
                      setAuthLoading(false);
                      setAuthMode(null);
                    }}
                    className="text-sm font-medium text-[#feb316] hover:text-[#e4a700]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button type="submit" disabled={authLoading} className="w-full rounded-full bg-[#feb316] px-6 py-3.5 text-base font-medium text-[#1c1b1b] transition hover:bg-[#e4a700] disabled:opacity-60">{authLoading ? 'Signing in...' : 'Sign In'}</button>
                <p className="text-center text-sm text-[#6b7280]">Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => switchAuthMode('register')} className="font-medium text-[#feb316]">Sign up</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-[#374151]">
                  Full Name
                  <input type="text" value={registerData.name} onChange={(event) => setRegisterData({ ...registerData, name: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="John Doe" />
                </label>
                <label className="block text-sm font-medium text-[#374151]">
                  Email
                  <input type="email" value={registerData.email} onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="you@example.com" />
                </label>
                <label className="block text-sm font-medium text-[#374151]">
                  Password
                  <input type="password" value={registerData.password} onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="••••••••" />
                </label>
                <label className="block text-sm font-medium text-[#374151]">
                  Confirm Password
                  <input type="password" value={registerData.confirmPassword} onChange={(event) => setRegisterData({ ...registerData, confirmPassword: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="••••••••" />
                </label>
                <div className="space-y-3 rounded-2xl border border-[#d1d5db] bg-[#fafafa] p-4">
                  <p className="text-sm font-medium text-[#374151]">Exams Given <span className="text-[#9ca3af]">(optional)</span></p>
                  {['PPL', 'CPL', 'ATPL'].map((courseTitle) => {
                    const selected = registerData.selectedExamCourses.includes(courseTitle);
                    return (
                      <button type="button" key={courseTitle} onClick={() => toggleRegisterCourse(courseTitle)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selected ? 'border-[#feb316] bg-[#fff2d6]' : 'border-[#e5e7eb] bg-white hover:border-[#feb316]'}`}>
                        <span className="pr-4 text-sm text-[#374151]">{courseTitle}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected ? 'border-[#feb316] bg-[#feb316] text-white' : 'border-[#cbd5e1] bg-white text-transparent'}`}>
                          <Check size={14} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <label className="block text-sm font-medium text-[#374151]">
                  Computer Number <span className="text-[#9ca3af]">(optional)</span>
                  <input type="text" value={registerData.computerNumber} onChange={(event) => setRegisterData({ ...registerData, computerNumber: event.target.value })} className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="If available" />
                </label>
                <div>
                  <span className="text-sm font-medium text-[#374151]">Have you started flying training?</span>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRegisterData((prev) => ({ ...prev, hasStartedFlyingTraining: true }))} className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${registerData.hasStartedFlyingTraining === true ? 'border-[#feb316] bg-[#fff2d6] text-[#924d00]' : 'border-[#d1d5db] bg-white text-[#374151]'}`}>Yes</button>
                    <button type="button" onClick={() => setRegisterData((prev) => ({ ...prev, hasStartedFlyingTraining: false, totalFlyingHours: '' }))} className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${registerData.hasStartedFlyingTraining === false ? 'border-[#feb316] bg-[#fff2d6] text-[#924d00]' : 'border-[#d1d5db] bg-white text-[#374151]'}`}>No</button>
                  </div>
                </div>
                {registerData.hasStartedFlyingTraining ? (
                  <label className="block text-sm font-medium text-[#374151]">
                    Total Flying Hours
                    <input type="text" inputMode="decimal" value={registerData.totalFlyingHours} onChange={(event) => setRegisterData({ ...registerData, totalFlyingHours: normalizeDecimalInput(event.target.value) })} required className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-base focus:border-[#feb316] focus:outline-none focus:ring-2 focus:ring-[#feb316]/20" placeholder="e.g. 45.5" />
                  </label>
                ) : null}
                <label className="flex items-start gap-3 rounded-xl border border-[#d1d5db] px-4 py-3 text-sm text-[#6b7280]">
                  <input type="checkbox" checked={registerData.acceptedTerms} onChange={(event) => setRegisterData({ ...registerData, acceptedTerms: event.target.checked })} className="mt-1 h-4 w-4 rounded border-[#d1d5db] text-[#feb316] focus:ring-[#feb316]" />
                  <span>I agree to Pilot Pathshala{' '}<Link to="/terms-of-use" className="font-medium text-[#feb316]">Terms & Conditions</Link></span>
                </label>
                <button type="submit" disabled={authLoading} className="w-full rounded-full bg-[#feb316] px-6 py-3.5 text-base font-semibold text-[#1c1b1b] transition hover:bg-[#e4a700] disabled:opacity-60">{authLoading ? 'Creating account...' : 'Sign Up'}</button>
                <p className="text-center text-sm text-[#6b7280]">Already have an account?{' '}<button type="button" onClick={() => switchAuthMode('login')} className="font-semibold text-[#feb316]">Sign in</button></p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};