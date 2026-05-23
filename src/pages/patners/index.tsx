import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { EditIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import EditPartner from "./edit-item";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPartners } from "@/stores/features/partners/action";
import { IPartner } from "@/interface/IPartner";
import EmptyContent from "@/components/empty-content";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function PartnerPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IPartner>();
  const { partners } = useAppSelector((state) => state.partners);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPartners());
  }, []);

  function handleDelete(id: number) {
    http
      .delete(`/partners/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPartners());
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <EditPartner data={data} open={open} setOpen={setOpen} />
      <Card>
        <CardHeader className="flex justify-between">
          <p className="text-lg font-bold">List Partner</p>
          <Button
            color="primary"
            startContent={<PlusCircleIcon size={18} />}
            onPress={() => {
              setData(undefined);
              setOpen(true);
            }}
          >
            Tambah Partner
          </Button>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Logo</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Website</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {partners.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.logo ? (
                      <Image
                        alt={item.name}
                        className="h-14 w-14 object-cover"
                        src={item.logo}
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-medium bg-gray-100 text-xs text-gray-500">
                        No Logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.website || "-"}</TableCell>
                  <TableCell className="max-w-lg">{item.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setData(item);
                          setOpen(true);
                        }}
                      >
                        <EditIcon className="text-warning" size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => confirmSweet(() => handleDelete(item.id))}
                      >
                        <Trash2Icon className="text-danger" size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
