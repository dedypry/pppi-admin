import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { useEffect } from "react";

import { IProps } from "..";

import QuillJS from "@/components/forms/quill-js";
import { useAppSelector } from "@/stores/hooks";

export default function History({ isLoading, onSubmit }: IProps) {
  const { apps } = useAppSelector((state) => state.apps);
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      history: "",
    },
  });

  useEffect(() => {
    if (apps) {
      setValue("history", apps.history);
    }
  }, [apps]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm mb-2">Sejarah PPPI</p>
        <Controller
          control={control}
          name="history"
          render={({ field }) => (
            <QuillJS
              isInvalid={!!errors.history}
              label="Sejarah PPPI"
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
