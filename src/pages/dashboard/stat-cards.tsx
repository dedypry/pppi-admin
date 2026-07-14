import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  ClipboardList,
  BadgeCheck,
  BadgeX,
  ShieldAlert,
  MailWarning,
} from "lucide-react";

import type { IDashboardSummary } from "./types";

interface StatItem {
  key: string;
  label: string;
  value: number;
  hint: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
}

interface Props {
  data?: IDashboardSummary;
  loading?: boolean;
}

export default function StatCards({ data, loading }: Props) {
  const route = useNavigate();

  const items: StatItem[] = [
    {
      key: "total",
      label: "Total Anggota",
      value: data?.members.total ?? 0,
      hint: "Semua anggota terdaftar",
      href: "/member?status=all&verification_status=all&is_need_verify=all",
      icon: Users,
      accent: "text-primary",
      iconBg: "bg-primary-100 text-primary",
    },
    {
      key: "submission",
      label: "Pengajuan",
      value: data?.members.submission ?? 0,
      hint: "Menunggu approval keanggotaan",
      href: "/member?status=submission&verification_status=all&is_need_verify=all",
      icon: ClipboardList,
      accent: "text-secondary-600",
      iconBg: "bg-secondary-100 text-secondary-600",
    },
    {
      key: "approved",
      label: "Disetujui",
      value: data?.members.approved ?? 0,
      hint: "Status anggota approved",
      href: "/member?status=approved&verification_status=all&is_need_verify=all",
      icon: BadgeCheck,
      accent: "text-success",
      iconBg: "bg-success-100 text-success",
    },
    {
      key: "rejected",
      label: "Ditolak",
      value: data?.members.rejected ?? 0,
      hint: "Status anggota rejected",
      href: "/member?status=rejected&verification_status=all&is_need_verify=all",
      icon: BadgeX,
      accent: "text-danger",
      iconBg: "bg-danger-100 text-danger",
    },
    {
      key: "need_verify",
      label: "Butuh Verifikasi",
      value: data?.verification.need_verify ?? 0,
      hint: "Flag is_need_verify aktif",
      href: "/member?status=all&verification_status=all&is_need_verify=yes",
      icon: ShieldAlert,
      accent: "text-warning",
      iconBg: "bg-warning-100 text-warning",
    },
    {
      key: "verify_submitted",
      label: "Menunggu Approve Verifikasi",
      value: data?.verification.submitted ?? 0,
      hint: "Sudah submit form verifikasi",
      href: "/member?status=all&verification_status=submitted&is_need_verify=all",
      icon: MailWarning,
      accent: "text-primary-700",
      iconBg: "bg-primary-50 text-primary-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.key}
            isPressable
            className="border border-default-100 shadow-sm transition hover:shadow-md"
            onPress={() => route(item.href)}
          >
            <CardBody className="flex flex-row items-start gap-3 p-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-secondary-600">{item.label}</p>
                <p className={`text-2xl font-bold ${item.accent}`}>
                  {loading ? "—" : item.value.toLocaleString("id-ID")}
                </p>
                <p className="mt-1 text-xs text-secondary-600">{item.hint}</p>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
