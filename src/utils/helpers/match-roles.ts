import { store } from "@/stores";
export function hasRoles(requiredRoles: string[]) {
  const roleTitles = store.getState().user.user?.roles.map((e) => e.slug) || [];

  // true kalau semua requiredRoles ada di user roles
  return requiredRoles.some((r) => roleTitles.includes(r));
}
