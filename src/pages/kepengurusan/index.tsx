import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { FileDownIcon, FileSpreadsheetIcon } from "lucide-react";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useState } from "react";
import { Tree } from "react-organizational-chart";

import KepengurusanItem from "./item";
import SelectUserModal from "@/pages/organization/select-user-modal";

import { IKepengurusanNode } from "@/interface/IKepengurusan";
import { IUser } from "@/interface/IUser";
import { http } from "@/config/axios";
import { handleDownloadExcel } from "@/utils/helpers/global";
import { notify, notifyError } from "@/utils/helpers/notify";
import { hasRoles } from "@/utils/helpers/match-roles";
import { confirmSweet } from "@/utils/helpers/confirm";

export default function KepengurusanPage() {
  const [data, setData] = useState<IKepengurusanNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<IKepengurusanNode | null>(
    null,
  );

  const canEdit = hasRoles(["admin", "super-admin"]);

  const loadData = useCallback(() => {
    setLoading(true);
    http
      .get("/members/kepengurusan")
      .then(({ data: res }) => {
        setData(Array.isArray(res) ? res : []);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleExportExcel() {
    handleDownloadExcel(
      "/members/kepengurusan/export",
      undefined,
      `kepengurusan-${new Date().toISOString().slice(0, 10)}`,
      setExportingExcel,
    );
  }

  async function handleExportPdf() {
    setExportingPdf(true);
    try {
      const response = await http.get("/members/kepengurusan/export-pdf", {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `kepengurusan-${new Date().toISOString().slice(0, 10)}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);

        if (match?.[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      saveAs(response.data, filename);
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
      notify("Gagal mengunduh PDF", "error");
    } finally {
      setExportingPdf(false);
    }
  }

  function handleEditUser(node: IKepengurusanNode) {
    setEditingNode(node);
    setModalOpen(true);
  }

  function handleSelectUser(user: IUser) {
    if (!editingNode?.user?.id) return;

    const fromName = [
      editingNode.user.front_title,
      editingNode.user.name,
      editingNode.user.back_title,
    ]
      .filter(Boolean)
      .join(" ");
    const toName = [user.front_title, user.name, user.back_title]
      .filter(Boolean)
      .join(" ");

    confirmSweet(
      () => {
        http
          .patch("/members/kepengurusan/replace", {
            from_user_id: editingNode.user!.id,
            to_user_id: user.id,
            region: editingNode.region || editingNode.user!.region || "",
            administrator_role:
              editingNode.pengurus ||
              editingNode.user!.administrator_role ||
              "",
            jabatan: editingNode.title,
          })
          .then(({ data: res }) => {
            notify(res.message || "Kepengurusan berhasil diganti");
            setModalOpen(false);
            setEditingNode(null);
            loadData();
          })
          .catch((err) => notifyError(err));
      },
      {
        text: `Ganti ${fromName} dengan ${toName} pada slot kepengurusan ini?`,
        confirmButtonText: "Ya, ganti",
        confirmButtonColor: "#15980d",
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SelectUserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNode(null);
        }}
        onSelect={handleSelectUser}
      />

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-1">
            <p className="text-lg font-semibold text-gray-800">Kepengurusan</p>
            <p className="text-sm font-normal text-gray-500">
              Struktur per wilayah → pengurus → anggota (dari data users)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              color="success"
              isLoading={exportingExcel}
              size="sm"
              startContent={<FileSpreadsheetIcon size={16} />}
              variant="flat"
              onPress={handleExportExcel}
            >
              Export Excel
            </Button>
            <Button
              color="danger"
              isLoading={exportingPdf}
              size="sm"
              startContent={<FileDownIcon size={16} />}
              variant="flat"
              onPress={handleExportPdf}
            >
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto pb-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner color="primary" />
            </div>
          ) : data.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Belum ada data kepengurusan. Pastikan user sudah punya wilayah &
              pengurus.
            </p>
          ) : (
            <Tree
              label={
                <div className="inline-block rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 px-5 py-3 text-center text-white shadow-md">
                  <p className="m-0 text-xs uppercase tracking-widest text-white/80">
                    Struktur
                  </p>
                  <p className="m-0 text-lg font-semibold">PPPI</p>
                </div>
              }
              lineBorderRadius="10px"
              lineColor="#15980d"
              lineWidth="1px"
            >
              {data.map((node) => (
                <KepengurusanItem
                  key={node.id}
                  canEdit={canEdit}
                  node={node}
                  onEditUser={handleEditUser}
                />
              ))}
            </Tree>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
