import { Avatar, Divider } from "@heroui/react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { apps } from "@/config/app";

export default function Footer() {
  return (
    <footer className="z-50 min-h-[300px] w-full bg-primary">
      <div className="container mx-auto px-10 py-10">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Avatar size="lg" src={apps.logo} />
                <p className="text-[30px] font-semibold text-white">
                  {apps.short_name}
                </p>
              </div>
              <p className="text-md text-white">{apps.full_name}</p>
            </div>
          </div>
          <div className="col-span-12 text-white md:col-span-8">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
              <div>
                <p className="text-lg font-semibold">Profil</p>
                <Divider className="mb-3 max-w-[200px] bg-white/60" />
                <div className="flex flex-col gap-2">
                  <Link to="#">Sejarah PPPI</Link>
                  <Link to="#">Visi dan Misi</Link>
                  <Link to="#">Struktur Organisasi</Link>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">Hubungi Kami</p>
                <Divider className="mb-3 max-w-[200px] bg-white/60" />
                <div className="flex flex-col gap-2">
                  <Link to="#">Sejarah PPPI</Link>
                  <Link to="#">Visi dan Misi</Link>
                  <Link to="#">Struktur Organisasi</Link>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">
                  Kunjungi Sosial Media Kami
                </p>
                <Divider className="mb-3 bg-white/60" />
                <div className="flex flex-col gap-2">
                  <Link to="#">Sejarah PPPI</Link>
                  <Link to="#">Visi dan Misi</Link>
                  <Link to="#">Struktur Organisasi</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider className="my-5 bg-white/60" />
        <div className="text-white">
          <p>
            &copy; Copyright by{" "}
            <a
              className="hover:font-bold"
              href="https://dedypry.id/"
              target="__blank"
            >
              dedypry.id
            </a>{" "}
            - {dayjs().format("YYYY")} All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
