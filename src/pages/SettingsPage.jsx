import React from 'react';
import { Layout } from '../components/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';

export const SettingsPage = () => {
  const [preferences, setPreferences] = React.useState({
    dailyReminder: true,
    offlineMode: false,
    focusStrategy: 'balanced'
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Settings & Preferences</h1>

        {/* Preferences */}
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Learning Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-primary_text">Daily Reminders</p>
                <p className="text-sm text-tertiary_text">Get reminded to continue learning</p>
              </div>
              <button
                onClick={() => handleToggle('dailyReminder')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences.dailyReminder ? 'bg-primary-900' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    preferences.dailyReminder ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-primary_text">Offline Mode</p>
                <p className="text-sm text-tertiary_text">Download content for offline learning</p>
              </div>
              <button
                onClick={() => handleToggle('offlineMode')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences.offlineMode ? 'bg-primary-900' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    preferences.offlineMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Focus Strategy */}
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Exam Focus Strategy</h2>
          
          <div className="space-y-2">
            {['Balanced', 'Intensive', 'Light'].map((strategy) => (
              <label key={strategy} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="focusStrategy"
                  value={strategy.toLowerCase()}
                  checked={preferences.focusStrategy === strategy.toLowerCase()}
                  onChange={(e) => setPreferences(prev => ({ ...prev, focusStrategy: e.target.value }))}
                  className="w-4 h-4"
                />
                <span className="ml-3 font-semibold text-primary_text">{strategy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Help & Support</h2>
          
          <div className="space-y-3">
            <a href="mailto:support@pilotpathshala.com" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <Mail size={20} className="text-accent" />
              <div>
                <p className="font-semibold text-primary_text">Email Support</p>
                <p className="text-sm text-tertiary_text">support@pilotpathshala.com</p>
              </div>
            </a>
            
            <a href="tel:+919876543210" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <Phone size={20} className="text-accent" />
              <div>
                <p className="font-semibold text-primary_text">Phone Support</p>
                <p className="text-sm text-tertiary_text">+91 9876543210</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-accent" />
              <div>
                <p className="font-semibold text-primary_text">Visit Us</p>
                <p className="text-sm text-tertiary_text">Pilot Pathshala HQ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
