"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { Nav } from "@/components/ui/modular/nav"
  import { cn } from "@/lib/utils"
  import {
    TooltipProvider
  } from "@/components/ui/tooltip"
  import { Separator } from "@/components/ui/separator"
  import {LayoutProps} from '@/config/types'


// This is the layout used in DashboardIcon, i called it mainLayout since it has the sidebar and the main content
// I didnt use the Layout file in pages for several reasons. I want to keep the code in layouts simple, this code reusable, highly customizable and it should be easy to remove
  export function MainLayout({ children }: LayoutProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <TooltipProvider delayDuration={0}>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-full w-full h-full flex-1" 
      >
       <ResizablePanel
          defaultSize={15}
          collapsedSize={4}
          collapsible={true}
          minSize={15}
          maxSize={15}
          onCollapse={(collapsed: boolean) => {
            setIsCollapsed(true);
            // console.log(isCollapsed);
          }}
          onResize={(collapsed: number) => {
            setIsCollapsed(false);
            // console.log(isCollapsed);
          }}
          className={cn(
            "md:block hidden",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out hidden md:block"
            )}
        >
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? 'h-[52px]': 'px-2')}>
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
          {/* <Separator /> */}
          <Nav
            isCollapsed={isCollapsed}
            links={siteConfig.sidebarNav}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={siteConfig.sidebarNavSeparated}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85}>
          <div className="flex h-full items-center justify-center p-6 ">
            <span className="font-semibold w-full h-full">{children}</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </TooltipProvider>

    )
  }
  