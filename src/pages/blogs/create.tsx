import {
  Card,
  CardHeader,
  CardBody,
  Switch,
  CardFooter,
  Button,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddCategory from "./add-category";

import AttachmentSingleFile from "@/components/attacment-singgle-file";
import CustomDatePicker from "@/components/custom-date-picker";
import CustomInput from "@/components/custom-input";
import QuillJS from "@/components/quill-js";
import { dateFormat } from "@/utils/helpers/formater";
import InputTags from "@/components/input-tags";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBlogDetail } from "@/stores/features/blogs/actions";

interface IForm {
  id?: number;
  cover: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  status: string;
  is_draft: boolean;
  category_id: number;
  schedule: string;
}

export default function BlogCreate() {
  const { blog } = useAppSelector((state) => state.blogs);
  const [loading, setLoading] = useState(false);
  const route = useNavigate();
  const { id } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getBlogDetail({ id: id as any }));
    }
  }, [id]);

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      cover: "",
      title: "",
      subtitle: "",
      content: "",
      tags: [],
      status: "",
      is_draft: false,
      category_id: 1,
      schedule: dateFormat(new Date().toISOString()),
    },
  });

  useEffect(() => {
    if (id && blog) {
      setValue("id", blog.id);
      setValue("cover", blog.cover);
      setValue("title", blog.title);
      setValue("subtitle", blog.subtitle);
      setValue("content", blog.content);
      setValue("tags", blog.tags);
      setValue("status", blog.status);
      setValue("is_draft", blog.status === "draft");
      setValue("category_id", blog.category_id);
      setValue("schedule", dateFormat(blog.schedule));
    }
  }, [blog]);

  function onSubmit(data: IForm) {
    setLoading(true);
    http
      .post("/blogs", data)
      .then(({ data }) => {
        reset();
        notify(data.message);
        route("/blogs");
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <form className="grid grid-cols-12" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-span-8 space-y-5">
        <Controller
          control={control}
          name="cover"
          render={({ field }) => (
            <AttachmentSingleFile
              errorMessage={errors.cover?.message || "Cover Tidak Boleh Kosong"}
              file={field.value}
              isInvalid={!!errors.cover}
              label="Cover"
              setFile={(val: any) => field.onChange(val)}
            />
          )}
          rules={{ required: true }}
        />

        <Card>
          <CardHeader>Blog</CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  isRequired
                  errorMessage={
                    errors.title?.message ?? "Judul tidak boleh kosong"
                  }
                  isInvalid={!!errors.title}
                  label="Judul"
                  placeholder="Masukan Judul"
                />
              )}
              rules={{ required: true }}
            />
            <Controller
              control={control}
              name="subtitle"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  errorMessage={
                    errors.subtitle?.message || "Sub Judul Tidak boleh kosong"
                  }
                  isInvalid={!!errors.subtitle}
                  label="Subtitle"
                  placeholder="Masukan Sub Judul"
                />
              )}
              rules={{ required: true }}
            />

            <div>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <>
                    <QuillJS
                      isInvalid={!!errors.content}
                      label="Content"
                      value={field.value}
                      onContent={(val) => field.onChange(val)}
                    />
                    {errors.content && (
                      <p className="text-danger">
                        {errors.content?.message ||
                          "Content tidak boleh kosong"}
                      </p>
                    )}
                  </>
                )}
                rules={{ required: true }}
              />
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="col-span-4 pl-3">
        <Card className="sticky top-16">
          <CardBody className="flex flex-col gap-4">
            <Controller
              control={control}
              name="is_draft"
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  Save To Draft
                </Switch>
              )}
            />

            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <AddCategory
                  errorMessage={
                    errors.category_id?.message || "Category Tidak boleh kosong"
                  }
                  isInvalid={!!errors.category_id}
                  setValue={(val: number) => field.onChange(val)}
                  value={field.value}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <InputTags
                  errorMessage={
                    errors.tags?.message ?? "Tags tidak boleh kosong"
                  }
                  isInvalid={!!errors.tags}
                  items={field.value}
                  label="Tags"
                  placeholder="Input Tags"
                  onTags={(val: string[]) => field.onChange(val)}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="schedule"
              render={({ field }) => (
                <CustomDatePicker
                  label="Atur Jadwal Rilis"
                  value={field.value}
                  onChageValue={(val: string) => field.onChange(val)}
                />
              )}
              rules={{ required: true }}
            />
          </CardBody>
          <CardFooter>
            <Button fullWidth color="primary" isLoading={loading} type="submit">
              Simpan Blog
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
