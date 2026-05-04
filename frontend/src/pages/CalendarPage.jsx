import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import DeadlineCalendar from '../components/calendar/DeadlineCalendar';
import EventPopover from '../components/calendar/EventPopover';
import { getTasks } from '../api/tasks';
import { getDirectives } from '../api/directives';
import { tasksToEvents, directivesToEvents } from '../utils/calendarHelpers';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, dirRes] = await Promise.all([
        getTasks({ limit: 200 }),
        getDirectives({ limit: 200 }),
      ]);
      const taskEvents = tasksToEvents(taskRes.data || []);
      const dirEvents = directivesToEvents(dirRes.data || []);
      setEvents([...taskEvents, ...dirEvents]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <>
      <Topbar title="Calendar" />
      <div className="mt-6">
        <Card>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner /></div>
            ) : (
              <DeadlineCalendar
                events={events}
                onSelectEvent={(event) => setSelectedEvent(event)}
              />
            )}
          </div>
        </Card>
      </div>
      {selectedEvent && (
        <EventPopover event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
