import {
  Card,
  CardBody,
  Avatar,
  Chip,
  CardFooter,
  Button,
  CardHeader,
} from "@heroui/react";
import { DownloadIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Gender from "@/components/gender";
import TextHeader from "@/components/text-header";
import { dateFormat } from "@/utils/helpers/formater";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUserDetail, handleApprove } from "@/stores/features/user/action";

export default function MemberDetail() {
  const { detail: user } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserDetail({ id: id as any }));
  }, []);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 md:col-span-4">
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col items-center gap-4">
              <Avatar
                isBordered
                className="h-28 w-28"
                color={user?.profile.gender == "female" ? "danger" : "success"}
                src={user?.profile.photo}
              />
              <Chip className="text-white" color="success">
                {user?.nia}
              </Chip>
            </CardBody>
            <CardBody className="flex flex-col gap-1">
              <TextHeader title="NIK" val={user?.profile.nik!} />
              <TextHeader
                rightIcon={<Gender gender={user?.profile.gender!} />}
                title="Nama"
                val={user?.name!}
              />
              <TextHeader title="Email" val={user?.email!} />
              <TextHeader
                title="Lahir"
                val={`${user?.profile.place_birth}, ${dateFormat(user?.profile?.date_birth! as string)}`}
              />
              <TextHeader title="Telp" val={user?.profile?.phone!} />
            </CardBody>
            <CardFooter className="flex justify-between">
              <p className="text-[12px] text-gray-500">
                Join Year : {user?.join_year}
              </p>
              <p className="text-[12px] text-gray-500">
                Created At : {dateFormat(user?.created_at)}
              </p>
            </CardFooter>
          </Card>
          {user?.status == "rejected" && user?.rejected_note && (
            <Card>
              <CardBody>
                <p>{user?.rejected_note}</p>
              </CardBody>
            </Card>
          )}
          {user?.approved_at && user?.status !== "rejected" ? (
            <Button
              fullWidth
              as="a"
              className="bg-primary"
              href="/"
              startContent={<DownloadIcon />}
              variant="shadow"
            >
              Download E-KTA
            </Button>
          ) : (
            <div className="mt-2 flex justify-center gap-1">
              <Button
                fullWidth
                color="danger"
                radius="full"
                size="sm"
                onPress={() =>
                  dispatch(
                    handleApprove(
                      {
                        user_id: user?.id as number,
                        approve: false,
                      },
                      () => getUserDetail({ id: id as any }),
                    ),
                  )
                }
              >
                Tolak
              </Button>
              <Button
                fullWidth
                color="primary"
                radius="full"
                size="sm"
                onPress={() =>
                  dispatch(
                    handleApprove(
                      {
                        user_id: user?.id as number,
                        approve: true,
                      },
                      () => getUserDetail({ id: id as any }),
                    ),
                  )
                }
              >
                Setujui
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader>Deskripsi</CardHeader>
            <CardBody className="flex flex-col gap-1">
              <TextHeader
                fontSize="13px"
                title="Provinsi"
                val={user?.profile?.province?.name!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kota"
                val={user?.profile.city.name!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kabupaten"
                val={user?.profile.district.name!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Alamat"
                val={user?.profile.address!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Pendidikan"
                val={`${user?.profile.last_education_nursing} Keperawatan`}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Pendidikan Formal"
                val={user?.profile.last_education!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Tempat Kerja"
                val={user?.profile.workplace!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Harapan"
                val={user?.profile.hope_in || ""}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kontribusi"
                val={user?.profile.contribution || ""}
                width={150}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>File Attachment</CardHeader>
            <CardBody>
              <img
                alt="foto"
                height={200}
                src={user?.profile.member_payment_file!}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
