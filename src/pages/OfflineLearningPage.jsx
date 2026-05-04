import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { Download, Wifi, WifiOff, Check } from 'lucide-react';

export const OfflineLearningPage = () => {
  const { token } = useAuth();
  const [preferences, setPreferences] = useState({
    enableOffline: true,
    autoDownload: false,
    wifiOnly: true,
    downloadQuality: 'HD'
  });
  const [downloadedCourses, setDownloadedCourses] = useState([
    { id: 1, title: 'Private Pilot License (PPL)', progress: 100, size: '450 MB' },
    { id: 2, title: 'Commercial Pilot License (CPL)', progress: 65, size: '320 MB' }
  ]);

  const handleSavePreferences = async () => {
    try {
      await apiClient.updatePreferences(token, { offlineLearning: preferences });
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Offline Learning</h1>
        <p className="text-tertiary_text mb-8">Download courses and study anywhere, anytime</p>

        {/* Preferences */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-6">Offline Preferences</h2>

          <div className="space-y-4">
            {/* Enable Offline */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary_text">Enable Offline Learning</h3>
                <p className="text-sm text-secondary_text">Download courses for offline access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableOffline}
                  onChange={(e) => setPreferences({...preferences, enableOffline: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
              </label>
            </div>

            {/* Auto Download */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary_text">Auto Download New Content</h3>
                <p className="text-sm text-secondary_text">Automatically download new lessons</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoDownload}
                  onChange={(e) => setPreferences({...preferences, autoDownload: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
              </label>
            </div>

            {/* WiFi Only */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary_text">WiFi Only Download</h3>
                <p className="text-sm text-secondary_text">Download only on WiFi connections</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.wifiOnly}
                  onChange={(e) => setPreferences({...preferences, wifiOnly: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
              </label>
            </div>

            {/* Download Quality */}
            <div>
              <label className="block text-sm font-semibold text-primary_text mb-2">Download Quality</label>
              <select
                value={preferences.downloadQuality}
                onChange={(e) => setPreferences({...preferences, downloadQuality: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
              >
                <option>Low (360p)</option>
                <option>Medium (720p)</option>
                <option>HD (1080p)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="mt-6 w-full bg-primary-900 text-white py-2 rounded-lg font-semibold hover:bg-primary-900/90 transition-colors"
          >
            Save Preferences
          </button>
        </div>

        {/* Downloaded Courses */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-primary-900 mb-6">Downloaded Courses</h2>

          <div className="space-y-4">
            {downloadedCourses.map(course => (
              <div key={course.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary_text">{course.title}</h3>
                  <span className="text-sm text-tertiary_text">{course.size}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary_text">{course.progress}%</span>
                  {course.progress === 100 && <Check className="w-5 h-5 text-green-500" />}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-900 text-white py-2 rounded-lg font-semibold hover:bg-primary-900/90 transition-colors">
            <Download size={18} /> Download New Course
          </button>
        </div>
      </div>
    </Layout>
  );
};
