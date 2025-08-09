import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import CustomInput from "@/components/custom-input";
import CustomTextArea from "@/components/custom-textarea";
import UploadAvatar from "@/components/upload-avatar";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getCategories } from "@/stores/features/categories/actions";

interface Props {
  isOpen: boolean;
  setOpen: CallableFunction;
  onSuccess?: CallableFunction;
  data?: IForm;
}

interface IForm {
  id?: number;
  is_active: boolean;
  name: string;
  icon: string;
  description?: string;
}
export default function ModalCategory({
  isOpen,
  setOpen,
  data,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      is_active: true,
      name: "",
      icon: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("is_active", data.is_active);
      setValue("name", data.name);
      setValue("icon", data.icon);
      setValue("description", data.description);
    }
  }, [data]);

  function onSubmit(data: IForm) {
    setLoading(true);
    http
      .post("/blogs/categories", data)
      .then(({ data }) => {
        notify("Kategori berhasil ditambahkan!!!");
        dispatch(getCategories({}));
        reset();
        onSuccess!(data);
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>{!!data ? "Edit" : "Tambah"} Kategori</ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <UploadAvatar
                  showButtonUpload
                  file={field.value}
                  label="Upload Icon"
                  setFile={(file: string) => field.onChange(file)}
                />
              )}
            />

            <Divider className="my-5" />
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={
                    errors.name?.message ?? "Nama tidak boleh kosong"
                  }
                  isInvalid={!!errors.name}
                  label="Nama Kategori"
                  placeholder="Masukan Nama Kategori"
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <CustomTextArea
                  {...field}
                  label="Deskripsi"
                  placeholder="Masukan Deskripsi"
                />
              )}
            />

            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  {watch("is_active") ? "Is Active" : "Non Active"}
                </Switch>
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
