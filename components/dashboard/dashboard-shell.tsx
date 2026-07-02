"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  User as UserIcon,
  Building,
  PlusCircle,
  Inbox,
  Users,
  FileText,
  AlertOctagon,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Loader2,
  Sparkles,
  Info,
  Contact2
} from "lucide-react";
import { useAuth, getDashboardRoute } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";

// ─── Types and Interface ──────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardShellProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

// ─── Role configuration ────────────────────────────────────────────────────────

const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  guest: [],
  auth_user: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Saved Properties", href: "/dashboard/saved", icon: Heart },
    { label: "My Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
    { label: "My Applications", href: "/dashboard/applications", icon: FileText },
    { label: "My Blogs", href: "/dashboard/blogs", icon: FileText },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserIcon },
  ],
  agent: [
    { label: "Agent Overview", href: "/agent/dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/agent/listings", icon: Building },
    { label: "Create Listing", href: "/agent/listings/new", icon: PlusCircle },
    { label: "Tenant Applications", href: "/agent/applications", icon: FileText },
    { label: "Leads & Inquiries", href: "/agent/leads", icon: Inbox },
    { label: "My Blogs", href: "/agent/blogs", icon: FileText },
    { label: "Pricing Packages", href: "/agent/packages", icon: Sparkles },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserIcon },
  ],
  owner: [
    { label: "Owner Overview", href: "/owner/dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/owner/listings", icon: Building },
    { label: "Create Listing", href: "/owner/listings/new", icon: PlusCircle },
    { label: "Tenant Applications", href: "/owner/applications", icon: FileText },
    { label: "Leads & Inquiries", href: "/owner/leads", icon: Inbox },
    { label: "My Blogs", href: "/owner/blogs", icon: FileText },
    { label: "Pricing Packages", href: "/owner/packages", icon: Sparkles },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserIcon },
  ],
  admin: [
    { label: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Manage Listings", href: "/admin/listings", icon: Building },
    { label: "Manage Blogs", href: "/admin/blogs", icon: FileText },
    { label: "User Reports", href: "/admin/reports", icon: AlertOctagon },
    { label: "Manage Packages", href: "/admin/packages", icon: Settings },
  ],
  super_admin: [
    { label: "Platform Console", href: "/super-admin/dashboard", icon: ShieldCheck },
    { label: "Manage Roles", href: "/super-admin/roles", icon: Users },
    { label: "Platform Settings", href: "/super-admin/settings", icon: Settings },
  ],
};

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "auth_user": return "Member";
    case "agent": return "Agent";
    case "owner": return "Owner";
    case "admin": return "Admin";
    case "super_admin": return "Super Admin";
    default: return "Guest";
  }
}

function getRoleColor(role: UserRole): string {
  switch (role) {
    case "agent": return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "owner": return "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "admin": return "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20";
    case "super_admin": return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
    default: return "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20";
  }
}

// ─── Dashboard Shell Component ─────────────────────────────────────────────────

export function DashboardShell({ children, allowedRoles }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isLoading, logout, login } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Authenticate / Redirect check
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required", { description: "Please sign in to view this page." });
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Check if role is authorized
  const hasAccess = React.useMemo(() => {
    if (!currentUser) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(currentUser.role);
  }, [currentUser, allowedRoles]);

  // Handle Quick Role Switching (for testing purposes)
  const handleRoleSwitch = async (newRole: UserRole) => {
    const emailMap: Record<UserRole, string> = {
      guest: "",
      auth_user: "user@brandestate.com",
      agent: "agent@brandestate.com",
      owner: "owner@brandestate.com",
      admin: "admin@brandestate.com",
      super_admin: "superadmin@brandestate.com",
    };

    const targetEmail = emailMap[newRole];
    if (!targetEmail) return;

    toast.promise(
      login(targetEmail, "Password123", newRole),
      {
        loading: `Switching to ${getRoleLabel(newRole)} workspace...`,
        success: (data) => {
          const dest = getDashboardRoute(newRole);
          router.push(dest);
          return `Switched to ${getRoleLabel(newRole)}!`;
        },
        error: "Failed to switch role."
      }
    );
  };

  const navItems = currentUser ? ROLE_NAV_ITEMS[currentUser.role] : [];
  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "BE";

  // If loading or unauthorized, render beautiful loading states
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <Loader2 className="h-10 w-10 text-accent-primary animate-spin" />
        <p className="text-sm font-semibold text-text-muted">Loading workspace...</p>
      </div>
    );
  }

  // Handle unauthorized state
  if (!hasAccess && allowedRoles) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
        <div className="h-16 w-16 rounded-full bg-state-error/10 border border-state-error/20 flex items-center justify-center text-state-error mb-4">
          <AlertOctagon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Access Denied</h1>
        <p className="text-sm text-text-secondary max-w-md mb-6">
          Your account role ({getRoleLabel(currentUser.role)}) does not have permission to access {pathname}.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push(getDashboardRoute(currentUser.role))}>
            Back to My Dashboard
          </Button>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex font-body antialiased transition-colors duration-200">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-bg-surface border-r border-border-default/60 z-20 transition-colors duration-200">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-border-default/60 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-accent-primary to-blue-600 flex items-center justify-center shadow-lg shadow-accent-primary/20">
              <span className="text-white font-extrabold text-sm tracking-tighter">BE</span>
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-text-primary">
              Brand<span className="text-accent-primary">Estate</span>
            </span>
          </Link>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                  isActive
                    ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shadow-xs shadow-accent-primary/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-primary")} />
                {item.label}
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(0,103,210,0.8)] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card Footer */}
        <div className="p-4 border-t border-border-default/60 bg-bg-alt/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-bg-elevated border border-border-default/45">
            <Avatar className="h-10 w-10 border border-border-default/60 shrink-0 overflow-hidden">
              <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} className="object-cover" />
              <AvatarFallback className="bg-accent-primary-dim text-accent-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-primary truncate leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-text-muted truncate mt-0.5">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Layout Wrapper ─────────────────────────── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-bg-surface/80 border-b border-border-default/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md transition-colors duration-200">
          {/* Left section (Hamburger + breadcrumbs) */}
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer">
                  <Menu className="h-5 w-5" />
                </Button>
              } />
              <SheetContent side="left" className="w-64 bg-bg-surface border-r border-border-default/60 p-0 text-text-primary dark:text-white flex flex-col">
                <SheetHeader className="h-16 px-6 border-b border-border-default/60 flex flex-row items-center justify-between">
                  <SheetTitle className="text-text-primary dark:text-white text-left font-heading font-extrabold flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent-primary flex items-center justify-center">
                      <span className="text-white font-black text-xs">BE</span>
                    </div>
                    BrandEstate
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          isActive
                            ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/10"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/40"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-border-default/60 bg-bg-alt/40 flex items-center gap-3">
                  <Avatar className="h-9 w-9 overflow-hidden">
                    <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} className="object-cover" />
                    <AvatarFallback className="bg-accent-primary-dim text-accent-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{currentUser.name}</p>
                    <span className={cn("inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border mt-0.5", getRoleColor(currentUser.role))}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
 
            {/* Platform links and active info */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="hidden sm:inline-block font-bold text-text-muted uppercase tracking-widest">
                Workspace
              </span>
              <span className="hidden sm:inline-block text-border-default font-bold">/</span>
              <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border", getRoleColor(currentUser.role))}>
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
          </div>

          {/* Right section (Testing Switcher + notifications + User actions) */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick role switcher dropdown for testing */}
            <div className="flex items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" size="sm" className="h-9 px-3 rounded-full text-xs font-bold gap-1 bg-bg-surface border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60 cursor-pointer">
                    <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    <span>Role Demo</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-52 bg-bg-surface border-border-default text-text-secondary dark:text-slate-200 rounded-xl p-1 shadow-2xl">
                  <DropdownMenuLabel className="text-[10px] text-text-muted font-extrabold uppercase px-2.5 py-1.5">
                    Demo Role Simulator
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border-default/60" />
                  <DropdownMenuItem onClick={() => handleRoleSwitch("auth_user")} className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-elevated flex items-center justify-between">
                    <span>Regular Buyer (User)</span>
                    {currentUser.role === "auth_user" && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("agent")} className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-elevated flex items-center justify-between">
                    <span>Real Estate Agent</span>
                    {currentUser.role === "agent" && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("owner")} className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-elevated flex items-center justify-between">
                    <span>Property Owner</span>
                    {currentUser.role === "owner" && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("admin")} className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-elevated flex items-center justify-between">
                    <span>Moderation Admin</span>
                    {currentUser.role === "admin" && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("super_admin")} className="rounded-lg text-xs font-semibold py-2 px-2.5 cursor-pointer hover:bg-bg-elevated flex items-center justify-between">
                    <span>Super Administrator</span>
                    {currentUser.role === "super_admin" && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notification triggers */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon-sm" className="h-9 w-9 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-elevated/40 relative cursor-pointer">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-rose-500 rounded-full" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-80 bg-bg-surface border-border-default text-text-secondary dark:text-slate-200 rounded-xl p-1 shadow-2xl">
                <DropdownMenuLabel className="text-xs font-bold px-3 py-2 flex items-center justify-between border-b border-border-default/60">
                  <span>Workspace Notifications</span>
                  <span className="text-[10px] text-accent-primary font-bold hover:underline cursor-pointer">Mark all read</span>
                </DropdownMenuLabel>
                <div className="py-1 max-h-64 overflow-y-auto">
                  <div className="px-3 py-2.5 hover:bg-bg-elevated/60 cursor-pointer rounded-lg text-xs flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary">New Agent inquiry</p>
                      <p className="text-[10px] text-text-muted mt-0.5 font-medium">David Chen sent inquiry for Manhattan Penthouse</p>
                      <span className="text-[9px] text-text-faint block mt-1">2 mins ago</span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-bg-elevated/60 cursor-pointer rounded-lg text-xs flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary">Listing Approved</p>
                      <p className="text-[10px] text-text-muted mt-0.5 font-medium">Your luxury villa listing has been approved by admin</p>
                      <span className="text-[9px] text-text-faint block mt-1">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="h-9 px-1.5 py-1 rounded-full gap-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated/40 cursor-pointer">
                  <Avatar className="h-7 w-7 border border-border-default/60 overflow-hidden">
                    <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} className="object-cover" />
                    <AvatarFallback className="bg-accent-primary-dim text-accent-primary font-bold text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="hidden sm:block h-3.5 w-3.5 opacity-60" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56 bg-bg-surface border-border-default text-text-secondary dark:text-slate-200 rounded-xl p-1 shadow-2xl">
                <DropdownMenuLabel className="flex flex-col px-3 py-2 gap-0.5">
                  <span className="font-semibold text-text-primary dark:text-white text-xs">{currentUser.name}</span>
                  <span className="text-[10px] text-text-muted font-semibold">{currentUser.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border-default/60" />
                
                {currentUser.role === "auth_user" && (
                  <DropdownMenuItem
                    render={<Link href="/dashboard/profile" className="flex items-center gap-2 w-full" />}
                    className="rounded-lg text-xs py-2 px-3 cursor-pointer hover:bg-bg-elevated"
                  >
                    <UserIcon className="h-4 w-4 opacity-75" />
                    <span>My Profile Settings</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem
                  render={<Link href="/" className="flex items-center gap-2 w-full" />}
                  className="rounded-lg text-xs py-2 px-3 cursor-pointer hover:bg-bg-elevated"
                >
                  <Building className="h-4 w-4 opacity-75" />
                  <span>Browse Public Listings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border-default/60" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-xs py-2 px-3 cursor-pointer hover:bg-bg-elevated text-rose-500 hover:text-rose-400">
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4 opacity-75" />
                    <span>Sign Out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          <div className="animate-fade-in duration-300">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
