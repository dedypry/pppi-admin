import { useState, useEffect, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
} from "@heroui/react";
import { Bell, Settings, LogOut, MenuIcon, UserIcon } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import SidebarMenu from "./partials/sidebar-menu";

import { responsive } from "@/config/responsive";
import AuthGuard from "@/guards/AuthGuard";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { setToken } from "@/stores/features/auth/authSlice";

interface Props {
  children?: ReactNode;
}
export default function AdminLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery(responsive.mobile);
  const dispatch = useAppDispatch();
  const route = useNavigate();

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  function handleLogout() {
    http
      .delete("/auth/logout")
      .then(() => {
        dispatch(setToken(null));
        route("/login");
      })
      .catch((err) => notifyError(err));
  }

  return (
    <AuthGuard>
      {isMobile ? (
        <Drawer
          className="bg-primary pl-4"
          isOpen={isOpen}
          placement="left"
          size="xs"
          onClose={() => setIsOpen(false)}
        >
          <DrawerContent>{() => <SidebarMenu />}</DrawerContent>
        </Drawer>
      ) : (
        <aside
          className={`translation-all fixed h-screen w-[266px] transform bg-gradient-to-tr from-primary-900 to-primary-600 pl-3 shadow-lg shadow-primary-200 duration-300 ease-in-out ${
            !isOpen ? "-translate-x-full" : "translate-x-0"
          } ${isMobile && "-translate-x-full"} `}
        >
          <SidebarMenu />
        </aside>
      )}
      <div
        className={`${!isOpen ? "pl-0" : "lg:pl-[266px]"} translation-all duration-300 ease-in-out`}
      >
        <main className="px-5 pt-1">
          <Navbar
            isBordered
            className="sticky top-1 h-[50px] rounded-md border shadow-md"
            isBlurred={false}
            maxWidth="full"
          >
            <NavbarContent>
              <Button
                isIconOnly
                className="text-primary"
                radius="full"
                size="sm"
                variant="light"
                onPress={() => setIsOpen(!isOpen)}
              >
                <MenuIcon />
              </Button>
              <p className="font-bold text-primary">PPPI</p>
            </NavbarContent>
            <NavbarContent justify="end">
              <Button
                isIconOnly
                className="text-sm font-bold text-black"
                radius="full"
                size="sm"
                variant="light"
              >
                <Bell />
              </Button>
              <Dropdown showArrow offset={15} placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    size="sm"
                    src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                  />
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key={1}
                    startContent={<UserIcon />}
                    onClick={() => route("/profile")}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key={2}
                    startContent={<Settings />}
                    onClick={() => {}}
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key={3}
                    startContent={<LogOut />}
                    onClick={() =>
                      confirmSweet(handleLogout, {
                        confirmButtonText: "Ya, Keluar",
                      })
                    }
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
          <div className="py-5">
            <Outlet />
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
