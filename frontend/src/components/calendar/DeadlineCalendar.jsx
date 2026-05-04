import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const messages = {
  today: 'Today',
  previous: 'Prev',
  next: 'Next',
  month: 'Month',
  week: 'Week',
  agenda: 'Agenda',
  showMore: (count) => `+${count} more`,
};

export default function DeadlineCalendar({ events, onSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
  }, []);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || '#3b82f6',
      borderRadius: '4px',
      color: '#fff',
      border: 'none',
      fontSize: '11px',
      padding: '2px 4px',
    },
  });

  return (
    <div className="h-[620px] rounded-lg">
      <Calendar
        localizer={localizer}
        events={events}
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'agenda']}
        popup
        messages={messages}
        tooltipAccessor={(event) => event.title}
      />
    </div>
  );
}
