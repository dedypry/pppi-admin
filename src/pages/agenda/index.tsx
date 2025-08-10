/* eslint-disable import/order */
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

import "./style.css";
import dayjs from "dayjs";

import CreateAgenda from "./create";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  formatDateSchedule,
  getScheduler,
} from "@/stores/features/schedulers/action";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { IScheduler } from "@/interface/ISchedule";

export default function AgendaPage() {
  const [isOpen, setOpen] = useState(false);
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [data, setData] = useState<IScheduler>();
  const { schedulers } = useAppSelector((state) => state.schedulers);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getScheduler({}));
  }, []);

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

  const handleEventDrop = (info: any) => {
    const start = dayjs(info.event.start).format("YYYY-MM-DDT");
    const end = info.event.end
      ? dayjs(info.event.end).format("YYYY-MM-DDT")
      : dayjs(new Date()).format("YYYY-MM-DDT");

    const current = info.event.extendedProps;
    const currentTimeStart = dayjs(current.start_at).format("HH:mm:ss");
    const currentTimeEnd = dayjs(current.end_at).format("HH:mm:ss");
    const payload = {
      id: info.event.id,
      title: info.event.title,
      ...current,
      start_at: dayjs(`${start}${currentTimeStart}`).toISOString(),
      end_at: dayjs(`${end}${currentTimeEnd}`).toISOString(),
    };

    http.post("/schedulers", payload).catch((err) => notifyError(err));
  };

  const handleEventClick = (info: any) => {
    const payload = {
      id: info.event.id,
      title: info.event.title,
      color: info.event.backgroundColor,
      ...info.event.extendedProps,
    };

    console.log(payload)

    setData(payload);
    setDateStart(payload.start_at);
    setDateEnd(payload.end_at);
    setOpen(true);
  };

  function clear() {
    setDateEnd(undefined);
    setDateStart(undefined);
  }

  return (
    <>
      <CreateAgenda
        data={data}
        endDate={dateEnd}
        isOpen={isOpen}
        setOpen={setOpen}
        startDate={dateStart}
        onClose={clear}
      />

      <FullCalendar
        dateClick={(e) => {
          setDateStart(e.date);
          setDateEnd(e.date);
          setOpen(true);
        }}
        editable={true}
        eventClick={handleEventClick}
        eventColor="tranparent"
        eventContent={renderEventContent}
        eventDrop={handleEventDrop}
        eventResize={handleEventDrop}
        events={formatDateSchedule(schedulers?.data || []) as any}
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
        }}
        selectable={true}
      />
    </>
  );
}
