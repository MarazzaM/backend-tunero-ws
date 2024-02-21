import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Menu /></Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>
          {siteConfig.description}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <ul className="space-y-2">
            {siteConfig.mainNav.map((link) => (
              <li key={link.title} className="hover:text-blue-500">
                          <SheetClose asChild>
                <Link href={link.href} className="text-primary">{link.title}</Link>
                </SheetClose>

              </li>
            ))}
          </ul>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button >Close</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}
