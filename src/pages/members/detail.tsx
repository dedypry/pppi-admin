import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Button,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Textarea,
  Alert,
} from "@heroui/react";
import {
  DownloadIcon,
  EditIcon,
  MailCheckIcon,
  RefreshCwIcon,
  PhoneIcon,
  MapPinIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  HashIcon,
  CalendarIcon,
  RotateCcwIcon,
  ShieldIcon,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";

import FormSetting from "./form-setting";

import Gender from "@/components/gender";
import { dateFormat } from "@/utils/helpers/formater";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUserDetail, handleApprove } from "@/stores/features/user/action";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { chipColor } from "@/utils/helpers/global";
import { formatNia, parseJobTitles } from "@/utils/helpers/format";
import { confirmSweet } from "@/utils/helpers/confirm";
import CustomInput from "@/components/forms/custom-input";
import RegisterMember from "@/components/auth/register";

function verificationLabel(status?: string | null) {
  switch (status) {
    case "pending":
      return "Email Terkirim";
    case "re_verified":
      return "Re Verified";
    case "submitted":
      return "Menunggu Approve";
    case "approved":
      return "Terverifikasi";
    case "rejected":
      return "Ditolak";
    default:
      return "Belum Dikirim";
  }
}

function verificationColor(status?: string | null) {
  switch (status) {
    case "pending":
      return "warning";
    case "re_verified":
      return "secondary";
    case "submitted":
      return "primary";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "default";
  }
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-default-100 py-3 last:border-b-0">
      {icon && (
        <div className="mt-0.5 text-gray-400 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-gray-700 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function MemberDetail() {
  const [modal, setModal] = useState(false);
  const { detail: user } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [nia, setNia] = useState("");
  const [verificationNote, setVerificationNote] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [renewingNia, setRenewingNia] = useState(false);

  const fullName = [user?.front_title, user?.name, user?.back_title]
    .filter(Boolean)
    .join(" ");
  const jobTitles = parseJobTitles(user?.job_title);
  const isPengurus = !!(user?.administrator_role || user?.region);
  const wilayahLabel = user?.region
    ? String(user.region).split(" - ")[0]?.trim() || user.region
    : null;
  const pengurusCode = user?.administrator_role
    ? String(user.administrator_role).split(" ")[0]?.replace(/[()]/g, "") ||
      user.administrator_role
    : null;
  const jabatanLabel = jobTitles.length > 0 ? jobTitles.join(", ") : null;
  const kepengurusanParts = [
    wilayahLabel ? `wilayah ${wilayahLabel}` : null,
    pengurusCode ? `tingkat ${pengurusCode}` : null,
    jabatanLabel ? `sebagai ${jabatanLabel}` : null,
  ].filter(Boolean) as string[];
  const kepengurusanSummary =
    isPengurus && kepengurusanParts.length > 0
      ? `Anggota ini merupakan bagian dari kepengurusan ${kepengurusanParts.join(", ")}.`
      : null;

  useEffect(() => {
    dispatch(getUserDetail({ id: id as any }));
  }, []);

  useEffect(() => {
    setVerificationNote(user?.verification_note || "");
  }, [user?.verification_note]);

  async function downloadKta() {
    setLoading(true);
    try {
      const response = await http.get(`/members/download/${id}`, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `kta-${user?.name}.pdf`;

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

  function renewNia() {
    confirmSweet(
      () => {
        setRenewingNia(true);
        http
          .patch(`/members/${user?.id}/renew-nia`)
          .then(({ data }) => {
            notify(data.message || "NIA berhasil diperbaharui");
            dispatch(getUserDetail({ id: id as any }));
          })
          .catch((err) => notifyError(err))
          .finally(() => setRenewingNia(false));
      },
      {
        text: "NIA akan diganti dengan nomor urut terbaru. Lanjutkan?",
        confirmButtonText: "Ya, perbaharui",
        confirmButtonColor: "#15980d",
      },
    );
  }

  function resendVerification() {
    if (!verificationNote.trim()) {
      notify("Catatan verifikasi wajib diisi", "error");

      return;
    }

    confirmSweet(
      () => {
        setVerifying(true);
        http
          .post(`/users/send-email-verification`, {
            ids: [Number(user?.id)],
            note: verificationNote,
            resend: true,
          })
          .then(({ data }) => {
            notify(data.message);
            dispatch(getUserDetail({ id: id as any }));
          })
          .catch((err) => notifyError(err))
          .finally(() => setVerifying(false));
      },
      {
        text: "Kirim ulang email verifikasi ke anggota ini?",
        confirmButtonText: "Ya, kirim",
        confirmButtonColor: "#15980d",
      },
    );
  }

  function handleApproveVerification(approved: boolean) {
    if (!approved && !verificationNote.trim()) {
      notify("Catatan penolakan wajib diisi", "error");

      return;
    }

    confirmSweet(
      () => {
        setVerifying(true);
        http
          .patch(`/users/${user?.id}/approve-verification`, {
            approved,
            note: verificationNote || undefined,
          })
          .then(({ data }) => {
            notify(data.message);
            dispatch(getUserDetail({ id: id as any }));
          })
          .catch((err) => notifyError(err))
          .finally(() => setVerifying(false));
      },
      {
        text: approved
          ? "Setujui verifikasi anggota ini?"
          : "Tolak verifikasi anggota ini?",
        confirmButtonText: approved ? "Ya, setujui" : "Ya, tolak",
        confirmButtonColor: approved ? "#15980d" : "#f31260",
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
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

      {/* Hero */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 px-6 pb-16 pt-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white">
                Detail Anggota
              </p>
              <h1 className="mt-1 text-2xl font-semibold !text-white sm:text-3xl">
                {fullName || "-"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Chip
                  className="bg-white/15 text-white"
                  size="sm"
                  variant="flat"
                >
                  {user?.email || "-"}
                </Chip>
                <Chip
                  color={chipColor(user?.status!) as any}
                  size="sm"
                  variant="solid"
                >
                  {user?.status || "-"}
                </Chip>
                <Chip
                  color={verificationColor(user?.verification_status) as any}
                  size="sm"
                  variant="solid"
                >
                  {verificationLabel(user?.verification_status)}
                </Chip>
              </div>
            </div>
            <Button
              className="bg-white/15 text-white backdrop-blur-sm"
              radius="full"
              startContent={<EditIcon size={16} />}
              variant="flat"
              onPress={() => setModal(true)}
            >
              Edit Data
            </Button>
          </div>
        </div>
        <CardBody className="relative -mt-10 px-6 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <Avatar
              isBordered
              className="h-28 w-28 ring-4 ring-white"
              color={user?.profile?.gender == "female" ? "danger" : "success"}
              src={user?.profile?.photo}
            />
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Gender gender={user?.profile?.gender!} />
                {jobTitles.map((title) => (
                  <Chip key={title} color="secondary" size="sm">
                    {title}
                  </Chip>
                ))}
                {pengurusCode && (
                  <Chip color="warning" size="sm">
                    {pengurusCode}
                  </Chip>
                )}
                {wilayahLabel && (
                  <Chip color="success" size="sm">
                    {wilayahLabel}
                  </Chip>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-default-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    NIK
                  </p>
                  <p className="mt-1 font-medium text-gray-700">
                    {user?.profile?.nik || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-default-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Telepon
                  </p>
                  <p className="mt-1 font-medium text-gray-700">
                    {user?.profile?.phone || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-default-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Bergabung
                  </p>
                  <p className="mt-1 font-medium text-gray-700">
                    {user?.join_year || "-"} · {dateFormat(user?.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          {/* NIA Card */}
          <Card className="border border-success-100 shadow-sm">
            <CardHeader className="flex items-center justify-between pb-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-50 text-success-600">
                  <HashIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">NIA</p>
                  <p className="text-xs text-gray-400">Nomor Induk Anggota</p>
                </div>
              </div>
              <Chip color="warning" size="sm" variant="flat">
                Diperbaharui {user?.nia_renew_count || 0}x
              </Chip>
            </CardHeader>
            <CardBody className="gap-3">
              {user?.nia ? (
                <p className="rounded-xl bg-success-50 px-4 py-3 text-center text-xl font-semibold tracking-wide text-success-700">
                  {formatNia(user.nia)}
                </p>
              ) : (
                <p className="rounded-xl bg-default-50 px-4 py-3 text-center text-sm text-gray-400">
                  Belum memiliki NIA
                </p>
              )}
              {user?.status === "approved" && (
                <Button
                  fullWidth
                  color="success"
                  isLoading={renewingNia}
                  startContent={
                    !renewingNia ? <RotateCcwIcon size={16} /> : null
                  }
                  variant="flat"
                  onPress={renewNia}
                >
                  Perbaharui NIA
                </Button>
              )}
            </CardBody>
          </Card>

          {/* Kepengurusan */}
          <Card className="border border-primary/20 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Kepengurusan
                  </p>
                  <p className="text-xs text-gray-400">
                    Status struktural anggota
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="gap-3">
              {kepengurusanSummary ? (
                <>
                  <Alert
                    color="primary"
                    description={kepengurusanSummary}
                    title="Keterangan"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <div className="rounded-xl bg-primary/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">
                        Wilayah
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-700">
                        {user?.region || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-primary/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">
                        Tingkat Pengurus
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-700">
                        {user?.administrator_role || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-primary/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">
                        Jabatan
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-700">
                        {jabatanLabel || "-"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="rounded-xl bg-default-50 px-4 py-3 text-center text-sm text-gray-400">
                  Anggota ini belum terdaftar dalam struktur kepengurusan.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Verification */}
          <Card className="shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <p className="font-semibold text-gray-700">Status Verifikasi</p>
              <Chip
                color={verificationColor(user?.verification_status) as any}
                size="sm"
                variant="flat"
              >
                {verificationLabel(user?.verification_status)}
              </Chip>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              {user?.verification_note && (
                <Alert
                  color={
                    user?.verification_status === "rejected"
                      ? "danger"
                      : "primary"
                  }
                  description={user.verification_note}
                  title="Catatan Verifikasi"
                />
              )}
              <Textarea
                label="Catatan Verifikasi"
                minRows={3}
                placeholder="Tulis catatan untuk verify, reject, atau ulangi verifikasi"
                value={verificationNote}
                variant="bordered"
                onChange={(e) => setVerificationNote(e.target.value)}
              />
              <Button
                fullWidth
                color="warning"
                isLoading={verifying}
                startContent={<RefreshCwIcon size={16} />}
                variant="shadow"
                onPress={resendVerification}
              >
                Ulangi Verifikasi
              </Button>
              {user?.verification_status !== "approved" && (
                <div className="flex gap-2">
                  <Button
                    fullWidth
                    color="danger"
                    isLoading={verifying}
                    radius="full"
                    size="sm"
                    onPress={() => handleApproveVerification(false)}
                  >
                    Reject
                  </Button>
                  <Button
                    fullWidth
                    color="success"
                    isLoading={verifying}
                    radius="full"
                    size="sm"
                    onPress={() => handleApproveVerification(true)}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {user?.status == "rejected" && user?.rejected_note && (
            <Alert
              color="danger"
              description={user.rejected_note}
              title="Catatan Penolakan"
            />
          )}

          {user?.status == "approved" && (
            <Card className="shadow-sm">
              <CardHeader>
                <p className="font-semibold text-gray-700">E-KTA</p>
              </CardHeader>
              <CardBody className="gap-2">
                <Button
                  fullWidth
                  color="primary"
                  isLoading={loading}
                  startContent={<DownloadIcon size={16} />}
                  variant="shadow"
                  onPress={downloadKta}
                >
                  Download E-KTA
                </Button>
                <Button
                  fullWidth
                  color="warning"
                  isLoading={isSendMail}
                  startContent={<MailCheckIcon size={16} />}
                  variant="flat"
                  onPress={sendEmail}
                >
                  Kirim E-KTA via Email
                </Button>
              </CardBody>
            </Card>
          )}

          {user?.status == "approved" && <FormSetting />}

          {user?.status == "submission" && (
            <Card className="shadow-sm">
              <CardHeader>
                <p className="font-semibold text-gray-700">
                  Persetujuan Anggota
                </p>
              </CardHeader>
              <CardBody className="gap-3">
                <CustomInput
                  description="Kosongkan jika NIA di generate oleh system"
                  placeholder="Masukan NIA Secara manual"
                  value={nia}
                  onChange={(e) => setNia(e.target.value)}
                />
                <div className="flex gap-2">
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
              </CardBody>
            </Card>
          )}
        </div>

        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          <Card className="shadow-sm">
            <CardHeader>
              <p className="font-semibold text-gray-700">Informasi Pribadi</p>
            </CardHeader>
            <CardBody className="pt-0">
              <InfoRow
                icon={<CalendarIcon />}
                label="Tempat & Tanggal Lahir"
                value={`${user?.profile?.place_birth || "-"}, ${dateFormat(user?.profile?.date_birth as string)}`}
              />
              <InfoRow
                icon={<PhoneIcon />}
                label="Telepon"
                value={user?.profile?.phone}
              />
              <InfoRow
                icon={<GraduationCapIcon />}
                label="Pendidikan Keperawatan"
                value={
                  user?.profile?.last_education_nursing
                    ? `${user.profile.last_education_nursing} Keperawatan`
                    : "-"
                }
              />
              <InfoRow
                icon={<GraduationCapIcon />}
                label="Pendidikan Formal"
                value={user?.profile?.last_education}
              />
              <InfoRow
                icon={<BriefcaseIcon />}
                label="Tempat Kerja"
                value={user?.profile?.workplace}
              />
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <p className="font-semibold text-gray-700">Alamat & Wilayah</p>
            </CardHeader>
            <CardBody className="pt-0">
              <InfoRow
                icon={<MapPinIcon />}
                label="Provinsi"
                value={user?.profile?.province?.name}
              />
              <InfoRow
                icon={<MapPinIcon />}
                label="Kota"
                value={user?.profile?.city?.name}
              />
              <InfoRow
                icon={<MapPinIcon />}
                label="Kabupaten / Kecamatan"
                value={user?.profile?.district?.name}
              />
              <InfoRow
                icon={<MapPinIcon />}
                label="Alamat Lengkap"
                value={user?.profile?.address}
              />
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <p className="font-semibold text-gray-700">
                Kontribusi & Keanggotaan
              </p>
            </CardHeader>
            <CardBody className="gap-4 pt-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Kontribusi
                </p>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {user?.profile?.contribution || "-"}
                </p>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Harapan
                </p>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {user?.profile?.hope_in || "-"}
                </p>
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-default-50 px-4 py-3">
                  <p className="text-xs text-gray-400">Bersedia membayar</p>
                  <p className="mt-1 font-medium text-gray-700">
                    {user?.profile?.is_member_payment ? "Bersedia" : "Tidak"}
                  </p>
                </div>
                <div className="rounded-xl bg-default-50 px-4 py-3">
                  <p className="text-xs text-gray-400">Alasan tidak bersedia</p>
                  <p className="mt-1 font-medium text-gray-700">
                    {user?.profile?.reason_reject || "-"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <p className="font-semibold text-gray-700">File Attachment</p>
            </CardHeader>
            <CardBody>
              <Image
                alt="bukti pembayaran"
                className="max-h-80 w-auto rounded-xl object-contain"
                src={user?.profile?.member_payment_file || "/no-data.jpeg"}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
