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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
import { parseJobTitles } from "@/utils/helpers/format";

export default function MemberPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [selectedRows, setSelectedRows] = useState<Selection>(new Set([]));
  const [exporting, setExporting] = useState(false);
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    status: "submission",
    verification_status: "all",
    is_need_verify: "all",
    ...Object.fromEntries(queryParams.entries()),
  });

  const { list } = useAppSelector((state) => state.user);
  const route = useNavigate();

  const dispatch = useAppDispatch();

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
    setQuery((val) => ({
      ...val,
      [key]: value,
      ...(key === "q" && {
        page: 1,
      }),
    }));
  }

  useEffect(() => {
    dispatch(getUser(query));
    const params = new URLSearchParams(query as any).toString();

    route(`?${params}`, { replace: true });
  }, [query]);

  function handleSendEmailVerification() {
    let ids: number[] = [];

    if (selectedRows === "all") {
      ids = list.data?.map((user) => Number(user?.id)) || [];
    } else {
      ids = Array.from(selectedRows).map((id) => Number(id));
    }
    http
      .post(`/users/send-email-verification`, { ids })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getUser(query));
        setSelectedRows(new Set([]));
      })
      .catch((err) => notifyError(err));
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

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between gap-2">
          <div className="flex gap-2">
            <PageSize
              setSize={(val) => setQueryParams("pageSize", val)}
              size={query.pageSize}
            />
            <CustomSelect
              className="w-40"
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
              className="w-48"
              label="Verifikasi"
              labelPlacement="inside"
              placeholder="Status Verifikasi"
              selectedKeys={[query.verification_status || "all"]}
              onChange={(e) =>
                setQueryParams("verification_status", e.target.value)
              }
            >
              <SelectItem key="all">Semua Verifikasi</SelectItem>
              <SelectItem key="pending">Email Terkirim</SelectItem>
              <SelectItem key="re_verified">Re Verified</SelectItem>
              <SelectItem key="submitted">Menunggu Approve</SelectItem>
              <SelectItem key="approved">Terverifikasi</SelectItem>
              <SelectItem key="rejected">Ditolak</SelectItem>
            </CustomSelect>
            <CustomSelect
              className="w-48"
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
          </div>
          <div className="flex justify-between gap-2">
            <div>
              <CustomInput
                defaultValue={query.q || ""}
                endContent={<SearchIcon className="text-gray-500" />}
                placeholder="Search"
                onChange={(e) => {
                  debounceSearch(e.target.value);
                }}
              />
            </div>
            <Button
              color="success"
              isLoading={exporting}
              startContent={!exporting ? <DownloadIcon size={16} /> : null}
              variant="shadow"
              onPress={() =>
                handleDownloadExcel(
                  "/members/export",
                  {
                    q: query.q,
                    status: query.status,
                    verification_status: query.verification_status,
                    is_need_verify: query.is_need_verify,
                  },
                  `members-${dayjs().format("YYYYMMDD-HHmmss")}`,
                  setExporting,
                )
              }
            >
              Export Excel
            </Button>
            <Button
              color="primary"
              variant="shadow"
              onPress={() => route("/member/create")}
            >
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex justify-between mb-4">
            <div />
            {(selectedRows === "all" || selectedRows.size > 0) && (
              <Button
                color="danger"
                size="sm"
                onPress={handleSendEmailVerification}
              >
                Kirim Email Verifikasi
              </Button>
            )}
          </div>
          <Table
            removeWrapper
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
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Avatar
                          isBordered
                          className="h-20 w-20"
                          src={user?.profile?.photo}
                        />
                        {user?.nia && (
                          <Chip className="bg-cyan-700 text-white" size="sm">
                            {user?.nia}
                          </Chip>
                        )}
                        <Chip
                          color={chipColor(user?.status!) as any}
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
                            <Chip key={title} color="secondary" size="sm" variant="flat">
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
                        {user?.profile?.last_education_nursing?.toUpperCase()} |{" "}
                        {user?.profile?.last_education?.toUpperCase()}
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
                          color={verificationColor(user?.verification_status) as any}
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
        </CardBody>
        {list?.data?.length > 0 && (
          <CardFooter className="flex justify-between">
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
    </>
  );
}
