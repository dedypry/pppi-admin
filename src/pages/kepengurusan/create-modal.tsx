import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import { JABATAN_OPTIONS, PENGURUS_OPTIONS } from "./constants";

import CustomSelect from "@/components/forms/custom-select";
import AllDistrictList from "@/components/regions/all-district";
import { http } from "@/config/axios";
import { IUser } from "@/interface/IUser";
import debounce from "@/utils/helpers/debounce";
import { formatNia } from "@/utils/helpers/format";
import { notify, notifyError } from "@/utils/helpers/notify";

export type CreateKepengurusanPreset = {
  mode?: "create" | "add-pengurus" | "add-user";
  region?: string;
  administrator_role?: string;
  availablePengurus?: string[];
  availableJabatan?: string[];
  lockRegion?: boolean;
  lockPengurus?: boolean;
  title?: string;
  subtitle?: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preset?: CreateKepengurusanPreset | null;
}

export default function CreateKepengurusanModal({
  isOpen,
  onClose,
  onSuccess,
  preset,
}: Props) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [userInput, setUserInput] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [districtId, setDistrictId] = useState<number | undefined>();
  const [region, setRegion] = useState("");
  const [administratorRole, setAdministratorRole] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const pengurusOptions = useMemo(() => {
    if (preset?.availablePengurus?.length) return preset.availablePengurus;
    if (preset?.administrator_role) return [preset.administrator_role];
    return PENGURUS_OPTIONS;
  }, [preset]);

  const jabatanOptions = useMemo(() => {
    if (preset?.availableJabatan) return preset.availableJabatan;
    return JABATAN_OPTIONS;
  }, [preset]);

  const lockRegion = !!preset?.lockRegion && !!preset?.region;
  const lockPengurus = !!preset?.lockPengurus && !!preset?.administrator_role;

  function fetchUsers(search = "") {
    setLoadingUsers(true);
    http
      .get("/members", {
        params: {
          page: 1,
          pageSize: 20,
          status: "approved",
          q: search,
        },
      })
      .then(({ data }) => {
        setUsers(data?.data || []);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoadingUsers(false));
  }

  const debounceSearch = debounce((val: string) => {
    fetchUsers(val);
  }, 400);

  useEffect(() => {
    if (isOpen) {
      setUsers([]);
      setUserInput("");
      setUserId("");
      setDistrictId(undefined);
      setRegion(preset?.region || "");
      setAdministratorRole(
        preset?.administrator_role ||
          (preset?.availablePengurus?.length === 1
            ? preset.availablePengurus[0]
            : ""),
      );
      setJabatan(
        preset?.availableJabatan?.length === 1
          ? preset.availableJabatan[0]
          : "",
      );
      setTouched(false);
      fetchUsers("");
    }
  }, [isOpen, preset]);

  function handleSubmit() {
    setTouched(true);
    if (!userId || !region || !administratorRole || !jabatan) return;

    setSubmitting(true);
    http
      .post("/members/kepengurusan", {
        user_id: Number(userId),
        region,
        administrator_role: administratorRole,
        jabatan,
      })
      .then(({ data }) => {
        notify(data?.message || data || "Kepengurusan berhasil ditambahkan");
        onSuccess();
        onClose();
      })
      .catch((err) => notifyError(err))
      .finally(() => setSubmitting(false));
  }

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="lg"
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-gray-800">
            {preset?.title || "Tambah Kepengurusan"}
          </p>
          <p className="text-sm font-normal text-gray-500">
            {preset?.subtitle ||
              "Tetapkan wilayah, pengurus, jabatan, dan anggota"}
          </p>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4 pb-2">
          <Autocomplete
            defaultItems={users}
            errorMessage="Anggota wajib dipilih"
            inputValue={userInput}
            isInvalid={touched && !userId}
            isLoading={loadingUsers}
            isRequired
            label="Anggota"
            labelPlacement="outside"
            placeholder="Cari nama, email, atau NIA..."
            selectedKey={userId || null}
            variant="bordered"
            onInputChange={(val) => {
              setUserInput(val);
              debounceSearch(val);
            }}
            onSelectionChange={(key) => {
              const id = key ? String(key) : "";
              setUserId(id);
              const selected = users.find((u) => String(u.id) === id);
              if (selected) {
                const fullName = [
                  selected.front_title,
                  selected.name,
                  selected.back_title,
                ]
                  .filter(Boolean)
                  .join(" ");
                setUserInput(fullName);
              }
            }}
          >
            {(user) => {
              const fullName = [user.front_title, user.name, user.back_title]
                .filter(Boolean)
                .join(" ");

              return (
                <AutocompleteItem key={String(user.id)} textValue={fullName}>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src={user.profile?.photo} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{fullName}</p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                        {user.nia ? ` · ${formatNia(user.nia)}` : ""}
                      </p>
                    </div>
                  </div>
                </AutocompleteItem>
              );
            }}
          </Autocomplete>

          {lockRegion ? (
            <div className="rounded-lg border border-default-200 bg-default-50 px-3 py-2">
              <p className="m-0 text-xs text-gray-500">Wilayah / Regional</p>
              <p className="m-0 text-sm font-medium text-gray-800">{region}</p>
            </div>
          ) : (
            <AllDistrictList
              errorMessage="Wilayah wajib dipilih"
              isInvalid={touched && !region}
              isRequired
              setValue={setDistrictId}
              value={districtId}
              onSelectItem={(item) => setRegion(item?.name || "")}
            />
          )}

          {lockPengurus ? (
            <div className="rounded-lg border border-default-200 bg-default-50 px-3 py-2">
              <p className="m-0 text-xs text-gray-500">Pengurus</p>
              <p className="m-0 text-sm font-medium text-gray-800">
                {administratorRole}
              </p>
            </div>
          ) : (
            <CustomSelect
              errorMessage="Pengurus wajib dipilih"
              isInvalid={touched && !administratorRole}
              isRequired
              label="Pengurus"
              placeholder="Pilih tingkat kepengurusan"
              selectedKeys={administratorRole ? [administratorRole] : []}
              onChange={(e) => setAdministratorRole(e.target.value)}
            >
              {pengurusOptions.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </CustomSelect>
          )}

          <CustomSelect
            errorMessage={
              jabatanOptions.length === 0
                ? "Semua jabatan sudah terisi"
                : "Jabatan wajib dipilih"
            }
            isDisabled={jabatanOptions.length === 0}
            isInvalid={touched && !jabatan}
            isRequired
            label="Jabatan"
            placeholder={
              jabatanOptions.length === 0
                ? "Semua jabatan sudah terisi"
                : "Pilih jabatan"
            }
            selectedKeys={jabatan ? [jabatan] : []}
            onChange={(e) => setJabatan(e.target.value)}
          >
            {jabatanOptions.map((item) => (
              <SelectItem key={item}>{item}</SelectItem>
            ))}
          </CustomSelect>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Batal
          </Button>
          <Button color="primary" isLoading={submitting} onPress={handleSubmit}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
