import { Card, CardHeader, Button, CardBody } from "@heroui/react";
import { EditIcon, Trash2Icon, CheckCircle } from "lucide-react";
import { useState } from "react";

import EditItem from "./edit-item";

import { IPackage } from "@/interface/IPartner";
import { confirmSweet } from "@/utils/helpers/confirm";

interface Props {
  item: IPackage;
  onDelete: (val: number) => void;
}
export default function CardItem({ item, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditItem data={item} open={open} setOpen={setOpen} />
      <Card className="min-w-[49%]">
        <CardHeader className="flex justify-between">
          <p className="text-lg font-semibold text-gray-600 mb-3">
            {item.title}
          </p>
          <div>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => setOpen(true)}
            >
              <EditIcon className="text-warning" />
            </Button>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => confirmSweet(() => onDelete(item.id))}
            >
              <Trash2Icon className="text-danger" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <ul>
            {item.benefit?.map((benefit, j) => (
              <li key={j} className="flex items-start text-gray-700 gap-2">
                <div>
                  <CheckCircle className="text-green-500" size={18} />
                </div>
                <p className="text-gray-600 text-sm">{benefit}</p>
              </li>
            ))}
          </ul>
          <p className="text-lg font-semibold text-gray-600 mb-3 mt-2">
            Deskripsi :
          </p>
          <p className=" text-gray-500">{item.description || ""}</p>
        </CardBody>
      </Card>
    </>
  );
}
