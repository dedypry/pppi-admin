import {
  Accordion,
  AccordionItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { EditIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";

import CardItem from "./card-item";
import EditItem from "./edit-item";

import { getPackage } from "@/stores/features/packages/action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { IPackage } from "@/interface/IPartner";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function PackagePage() {
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState(false);
  const [data, setData] = useState<IPackage>();
  const { packages } = useAppSelector((state) => state.packages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPackage());
  }, []);

  function handleDelete(id: number) {
    http
      .delete(`/packages/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPackage());
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <EditItem data={data} header={header} open={open} setOpen={setOpen} />
      <div className="flex justify-between items-center mb-10">
        <Breadcrumbs className="ml-1">
          <BreadcrumbItem>Partner</BreadcrumbItem>
          <BreadcrumbItem>Packages</BreadcrumbItem>
        </Breadcrumbs>
        <div>
          <Button
            color="primary"
            onPress={() => {
              setData(undefined);
              setHeader(true);
              setOpen(true);
            }}
          >
            Tambah Package
          </Button>
        </div>
      </div>
      <Accordion selectionMode="multiple" variant="splitted">
        {packages.map((item) => (
          <AccordionItem
            key={item.id}
            classNames={{
              subtitle: "text-gray-500 italic",
            }}
            subtitle={item.types?.map((e) => e).join(", ")}
            title={
              <div className="flex gap-5 items-center">
                <p>{item.title}</p>
                <div>
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setData({
                        title: "",
                        types: [],
                        benefit: [],
                        parent_id: item.id,
                        description: "",
                      } as any);
                      setHeader(false);
                      setOpen(true);
                    }}
                  >
                    <PlusCircleIcon className="text-success" />
                  </Button>
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setData(item);
                      setHeader(true);
                      setOpen(true);
                    }}
                  >
                    <EditIcon className="text-warning" />
                  </Button>
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => confirmSweet(() => handleDelete(item.id))}
                  >
                    <Trash2Icon className="text-danger" />
                  </Button>
                </div>
              </div>
            }
          >
            <div className="flex gap-2 flex-wrap justify-between">
              {item.children.map((child) => (
                <CardItem key={child.id} item={child} onDelete={handleDelete} />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
