import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { Lightbulb, AlertCircle, PlayCircle, CheckCircle2, Navigation } from 'lucide-react';
import { openRazorpayCheckout } from '../utils/razorpay';

const courseTabs = ['ALL', 'PPL', 'CPL', 'ATPL'];

export const CoursesPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const authUser = user?.user || user;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [courseData, enrollmentData] = await Promise.all([
        apiClient.getCourses(token),
        apiClient.getMyEnrollments(token)
      ]);
      
      setCourses(courseData.courses || courseData || []);
      setEnrollments(enrollmentData.enrollments || enrollmentData || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      load();
    }
  }, [token, load]);

  const enrolledIds = useMemo(() => {
    return new Set(
      enrollments
        .map(item => Number(item.courseId || item.course?.id))
        .filter(id => Number.isFinite(id) && id > 0)
    );
  }, [enrollments]);

  const activeEnrollment = useMemo(() => {
    if (!enrollments.length) return null;
    const hasStarted = (item) =>
      Number(item?.progress || 0) > 0 || (item?.course?.lessons || []).some((lesson) => Boolean(lesson?.lastViewedAt));
    const latestActivityTime = (item) => {
      const lessonTimes = (item?.course?.lessons || [])
        .map((lesson) => new Date(lesson?.lastViewedAt || 0).getTime())
        .filter((time) => Number.isFinite(time) && time > 0);
      return Math.max(new Date(item?.updatedAt || item?.createdAt || 0).getTime(), ...lessonTimes, 0);
    };
    const sorted = [...enrollments].sort((a, b) => {
      const aStarted = hasStarted(a) ? 1 : 0;
      const bStarted = hasStarted(b) ? 1 : 0;
      if (aStarted !== bStarted) return bStarted - aStarted;
      return latestActivityTime(b) - latestActivityTime(a);
    });
    return sorted[0] || null;
  }, [enrollments]);

  const upcomingCourses = useMemo(() => {
    const activeCourseId = Number(activeEnrollment?.course?.id || activeEnrollment?.courseId || 0);
    
    // Helper function to check if a course has been started
    const hasStarted = (enrollment) => {
      const progress = Number(enrollment?.progress || 0);
      const hasViewedLesson = (enrollment?.course?.lessons || []).some((lesson) => Boolean(lesson?.lastViewedAt));
      return progress > 0 || hasViewedLesson;
    };
    
    // Only show available courses that are not enrolled or haven't been started
    const availableCourses = courses.filter(course => {
      const id = Number(course.id);
      if (id === activeCourseId) return false;
      // Check if user is enrolled and has started this course
      const enrollment = enrollments.find(e => Number(e.course?.id || e.courseId) === id);
      if (enrollment && hasStarted(enrollment)) return false;
      return Number.isFinite(id) && id > 0;
    });

    const otherEnrolledCourses = enrollments
      .filter(e => {
        const courseId = Number(e.course?.id || e.courseId);
        // Only include courses that haven't been started
        return courseId !== activeCourseId && Number.isFinite(courseId) && courseId > 0 && !hasStarted(e);
      })
      .map(e => ({
        ...e.course,
        id: e.course?.id || e.courseId,
        isEnrolled: true,
        isPurchased: false
      }));

    const allCourses = [...availableCourses, ...otherEnrolledCourses];
    const uniqueCourses = Array.from(
      new Map(allCourses.map(c => [Number(c.id), c])).values()
    );

    const filtered = uniqueCourses.filter(course => {
      return activeTab === 'ALL' ? true : (course.level || '').toUpperCase() === activeTab;
    });

    // Sort: enrolled courses first, then non-enrolled courses
    return filtered.sort((a, b) => {
      const aEnrolled = enrolledIds.has(Number(a.id)) ? 1 : 0;
      const bEnrolled = enrolledIds.has(Number(b.id)) ? 1 : 0;
      return bEnrolled - aEnrolled; // Enrolled (1) comes before non-enrolled (0)
    });
  }, [courses, enrollments, activeTab, activeEnrollment]);

  const filteredActive = useMemo(() => {
    if (!activeEnrollment) return null;
    if (activeTab === 'ALL') return activeEnrollment;
    const level = (activeEnrollment.course?.level || '').toUpperCase();
    return level === activeTab ? activeEnrollment : null;
  }, [activeEnrollment, activeTab]);

  const sortedLessons = useCallback((lessons) => {
    if (!Array.isArray(lessons)) return [];
    const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
    const sortKey = (item) => {
      const globalPosition = toNumber(item?.globalPosition);
      if (globalPosition) return { group: 0, a: globalPosition, b: 0 };
      return { group: 1, a: toNumber(item?.modulePosition), b: toNumber(item?.position) };
    };

    return [...lessons].sort((a, b) => {
      const ka = sortKey(a);
      const kb = sortKey(b);
      if (ka.group !== kb.group) return ka.group - kb.group;
      if (ka.a !== kb.a) return ka.a - kb.a;
      return ka.b - kb.b;
    });
  }, []);

  const activeLessons = useMemo(
    () => sortedLessons(filteredActive?.course?.lessons),
    [filteredActive, sortedLessons]
  );

  const lessonIndexById = useMemo(() => {
    const map = new Map();
    activeLessons.forEach((item, index) => {
      if (item?.id) {
        map.set(item.id, index);
      }
    });
    return map;
  }, [activeLessons]);

  const lessonsByModule = useMemo(() => {
    const groups = new Map();
    activeLessons.forEach((lesson) => {
      const moduleId = lesson?.moduleId || '__no_module__';
      const title = lesson?.moduleTitle || 'Lessons';
      const position = Number(lesson?.modulePosition || 0);

      if (!groups.has(moduleId)) {
        groups.set(moduleId, { id: moduleId, title, position, lessons: [] });
      }

      groups.get(moduleId).lessons.push(lesson);
    });

    return Array.from(groups.values()).sort((a, b) => Number(a.position) - Number(b.position));
  }, [activeLessons]);

  const activeProgress = Math.round(Number(filteredActive?.progress || 0));
  const planePosition = Math.min(100, Math.max(0, activeProgress));
  const hasActive = Boolean(filteredActive);

  const handleEnroll = async (course) => {
    try {
      setEnrollingCourseId(course.id);

      const isPaidCourse = Number(course?.priceAmount || 0) > 0;
      if (isPaidCourse && !course?.isPurchased) {
        const orderData = await apiClient.createCoursePurchaseOrder(course.id, token);
        const paymentResult = await openRazorpayCheckout({
          razorpayKeyId: orderData.razorpayKeyId,
          order: orderData.order,
          course: orderData.course,
          prefill: {
            name: orderData.prefill?.name || authUser?.name || '',
            email: orderData.prefill?.email || authUser?.email || ''
          }
        });

        await apiClient.verifyCoursePurchase(
          course.id,
          {
            razorpay_order_id: paymentResult.razorpay_order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature
          },
          token
        );
      }

      await apiClient.enroll(course.id, token);
      await load();
    } catch (error) {
      if (String(error?.message || '').toLowerCase() !== 'payment cancelled') {
        alert('Enrollment failed: ' + error.message);
      }
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const goToEnrolledCourse = (enrollment) => {
    const courseId = enrollment?.course?.id || enrollment?.courseId;
    if (!courseId) return;
    
    const lessons = sortedLessons(enrollment?.course?.lessons);
    const firstIncomplete = lessons.find(l => !l?.isCompleted);
    const lessonId = firstIncomplete?.id || lessons[0]?.id;
    
    if (lessonId) {
      navigate(`/courses/${courseId}/lessons/${lessonId}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading courses...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Training Programs</h1>
        <p className="text-tertiary_text mb-8">Explore professional aviation courses</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {courseTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-primary-900 text-white'
                  : 'bg-white border border-border text-primary_text hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tip Card */}
        <div className="bg-primary-50 border border-[#e0c261] rounded-lg p-6 mb-8 flex gap-4">
          <Lightbulb className="text-accent flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-primary-900 mb-1">Mentor Tip</h3>
            <p className="text-secondary_text">
              Recommended to complete Air Navigation before starting Meteorology for better conceptual flow.
            </p>
          </div>
        </div>

        {/* Active Enrollment */}
        {hasActive ? (
          <div className="bg-[#44433f] text-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#e9b400]">
                  {activeProgress > 0 ? 'In progress' : 'Not started'}
                </p>
                <h2 className="text-2xl font-bold mt-1">{filteredActive.course?.title || filteredActive.title}</h2>
                {filteredActive.course?.description ? (
                  <p className="text-sm text-gray-300 mt-2">{filteredActive.course.description}</p>
                ) : null}
              </div>
              <div className="text-right min-w-[72px]">
                <p className="text-4xl font-extrabold text-[#e9b400]">{activeProgress}%</p>
                <p className="text-sm text-gray-300">Complete</p>
              </div>
            </div>

            <div className="flex items-center mt-5">
              <div
                className="h-1 rounded-full bg-[#e9b400] transition-all"
                style={{ width: `${planePosition}%` }}
              />
              <span
                className="text-[#e9b400] text-lg -mx-1 transition-all"
                style={{ transform: 'translateY(-1px)' }}
              >
                ✈
              </span>
              <div className="h-1 flex-1 rounded-full bg-[#f3e5bc] opacity-90" />
            </div>

            <div className="mt-5 rounded-xl border border-[#6a6b64] bg-white/5 px-4 py-3">
              <p className="text-sm text-gray-400">Last Accessed</p>
              <p className="text-lg font-bold text-white mt-1">
                {activeProgress > 0 ? 'Continue from your latest lesson' : 'Begin from lesson 1'}
              </p>
            </div>

            <button
              onClick={() => goToEnrolledCourse(filteredActive)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e9b400] px-6 py-3 font-semibold text-[#111317] hover:brightness-95"
            >
              <Navigation size={18} />
              {activeProgress > 0 ? 'Resume Lesson' : 'Start Lesson'}
            </button>
          </div>
        ) : null}

        {hasActive && activeLessons.length ? (
          <div className="bg-white rounded-xl border border-border p-3 mb-6">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-primary-900 leading-tight">Upcoming Lessons</h2>
              <p className="text-xs text-tertiary_text mt-1 leading-tight">
                All lessons are unlocked for this enrolled course.
              </p>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {lessonsByModule.map((module) => (
                <div key={module.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-primary_text mb-1">{module.title}</h3>
                  <div className="space-y-2">
                    {module.lessons.map((item) => {
                      const index = lessonIndexById.get(item.id) ?? 0;
                      const isCompleted = Boolean(item?.isCompleted);

                      const icon = isCompleted ? (
                        <CheckCircle2 size={16} className="text-green-600" />
                      ) : (
                        <PlayCircle size={16} className="text-[#e0a900]" />
                      );

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (!filteredActive) return;
                            navigate(
                              `/courses/${filteredActive?.course?.id || filteredActive?.courseId}/lessons/${item.id}`
                            );
                          }}
                          className="w-full rounded-xl border border-border bg-white px-2 py-2 text-left transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-base font-medium text-primary_text">
                                {index + 1}. {item.title || 'Lesson'}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-tertiary_text">
                                {item.subtitle || (isCompleted ? 'Completed' : 'Ready to start')}
                              </p>
                            </div>
                            <div className="shrink-0">{icon}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Upcoming Courses */}
        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            {filteredActive ? 'Other Courses' : 'Upcoming Courses'}
          </h2>

          {upcomingCourses.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <p className="text-tertiary_text">No courses available in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCourses.map(course => {
                const courseId = Number(course.id);
                const isEnrolled = enrolledIds.has(courseId);
                const enrollment = enrollments.find(e => Number(e.courseId || e.course?.id) === courseId);
                const progress = enrollment ? Math.round(Number(enrollment.progress || 0)) : 0;
                
                return (
                  <div key={course.id} className="relative bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                    {isEnrolled && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                        Enrolled
                      </div>
                    )}
                    {course.thumbnail && (
                      <div className="h-40 bg-gradient-to-br from-primary-900 to-accent overflow-hidden">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <p className="text-accent font-semibold text-sm mb-2">{course.level || 'COURSE'}</p>
                      <h3 className="text-lg font-bold text-primary_text mb-2">{course.title}</h3>
                      <p className="text-secondary_text text-sm mb-4">{course.description}</p>
                      
                      <div className="text-tertiary_text text-sm mb-6">
                        <p>• {course.lessons?.length || 0} lessons</p>
                        <p>• {course.lessons?.reduce((sum, l) => sum + (l.durationMinutes || 0), 0) || 0} minutes</p>
                        {isEnrolled && <p>• Progress: {progress}%</p>}
                      </div>

                      {!isEnrolled && (
                        <p className="text-xl font-bold text-primary-900 mb-4">
                          {Number(course.priceAmount || 0) > 0 ? `${course.currency || 'INR'} ${course.priceAmount}` : 'Free'}
                        </p>
                      )}

                      <button
                        onClick={() => {
                          if (isEnrolled) {
                            goToEnrolledCourse(enrollment);
                          } else {
                            handleEnroll(course);
                          }
                        }}
                        disabled={enrollingCourseId === course.id}
                        className="w-full bg-primary-900 text-white py-2 rounded-lg font-semibold hover:bg-primary-900/90 disabled:opacity-50 transition-colors"
                      >
                        {enrollingCourseId === course.id
                          ? isEnrolled
                            ? 'Opening...'
                            : Number(course.priceAmount || 0) > 0 && !course.isPurchased
                              ? 'Processing...'
                              : 'Enrolling...'
                          : isEnrolled
                            ? progress > 0 ? 'Continue Learning' : 'Start Course'
                            : Number(course.priceAmount || 0) > 0 && !course.isPurchased
                              ? 'Buy Course'
                              : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
