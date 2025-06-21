import React, { useEffect, useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { Notification } from '../../types/orchestrix';

export const NotificationCenter: React.FC = () => {
  const { enhancedUser, organization } = useOrchestrix();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enhancedUser?.id && organization?.id) {
      loadNotifications();
      // Set up real-time subscription
      const subscription = setupRealtimeSubscription();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [enhancedUser?.id, organization?.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Generate mock notifications since we don't have real notifications yet
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      
      const unread = mockNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);

    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${enhancedUser?.id}`
        }, 
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
  };

  const generateMockNotifications = (): Notification[] => {
    const types = ['inventory_alert', 'approval_required', 'shipment_update', 'compliance_reminder', 'system_update'];
    const priorities: Notification['priority'][] = ['low', 'normal', 'high', 'urgent'];
    
    const notifications = [
      {
        id: 'notif-1',
        organization_id: organization?.id || '',
        recipient_id: enhancedUser?.id || '',
        type: 'inventory_alert',
        priority: 'high' as const,
        title: 'Low Stock Alert',
        message: 'SKU-001 Industrial Bearing has fallen below reorder point. Current stock: 5 units.',
        action_url: '/inventory',
        is_read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        metadata: { item_sku: 'SKU-001', current_stock: 5, reorder_point: 20 }
      },
      {
        id: 'notif-2',
        organization_id: organization?.id || '',
        recipient_id: enhancedUser?.id || '',
        type: 'approval_required',
        priority: 'urgent' as const,
        title: 'Purchase Order Approval Required',
        message: 'PO-2024-0156 for $25,847 requires your approval. Supplier: Global Supply Co.',
        action_url: '/procurement',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        metadata: { po_number: 'PO-2024-0156', amount: 25847, supplier: 'Global Supply Co' }
      },
      {
        id: 'notif-3',
        organization_id: organization?.id || '',
        recipient_id: enhancedUser?.id || '',
        type: 'shipment_update',
        priority: 'normal' as const,
        title: 'Shipment Delivered',
        message: 'Shipment SH-2024-0089 has been successfully delivered to Warehouse B.',
        action_url: '/logistics',
        is_read: true,
        read_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        metadata: { shipment_number: 'SH-2024-0089', destination: 'Warehouse B' }
      },
      {
        id: 'notif-4',
        organization_id: organization?.id || '',
        recipient_id: enhancedUser?.id || '',
        type: 'compliance_reminder',
        priority: 'high' as const,
        title: 'Compliance Review Due',
        message: 'ISO 27001 security review is due within 7 days. Schedule assessment now.',
        action_url: '/compliance',
        is_read: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        metadata: { compliance_type: 'ISO 27001', due_in_days: 7 }
      },
      {
        id: 'notif-5',
        organization_id: organization?.id || '',
        recipient_id: enhancedUser?.id || '',
        type: 'system_update',
        priority: 'low' as const,
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM EST.',
        is_read: true,
        read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        metadata: { maintenance_window: 'Sunday 2:00 AM - 4:00 AM EST' }
      }
    ];

    return notifications;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      // In a real app, you would update the database here
      // await supabase
      //   .from('notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('id', notificationId);

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);

      // In a real app, you would update the database here
      // await supabase
      //   .from('notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('recipient_id', enhancedUser?.id)
      //   .eq('is_read', false);

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return AlertTriangle;
    }
    
    switch (type) {
      case 'approval_required':
        return Clock;
      case 'shipment_update':
        return CheckCircle;
      case 'inventory_alert':
        return AlertTriangle;
      case 'compliance_reminder':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-8">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type, notification.priority);
                    const priorityColor = getPriorityColor(notification.priority);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id);
                          }
                          if (notification.action_url) {
                            window.location.href = notification.action_url;
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${priorityColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className={`text-sm font-medium text-gray-900 ${!notification.is_read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              {!notification.is_read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="flex-shrink-0 text-blue-600 hover:text-blue-800 ml-2"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                notification.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {notification.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-3">
                <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};