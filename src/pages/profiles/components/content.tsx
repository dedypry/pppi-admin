import { Tab, Tabs } from "@heroui/react";
import { FolderRootIcon, ShieldAlert, User2Icon } from "lucide-react";

import Password from "./password";
import FormProfile from "./form-profile";
import BioForm from "./bio";

import { IUser } from "@/interface/IUser";

interface Props {
  user: IUser;
}
export default function Content({ user }: Props) {
  return (
    <div className="relative">
      <Tabs>
        <Tab
          key="Profile"
          title={
            <div className="flex space-x-2">
              <User2Icon size={20} /> <span>Profile</span>
            </div>
          }
        >
          <FormProfile user={user} />
        </Tab>
        <Tab
          key="bio"
          title={
            <div className="flex space-x-2">
              <FolderRootIcon size={20} /> <span>bio</span>
            </div>
          }
        >
          <BioForm />
        </Tab>
        <Tab
          key="security"
          title={
            <div className="flex space-x-2">
              <ShieldAlert size={20} /> <span>Keamanan</span>
            </div>
          }
        >
          <Password />
        </Tab>
      </Tabs>
    </div>
  );
}
