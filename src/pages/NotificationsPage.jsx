import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Layout } from '../components/Layout';
import { Trash2, BellOff, CheckCircle, BellRing } from 'lucide-react';

export const NotificationsPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, loadNotifications, markAsRead, clearAll } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user?.id && token) {
        await loadNotifications(user.id, token);
      }
      setLoading(false);
    };
    load();
  }, [user, token, loadNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId, token);
  };

  const formatTime = useMemo(() => (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const handleNotificationPress = async (notification) => {
    if (!notification?.read) {
      await handleMarkAsRead(notification.id);
    }

    const screen = notification?.navigationScreen;
    const params = notification?.navigationParams || {};

    if (screen === 'Course') {
      navigate('/courses');
      return;
    }

    if (screen === 'LessonDetail' && params?.courseId && params?.lessonId) {
      navigate(`/courses/${params.courseId}/lessons/${params.lessonId}`);
      return;
    }

    if (screen === 'Test' || screen === 'TestResult') {
      navigate('/tests');
      return;
    }
  };

  const handleClearAll = async () => {
    if (user?.id && window.confirm('Clear all notifications?')) {
      await clearAll(user.id, token);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-tertiary_text">Loading notifications...</p>
        </div>
      </Layout>
    );
  }

  return (
      <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Notifications</h1>
            <p className="text-tertiary_text mt-1">{unreadCount} unread notifications</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border border-border">
            <BellOff size={56} className="mx-auto mb-4 text-gray-300" />
            <p className="text-primary_text text-lg font-semibold">No notifications yet</p>
            <p className="text-tertiary_text mt-2">You&apos;ll see updates about your courses and progress here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => handleNotificationPress(notification)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleNotificationPress(notification);
                  }
                }}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read
                    ? 'bg-white border-border hover:bg-gray-50'
                    : 'bg-[#fffbf0] border-[#e9b400]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1 text-left">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <BellRing size={20} style={{ color: notification.iconColor || '#e9b400' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary_text">{notification.title}</h3>
                      <p className="text-secondary_text text-sm mt-1">{notification.body}</p>
                      <p className="text-tertiary_text text-xs mt-2">
                        {formatTime(notification.timestamp || notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {!notification.read ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e9b400]" /> : null}
                    {!notification.read && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
