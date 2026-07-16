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
import { useEffect, useState } from "react";

import CustomSelect from "@/components/forms/custom-select";
import AllDistrictList from "@/components/regions/all-district";
import { http } from "@/config/axios";
import { IUser } from "@/interface/IUser";
import debounce from "@/utils/helpers/debounce";
import { formatNia } from "@/utils/helpers/format";
import { notify, notifyError } from "@/utils/helpers/notify";

const PENGURUS_OPTIONS = [
  "DPN (Dewan Pengurus Nasional)",
  "DPD (Dewan Pengurus Daerah Provinsi)",
  "DC (Dewan Pengurus Cabang Kota/kab)",
  "DPR (Dewan Pengurus Rantingg)",
];

const JABATAN_OPTIONS = [
  "Ketua",
  "Wakil",
  "Sekertaris",
  "Bendahara",
  "Anggota",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateKepengurusanModal({
  isOpen,
  onClose,
  onSuccess,
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
      setRegion("");
      setAdministratorRole("");
      setJabatan("");
      setTouched(false);
      fetchUsers("");
    }
  }, [isOpen]);

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
            Tambah Kepengurusan
          </p>
          <p className="text-sm font-normal text-gray-500">
            Tetapkan wilayah, pengurus, jabatan, dan anggota
          </p>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4 pb-2">
          <Autocomplete
            defaultItems={users}
            inputValue={userInput}
            isInvalid={touched && !userId}
            isLoading={loadingUsers}
            isRequired
            errorMessage="Anggota wajib dipilih"
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
                <AutocompleteItem
                  key={String(user.id)}
                  textValue={fullName}
                >
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

          <AllDistrictList
            errorMessage="Wilayah wajib dipilih"
            isInvalid={touched && !region}
            isRequired
            setValue={setDistrictId}
            value={districtId}
            onSelectItem={(item) => setRegion(item?.name || "")}
          />

          <CustomSelect
            errorMessage="Pengurus wajib dipilih"
            isInvalid={touched && !administratorRole}
            isRequired
            label="Pengurus"
            placeholder="Pilih tingkat kepengurusan"
            selectedKeys={administratorRole ? [administratorRole] : []}
            onChange={(e) => setAdministratorRole(e.target.value)}
          >
            {PENGURUS_OPTIONS.map((item) => (
              <SelectItem key={item}>{item}</SelectItem>
            ))}
          </CustomSelect>

          <CustomSelect
            errorMessage="Jabatan wajib dipilih"
            isInvalid={touched && !jabatan}
            isRequired
            label="Jabatan"
            placeholder="Pilih jabatan"
            selectedKeys={jabatan ? [jabatan] : []}
            onChange={(e) => setJabatan(e.target.value)}
          >
            {JABATAN_OPTIONS.map((item) => (
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
