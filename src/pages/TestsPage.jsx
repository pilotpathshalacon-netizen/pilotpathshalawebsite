import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpen, Check, CheckCircle, ChevronLeft, Clock3, Flag, RotateCcw, X, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';

const ResultRing = ({ percent }) => {
  const radius = 52;
  const stroke = 10;
  const normalizedPercent = Math.max(0, Math.min(100, Number(percent || 0)));
  const circumference = 2 * Math.PI * radius;
  const dash = (normalizedPercent / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} stroke="#ececee" strokeWidth={stroke} fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e9b400"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary-900">
        {normalizedPercent}%
      </div>
    </div>
  );
};

const DonutChart = ({ correct, incorrect, skipped }) => {
  const radius = 44;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;
  const total = correct + incorrect + skipped || 1;
  const slices = [
    { value: correct, color: '#09a826' },
    { value: incorrect, color: '#f31212' },
    { value: skipped, color: '#6b7280' }
  ];
  let offset = 0;

  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
      {slices.map((slice) => {
        const length = (slice.value / total) * circumference;
        const circle = (
          <circle
            key={slice.color}
            cx="60"
            cy="60"
            r={radius}
            stroke={slice.color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${length} ${circumference}`}
            strokeDashoffset={-offset}
          />
        );
        offset += length;
        return circle;
      })}
      <circle cx="60" cy="60" r="28" fill="#eff1f4" />
    </svg>
  );
};

export const TestsPage = () => {
  const { token } = useAuth();
  const [mode, setMode] = useState('practice');
  const [availableTests, setAvailableTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [selectedTestSubject, setSelectedTestSubject] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [questionProgress, setQuestionProgress] = useState({ current: 1, total: 20 });
  const [examTimer, setExamTimer] = useState('01:24:34');
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [resultData, setResultData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const resetLocalState = () => {
    setHistory([]);
    setHistoryCursor(-1);
    setFlaggedQuestionIds([]);
    setSelectedAnswers({});
    setEvaluations({});
    setCompleted(false);
    setQuestionData(null);
    setResultData(null);
    setShowResults(false);
  };

  const loadAvailableTests = async (selectedMode = mode) => {
    if (!token) return;
    try {
      setLoadingTests(true);
      const data = await apiClient.getAvailableTests(selectedMode, token);
      setAvailableTests(Array.isArray(data?.tests) ? data.tests : []);
    } catch (_error) {
      setAvailableTests([]);
    } finally {
      setLoadingTests(false);
    }
  };

  const loadQuestion = async (selectedMode = mode, subject = selectedTestSubject) => {
    try {
      const data = await apiClient.getCurrentQuestion(selectedMode, token, subject);
      setQuestionData(data?.question || null);
      setQuestionProgress(data?.progress || { current: 1, total: selectedMode === 'exam' ? 50 : 20 });
      setExamTimer(data?.examTimer || '01:24:34');
      setCompleted(Boolean(data?.completed || !data?.question));
      setHistoryCursor(-1);
    } catch (_error) {
      setQuestionData(null);
      setCompleted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const loadResultSummary = async (selectedMode = mode, subject = selectedTestSubject) => {
    try {
      const data = await apiClient.getTestResultSummary(token, selectedMode, subject);
      setResultData(data);
      setShowResults(true);
    } catch (error) {
      alert(`Unable to load results: ${error.message}`);
    }
  };

  useEffect(() => {
    if (token) {
      resetLocalState();
      setSelectedTestSubject('');
      loadAvailableTests(mode);
    }
  }, [token, mode]);

  const isReviewingHistory = historyCursor >= 0;
  const reviewItem = isReviewingHistory ? history[historyCursor] : null;
  const content = reviewItem?.question || questionData;
  const selectedOptionId = content ? selectedAnswers[content.id] : null;
  const currentEvaluation = content ? evaluations[content.id] : null;
  const isCorrectSelection = Boolean(currentEvaluation?.isCorrect);
  const correctOptionId = currentEvaluation?.correctOptionId || null;
  const isPracticeAnswered = mode === 'practice' && Boolean(currentEvaluation);
  const canGoPrev = history.length > 0 && (historyCursor > 0 || historyCursor === -1);
  const isCurrentFlagged = content ? flaggedQuestionIds.includes(content.id) : false;
  const showTestList = !selectedTestSubject && !showResults;

  const completedTests = availableTests.filter(
    (test) => Number(test.total || 0) > 0 && Number(test.attempted || 0) >= Number(test.total || 0)
  );
  const pendingTests = availableTests.filter(
    (test) => Number(test.total || 0) > 0 && Number(test.attempted || 0) < Number(test.total || 0)
  );
  const hasAnyTestContent = availableTests.some((test) => Number(test.total || 0) > 0);

  const isLastQuestion =
    Boolean(content) &&
    !completed &&
    !isReviewingHistory &&
    Number(questionProgress?.total || 0) > 0 &&
    Number(questionProgress?.current || 0) >= Number(questionProgress?.total || 0);

  const confirmSubmitTest = () => window.confirm('Submit this test now?');

  const addToHistory = (question, optionId) => {
    setHistory((prev) => {
      const exists = prev.some((item) => item.question.id === question.id);
      if (exists) {
        return prev.map((item) =>
          item.question.id === question.id ? { ...item, selectedOptionId: optionId } : item
        );
      }
      return [...prev, { question, selectedOptionId: optionId }];
    });
  };

  const handlePracticeSelect = async (optionId) => {
    if (!content || isReviewingHistory || submitting || currentEvaluation) return;
    try {
      setSubmitting(true);
      setSelectedAnswers((prev) => ({ ...prev, [content.id]: optionId }));
      const data = await apiClient.submitQuestion({ questionId: content.id, selectedOptionId: optionId }, token);
      setEvaluations((prev) => ({ ...prev, [content.id]: data?.result || null }));
      addToHistory(content, optionId);
      setSubmitting(false);
    } catch (error) {
      alert(`Unable to submit: ${error.message}`);
      setSubmitting(false);
    }
  };

  const handleExamSelect = (optionId) => {
    if (!content || isReviewingHistory || submitting || completed) return;
    setSelectedAnswers((prev) => ({ ...prev, [content.id]: optionId }));
  };

  const handlePrev = () => {
    if (!canGoPrev) return;
    if (historyCursor === -1) {
      setHistoryCursor(history.length - 1);
      return;
    }
    setHistoryCursor((prev) => Math.max(prev - 1, 0));
  };

  const handleForwardReview = () => {
    if (historyCursor < history.length - 1) {
      setHistoryCursor((prev) => prev + 1);
      return true;
    }
    if (historyCursor === history.length - 1) {
      setHistoryCursor(-1);
      return true;
    }
    return false;
  };

  const goToNextPracticeQuestion = async () => {
    if (completed) {
      await loadResultSummary();
      return;
    }

    if (isReviewingHistory) {
      handleForwardReview();
      return;
    }

    if (!content || !currentEvaluation) {
      alert('Select an option to continue.');
      return;
    }

    if (isLastQuestion) {
      if (!confirmSubmitTest()) {
        return;
      }
      await loadResultSummary('practice', selectedTestSubject);
      return;
    }

    await loadQuestion('practice', selectedTestSubject);
  };

  const submitExamAndNext = async () => {
    if (completed) {
      await loadResultSummary();
      return;
    }

    if (isReviewingHistory) {
      handleForwardReview();
      return;
    }

    if (!content) return;

    const currentSelected = selectedAnswers[content.id];
    if (!currentSelected) {
      alert('Select an option to continue.');
      return;
    }

    try {
      if (isLastQuestion) {
        if (!confirmSubmitTest()) {
          return;
        }
      }
      setSubmitting(true);
      await apiClient.submitQuestion({ questionId: content.id, selectedOptionId: currentSelected }, token);
      addToHistory(content, currentSelected);
      if (isLastQuestion) {
        await loadResultSummary('exam', selectedTestSubject);
        return;
      }
      await loadQuestion('exam', selectedTestSubject);
    } catch (error) {
      setSubmitting(false);
      alert(`Unable to continue: ${error.message}`);
    }
  };

  const handleRetake = async () => {
    try {
      setSubmitting(true);
      await apiClient.resetTestAttempts(mode, token, selectedTestSubject);
      resetLocalState();
      setSelectedTestSubject(selectedTestSubject);
      await loadQuestion(mode, selectedTestSubject);
      await loadAvailableTests(mode);
    } catch (error) {
      setSubmitting(false);
      alert(`Unable to reset test: ${error.message}`);
    }
  };

  const toggleFlag = () => {
    if (!content) return;
    setFlaggedQuestionIds((prev) =>
      prev.includes(content.id) ? prev.filter((item) => item !== content.id) : [...prev, content.id]
    );
  };

  const getPrimaryLabel = () => {
    if (completed) return 'View Result →';
    if (mode === 'practice' && currentEvaluation && isLastQuestion) return 'Submit Test';
    if (mode === 'practice' && currentEvaluation) return 'Next →';
    if (mode === 'exam' && isLastQuestion) return 'Submit Test';
    if (submitting) return 'Submitting...';
    if (isReviewingHistory && historyCursor === history.length - 1) return 'Back to Current →';
    return 'Next →';
  };

  const startOrContinueTest = async (subject) => {
    if (!subject) return;
    resetLocalState();
    setSelectedTestSubject(subject);
    await loadQuestion(mode, subject);
  };

  const backToTests = () => {
    resetLocalState();
    setSelectedTestSubject('');
    loadAvailableTests(mode);
  };

  const handleHeaderBack = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }

    if (showTestList) {
      return;
    }

    if (canGoPrev) {
      handlePrev();
      return;
    }

    backToTests();
  };

  const summary = resultData?.summary || {
    score: '0/0',
    percent: 0,
    badge: 'No Attempts Yet',
    correct: 0,
    incorrect: 0,
    skipped: 0
  };
  const hasData = Boolean(resultData?.hasData);
  const topicPerformance = useMemo(() => resultData?.topicPerformance || [], [resultData]);
  const focusAreas = resultData?.focusAreas || [];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 overflow-hidden rounded-2xl bg-[#2f2f2c] text-white">
          <div className="flex items-center gap-3 px-6 py-5">
            <button onClick={handleHeaderBack} className="rounded-full p-1 text-white/90 hover:bg-white/10">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#f4f5f6]">{showResults ? 'Test Result' : 'Tests'}</h1>
              {showResults ? <p className="text-sm text-[#9ba2ac]">Exam performance summary</p> : null}
            </div>
          </div>
        </div>

        {!showResults ? (
          <div className="mb-6 flex rounded-xl border border-[#cfd3da] bg-[#dfe3e8] p-1">
            {['practice', 'exam'].map((value) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                  mode === value ? 'bg-[#e9b400] text-[#111317]' : 'text-[#111317]'
                }`}
              >
                {value === 'practice' ? 'Practice Mode' : 'Exam Mode'}
              </button>
            ))}
          </div>
        ) : null}

        {showResults ? (
          <div className="space-y-6">
            {!hasData ? (
              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-xl font-bold text-primary-900">No test attempts yet</h2>
                <p className="mt-2 text-tertiary_text">Start a practice or exam attempt to generate your result summary.</p>
              </div>
            ) : null}

            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-white p-6 md:flex-row md:items-center">
              <div>
                <p className="text-4xl font-bold text-primary-900">{summary.score}</p>
                <div className="mt-3 inline-flex rounded-full border border-[#e9b400] bg-[#fff7db] px-4 py-2 text-sm font-bold text-primary_text">
                  {summary.badge}
                </div>
              </div>
              <ResultRing percent={summary.percent} />
            </div>

            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              <div className="rounded-2xl border border-border bg-white p-4 flex items-center justify-center">
                <DonutChart correct={summary.correct} incorrect={summary.incorrect} skipped={summary.skipped} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm text-tertiary_text">Correct</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">{summary.correct}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm text-tertiary_text">Incorrect</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">{summary.incorrect}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm text-tertiary_text">Skipped</p>
                  <p className="mt-2 text-3xl font-bold text-slate-500">{String(summary.skipped).padStart(2, '0')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-xl font-bold text-primary-900">Topic wise performance</h2>
              <div className="mt-5 space-y-4">
                {topicPerformance.length ? topicPerformance.map((item, index) => (
                  <div key={`${item.title}-${index}`}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="font-semibold text-primary_text">{item.title}</p>
                      <p className="text-sm font-semibold" style={{ color: item.color }}>
                        {item.value}%. {item.label}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e6e9ef]">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                )) : <p className="text-tertiary_text">No topic performance available yet.</p>}
              </div>
            </div>

            {focusAreas.length ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="mb-3 flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <h2 className="text-lg font-bold">Critical Focus Areas</h2>
                </div>
                <div className="space-y-2 text-sm text-red-900">
                  {focusAreas.map((item) => (
                    <p key={item.title}>
                      <span className="font-semibold">{item.title}</span>: {item.detail}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-[#e0c261] bg-primary-50 p-6">
              <h2 className="font-bold text-primary-900">Captain&apos;s Tip</h2>
              <p className="mt-2 text-secondary_text">&quot;{resultData?.tip || 'Attempt a test to unlock targeted coaching tips.'}&quot;</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 rounded-xl border border-[#717786] bg-white px-6 py-4 font-semibold text-primary_text"
              >
                Review Answer
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setMode('practice');
                  backToTests();
                }}
                className="flex-1 rounded-xl bg-[#e9b400] px-6 py-4 font-semibold text-[#111317]"
              >
                Start Practice
              </button>
            </div>
          </div>
        ) : null}

        {showTestList ? (
          <>
            <div className="mb-4 flex items-center justify-between border-b border-[#d2d6de] pb-4">
              <h2 className="text-xl font-bold text-primary-900">{mode === 'exam' ? 'Exam Tests' : 'Practice Tests'}</h2>
              <button onClick={() => loadAvailableTests(mode)} disabled={loadingTests} className="font-bold text-[#e0a900]">
                {loadingTests ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {!hasAnyTestContent ? (
              <div className="rounded-2xl border border-[#cfd3da] bg-[#f8f9fb] p-8 text-center text-sm font-semibold text-tertiary_text">
                No tests available yet.
              </div>
            ) : (
              <>
                {pendingTests.length ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-primary_text">Pending Tests</div>
                    {pendingTests.map((test) => {
                      const total = Number(test.total || 0);
                      const attempted = Number(test.attempted || 0);
                      const correct = Number(test.correct || 0);
                      const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
                      const progress = total ? Math.min(100, Math.round((attempted / total) * 100)) : 0;

                      return (
                        <button
                          key={test.subject}
                          onClick={() => startOrContinueTest(test.subject)}
                          className="w-full rounded-2xl border bg-[#f8f9fb] p-5 text-left hover:border-[#e9b400] border-[#cfd3da]"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-lg font-extrabold text-primary_text">{test.subject}</p>
                            <span className="rounded-full border border-[#e9b400] bg-[#fff7db] px-3 py-1 text-xs font-extrabold text-primary_text">
                              {attempted ? 'Continue' : 'Start'}
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-tertiary_text">
                            {total} questions • {attempted}/{total} attempted • {accuracy}% accuracy
                          </p>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6e9ef]">
                            <div className="h-full rounded-full bg-[#e9b400]" style={{ width: `${progress}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {completedTests.length ? (
                  <div className="mt-8 space-y-3">
                    <div className="text-sm font-semibold text-primary_text">Completed Tests</div>
                    {completedTests.map((test) => {
                      const total = Number(test.total || 0);
                      const attempted = Number(test.attempted || 0);
                      const correct = Number(test.correct || 0);
                      const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
                      const progress = total ? Math.min(100, Math.round((attempted / total) * 100)) : 0;

                      return (
                        <button
                          key={test.subject}
                          onClick={() => startOrContinueTest(test.subject)}
                          className="w-full rounded-2xl border bg-[#f8f9fb] p-5 text-left hover:border-[#e9b400] border-[#cfd3da]"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-lg font-extrabold text-primary_text">{test.subject}</p>
                            <span className="rounded-full border border-[#e9b400] bg-[#fff7db] px-3 py-1 text-xs font-extrabold text-primary_text">
                              Review
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-tertiary_text">
                            {total} questions • {attempted}/{total} attempted • {accuracy}% accuracy
                          </p>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6e9ef]">
                            <div className="h-full rounded-full bg-[#e9b400]" style={{ width: `${progress}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}

        {!showTestList && !showResults ? (
          <div>
            <div className={`mb-5 flex items-center justify-between ${mode === 'practice' ? '' : 'border-b border-[#d2d6de] pb-4'}`}>
              <p className="text-lg font-medium text-[#8f949e]">
                Question {questionProgress.current} of {questionProgress.total}
              </p>
              {mode === 'exam' ? (
                <div className="flex items-center gap-2 text-[#9ca3ae]">
                  <Clock3 size={14} />
                  <span className="text-sm">{examTimer}</span>
                </div>
              ) : null}
            </div>

            {mode === 'exam' && content ? (
              <div className="mb-5 inline-flex rounded bg-[#2f2f2c] px-3 py-1 text-xs font-medium text-[#f2f3f5]">
                {selectedTestSubject || content.subject || 'Navigation & Instruments'}
              </div>
            ) : null}

            {completed ? (
              <div className="mb-5 rounded-2xl border border-border bg-[#f8f9fb] p-5">
                <p className="text-lg font-semibold text-primary_text">All questions completed.</p>
                <p className="mt-2 text-tertiary_text">Open result summary or retake this test mode.</p>
              </div>
            ) : null}

            {content ? <h2 className="text-2xl font-semibold leading-tight text-primary_text">{content.prompt}</h2> : null}

            {content ? (
              <div className="mt-5 space-y-3">
                {content.options.map((option, index) => {
                  const isSelected = selectedOptionId === option.id;
                  const showPracticeState = mode === 'practice' && Boolean(currentEvaluation);
                  const isCorrectAnswerOption = showPracticeState && Boolean(correctOptionId) && option.id === correctOptionId;
                  const isWrongSelection = showPracticeState && isSelected && !isCorrectSelection;
                  const isCorrectSelectionOption = showPracticeState && isSelected && isCorrectSelection;

                  return (
                    <button
                      key={option.id}
                      onClick={mode === 'practice' ? () => handlePracticeSelect(option.id) : () => handleExamSelect(option.id)}
                      className={`flex w-full items-center rounded-xl border p-4 text-left transition-colors ${
                        isCorrectAnswerOption || isCorrectSelectionOption
                          ? 'border-green-500 bg-green-100'
                          : isWrongSelection
                            ? 'border-red-400 bg-red-100'
                            : mode === 'exam' && isSelected
                              ? 'border-[#e9b400] bg-[#fff7db]'
                              : 'border-[#cfd3da] bg-[#f8f9fb]'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          isCorrectAnswerOption || isCorrectSelectionOption
                            ? 'border-green-300 bg-green-100'
                            : isWrongSelection
                              ? 'border-red-300 bg-red-100'
                              : mode === 'exam' && isSelected
                                ? 'border-[#e9b400] bg-[#fff7db]'
                                : 'border-[#d3d6db]'
                        }`}
                      >
                        {showPracticeState && (isCorrectAnswerOption || isWrongSelection) ? (
                          isCorrectAnswerOption ? <Check size={18} className="text-green-600" /> : <X size={18} className="text-red-600" />
                        ) : (
                          <span className="text-sm font-medium text-primary_text">{option.key || String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <span className="ml-4 text-base font-medium text-primary_text">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {mode === 'practice' && isPracticeAnswered ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-[#f8f9fb]">
                <div className="bg-[#34342f] px-4 py-3 text-sm font-medium text-[#f2f3f5]">Explanation</div>
                <div className="p-4">
                  {!isCorrectSelection ? <p className="mb-1 text-lg font-semibold italic text-primary_text">Why this is wrong?</p> : null}
                  <p className="text-base italic leading-7 text-secondary_text">{currentEvaluation?.explanation}</p>
                </div>
              </div>
            ) : null}

            {mode === 'practice' ? (
              <div className="mt-6">
                <button onClick={goToNextPracticeQuestion} className="w-full rounded-xl bg-[#e9b400] px-6 py-4 text-lg font-semibold text-[#111317]">
                  {getPrimaryLabel()}
                </button>
                {completed ? (
                  <button
                    onClick={handleRetake}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#717786] bg-white px-6 py-4 font-semibold text-primary_text"
                  >
                    <RotateCcw size={18} />
                    Retake Practice
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  className={`flex-1 rounded-xl border px-6 py-4 font-semibold ${canGoPrev ? 'border-[#717786] bg-white text-primary_text' : 'border-[#d0d4dc] bg-white text-gray-400'}`}
                >
                  Prev
                </button>
                <button onClick={submitExamAndNext} className="flex-1 rounded-xl bg-[#e9b400] px-6 py-4 font-semibold text-[#111317]">
                  {getPrimaryLabel()}
                </button>
                <button
                  onClick={toggleFlag}
                  className={`rounded-xl border p-4 ${isCurrentFlagged ? 'border-[#e9b400] bg-[#fff7db]' : 'border-[#d0d4dc] bg-white'}`}
                >
                  <Flag size={20} className={isCurrentFlagged ? 'text-[#e9b400]' : 'text-[#3f4450]'} />
                </button>
              </div>
            )}

            {mode === 'exam' && completed ? (
              <button
                onClick={handleRetake}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#717786] bg-white px-6 py-4 font-semibold text-primary_text"
              >
                <RotateCcw size={18} />
                Retake Exam
              </button>
            ) : null}
          </div>
        ) : null}

        {!showResults && !showTestList && !content && !completed ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <BookOpen size={36} className="mx-auto mb-4 text-tertiary_text" />
            <p className="text-tertiary_text">Loading test...</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};
