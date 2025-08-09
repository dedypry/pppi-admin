import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

import CustomInput from "@/components/custom-input";
import QuillJS from "@/components/quill-js";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import AttachmentSingleFile from "@/components/attacment-singgle-file";

interface IForm {
  title?: string;
  subtitle?: string;
  id?: any;
  description?: string;
}
interface Props {
  isOpen: boolean;
  setOpen: CallableFunction;
  onClose: () => void;
  startDate?: Date;
  endDate?: Date;
}

export default function CreateAgenda({
  isOpen,
  setOpen,
  startDate,
  endDate,
  onClose,
}: Props) {
  const [date, setDate] = useState({
    startDate: startDate,
    endDate: endDate,
  });

  useEffect(() => {
    if (startDate || endDate) {
      setDate({
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
      });
    }
  }, [startDate, endDate]);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="outside"
      size="5xl"
      onClose={onClose}
      onOpenChange={() => setOpen(!isOpen)}
    >
      <form action="">
        <ModalContent>
          <ModalHeader>Tambahkan Event</ModalHeader>
          <ModalBody>
            <AttachmentSingleFile file="" label="Cover" setFile={() => {}} />
            <p />
            <CustomDateRangePicker
              endDate={date.endDate}
              label="Tanggal Event"
              startDate={date.startDate}
              onChageValue={setDate}
            />

            <CustomInput label="Judul" placeholder="Masukan Judul" />
            <CustomInput label="Sujudul" placeholder="Masukan Subjudul" />
            <p className="text-sm text-secondary-900 p-0 m-0 pt-2">Deskripsi</p>
            <QuillJS value="" onContent={() => {}} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
