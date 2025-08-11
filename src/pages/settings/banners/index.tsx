import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  CardHeader,
  Button,
  CardBody,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Table,
  Image,
} from "@heroui/react";
import { LayoutDashboard, Settings, ImageDownIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import AddBanner from "./add-banner";

import Carousel from "@/components/Carousel";
import { confirmSweet } from "@/utils/helpers/confirm";
import { formatBytes } from "@/utils/helpers/formater";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBanner } from "@/stores/features/banners/action";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function BannerPage() {
  const { banners } = useAppSelector((state) => state.banners);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBanner());
  }, []);

  function handleDelete(ids: number[]) {
    http({
      method: "DELETE",
      url: "/banners",
      data: { ids },
    })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getBanner());
      })
      .catch((err) => notifyError(err));
  }

  function handleBulkDelete() {
    const ids =
      (selectedKeys as any) === "all"
        ? banners.map((e) => e.id)
        : Array.from(selectedKeys);

    handleDelete(ids);
  }

  function handleUpdate(id: number, val: boolean) {
    http
      .patch(`/banners/${id}`, {
        status: val,
      })
      .then(() => {
        dispatch(getBanner());
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Breadcrumbs className="mb-10">
        <BreadcrumbItem
          startContent={<LayoutDashboard size={18} />}
          onClick={() => {}}
        >
          Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<Settings size={18} />}>
          Settings
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<ImageDownIcon size={18} />}>
          Banner
        </BreadcrumbItem>
      </Breadcrumbs>

      <Card className="bg-gray-800">
        <Carousel autoPlay={true}>
          {banners
            .filter((e) => e.is_active)
            .map((item) => (
              <div key={item.id}>
                <Image
                  alt="banner"
                  className="object-cover"
                  height={500}
                  src={item.url}
                />
              </div>
            ))}
        </Carousel>
      </Card>

      <Card className="mt-10 w-full">
        <CardHeader className="flex justify-between">
          <p>Banner List</p>
          <div className="flex gap-2">
            <AddBanner />
            {Array.from(selectedKeys).length > 0 && (
              <Button
                color="danger"
                onPress={() => confirmSweet(() => handleBulkDelete())}
              >
                Bulk Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <Table
            removeWrapper
            aria-label="Controlled table example with dynamic content"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={(val: any) => setSelectedKeys(val)}
          >
            <TableHeader>
              <TableColumn>Image</TableColumn>
              <TableColumn>size</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {banners.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      alt="item"
                      className="max-w-[160px] object-cover"
                      height={80}
                      src={item.url}
                    />
                  </TableCell>
                  <TableCell>{formatBytes(item.file.size)}</TableCell>
                  <TableCell>{item.file.mime_type}</TableCell>
                  <TableCell>
                    <Switch
                      isSelected={item.is_active}
                      onValueChange={(val) => handleUpdate(item.id, val)}
                    >
                      {item.is_active ? "Aktif" : "Tidak Aktif"}{" "}
                    </Switch>
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      radius="full"
                      variant="light"
                      onPress={() =>
                        confirmSweet(() => handleDelete([item.id]))
                      }
                    >
                      <Trash2 className="text-danger" size={20} />
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
