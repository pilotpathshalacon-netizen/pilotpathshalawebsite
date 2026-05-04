import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { Bell, Clock, Check } from 'lucide-react';

export const DailyReminderPage = () => {
  const { token } = useAuth();
  const [preferences, setPreferences] = useState({
    enableReminders: true,
    morningReminder: true,
    morningTime: '08:00',
    afternoonReminder: true,
    afternoonTime: '14:00',
    eveningReminder: true,
    eveningTime: '19:00',
    reminderDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    reminderType: 'notification'
  });

  const daysOfWeek = [
    { code: 'Mon', label: 'Monday' },
    { code: 'Tue', label: 'Tuesday' },
    { code: 'Wed', label: 'Wednesday' },
    { code: 'Thu', label: 'Thursday' },
    { code: 'Fri', label: 'Friday' },
    { code: 'Sat', label: 'Saturday' },
    { code: 'Sun', label: 'Sunday' }
  ];

  const handleToggleDay = (day) => {
    setPreferences(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day]
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await apiClient.updatePreferences(token, { dailyReminder: preferences });
      alert('Daily reminder preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const isAllDaysSelected = preferences.reminderDays.length === 7;

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Daily Study Reminders</h1>
        <p className="text-tertiary_text mb-8">Set up reminders to keep your learning on track</p>

        {/* Master Toggle */}
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-primary_text">Enable Daily Reminders</h3>
              <p className="text-secondary_text text-sm mt-1">Get notifications to remind you to study</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.enableReminders}
                onChange={(e) => setPreferences({...preferences, enableReminders: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-900"></div>
            </label>
          </div>
        </div>

        {preferences.enableReminders && (
          <>
            {/* Reminder Type */}
            <div className="bg-white rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-bold text-primary_text mb-4">Reminder Type</h3>
              
              <div className="space-y-3">
                {[
                  { value: 'notification', label: 'Push Notifications', desc: 'Browser notifications' },
                  { value: 'email', label: 'Email', desc: 'Email reminders to your inbox' },
                  { value: 'both', label: 'Both', desc: 'Push notifications + Email' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="reminderType"
                      value={option.value}
                      checked={preferences.reminderType === option.value}
                      onChange={(e) => setPreferences({...preferences, reminderType: e.target.value})}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-primary_text">{option.label}</p>
                      <p className="text-xs text-secondary_text">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-bold text-primary_text mb-6">Study Schedule</h3>

              <div className="space-y-6">
                {/* Morning Reminder */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
                      <input
                        type="checkbox"
                        checked={preferences.morningReminder}
                        onChange={(e) => setPreferences({...preferences, morningReminder: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                    </label>
                    <div>
                      <p className="font-semibold text-primary_text">Morning Session</p>
                      <p className="text-sm text-secondary_text">Start your day with a study reminder</p>
                    </div>
                  </div>
                  {preferences.morningReminder && (
                    <div className="ml-16 flex items-center gap-2">
                      <Clock size={18} className="text-primary-900" />
                      <input
                        type="time"
                        value={preferences.morningTime}
                        onChange={(e) => setPreferences({...preferences, morningTime: e.target.value})}
                        className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                      />
                    </div>
                  )}
                </div>

                {/* Afternoon Reminder */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
                      <input
                        type="checkbox"
                        checked={preferences.afternoonReminder}
                        onChange={(e) => setPreferences({...preferences, afternoonReminder: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                    </label>
                    <div>
                      <p className="font-semibold text-primary_text">Afternoon Session</p>
                      <p className="text-sm text-secondary_text">Keep your momentum going in the afternoon</p>
                    </div>
                  </div>
                  {preferences.afternoonReminder && (
                    <div className="ml-16 flex items-center gap-2">
                      <Clock size={18} className="text-primary-900" />
                      <input
                        type="time"
                        value={preferences.afternoonTime}
                        onChange={(e) => setPreferences({...preferences, afternoonTime: e.target.value})}
                        className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                      />
                    </div>
                  )}
                </div>

                {/* Evening Reminder */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
                      <input
                        type="checkbox"
                        checked={preferences.eveningReminder}
                        onChange={(e) => setPreferences({...preferences, eveningReminder: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                    </label>
                    <div>
                      <p className="font-semibold text-primary_text">Evening Session</p>
                      <p className="text-sm text-secondary_text">Wind down with a final study session</p>
                    </div>
                  </div>
                  {preferences.eveningReminder && (
                    <div className="ml-16 flex items-center gap-2">
                      <Clock size={18} className="text-primary-900" />
                      <input
                        type="time"
                        value={preferences.eveningTime}
                        onChange={(e) => setPreferences({...preferences, eveningTime: e.target.value})}
                        className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Days Selection */}
            <div className="bg-white rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-bold text-primary_text mb-4">Reminder Days</h3>
              
              <div className="mb-4">
                <button
                  onClick={() => setPreferences({
                    ...preferences,
                    reminderDays: isAllDaysSelected ? [] : daysOfWeek.map(d => d.code)
                  })}
                  className="text-sm text-primary-900 hover:underline font-semibold"
                >
                  {isAllDaysSelected ? 'Deselect All' : 'Select All Days'}
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.code}
                    onClick={() => handleToggleDay(day.code)}
                    className={`py-3 px-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                      preferences.reminderDays.includes(day.code)
                        ? 'border-primary-900 bg-primary-50 text-primary-900'
                        : 'border-border bg-white text-secondary_text hover:border-primary-900'
                    }`}
                  >
                    {day.code}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full bg-primary-900 text-white py-3 rounded-lg font-semibold hover:bg-primary-900/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} /> Save Reminder Preferences
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};
