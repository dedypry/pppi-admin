import {
  Avatar,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { LayoutDashboard, LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import AboutButton from "./about-button";
import InformationButton from "./information-button";

import { apps } from "@/config/app";

export default function DefaultLayout() {
  const [scrolled, setScrolled] = useState(false);
  const scrollVal = window.location.pathname === "/" ? 500 : 215;
  const auth = {} as any;

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > scrollVal) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-screen">
      <div className="hidden w-full bg-black pt-2 md:block">
        <div className="container mx-auto flex justify-between px-8 text-sm text-white">
          <p>{apps.full_name}</p>

          {auth.user ? (
            <div>
              <Link className="flex items-center gap-2 text-white" to="/">
                <LayoutDashboard size={14} /> <p>Dashboard</p>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-2 hover:cursor-pointer"
                to="/register"
              >
                <LogInIcon size={14} /> <p>Register</p>
              </Link>
              <Divider className="h-1/2 bg-white" orientation="vertical" />
              <Link className="flex items-center gap-2 text-white" to="/login">
                <LogInIcon size={14} /> <p>Login</p>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* <Navbar maxWidth="2xl" className="bg-transparent bg-gradient-to-b from-black to-primary-600" isBlurred={false} isBordered={false}> */}
      <Navbar
        className={`transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent bg-gradient-to-b from-black to-transparent"}`}
        isBlurred={false}
        isBordered={false}
        maxWidth="2xl"
      >
        <NavbarBrand>
          <Link className="flex items-center gap-2" to="/">
            <Avatar size="md" src={apps.logo} />
            <p
              className={`m-0 hidden p-0 text-[30px] font-bold ${scrolled ? "text-gray-800" : "text-white"} md:flex`}
            >
              {apps.short_name}
            </p>
            <div
              className={`flex flex-col ${scrolled ? "text-gray-800" : "text-white"} md:hidden`}
            >
              <p className="m-0 p-0 font-bold">{apps.short_name}</p>
              <p className="m-0 p-0 text-[10px]">{apps.full_name}</p>
            </div>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem>
            <Link
              className={`link-anim ${scrolled ? "text-gray-800" : "text-white"}`}
              to="/"
            >
              Beranda
            </Link>
          </NavbarItem>
          <NavbarItem>
            <AboutButton scrolled={scrolled} />
          </NavbarItem>
          <NavbarItem>
            <InformationButton scrolled={scrolled} />
          </NavbarItem>
          <NavbarItem>
            <Link
              className={`link-anim ${scrolled ? "text-gray-800" : "text-white"}`}
              to="/contact"
            >
              Kontak
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="md:hidden" justify="end">
          {/* <LandingDrawer /> */}
        </NavbarContent>
      </Navbar>

      <div className="z-0 pb-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
