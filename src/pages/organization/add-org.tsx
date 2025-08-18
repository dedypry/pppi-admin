import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";

interface IForm {
  id?: number;
  user_id: number;
  title: string;
  parent_id: string;
  description: string;
}
export default function AddOrg() {
  const [open, setOpen] = useState(false);

  const {
    control,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      user_id: undefined,
      title: "",
      parent_id: "",
      description: "",
    },
  });

  return (
    <>
      <Modal isOpen={open} onOpenChange={() => setOpen(!open)}>
        <ModalContent>
          <ModalHeader>Tambah Struktur Organisasi</ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Nama Organisasi"
                  placeholder="Masukan Nama Organisasi"
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <CustomTextarea
                  {...field}
                  label="Description"
                  placeholder="Masukan description"
                />
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        isIconOnly
        radius="full"
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
      >
        <PlusCircleIcon className="text-primary text-xs" />
      </Button>
    </>
  );
}
