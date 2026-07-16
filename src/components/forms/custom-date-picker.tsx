/* eslint-disable import/order */
import {
  InputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { forwardRef, useState } from "react";
import { Calendar } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon } from "lucide-react";

import CustomInput from "./custom-input";
import dayjs from "dayjs";
import id from "date-fns/locale/id";

interface Props {
  maxDate?: Date;
  minDate?: Date;
  onChageValue: (date: string) => void;
}
function CustomDatePicker(
  { maxDate, minDate, onChageValue, ...props }: Props & InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [open, setOpen] = useState(false);
  const selectedDate = props.value && dayjs(props.value as string).isValid()
    ? dayjs(props.value as string).toDate()
    : new Date();
  const displayValue = props.value && dayjs(props.value as string).isValid()
    ? dayjs(props.value as string).format("DD MMMM YYYY")
    : props.value;

  return (
    <CustomInput
      ref={ref}
      {...props}
      value={displayValue as any}
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
              <Calendar
                color="#15980d"
                date={selectedDate}
                locale={id}
                maxDate={maxDate}
                minDate={minDate}
                onChange={(e) => {
                  onChageValue(dayjs(e).format("YYYY-MM-DD"));
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      }
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDatePicker);
