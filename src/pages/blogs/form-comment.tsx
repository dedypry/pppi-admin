import { Button, Textarea } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { socket } from "@/utils/helpers/socket.io";
import { ICreateBlogComment } from "@/interface/IBlogs";
import { setUserComment } from "@/stores/features/auth/authSlice";
import UploadAvatar from "@/components/forms/upload-avatar";
import CustomInput from "@/components/forms/custom-input";

interface Props {
  blogId: number;
  parentId?: number;
}
export default function FormComment({ blogId, parentId }: Props) {
  const { userCommnet } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  const [processing, setProcessing] = useState(false);
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateBlogComment>({
    defaultValues: {
      blog_id: blogId,
      parent_id: undefined,
      content: "",
      name: "",
      email: "",
      website: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (parentId) {
      setValue("parent_id", parentId);
    }

    if (userCommnet) {
      setValue("name", userCommnet.name);
      setValue("email", userCommnet.email);
    }
  }, [parentId, userCommnet]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("avatar", user.profile?.photo);
      dispatch(
        setUserComment({
          show: true,
          name: user.name,
          email: user.email,
          avatar: user.profile?.photo,
        }),
      );
    }
  }, [user]);

  function onSubmit(data: ICreateBlogComment) {
    setProcessing(true);

    socket.emit("sendComment", data);
    setProcessing(false);
    setValue("content", "");
    dispatch(
      setUserComment({
        show: !!data.name && !!data.email,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      }),
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Textarea
                {...field}
                isRequired
                errorMessage={
                  errors.content?.message || "Commentar tidak boleh kosong"
                }
                isInvalid={!!errors.content}
                label="Komentar"
                placeholder="berikan komentar terbaik anda"
              />
            )}
            rules={{ required: true }}
          />
        </div>

        {!userCommnet?.show && (
          <>
            <div className="col-span-3 row-span-3 py-10">
              <Controller
                control={control}
                name="avatar"
                render={({ field }) => (
                  <UploadAvatar
                    file={field.value}
                    setFile={(file: string) => field.onChange(file)}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-9">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    errorMessage={
                      errors.name?.message || "Nama Tidak Boleh Kosong"
                    }
                    isInvalid={!!errors.name}
                    label="Nama"
                    placeholder="masukan nama samaran atau nama asli"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-9">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    errorMessage={
                      errors.email?.message || "Email tidak boleh kosong"
                    }
                    isInvalid={!!errors.email}
                    label="Email"
                    placeholder="Masukan Email Aktif"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-9">
              <Controller
                control={control}
                name="website"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="Website"
                    placeholder="isi jika anda punya"
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          isLoading={processing}
          radius="full"
          size="sm"
          type="submit"
          variant="bordered"
        >
          Simpan Komentar
        </Button>
      </div>
    </form>
  );
}
