"use client";

import { Link } from "@inertiajs/react";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user, isNavbar, btnClassName }) {
  const { isMobile } = useSidebar();

  const fullName = user?.clinic_staff
    ? `${user.clinic_staff.fname} ${user.clinic_staff.mname ? user.clinic_staff.mname + " " : ""}${user.clinic_staff.lname} ${user.clinic_staff.ext ?? ""}`.trim()
    : user?.username || "Guest"; // Fallback to username or default text if user is null

  const getInitials = () => {
    if (user?.clinic_staff) {
      const fnameInitial = user.clinic_staff.fname?.charAt(0).toUpperCase() || "";
      const lnameInitial = user.clinic_staff.lname?.charAt(0).toUpperCase() || "";
      return `${fnameInitial}${lnameInitial}`;
    } else {
      return user?.username ? user.username.substring(0, 2).toUpperCase() : "NA";
    }
  };

  // console.log("User data:", user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`bg-green-800 text-white hover:bg-green-700 hover:text-white active:bg-green-600 active:text-white ${btnClassName}`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar ?? ""} alt={fullName} />
                <AvatarFallback className="rounded-lg bg-green-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">{fullName}</span>
                <span className="truncate text-xs text-white">{user?.email ?? ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-green-800 text-white"
            side={(isMobile || isNavbar) ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {!isNavbar && (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar ?? ""} alt={fullName} />
                      <AvatarFallback className="rounded-lg bg-green-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-white">{fullName}</span>
                      <span className="truncate text-xs text-white">{user?.email ?? ""}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-white hover:bg-green-700 active:bg-green-600">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="text-white hover:bg-green-700 active:bg-green-600">
              <LogOut />
              <Link href={route('logout')} method="post" as="button" className="text-white hover:text-gray-300">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}