import React from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';

export const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const totalDuration = course.lessons?.reduce((sum, item) => sum + item.durationMinutes, 0) || 0;

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-bold text-primary_text mb-2">{course.title}</h3>
        <p className="text-accent font-semibold mb-2">{course.category}</p>
        <p className="text-secondary_text mb-4">{course.description}</p>
        
        <div className="flex items-center gap-4 text-tertiary_text text-sm mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            {course.lessons?.length || 0} lessons
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {totalDuration} mins
          </div>
        </div>

        <button
          onClick={onEnroll}
          disabled={isEnrolled}
          className={`w-full py-2 rounded-lg font-semibold transition-colors ${
            isEnrolled
              ? 'bg-gray-100 text-tertiary_text cursor-not-allowed'
              : 'bg-primary-900 text-white hover:bg-primary-900/90'
          }`}
        >
          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};
