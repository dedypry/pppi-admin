/* eslint-disable import/order */
import {
  InputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { forwardRef, useEffect, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon } from "lucide-react";

import CustomInput from "./custom-input";
import id from "date-fns/locale/id";
import dayjs from "dayjs";
import { dateFormat } from "@/utils/helpers/formater";

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
    const value = `${dateFormat(dateRange.startDate as any)} - ${dateFormat(dateRange.endDate as any)}`;

    setValue(value);
  }, [dateRange]);

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
