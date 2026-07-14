import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import {
  DownloadIcon,
  MailCheckIcon,
  UserPlus2,
  Users,
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

import { handleDownloadExcel } from "@/utils/helpers/global";

export default function QuickActions() {
  const route = useNavigate();
  const [exporting, setExporting] = useState(false);

  return (
    <Card className="border border-default-100 shadow-sm">
      <CardBody className="gap-3 p-4">
        <div>
          <p className="text-lg font-semibold">Aksi Cepat</p>
          <p className="text-sm text-default-400">
            Shortcut operasional anggota
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            className="justify-start"
            color="primary"
            startContent={<Users size={16} />}
            variant="flat"
            onPress={() => route("/member?status=all")}
          >
            List Anggota
          </Button>
          <Button
            className="justify-start"
            color="primary"
            startContent={<UserPlus2 size={16} />}
            variant="flat"
            onPress={() => route("/member/create")}
          >
            Tambah Anggota
          </Button>
          <Button
            className="justify-start"
            color="warning"
            startContent={<MailCheckIcon size={16} />}
            variant="flat"
            onPress={() =>
              route(
                "/member?status=all&verification_status=all&is_need_verify=yes",
              )
            }
          >
            Butuh Verifikasi
          </Button>
          <Button
            className="justify-start"
            color="success"
            isLoading={exporting}
            startContent={!exporting ? <DownloadIcon size={16} /> : null}
            variant="flat"
            onPress={() =>
              handleDownloadExcel(
                "/members/export",
                {
                  status: "all",
                  verification_status: "all",
                  is_need_verify: "all",
                },
                `members-${dayjs().format("YYYYMMDD-HHmmss")}`,
                setExporting,
              )
            }
          >
            Export Excel
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
