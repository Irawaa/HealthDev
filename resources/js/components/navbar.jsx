import React, { useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import { usePage } from "@inertiajs/react"; // Import Inertia's usePage hook
import { Bell, CheckCircle, AlertCircle, XCircle } from "lucide-react"; // Import notification icons
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

const Navbar = () => {
    const { auth } = usePage().props; // Get authenticated user from Inertia props
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

    // Sample notifications with icons and descriptions
    const notifications = [
        { id: 1, message: "New comment on your post", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
        { id: 2, message: "Server maintenance scheduled", icon: <AlertCircle className="w-4 h-4 text-yellow-500" /> },
        { id: 3, message: "Failed login attempt detected", icon: <XCircle className="w-4 h-4 text-red-500" /> },
    ];

    const handleSidebarToggle = () => {
        const currentState = Cookies.get("sidebar_state") === "true";
        const newState = currentState ? "" : "true"; // Toggle between "true" and empty
        Cookies.set("sidebar_state", newState, { expires: 7 }); // Store for 7 days
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    return (
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b h-16 px-3 bg-green-800 text-white backdrop-blur">
            {/* Logo - Visible only on mobile */}
            <img
                src="/images/HLOGONEWT.png"
                alt="Logo"
                className="block md:hidden h-8 w-auto"
            />

            <SidebarTrigger onClick={handleSidebarToggle} /> {/* Attach click handler */}

            <div className="ml-auto flex items-center gap-4">
                {/* Notification Icon */}
                <div className="relative flex items-center justify-center"> {/* Added margin-right (mr-4) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Bell className="w-5 h-5 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 bg-gray-800 text-white shadow-lg rounded-md mt-4">
                            <ul className="text-sm">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                                        >
                                            {notification.icon}
                                            <span>{notification.message}</span>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem className="px-4 py-2 text-gray-500">
                                        No new notifications
                                    </DropdownMenuItem>
                                )}
                            </ul>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <NavUser user={auth?.user} isNavbar btnClassName="hover:bg-transparent focus-visible:ring-0" />
            </div>
        </header>
    );
};

export default Navbar;
