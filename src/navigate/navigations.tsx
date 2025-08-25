import {
  CalendarRangeIcon,
  ClipboardPlusIcon,
  FormInputIcon,
  GalleryThumbnailsIcon,
  Grid2X2CheckIcon,
  LayoutDashboard,
  LayoutListIcon,
  MapPinHouse,
  OrigamiIcon,
  PackageCheckIcon,
  RssIcon,
  ShieldCheckIcon,
  ShieldEllipsis,
  User,
  UserPlus2,
  Users2Icon,
  WarehouseIcon,
} from "lucide-react";

export const navigate = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Struktur Organisasi",
    icon: OrigamiIcon,
    href: "/organization",
  },
  {
    title: "Agenda",
    icon: CalendarRangeIcon,
    href: "/agenda",
  },

  {
    header: "Anggota",
    children: [
      {
        title: "List Anggota",
        icon: User,
        href: "/member",
      },
      {
        title: "Tambah Anggota",
        icon: UserPlus2,
        href: "/member/create",
      },
    ],
  },
  {
    header: "Form",
    children: [
      {
        title: "Buat Form",
        icon: FormInputIcon,
        href: "/form/create",
      },
    ],
  },
  {
    header: "Partner",
    children: [
      {
        title: "List Partner",
        icon: Users2Icon,
        href: "/partners",
      },
      {
        title: "List Paket",
        icon: PackageCheckIcon,
        href: "/partners/packages",
      },
    ],
  },
  {
    header: "Blogs",
    children: [
      {
        title: "Blog",
        icon: RssIcon,
        href: "/blogs",
      },
      {
        title: "Buat Blog",
        icon: ClipboardPlusIcon,
        href: "/blogs/create",
      },
      {
        title: "Kategori",
        icon: LayoutListIcon,
        href: "/blogs/category",
      },
    ],
  },

  {
    header: "Settings",
    children: [
      {
        title: "Department",
        icon: WarehouseIcon,
        href: "/settings/department",
      },
      {
        title: "Management User",
        icon: ShieldCheckIcon,
        href: "/settings/user-management",
      },
      {
        title: "Role",
        icon: ShieldEllipsis,
        href: "/settings/roles",
      },
      {
        title: "Apps",
        icon: Grid2X2CheckIcon,
        href: "/settings/apps",
      },
      {
        title: "Banner",
        icon: GalleryThumbnailsIcon,
        href: "/settings/banners",
      },
      {
        title: "Regions",
        icon: MapPinHouse,
        href: "/settings/regions/provinces",
      },
    ],
  },
];
