import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import DeleteAccount from "./delete-accournt";

import InputPassword from "@/components/forms/input-password";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Password settings',
//         href: '/settings/password',
//     },
// ];

interface IForm {
  password: string;
  new_password: string;
  confirm_password: string;
}

export default function Password() {
  const [processing, setProcesing] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  function onSubmit(data: IForm) {
    if (data.new_password != data.confirm_password) {
      notify("Konfirmasi password tidak sama dengan password baru", "error");
    } else {
      setProcesing(true);
      http
        .patch("/profile/password", data)
        .then(({ data }) => {
          notify(data.message);
          reset();
        })
        .catch((err) => notifyError(err))
        .finally(() => setProcesing(false));
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>Keamanan</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <InputPassword
                {...field}
                errorMessage={
                  errors.new_password?.message ||
                  "Password baru tidak boleh kosong"
                }
                isInvalid={!!errors.new_password}
              />
            )}
            rules={{ required: true }}
          />
          <Controller
            control={control}
            name="new_password"
            render={({ field }) => (
              <InputPassword
                {...field}
                errorMessage={
                  errors.new_password?.message ||
                  "Password baru tidak boleh kosong"
                }
                isInvalid={!!errors.new_password}
                label="Password Baru"
                placeholder="Password Baru"
              />
            )}
            rules={{ required: true }}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <InputPassword
                {...field}
                errorMessage={
                  errors.confirm_password?.message ||
                  "Confirm Password tidak boleh kosong"
                }
                isInvalid={!!errors.confirm_password}
                label="Konfirmasi Password"
                placeholder="Masukan Konfirmasi Password"
              />
            )}
            rules={{ required: true }}
          />
        </CardBody>
        <CardBody className="text-xs text-gray-500">
          <p className="font-bold">Persyaratan Kata Sandi:</p>
          <ul className="pl-2">
            <li>Minimal 8 karakter - semakin panjang, semakin baik</li>
            <li>Setidaknya satu huruf kecil</li>
            <li>Setidaknya satu angka, simbol, atau spasi</li>
          </ul>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button
            color="primary"
            isLoading={processing}
            type="submit"
            variant="shadow"
          >
            Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
      <DeleteAccount />
    </form>
  );
}
