import {
  Card,
  CardHeader,
  CardBody,
  SelectItem,
  CardFooter,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { IRole } from "@/interface/IUser";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import CustomSelect from "@/components/forms/custom-select";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUserDetail } from "@/stores/features/user/action";
import InputPassword from "@/components/forms/input-password";

interface IForm {
  roleId: string[];
  password?: string;
}

export default function FormSetting() {
  const { detail: user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    getRole();
  }, []);

  function getRole() {
    http
      .get("/roles")
      .then(({ data }) => {
        setRoles(data);
      })
      .catch((err) => notifyError(err));
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      roleId: [],
      password: "",
    },
  });

  useEffect(() => {
    if (user && user.roles) {
      setValue(
        "roleId",
        user.roles.map((e) => String(e.id)),
      );
    }
  }, [user]);

  function onSubmit(data: IForm) {
    if (typeof data.roleId == "string") {
      data.roleId = (data.roleId as any)
        .split(",")
        .filter(Boolean)
        .map((id: string) => id);
      setLoading(true);
    }

    http
      .patch(`/members/settings/${user?.id}`, data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getUserDetail({ id: user?.id as any }));
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>Pengaturan</CardHeader>
        <CardBody className="flex flex-col gap-6">
          <Controller
            control={control}
            name="roleId"
            render={({ field }) => (
              <CustomSelect
                {...field}
                errorMessage={
                  errors.roleId?.message || "Role Tidak boleh kosong"
                }
                isInvalid={!!errors.roleId}
                label="Roles"
                placeholder="Pilih Role"
                selectedKeys={field.value}
                selectionMode="multiple"
              >
                {roles &&
                  roles
                    .filter((e) => e.slug != "super-admin")
                    .map((e) => (
                      <SelectItem key={e.id}>
                        {e.title.replace("-", " ").toUpperCase()}
                      </SelectItem>
                    ))}
              </CustomSelect>
            )}
            rules={{ required: true }}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => <InputPassword {...field} />}
          />
        </CardBody>
        <CardFooter>
          <Button fullWidth color="primary" isLoading={loading} type="submit">
            Simpan Pengaturan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
