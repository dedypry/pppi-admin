import { Avatar, Card, CardBody } from "@heroui/react";
import { PlusCircleIcon } from "lucide-react";

import { IOrganizations } from "@/interface/IOrganization";
import { parseJobTitles } from "@/utils/helpers/format";

interface Props {
  item?: IOrganizations;
  title?: string;
}
export default function CardItemOrg({ item, title }: Props) {
  const jobTitles = parseJobTitles(item?.user?.job_title).join(", ");

  return (
    <div className="inline-block relative">
      {item?.title || title ? (
        <>
          <Card className="min-w-[120px] border border-primary text-center">
            <CardBody className="flex flex-col items-center gap-2">
              <Avatar isBordered size="lg" src={item?.user?.profile?.photo} />
              {item?.user && (
                <>
                  <div className="text-center">
                    <p className="m-0 p-0 text-xs">{jobTitles}</p>
                    <p className="m-0 p-0 text-[10px] text-gray-500">
                      {item?.user?.name}
                    </p>
                    <p className="m-0 p-0 text-[10px] text-gray-500">
                      {item?.user?.nia}
                    </p>
                  </div>
                </>
              )}
              <p className="text-center">{title || item?.title}</p>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <PlusCircleIcon className="text-primary" />
        </>
      )}
    </div>
  );
}
