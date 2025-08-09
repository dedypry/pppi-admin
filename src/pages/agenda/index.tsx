import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { Calendar } from "lucide-react";

import "./style.css";
import CreateAgenda from "./create";

export default function AgendaPage() {
  const [isOpen, setOpen] = useState(false);
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Meeting Tim",
      subtitle: "Diskusi bulanan",
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().add(1, "day").format("YYYY-MM-DD"),
      color: "red",
    },
    {
      id: "2",
      title: "Workshop",
      subtitle: "Diskusi bulanan",
      start: dayjs("2025-08-15 09:00").format(),
      end: dayjs("2025-08-20 17:00").format(),
      color: "blue",
    },
    {
      id: "3",
      title: "Meeting Beaar",
      subtitle: "Diskusi bulanan",
      start: dayjs("2025-08-15 09:00").format(),
      end: dayjs("2025-08-20 17:00").format(),
      color: "green",
    },
  ]);

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="w-full flex items-center gap-2 px-3">
        <Calendar className="text-white" />
        <div>
          <div style={{ fontWeight: "bold" }}>{eventInfo.event.title}</div>
          <div className="text-white" style={{ fontSize: "0.75em" }}>
            {eventInfo.event.extendedProps.subtitle}
          </div>
        </div>
      </div>
    );
  };
  // Saat klik tanggal
  const handleDateClick = (info: any) => {
    const title = prompt("Masukkan judul event:");

    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: dayjs(info.date).format("YYYY-MM-DD"),
      };

      setEvents([...events, newEvent]);
    }
  };

  const handleEventDrop = (info: any) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: dayjs(info.event.start).format(),
            end: info.event.end ? dayjs(info.event.end).format() : null,
          }
        : event,
    );

    setEvents(updatedEvents);
  };
  const handleEventResize = (info: any) => {
    console.log("resize", info);
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: dayjs(info.event.start).format(),
            end: dayjs(info.event.end).format(),
          }
        : event,
    );

    setEvents(updatedEvents);
  };

  function clear() {
    setDateEnd(undefined);
    setDateStart(undefined);
  }

  return (
    <>
      <CreateAgenda
        endDate={dateEnd}
        isOpen={isOpen}
        setOpen={setOpen}
        startDate={dateStart}
        onClose={clear}
      />
      x
      <FullCalendar
        dateClick={(e) => {
          setDateStart(e.date);
          setDateEnd(e.date);
          setOpen(true);
        }}
        editable={true}
        eventClick={(e) => console.log("CHANGE", e)}
        eventColor="tranparent"
        eventContent={renderEventContent}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        select={(info) => {
          const adjustedEnd = new Date(info.end);

          adjustedEnd.setDate(adjustedEnd.getDate() - 1);
          setDateStart(info.start);
          setDateEnd(adjustedEnd);
          setOpen(true);
          // setData(info.)
        }}
        selectable={true}
      />
    </>
  );
}
