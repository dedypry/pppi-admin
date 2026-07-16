import { TreeNode } from "react-organizational-chart";

import KepengurusanCard from "./card";

import { IKepengurusanNode } from "@/interface/IKepengurusan";

interface Props {
  node: IKepengurusanNode;
  canEdit?: boolean;
  onEditUser?: (node: IKepengurusanNode) => void;
  onDeleteUser?: (node: IKepengurusanNode) => void;
  onAddPengurus?: (node: IKepengurusanNode) => void;
  onAddUser?: (node: IKepengurusanNode) => void;
}

export default function KepengurusanItem({
  node,
  canEdit,
  onEditUser,
  onDeleteUser,
  onAddPengurus,
  onAddUser,
}: Props) {
  return (
    <TreeNode
      label={
        <KepengurusanCard
          canEdit={canEdit}
          node={node}
          onAddPengurus={onAddPengurus}
          onAddUser={onAddUser}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
        />
      }
    >
      {node.children?.map((child) => (
        <KepengurusanItem
          key={child.id}
          canEdit={canEdit}
          node={child}
          onAddPengurus={onAddPengurus}
          onAddUser={onAddUser}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
        />
      ))}
    </TreeNode>
  );
}
