import React, { useState, useEffect } from 'react';
import { fetchUpcomingConsultations } from '../lib/firebase';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, RefreshCw, X, CheckCircle, ExternalLink } from 'lucide-react';

interface CalendarScheduleViewProps {
  accessToken: string | null;
  onClose: () => void;
  onConnectGoogle: () => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  accessToken,
  onClose,
  onConnectGoogle,
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const loadEvents = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const items = await fetchUpcomingConsultations(accessToken);
      setEvents(items);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadEvents();
    }
  }, [accessToken]);

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Consultation Schedule &amp; Calendar View
              </h3>
              <p className="text-xs text-slate-400">
                Live appointments synced with Acharya Jitender Shastri&apos;s Google Calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {accessToken && (
              <button
                onClick={loadEvents}
                disabled={loading}
                title="Refresh events"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {!accessToken ? (
            <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/10">
              <CalendarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3 opacity-80" />
              <h4 className="font-cinzel text-lg font-bold text-white mb-2">
                Connect Google Calendar
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
                Sign in with Google to view live calendar bookings, manage daily consultation slots, and automatically synchronize new inquiries.
              </p>
              <button
                onClick={onConnectGoogle}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Connect Google Calendar</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-3" />
              <span>Fetching live appointments from Google Calendar...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/10 text-slate-300">
              <CheckCircle className="w-10 h-10 text-yellow-400 mx-auto mb-2 opacity-80" />
              <div className="font-cinzel text-lg font-bold text-white">No Upcoming Consultations</div>
              <p className="text-xs text-slate-400 mt-1">
                Your calendar is open for new bookings during Acharya ji&apos;s consultation hours.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider flex items-center justify-between">
                <span>Upcoming Scheduled Consultations ({events.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">Primary Calendar</span>
              </div>

              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-all hover:bg-white/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h5 className="font-cinzel font-bold text-white text-base">
                      {evt.summary || 'Consultation Appointment'}
                    </h5>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(evt.start?.dateTime || evt.start?.date)}</span>
                    </span>
                  </div>

                  {evt.description && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 whitespace-pre-line font-sans leading-relaxed">
                      {evt.description}
                    </div>
                  )}

                  {evt.attendees && evt.attendees.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Attendees: {evt.attendees.map((a: any) => a.email).join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Consultation Timings: Mon-Sat 4-8 PM | Sun 10 AM-5 PM IST</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
