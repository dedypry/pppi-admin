import { Avatar, Card, CardBody } from "@heroui/react";

import { IUser } from "@/interface/IUser";
interface Props {
  user: IUser;
}
export default function OrganizationCard({ user }: Props) {
  return (
    <div className="inline-block">
      <Card className="min-w-[120px] border border-primary text-center">
        <CardBody className="flex flex-col items-center gap-2">
          <Avatar isBordered size="lg" src={user?.profile?.photo} />
          <div className="text-center">
            <p className="m-0 p-0 text-xs">{user.job_title}</p>
            <p className="m-0 p-0 text-[10px] text-gray-500">{user.name}</p>
            <p className="m-0 p-0 text-[10px] text-gray-500">{user.nia}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
