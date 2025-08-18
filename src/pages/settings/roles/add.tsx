import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";
import { http } from "@/config/axios";
import { useAppDispatch } from "@/stores/hooks";
import { getRoles } from "@/stores/features/roles/action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { IRole } from "@/interface/IUser";

interface Props {
  open: boolean;
  setOpen: CallableFunction;
  data?: IRole;
}
export default function AddRole({ open, setOpen, data }: Props) {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: undefined,
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id as any);
      setValue("title", data.title);
      setValue("description", data.description);
    }
  }, [data]);

  function onSubmit(data: any) {
    http
      .post("/roles", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getRoles({}));
        reset();
        setOpen(false);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Modal isOpen={open} onOpenChange={() => setOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Tambah Role</ModalHeader>
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
              rules={{ required: true }}
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
          <ModalFooter>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
