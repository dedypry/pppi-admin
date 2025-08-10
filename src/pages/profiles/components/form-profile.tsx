import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  SelectItem,
  Avatar,
  CardHeader,
  Button,
} from "@heroui/react";

import Woman from "@/assets/images/woman.png";
import Man from "@/assets/images/man.png";
import { ICreateMember, IUser } from "@/interface/IUser";
import CustomDatePicker from "@/components/forms/custom-date-picker";
import CustomInput from "@/components/forms/custom-input";
import CustomSelect from "@/components/forms/custom-select";
import CityList from "@/components/regions/city";
import DistrictList from "@/components/regions/district";
import ProvinceList from "@/components/regions/province";
import { educations } from "@/config/app";
import CustomTextarea from "@/components/forms/custom-textarea";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { setUser } from "@/stores/features/user/userSlice";

interface Props {
  user?: IUser;
}
export default function FormProfile({ user }: Props) {
  const [processing, setProcesing] = useState(false);
  const dispatch = useAppDispatch();
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
      photo: "" as string,
    },
  });

  useEffect(() => {
    if (user) {
      setValue("id", user?.id);
      setValue("profile_id", user?.profile?.id!);
      setValue("join_year", user?.join_year! as any);
      setValue("front_title", user?.front_title! as string);
      setValue("back_title", user?.back_title! as string);
      setValue("sort", user?.sort! as any);
      setValue("nik", user?.profile?.nik!);
      setValue("name", user?.name!);
      setValue("email", user?.email!);
      setValue("place_birth", user?.profile?.place_birth!);
      setValue(
        "date_birth",
        dayjs(user?.profile?.date_birth!).format("DD MMMM YYYY"),
      );
      setValue("gender", user?.profile?.gender!);
      setValue("citizenship", user?.profile?.citizenship!);
      setValue("address", user?.profile?.address!);
      setValue("province_id", user?.profile?.province_id!);
      setValue("city_id", user?.profile?.city_id!);
      setValue("district_id", user?.profile?.district_id!);
      setValue("phone", user?.profile?.phone!);
      setValue(
        "last_education_nursing",
        user?.profile?.last_education_nursing!,
      );
      setValue("last_education", user?.profile?.last_education!);
      setValue("workplace", user?.profile?.workplace!);
      setValue("photo", user?.profile?.photo!);
    }
  }, [user]);

  function onSubmit(data: ICreateMember) {
    setProcesing(true);
    http
      .patch("/profile", data)
      .then(({ data }) => {
        notify(data.message);
        getProfile();
      })
      .catch((err) => notifyError(err))
      .finally(() => setProcesing(false));
  }

  function getProfile() {
    http
      .get("/profile")
      .then(({ data }) => {
        dispatch(setUser(data));
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => setProcesing(false));
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardBody className="flex flex-col gap-4">
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
          <Controller
            control={control}
            name="nik"
            render={({ field }) => (
              <CustomInput
                {...field}
                isRequired
                description="NIK terdiri dari 16 digit angka"
                errorMessage={errors.nik?.message || "Nik Tidak boleh Kosong"}
                isInvalid={!!errors.nik}
                label="Nomor Induk KTP"
                placeholder="NIK Anggota"
              />
            )}
            rules={{ required: true }}
          />
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
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <CustomSelect
                {...field}
                isRequired
                errorMessage={
                  errors.gender?.message || "Jenis Kelamin tidak boleh kosong"
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
                <SelectItem key="wni">WNI (Warga Negara Indonesia)</SelectItem>
                <SelectItem key="wna">WNA (Warga Negara Asing) </SelectItem>
              </CustomSelect>
            )}
            rules={{ required: true }}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Pendidikan dan Pekerjaan</CardHeader>
        <CardBody className="flex flex-col gap-4">
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
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Alamat</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Controller
            control={control}
            name="province_id"
            render={({ field }) => (
              <ProvinceList
                isRequired
                errorMessage={
                  errors.province_id?.message || "Provinsi tidak boleh kosong"
                }
                isInvalid={!!errors.province_id}
                setValue={(val) => field.onChange(val)}
                value={field.value?.toString()}
              />
            )}
            rules={{ required: true }}
          />
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
          <Controller
            control={control}
            name="district_id"
            render={({ field }) => (
              <DistrictList
                isRequired
                cityId={watch("city_id")}
                errorMessage={
                  errors.district_id?.message || "Kelurahan tidak boleh kosong"
                }
                isInvalid={!!errors.district_id}
                setValue={(val) => field.onChange(val)}
                value={field.value}
              />
            )}
            rules={{ required: true }}
          />
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <CustomTextarea
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
        </CardBody>
      </Card>
      <Button
        color="primary"
        isLoading={processing}
        type="submit"
        variant="shadow"
      >
        Simpan Perubahan
      </Button>
    </form>
  );
}
