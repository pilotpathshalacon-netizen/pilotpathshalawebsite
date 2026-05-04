import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { BookOpen } from 'lucide-react';

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
const yAxisLabels = ['100%', '80%', '60%', '40%', '20%', '0%'];
const CHART_HEIGHT = 190;

const getPoint = (value, index, total, chartWidth) => {
  const safeTotal = Math.max(total - 1, 1);
  const x = (index / safeTotal) * chartWidth;
  const y = ((100 - Number(value || 0)) / 100) * CHART_HEIGHT;
  return { x, y };
};

export const MyLearningPage = () => {
  const { token } = useAuth();
  const [progress, setProgress] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressData, enrollmentsData] = await Promise.all([
          apiClient.getProgressOverview(token),
          apiClient.getMyEnrollments(token)
        ]);
        setProgress(progressData);
        setEnrollments(enrollmentsData.enrollments || enrollmentsData || []);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const chartValues = useMemo(() => progress?.accuracyTrend || [0, 0, 0, 0, 0, 0, 0], [progress]);
  const hasProgressData = Boolean(progress?.hasData);
  const mastery = progress?.subjectMastery || [];
  const readiness = progress?.readiness || {};
  const chartWidth = 640;
  const points = useMemo(
    () => chartValues.map((value, index) => getPoint(value, index, chartValues.length, chartWidth)),
    [chartValues]
  );
  const linePoints = useMemo(
    () => points.map((point) => `${point.x},${point.y}`).join(' '),
    [points]
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading progress...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Progress</h1>
        <p className="text-tertiary_text mb-8">Track your learning journey</p>

        {!hasProgressData ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center mb-8">
            <p className="text-yellow-900 font-semibold mb-2">No progress data yet</p>
            <p className="text-yellow-800">
              Attempt your first test to unlock readiness, trend, and mastery insights.
            </p>
          </div>
        ) : null}

        {/* Overall Readiness Card */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-tertiary_text mb-1">Overall Readiness</p>
              <p className="text-3xl font-bold text-primary-900">{readiness?.status || 'Not started'}</p>
              <p className="text-sm text-tertiary_text mt-1">Based on {readiness?.attempts || 0} attempts</p>
            </div>
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" stroke="#ececee" strokeWidth="10" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#e9b400"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${((Number(readiness?.score || 0) / 100) * 2 * Math.PI * 52)} ${2 * Math.PI * 52}`}
                />
              </svg>
              <p className="absolute text-3xl font-bold text-primary-900">{readiness?.score || 0}%</p>
            </div>
          </div>
        </div>

        {/* Accuracy Trend Chart */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-6">Accuracy Trend</h2>
          
          <div className="overflow-x-auto">
            <div className="flex min-w-[720px]">
              <div className="flex h-[190px] flex-col justify-between pr-4">
                {yAxisLabels.map((label) => (
                  <div key={label} className="text-xs text-tertiary_text">
                    {label}
                  </div>
                ))}
              </div>

              <div className="ml-4 flex-1">
                <svg viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`} className="h-[190px] w-full">
                  {[0, 1, 2, 3, 4, 5].map((step) => {
                    const y = (step / 5) * CHART_HEIGHT;
                    return <line key={`h-${step}`} x1="0" y1={y} x2={chartWidth} y2={y} stroke="#d9dde3" strokeWidth="1" />;
                  })}
                  {weekLabels.map((_, index) => {
                    const x = (index / (weekLabels.length - 1)) * chartWidth;
                    return <line key={`v-${index}`} x1={x} y1="0" x2={x} y2={CHART_HEIGHT} stroke="#d9dde3" strokeWidth="1" />;
                  })}
                  <polyline points={linePoints} fill="none" stroke="#d9a700" strokeWidth="3" />
                  {points.map((point, index) => (
                    <circle key={`p-${index}`} cx={point.x} cy={point.y} r="4.5" fill="#2d3138" />
                  ))}
                </svg>

                <div className="mt-3 flex justify-between text-xs text-tertiary_text">
                  {weekLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Mastery */}
        {mastery.length > 0 && (
          <div className="bg-white rounded-lg border border-border p-6 mb-8">
            <h2 className="text-xl font-bold text-primary-900 mb-6">Subject Mastery</h2>
            
            <div className="space-y-4">
              {mastery.map((subject, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-[#f7f8fa] p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-primary_text">{subject.title}</h3>
                    <p className="text-sm font-bold" style={{ color: subject.color }}>
                      {subject.score}% . {subject.label}
                    </p>
                  </div>
                  <div className="w-full bg-[#a1a5ad] rounded-full h-2">
                    <div
                      className="bg-[#e9b400] h-2 rounded-full transition-all"
                      style={{ width: `${subject.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enrollments */}
        <div>
          <h2 className="text-xl font-bold text-primary-900 mb-6">My Courses</h2>
          
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <BookOpen size={48} className="mx-auto text-tertiary_text mb-4 opacity-50" />
              <p className="text-tertiary_text mb-4">No enrolled courses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary_text mb-2">{enrollment.title || enrollment.course?.title}</h3>
                    <p className="text-secondary_text text-sm mb-4 line-clamp-2">{enrollment.description || enrollment.course?.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-tertiary_text">Progress</span>
                        <span className="text-sm font-semibold text-primary-900">{Math.round(enrollment.progress || 0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-900 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full bg-primary-900 text-white py-2 rounded-lg hover:bg-primary-900/90 transition-colors text-sm font-semibold">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
