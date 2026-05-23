import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { EditIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import CustomInput from "@/components/forms/custom-input";
import CustomTextArea from "@/components/forms/custom-textarea";
import CustomSelect from "@/components/forms/custom-select";
import { IDepartment } from "@/interface/IUser";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { confirmSweet } from "@/utils/helpers/confirm";
import EmptyContent from "@/components/empty-content";

interface IForm {
  id?: number;
  name: string;
  code: string;
  description: string;
  is_active: string;
}

export default function DepartmentPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [selected, setSelected] = useState<IDepartment>();

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      name: "",
      code: "",
      description: "",
      is_active: "true",
    },
  });

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    if (selected) {
      setValue("id", selected.id);
      setValue("name", selected.name);
      setValue("code", selected.code || "");
      setValue("description", selected.description || "");
      setValue("is_active", String(selected.is_active));
    } else {
      reset();
    }
  }, [selected]);

  function getDepartment() {
    http
      .get("/departments")
      .then(({ data }) => setDepartments(data))
      .catch((err) => notifyError(err));
  }

  function handleDelete(id: number) {
    http
      .delete(`/departments/${id}`)
      .then(({ data }) => {
        notify(data.message);
        getDepartment();
      })
      .catch((err) => notifyError(err));
  }

  const onSubmit: SubmitHandler<IForm> = (form) => {
    setLoading(true);

    http
      .post("/departments", {
        ...form,
        is_active: form.is_active === "true",
      })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        setSelected(undefined);
        reset();
        getDepartment();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal isOpen={open} onOpenChange={() => setOpen(false)}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {selected?.id ? "Edit Department" : "Tambah Department"}
            </ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    errorMessage={
                      errors.name?.message || "Nama department wajib diisi"
                    }
                    isInvalid={!!errors.name}
                    label="Nama Department"
                    placeholder="Masukan nama department"
                  />
                )}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    errorMessage={errors.code?.message}
                    isInvalid={!!errors.code}
                    label="Kode"
                    placeholder="Contoh: IT, HR, ADM"
                  />
                )}
              />
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Status"
                    selectedKeys={[field.value]}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <SelectItem key="true">Aktif</SelectItem>
                    <SelectItem key="false">Nonaktif</SelectItem>
                  </CustomSelect>
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <CustomTextArea
                    {...field}
                    label="Deskripsi"
                    minRows={3}
                    placeholder="Deskripsi fungsi department"
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={loading}
                variant="light"
                onPress={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button color="primary" isLoading={loading} type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <p className="text-lg font-bold">Department</p>
            <p className="text-sm text-gray-500">
              Kelola daftar department untuk klasifikasi unit kerja internal.
            </p>
          </div>
          <Button
            color="primary"
            startContent={<PlusCircleIcon size={16} />}
            onPress={() => {
              setSelected(undefined);
              reset();
              setOpen(true);
            }}
          >
            Tambah Department
          </Button>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Kode</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {departments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code || "-"}</TableCell>
                  <TableCell className="max-w-lg">{item.description || "-"}</TableCell>
                  <TableCell>
                    <Chip color={item.is_active ? "success" : "default"} variant="dot">
                      {item.is_active ? "aktif" : "nonaktif"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                      >
                        <EditIcon className="text-warning" size={17} />
                      </Button>
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() =>
                          confirmSweet(() => handleDelete(item.id), {
                            text: "Data department akan dihapus permanen",
                          })
                        }
                      >
                        <Trash2Icon className="text-danger" size={17} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
