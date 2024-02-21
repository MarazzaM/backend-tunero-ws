import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/config/types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { MobileNav } from "./MobileNav"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <div className="md:hidden">
      <MobileNav />
      </div>
      <Link href="/" className="flex items-center space-x-2">
        <GitHubLogoIcon className="h-6 w-6 md:flex hidden" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="md:flex gap-6 hidden">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}