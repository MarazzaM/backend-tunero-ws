import { ReactNode } from 'react';
import TotemNav from '@/components/ui/modular/TotemNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen min-w-screen">
        <TotemNav />
        {children}
    </div>
  );
}
