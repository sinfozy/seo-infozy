import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HistoryIcon,
  HomeIcon,
  ShieldUserIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AdminSidebarLinks() {
  const pathname = usePathname();

  const links = [
    { href: "", label: "Home", icon: HomeIcon },
    { href: "/resellers", label: "Resellers", icon: ShieldUserIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/payments", label: "Payment", icon: HistoryIcon },
    { href: "/wallet", label: "Wallet", icon: WalletIcon },
  ];

  return (
    <SidebarMenu>
      {links.map(
        ({
          href,
          label,
          icon: Icon,
          isAccordion,
        }: {
          href: string;
          label: string;
          icon: React.ElementType;
          isAccordion?: boolean;
        }) =>
          isAccordion ? (
            <SidebarMenuItem key={href}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="social-media">
                  <AccordionTrigger
                    className={cn(
                      "w-full text-left text-sm font-medium flex-none p-2",
                      pathname === `/dashboard${href}`
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 hover:no-underline">
                      <Icon size={20} />
                      {label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 flex flex-col gap-2"></AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild>
                <Link
                  href={`/admin/dashboard${href}`}
                  className={cn(
                    "w-full text-left text-lg font-medium mt-2",
                    pathname === `/dashboard${href}`
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={30} /> {label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
      )}
    </SidebarMenu>
  );
}
