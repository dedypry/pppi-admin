import { Button, Card, CardBody, CardHeader, Input, SelectItem } from "@heroui/react";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { useMemo } from "react";

import CustomSelect from "@/components/forms/custom-select";
import {
  buildFilterOptions,
  collectUserNodes,
  KepengurusanFilters,
  parseCity,
  parseWilayah,
} from "./utils";
import { IKepengurusanNode } from "@/interface/IKepengurusan";

interface Props {
  data: IKepengurusanNode[];
  filters: KepengurusanFilters;
  onChange: (key: keyof KepengurusanFilters, value: string) => void;
  onReset: () => void;
}

export default function KepengurusanFilter({
  data,
  filters,
  onChange,
  onReset,
}: Props) {
  const options = useMemo(() => buildFilterOptions(data), [data]);

  const cityOptions = useMemo(() => {
    if (filters.wilayah === "all") return options.cities;

    const cities = new Set<string>();
    for (const node of collectUserNodes(data)) {
      const region = node.region || node.user?.region || "";
      const wilayah = parseWilayah(region, node.wilayah);
      if (wilayah === filters.wilayah) {
        cities.add(parseCity(region));
      }
    }
    return [...cities].sort((a, b) => a.localeCompare(b));
  }, [data, filters.wilayah, options.cities]);

  const hasActive =
    !!filters.q.trim() ||
    filters.verification_status !== "all" ||
    filters.pengurus !== "all" ||
    filters.wilayah !== "all" ||
    filters.city !== "all" ||
    filters.jabatan !== "all";

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-0">
        <p className="text-sm font-semibold text-gray-700">Filter</p>
        {hasActive && (
          <Button
            size="sm"
            startContent={<RotateCcwIcon size={14} />}
            variant="light"
            onPress={onReset}
          >
            Reset
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Input
            className="sm:col-span-2 lg:col-span-3 xl:col-span-4"
            label="Cari"
            labelPlacement="inside"
            placeholder="Cari nama, email, NIA, wilayah..."
            startContent={<SearchIcon className="text-gray-400" size={16} />}
            value={filters.q}
            variant="bordered"
            onValueChange={(val) => onChange("q", val)}
          />

          <CustomSelect
            className="w-full"
            label="Verifikasi"
            labelPlacement="inside"
            placeholder="Status Verifikasi"
            selectedKeys={[filters.verification_status]}
            onChange={(e) => onChange("verification_status", e.target.value)}
          >
            <SelectItem key="all">Semua Verifikasi</SelectItem>
            <SelectItem key="verified">Terverifikasi</SelectItem>
            <SelectItem key="unverified">Belum Verifikasi</SelectItem>
            <SelectItem key="not_sent">Belum Dikirim</SelectItem>
            <SelectItem key="pending">Email Terkirim</SelectItem>
            <SelectItem key="re_verified">Re Verified</SelectItem>
            <SelectItem key="submitted">Menunggu Approve</SelectItem>
            <SelectItem key="approved">Approved</SelectItem>
            <SelectItem key="rejected">Ditolak</SelectItem>
          </CustomSelect>

          <CustomSelect
            className="w-full"
            label="Pengurus"
            labelPlacement="inside"
            placeholder="Tingkat Kepengurusan"
            selectedKeys={[filters.pengurus]}
            onChange={(e) => onChange("pengurus", e.target.value)}
          >
            <SelectItem key="all">Semua Pengurus</SelectItem>
            <SelectItem key="DPN">DPN</SelectItem>
            <SelectItem key="DPD">DPD</SelectItem>
            <SelectItem key="DPC">DPC / DC</SelectItem>
            <SelectItem key="DPR">DPR</SelectItem>
          </CustomSelect>

          <CustomSelect
            className="w-full"
            label="Wilayah"
            labelPlacement="inside"
            placeholder="Pilih Wilayah"
            selectedKeys={[filters.wilayah]}
            onChange={(e) => {
              onChange("wilayah", e.target.value || "all");
              onChange("city", "all");
            }}
          >
            {[
              { key: "all", label: "Semua Wilayah" },
              ...options.wilayah.map((item) => ({
                key: item,
                label: item,
              })),
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </CustomSelect>

          <CustomSelect
            className="w-full"
            label="Kota / Kabupaten"
            labelPlacement="inside"
            placeholder="Pilih Kota"
            selectedKeys={[filters.city]}
            onChange={(e) => onChange("city", e.target.value || "all")}
          >
            {[
              { key: "all", label: "Semua Kota" },
              ...cityOptions.map((item) => ({
                key: item,
                label: item,
              })),
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </CustomSelect>

          <CustomSelect
            className="w-full"
            label="Jabatan"
            labelPlacement="inside"
            placeholder="Pilih Jabatan"
            selectedKeys={[filters.jabatan]}
            onChange={(e) => onChange("jabatan", e.target.value || "all")}
          >
            {[
              { key: "all", label: "Semua Jabatan" },
              ...options.jabatan.map((item) => ({
                key: item,
                label: item,
              })),
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </CustomSelect>
        </div>
      </CardBody>
    </Card>
  );
}
