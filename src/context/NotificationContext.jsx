import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const normalizeNotification = useCallback((item) => ({
    id: String(item?.id || ''),
    read: Boolean(item?.read ?? item?.isRead ?? item?.is_read),
    isRead: Boolean(item?.read ?? item?.isRead ?? item?.is_read),
    is_read: Boolean(item?.read ?? item?.isRead ?? item?.is_read),
    timestamp: item?.timestamp || item?.createdAt || item?.created_at || null,
    createdAt: item?.createdAt || item?.created_at || item?.timestamp || null,
    title: item?.title || 'Notification',
    body: item?.body || item?.message || '',
    message: item?.message || item?.body || '',
    type: item?.type || 'general',
    icon: item?.icon || 'notifications',
    iconColor: item?.iconColor || item?.icon_color || '#e9b400',
    navigationScreen: item?.navigationScreen || item?.navigation_screen || null,
    navigationParams: item?.navigationParams || item?.navigation_params || {}
  }), []);

  const loadNotifications = useCallback(async (userId, token) => {
    try {
      const data = await apiClient.getNotifications(userId, token);
      const items = (Array.isArray(data) ? data : data?.notifications || []).map(normalizeNotification);
      setNotifications(items);
      const unread = items.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [normalizeNotification]);

  const markAsRead = useCallback(async (notificationId, token) => {
    try {
      await apiClient.markNotificationAsRead(notificationId, token);
      setNotifications(prev =>
        prev.map(n => n.id === String(notificationId) ? { ...n, read: true, isRead: true, is_read: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const clearAll = useCallback(async (userId, token) => {
    try {
      await apiClient.clearAllNotifications(userId, token);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loadNotifications, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
