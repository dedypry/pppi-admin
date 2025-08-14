import {
  Card,
  CardBody,
  Avatar,
  Chip,
  CardFooter,
  Button,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
} from "@heroui/react";
import { DownloadIcon, EditIcon, MailCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";

import FormSetting from "./form-setting";

import Gender from "@/components/gender";
import TextHeader from "@/components/text-header";
import { dateFormat } from "@/utils/helpers/formater";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUserDetail, handleApprove } from "@/stores/features/user/action";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { chipColor } from "@/utils/helpers/global";
import { confirmSweet } from "@/utils/helpers/confirm";
import CustomInput from "@/components/forms/custom-input";
import RegisterMember from "@/components/auth/register";

export default function MemberDetail() {
  const [modal, setModal] = useState(false);
  const { detail: user } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [nia, setNia] = useState("");

  useEffect(() => {
    dispatch(getUserDetail({ id: id as any }));
  }, []);

  async function downloadKta() {
    setLoading(true);
    try {
      const response = await http.get(`/members/download/${id}`, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `kta-${user?.name}.pdf`; // fallback

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);

        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }
      saveAs(response.data, filename);
    } catch (error) {
      console.error("Gagal mengunduh file:", error);

      notify("Gagal mengunduh file", "error");
    } finally {
      setLoading(false);
    }
  }

  function sendEmail() {
    setIsSendMail(true);
    http
      .post(`/members/send-mail/${user?.id}`)
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => setIsSendMail(false));
  }

  return (
    <div className="grid grid-cols-12 gap-5">
      <Modal
        isOpen={modal}
        scrollBehavior="outside"
        size="5xl"
        onOpenChange={() => setModal(!modal)}
      >
        <ModalContent>
          <ModalHeader>Update Data</ModalHeader>
          <ModalBody>
            <RegisterMember
              action={
                <div className="flex justify-end gap-3">
                  <Button color="primary" type="submit" variant="shadow">
                    {id ? "Update" : "Add"} Member
                  </Button>
                  <Button color="secondary" variant="bordered">
                    Cancel
                  </Button>
                </div>
              }
              paymentFile={false}
              requireRegion={false}
              user={user!}
              onSuccess={() => {
                setModal(false);
                dispatch(getUserDetail({ id: id as any }));
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="col-span-12 md:col-span-4">
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col items-center gap-4">
              <Avatar
                isBordered
                className="h-28 w-28"
                color={user?.profile?.gender == "female" ? "danger" : "success"}
                src={user?.profile?.photo}
              />
              {user?.nia && (
                <Chip className="text-white" color="success">
                  {user?.nia}
                </Chip>
              )}
            </CardBody>
            <CardBody className="flex flex-col gap-1">
              <TextHeader title="NIK" val={user?.profile?.nik!} />
              <TextHeader
                rightIcon={<Gender gender={user?.profile?.gender!} />}
                title="Nama"
                val={user?.name!}
              />
              <TextHeader title="Email" val={user?.email!} />
              <TextHeader
                title="Lahir"
                val={`${user?.profile?.place_birth}, ${dateFormat(user?.profile?.date_birth! as string)}`}
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
            <CardFooter className="flex justify-between">
              <Chip color={chipColor(user?.status!) as any} variant="dot">
                {user?.status}
              </Chip>
            </CardFooter>
          </Card>
          {user?.status == "rejected" && user?.rejected_note && (
            <Card>
              <CardBody>
                <p>{user?.rejected_note}</p>
              </CardBody>
            </Card>
          )}
          {user?.status == "approved" && (
            <>
              <Button
                fullWidth
                color="primary"
                isLoading={loading}
                startContent={<DownloadIcon />}
                variant="shadow"
                onPress={downloadKta}
              >
                Download E-KTA
              </Button>
              <Button
                fullWidth
                color="warning"
                isLoading={isSendMail}
                startContent={<MailCheckIcon />}
                variant="shadow"
                onPress={sendEmail}
              >
                Kirm E-KTA via email
              </Button>
              <FormSetting />
            </>
          )}
          {user?.status == "submission" && (
            <Card>
              <CardBody>
                <div className="mt-2 flex flex-col gap-2">
                  <CustomInput
                    description="Kosongkan jika NIA di generate oleh system"
                    placeholder="Masukan NIA Secara manual"
                    value={nia}
                    onChange={(e) => setNia(e.target.value)}
                  />
                  <div className="mt-2 flex justify-center gap-1">
                    <Button
                      fullWidth
                      color="danger"
                      radius="full"
                      size="sm"
                      onPress={() =>
                        confirmSweet(
                          () =>
                            dispatch(
                              handleApprove(
                                {
                                  user_id: user?.id as number,
                                  approve: false,
                                },
                                () => getUserDetail({ id: id as any }),
                              ),
                            ),
                          {
                            confirmButtonText: "Ya, Tolak",
                          },
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
                              nia: nia,
                            },
                            () => getUserDetail({ id: id as any }),
                          ),
                        )
                      }
                    >
                      Setujui
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="flex justify-between">
              <p className="text-gray-600 font-bold">Deskripsi</p>
              <Button
                isIconOnly
                radius="full"
                variant="light"
                onPress={() => setModal(true)}
              >
                <EditIcon className="text-warning" />
              </Button>
            </CardHeader>
            <CardBody className="flex flex-col gap-1">
              <TextHeader
                fontSize="13px"
                title="Pendidikan"
                val={`${user?.profile?.last_education_nursing} Keperawatan`}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Pendidikan Formal"
                val={user?.profile?.last_education!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Tempat Kerja"
                val={user?.profile?.workplace!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Harapan"
                val={user?.profile?.hope_in || ""}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kontribusi"
                val={user?.profile?.contribution || ""}
                width={150}
              />

              <TextHeader
                fontSize="13px"
                title="Provinsi"
                val={user?.profile?.province?.name!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kota"
                val={user?.profile?.city?.name!}
                width={150}
              />
              <TextHeader
                fontSize="13px"
                title="Kabupaten"
                val={user?.profile?.district?.name!}
                width={150}
              />

              <TextHeader
                fontSize="13px"
                horizontal={true}
                title="Alamat"
                val={user?.profile?.address!}
                width={150}
              />
              <Divider />

              <TextHeader
                fontSize="13px"
                title="Bersedia membayar"
                val={user?.profile?.is_member_payment ? "Bersedia" : "Tidak"}
                width={150}
              />

              <TextHeader
                fontSize="13px"
                horizontal={true}
                title="Alasa Tidak bersedia"
                val={user?.profile?.reason_reject || ""}
                width={150}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="text-gray-600 font-bold">
              File Attachment
            </CardHeader>
            <CardBody>
              <Image
                alt="foto"
                className="max-w-1/2"
                src={user?.profile?.member_payment_file! || "/no-data.jpeg"}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
