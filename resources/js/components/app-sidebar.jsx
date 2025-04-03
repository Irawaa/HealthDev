import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Stethoscope,
  FileText,
  BarChart
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"

import { Link, usePage } from "@inertiajs/react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Health+",
      logo: GalleryVerticalEnd,
      plan: "University Clinic",
    },
  ],
  navMain: [
    {
      title: "My Patients",
      url: "#",
      icon: Stethoscope,
      isActive: true,
      items: [
        { title: "Search Patients", url: "/patients", icon: Bot },
        { title: "Medical History", url: "/medical-history", icon: BookOpen },
        { title: "Dental Records", url: "#", icon: Frame },
      ],
    },
    {
      title: "My Records",
      url: "#",
      icon: FileText,
      items: [
        { title: "Consultation Records", url: "#", icon: Command },
        { title: "Incident Reports", url: "#", icon: PieChart },
        { title: "Medical & Dental Exams", url: "#", icon: Map },
      ],
    },
    {
      title: "My Reports",
      url: "#",
      icon: BarChart,
      items: [
        { title: "Monthly Reports", url: "#", icon: AudioWaveform },
        { title: "Activity Logs", url: "#", icon: Settings2 },
        { title: "Clinic Staff", url: "/clinic-staff", icon: SquareTerminal },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {

  const { auth } = usePage().props;
  const isAdmin = auth?.user?.role === "admin";

  const filteredNavMain = data.navMain.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => isAdmin || item.title !== "Clinic Staff"
    ),
  }));

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-4 w-full px-4">
                <div className="flex aspect-square size-14 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src="/images/HLOGONEWT.png" alt="Logo" className="size-12" />
                </div>
                <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 via-green-500 to-green-900 bg-clip-text text-transparent">
                  Health+
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea>
          <NavMain items={filteredNavMain} />
          <NavProjects projects={data.projects} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="transition-all duration-200 flex justify-center items-center p-3 text-sm text-muted-foreground data-[collapsed=true]:text-center">
        <span className="hidden data-[collapsed=true]:block">v0.1</span>
        <span className="block data-[collapsed=true]:hidden">v0.1</span>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
