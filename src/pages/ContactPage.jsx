import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { apiClient } from '../api/client';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    contactEmail: 'support@pilotpathshala.com',
    contactPhone: '+91 (123) 456-7890',
    contactAddress: 'Aviation Academy, India'
  });

  useEffect(() => {
    const loadContactDetails = async () => {
      try {
        const data = await apiClient.getContactDetails();
        if (data?.contact) {
          setContactDetails(data.contact);
        }
      } catch (error) {
        console.error('Failed to load contact details:', error);
      }
    };

    loadContactDetails();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Contact Us</h1>
        <p className="text-tertiary_text mb-8">Have questions? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Email */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="mb-4">
              <Mail className="w-8 h-8 text-primary-900" />
            </div>
            <h3 className="text-lg font-bold text-primary_text mb-2">Email</h3>
            <p className="text-secondary_text">{contactDetails.contactEmail}</p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="mb-4">
              <Phone className="w-8 h-8 text-primary-900" />
            </div>
            <h3 className="text-lg font-bold text-primary_text mb-2">Phone</h3>
            <p className="text-secondary_text">{contactDetails.contactPhone}</p>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="mb-4">
              <MapPin className="w-8 h-8 text-primary-900" />
            </div>
            <h3 className="text-lg font-bold text-primary_text mb-2">Address</h3>
            <p className="text-secondary_text">{contactDetails.contactAddress}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary_text mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary_text mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary_text mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary_text mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="6"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-900 text-white py-3 rounded-lg font-semibold hover:bg-primary-900/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
