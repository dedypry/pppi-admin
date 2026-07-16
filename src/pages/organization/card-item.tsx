import { Avatar, Card, CardBody } from "@heroui/react";
import { PlusCircleIcon, UserRoundIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { IOrganizations } from "@/interface/IOrganization";
import { formatNia } from "@/utils/helpers/format";

interface Props {
  item?: IOrganizations;
  title?: string;
  onPickUser?: () => void;
}

export default function CardItemOrg({ item, title, onPickUser }: Props) {
  const navigate = useNavigate();
  const fullName = [item?.user?.front_title, item?.user?.name, item?.user?.back_title]
    .filter(Boolean)
    .join(" ");
  const label = title || item?.title;

  return (
    <div className="relative inline-block">
      {label ? (
        <Card
          isPressable={!!onPickUser}
          className="min-w-[140px] cursor-pointer border border-primary text-center transition hover:shadow-md"
          onPress={onPickUser}
        >
          <CardBody className="flex flex-col items-center gap-2 px-3 py-3">
            {item?.user?.profile?.photo ? (
              <Avatar isBordered size="lg" src={item.user.profile.photo} />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-primary/5">
                <UserRoundIcon className="text-primary/60" size={24} />
              </div>
            )}

            {item?.user ? (
              <div className="text-center">
                <p className="m-0 max-w-[150px] p-0 text-xs font-semibold leading-snug text-gray-800">
                  {fullName}
                </p>
                {item.user.nia && (
                  <button
                    className="m-0 cursor-pointer border-0 bg-transparent p-0 text-[10px] text-cyan-700 underline-offset-2 hover:underline"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/member/${item.user!.id}`);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {formatNia(item.user.nia)}
                  </button>
                )}
              </div>
            ) : (
              <p className="m-0 p-0 text-[11px] text-gray-400">
                Klik untuk pilih anggota
              </p>
            )}

            <p className="m-0 p-0 text-sm font-medium text-primary">
              {label}
            </p>
          </CardBody>
        </Card>
      ) : (
        <button
          className="rounded-full p-1 hover:bg-primary/10"
          type="button"
          onClick={onPickUser}
        >
          <PlusCircleIcon className="text-primary" />
        </button>
      )}
    </div>
  );
}
