import {
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DownloadIcon, Trash2Icon } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getFormResultDetail } from "@/stores/features/form/actions";
import TextHeader from "@/components/text-header";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import EmptyContent from "@/components/empty-content";
import { handleDownloadExcel } from "@/utils/helpers/global";
import dayjs from "dayjs";

export default function FormViewDetail() {
  const [isExporting, setIsExporting] = useState(false);
  const { id } = useParams();
  const { result } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  const items = result?.form_results || [];
  const headers = result?.form_headers || [];

  const columns = [
    { key: "avatar", label: "Avatar" },
    { key: "user", label: "User" },
    ...headers.map((header) => ({ key: header.key, label: header.title })),
    { key: "aksi", label: "Aksi" },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getFormResultDetail(id as any));
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
            <TextHeader title="Nama" val={item.name} />
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

  function handleExport(id: number) {
    http.get(`/form/export/${id}`).then(({ data }) => {
      console.log(data);
    });
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
            <h4>Result</h4>
            <div>
              <Button
                color="primary"
                startContent={<DownloadIcon />}
                variant="shadow"
                // onPress={() => handleExport(result?.id!)}
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
