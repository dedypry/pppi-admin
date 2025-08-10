/* eslint-disable import/order */
import {
  Button,
  InputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TimeInput,
} from "@heroui/react";
import { forwardRef, useEffect, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon } from "lucide-react";

import CustomInput from "./custom-input";
import id from "date-fns/locale/id";
import dayjs from "dayjs";
import { dateTimeFormat } from "@/utils/helpers/formater";
import debounce from "@/utils/helpers/debounce";

interface Props {
  startDate?: Date;
  endDate?: Date;
  onChageValue: (date: any) => void;
}
function CustomDateRangePicker(
  { startDate, endDate, onChageValue, ...props }: Props & InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const now = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2022, 0, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    key: "target",
  });

  function handleChooseDateRange(event: RangeKeyDict) {
    const dateR = {
      startDate: event.target.startDate!,
      endDate: event.target.endDate!,
    };

    setDateRange({
      ...dateRange,
      ...dateR,
    });
    onChageValue(dateR);
  }

  useEffect(() => {
    if (startDate || endDate) {
      setDateRange({
        startDate: startDate ? dayjs(startDate).toDate() : dateRange.startDate,
        endDate: endDate ? dayjs(endDate).toDate() : dateRange.endDate,
        key: "target",
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const value = `${dateTimeFormat(dateRange.startDate as any)} - ${dateTimeFormat(dateRange.endDate as any)}`;

    setValue(value);
  }, [dateRange]);

  function handleTimeInput(
    key: "startDate" | "endDate",
    val?: ZonedDateTime | null,
  ) {
    setDateRange((state) => {
      const dateR = {
        ...state,
        [key]: dayjs(val?.toDate()).toDate(),
      };

      onChageValue(dateR);

      return dateR;
    });
  }

  const dobounceChangeValue = (date: any) =>
    debounce(() => {
      console.log("DATA", date);
      onChageValue(date);
    }, 1000);

  return (
    <CustomInput
      ref={ref}
      {...props}
      endContent={
        <Popover
          isOpen={open}
          placement="bottom"
          onOpenChange={(open) => setOpen(open)}
        >
          <PopoverTrigger>
            <Calendar1Icon className="text-secondary-600 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="mt-3">
            <div className="px-1 py-2">
              <DateRangePicker
                color="#15980d"
                editableDateInputs={true}
                locale={id}
                moveRangeOnFirstSelection={false}
                rangeColors={["#15980d"]}
                ranges={[dateRange]}
                retainEndDateOnFirstSelection={false}
                onChange={handleChooseDateRange}
              />
              <div className="flex gap-2">
                <TimeInput
                  hourCycle={24}
                  label="Waktu Mulai"
                  value={parseAbsoluteToLocal(
                    dayjs(dateRange.startDate).toISOString(),
                  )}
                  onChange={(val) => handleTimeInput("startDate", val)}
                />
                <TimeInput
                  hourCycle={24}
                  label="Waktu Berakhir"
                  value={parseAbsoluteToLocal(
                    dayjs(dateRange.endDate).toISOString(),
                  )}
                  onChange={(val) => handleTimeInput("endDate", val)}
                />
              </div>
              <div className="text-right py-5">
                <Button
                  color="primary"
                  variant="shadow"
                  onPress={() => setOpen(false)}
                >
                  Simpan/Tutup
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      }
      value={value}
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDateRangePicker);
