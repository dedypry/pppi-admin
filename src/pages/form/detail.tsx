import {
  Avatar,
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

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getFormResultDetail } from "@/stores/features/form/actions";
import TextHeader from "@/components/text-header";

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
            </TableHeader>
            <TableBody items={result?.form_results || []}>
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
                      <TextHeader key={key} title={getTitle(key)} val={val} />
                    ))}
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
