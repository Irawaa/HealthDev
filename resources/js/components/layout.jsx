import React, { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import Navbar from "./navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "react-hot-toast";
import { LoadingDialog } from "./loading-dialog"; // ✅ Import LoadingDialog

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if it's the first load after login
    if (!localStorage.getItem("hasLoggedIn")) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("hasLoggedIn", "true"); // Prevent it from showing again
      }, 2000); // Adjust delay as needed
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <ScrollArea className="h-[calc(100vh-4rem)] p-5">
          <Toaster position="top-center" />
          {isLoading && <LoadingDialog isOpen={isLoading} status="loading" />}
          <main className={`${isLoading ? "hidden" : "block"}`}>{children}</main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
