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
} from "@heroui/react";
import {
  SearchIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
  EditIcon,
  EyeIcon,
  Trash2Icon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function MemberPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    status: "all",
    ...Object.fromEntries(queryParams.entries()),
  });

  const { list } = useAppSelector((state) => state.user);
  const route = useNavigate();

  console.log(query);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser({ pageSize: query.pageSize }));
  }, []);

  const debounceSearch = debounce(
    (val: string) => setQueryParams("q", val),
    500,
  );

  function chipColor(status: string) {
    let color = "";

    if (status === "approved") {
      color = "success";
    } else if (status == "rejected") {
      color = "danger";
    } else {
      color = "secondary";
    }

    return color;
  }

  function handleDelete(id: number) {
    http
      .delete(`/users/${id}`)
      .then(({ data }) => {
        dispatch(getUser({ pageSize: query.pageSize }));
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

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between gap-2">
          <div>
            <PageSize
              setSize={(val) => {
                dispatch(getUser({ pageSize: Number(val) }));
              }}
              size={query.pageSize}
            />
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
              color="primary"
              variant="shadow"
              onPress={() => route("/member/create")}
            >
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>
        <CardHeader>
          <div>
            <CustomSelect
              className="w-40"
              label="Status"
              placeholder="Pilih Status"
              selectedKeys={[query.status]}
              onChange={(e) => setQueryParams("status", e.target.value)}
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="submission">Submission</SelectItem>
              <SelectItem key="rejected">Reject</SelectItem>
              <SelectItem key="approved">Approve</SelectItem>
            </CustomSelect>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn className="text-center">Photo</TableColumn>
              <TableColumn className="text-center">User</TableColumn>
              <TableColumn>Address</TableColumn>
              <TableColumn>Latar Belakang</TableColumn>
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
                              dispatch(
                                handleApprove(
                                  {
                                    user_id: user?.id,
                                    approve: false,
                                  },
                                  () =>
                                    dispatch(
                                      getUser({ pageSize: query.pageSize }),
                                    ),
                                ),
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
                                  () =>
                                    dispatch(
                                      getUser({ pageSize: query.pageSize }),
                                    ),
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
                      <p >
                        {" "}
                        {user?.profile?.citizenship.toUpperCase()} -{" "}
                        {user?.profile?.workplace}{" "}
                      </p>
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
          <CardFooter className="flex justify-center">
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
