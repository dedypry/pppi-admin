import { Link } from "react-router-dom";

import { hasRoles } from "@/utils/helpers/match-roles";
import { useAppSelector } from "@/stores/hooks";

export default function MenuItem({ item, selected }: any) {
  const { newOrdersCount } = useAppSelector((state) => state.shopOrders);

  return (
    <>
      <p className="mt-5 pb-1 text-sm text-gray-200">{item.header}</p>
      <ul className="flex flex-col">
        {item.children.map(
          ({ icon: Icon, title, href, roles }: any, j: number) => {
            if (roles?.length! > 0) {
              const hasAccess = hasRoles(roles || []);

              if (!hasAccess) return null;
            }

            return (
              <Link
                key={j}
                className={`sidebar-item pl-2 ${selected === href ? "bg-white text-gray-800" : "text-white"}`}
                to={href}
              >
                <Icon /> {title}
                {href === "/ecommerce/transactions" && newOrdersCount > 0 && (
                  <span className="ml-auto rounded-full bg-danger px-2 py-[1px] text-[11px] font-bold text-white">
                    {newOrdersCount}
                  </span>
                )}
              </Link>
            );
          },
        )}
      </ul>
    </>
  );
}
