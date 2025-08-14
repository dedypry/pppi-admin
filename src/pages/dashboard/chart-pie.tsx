import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import ReactApexChart from "react-apexcharts";

import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";

export default function ChartPie() {
  const [state, setState] = useState({
    series: [44, 55, 13],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Pengajuan", "Disetujui", "Di Totak"],
      colors: ["#b6b4b9", "#15980d", "#f31260"],
      dataLabels: {
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          colors: ["#ffffff"], // warna label dalam chart
        },
      } as ApexCharts.ApexOptions,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ] as ApexNonAxisChartSeries[] | any,
    },
  });

  useEffect(() => {
    http
      .get("/dashboard/members")
      .then(({ data }) => {
        const { submission, approved, rejected } = data;

        setState((e) => ({
          ...e,
          series: [submission, approved, rejected],
        }));
      })
      .catch((err) => notifyError(err));
  }, []);

  return (
    <Card>
      <CardHeader>Data Anggota PPPI</CardHeader>
      <CardBody>
        <ReactApexChart
          options={state.options as any}
          series={state.series}
          type="pie"
          width={380}
        />
      </CardBody>
    </Card>
  );
}
