import {
  Avatar,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import {
  AlignStartVerticalIcon,
  Atom,
  Backpack,
  ContactIcon,
  GalleryThumbnails,
  History,
  LayoutDashboard,
  MenuIcon,
  Rss,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { apps } from "@/config/app";
import { useAppSelector } from "@/stores/hooks";

export default function LandingDrawer() {
  const [isOpen, setOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const url = window.location.pathname;
  const route = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navigations = [
    {
      title: "Beranda",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Tentang Kami",
      children: [
        {
          title: "Sejarah PPPI",
          href: "/history",
          icon: History,
        },
        {
          title: "Visi dan Misi",
          href: "/visi-misi",
          icon: AlignStartVerticalIcon,
        },
        {
          title: "Struktur Organisasi",
          href: "/organization",
          icon: Atom,
        },
        {
          title: "LPK PPPI",
          href: "",
          icon: Backpack,
        },
      ],
    },
    {
      title: "Informasi",
      children: [
        {
          title: "Blog",
          href: "/blogs",
          icon: Rss,
        },
        {
          title: "Galeri",
          href: "/gallery",
          icon: GalleryThumbnails,
        },
      ],
    },
    {
      title: "Kontak",
      href: "/contact",
      icon: ContactIcon,
    },
  ];

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <DrawerContent>
          <DrawerHeader className="flex items-center gap-5">
            <Avatar isBordered src={apps.logo} />
            <div>
              <p>{apps.short_name}</p>
              <p className="text-xs text-gray-500">{apps.full_name}</p>
            </div>
          </DrawerHeader>
          <Divider />
          <DrawerBody>
            <div className="flex flex-col">
              {navigations.map((item) => {
                const ParentIcon = item.icon;

                if (item.children) {
                  return (
                    <div key={item.title} className="mt-2">
                      <p className="mb-1 pl-3 text-sm text-gray-400">
                        {item.title}
                      </p>
                      <div className="flex flex-col pl-1">
                        {item.children.map(({ icon: Icon, title, href }) => (
                          <Link
                            key={title}
                            className={`link-member ${url === href ? "bg-primary-500 text-white shadow-md" : ""}`}
                            to={href}
                          >
                            <Icon size={18} /> {title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    className={`link-member ${url === item.href ? "bg-primary-500 text-white shadow-md" : ""}`}
                    to={item.href}
                  >
                    {ParentIcon && <ParentIcon size={18} />} {item.title}
                  </Link>
                );
              })}
            </div>
          </DrawerBody>
          {!user && (
            <DrawerFooter>
              <Button fullWidth color="primary" onPress={() => route("/login")}>
                Login
              </Button>
              <Button
                fullWidth
                color="danger"
                onPress={() => route("/register")}
              >
                Daftar Anggota
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <Button
        isIconOnly
        radius="full"
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
      >
        <MenuIcon className="text-white" />
      </Button>
    </>
  );
}
