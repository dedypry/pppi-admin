import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { IPackage } from "@/interface/IPartner";
import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";
import InputTags from "@/components/forms/input-tags";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getPackage } from "@/stores/features/packages/action";
import { useAppDispatch } from "@/stores/hooks";

interface Props {
  open: boolean;
  setOpen: CallableFunction;
  data?: IPackage;
  header?: boolean;
}
export default function EditItem({ open, setOpen, data, header }: Props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      id: undefined,
      title: "",
      benefit: [],
      types: [],
      description: "",
      parent_id: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id as any);
      setValue("title", data.title);
      setValue("benefit", data.benefit || ([] as any));
      setValue("types", data.types || ([] as any));
      setValue("description", data.description!);
      setValue("parent_id", data.parent_id as any);
    } else {
      reset();
    }
  }, [data]);

  function onSubmit(data: any) {
    setLoading(true);
    http
      .post("/packages", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPackage());
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <Modal isOpen={open} onOpenChange={() => setOpen(false)}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{data?.title ? "Edit" : "Tambah"} Paket</ModalHeader>
          <ModalBody>
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
                  label="Title"
                  placeholder="Masukan Title"
                />
              )}
            />
            {header ? (
              <Controller
                control={control}
                name="types"
                render={({ field }) => (
                  <InputTags
                    items={field.value}
                    label="Types"
                    placeholder="Masukan Types"
                    onTags={(val: string[]) => field.onChange(val)}
                  />
                )}
              />
            ) : (
              <Controller
                control={control}
                name="benefit"
                render={({ field }) => (
                  <InputTags
                    items={field.value}
                    label="Benefit"
                    placeholder="Masukan Benefit"
                    onTags={(val: string[]) => field.onChange(val)}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <CustomTextarea
                  {...field}
                  errorMessage={
                    errors.description?.message ||
                    "description tidak boleh kosong"
                  }
                  isInvalid={!!errors.description}
                  label="Description"
                  placeholder="Masukan description"
                />
              )}
            />
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button color="primary" isLoading={loading} type="submit">
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
