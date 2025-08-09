import {
  Card,
  CardHeader,
  Button,
  CardBody,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Switch,
  Table,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { EditIcon, Trash2Icon } from "lucide-react";

// import categories from "../blogs/categories";

import ModalCategory from "./modal-category";

import { confirmSweet } from "@/utils/helpers/confirm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/categories/actions";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import EmptyContent from "@/components/empty-content";

export default function BlogCategoryPage() {
  const { categories } = useAppSelector((state) => state.categories);
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories({}));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setData(undefined);
    }
  }, [isOpen]);

  function handleUpdate(id: number, val: boolean) {
    http
      .patch(`/blogs/categories/status/${id}`, {
        status: val,
      })
      .then(() => dispatch(getCategories({})))
      .catch((err) => notifyError(err));
  }

  function handleDelete(id: number) {
    http
      .delete(`/blogs/categories/${id}`)
      .then(({ data }) => {
        dispatch(getCategories({}));
        notify(data.message);
      })
      .catch((err) => notifyError(err));
  }

  function handleEdit(body: any) {
    setData(body);
    setOpen(true);
  }

  return (
    <>
      <ModalCategory data={data} isOpen={isOpen} setOpen={setOpen} />
      <Card>
        <CardHeader className="flex justify-between">
          <p>List Kategori</p>
          <Button
            color="primary"
            size="sm"
            variant="shadow"
            onPress={() => setOpen(true)}
          >
            Tambah Kategori
          </Button>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn>Icon</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {(categories?.data ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar size="lg" src={item.icon!} />
                  </TableCell>
                  <TableCell>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500 italic">
                      {item.description!}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={item.is_active}
                      onValueChange={(val) => handleUpdate(item.id, val)}
                    />
                  </TableCell>
                  <TableCell>
                    {/* <Edit category={item} /> */}
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(item)}
                    >
                      <EditIcon className="text-warning" size={20} />
                    </Button>
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => confirmSweet(() => handleDelete(item.id))}
                    >
                      <Trash2Icon className="text-danger" size={20} />
                    </Button>
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
