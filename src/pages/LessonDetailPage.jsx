import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CheckCircle2, Expand, FileText, Shrink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';

const toMarkdownDocument = (value) => {
  const entries = Array.isArray(value) ? value.map((item) => String(item || '')).filter(Boolean) : [];
  if (!entries.length) return '';
  if (entries.length === 1) return entries[0];

  const containsMarkdown = entries.some((line) => /^(#{1,6}\s|[-*+]\s|\d+\.\s|---+$|\|)/.test(line.trim()));
  return containsMarkdown ? entries.join('\n') : entries.map((line) => `- ${line}`).join('\n');
};

const normalizeHttpUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  return `https://${raw}`;
};

const isDirectVideoUrl = (rawUrl) => {
  const url = normalizeHttpUrl(rawUrl).toLowerCase();
  return url.endsWith('.mp4') || url.endsWith('.m3u8') || url.includes('.mp4?') || url.includes('.m3u8?');
};

const toBunnyPlayerUrl = (rawUrl) => {
  const normalized = normalizeHttpUrl(rawUrl);
  if (!normalized) return '';
  try {
    const url = new URL(normalized);
    if (url.hostname.includes('mediadelivery.net') && url.pathname.startsWith('/play/')) {
      return normalized;
    }
    if (url.hostname.includes('b-cdn.net') && url.pathname.includes('playlist.m3u8')) {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const videoId = parts[0];
        return `https://player.mediadelivery.net/play/638658/${videoId}`;
      }
    }
  } catch (_error) {
    return '';
  }
  return '';
};

const formatWatermarkTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);

const VideoWatermark = ({ label }) => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div
        className="video-watermark-live absolute left-[8%] top-[14%] max-w-[58%] rounded-full border border-white/10 bg-black/10 px-4 py-2 shadow-sm backdrop-blur-[1px]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffe082]/70 sm:text-xs">{label}</p>
      </div>
      <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/12 px-3 py-1.5 shadow-sm backdrop-blur-[1px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-xs">Pilot Pathshala</p>
      </div>
    </div>
  );
};

export const LessonDetailPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Video');
  const [bookmarked, setBookmarked] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [myNotes, setMyNotes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [watermarkTime, setWatermarkTime] = useState(() => formatWatermarkTime(new Date()));
  const [testMode, setTestMode] = useState('practice');
  const [lessonTests, setLessonTests] = useState([]);
  const [loadingLessonTests, setLoadingLessonTests] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [lessonQuestionData, setLessonQuestionData] = useState(null);
  const [lessonQuestionProgress, setLessonQuestionProgress] = useState({ current: 1, total: 0 });
  const [lessonExamTimer, setLessonExamTimer] = useState('01:24:34');
  const [lessonTimerSeconds, setLessonTimerSeconds] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonSelectedAnswers, setLessonSelectedAnswers] = useState({});
  const [lessonEvaluations, setLessonEvaluations] = useState({});
  const [lessonResultData, setLessonResultData] = useState(null);
  const [lessonShowResults, setLessonShowResults] = useState(false);
  const videoRef = useRef(null);

  const selectedLessonTest = useMemo(
    () => lessonTests.find((test) => String(test.id) === String(selectedTestId)) || null,
    [lessonTests, selectedTestId]
  );

  const lessonContent = useMemo(
    () => (lessonShowResults ? null : lessonQuestionData),
    [lessonQuestionData, lessonShowResults]
  );

  const lessonSelectedOptionId = lessonContent ? lessonSelectedAnswers[lessonContent.id] : null;
  const lessonCurrentEvaluation = lessonContent ? lessonEvaluations[lessonContent.id] : null;
  const lessonIsCorrectSelection = Boolean(lessonCurrentEvaluation?.isCorrect);
  const lessonIsPracticeAnswered = testMode === 'practice' && Boolean(lessonCurrentEvaluation);

  const parseTimer = (str) => {
    if (!str) return null;
    const parts = String(str).split(':').map((p) => Number(p));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(str) || null;
  };

  const formatTimer = (secs) => {
    if (secs == null) return '';
    const hh = Math.floor(secs / 3600);
    const mm = Math.floor((secs % 3600) / 60);
    const ss = secs % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  const resetLessonTestState = () => {
    setSelectedTestId(null);
    setLessonQuestionData(null);
    setLessonQuestionProgress({ current: 1, total: 0 });
    setLessonExamTimer('01:24:34');
    setLessonTimerSeconds(null);
    setLessonCompleted(false);
    setLessonSubmitting(false);
    setLessonSelectedAnswers({});
    setLessonEvaluations({});
    setLessonResultData(null);
    setLessonShowResults(false);
  };

  const loadLessonTests = async (mode = testMode) => {
    if (!token || !lesson?.courseTitle) return;
    try {
      setLoadingLessonTests(true);
      const data = await apiClient.getAvailableTests(mode, token, lesson?.lessonId || lessonId);
      const tests = Array.isArray(data?.tests) ? data.tests : [];
      const currentCourseTitle = String(lesson.courseTitle || '').trim();
      setLessonTests(tests.filter((test) => String(test.subject || '').trim() === currentCourseTitle));
    } catch (error) {
      console.error('Failed to load lesson tests:', error);
      setLessonTests([]);
    } finally {
      setLoadingLessonTests(false);
    }
  };

  const loadLessonQuestion = async (testId, mode = testMode) => {
    if (!token || !testId) return;
    try {
      setLessonSubmitting(true);
      const data = await apiClient.getCurrentQuestion(mode, token, testId);
      setLessonQuestionData(data?.question || null);
      setLessonQuestionProgress(data?.progress || { current: 1, total: 0 });
      setLessonExamTimer(data?.examTimer || '01:24:34');
      setLessonCompleted(Boolean(data?.completed || !data?.question));
      setLessonShowResults(false);
      setLessonSelectedAnswers({});
      setLessonEvaluations({});
    } catch (error) {
      console.error('Failed to load lesson question:', error);
      setLessonQuestionData(null);
      setLessonCompleted(false);
    } finally {
      setLessonSubmitting(false);
    }
  };

  const loadLessonResultSummary = async (mode = testMode, testId = selectedTestId) => {
    if (!token || !testId) return;
    try {
      const data = await apiClient.getTestResultSummary(token, mode, testId);
      setLessonResultData(data || null);
      setLessonShowResults(true);
      setLessonCompleted(true);
      setLessonQuestionData(null);
    } catch (error) {
      alert(`Unable to load lesson test results: ${error.message}`);
    }
  };

  const handleLessonSelectTest = async (testId) => {
    if (!testId) return;
    resetLessonTestState();
    setSelectedTestId(testId);
    await loadLessonQuestion(testId);
  };

  const handleLessonPracticeSelect = async (optionId) => {
    if (!lessonContent || lessonSubmitting || lessonCurrentEvaluation) return;
    try {
      setLessonSubmitting(true);
      setLessonSelectedAnswers((prev) => ({ ...prev, [lessonContent.id]: optionId }));
      const data = await apiClient.submitQuestion(
        { testId: selectedTestId, questionId: lessonContent.id, selectedOptionId: optionId },
        token
      );
      setLessonEvaluations((prev) => ({ ...prev, [lessonContent.id]: data?.result || null }));
    } catch (error) {
      alert(`Unable to submit answer: ${error.message}`);
    } finally {
      setLessonSubmitting(false);
    }
  };

  const lessonIsLastQuestion =
    Boolean(lessonContent) &&
    !lessonCompleted &&
    Number(lessonQuestionProgress?.total || 0) > 0 &&
    Number(lessonQuestionProgress?.current || 0) >= Number(lessonQuestionProgress?.total || 0);

  const lessonQuestionTimer = useMemo(
    () => parseTimer(lessonExamTimer),
    [lessonExamTimer]
  );

  const submitLessonExamAndNext = async () => {
    if (!lessonContent || lessonSubmitting) return;
    const selectedOptionId = lessonSelectedAnswers[lessonContent.id];
    if (!selectedOptionId) {
      alert('Select an answer before continuing.');
      return;
    }

    try {
      setLessonSubmitting(true);
      await apiClient.submitQuestion(
        { testId: selectedTestId, questionId: lessonContent.id, selectedOptionId },
        token
      );
      if (lessonIsLastQuestion) {
        await loadLessonResultSummary(testMode, selectedTestId);
        return;
      }
      await loadLessonQuestion(selectedTestId);
    } catch (error) {
      alert(`Unable to continue: ${error.message}`);
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleLessonTestContinue = async () => {
    if (!lessonContent) return;
    if (testMode === 'practice') {
      if (!lessonCurrentEvaluation) {
        alert('Select an answer before continuing.');
        return;
      }
      if (lessonIsLastQuestion) {
        await loadLessonResultSummary(testMode, selectedTestId);
        return;
      }
      await loadLessonQuestion(selectedTestId);
      return;
    }
    await submitLessonExamAndNext();
  };

  const getLessonPrimaryLabel = () => {
    if (lessonCompleted && lessonShowResults) return 'View Results';
    if (testMode === 'practice' && lessonCurrentEvaluation && lessonIsLastQuestion) return 'Submit Test';
    if (testMode === 'practice' && lessonCurrentEvaluation) return 'Next →';
    if (testMode === 'exam' && lessonSelectedOptionId) return lessonIsLastQuestion ? 'Submit Test' : 'Next →';
    if (lessonSubmitting) return 'Processing...';
    return 'Start Test';
  };

  useEffect(() => {
    if (activeTab !== 'Test') return undefined;
    loadLessonTests();
  }, [activeTab, token, testMode, lesson?.courseTitle]);

  useEffect(() => {
    if (activeTab !== 'Test') return undefined;
    if (!selectedTestId) return undefined;
    loadLessonQuestion(selectedTestId);
  }, [activeTab, selectedTestId, token, testMode]);

  useEffect(() => {
    if (lessonTimerSeconds == null) return undefined;
    const timer = window.setInterval(() => {
      setLessonTimerSeconds((prev) => {
        if (prev == null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [lessonTimerSeconds]);

  useEffect(() => {
    if (lessonTimerSeconds == null) {
      const secs = parseTimer(lessonExamTimer);
      if (secs != null) setLessonTimerSeconds(secs);
    }
  }, [lessonExamTimer]);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await apiClient.getLessonDetail(courseId, lessonId, token);
        const lessonData = data?.lesson || data || null;
        setLesson(lessonData);
        setActiveVideoIndex(0);
        setPersonalNotes(lessonData?.personalNotes || '');
        setMyNotes(
          (lessonData?.personalNotes || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
        );
        setBookmarked(Boolean(lessonData?.isBookmarked));
      } catch (error) {
        console.error('Failed to load lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && courseId && lessonId) {
      loadLesson();
    }
  }, [token, courseId, lessonId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWatermarkTime(formatWatermarkTime(new Date()));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isVideoExpanded) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsVideoExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVideoExpanded]);

  const notes = useMemo(() => (Array.isArray(lesson?.notes) ? lesson.notes : []), [lesson]);
  const takeaways = useMemo(() => (Array.isArray(lesson?.takeaways) ? lesson.takeaways : []), [lesson]);
  const notesMarkdown = useMemo(() => toMarkdownDocument(notes), [notes]);
  const takeawaysMarkdown = useMemo(() => toMarkdownDocument(takeaways), [takeaways]);
  const videos = useMemo(() => (Array.isArray(lesson?.videos) ? lesson.videos : []), [lesson]);
  const activeVideo = useMemo(() => videos[activeVideoIndex] || null, [videos, activeVideoIndex]);
  const activeVideoUrl = activeVideo?.videoUrl || lesson?.videoUrl || '';
  const youtubeVideoId = useMemo(
    () => String(activeVideo?.youtubeVideoId || lesson?.youtubeVideoId || ''),
    [activeVideo?.youtubeVideoId, lesson?.youtubeVideoId]
  );
  const bunnyPlayerUrl = useMemo(() => toBunnyPlayerUrl(activeVideoUrl), [activeVideoUrl]);
  const normalizedVideoUrl = useMemo(() => normalizeHttpUrl(activeVideoUrl), [activeVideoUrl]);
  const isDirectStream = useMemo(() => isDirectVideoUrl(activeVideoUrl), [activeVideoUrl]);
  const hasVideo = Boolean(youtubeVideoId || bunnyPlayerUrl || normalizedVideoUrl);
  const watermarkName = String(user?.name || 'Pilot Pathshala Student').trim();
  const watermarkEmail = String(user?.email || 'no-email').trim();
  const videoWatermarkLabel = `${watermarkName} • ${watermarkEmail} • ${watermarkTime}`;

  const lessonDisplayTitle = lesson?.lessonTitle || lesson?.title || 'Lesson';
  const lessonDisplaySubtitle = lesson?.lessonSubtitle || lesson?.moduleTitle || '';
  const lessonSummary = lesson?.lessonSummary || lesson?.summary || 'Lesson summary not available.';
  const lessonPosition = Number(lesson?.lessonPosition || 0);
  const totalLessons = Number(lesson?.totalLessons || 0);
  const segmentPercent = totalLessons > 0 ? Math.min(100, Math.max(0, Math.round((lessonPosition / totalLessons) * 100))) : 0;
  const enrollmentProgress = Math.round(Number(lesson?.enrollmentProgress || 0));
  const hasNextLesson = Boolean(lesson?.nextLesson?.id);

  const handleGoToNextLesson = () => {
    if (!lesson?.nextLesson?.id) {
      return;
    }

    navigate(`/courses/${courseId}/lessons/${lesson.nextLesson.id}`);
  };

  const handleGoBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleCompleteLesson = async () => {
    try {
      setSaving(true);
      const response = await apiClient.updateLessonProgress(
        courseId,
        lessonId,
        { isCompleted: true, personalNotes: myNotes.join('\n'), isBookmarked: bookmarked },
        token
      );
      setLesson((prev) => ({
        ...prev,
        isCompleted: true,
        enrollmentProgress:
          typeof response?.enrollmentProgress === 'number' ? response.enrollmentProgress : prev?.enrollmentProgress
      }));

      if (lesson?.nextLesson?.id) {
        handleGoToNextLesson();
        return;
      }
    } catch (error) {
      alert('Failed to save progress: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = () => {
    const value = newNoteText.trim();
    if (!value) return;
    const updatedNotes = [...myNotes, value];
    setMyNotes(updatedNotes);
    setPersonalNotes(updatedNotes.join('\n'));
    setNewNoteText('');
  };

  const handleToggleBookmark = async () => {
    try {
      setSaving(true);
      const nextBookmarked = !bookmarked;
      await apiClient.updateLessonProgress(courseId, lessonId, { isBookmarked: nextBookmarked }, token);
      setBookmarked(nextBookmarked);
      setLesson((prev) => (prev ? { ...prev, isBookmarked: nextBookmarked } : prev));
    } catch (error) {
      alert('Failed to bookmark: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      const serializedNotes = myNotes.join('\n');
      await apiClient.updateLessonProgress(courseId, lessonId, { personalNotes: serializedNotes }, token);
      setPersonalNotes(serializedNotes);
      alert('Notes saved successfully');
    } catch (error) {
      alert('Failed to save notes: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderVideoPlayer = () => {
    if (youtubeVideoId) {
      return (
        <iframe
          title="Lesson video"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="h-full w-full"
        />
      );
    }

    if (isDirectStream && normalizedVideoUrl) {
      return (
        <video
          ref={videoRef}
          controls
          controlsList="nofullscreen nodownload noremoteplayback"
          disablePictureInPicture
          className="h-full w-full bg-black"
        >
          <source
            src={normalizedVideoUrl}
            type={normalizedVideoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'}
          />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (bunnyPlayerUrl) {
      return (
        <iframe
          title="Lesson video"
          src={bunnyPlayerUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="h-full w-full"
        />
      );
    }

    if (normalizedVideoUrl) {
      return (
        <iframe
          title="Lesson video"
          src={normalizedVideoUrl}
          frameBorder="0"
          className="h-full w-full"
        />
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading lesson...</p>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-tertiary_text mb-4">Lesson not found</p>
            <button onClick={() => navigate('/courses')} className="text-accent hover:underline">
              Back to learning
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6 overflow-hidden rounded-2xl bg-[#2f2f2c] text-white">
          <div
            className="bg-cover bg-center px-6 py-8"
            style={
              lesson?.courseCoverImageUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${lesson.courseCoverImageUrl})`
                  }
                : undefined
            }
          >
            <button onClick={() => navigate('/courses')} className="mb-4 font-semibold text-white/90 hover:text-white">
              ← Back
            </button>
            <h1 className="max-w-3xl text-3xl font-bold text-[#e9b400]">{lesson?.courseTitle || 'Course'}</h1>
            <p className="mt-2 text-lg text-gray-300">{lessonDisplaySubtitle || 'Lesson'}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between gap-4 text-sm text-secondary_text">
            <p>Flight segment progress</p>
            <p>
              Segment {lessonPosition} of {totalLessons} ({segmentPercent}%)
            </p>
          </div>
          <div className="mt-4 flex items-center">
            <div className="h-1 rounded-full bg-[#e9b400]" style={{ width: `${Math.max(5, segmentPercent)}%` }} />
            <span className="-mx-1 text-lg text-[#e9b400]">✈</span>
            <div className="h-0.5 flex-1 rounded-full bg-[#4b4b4b]" />
          </div>
          <p className="mt-3 text-sm text-tertiary_text">Course progress: {enrollmentProgress}%</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-accent">{lesson?.moduleTitle || 'Lesson Module'}</p>
            <h2 className="text-3xl font-bold text-primary-900">{lessonDisplayTitle}</h2>
          </div>
          <button onClick={handleToggleBookmark} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            {bookmarked ? <BookmarkCheck className="text-accent" size={24} /> : <Bookmark className="text-tertiary_text" size={24} />}
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-white/90 p-2 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Video', 'Notes', 'Takeaways', 'My Notes', 'Test'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#e9b400] text-[#111317] shadow-sm'
                      : 'bg-[#f8f9fb] text-tertiary_text hover:bg-[#eef0f4] hover:text-primary_text'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === 'Video' ? (
              <div>
                {videos.length > 1 ? (
                  <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                    {videos.map((item, index) => {
                      const isActive = index === activeVideoIndex;
                      return (
                        <button
                          key={item.id || `${item.title || 'video'}-${index}`}
                          type="button"
                          onClick={() => setActiveVideoIndex(index)}
                          className={`max-w-[220px] shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                            isActive ? 'border-[#e0a900] bg-[#fff7db] text-primary_text' : 'border-border bg-white text-secondary_text'
                          }`}
                        >
                          <span className="block truncate">{item.title || `Video ${index + 1}`}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div
                  className={
                    isVideoExpanded
                      ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 sm:p-6'
                      : 'overflow-hidden rounded-2xl border border-border bg-[#111317]'
                  }
                >
                  {hasVideo ? (
                    <div className={isVideoExpanded ? 'relative w-full max-w-[96vw]' : 'relative aspect-video w-full'}>
                      <div className={isVideoExpanded ? 'relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111317]' : 'relative aspect-video w-full'}>
                        {renderVideoPlayer()}
                        <VideoWatermark label={videoWatermarkLabel} />
                        <button
                          type="button"
                          onClick={() => setIsVideoExpanded((prev) => !prev)}
                          className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/70"
                        >
                          {isVideoExpanded ? <Shrink size={16} /> : <Expand size={16} />}
                          {isVideoExpanded ? 'Exit Full View' : 'Full View'}
                        </button>
                      </div>
                      {isVideoExpanded ? (
                        <p className="mt-3 text-center text-xs font-medium text-white/65">
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center text-gray-400">No video available</div>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-[#e1c24f] bg-white p-6 shadow-sm">
                  <h3 className="text-3xl font-bold text-primary_text">{lessonDisplayTitle}</h3>
                  <p className="mt-3 text-xl leading-9 text-secondary_text">{lessonSummary}</p>
                </div>
              </div>
            ) : null}

            {activeTab === 'Notes' ? (
              <div className="rounded-lg border border-border bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-primary-900">Lesson Notes</h2>
                {notesMarkdown ? (
                  <div className="lesson-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{notesMarkdown}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-secondary_text">No notes available yet.</p>
                )}
              </div>
            ) : null}

            {activeTab === 'Takeaways' ? (
              <div className="rounded-lg border border-border bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-primary-900">Key Takeaways</h2>
                {takeawaysMarkdown ? (
                  <div className="lesson-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{takeawaysMarkdown}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-secondary_text">No takeaways available yet.</p>
                )}
              </div>
            ) : null}

            {activeTab === 'My Notes' ? (
              <div className="rounded-lg border border-border bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-primary-900">My Notes</h2>
                <div className="mb-4 flex gap-3">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a personal note..."
                    rows="3"
                    className="w-full resize-none rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={saving}
                    className="self-start rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent/90 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                {myNotes.length === 0 ? <p className="mb-4 text-tertiary_text">No notes yet. Add your first note above.</p> : null}

                <div className="space-y-3">
                  {myNotes.map((note, index) => (
                    <div key={`${note}-${index}`} className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-4">
                      <p className="text-primary_text">• {note}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedNotes = myNotes.filter((_, itemIndex) => itemIndex !== index);
                          setMyNotes(updatedNotes);
                          setPersonalNotes(updatedNotes.join('\n'));
                        }}
                        className="text-tertiary_text hover:text-primary_text"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="mt-6 rounded-lg bg-primary-900 px-6 py-2 text-white hover:bg-primary-900/90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            ) : null}

            {activeTab === 'Test' ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-white p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-primary-900">Lesson Test</h2>
                      <p className="mt-1 text-sm text-tertiary_text">Practice and exam review for this lesson.</p>
                    </div>
                    <div className="inline-flex rounded-full border border-[#d2d6de] bg-[#f8f9fb] p-1">
                      {['practice', 'exam'].map((modeValue) => (
                        <button
                          key={modeValue}
                          type="button"
                          onClick={() => {
                            setTestMode(modeValue);
                            resetLessonTestState();
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            testMode === modeValue ? 'bg-[#e9b400] text-[#111317]' : 'text-[#4b5563]'
                          }`}
                        >
                          {modeValue === 'practice' ? 'Practice' : 'Exam'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingLessonTests ? (
                    <div className="rounded-2xl border border-dashed border-[#c0c4d1] bg-[#f8f9fb] p-8 text-center text-sm text-tertiary_text">Loading available tests...</div>
                  ) : !lessonTests.length ? (
                    <div className="rounded-2xl border border-[#cfd3da] bg-[#f8f9fb] p-8 text-center text-sm text-tertiary_text">
                      No lesson-specific tests are available for this course right now.
                    </div>
                  ) : !selectedTestId ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {lessonTests.map((test) => {
                          const total = Number(test.total || 0);
                          const attempted = Number(test.attempted || 0);
                          const progress = total ? Math.round((attempted / total) * 100) : 0;
                          return (
                            <button
                              key={test.id}
                              type="button"
                              onClick={() => handleLessonSelectTest(test.id)}
                              className="group rounded-2xl border border-[#d3d6db] bg-[#f8f9fb] p-5 text-left transition hover:border-[#e9b400]"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-lg font-semibold text-primary_text">{test.title}</p>
                                  <p className="mt-1 text-sm text-tertiary_text">{test.subject || 'Lesson test'}</p>
                                </div>
                                <span className="rounded-full border border-[#e9b400] bg-[#fff7db] px-3 py-1 text-xs font-bold text-primary_text">
                                  {attempted ? 'Resume' : 'Start'}
                                </span>
                              </div>
                              <div className="mt-4 text-sm text-tertiary_text">
                                {total} questions • {attempted}/{total} attempted • {progress}% complete
                              </div>
                              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6e9ef]">
                                <div className="h-full rounded-full bg-[#e9b400]" style={{ width: `${progress}%` }} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-[#f8f9fb] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-secondary_text">Current Test</p>
                            <p className="text-lg font-bold text-primary_text">{selectedLessonTest?.title || 'Selected test'}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-tertiary_text">
                            <span>{lessonQuestionProgress.current}/{lessonQuestionProgress.total} questions</span>
                            <span>Mode: {testMode === 'practice' ? 'Practice' : 'Exam'}</span>
                            <span>{lessonTimerSeconds != null ? formatTimer(lessonTimerSeconds) : lessonExamTimer}</span>
                          </div>
                        </div>
                      </div>

                      {lessonShowResults ? (
                        <div className="rounded-2xl border border-border bg-white p-6">
                          <h3 className="text-xl font-bold text-primary-900">Test Results</h3>
                          <p className="mt-2 text-sm text-tertiary_text">Review your performance for this lesson test.</p>
                          <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#e6e9ef] bg-[#f8f9fb] p-4 text-center">
                              <p className="text-sm text-tertiary_text">Score</p>
                              <p className="mt-2 text-2xl font-bold text-primary_text">{lessonResultData?.summary?.score || '0/0'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#e6e9ef] bg-[#f8f9fb] p-4 text-center">
                              <p className="text-sm text-tertiary_text">Correct</p>
                              <p className="mt-2 text-2xl font-bold text-green-700">{lessonResultData?.summary?.correct || 0}</p>
                            </div>
                            <div className="rounded-2xl border border-[#e6e9ef] bg-[#f8f9fb] p-4 text-center">
                              <p className="text-sm text-tertiary_text">Incorrect</p>
                              <p className="mt-2 text-2xl font-bold text-red-600">{lessonResultData?.summary?.incorrect || 0}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              resetLessonTestState();
                              setSelectedTestId(selectedLessonTest?.id || null);
                              if (selectedLessonTest?.id) loadLessonQuestion(selectedLessonTest.id);
                            }}
                            className="mt-6 rounded-lg bg-[#e9b400] px-6 py-3 font-semibold text-[#111317]"
                          >
                            Review Again
                          </button>
                        </div>
                      ) : lessonContent ? (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-border bg-white p-6">
                            <h3 className="text-lg font-semibold text-primary_text">{lessonContent.prompt}</h3>
                            <p className="mt-2 text-sm text-tertiary_text">Select the best answer below.</p>
                          </div>

                          <div className="space-y-3">
                            {lessonContent.options.map((option, index) => {
                              const isSelected = lessonSelectedOptionId === option.id;
                              const isCorrectAnswerOption = lessonIsPracticeAnswered && option.id === lessonCurrentEvaluation?.correctOptionId;
                              const isWrongSelection = lessonIsPracticeAnswered && isSelected && !lessonIsCorrectSelection;
                              const isCorrectSelectionOption = lessonIsPracticeAnswered && isSelected && lessonIsCorrectSelection;

                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => (testMode === 'practice' ? handleLessonPracticeSelect(option.id) : setLessonSelectedAnswers((prev) => ({ ...prev, [lessonContent.id]: option.id })))}
                                  className={`w-full rounded-xl border p-4 text-left transition ${
                                    isCorrectSelectionOption ? 'border-green-500 bg-green-100' : isWrongSelection ? 'border-red-400 bg-red-100' : isSelected ? 'border-[#e9b400] bg-[#fff7db]' : 'border-[#d3d6db] bg-[#f8f9fb]'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${isSelected ? 'border-[#e9b400]' : 'border-[#d3d6db]'} bg-white text-sm font-semibold text-primary_text`}>
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="text-base font-medium text-primary_text">{option.text}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={goToNextLessonPracticeQuestion}
                            disabled={lessonSubmitting || (!lessonIsPracticeAnswered && testMode === 'practice') || (testMode === 'exam' && !lessonSelectedOptionId)}
                            className="mt-4 w-full rounded-xl bg-[#e9b400] px-6 py-4 text-lg font-semibold text-[#111317] disabled:opacity-50"
                          >
                            {getLessonPrimaryLabel()}
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-border bg-[#f8f9fb] p-8 text-center text-sm text-tertiary_text">
                          Select a test to begin.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="sticky top-6 rounded-lg border border-border bg-white p-6">
              <h3 className="mb-4 font-bold text-primary-900">Lesson Progress</h3>
              <div className={`mb-4 rounded-lg p-4 ${lesson.isCompleted ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <p className="mb-1 text-sm font-semibold">{lesson.isCompleted ? 'Completed' : 'In Progress'}</p>
                <p className="text-xs text-tertiary_text">Duration: {lesson.durationMinutes} minutes</p>
              </div>

              {lesson.isCompleted ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-green-700">
                    <CheckCircle2 size={18} />
                    Lesson completed
                  </div>

                  {hasNextLesson ? (
                    <button
                      type="button"
                      onClick={handleGoToNextLesson}
                      className="w-full rounded-lg bg-primary-900 py-3 font-semibold text-white hover:bg-primary-900/90"
                    >
                      Next Lesson
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoBackToCourse}
                      className="w-full rounded-lg border border-border py-3 font-semibold text-primary-900 hover:bg-gray-50"
                    >
                      Back to Course
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  disabled={saving}
                  className="w-full rounded-lg bg-primary-900 py-3 font-semibold text-white hover:bg-primary-900/90 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : hasNextLesson ? 'Continue Next Lesson' : 'Mark as Complete'}
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary_text">Study Tools</h3>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setActiveTab('My Notes')} className="rounded-full border border-border p-3 hover:bg-gray-50">
                    <FileText size={18} />
                  </button>
                  <button type="button" onClick={() => setActiveTab('Test')} className="rounded-full border border-[#e9b400] bg-[#fff7db] px-3 py-2 text-sm font-semibold text-primary_text hover:bg-[#ffe89b]">
                    Test
                  </button>
                  <button type="button" onClick={handleToggleBookmark} className="rounded-full border border-border p-3 hover:bg-gray-50">
                    {bookmarked ? <BookmarkCheck size={18} className="text-accent" /> : <Bookmark size={18} />}
                  </button>
                </div>
              </div>
              <p className="text-secondary_text">
                Use these tools to save notes and bookmark this lesson while you continue from the lesson progress panel above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
