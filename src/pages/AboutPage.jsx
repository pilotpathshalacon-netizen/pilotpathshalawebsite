import React from 'react';
import { Layout } from '../components/Layout';
import { Star, Users, BookOpen, Zap } from 'lucide-react';

export const AboutPage = () => {
  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">About Pilot Pathshala</h1>
        <p className="text-tertiary_text mb-8">Empowering the next generation of aviation professionals</p>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p>
            To revolutionize aviation education by providing accessible, comprehensive, and interactive learning 
            experiences for aspiring pilots. We're committed to making quality pilot training available to everyone, 
            regardless of their background or location.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg border border-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Why Choose Pilot Pathshala?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Star className="w-6 h-6 text-primary-900 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary_text mb-2">Expert Instructors</h3>
                <p className="text-secondary_text text-sm">Learn from experienced aviation professionals with years of industry knowledge</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-primary-900 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary_text mb-2">Interactive Content</h3>
                <p className="text-secondary_text text-sm">Engaging videos, simulations, and practice tests to reinforce learning</p>
              </div>
            </div>

            <div className="flex gap-4">
              <BookOpen className="w-6 h-6 text-primary-900 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary_text mb-2">Comprehensive Curriculum</h3>
                <p className="text-secondary_text text-sm">Covers PPL, CPL, ATPL, and other aviation certifications</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-primary-900 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary_text mb-2">Community Support</h3>
                <p className="text-secondary_text text-sm">Join thousands of students on their aviation journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg border border-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Story</h2>
          <p className="text-secondary_text mb-4">
            Founded in 2020, Pilot Pathshala began with a simple mission: to democratize aviation education. 
            We recognized that quality pilot training was often expensive and inaccessible to many aspiring aviators.
          </p>
          <p className="text-secondary_text mb-4">
            Today, we've grown to serve thousands of students across India and beyond. Our platform combines 
            cutting-edge technology with expert aviation knowledge to create an unparalleled learning experience.
          </p>
          <p className="text-secondary_text">
            We're proud to have helped numerous students achieve their aviation dreams, whether it's getting 
            their private pilot license or advancing to commercial operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary-900">10K+</p>
            <p className="text-primary_text mt-2">Active Students</p>
          </div>

          <div className="bg-primary-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary-900">500+</p>
            <p className="text-primary_text mt-2">Hours of Content</p>
          </div>

          <div className="bg-primary-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary-900">95%</p>
            <p className="text-primary_text mt-2">Pass Rate</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
