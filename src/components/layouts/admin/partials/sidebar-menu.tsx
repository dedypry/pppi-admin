import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Image } from "@heroui/react";

import MenuItem from "./menu-item";

import { navigate } from "@/navigate/navigations";
import { apps } from "@/config/app";
import { hasRoles } from "@/utils/helpers/match-roles";

export default function SidebarMenu() {
  const [selected, setSelected] = useState<string>(window.location.pathname);
  const { pathname } = useLocation();

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <div className="flex max-h-screen flex-col">
      <Link className="my-5 ml-5 flex items-center gap-2" to="/">
        <Image alt="logo" height={60} src={apps?.logo || "/logo.png"} />
        <h1 className="!text-white">{apps?.short_name?.toUpperCase()}</h1>
      </Link>

      <ul className="flex-1 overflow-y-auto pb-10 pr-1">
        {navigate.map((item, i) => {
          const IconParent: any = item.icon;

          if (item?.roles?.length! > 0) {
            const hasAccess = hasRoles(item.roles || []);

            if (!hasAccess) return null;
          }

          return (
            <div key={i}>
              {item.header ? (
                <MenuItem item={item as any} selected={selected} />
              ) : (
                <Link
                  className={`sidebar-item ${selected === item.href ? "bg-white text-gray-800" : "text-white"}`}
                  to={item.href || ""}
                >
                  <IconParent /> {item.title}
                </Link>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}
