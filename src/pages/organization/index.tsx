import { Card, CardBody } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { Tree } from "react-organizational-chart";

import CardItemOrg from "./card-item";
import Item from "./item";
import SelectUserModal from "./select-user-modal";

import { IOrganizations } from "@/interface/IOrganization";
import { IUser } from "@/interface/IUser";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

export default function OrganizationPage() {
  const [data, setData] = useState<IOrganizations[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<IOrganizations | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = useCallback(() => {
    http
      .get("/organizations")
      .then(({ data: res }) => {
        setData(res || []);
      })
      .catch((err) => notifyError(err));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handlePickUser(org: IOrganizations) {
    setSelectedOrg(org);
    setModalOpen(true);
  }

  function handleSelectUser(user: IUser) {
    if (!selectedOrg?.id) return;

    http
      .patch(`/organizations/${selectedOrg.id}/assign-user`, {
        user_id: user.id,
      })
      .then(({ data: res }) => {
        notify(res.message || "User berhasil ditetapkan");
        setModalOpen(false);
        setSelectedOrg(null);
        loadData();
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <SelectUserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrg(null);
        }}
        onSelect={handleSelectUser}
      />

      <Card>
        <CardBody className="overflow-x-auto">
          <Tree
            label={<CardItemOrg title="PPPI" />}
            lineBorderRadius="10px"
            lineColor="#15980d"
            lineWidth="1px"
          >
            {data.map((e) => (
              <Item key={e.id} item={e} onPickUser={handlePickUser} />
            ))}
          </Tree>
        </CardBody>
      </Card>
    </>
  );
}
