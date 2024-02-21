import { ReactNode } from 'react';
import { SiteHeader } from '@/components/ui/modular/site-header';
import { MainLayout } from '@/components/ui/layouts/MainLayout';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <SiteHeader />
      <MainLayout>
        {children}
      </MainLayout>
    </div>
  );
}
