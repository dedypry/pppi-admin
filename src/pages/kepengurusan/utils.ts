import { IKepengurusanNode } from "@/interface/IKepengurusan";

export type KepengurusanFilters = {
  q: string;
  verification_status: string;
  pengurus: string;
  wilayah: string;
  city: string;
  jabatan: string;
};

export const defaultKepengurusanFilters: KepengurusanFilters = {
  q: "",
  verification_status: "all",
  pengurus: "all",
  wilayah: "all",
  city: "all",
  jabatan: "all",
};

export function collectUserNodes(
  nodes: IKepengurusanNode[],
): IKepengurusanNode[] {
  const result: IKepengurusanNode[] = [];

  for (const node of nodes) {
    if (node.type === "user" && node.user) {
      result.push(node);
    }
    if (node.children?.length) {
      result.push(...collectUserNodes(node.children));
    }
  }

  return result;
}

export function pengurusCode(role?: string | null) {
  if (!role) return "";
  return role.split(" ")[0]?.replace(/[()]/g, "").toUpperCase() || "";
}

export function normalizePengurusCode(code: string) {
  if (code === "DC") return "DPC";
  return code;
}

export function parseCity(region?: string | null) {
  if (!region) return "Tidak diketahui";
  const parts = region
    .split(" - ")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts[1];
  return parts[0] || "Tidak diketahui";
}

export function parseWilayah(region?: string | null, fallback?: string) {
  if (fallback) return fallback;
  if (!region) return "Tidak diketahui";
  return region.split(" - ")[0]?.trim() || "Tidak diketahui";
}

function matchVerification(
  status: string | null | undefined,
  filter: string,
) {
  if (filter === "all") return true;
  if (filter === "not_sent") return !status;
  if (filter === "verified") return status === "approved";
  if (filter === "unverified") return status !== "approved";
  return status === filter;
}

function matchPengurus(node: IKepengurusanNode, filter: string) {
  if (filter === "all") return true;
  const code = normalizePengurusCode(
    pengurusCode(node.pengurus || node.user?.administrator_role),
  );
  return code === filter;
}

function matchUserNode(node: IKepengurusanNode, filters: KepengurusanFilters) {
  const user = node.user;
  if (!user) return false;

  const region = node.region || user.region || "";
  const wilayah = parseWilayah(region, node.wilayah);
  const city = parseCity(region);
  const jabatan = node.title || "";

  if (filters.wilayah !== "all" && wilayah !== filters.wilayah) return false;
  if (filters.city !== "all" && city !== filters.city) return false;
  if (filters.jabatan !== "all" && jabatan !== filters.jabatan) return false;
  if (!matchPengurus(node, filters.pengurus)) return false;
  if (!matchVerification(user.verification_status, filters.verification_status)) {
    return false;
  }

  const q = filters.q.trim().toLowerCase();
  if (q) {
    const fullName = [user.front_title, user.name, user.back_title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const haystack = [
      fullName,
      user.email,
      user.nia,
      region,
      wilayah,
      city,
      jabatan,
      node.pengurus,
      user.administrator_role,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) return false;
  }

  return true;
}

export function filterKepengurusanTree(
  nodes: IKepengurusanNode[],
  filters: KepengurusanFilters,
): IKepengurusanNode[] {
  const hasActiveFilter =
    filters.q.trim() ||
    filters.verification_status !== "all" ||
    filters.pengurus !== "all" ||
    filters.wilayah !== "all" ||
    filters.city !== "all" ||
    filters.jabatan !== "all";

  if (!hasActiveFilter) return nodes;

  function walk(node: IKepengurusanNode): IKepengurusanNode | null {
    if (node.type === "user") {
      return matchUserNode(node, filters) ? node : null;
    }

    const children = (node.children || [])
      .map((child) => walk(child))
      .filter(Boolean) as IKepengurusanNode[];

    if (children.length === 0) return null;

    return { ...node, children };
  }

  return nodes
    .map((node) => walk(node))
    .filter(Boolean) as IKepengurusanNode[];
}

export function buildFilterOptions(nodes: IKepengurusanNode[]) {
  const users = collectUserNodes(nodes);
  const wilayahSet = new Set<string>();
  const citySet = new Set<string>();
  const jabatanSet = new Set<string>();
  const pengurusSet = new Set<string>();

  for (const node of users) {
    const region = node.region || node.user?.region || "";
    wilayahSet.add(parseWilayah(region, node.wilayah));
    citySet.add(parseCity(region));
    if (node.title) jabatanSet.add(node.title);

    const code = normalizePengurusCode(
      pengurusCode(node.pengurus || node.user?.administrator_role),
    );
    if (code) pengurusSet.add(code);
  }

  return {
    wilayah: [...wilayahSet].sort((a, b) => a.localeCompare(b)),
    cities: [...citySet].sort((a, b) => a.localeCompare(b)),
    jabatan: [...jabatanSet].sort((a, b) => a.localeCompare(b)),
    pengurus: ["DPN", "DPD", "DPC", "DPR"].filter((c) => pengurusSet.has(c)),
  };
}
