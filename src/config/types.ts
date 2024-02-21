export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
}

export interface LayoutProps {
  children: React.ReactNode;
}
