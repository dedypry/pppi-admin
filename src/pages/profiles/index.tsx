import { Avatar, Button, Card } from "@heroui/react";
import { Building2, CalendarCheck2Icon, EditIcon, MapPin } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import LeftProfile from "./components/left-profile";
import Content from "./components/content";

import { useAppSelector } from "@/stores/hooks";
import { dateFormat } from "@/utils/helpers/formater";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";

export default function ProfilePage() {
  const [file, setFile] = useState<File>();
  const { user } = useAppSelector((state) => state.user);

  const ref = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setFile(file);

      try {
        const { url } = await uploadFile(file, "profiles");

        updatePhoto(url);
      } catch (error) {
        console.error(error);
        notifyError(error as any);
      }
    }
  }

  function updatePhoto(url: string) {
    http
      .patch("/profile/photo", { photo: url })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="z-0 h-[300px] w-full bg-gradient-to-br from-primary to-cyan-400" />
        <div className="relative h-[100px] w-full px-5">
          <div className="absolute -top-1/2 z-10">
            <div className="group relative cursor-pointer">
              <input
                ref={ref}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />
              <Avatar
                isBordered
                className="h-32 w-32"
                radius="lg"
                src={file ? URL.createObjectURL(file) : user?.profile?.photo}
                onClick={() => ref.current?.click()}
              />
              <div className="absolute bottom-1 right-1 hidden group-hover:block">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => ref.current?.click()}
                >
                  <EditIcon className="text-white" size={20} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pl-40 pt-2">
            <div className="flex flex-col gap-3">
              <p className="text-[20px] font-semibold">{user?.name}</p>
              <div className="flex gap-2 text-gray-500">
                <div className="flex gap-2">
                  <Building2 size={20} />{" "}
                  <p className="text-sm">
                    {/* {user?.department?.name || "Kesehatan"} */}
                  </p>
                </div>
                <div className="flex gap-2">
                  <MapPin size={20} />{" "}
                  <p className="text-sm">{user?.profile?.address}</p>
                </div>
                <div className="flex gap-2">
                  <CalendarCheck2Icon size={20} />{" "}
                  <p className="text-sm">
                    Bergabung, {dateFormat(user?.created_at)}
                  </p>
                </div>
              </div>
            </div>
            {user?.nia && (
              <div>
                <Button color="primary">Download CV</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-20">
            <LeftProfile user={user!} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <Content user={user!} />
        </div>
      </div>
    </div>
  );
}
