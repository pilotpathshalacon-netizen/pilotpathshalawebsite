import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layout } from '../components/Layout';
import { Target, Brain, Clock, BookMarked } from 'lucide-react';

export const ExamFocusStrategyPage = () => {
  const { token } = useAuth();
  const [strategy, setStrategy] = useState({
    focusLevel: 'moderate',
    studyTime: 2,
    weakAreas: true,
    practiceTests: true,
    mockExams: true,
    reviewNotes: true,
    retakeLimit: 3
  });

  const handleSaveStrategy = async () => {
    try {
      await apiClient.updatePreferences(token, { examStrategy: strategy });
      alert('Exam focus strategy saved successfully!');
    } catch (error) {
      console.error('Failed to save strategy:', error);
    }
  };

  const strategies = [
    {
      id: 'intensive',
      title: 'Intensive Focus',
      description: 'Maximum preparation - 3+ hours daily with all features',
      features: ['All weak areas', 'All practice tests', 'Mock exams', 'Notes review', '5 retakes max']
    },
    {
      id: 'moderate',
      title: 'Moderate Focus',
      description: 'Balanced approach - 1-2 hours daily',
      features: ['Key weak areas', 'Selected tests', 'Periodic mocks', 'Notes review', '3 retakes max']
    },
    {
      id: 'light',
      title: 'Light Focus',
      description: 'Flexible schedule - 30-60 min daily',
      features: ['Critical areas only', 'Quick tests', 'Occasional mocks', 'No review', '2 retakes max']
    }
  ];

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Exam Focus Strategy</h1>
        <p className="text-tertiary_text mb-8">Customize your exam preparation approach</p>

        {/* Strategy Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-6">Choose Your Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {strategies.map(strat => (
              <button
                key={strat.id}
                onClick={() => setStrategy({...strategy, focusLevel: strat.id})}
                className={`rounded-lg border-2 p-6 text-left transition-all ${
                  strategy.focusLevel === strat.id
                    ? 'border-primary-900 bg-primary-50'
                    : 'border-border hover:border-primary-900'
                }`}
              >
                <h3 className="font-bold text-primary_text mb-2">{strat.title}</h3>
                <p className="text-sm text-secondary_text mb-4">{strat.description}</p>
                <div className="space-y-2">
                  {strat.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-tertiary_text flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-900 rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-6">Customize Your Approach</h2>

          <div className="space-y-6">
            {/* Study Time */}
            <div>
              <label className="block text-sm font-semibold text-primary_text mb-2">
                Daily Study Time (hours)
              </label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={strategy.studyTime}
                onChange={(e) => setStrategy({...strategy, studyTime: parseFloat(e.target.value)})}
                className="w-full"
              />
              <p className="text-sm text-tertiary_text mt-2">{strategy.studyTime} hours/day</p>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-primary_text mb-4">Study Features</h3>
              
              <div className="space-y-3">
                {[
                  { key: 'weakAreas', label: 'Focus on Weak Areas', icon: Target },
                  { key: 'practiceTests', label: 'Practice Tests', icon: Brain },
                  { key: 'mockExams', label: 'Full Mock Exams', icon: Clock },
                  { key: 'reviewNotes', label: 'Review Notes & Summaries', icon: BookMarked }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={strategy[item.key]}
                      onChange={(e) => setStrategy({...strategy, [item.key]: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-secondary_text">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Retake Limit */}
            <div className="border-t border-border pt-6">
              <label className="block text-sm font-semibold text-primary_text mb-2">
                Maximum Retakes per Test
              </label>
              <select
                value={strategy.retakeLimit}
                onChange={(e) => setStrategy({...strategy, retakeLimit: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
              >
                <option>1 - Minimal Retakes</option>
                <option value="2">2 - Limited Retakes</option>
                <option value="3">3 - Moderate Retakes</option>
                <option value="5">5 - Flexible Retakes</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveStrategy}
            className="mt-8 w-full bg-primary-900 text-white py-3 rounded-lg font-semibold hover:bg-primary-900/90 transition-colors"
          >
            Save Strategy
          </button>
        </div>

        {/* Tips Section */}
        <div className="bg-primary-50 border border-[#e0c261] rounded-lg p-6">
          <h3 className="font-bold text-primary-900 mb-4">💡 Exam Prep Tips</h3>
          <ul className="space-y-2 text-secondary_text text-sm">
            <li>• Start with weak areas to maximize improvement</li>
            <li>• Take regular mock exams to build confidence</li>
            <li>• Review incorrect answers to understand concepts</li>
            <li>• Maintain consistent study schedule</li>
            <li>• Get adequate rest before the exam</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
