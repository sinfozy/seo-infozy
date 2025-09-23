import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

import Link from "next/link";
import { TextSearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function DashboardSidebarLinks() {
  const pathname = usePathname();

  const links = [
    {
      label: "SEO",
      slug: "seo",
      icon: TextSearchIcon,
      children: [{ href: "website-search", label: "Website Search" }],
    },
    {
      label: "Infyra AI Search",
      slug: "infyra-ai-search",
      icon: TextSearchIcon,
      children: [{ href: "infyra-search", label: "Infyra Search" }],
    },
  ];

  return (
    <SidebarMenu>
      {links.map(({ slug, label, icon: Icon, children }) =>
        children ? (
          <SidebarMenuItem key={label}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={label.toLowerCase()}>
                <AccordionTrigger
                  className={cn(
                    "w-full text-left text-sm font-medium flex-none p-2",
                    pathname.includes(`/dashboard/${slug}`)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 hover:no-underline">
                    <Icon size={20} />
                    {label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-8 flex flex-col gap-2">
                  {children.map(({ href, label }) => {
                    // const SubIcon = icon;
                    const fullPath = `/dashboard/${href}`;

                    return (
                      <Link
                        key={fullPath}
                        href={fullPath}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          pathname === fullPath
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {/* {SubIcon && <SubIcon size={18} />} */}
                        {label}
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarMenuItem>
        ) : null
      )}
    </SidebarMenu>
  );
}
