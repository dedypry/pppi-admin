import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
} from "@heroui/react";
import { MailIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

import { apps } from "@/config/app";
import CustomInput from "@/components/forms/custom-input";
import InputPassword from "@/components/forms/input-password";
import { http } from "@/config/axios";
import { useAppDispatch } from "@/stores/hooks";
import { setToken } from "@/stores/features/auth/authSlice";
import { notify, notifyError } from "@/utils/helpers/notify";

type FormValues = {
  email: string;
  password: string;
  type: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const route = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      type: "admin",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setIsLoading(true);
    http
      .post("/auth/login", data)
      .then(({ data }) => {
        dispatch(setToken(data.token));
        notify("Login Success");
        route("/");
      })
      .catch((err) => notifyError(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <main>
      <form className="w-full max-w-md px-5" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full md:p-5 p-2">
          <CardHeader className="flex justify-center gap-3">
            <img alt="Logo" height={50} src={apps.logo} width={50} />
            <h1 className="text-[30px] font-bold">{apps?.short_name}</h1>
          </CardHeader>
          <CardHeader className="flex justify-center">
            <h5>{apps.full_name} 🇮🇩</h5>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Email / NIA"
                  placeholder="Masukan Email atau NIA"
                  {...(errors.email && {
                    isInvalid: true,
                    errorMessage: "Email / NIA tidak boleh kosong",
                  })}
                  startContent={
                    <MailIcon
                      className={
                        errors.email ? "text-danger" : "text-secondary-600"
                      }
                      size={20}
                    />
                  }
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <InputPassword
                  {...field}
                  {...(errors.password && {
                    isInvalid: true,
                    errorMessage: "Password tidak boleh kosong",
                  })}
                />
              )}
              rules={{ required: true }}
            />

            <div className="flex justify-between">
              <Checkbox>Ingat Saya</Checkbox>
              <Link className="text-sm" to="/forgot-password">
                Lupa Password
              </Link>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col gap-3">
            <Button
              fullWidth
              color="primary"
              isLoading={isLoading}
              type="submit"
            >
              Masuk
            </Button>

            <div className="flex w-full items-center gap-2 text-sm text-gray-500">
              <Divider className="flex-1" />
              <span className="whitespace-nowrap">OR</span>
              <Divider className="flex-1" />
            </div>

            <Button
              fullWidth
              color="primary"
              variant="bordered"
              onPress={() => {}}
            >
              Daftar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
