import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShoppingBag,
  Coins,
  HardHat,
  Wrench,
  ShieldAlert,
  Settings,
  Sliders,
  Check,
  Smartphone,
  Mail,
  MessageSquare,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Notification channel mock toggles
  const [channels, setChannels] = useState({
    webPush: true,
    mobilePush: true,
    emailDigest: true,
    whatsappAlerts: true,
    smsUrgent: false,
  });

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) {
      onClose();
      navigate(link);
    }
  };

  const getNotifIcon = (title: string, type: string) => {
    const t = title.toLowerCase();
    if (t.includes('po ') || t.includes('purchase'))
      return <ShoppingBag className="w-4 h-4 text-amber-500" />;
    if (t.includes('stock') || t.includes('material'))
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (t.includes('payment') || t.includes('bill'))
      return <Coins className="w-4 h-4 text-emerald-500" />;
    if (t.includes('task') || t.includes('delay') || t.includes('project'))
      return <HardHat className="w-4 h-4 text-blue-500" />;
    if (t.includes('equipment') || t.includes('crane'))
      return <Wrench className="w-4 h-4 text-amber-600" />;
    if (t.includes('contract') || t.includes('insurance'))
      return <ShieldAlert className="w-4 h-4 text-indigo-500" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border-l sm:border border-slate-200 dark:border-slate-800 sm:rounded-2xl w-full sm:max-w-md h-full sm:h-[620px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications Center
              </h2>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread action alerts` : 'All alerts up to date'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'notifications' ? 'settings' : 'notifications')}
              className={`p-1.5 rounded-lg border transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800'
                  : 'text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
              }`}
              title="Notification Channel Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Sub-Header */}
        {activeTab === 'notifications' ? (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filter === 'all'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filter === 'unread'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
        ) : (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-semibold">
            <span>Multi-Channel Dispatch Channels</span>
            <button
              onClick={() => setActiveTab('notifications')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back to Alerts
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {activeTab === 'notifications' ? (
            filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.link)}
                  className={`p-4 text-xs transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 ${
                    !notif.read ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getNotifIcon(notif.title, notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'font-semibold text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                        View Details <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications match the filter.
              </div>
            )
          ) : (
            /* Multi-Channel Settings Tab */
            <div className="p-5 space-y-5 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Broadcast & Alert Preferences
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Configure real-time push, messaging, and email routing for construction events
                </p>
              </div>

              <div className="space-y-3">
                {/* Web Push */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Web Browser Push</div>
                      <div className="text-[11px] text-slate-400">Desktop browser toasts for critical events</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.webPush}
                    onChange={(e) => setChannels({ ...channels, webPush: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* Mobile App */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Mobile Native App Push</div>
                      <div className="text-[11px] text-slate-400">Site Engineer & Foreman devices</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.mobilePush}
                    onChange={(e) => setChannels({ ...channels, mobilePush: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">WhatsApp Business API</div>
                      <div className="text-[11px] text-slate-400">Instant PO approvals & site rain alerts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.whatsappAlerts}
                    onChange={(e) => setChannels({ ...channels, whatsappAlerts: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* Email Digest */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Executive Daily Digest</div>
                      <div className="text-[11px] text-slate-400">Morning DPR & Cash flow summary email</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.emailDigest}
                    onChange={(e) => setChannels({ ...channels, emailDigest: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* SMS */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Emergency SMS Gateway</div>
                      <div className="text-[11px] text-slate-400">Critical safety stoppage & crane emergency alerts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.smsUrgent}
                    onChange={(e) => setChannels({ ...channels, smsUrgent: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Notification preferences sync across all active sessions in real-time.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
