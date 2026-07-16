import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { http } from "@/config/axios";
import { IUser } from "@/interface/IUser";
import { formatNia } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { notifyError } from "@/utils/helpers/notify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: IUser) => void;
}

export default function SelectUserModal({ isOpen, onClose, onSelect }: Props) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  function fetchUsers(search = "") {
    setLoading(true);
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
      .finally(() => setLoading(false));
  }

  const debounceSearch = debounce((val: string) => {
    fetchUsers(val);
  }, 400);

  useEffect(() => {
    if (isOpen) {
      setQ("");
      fetchUsers("");
    }
  }, [isOpen]);

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
          <p className="text-lg font-semibold text-gray-800">Pilih Anggota</p>
          <p className="text-sm font-normal text-gray-500">
            Cari lalu klik anggota untuk menetapkan ke kartu
          </p>
        </ModalHeader>
        <ModalBody className="pb-6">
          <Input
            endContent={<SearchIcon className="text-gray-400" size={16} />}
            placeholder="Cari nama, email, atau NIA..."
            value={q}
            variant="bordered"
            onChange={(e) => {
              setQ(e.target.value);
              debounceSearch(e.target.value);
            }}
          />

          <div className="mt-2 max-h-[420px] space-y-2 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <Spinner color="primary" />
              </div>
            )}

            {!loading && users.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                Anggota tidak ditemukan
              </p>
            )}

            {!loading &&
              users.map((user) => {
                const fullName = [user.front_title, user.name, user.back_title]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Button
                    key={user.id}
                    className="h-auto w-full justify-start gap-3 px-3 py-2"
                    variant="flat"
                    onPress={() => onSelect(user)}
                  >
                    <Avatar
                      isBordered
                      size="md"
                      src={user.profile?.photo}
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {fullName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                      {user.nia && (
                        <p className="text-xs text-cyan-700">
                          {formatNia(user.nia)}
                        </p>
                      )}
                    </div>
                  </Button>
                );
              })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
