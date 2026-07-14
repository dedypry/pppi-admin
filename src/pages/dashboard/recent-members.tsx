import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";

import type { IDashboardRecentMember } from "./types";
import { chipColor } from "@/utils/helpers/global";
import { dateFormat } from "@/utils/helpers/formater";

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

interface Props {
  items?: IDashboardRecentMember[];
  loading?: boolean;
}

export default function RecentMembers({ items = [], loading }: Props) {
  const route = useNavigate();

  return (
    <Card className="border border-default-100 shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Anggota Terbaru</p>
          <p className="text-sm text-default-400">
            Pendaftaran anggota paling baru
          </p>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => route("/member?status=all")}
        >
          Lihat semua
        </Button>
      </CardHeader>
      <CardBody className="gap-3 pt-0">
        {loading ? (
          <p className="py-8 text-center text-default-400">Memuat data...</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-default-400">
            Belum ada anggota terbaru
          </p>
        ) : (
          items.map((user) => (
            <button
              key={user.id}
              className="flex w-full items-center gap-3 rounded-xl border border-default-100 p-3 text-left transition hover:bg-primary-50"
              type="button"
              onClick={() => route(`/member/${user.id}`)}
            >
              <Avatar
                className="shrink-0"
                name={user.name}
                src={user.photo || undefined}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {[user.front_title, user.name, user.back_title]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <p className="truncate text-sm text-default-500">{user.email}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Chip
                    color={chipColor(user.status || "") as any}
                    size="sm"
                    variant="dot"
                  >
                    {user.status || "-"}
                  </Chip>
                  <Chip
                    color={verificationColor(user.verification_status) as any}
                    size="sm"
                    variant="flat"
                  >
                    {verificationLabel(user.verification_status)}
                  </Chip>
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-xs text-default-400">
                  {user.created_at ? dateFormat(user.created_at) : "-"}
                </p>
                <EyeIcon className="ml-auto mt-1 text-default-300" size={16} />
              </div>
            </button>
          ))
        )}
      </CardBody>
    </Card>
  );
}
