import { Avatar, Button, Card, CardBody, Chip } from "@heroui/react";
import {
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMissingJabatanOptions, getMissingPengurusOptions } from "./utils";
import { IKepengurusanNode } from "@/interface/IKepengurusan";
import { formatNia } from "@/utils/helpers/format";

interface Props {
  node: IKepengurusanNode;
  canEdit?: boolean;
  onEditUser?: (node: IKepengurusanNode) => void;
  onDeleteUser?: (node: IKepengurusanNode) => void;
  onAddPengurus?: (node: IKepengurusanNode) => void;
  onAddUser?: (node: IKepengurusanNode) => void;
}

function pengurusCode(title: string) {
  return title.split(" ")[0]?.replace(/[()]/g, "") || title;
}

function verificationLabel(status?: string | null) {
  switch (status) {
    case "pending":
      return "Email Terkirim";
    case "re_verified":
      return "Re Verified";
    case "submitted":
      return "Menunggu Approve";
    case "approved":
      return "Terverifikasi";
    case "rejected":
      return "Ditolak";
    default:
      return "Belum Dikirim";
  }
}

function verificationColor(status?: string | null) {
  switch (status) {
    case "pending":
      return "warning";
    case "re_verified":
      return "secondary";
    case "submitted":
      return "primary";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "default";
  }
}

export default function KepengurusanCard({
  node,
  canEdit,
  onEditUser,
  onDeleteUser,
  onAddPengurus,
  onAddUser,
}: Props) {
  const navigate = useNavigate();

  if (node.type === "user" && node.user) {
    const fullName = [
      node.user.front_title,
      node.user.name,
      node.user.back_title,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Card className="min-w-[150px] border border-primary text-center shadow-sm">
        <CardBody className="flex flex-col items-center gap-2 px-3 py-3">
          <Avatar isBordered size="lg" src={node.user.profile?.photo} />
          <div className="text-center">
            <p className="m-0 max-w-[160px] p-0 text-xs font-semibold leading-snug text-gray-800">
              {fullName}
            </p>
            {node.user.nia && (
              <button
                className="m-0 cursor-pointer border-0 bg-transparent p-0 text-[10px] text-cyan-700 underline-offset-2 hover:underline"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/member/${node.user!.id}`);
                }}
              >
                {formatNia(node.user.nia)}
              </button>
            )}
          </div>
          <Chip color="secondary" size="sm" variant="flat">
            {node.title}
          </Chip>
          <Chip
            color={verificationColor(node.user.verification_status) as any}
            size="sm"
            variant="flat"
          >
            {verificationLabel(node.user.verification_status)}
          </Chip>
          {canEdit && (
            <div className="mt-1 flex gap-2">
              <Button
                isIconOnly
                className="min-w-0 bg-warning text-white"
                radius="full"
                size="sm"
                onPress={() => onEditUser?.(node)}
              >
                <PencilIcon size={14} />
              </Button>
              <Button
                isIconOnly
                className="min-w-0 bg-danger text-white"
                radius="full"
                size="sm"
                onPress={() => onDeleteUser?.(node)}
              >
                <Trash2Icon size={14} />
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  if (node.type === "pengurus") {
    return (
      <Card className="min-w-[140px] border border-secondary-300 bg-secondary-50 text-center shadow-sm">
        <CardBody className="flex flex-col items-center gap-2 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-600 text-white">
            <ShieldIcon size={18} />
          </div>
          <Chip className="bg-secondary-600 text-white" size="sm">
            {pengurusCode(node.title)}
          </Chip>
          <p className="m-0 max-w-[160px] p-0 text-[11px] leading-snug text-gray-700">
            {node.title}
          </p>
          {canEdit && getMissingJabatanOptions(node).length > 0 && (
            <Button
              color="secondary"
              size="sm"
              startContent={<PlusIcon size={14} />}
              variant="flat"
              onPress={() => onAddUser?.(node)}
            >
              Tambah User
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }

  const missingPengurus =
    node.type === "wilayah" ? getMissingPengurusOptions(node) : [];

  return (
    <Card className="min-w-[160px] border border-primary bg-primary-50 text-center shadow-sm">
      <CardBody className="flex flex-col items-center gap-2 px-3 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
          <MapPinIcon size={18} />
        </div>
        <p className="m-0 max-w-[180px] p-0 text-sm font-semibold leading-snug text-primary">
          {node.title}
        </p>
        {canEdit && missingPengurus.length > 0 && (
          <Button
            color="primary"
            size="sm"
            startContent={<PlusIcon size={14} />}
            variant="flat"
            onPress={() => onAddPengurus?.(node)}
          >
            Tambah Pengurus
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
