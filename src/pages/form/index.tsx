import {
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
import { useEffect } from "react";
import { CopyIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getForm } from "@/stores/features/form/actions";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { dateFormat } from "@/utils/helpers/formater";
import TableAction from "@/components/table-action";
import { copyClipboard } from "@/utils/helpers/global";
import config from "@/config/api";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function FormPage() {
  const { forms } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();
  const route = useNavigate();

  useEffect(() => {
    dispatch(getForm({}));
  }, []);

  function handleDelete(id: number) {
    http
      .delete(`/form/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getForm({}));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Card>
      <CardHeader as={"h4"}>Form List</CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>slug</TableColumn>
            <TableColumn>dibuat</TableColumn>
            <TableColumn>Total Respon</TableColumn>
            <TableColumn className="text-right">aksi</TableColumn>
          </TableHeader>
          <TableBody>
            {(forms?.data || []).map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-primary-50 cursor-pointer"
                onClick={() => route(`/form/${item.id}/view`)}
              >
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>{dateFormat(item.created_at)}</TableCell>
                <TableCell>{item.result_total}</TableCell>
                <TableCell className="flex items-center justify-end">
                  <div>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        copyClipboard(`${config.front}/form/${item.slug}`)
                      }
                    >
                      <CopyIcon />
                    </Button>
                  </div>
                  <TableAction
                    onDelete={() => handleDelete(item.id)}
                    onEdit={() => route(`/form/${item.id}`)}
                    onView={() => route(`/form/${item.id}/view`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
