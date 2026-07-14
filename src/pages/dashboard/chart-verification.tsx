import { Card, CardBody, CardHeader } from "@heroui/react";
import ReactApexChart from "react-apexcharts";

import type { IDashboardSummary } from "./types";

interface Props {
  data?: IDashboardSummary["verification"];
  loading?: boolean;
}

export default function ChartVerification({ data, loading }: Props) {
  const categories = [
    "Email Terkirim",
    "Re Verified",
    "Menunggu Approve",
    "Terverifikasi",
    "Ditolak",
  ];
  const seriesData = [
    data?.pending ?? 0,
    data?.re_verified ?? 0,
    data?.submitted ?? 0,
    data?.approved ?? 0,
    data?.rejected ?? 0,
  ];
  const total = seriesData.reduce((a, b) => a + b, 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "45%",
        distributed: true,
      },
    },
    colors: ["#f5a524", "#06b6d4", "#006FEE", "#15980d", "#f31260"],
    dataLabels: {
      enabled: true,
    },
    legend: { show: false },
    xaxis: {
      categories,
      labels: {
        rotate: -20,
        style: { fontSize: "11px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => String(Math.round(val)),
      },
    },
    grid: {
      strokeDashArray: 4,
    },
  };

  return (
    <Card className="h-full border border-default-100 shadow-sm">
      <CardHeader className="flex flex-col items-start gap-1 pb-0">
        <p className="text-lg font-semibold">Status Verifikasi Email</p>
        <p className="text-sm text-default-400">
          Pipeline verifikasi dari email sampai approve
        </p>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex h-[280px] items-center justify-center text-default-400">
            Memuat chart...
          </div>
        ) : total === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-default-400">
            Belum ada data verifikasi
          </div>
        ) : (
          <ReactApexChart
            height={300}
            options={options}
            series={[{ name: "Anggota", data: seriesData }]}
            type="bar"
            width="100%"
          />
        )}
      </CardBody>
    </Card>
  );
}
