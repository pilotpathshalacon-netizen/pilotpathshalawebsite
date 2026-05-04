import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { Lightbulb, Navigation, Plane } from 'lucide-react';
import { openRazorpayCheckout } from '../utils/razorpay';

export const DashboardPage = () => {
  const { token, user } = useAuth();
  const { loadNotifications, unreadCount } = useNotification();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollingProgramId, setEnrollingProgramId] = useState(null);
  const authUser = user?.user || user;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await apiClient.getHomeDashboard(token);
        setDashboard(data);
        if (user?.id) {
          loadNotifications(user.id, token);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token, user, loadNotifications]);

  const handleStartProgram = async (program) => {
    if (!program?.id) return;

    const priceAmount = Number(program?.priceAmount || 0);
    const isPurchased = Boolean(program?.isPurchased);
    const isPaidCourse = priceAmount > 0;

    try {
      setEnrollingProgramId(program.id);

      if (isPaidCourse && !isPurchased) {
        const orderData = await apiClient.createCoursePurchaseOrder(program.id, token);
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
          program.id,
          {
            razorpay_order_id: paymentResult.razorpay_order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature
          },
          token
        );
      }

      await apiClient.enroll(program.id, token);

      const courseData = await apiClient.getCourses(token);
      const selectedCourse = (courseData.courses || courseData || []).find(c => c.id === program.id);
      const firstLesson = selectedCourse?.lessons?.[0];

      if (firstLesson?.id) {
        navigate(`/courses/${selectedCourse.id}/lessons/${firstLesson.id}`);
      } else {
        alert('Course enrolled successfully.');
        loadDashboard();
      }
    } catch (error) {
      if (String(error?.message || '').toLowerCase() !== 'payment cancelled') {
        alert('Unable to start program: ' + error.message);
      }
    } finally {
      setEnrollingProgramId(null);
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await apiClient.getHomeDashboard(token);
      setDashboard(data);
    } catch (error) {
      console.error('Failed to reload dashboard:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  const hasEnrollments = Boolean(dashboard?.journey?.hasEnrollments);
  const currentModule = dashboard?.currentModule;
  const currentLesson = dashboard?.currentLesson;
  const activeCourseProgress = Math.round(Number(currentModule?.courseProgress || 0));
  const planePosition = Math.min(100, Math.max(0, activeCourseProgress));
  const canOpenActiveLesson = Boolean(currentLesson?.courseId && currentLesson?.lessonId);
  const activePrograms = dashboard?.activePrograms || [];
  const captainTip = dashboard?.captainTip || 'Stay consistent with short daily sessions.';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header with greeting */}
          <div>
            <h1 className="text-3xl font-bold text-primary-900">
              Hi {dashboard?.greetingName || user?.name || 'Sanjana'}
            </h1>
          </div>

          {/* Current Module Card or Onboarding */}
          {hasEnrollments ? (
            <div className="bg-gradient-to-r from-primary-900 to-primary-600 text-white rounded-lg p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm opacity-80">Current Module</p>
                  <p className="text-2xl font-bold">{currentModule?.courseTitle || 'Current Course'}</p>
                </div>
                <div className="text-right min-w-[72px]">
                  <p className="text-4xl font-bold">{activeCourseProgress}%</p>
                  <p className="text-sm text-white/70">Complete</p>
                </div>
              </div>

              {/* Progress Track */}
              <div className="mb-6 flex items-center">
                <div
                  className="h-1 rounded-full bg-accent transition-all"
                  style={{ width: `${planePosition}%` }}
                />
                <span
                  className="text-accent text-lg -mx-1 transition-all"
                  style={{ transform: 'translateY(-1px)' }}
                >
                  ✈
                </span>
                <div className="h-1 flex-1 rounded-full bg-white/20" />
              </div>

              <button
                onClick={() => {
                  if (!canOpenActiveLesson) {
                    alert('No lessons yet: This course does not have lessons yet.');
                    return;
                  }
                  navigate(`/courses/${currentLesson.courseId}/lessons/${currentLesson.lessonId}`);
                }}
                className="bg-white text-primary-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <Navigation size={18} />
                {activeCourseProgress > 0 ? 'Resume Flight' : 'Start Course'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <h2 className="text-2xl font-bold text-primary-900 mb-2">
                {dashboard?.onboarding?.title || 'Start your first program'}
              </h2>
              <p className="text-tertiary_text mb-6">
                {dashboard?.onboarding?.subtitle || 'Enroll in a course to unlock lessons, progress, and test analytics.'}
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="bg-primary-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-900/90 flex items-center gap-2 justify-center mx-auto transition-colors"
              >
                <Plane size={20} />
                Browse Courses
              </button>
            </div>
          )}

          {/* Recommended Programs */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary-900">
                {hasEnrollments ? 'Recommended Programs' : 'Start Here'}
              </h2>
              <button
                onClick={() => navigate('/courses')}
                className="text-accent hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            {activePrograms.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-tertiary_text">No programs available right now</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activePrograms.map(program => (
                  <div key={program.id} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary_text mb-2">{program.title}</h3>
                    {program.description && (
                      <p className="text-secondary_text mb-4">{program.description}</p>
                    )}

                    <div className="flex gap-3 mb-4 flex-wrap">
                      {program.level && (
                        <span className="bg-primary-50 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                          {program.level}
                        </span>
                      )}
                      {program.category && (
                        <span className="bg-primary-50 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                          {program.category}
                        </span>
                      )}
                      {typeof program.lessonsCount === 'number' && (
                        <span className="bg-primary-50 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                          {program.lessonsCount} Lessons
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary-900">
                        {Number(program.priceAmount || 0) > 0
                          ? `${program.currency || 'INR'} ${program.priceAmount}`
                          : 'Free'
                        }
                      </p>
                      {program.id && (
                        <button
                          onClick={() => handleStartProgram(program)}
                          disabled={enrollingProgramId === program.id}
                          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                            Number(program.priceAmount || 0) > 0 && !program.isPurchased
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-primary-900 text-white hover:bg-primary-900/90'
                          } disabled:opacity-50`}
                        >
                          {enrollingProgramId === program.id
                            ? 'Starting...'
                            : Number(program.priceAmount || 0) > 0 && !program.isPurchased
                              ? 'Buy Course'
                              : 'Begin Training'
                          }
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Captain's Tip */}
          <div className="bg-primary-50 border border-[#e0c261] rounded-lg p-6 flex gap-4">
            <div className="flex-shrink-0 text-accent pt-1">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="font-bold text-primary-900 mb-1">Captain's Tip</h3>
              <p className="text-secondary_text">"{captainTip}"</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
