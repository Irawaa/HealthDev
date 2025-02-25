import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import { usePage } from "@inertiajs/react"; // Import Inertia's usePage hook

const Navbar = () => {
    const { auth } = usePage().props; // Get authenticated user from Inertia props

    return (
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b h-16 px-3 bg-green-800 text-white backdrop-blur">
            {/* Logo - Visible only on mobile */}
            <img
                src="/images/HLOGONEWT.png"
                alt="Logo"
                className="block md:hidden h-8 w-auto"
            />

            <SidebarTrigger />

            <div className="ml-auto">
                <NavUser user={auth?.user} isNavbar btnClassName="hover:bg-transparent focus-visible:ring-0" />
            </div>
        </header>
    );
};

export default Navbar;
