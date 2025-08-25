import { Button } from "@heroui/react";
import { Trash2Icon } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
} from "react-hook-form";

import { IForm } from ".";

import CustomInput from "@/components/forms/custom-input";
interface Props {
  control: Control;
  index: number;
  errors: FieldErrors<IForm>;
}
export default function FormOptions({ control, index, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `form_headers.${index}.options`, // nested ke options
  });

  return (
    <div className="ml-6 flex flex-col gap-2 mb-5">
      <h5 className="text-sm text-gray-500">Options</h5>
      {fields.map((opt, j) => {
        const labelError = !!errors?.form_headers?.[index]?.options?.[j]?.label;

        return (
          <div key={opt.id} className="flex gap-2 items-center">
            <Controller
              control={control}
              name={`form_headers.${index}.options.${j}.label`}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage="Field ini harus diisi"
                  isInvalid={labelError}
                  label="Label"
                  labelPlacement="inside"
                  placeholder={`Option ${j + 1}`}
                />
              )}
              rules={{ required: true }}
            />
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() => remove(j)}
            >
              <Trash2Icon className="text-danger" />
            </Button>
          </div>
        );
      })}
      <Button
        color="secondary"
        size="sm"
        type="button"
        onPress={() => append({ label: "" })}
      >
        + Tambah Option
      </Button>
    </div>
  );
}
