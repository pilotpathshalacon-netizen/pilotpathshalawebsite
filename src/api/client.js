// const API_URL = import.meta.env.VITE_API_URL || 'https://api.pilotpathshala.com/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';


const buildHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async ({ endpoint, method = 'GET', body, token }) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data || {};
};

export const apiClient = {
  register: (payload) => request({ endpoint: '/auth/register', method: 'POST', body: payload }),
  login: (payload) => request({ endpoint: '/auth/login', method: 'POST', body: payload }),
  me: (token) => request({ endpoint: '/auth/me', token }),
  forgotPassword: (payload) => request({ endpoint: '/auth/forgot-password', method: 'POST', body: payload }),
  resetPassword: (token, payload) => request({ endpoint: `/auth/reset-password/${encodeURIComponent(token)}`, method: 'POST', body: payload }),
  getCourses: (token) => request({ endpoint: '/courses', token }),
  createCoursePurchaseOrder: (courseId, token) =>
    request({ endpoint: `/courses/${courseId}/purchase/order`, method: 'POST', token }),
  verifyCoursePurchase: (courseId, payload, token) =>
    request({ endpoint: `/courses/${courseId}/purchase/verify`, method: 'POST', body: payload, token }),
  enroll: (courseId, token) => request({ endpoint: `/courses/${courseId}/enroll`, method: 'POST', token }),
  getMyEnrollments: (token) => request({ endpoint: '/courses/me/enrollments', token }),
  getLessonDetail: (courseId, lessonId, token) => request({ endpoint: `/courses/${courseId}/lessons/${lessonId}`, token }),
  updateLessonProgress: (courseId, lessonId, payload, token) =>
    request({ endpoint: `/courses/${courseId}/lessons/${lessonId}/progress`, method: 'PUT', body: payload, token }),

  getHomeDashboard: (token) => request({ endpoint: '/dashboard/home', token }),
  getProfileOverview: (token) => request({ endpoint: '/profile/me', token }),

  getPreferences: (token) => request({ endpoint: '/preferences', token }),
  updateOfflinePreferences: (payload, token) => request({ endpoint: '/preferences/offline', method: 'PUT', body: payload, token }),
  updateReminderPreferences: (payload, token) => request({ endpoint: '/preferences/reminder', method: 'PUT', body: payload, token }),
  updateFocusStrategy: (payload, token) => request({ endpoint: '/preferences/focus-strategy', method: 'PUT', body: payload, token }),

  getProgressOverview: (token) => request({ endpoint: '/progress/overview', token }),
  getContactDetails: () => request({ endpoint: '/contact-details' }),
  submitEnquiry: (payload) => request({ endpoint: '/enquiries', method: 'POST', body: payload }),

  getTests: (token) => request({ endpoint: '/tests/available?mode=practice', token }),
  getAvailableTests: (mode, token, lessonId) =>
    request({
      endpoint: `/tests/available?mode=${mode}${lessonId ? `&lessonId=${encodeURIComponent(lessonId)}` : ''}`,
      token
    }),
  getCurrentQuestion: (mode, token, testId) =>
    request({
      endpoint: `/tests/current?mode=${mode}${testId ? `&testId=${encodeURIComponent(testId)}` : ''}`,
      token
    }),
  submitQuestion: (payload, token) => request({ endpoint: '/tests/submit', method: 'POST', body: payload, token }),
  resetTestAttempts: (mode, token, testId) =>
    request({
      endpoint: `/tests/attempts?mode=${mode}${testId ? `&testId=${encodeURIComponent(testId)}` : ''}`,
      method: 'DELETE',
      token
    }),
  getTestResultSummary: (token, mode, testId) =>
    request({
      endpoint: `/tests/result-summary?mode=${mode || 'practice'}${testId ? `&testId=${encodeURIComponent(testId)}` : ''}`,
      token
    }),

  getNotifications: (userId, token, limit = 50, offset = 0) =>
    request({ endpoint: `/notifications/${userId}?limit=${limit}&offset=${offset}`, token }),
  createNotification: (payload, token) => request({ endpoint: '/notifications', method: 'POST', body: payload, token }),
  markNotificationAsRead: (notificationId, token) =>
    request({ endpoint: `/notifications/${notificationId}/read`, method: 'PUT', token }),
  markAllNotificationsAsRead: (userId, token) =>
    request({ endpoint: `/notifications/${userId}/read-all`, method: 'PUT', token }),
  deleteNotification: (notificationId, token) =>
    request({ endpoint: `/notifications/${notificationId}`, method: 'DELETE', token }),
  clearAllNotifications: (userId, token) =>
    request({ endpoint: `/notifications/${userId}/clear-all`, method: 'DELETE', token })
};
