import { Card, CardBody } from "@heroui/react";
import {
  FacebookIcon,
  FlagIcon,
  InstagramIcon,
  LandPlotIcon,
  LoaderIcon,
  MailIcon,
  MapPin,
  PhoneCallIcon,
  SlackIcon,
  Ticket,
  User2Icon,
} from "lucide-react";

import ListProfile from "./list-profile";

import Gender from "@/components/gender";
import { IUser } from "@/interface/IUser";

interface Props {
  user?: IUser;
}
export default function LeftProfile({ user }: Props) {
  return (
    <Card>
      <CardBody>
        <div className="relative flex">
          <div className="flex gap-2">
            <p className="text-gray-500">Tentang</p>
            <Gender gender={user?.profile?.gender!} />
          </div>
        </div>
        <ul className="text-md mt-2 flex flex-col gap-2 text-gray-500">
          <div className="flex flex-col gap-2">
            <ListProfile Icon={User2Icon} title="Nama" value={user?.name!} />
            {/* <ListProfile
              Icon={SlackIcon}
              title="Roles"
              value={
                user?.roles?.length! > 0
                  ? user?.roles?.map((item) => item.name).join(", ")
                  : ""
              }
            /> */}
            <ListProfile
              Icon={FlagIcon}
              title="Kewarganegaraan"
              value={user?.profile?.citizenship!}
            />
            <ListProfile
              Icon={LandPlotIcon}
              title="Provinsi"
              value={user?.profile?.province?.name!}
            />
            <ListProfile
              Icon={FlagIcon}
              title="Kota"
              value={user?.profile?.city?.name!}
            />
            <ListProfile
              Icon={LoaderIcon}
              title="Kabupaten"
              value={user?.profile?.district?.name!}
            />
            <ListProfile
              Icon={MapPin}
              title="Alamat"
              value={user?.profile?.address!}
            />
          </div>
        </ul>
        <p className="mt-8 text-gray-500">Kontak</p>
        <ul className="text-md mt-2 flex flex-col gap-2 text-gray-500">
          <div className="flex flex-col gap-2">
            <ListProfile
              Icon={PhoneCallIcon}
              title="Telp/wa"
              value={user?.profile?.phone!}
            />
            <ListProfile Icon={MailIcon} title="Email" value={user?.email!} />
          </div>
        </ul>

        <p className="mt-8 text-gray-500">Sosial Media</p>
        <ul className="text-md mt-2 flex flex-col gap-2 text-gray-500">
          <div className="flex flex-col gap-2">
            <ListProfile
              Icon={FacebookIcon}
              title="Facebook"
              value={user?.profile?.phone!}
            />
            <ListProfile
              Icon={InstagramIcon}
              title="Instagram"
              value={user?.email!}
            />
            <ListProfile Icon={Ticket} title="Tik Tok" value={user?.email!} />
          </div>
        </ul>
      </CardBody>
    </Card>
  );
}
