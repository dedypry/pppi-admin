import { Button, Card, CardBody, CardFooter, Divider } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import { IProps } from ".";

import CustomInput from "@/components/forms/custom-input";
import UploadAvatar from "@/components/forms/upload-avatar";
import { useAppSelector } from "@/stores/hooks";

export default function ContentLeft({ isLoading, onSubmit }: IProps) {
  const { apps } = useAppSelector((state) => state.apps);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      logo: "",
      instagram: "",
      facebook: "",
      tiktok: "",
    },
  });

  useEffect(() => {
    if (apps) {
      setValue("logo", apps.logo);
    }
  }, [apps]);

  return (
    <Card className="sticky top-20">
      <CardBody className="flex justify-center items-center">
        {/* <Avatar className="w-[200px] h-[200px]" src="/logo.png" /> */}
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <UploadAvatar
              file={field.value}
              setFile={(file: string) => field.onChange(file)}
            />
          )}
        />
      </CardBody>
      <CardBody className="flex flex-col gap-5">
        <Divider />
        <Controller
          control={control}
          name="instagram"
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Instagram"
              placeholder="Masukan Instagram"
            />
          )}
        />
        <Controller
          control={control}
          name="facebook"
          render={({ field }) => (
            <CustomInput
              {...field}
              label="facebook"
              placeholder="Masukan facebook"
            />
          )}
        />
        <Controller
          control={control}
          name="tiktok"
          render={({ field }) => (
            <CustomInput
              {...field}
              label="tiktok"
              placeholder="Masukan tiktok"
            />
          )}
        />
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button
          color="primary"
          isLoading={isLoading}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Simpan
        </Button>
      </CardFooter>
    </Card>
  );
}
