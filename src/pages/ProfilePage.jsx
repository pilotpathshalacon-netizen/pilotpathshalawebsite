import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { User, Mail, Award } from 'lucide-react';

export const ProfilePage = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiClient.getProfileOverview(token);
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadProfile();
    }
  }, [token]);

  const profileInfo = profile?.profile || null;
  const trainingInfo = profile?.training || null;
  const displayName = profileInfo?.name || user?.name || '';
  const displayEmail = profileInfo?.email || user?.email || '';
  const totalCourses = Array.isArray(trainingInfo?.enrolledSubjects) ? trainingInfo.enrolledSubjects.length : 0;
  const completedCourses =
    trainingInfo?.hasEnrollments && Number(trainingInfo?.progress || 0) >= 100
      ? 1
      : 0;
  const inProgressCourses =
    trainingInfo?.hasStartedLearning && Number(trainingInfo?.progress || 0) < 100
      ? 1
      : 0;
  const studyHours = Math.max(0, Math.round(((Number(trainingInfo?.progress || 0) / 100) * 31) * 10) / 10);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-border p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-primary-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {displayName?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-900">{displayName || 'No name available'}</h2>
              <p className="text-tertiary_text">{displayEmail || 'No email available'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User size={20} className="text-accent" />
              <div>
                <p className="text-sm text-tertiary_text">Name</p>
                <p className="font-semibold text-primary_text">{displayName || 'No name available'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={20} className="text-accent" />
              <div>
                <p className="text-sm text-tertiary_text">Email</p>
                <p className="font-semibold text-primary_text">{displayEmail || 'No email available'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        {profile && (
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
              <Award size={24} className="text-accent" />
              Learning Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-tertiary_text text-sm">Total Courses</p>
                <p className="text-2xl font-bold text-primary-900">{totalCourses}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-tertiary_text text-sm">Completed</p>
                <p className="text-2xl font-bold text-primary-900">{completedCourses}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-tertiary_text text-sm">In Progress</p>
                <p className="text-2xl font-bold text-primary-900">{inProgressCourses}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-tertiary_text text-sm">Study Hours</p>
                <p className="text-2xl font-bold text-primary-900">{studyHours}</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-[#fff7db] p-4">
              <p className="text-sm text-tertiary_text">Training Status</p>
              <p className="mt-1 font-semibold text-primary_text">{trainingInfo?.status || 'Not started'}</p>
              <p className="mt-3 text-sm text-tertiary_text">Current Course</p>
              <p className="mt-1 font-semibold text-primary_text">{trainingInfo?.currentCourse || 'No active course yet'}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
