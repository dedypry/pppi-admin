import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  SelectItem,
} from "@heroui/react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import FormOptions from "./option";

import CustomInput from "@/components/forms/custom-input";
import QuillJS from "@/components/forms/quill-js";
import CustomSelect from "@/components/forms/custom-select";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export interface IForm {
  id?: number;
  title: string;
  member_required: boolean;
  description: string;
  form_headers: {
    title: string;
    type: string;
    sort: number;
    options: {
      label: string;
    }[];
  }[];
}
export default function FormCreatePage() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    watch,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      title: "",
      member_required: true,
      description: "",
      form_headers: [
        {
          title: "",
          type: "input",
          options: [],
          sort: 0,
        },
      ],
    },
  });

  // pakai useFieldArray untuk form_headers
  const { fields, append, remove } = useFieldArray({
    control,
    name: "form_headers",
  });

  const types = ["input", "region", "select", "check", "radio"];

  const onSubmit = (data: IForm) => {
    setLoading(true);
    console.log("Form result: ", data);

    http
      .post("/form", data)
      .then(({ data }) => {
        notify(data.message);
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader as="h4">Buat Form</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Controller
            control={control}
            name="member_required"
            render={({ field }) => (
              <Checkbox
                isSelected={field.value}
                onValueChange={(val) => field.onChange(val)}
              >
                Wajib Anggota
              </Checkbox>
            )}
          />
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <CustomInput
                {...field}
                errorMessage="Judul tidak boleh kosong"
                isInvalid={!!errors.title}
                label="Judul"
                labelPlacement="inside"
                placeholder="Masukan Judul"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <QuillJS
                label="Deskripsi"
                value={field.value}
                onContent={(val) => field.onChange(val)}
              />
            )}
          />
        </CardBody>

        <CardBody>
          <h4 className="mb-2">Properti</h4>

          {fields.map((item, i) => {
            const type = watch(`form_headers.${i}.type`);

            return (
              <div key={item.id}>
                <div className="flex gap-2 items-center mb-3">
                  <Controller
                    control={control}
                    name={`form_headers.${i}.title`}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        label="Title"
                        labelPlacement="inside"
                        placeholder="Nama Properti"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`form_headers.${i}.type`}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        className="w-xs"
                        label="Pilih Type"
                        labelPlacement="inside"
                        selectedKeys={[item.type]}
                      >
                        {types.map((item) => (
                          <SelectItem key={item}>{item}</SelectItem>
                        ))}
                      </CustomSelect>
                    )}
                  />

                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={() => remove(i)}
                  >
                    <Trash2Icon className="text-danger" />
                  </Button>
                </div>

                {["select", "check", "radio"].includes(type) && (
                  <FormOptions
                    control={control as any}
                    errors={errors}
                    index={i}
                  />
                )}
              </div>
            );
          })}

          <Button
            color="secondary"
            type="button"
            onPress={() =>
              append({
                title: "",
                type: "input",
                sort: watch("form_headers").length,
                options: [],
              })
            }
          >
            Tambah Properti
          </Button>
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button color="primary" isLoading={loading} type="submit">
            Simpan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
