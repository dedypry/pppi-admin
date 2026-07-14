import { Card, CardBody, CardHeader } from "@heroui/react";
import ReactApexChart from "react-apexcharts";

interface Props {
  submission?: number;
  approved?: number;
  rejected?: number;
  loading?: boolean;
}

export default function ChartPie({
  submission = 0,
  approved = 0,
  rejected = 0,
  loading,
}: Props) {
  const series = [submission, approved, rejected];
  const total = series.reduce((a, b) => a + b, 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["Pengajuan", "Disetujui", "Ditolak"],
    colors: ["#a1a1aa", "#15980d", "#f31260"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "62%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => String(total),
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
  };

  return (
    <Card className="h-full border border-default-100 shadow-sm">
      <CardHeader className="flex flex-col items-start gap-1 pb-0">
        <p className="text-lg font-semibold">Status Keanggotaan</p>
        <p className="text-sm text-default-400">
          Sebaran pengajuan, disetujui, dan ditolak
        </p>
      </CardHeader>
      <CardBody className="flex items-center justify-center">
        {loading ? (
          <div className="flex h-[280px] items-center text-default-400">
            Memuat chart...
          </div>
        ) : total === 0 ? (
          <div className="flex h-[280px] items-center text-default-400">
            Belum ada data anggota
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            width="100%"
          />
        )}
      </CardBody>
    </Card>
  );
}
