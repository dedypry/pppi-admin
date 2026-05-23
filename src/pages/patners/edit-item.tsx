import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import CustomInput from "@/components/forms/custom-input";
import CustomTextArea from "@/components/forms/custom-textarea";
import { IPartner } from "@/interface/IPartner";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getPartners } from "@/stores/features/partners/action";
import { useAppDispatch } from "@/stores/hooks";

interface IForm {
  id?: number;
  name: string;
  logo: string;
  website: string;
  description: string;
}

interface Props {
  open: boolean;
  setOpen: CallableFunction;
  data?: IPartner;
}

export default function EditPartner({ open, setOpen, data }: Props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    control,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      name: "",
      logo: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("logo", data.logo || "");
      setValue("website", data.website || "");
      setValue("description", data.description || "");
    } else {
      reset();
    }
  }, [data]);

  const onSubmit: SubmitHandler<IForm> = (form) => {
    setLoading(true);
    http
      .post("/partners", form)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPartners());
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={open} onOpenChange={() => setOpen(false)}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{data?.id ? "Edit" : "Tambah"} Partner</ModalHeader>
          <ModalBody className="flex flex-col gap-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={errors.name?.message || "Nama partner wajib diisi"}
                  isInvalid={!!errors.name}
                  label="Nama Partner"
                  placeholder="Masukan nama partner"
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={errors.logo?.message}
                  isInvalid={!!errors.logo}
                  label="Logo URL"
                  placeholder="https://..."
                />
              )}
            />

            <Controller
              control={control}
              name="website"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={errors.website?.message}
                  isInvalid={!!errors.website}
                  label="Website"
                  placeholder="https://..."
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <CustomTextArea
                  {...field}
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  label="Deskripsi"
                  minRows={4}
                  placeholder="Deskripsi partner"
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button isDisabled={loading} variant="light" onPress={() => setOpen(false)}>
              Batal
            </Button>
            <Button color="primary" isLoading={loading} type="submit">
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
