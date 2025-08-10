import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Radio,
  RadioGroup,
  SelectItem,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { ReactNode, useEffect } from "react";

import CustomDatePicker from "../forms/custom-date-picker";

import CustomInput from "@/components/forms/custom-input";
import { ICreateMember, IUser } from "@/interface/IUser";
import CityList from "@/components/regions/city";
import CustomSelect from "@/components/forms/custom-select";
import DistrictList from "@/components/regions/district";
import ProvinceList from "@/components/regions/province";
import Man from "@/assets/images/man.png";
import Woman from "@/assets/images/woman.png";
import CustomTextArea from "@/components/forms/custom-textarea";
import { educations } from "@/config/app";
import AttachmentSingleFile from "@/components/forms/attacment-singgle-file";
import InputPhotoProfile from "@/components/forms/input-photo-profile";
import debounce from "@/utils/helpers/debounce";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
interface Props {
  onSuccess: () => void;
  action: ReactNode;
  isAdmin?: boolean;
  user?: IUser;
}

export default function RegisterMember({
  onSuccess,
  action,
  isAdmin = true,
  user,
}: Props) {
  const {
    control,
    reset,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<ICreateMember>({
    defaultValues: {
      id: undefined as number | undefined,
      profile_id: undefined as number | undefined,
      join_year: dayjs().format("YY"),
      front_title: "",
      back_title: "",
      sort: "",
      nik: "",
      name: "",
      email: "",
      place_birth: "",
      date_birth: "",
      gender: "",
      citizenship: "",
      address: "",
      province_id: undefined as number | undefined,
      city_id: undefined as number | undefined,
      district_id: undefined as number | undefined,
      phone: "",
      last_education_nursing: "",
      last_education: "",
      workplace: "",
      hope_in: "",
      contribution: "",
      is_member_payment: "yes",
      reason_reject: "",
      photo: "" as string,
      member_payment_file: "" as string,
    },
  });

  useEffect(() => {
    if (user) {
      setValue("id", user.id);
      setValue("profile_id", user?.profile?.id);
      setValue("join_year", user?.join_year as any);
      setValue("front_title", user?.front_title as string);
      setValue("back_title", user?.back_title as string);
      setValue("sort", user?.sort as any);
      setValue("nik", user?.profile.nik);
      setValue("name", user?.name);
      setValue("email", user?.email);
      setValue("place_birth", user?.profile.place_birth);
      setValue(
        "date_birth",
        dayjs(user?.profile.date_birth).format("DD MMMM YYYY"),
      );
      setValue("gender", user?.profile.gender);
      setValue("citizenship", user?.profile.citizenship);
      setValue("address", user?.profile.address);
      setValue("province_id", user?.profile.province_id);
      setValue("city_id", user?.profile.city_id);
      setValue("district_id", user?.profile.district_id);
      setValue("phone", user?.profile.phone);
      setValue("last_education_nursing", user?.profile.last_education_nursing);
      setValue("last_education", user?.profile.last_education);
      setValue("workplace", user?.profile.workplace);
      setValue("hope_in", user?.profile.hope_in);
      setValue("contribution", user?.profile.contribution);
      setValue(
        "is_member_payment",
        user?.profile.is_member_payment ? "yes" : "no",
      );
      setValue("reason_reject", user?.profile.reason_reject);
      setValue("photo", user?.profile.photo);
      setValue("member_payment_file", user?.profile.member_payment_file);
    }
  }, [user]);

  useEffect(() => {
    const email = watch("email");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && regex.test(email)) {
      debounceCheckEmail(email);
    }
  }, [watch("email")]);

  const debounceCheckEmail = debounce((email: string) => {
    http
      .post("/users/check-email", { email, user_id: user?.id })
      .then(({ data }) => {
        if (data.message) {
          clearErrors("email");
        }
      })
      .catch((err) => {
        const { message } = err?.response?.data;

        if (message) {
          setError("email", {
            type: "manual",
            message,
          });
        }
      });
  }, 1000);

  const onSubmitData: SubmitHandler<ICreateMember> = async (
    data: ICreateMember,
  ) => {
    http({
      url: "/members",
      method: "POST",
      data: {
        ...data,
        date_birth: dayjs(data.date_birth).toDate(),
        is_member_payment: data.is_member_payment === "yes",
      },
    })
      .then(({ data }) => {
        notify(data.message);
        reset();
        onSuccess();
      })
      .catch((err) => notifyError(err));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitData)}>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <p>Profile</p>
          {isAdmin && (
            <div className="flex gap-2">
              <Controller
                control={control}
                name="join_year"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="Tahun Bergabung"
                    labelPlacement="outside-left"
                    size="sm"
                    type="number"
                  />
                )}
                rules={{ required: true }}
              />
              <CustomInput
                label="No. Urut"
                labelPlacement="outside-left"
                size="sm"
                type="number"
                value={watch("sort")}
                onChange={(e) => setValue("sort", e.target.value)}
              />
            </div>
          )}
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <div className="flex justify-start">
                <Controller
                  control={control}
                  name="photo"
                  render={({ field }) => (
                    <InputPhotoProfile
                      errorMessage={
                        errors.photo?.message || "Foto tidak boleh kosong"
                      }
                      isInvalid={!!errors.photo}
                      photo={field.value}
                      setPhoto={(val) => field.onChange(val)}
                    />
                  )}
                  rules={{ required: true }}
                />
              </div>
              <Divider className="my-10" />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="front_title"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="Gelar Depan akan tampil di Kartu anggota"
                    errorMessage="Gelar Depan tidak boleh kosong"
                    isInvalid={!!errors.front_title}
                    label="Gelar Depan"
                    placeholder="Ex: Dr, Br, Sr"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="gunakan huruf CAPITAL contoh:ANI"
                    errorMessage="Nama Tidak Boleh Kosong"
                    isInvalid={!!errors.name}
                    label="Nama Lengkap (tanpa gelar)"
                    placeholder="Nama Anggota"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="back_title"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="Gelar Belakang akan tampil di Kartu anggota"
                    errorMessage="Gelar Belakang tidak boleh kosong"
                    isInvalid={!!errors.back_title}
                    label="Gelar Belakang"
                    placeholder="contoh S.Kep, Ners ..."
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-6">
              <Controller
                control={control}
                name="nik"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="NIK terdiri dari 16 digit angka"
                    errorMessage={
                      errors.nik?.message || "Nik Tidak boleh Kosong"
                    }
                    isInvalid={!!errors.nik}
                    label="Nomor Induk KTP"
                    placeholder="NIK Anggota"
                  />
                )}
                rules={{ required: true }}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-6">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="Pastikan No anda aktif"
                    errorMessage={
                      errors.phone?.message || "No Telp/WA tidak boleh kosong"
                    }
                    isInvalid={!!errors.phone}
                    label="No Telp/WA (Aktif)"
                    placeholder="No Telp/WA Anggota"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-8">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="Pastikan email anda aktif, system akan mengirimkan pemberitahuan melalui email ini"
                    errorMessage={
                      errors.email?.message || "Email tidak boleh kosong"
                    }
                    isInvalid={!!errors.email}
                    label="Email Anggota  (Aktif)"
                    placeholder="Email Anggota"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="place_birth"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    errorMessage={
                      errors.place_birth?.message ||
                      "Tempat Lahir tidak boleh kosong"
                    }
                    isInvalid={!!errors.place_birth}
                    label="Tempat Lahir"
                    placeholder="Masukan Tempat Lahir"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="date_birth"
                render={({ field }) => (
                  <CustomDatePicker
                    isRequired
                    errorMessage={
                      errors.date_birth?.message ||
                      "Tanggal Lahir tidak boleh kosong"
                    }
                    isInvalid={!!errors.date_birth}
                    label="Tanggal Lahir"
                    placeholder="Masukan Tanggal Lahir"
                    value={field.value as any}
                    onChageValue={(e) => field.onChange(e)}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isRequired
                    errorMessage={
                      errors.gender?.message ||
                      "Jenis Kelamin tidak boleh kosong"
                    }
                    isInvalid={!!errors.gender}
                    label="Jenis Kelamin"
                    placeholder="Masukan Jenis Kelamin"
                    selectedKeys={[field.value]}
                  >
                    <SelectItem
                      key="male"
                      startContent={<Avatar isBordered size="sm" src={Man} />}
                    >
                      Laki-laki
                    </SelectItem>
                    <SelectItem
                      key="female"
                      startContent={<Avatar isBordered size="sm" src={Woman} />}
                    >
                      Perempuan
                    </SelectItem>
                  </CustomSelect>
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="citizenship"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isRequired
                    errorMessage={
                      errors.citizenship?.message ||
                      "Kewarganegaraan tidak boleh kosong"
                    }
                    isInvalid={!!errors.citizenship}
                    label="Kewarganegaraan"
                    placeholder="Masukan Kewarganegaraan"
                    selectedKeys={[field.value]}
                  >
                    <SelectItem key="wni">
                      WNI (Warga Negara Indonesia)
                    </SelectItem>
                    <SelectItem key="wna">WNA (Warga Negara Asing) </SelectItem>
                  </CustomSelect>
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="province_id"
                render={({ field }) => (
                  <ProvinceList
                    isRequired
                    errorMessage={
                      errors.province_id?.message ||
                      "Provinsi tidak boleh kosong"
                    }
                    isInvalid={!!errors.province_id}
                    setValue={(val) => field.onChange(val)}
                    value={field.value?.toString()}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <CityList
                    isRequired
                    errorMessage={
                      errors.city_id?.message || "Kota tidak boleh kosong"
                    }
                    isInvalid={!!errors.city_id}
                    provinceId={watch("province_id")}
                    setValue={(val) => field.onChange(val)}
                    value={field.value}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <Controller
                control={control}
                name="district_id"
                render={({ field }) => (
                  <DistrictList
                    isRequired
                    cityId={watch("city_id")}
                    errorMessage={
                      errors.district_id?.message ||
                      "Kelurahan tidak boleh kosong"
                    }
                    isInvalid={!!errors.district_id}
                    setValue={(val) => field.onChange(val)}
                    value={field.value}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12">
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <CustomTextArea
                    {...field}
                    isRequired
                    errorMessage={
                      errors.address?.message || "Alamat Tidak boleh kosong"
                    }
                    isInvalid={!!errors.address}
                    label="Alamat"
                    placeholder="Masukan Alamat Lengkap"
                    value={field.value?.toString() ?? ""}
                  />
                )}
                rules={{ required: true }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Pendidikan dan Pekerjaan</CardHeader>
        <CardBody>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <Controller
                control={control}
                name="last_education_nursing"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isRequired
                    errorMessage={
                      errors.last_education_nursing?.message ||
                      "Pendidikan Terakhir Keperawatan tidak boleh kosong"
                    }
                    isInvalid={!!errors.last_education_nursing}
                    label="Pendidikan Terakhir Keperawatan"
                    placeholder="Pilih Pendidikan Terakhir"
                    selectedKeys={[field.value]}
                  >
                    {educations.map((item) => (
                      <SelectItem key={item}>{item}</SelectItem>
                    ))}
                  </CustomSelect>
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <Controller
                control={control}
                name="last_education"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    description="Pendidikan Terakhir selain Keperawatan (Formal)"
                    errorMessage={
                      errors.last_education?.message ||
                      "Pendidikan Terakhir tidak boleh kosong"
                    }
                    isInvalid={!!errors.last_education}
                    label="Pendidikan Terakhir"
                    placeholder="Pendidikan Terakhir"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <Controller
                control={control}
                name="workplace"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    isRequired
                    description="Instansi/Institusi Tempat Bekerja (saat ini)"
                    errorMessage={
                      errors.workplace?.message ||
                      "Tempat Bekerja tidak boleh kosong"
                    }
                    isInvalid={!!errors.workplace}
                    label="Tempat Bekerja"
                    placeholder="Pendidikan Terakhir non perawat"
                  />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <Controller
                control={control}
                name="contribution"
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    description="Kontribusi yang diharapkan dapat diberikan untuk Organisasi (PPPI/P3I)"
                    label="Kontribusi"
                    placeholder="Tuliskan Kontribusi"
                  />
                )}
              />
            </div>
            <div className="col-span-12">
              <Controller
                control={control}
                name="hope_in"
                render={({ field }) => (
                  <CustomTextArea
                    {...field}
                    description="Kontribusi yang diharapkan dapat diberikan untuk Organisasi (PPPI/P3I)"
                    label="Apa yang di Harapkan"
                    placeholder="Tuliskan Harapkan"
                  />
                )}
              />
            </div>
            <div className="col-span-12">
              <Controller
                control={control}
                name="is_member_payment"
                render={({ field }) => (
                  <RadioGroup
                    isRequired
                    errorMessage={
                      errors.is_member_payment?.message ||
                      "Field ini tidak boleh kosong"
                    }
                    isInvalid={!!errors.is_member_payment}
                    label="Kontribusi Keanggotaan sebesar Rp. 100.000,-(sebagai anggota baru)"
                    orientation="horizontal"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <Radio value="yes">Bersedia</Radio>
                    <Radio value="no">Tidak Bersedia</Radio>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {watch("is_member_payment") == "yes" ? (
        <Controller
          control={control}
          name="member_payment_file"
          render={({ field }) => (
            <AttachmentSingleFile
              description="Jika bersedia, dapat dikirimkan melalui BRI KCP Jatinegara No.Rek: 120601000397303 a.n Perkumpulan Perawat Pembaharuan Indonesia"
              errorMessage={
                errors.member_payment_file?.message ||
                "File Transfer Tidak boleh kosong"
              }
              file={watch("member_payment_file")}
              isInvalid={!!errors.member_payment_file}
              label="Bukti Transfer"
              setFile={(val) => field.onChange(val)}
            />
          )}
          rules={{ required: true }}
        />
      ) : (
        <Card>
          <CardBody>
            <Controller
              control={control}
              name="reason_reject"
              render={({ field }) => (
                <CustomTextArea
                  {...field}
                  isRequired
                  errorMessage={errors.reason_reject?.message}
                  isInvalid={!!errors.reason_reject}
                  label="Alasan Tidak Bersedia"
                  placeholder="Masukan Alasan"
                />
              )}
              rules={{ required: true }}
            />
          </CardBody>
        </Card>
      )}

      {action}
    </form>
  );
}
