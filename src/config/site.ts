import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Zero Template",
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  mainNav: [
    {
      title: "Inicio",
      href: "/",
    },
    {
        title: "Dashboard",
        href: "/dashboard",
    },
  ],
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/MarazzaM/",
    docs: "https://github.com/MarazzaM/",
    repo:"https://github.com/MarazzaM/my-template",
  },
  sidebarNav:[
    {
      title: "Main",
      label: "128",
      icon: Inbox,
      variant: "ghost",
      link:"/dashboard/"
    },
    {
      title: "Llamador",
      label: "9",
      icon: File,
      variant: "ghost",
      link:"/dashboard/llamador"
    },
    {
      title: "Totem",
      label: "",
      icon: Send,
      variant: "ghost",
      link:"/totem"
    },
    {
      title: "Junk",
      label: "23",
      icon: ArchiveX,
      variant: "ghost",
      link:"#"
    },
    {
      title: "Trash",
      label: "",
      icon: Trash2,
      variant: "ghost",
      link:"#"
    },
    {
      title: "Archive",
      label: "",
      icon: Archive,
      variant: "ghost",
      link:"#"
    },
  ],
  sidebarNavSeparated:[
    {
      title: "Social",
      label: "972",
      icon: Users2,
      variant: "ghost",
      link:"#"
    },
    {
      title: "Tipos Atención",
      label: "342",
      icon: AlertCircle,
      variant: "ghost",
      link:"/dashboard/administracion/tipo-atencion"
    },
    {
      title: "Forums",
      label: "128",
      icon: MessagesSquare,
      variant: "ghost",
      link:"#"
    },
    {
      title: "Shopping",
      label: "8",
      icon: ShoppingCart,
      variant: "ghost",
      link:"#"
    },
    {
      title: "Promotions",
      label: "21",
      icon: Archive,
      variant: "ghost",
      link:"#"
    },
  ],
  userdropdown: {
    Perfil: "/profile",
    Equipo: "/team",
    Configuración: "/config",
  },
}