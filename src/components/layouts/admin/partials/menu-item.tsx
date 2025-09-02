import { Link } from "react-router-dom";

import { hasRoles } from "@/utils/helpers/match-roles";

export default function MenuItem({ item, selected }: any) {
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
              </Link>
            );
          },
        )}
      </ul>
    </>
  );
}
