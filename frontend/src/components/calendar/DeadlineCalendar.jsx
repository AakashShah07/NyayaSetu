import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function DeadlineCalendar({ events, onSelectEvent }) {
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
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'agenda']}
        defaultView="month"
        popup
      />
    </div>
  );
}
