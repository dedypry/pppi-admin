import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  CardFooter,
  Pagination,
  SelectItem,
  Alert,
  Selection,
} from "@heroui/react";
import {
  SearchIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
  EditIcon,
  EyeIcon,
  Trash2Icon,
  DownloadIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import ExportMembersModal from "./export-modal";
import { MemberExportFieldKey } from "./export-fields";

import debounce from "@/utils/helpers/debounce";
import CustomInput from "@/components/forms/custom-input";
import Gender from "@/components/gender";
import { confirmSweet } from "@/utils/helpers/confirm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUser, handleApprove } from "@/stores/features/user/action";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import EmptyContent from "@/components/empty-content";
import PageSize from "@/components/page-size";
import CustomSelect from "@/components/forms/custom-select";
import { chipColor, handleDownloadExcel } from "@/utils/helpers/global";
import { formatNia, parseJobTitles } from "@/utils/helpers/format";

export default function MemberPage() {
  const { search } = useLocation();
  const [q, setQ] = useState("");
  const queryParams = new URLSearchParams(search);
  const [selectedRows, setSelectedRows] = useState<Selection>(new Set([]));
  const [exporting, setExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [renewingNia, setRenewingNia] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    administrator_roles: string[];
    regions: string[];
    jabatan: string[];
  }>({
    administrator_roles: [],
    regions: [],
    jabatan: [],
  });
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    status: "all",
    verification_status: "all",
    is_need_verify: "all",
    administrator_role: "all",
    region: "all",
    jabatan: "all",
    ...Object.fromEntries(queryParams.entries()),
  });

  const { list } = useAppSelector((state) => state.user);
  const route = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    http
      .get("/members/filter-options")
      .then(({ data }) => {
        setFilterOptions({
          administrator_roles: data?.administrator_roles || [],
          regions: data?.regions || [],
          jabatan: data?.jabatan || [],
        });
      })
      .catch((err) => notifyError(err));
  }, []);

  useEffect(() => {
    dispatch(getUser(query));
  }, []);

  const debounceSearch = debounce(
    (val: string) => setQueryParams("q", val),
    500,
  );

  function handleDelete(id: number) {
    http
      .delete(`/users/${id}`)
      .then(({ data }) => {
        dispatch(getUser(query));
        notify(data.message);
      })
      .catch((err) => notifyError(err));
  }

  function setQueryParams(key: string, value: any) {
    if (key === "q") {
      setQ(value);
    }
    setQuery((val) => ({
      ...val,
      [key]: value,
      ...(key !== "page" && {
        page: 1,
      }),
    }));
  }

  useEffect(() => {
    dispatch(getUser(query));
    const params = new URLSearchParams(query as any).toString();

    route(`?${params}`, { replace: true });
  }, [query]);

  function getSelectedIds() {
    if (selectedRows === "all") {
      return list.data?.map((user) => Number(user?.id)) || [];
    }

    return Array.from(selectedRows).map((id) => Number(id));
  }

  const selectedCount =
    selectedRows === "all" ? list.data?.length || 0 : selectedRows.size;

  function handleSendEmailVerification() {
    const ids = getSelectedIds();

    http
      .post(`/users/send-email-verification`, { ids })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getUser(query));
        setSelectedRows(new Set([]));
      })
      .catch((err) => notifyError(err));
  }

  function handleBulkRenewNia() {
    const ids = getSelectedIds();

    if (!ids.length) {
      notify("Pilih minimal 1 anggota", "error");

      return;
    }

    confirmSweet(
      () => {
        setRenewingNia(true);
        http
          .post(`/members/renew-nia`, { ids })
          .then(({ data }) => {
            notify(data.message || "NIA berhasil diperbaharui");
            dispatch(getUser(query));
            setSelectedRows(new Set([]));
          })
          .catch((err) => notifyError(err))
          .finally(() => setRenewingNia(false));
      },
      {
        text: `Perbaharui NIA untuk ${ids.length} anggota terpilih? Nomor akan diganti dengan urutan terbaru.`,
        confirmButtonText: "Ya, perbaharui",
        confirmButtonColor: "#15980d",
      },
    );
  }

  function handleApproveVerification(id: number, approved: boolean) {
    confirmSweet(
      () => {
        http
          .patch(`/users/${id}/approve-verification`, { approved })
          .then(({ data }) => {
            notify(data.message);
            dispatch(getUser(query));
          })
          .catch((err) => notifyError(err));
      },
      {
        text: approved
          ? "Setujui verifikasi anggota ini?"
          : "Tolak verifikasi anggota ini?",
        confirmButtonText: approved ? "Ya, setujui" : "Ya, tolak",
        confirmButtonColor: approved ? "#15980d" : "#f31260",
      },
    );
  }

  function verificationLabel(status?: string | null) {
    switch (status) {
      case "pending":
        return "Email Terkirim";
      case "re_verified":
        return "Re Verified";
      case "submitted":
        return "Menunggu Approve";
      case "approved":
        return "Terverifikasi";
      case "rejected":
        return "Ditolak";
      default:
        return "Belum Dikirim";
    }
  }

  function verificationColor(status?: string | null) {
    switch (status) {
      case "pending":
        return "warning";
      case "re_verified":
        return "secondary";
      case "submitted":
        return "primary";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  }

  function handleExportExcel(fields: MemberExportFieldKey[]) {
    setExportModalOpen(false);
    handleDownloadExcel(
      "/members/export",
      {
        q: query.q,
        status: query.status,
        verification_status: query.verification_status,
        is_need_verify: query.is_need_verify,
        administrator_role: query.administrator_role,
        region: query.region,
        jabatan: query.jabatan,
        fields: fields.join(","),
      },
      `members-${dayjs().format("YYYYMMDD-HHmmss")}`,
      setExporting,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ExportMembersModal
        isLoading={exporting}
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportExcel}
      />
      <Card>
        <CardHeader className="pb-0">
          <p className="text-sm font-semibold text-gray-700">Filter</p>
        </CardHeader>
        <CardBody>
          <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-4">
            <PageSize
              className="w-full"
              setSize={(val) => setQueryParams("pageSize", val)}
              size={query.pageSize}
            />
            <CustomSelect
              className="w-full"
              label="Status"
              labelPlacement="inside"
              placeholder="Pilih Status"
              selectedKeys={[query.status]}
              onChange={(e) => setQueryParams("status", e.target.value)}
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="submission">Submission</SelectItem>
              <SelectItem key="rejected">Reject</SelectItem>
              <SelectItem key="approved">Approve</SelectItem>
            </CustomSelect>
            <CustomSelect
              className="w-full"
              label="Verifikasi"
              labelPlacement="inside"
              placeholder="Status Verifikasi"
              selectedKeys={[query.verification_status || "all"]}
              onChange={(e) =>
                setQueryParams("verification_status", e.target.value)
              }
            >
              <SelectItem key="all">Semua Verifikasi</SelectItem>
              <SelectItem key="not_sent">Belum Dikirim</SelectItem>
              <SelectItem key="pending">Email Terkirim</SelectItem>
              <SelectItem key="re_verified">Re Verified</SelectItem>
              <SelectItem key="submitted">Menunggu Approve</SelectItem>
              <SelectItem key="approved">Terverifikasi</SelectItem>
              <SelectItem key="rejected">Ditolak</SelectItem>
            </CustomSelect>
            <CustomSelect
              className="w-full"
              label="Butuh Verifikasi"
              labelPlacement="inside"
              placeholder="Butuh Verifikasi"
              selectedKeys={[query.is_need_verify || "all"]}
              onChange={(e) => setQueryParams("is_need_verify", e.target.value)}
            >
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="yes">Butuh Verifikasi</SelectItem>
              <SelectItem key="no">Tidak Butuh</SelectItem>
            </CustomSelect>
            <CustomSelect
              className="w-full"
              label="Pengurus"
              labelPlacement="inside"
              placeholder="Pilih Pengurus"
              selectedKeys={[query.administrator_role || "all"]}
              onChange={(e) =>
                setQueryParams("administrator_role", e.target.value)
              }
            >
              {[
                { key: "all", label: "Semua Pengurus" },
                { key: "has_pengurus", label: "Ada Pengurus" },
                { key: "no_pengurus", label: "Tanpa Pengurus" },
                ...filterOptions.administrator_roles.map((role) => ({
                  key: role,
                  label: role,
                })),
              ].map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </CustomSelect>
            <CustomSelect
              className="w-full"
              label="Wilayah"
              labelPlacement="inside"
              placeholder="Pilih Wilayah"
              selectedKeys={[query.region || "all"]}
              onChange={(e) => setQueryParams("region", e.target.value)}
            >
              {[
                { key: "all", label: "Semua Wilayah" },
                ...filterOptions.regions.map((region) => ({
                  key: region,
                  label: region,
                })),
              ].map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </CustomSelect>
            <CustomSelect
              className="w-full"
              label="Jabatan"
              labelPlacement="inside"
              placeholder="Pilih Jabatan"
              selectedKeys={[query.jabatan || "all"]}
              onChange={(e) => setQueryParams("jabatan", e.target.value)}
            >
              {[
                { key: "all", label: "Semua Jabatan" },
                ...filterOptions.jabatan.map((item) => ({
                  key: item,
                  label: item,
                })),
              ].map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </CustomSelect>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:justify-between">
          <CustomInput
            className="w-full sm:max-w-xs"
            endContent={<SearchIcon className="text-gray-500" />}
            placeholder="Search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              debounceSearch(e.target.value);
            }}
          />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button
              className="w-full sm:w-auto"
              color="success"
              isLoading={exporting}
              startContent={!exporting ? <DownloadIcon size={16} /> : null}
              variant="shadow"
              onPress={() => setExportModalOpen(true)}
            >
              Export Excel
            </Button>
            <Button
              className="w-full sm:w-auto"
              color="primary"
              variant="shadow"
              onPress={() => route("/member/create")}
            >
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {(selectedRows === "all" || selectedRows.size > 0) && (
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-gray-600">
                {selectedCount} anggota dipilih
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="w-full sm:w-auto"
                  color="success"
                  isLoading={renewingNia}
                  size="sm"
                  startContent={
                    !renewingNia ? <RotateCcwIcon size={15} /> : null
                  }
                  variant="flat"
                  onPress={handleBulkRenewNia}
                >
                  Perbaharui No NIA
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  color="danger"
                  size="sm"
                  onPress={handleSendEmailVerification}
                >
                  Kirim Email Verifikasi
                </Button>
              </div>
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              removeWrapper
              className="min-w-[900px]"
              selectedKeys={selectedRows}
              selectionMode="multiple"
              onSelectionChange={(keys) => setSelectedRows(keys)}
            >
              <TableHeader>
                <TableColumn className="text-center">Photo</TableColumn>
                <TableColumn className="text-center">User</TableColumn>
                <TableColumn>Address</TableColumn>
                <TableColumn>Latar Belakang</TableColumn>
                <TableColumn>Status Verifikasi</TableColumn>
                <TableColumn> </TableColumn>
              </TableHeader>
              <TableBody emptyContent={<EmptyContent />}>
                {list.data?.map((user, i) => (
                  <Fragment key={i}>
                    <TableRow
                      key={user?.id}
                      className="cursor-pointer hover:bg-primary-50"
                      onClick={() => route(`/member/${user?.id}`)}
                    >
                      <TableCell>
                        <div className="flex w-40 flex-col items-center gap-2.5">
                          <div className="relative">
                            <Avatar
                              isBordered
                              className="h-20 w-20"
                              color={
                                user?.profile?.gender === "female"
                                  ? "danger"
                                  : "success"
                              }
                              src={user?.profile?.photo}
                            />
                            {user?.administrator_role && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-secondary-600 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
                                {user.administrator_role
                                  .split(" ")[0]
                                  .replace(/[()]/g, "")}
                              </span>
                            )}
                          </div>
                          {user?.nia && (
                            <Chip
                              className="bg-cyan-700 text-white"
                              size="sm"
                              variant="solid"
                            >
                              {formatNia(user?.nia)}
                            </Chip>
                          )}
                          {user?.administrator_role && (
                            <p className="max-w-[9.5rem] text-center text-[11px] leading-snug text-gray-600">
                              {user.administrator_role}
                            </p>
                          )}
                          <Chip
                            color={chipColor(user?.status!) as any}
                            size="sm"
                            variant="dot"
                          >
                            {user?.status}
                          </Chip>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-nowrap justify-center gap-2">
                          <Gender gender={user?.profile?.gender} />
                          <p className="text-nowrap">
                            {user?.front_title} {user?.name}{" "}
                            {user?.back_title}{" "}
                          </p>
                        </div>
                        <p className="pl-5">{user?.email}</p>
                        {parseJobTitles(user?.job_title).length > 0 && (
                          <div className="mt-1 flex flex-wrap justify-center gap-1">
                            {parseJobTitles(user?.job_title).map((title) => (
                              <Chip
                                key={title}
                                color="secondary"
                                size="sm"
                                variant="flat"
                              >
                                {title}
                              </Chip>
                            ))}
                          </div>
                        )}
                        <Button
                          className="mt-1"
                          color="primary"
                          radius="full"
                          size="sm"
                          startContent={<PhoneIcon size={15} />}
                        >
                          Telp. {user?.profile?.phone}
                        </Button>
                        {(!user?.status || user?.status == "submission") && (
                          <div className="mt-2 flex justify-center gap-1">
                            <Button
                              color="danger"
                              radius="full"
                              size="sm"
                              onPress={() =>
                                confirmSweet(
                                  () =>
                                    dispatch(
                                      handleApprove(
                                        {
                                          user_id: user?.id,
                                          approve: false,
                                        },
                                        () => dispatch(getUser(query)),
                                      ),
                                    ),
                                  {
                                    confirmButtonText: "Ya, Tolak",
                                  },
                                )
                              }
                            >
                              Tolak
                            </Button>
                            <Button
                              color="primary"
                              radius="full"
                              size="sm"
                              onPress={() =>
                                dispatch(
                                  handleApprove(
                                    {
                                      user_id: user?.id,
                                      approve: true,
                                    },
                                    () => dispatch(getUser(query)),
                                  ),
                                )
                              }
                            >
                              Setujui
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p>
                          {user?.profile?.district?.name},{" "}
                          {user?.profile?.city?.name} -{" "}
                          {user?.profile?.province?.name}
                        </p>
                        <p>{user?.profile?.address}</p>
                      </TableCell>
                      <TableCell className="max-w-2xl">
                        <p>
                          {user?.profile?.last_education_nursing?.toUpperCase()}{" "}
                          | {user?.profile?.last_education?.toUpperCase()}
                        </p>
                        <p>
                          {" "}
                          {user?.profile?.citizenship.toUpperCase()} -{" "}
                          {user?.profile?.workplace}{" "}
                        </p>
                        {user?.profile?.reason_reject! && (
                          <Alert
                            className="mt-1"
                            classNames={{
                              title: "italic underline",
                              description: "italic",
                            }}
                            color="danger"
                            description={user?.profile?.reason_reject}
                            title="Catatan"
                          />
                        )}
                      </TableCell>
                      <TableCell className="w-60">
                        <div className="flex flex-col gap-2">
                          <Chip
                            color={
                              verificationColor(
                                user?.verification_status,
                              ) as any
                            }
                            size="sm"
                            variant="flat"
                          >
                            {verificationLabel(user?.verification_status)}
                          </Chip>
                          {user?.verification_status === "submitted" && (
                            <div className="flex gap-1">
                              <Button
                                color="success"
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  handleApproveVerification(user.id, true)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  handleApproveVerification(user.id, false)
                                }
                              >
                                Tolak
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly variant="light">
                              <EllipsisVerticalIcon />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="edit"
                              color="warning"
                              startContent={<EditIcon size={20} />}
                              onClick={() => route(`/member/${user?.id}/edit`)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="detail"
                              color="primary"
                              startContent={<EyeIcon size={20} />}
                              onClick={() => route(`/member/${user?.id}`)}
                            >
                              Detail
                            </DropdownItem>
                            <DropdownItem
                              key="hapus"
                              color="danger"
                              startContent={<Trash2Icon size={20} />}
                              onClick={() =>
                                confirmSweet(() => handleDelete(user?.id))
                              }
                            >
                              Hapus
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
        {list?.data?.length > 0 && (
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-gray-600">
                Total : {list?.total || 0} Data
              </p>
            </div>
            <Pagination
              isCompact
              showControls
              initialPage={list.current_page}
              radius="full"
              total={list.last_page}
              onChange={(page) => setQueryParams("page", page)}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
