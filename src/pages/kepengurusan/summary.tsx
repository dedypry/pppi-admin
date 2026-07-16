import { Card, CardBody, Chip } from "@heroui/react";
import {
  Building2Icon,
  CheckCircle2Icon,
  MapPinIcon,
  ShieldIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

import {
  collectUserNodes,
  parseCity,
  parseWilayah,
  pengurusCode,
} from "./utils";
import { IKepengurusanNode } from "@/interface/IKepengurusan";

interface Props {
  data: IKepengurusanNode[];
  loading?: boolean;
}

export default function KepengurusanSummary({ data, loading }: Props) {
  const stats = useMemo(() => {
    const users = collectUserNodes(data);
    const total = users.length;
    const verified = users.filter(
      (n) => n.user?.verification_status === "approved",
    ).length;
    const unverified = total - verified;

    const byLevel = { DPN: 0, DPD: 0, DPC: 0, DPR: 0, Lainnya: 0 };
    const cityMap = new Map<string, number>();
    const wilayahMap = new Map<string, number>();

    for (const node of users) {
      const code = pengurusCode(
        node.pengurus || node.user?.administrator_role,
      );
      if (code === "DPN") byLevel.DPN += 1;
      else if (code === "DPD") byLevel.DPD += 1;
      else if (code === "DC" || code === "DPC") byLevel.DPC += 1;
      else if (code === "DPR") byLevel.DPR += 1;
      else byLevel.Lainnya += 1;

      const city = parseCity(node.region || node.user?.region);
      cityMap.set(city, (cityMap.get(city) || 0) + 1);

      const wilayah = parseWilayah(
        node.region || node.user?.region,
        node.wilayah,
      );
      wilayahMap.set(wilayah, (wilayahMap.get(wilayah) || 0) + 1);
    }

    const cities = [...cityMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const wilayahList = [...wilayahMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { total, verified, unverified, byLevel, cities, wilayahList };
  }, [data]);

  const display = (value: number) => (loading ? "-" : value);

  const levelCards = [
    {
      key: "DPN",
      label: "DPN",
      desc: "Dewan Pengurus Nasional",
      count: stats.byLevel.DPN,
      className: "border-secondary/30 bg-secondary/10",
      valueClass: "text-secondary",
      iconClass: "bg-secondary text-white",
    },
    {
      key: "DPD",
      label: "DPD",
      desc: "Dewan Pengurus Daerah",
      count: stats.byLevel.DPD,
      className: "border-primary/30 bg-primary/10",
      valueClass: "text-primary",
      iconClass: "bg-primary text-white",
    },
    {
      key: "DPC",
      label: "DPC / DC",
      desc: "Dewan Pengurus Cabang",
      count: stats.byLevel.DPC,
      className: "border-warning/30 bg-warning/10",
      valueClass: "text-warning-700",
      iconClass: "bg-warning text-white",
    },
    {
      key: "DPR",
      label: "DPR",
      desc: "Dewan Pengurus Ranting",
      count: stats.byLevel.DPR,
      className: "border-success/30 bg-success/10",
      valueClass: "text-success",
      iconClass: "bg-success text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-primary/20 bg-primary/5">
          <CardBody className="flex flex-row items-center gap-3 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <UsersIcon size={20} />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-xs text-gray-500">Total Anggota</p>
              <p className="m-0 text-2xl font-semibold text-primary">
                {display(stats.total)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-success/30 bg-success/10">
          <CardBody className="flex flex-row items-center gap-3 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <CheckCircle2Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-xs text-gray-500">Terverifikasi</p>
              <p className="m-0 text-2xl font-semibold text-success">
                {display(stats.verified)}
              </p>
              {!loading && stats.total > 0 && (
                <p className="m-0 text-[11px] text-gray-500">
                  {Math.round((stats.verified / stats.total) * 100)}% dari total
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-warning/30 bg-warning/10 sm:col-span-2 xl:col-span-1">
          <CardBody className="flex flex-row items-center gap-3 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning text-white">
              <XCircleIcon size={20} />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-xs text-gray-500">Belum Verifikasi</p>
              <p className="m-0 text-2xl font-semibold text-warning-700">
                {display(stats.unverified)}
              </p>
              {!loading && stats.total > 0 && (
                <p className="m-0 text-[11px] text-gray-500">
                  {Math.round((stats.unverified / stats.total) * 100)}% dari
                  total
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="gap-3 py-4">
          <div className="flex items-center gap-2">
            <ShieldIcon className="text-primary" size={18} />
            <div>
              <p className="m-0 text-sm font-semibold text-gray-800">
                Berdasarkan Tingkat Kepengurusan
              </p>
              <p className="m-0 text-xs text-gray-500">
                Jumlah anggota per level organisasi
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {levelCards.map((item) => (
              <div
                key={item.key}
                className={`rounded-xl border px-3 py-3 ${item.className}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconClass}`}
                  >
                    <ShieldIcon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 text-xs font-semibold text-gray-800">
                      {item.label}
                    </p>
                    <p className="m-0 truncate text-[10px] text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <p className={`m-0 text-2xl font-semibold ${item.valueClass}`}>
                  {display(item.count)}
                </p>
              </div>
            ))}
          </div>
          {!loading && stats.byLevel.Lainnya > 0 && (
            <p className="m-0 text-xs text-gray-500">
              Lainnya / tidak terklasifikasi:{" "}
              <span className="font-semibold text-gray-700">
                {stats.byLevel.Lainnya}
              </span>
            </p>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardBody className="gap-3 py-4">
            <div className="flex items-center gap-2">
              <MapPinIcon className="text-primary" size={18} />
              <div>
                <p className="m-0 text-sm font-semibold text-gray-800">
                  Per Wilayah (Provinsi)
                </p>
                <p className="m-0 text-xs text-gray-500">
                  {loading ? "-" : stats.wilayahList.length} wilayah terdaftar
                </p>
              </div>
            </div>
            <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto">
              {loading ? (
                <Chip size="sm" variant="flat">
                  Memuat...
                </Chip>
              ) : stats.wilayahList.length === 0 ? (
                <p className="m-0 text-sm text-gray-500">Belum ada data</p>
              ) : (
                stats.wilayahList.map((item) => (
                  <Chip
                    key={item.name}
                    className="max-w-full"
                    color="primary"
                    endContent={
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.count}
                      </span>
                    }
                    size="sm"
                    variant="flat"
                  >
                    <span className="truncate">{item.name}</span>
                  </Chip>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-3 py-4">
            <div className="flex items-center gap-2">
              <Building2Icon className="text-secondary" size={18} />
              <div>
                <p className="m-0 text-sm font-semibold text-gray-800">
                  Per Kota / Kabupaten
                </p>
                <p className="m-0 text-xs text-gray-500">
                  {loading ? "-" : stats.cities.length} kota/kabupaten terdaftar
                </p>
              </div>
            </div>
            <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto">
              {loading ? (
                <Chip size="sm" variant="flat">
                  Memuat...
                </Chip>
              ) : stats.cities.length === 0 ? (
                <p className="m-0 text-sm text-gray-500">Belum ada data</p>
              ) : (
                stats.cities.map((item) => (
                  <Chip
                    key={item.name}
                    className="max-w-full"
                    color="secondary"
                    endContent={
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.count}
                      </span>
                    }
                    size="sm"
                    variant="flat"
                  >
                    <span className="truncate">{item.name}</span>
                  </Chip>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
