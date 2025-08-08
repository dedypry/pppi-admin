import { Card, CardBody } from "@heroui/react";

import { apps } from "@/config/app";
import { useAppSelector } from "@/stores/hooks";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <Card>
      <CardBody className="text-center">
        <h1 className="text-[40px] font-bold">
          Hi, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-[30px]">
          Selamat Datang di{" "}
          <span className="font-semibold">{apps.full_name}</span>
        </p>
      </CardBody>
    </Card>
  );
}
