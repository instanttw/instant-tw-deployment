"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  Settings,
  Package,
  Users,
  Activity,
  DollarSign,
  Menu,
  X,
  Shield,
  FileText,
  Search as SearchIcon,
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  type?: "user" | "admin";
}

export function SidebarLayout({ children, type = "user" }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const userMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Purchases",
      href: "/dashboard/purchases",
      icon: ShoppingBag,
    },
    {
      title: "License Keys",
      href: "/dashboard/licenses",
      icon: Key,
    },
    {
      title: "WP Scan",
      href: "/dashboard/wp-scan",
      icon: SearchIcon,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Licenses",
      href: "/admin/licenses",
      icon: Key,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Webhooks",
      href: "/admin/webhooks",
      icon: Activity,
    },
    {
      title: "Revenue",
      href: "/admin/revenue",
      icon: DollarSign,
    },
  ];

  const menuItems = type === "admin" ? adminMenuItems : userMenuItems;

  const Sidebar = () => (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {type === "admin" ? (
            <>
              <Shield className="h-6 w-6 text-primary" />
              <span>Admin Panel</span>
            </>
          ) : (
            <>
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span>My Dashboard</span>
            </>
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-2 border-b bg-background px-4 h-14 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <span className="font-semibold">
          {type === "admin" ? "Admin Panel" : "Dashboard"}
        </span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 border-r">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
