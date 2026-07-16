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
  ShoppingBasket,
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
    title: "Kepengurusan",
    icon: ShieldEllipsis,
    href: "/kepengurusan",
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
    roles: ["admin", "super-admin", "biro"],
    children: [
      {
        title: "List Form",
        icon: FormInputIcon,
        href: "/form",
      },
      {
        title: "Buat Form",
        icon: FormInputIcon,
        href: "/form/create",
      },
    ],
  },
  {
    header: "Partner",
    roles: ["admin", "super-admin"],
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
      {
        title: "Minat Paket",
        icon: PackageCheckIcon,
        href: "/partners/package-interests",
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
    header: "E-Commerce",
    roles: ["admin", "super-admin"],
    children: [
      {
        title: "Master Product",
        icon: ShoppingBasket,
        href: "/ecommerce/masters",
      },
      {
        title: "Manage Product",
        icon: ShoppingBasket,
        href: "/ecommerce/products",
      },
      {
        title: "Transaksi",
        icon: ShoppingBasket,
        href: "/ecommerce/transactions",
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
        roles: ["admin", "super-admin"],
      },
      {
        title: "Apps",
        icon: Grid2X2CheckIcon,
        href: "/settings/apps",
        roles: ["admin", "super-admin"],
      },
      {
        title: "Banner",
        icon: GalleryThumbnailsIcon,
        href: "/settings/banners",
        roles: ["admin", "super-admin"],
      },
      {
        title: "Regions",
        icon: MapPinHouse,
        href: "/settings/regions/provinces",
      },
    ],
  },
];
