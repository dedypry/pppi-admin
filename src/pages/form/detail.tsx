import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getFormResultDetail } from "@/stores/features/form/actions";
import TextHeader from "@/components/text-header";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import EmptyContent from "@/components/empty-content";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function FormViewDetail() {
  const [isExporting, setIsExporting] = useState(false);
  const { id } = useParams();
  const { result } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const [items, setItems] = useState<any[]>([]);

  const pengurus =
    result?.form_headers.find((e) => e.key === "pengurus")?.options || [];

  const dataPengurus = [{ label: "Semua", value: null }, ...pengurus];

  // let items = result?.form_results || [];

  useEffect(() => {
    setItems(result?.form_results || []);
  }, [result]);

  const headers = result?.form_headers || [];

  const columns = [
    { key: "avatar", label: "Avatar" },
    { key: "user", label: "User" },
    ...headers.map((header) => ({ key: header.key, label: header.title })),
    { key: "aksi", label: "Aksi" },
  ];

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getFormResultDetail(id as any));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id]);

  function handleDeleteHeader(resultId: number) {
    http
      .delete(`/form/header/${resultId}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getFormResultDetail(id as any));
      })
      .catch((err) => notifyError(err));
  }

  function renderCell(item: (typeof items)[number], columnKey: React.Key) {
    switch (columnKey) {
      case "avatar":
        return <Avatar size="lg" src={item?.user?.profile?.photo} />;
      case "user":
        return (
          <>
            <TextHeader
              title="Nama"
              val={`${item.user?.front_title} ${item.name} ${item.user?.back_title}`}
            />
            <TextHeader title="Email" val={item.email} />
          </>
        );
      case "aksi":
        return (
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={() => confirmSweet(() => handleDeleteHeader(item.id))}
          >
            <Trash2Icon className="text-danger" />
          </Button>
        );
      default:
        return item.value?.[columnKey as string] ?? "-";
    }
  }

  function handleSetValue(value: any, columnKey: string) {
    if (value === null || value === "Semua") {
      setItems(result?.form_results || []);

      return;
    }

    const itemsData =
      result?.form_results.filter((e) => {
        return e.value?.[columnKey as string] === value;
      }) || [];

    setItems(itemsData);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader as="h4">{result?.title}</CardHeader>
        <CardBody>
          <div dangerouslySetInnerHTML={{ __html: result?.description! }} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="w-full">
          <div className="flex items-center justify-between w-full">
            <h4>Result {items.length} Peserta</h4>
            <div className="flex items-center gap-2">
              <Autocomplete
                items={dataPengurus}
                label="Pengurus"
                size="sm"
                onSelectionChange={(val) => handleSetValue(val, "pengurus")}
              >
                {(item) => (
                  <AutocompleteItem key={item.label}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Button
                color="warning"
                size="sm"
                startContent={<PlusIcon />}
                variant="shadow"
              >
                Buat Presensi
              </Button>
              <Button
                color="primary"
                isLoading={isExporting}
                size="sm"
                startContent={!isExporting ? <DownloadIcon /> : null}
                variant="shadow"
                onPress={() => {
                  handleDownloadExcel(
                    `/form/export/${id}`,
                    undefined,
                    `${result?.title}-${dayjs().format("DD-MM-YYYY")}`,
                    setIsExporting,
                  );
                }}
              >
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />} items={items}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
