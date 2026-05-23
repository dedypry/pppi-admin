import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  EllipsisVerticalIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageSize from "@/components/page-size";
import EmptyContent from "@/components/empty-content";
import CustomSelect from "@/components/forms/custom-select";
import CustomInput from "@/components/forms/custom-input";
import debounce from "@/utils/helpers/debounce";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPackageInterests } from "@/stores/features/package-interests/action";
import { dateTimeFormat } from "@/utils/helpers/formater";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { TPackageInterestStatus } from "@/interface/IPartner";

function getStatusColor(status: TPackageInterestStatus) {
  if (status === "closed") return "success";
  if (status === "follow_up") return "warning";

  return "primary";
}

export default function PackageInterestPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    status: "all",
    ...Object.fromEntries(queryParams.entries()),
  });
  const dispatch = useAppDispatch();
  const route = useNavigate();
  const { list } = useAppSelector((state) => state.packageInterests);

  useEffect(() => {
    dispatch(getPackageInterests(query));
  }, []);

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

  function handleUpdateStatus(id: number, status: TPackageInterestStatus) {
    http
      .patch(`/package-interests/${id}/status`, {
        status,
      })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPackageInterests(query));
      })
      .catch((err) => notifyError(err));
  }

  function handleDelete(id: number) {
    http
      .delete(`/package-interests/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPackageInterests(query));
      })
      .catch((err) => notifyError(err));
  }

  useEffect(() => {
    dispatch(getPackageInterests(query));
    const params = new URLSearchParams(query as any).toString();

    route(`?${params}`, { replace: true });
  }, [query]);

  return (
    <Card>
      <CardHeader className="flex justify-between gap-2">
        <div className="flex gap-2">
          <PageSize
            setSize={(val) => setQueryParams("pageSize", val)}
            size={query.pageSize}
          />
          <CustomSelect
            className="w-44"
            label="Status"
            labelPlacement="inside"
            placeholder="Pilih Status"
            selectedKeys={[query.status]}
            onChange={(e) => setQueryParams("status", e.target.value)}
          >
            <SelectItem key="all">Semua</SelectItem>
            <SelectItem key="new">Baru</SelectItem>
            <SelectItem key="follow_up">Follow Up</SelectItem>
            <SelectItem key="closed">Selesai</SelectItem>
          </CustomSelect>
        </div>
        <CustomInput
          defaultValue={query.q || ""}
          endContent={<SearchIcon className="text-gray-500" />}
          placeholder="Cari nama, email, telepon, paket"
          onChange={(e) => debounceSearch(e.target.value)}
        />
      </CardHeader>

      <CardBody>
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Waktu</TableColumn>
            <TableColumn>Paket</TableColumn>
            <TableColumn>Identitas</TableColumn>
            <TableColumn>Instansi & Catatan</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody emptyContent={<EmptyContent />}>
            {(list?.data || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{dateTimeFormat(item.created_at)}</TableCell>
                <TableCell>
                  <p className="font-semibold">{item.package_title}</p>
                  <p className="text-xs italic text-gray-600">
                    {item.package_group}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{item.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                    <MailIcon size={14} /> {item.email}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                    <PhoneIcon size={14} /> {item.phone}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{item.institution || "-"}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {item.note || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <Chip color={getStatusColor(item.status) as any} variant="dot">
                    {item.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly radius="full" size="sm" variant="light">
                        <EllipsisVerticalIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="status-new"
                        onPress={() => handleUpdateStatus(item.id, "new")}
                      >
                        Tandai Baru
                      </DropdownItem>
                      <DropdownItem
                        key="status-follow"
                        color="warning"
                        onPress={() => handleUpdateStatus(item.id, "follow_up")}
                      >
                        Tandai Follow Up
                      </DropdownItem>
                      <DropdownItem
                        key="status-closed"
                        color="success"
                        onPress={() => handleUpdateStatus(item.id, "closed")}
                      >
                        Tandai Selesai
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        color="danger"
                        startContent={<Trash2Icon size={16} />}
                        onPress={() => confirmSweet(() => handleDelete(item.id))}
                      >
                        Hapus
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>

      {(list?.data || []).length > 0 && (
        <CardFooter className="flex justify-between">
          <p className="font-bold text-gray-600">Total : {list?.total || 0} Data</p>
          <Pagination
            isCompact
            showControls
            initialPage={list?.current_page}
            radius="full"
            total={list?.last_page || 1}
            onChange={(page) => setQueryParams("page", page)}
          />
        </CardFooter>
      )}
    </Card>
  );
}
