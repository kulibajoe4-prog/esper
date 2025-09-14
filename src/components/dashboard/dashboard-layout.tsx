"use client";
import type { FC, PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  BookUser,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookUser className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">iPresence</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/presence'}
                tooltip={{ children: 'Présences' }}
              >
                <Link href="/presence">
                  <UserCheck />
                  <span>Présences</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/reports'}
                tooltip={{ children: 'Reports' }}
              >
                <Link href="/reports">
                  <BarChart2 />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ children: 'Settings' }}
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {user && (
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`}
                    alt={user.displayName || 'User'}
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">{user.displayName}</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
                <div className="flex h-full w-full items-center justify-center">
                  <LogOut className="h-4 w-4" />
                </div>
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;