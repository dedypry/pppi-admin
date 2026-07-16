import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { EditIcon, SearchIcon } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CustomInput from "@/components/forms/custom-input";
import CustomSelect from "@/components/forms/custom-select";
import InputPassword from "@/components/forms/input-password";
import EmptyContent from "@/components/empty-content";
import PageSize from "@/components/page-size";
import debounce from "@/utils/helpers/debounce";
import { IRole, IUser } from "@/interface/IUser";
import { IPagination } from "@/interface/IPagination";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { formatNia } from "@/utils/helpers/format";

interface IForm {
  roleId: string[];
  password: string;
  is_active: string;
}

export default function UserManagementPage() {
  const { search } = useLocation();
  const route = useNavigate();
  const queryParams = new URLSearchParams(search);
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    ...Object.fromEntries(queryParams.entries()),
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<IPagination<IUser[]> | null>(null);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selected, setSelected] = useState<IUser>();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      roleId: [],
      password: "",
      is_active: "true",
    },
  });

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  useEffect(() => {
    if (selected) {
      setValue(
        "roleId",
        (selected.roles || []).map((item) => String(item.id)),
      );
      setValue("is_active", String(selected.is_active));
      setValue("password", "");
    } else {
      reset();
    }
  }, [selected]);

  const debounceSearch = debounce(
    (val: string) => setQueryParams("q", val),
    500,
  );

  function setQueryParams(key: string, value: string | number) {
    setQuery((val) => ({
      ...val,
      [key]: value,
      ...(key === "q" && {
        page: 1,
      }),
    }));
  }

  function getUsers() {
    http
      .get(
        `/users?page=${query.page}&pageSize=${query.pageSize}&q=${encodeURIComponent(query.q || "")}`,
      )
      .then(({ data }) => setUsers(data))
      .catch((err) => notifyError(err));
  }

  function getRoles() {
    http
      .get("/roles")
      .then(({ data }) => setRoles(data))
      .catch((err) => notifyError(err));
  }

  useEffect(() => {
    getUsers();
    const params = new URLSearchParams(query as any).toString();

    route(`?${params}`, { replace: true });
  }, [query]);

  const onSubmit: SubmitHandler<IForm> = (form) => {
    if (!selected) return;

    setLoading(true);
    const roleId = Array.isArray(form.roleId)
      ? form.roleId
      : String(form.roleId || "")
          .split(",")
          .filter(Boolean)
          .map((id: string) => id);

    http
      .patch(`/users/${selected.id}/settings`, {
        roleId,
        password: form.password,
        is_active: form.is_active === "true",
      })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        setSelected(undefined);
        getUsers();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal isOpen={open} onOpenChange={() => setOpen(false)}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Pengaturan User</ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
                <p className="text-sm font-semibold text-primary-700">
                  {selected?.name}
                </p>
                <p className="text-xs text-primary-600">{selected?.email}</p>
              </div>

              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    errorMessage={errors.roleId?.message || "Role wajib dipilih"}
                    isInvalid={!!errors.roleId}
                    label="Role"
                    selectedKeys={field.value}
                    selectionMode="multiple"
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {roles.map((item) => (
                      <SelectItem key={item.id}>{item.title}</SelectItem>
                    ))}
                  </CustomSelect>
                )}
                rules={{ required: true }}
              />

              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Status User"
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
                name="password"
                render={({ field }) => (
                  <InputPassword
                    {...field}
                    description="Kosongkan jika tidak ingin mengubah password"
                    label="Password Baru"
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setOpen(false)}>
                Batal
              </Button>
              <Button color="primary" isLoading={loading} type="submit">
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <p className="text-lg font-bold">Management User</p>
            <p className="text-sm text-gray-500">
              Kelola peran, status aktif, dan reset password user aplikasi.
            </p>
          </div>
          <div className="flex gap-2">
            <PageSize
              setSize={(val) => setQueryParams("pageSize", val)}
              size={query.pageSize}
            />
            <CustomInput
              defaultValue={query.q}
              endContent={<SearchIcon className="text-gray-500" />}
              placeholder="Cari nama / email / NIA"
              onChange={(e) => debounceSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Email / NIA</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {(users?.data || []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <p>{item.email}</p>
                    <p className="text-xs text-gray-500">
                      {item.nia ? formatNia(item.nia) : "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(item.roles || []).map((role) => (
                        <Chip key={role.id} color="primary" size="sm" variant="flat">
                          {role.title}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.is_active ? "success" : "default"}
                      variant="dot"
                    >
                      {item.is_active ? "aktif" : "nonaktif"}
                    </Chip>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        {(users?.data || []).length > 0 && (
          <CardFooter className="flex justify-between">
            <p className="font-bold text-gray-600">Total : {users?.total || 0} Data</p>
            <Pagination
              isCompact
              showControls
              initialPage={users?.current_page}
              radius="full"
              total={users?.last_page || 1}
              onChange={(page) => setQueryParams("page", page)}
            />
          </CardFooter>
        )}
      </Card>
    </>
  );
}
