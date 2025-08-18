import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { useEffect } from "react";

import { IProps } from "..";

import QuillJS from "@/components/forms/quill-js";
import { useAppSelector } from "@/stores/hooks";

export default function VisiMisi({ isLoading, onSubmit }: IProps) {
  const { apps } = useAppSelector((state) => state.apps);

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      visi_misi: "",
    },
  });

  useEffect(() => {
    if (apps) {
      setValue("visi_misi", apps.visi_misi);
    }
  }, [apps]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm mb-2">Visi dan Misi</p>
        <Controller
          control={control}
          name="visi_misi"
          render={({ field }) => (
            <QuillJS
              isInvalid={!!errors.visi_misi}
              label="Visi"
              value={field.value}
              onContent={(val) => field.onChange(val)}
            />
          )}
          rules={{ required: true }}
        />
      </div>
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
