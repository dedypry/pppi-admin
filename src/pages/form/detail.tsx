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
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Trash2Icon } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getFormResultDetail } from "@/stores/features/form/actions";
import TextHeader from "@/components/text-header";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import EmptyContent from "@/components/empty-content";
import "./style.css";

export default function FormViewDetail() {
  const { id } = useParams();
  const { result } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getFormResultDetail(id as any));
    }
  }, [id]);

  function getTitle(key: string) {
    const find = result?.form_headers.find((e) => e.key === key);

    if (find) {
      return find.title;
    }

    return key;
  }

  function handleDeleteHeader(resultId: number) {
    http
      .delete(`/form/header/${resultId}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getFormResultDetail(id as any));
      })
      .catch((err) => notifyError(err));
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
        <CardHeader as="h4">Result</CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Avatar</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Results</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={<EmptyContent />}
              items={result?.form_results || []}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar size="lg" src={item?.user?.profile?.photo} />
                  </TableCell>
                  <TableCell>
                    <TextHeader title="Nama" val={item.name} />
                    <TextHeader title="Email" val={item.email} />
                  </TableCell>
                  <TableCell>
                    {Object.entries(item.value).map(([key, val]) => (
                      <TextHeader
                        key={key}
                        title={getTitle(key)}
                        val={val}
                        width={200}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      radius="full"
                      variant="light"
                      onPress={() =>
                        confirmSweet(() => handleDeleteHeader(item.id))
                      }
                    >
                      <Trash2Icon className="text-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
