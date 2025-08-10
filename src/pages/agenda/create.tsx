import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Sketch } from "@uiw/react-color";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";

import CustomInput from "@/components/custom-input";
import QuillJS from "@/components/quill-js";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import AttachmentSingleFile from "@/components/attacment-singgle-file";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import {
  getRandomSafeColor,
  getScheduler,
} from "@/stores/features/schedulers/action";
import { useAppDispatch } from "@/stores/hooks";
import { IScheduler } from "@/interface/ISchedule";

interface IForm {
  id?: any;
  title?: string;
  subtitle?: string;
  description?: string;
  start_at: string;
  end_at: string;
  cover: string;
  color: string;
}
interface Props {
  isOpen: boolean;
  setOpen: CallableFunction;
  onClose: () => void;
  startDate?: Date;
  endDate?: Date;
  data?: IScheduler;
}

export default function CreateAgenda({
  isOpen,
  setOpen,
  startDate,
  endDate,
  onClose,
  data,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState({
    startDate: startDate,
    endDate: endDate,
  });

  const dispatch = useAppDispatch();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      title: "",
      subtitle: "",
      description: "",
      start_at: "",
      end_at: "",
      cover: "",
      color: getRandomSafeColor(),
    },
  });

  useEffect(() => {
    if (!data) {
      setValue("color", getRandomSafeColor());
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("title", data.title);
      setValue("subtitle", data.subtitle);
      setValue("description", data.description);
      setValue("start_at", data.start_at);
      setValue("end_at", data.end_at);
      setValue("cover", data.cover);
      setValue("color", data.color);
    }
  }, [data]);

  useEffect(() => {
    if (startDate || endDate) {
      const payload = {
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
      };

      setDate(payload);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setValue("start_at", dayjs(date.startDate).toISOString());
    setValue("end_at", dayjs(date.endDate).toISOString());
  }, [date]);

  function onSubmit(data: IForm) {
    setLoading(true);

    http
      .post("/schedulers", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getScheduler({}));
        setOpen(false);
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  console.log(watch("color"));

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="outside"
      size="5xl"
      onClose={onClose}
      onOpenChange={() => setOpen(!isOpen)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex justify-between pr-10">
            <p>Tambahkan Event</p>
            <Popover>
              <PopoverTrigger>
                <div
                  style={{
                    backgroundColor: watch("color"),
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-transparent">
                <Sketch onChange={(color) => setValue("color", color.hex)} />
              </PopoverContent>
            </Popover>
          </ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="cover"
              render={({ field }) => (
                <AttachmentSingleFile
                  file={field.value}
                  label="Cover"
                  setFile={(file) => field.onChange(file)}
                />
              )}
            />

            <p />
            <CustomDateRangePicker
              endDate={date.endDate}
              label="Tanggal Event"
              startDate={date.startDate}
              onChageValue={setDate}
            />

            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={
                    errors.title?.message || "Title tidak boleh kosong"
                  }
                  isInvalid={!!errors.title}
                  label="Judul"
                  placeholder="Masukan Judul"
                />
              )}
              rules={{ required: true }}
            />
            <Controller
              control={control}
              name="subtitle"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={
                    errors.subtitle?.message || "Subtitle tidak boleh kosong"
                  }
                  isInvalid={!!errors.subtitle}
                  label="Sujudul"
                  placeholder="Masukan Subjudul"
                />
              )}
              rules={{ required: true }}
            />

            <p className="text-sm text-secondary-900 p-0 m-0 pt-2">Deskripsi</p>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <QuillJS
                  value={field.value || ""}
                  onContent={(val) => field.onChange(val)}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" isLoading={loading} type="submit">
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
