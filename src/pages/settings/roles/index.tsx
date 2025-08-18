import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { EllipsisVerticalIcon, EditIcon, Trash2Icon } from "lucide-react";

import AddRole from "./add";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getRoles } from "@/stores/features/roles/action";
import { confirmSweet } from "@/utils/helpers/confirm";
import { IRole } from "@/interface/IUser";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function RolePage() {
  const { roles } = useAppSelector((state) => state.role);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IRole>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRoles({}));
  }, []);

  function handleDelete(id: number) {
    http
      .delete(`/roles/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getRoles({}));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <AddRole data={data} open={open} setOpen={setOpen} />
      <Card>
        <CardHeader>
          <div className="flex justify-between w-full">
            <p>List Role</p>
            <div>
              <Button color="primary" onPress={() => setOpen(true)}>
                Tambah Role
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Title</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {(roles?.data ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
                          onPress={() => {
                            setData(item);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="hapus"
                          color="danger"
                          startContent={<Trash2Icon size={20} />}
                          onClick={() =>
                            confirmSweet(() => handleDelete(item.id))
                          }
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
      </Card>
    </>
  );
}
