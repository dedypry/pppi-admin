import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { useEffect } from "react";

import { IProps } from "..";

import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";
import { useAppSelector } from "@/stores/hooks";

export default function FormPersonal({ isLoading, onSubmit }: IProps) {
  const { apps } = useAppSelector((state) => state.apps);
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      title: "",
      short_title: "",
      telp_1: "",
      telp_2: "",
      address: "",
      email: "",
    },
  });

  useEffect(() => {
    if (apps) {
      setValue("title", apps.title);
      setValue("short_title", apps.short_title);
      setValue("telp_1", apps.telp_1);
      setValue("telp_2", apps.telp_2!);
      setValue("address", apps.address);
      setValue("email", apps.email);
    }
  }, [apps]);

  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <CustomInput
            {...field}
            errorMessage={
              errors.title?.message || "Nama Panjang tidak boleh kosong"
            }
            isInvalid={!!errors.title}
            label="Nama Panjang"
            placeholder="Nama Panjang"
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="short_title"
        render={({ field }) => (
          <CustomInput
            {...field}
            errorMessage={
              errors.title?.message || "Nama Pendek tidak boleh kosong"
            }
            isInvalid={!!errors.title}
            label="Nama Pendek (Singkatan)"
            placeholder="Nama Pendek"
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <CustomInput
            {...field}
            errorMessage={errors.title?.message || "Email tidak boleh kosong"}
            isInvalid={!!errors.title}
            label="Email"
            placeholder="masukan email"
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="telp_1"
        render={({ field }) => (
          <CustomInput
            {...field}
            errorMessage={errors.title?.message || "Telp tidak boleh kosong"}
            isInvalid={!!errors.title}
            label="Telp 1"
            placeholder="masukan no telp"
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="telp_2"
        render={({ field }) => (
          <CustomInput
            {...field}
            errorMessage={errors.title?.message || "Telp tidak boleh kosong"}
            isInvalid={!!errors.title}
            label="Telp 2"
            placeholder="masukan no telp"
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <CustomTextarea
            {...field}
            errorMessage={errors.title?.message || "Alamat tidak boleh kosong"}
            isInvalid={!!errors.title}
            label="Alamat"
            placeholder="masukan alamat"
          />
        )}
        rules={{ required: true }}
      />
      <div className="text-right">
        <Button
          color="primary"
          isLoading={isLoading}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Simpan
        </Button>
      </div>
    </div>
  );
}
