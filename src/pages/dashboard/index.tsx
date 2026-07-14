import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { UserPlus2, Users } from "lucide-react";

import ChartPie from "./chart-pie";
import ChartVerification from "./chart-verification";
import StatCards from "./stat-cards";
import RecentMembers from "./recent-members";
import QuickActions from "./quick-actions";

import type { IDashboardSummary } from "./types";

import { apps } from "@/config/app";
import { useAppSelector } from "@/stores/hooks";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";

dayjs.locale("id");

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.user);
  const route = useNavigate();
  const [data, setData] = useState<IDashboardSummary>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http
      .get("/dashboard/members")
      .then(({ data: res }) => {
        setData(res?.data || res);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card className="overflow-hidden border-0 shadow-md">
        <CardBody className="relative bg-gradient-to-br from-primary-700 via-primary to-success-600 p-0 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm text-white/80">
                {dayjs().format("dddd, DD MMMM YYYY")}
              </p>
              <h1 className="mt-1 text-3xl font-bold md:text-4xl ">
                <span className="text-white">Hi, {user?.name || "Admin"}</span>
              </h1>
              <p className="mt-2 text-base text-white/90 md:text-lg">
                Selamat datang di dashboard{" "}
                <span className="font-semibold">{apps.short_name}</span>. Pantau
                keanggotaan dan verifikasi email dari satu tempat.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-white text-primary"
                radius="full"
                startContent={<Users size={16} />}
                onPress={() => route("/member?status=all")}
              >
                Lihat Anggota
              </Button>
              <Button
                className="border-white text-white"
                radius="full"
                startContent={<UserPlus2 size={16} />}
                variant="bordered"
                onPress={() => route("/member/create")}
              >
                Tambah Anggota
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {loading && !data ? (
        <div className="flex justify-center py-16">
          <Spinner color="primary" label="Memuat dashboard..." />
        </div>
      ) : (
        <>
          <StatCards data={data} loading={loading} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartPie
              approved={data?.members.approved}
              loading={loading}
              rejected={data?.members.rejected}
              submission={data?.members.submission}
            />
            <ChartVerification data={data?.verification} loading={loading} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentMembers items={data?.recent} loading={loading} />
            </div>
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
}
