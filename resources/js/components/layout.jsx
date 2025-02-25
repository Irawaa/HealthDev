import React from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import Navbar from "./navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <ScrollArea className="h-[calc(100vh-4rem)] p-5">
        <Toaster position="top-center" />
          <main>{children}</main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
