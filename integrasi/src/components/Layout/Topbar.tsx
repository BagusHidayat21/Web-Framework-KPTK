"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/lib/api";

// Modern Navbar Component
const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get user data from localStorage after component mounts
    const email = localStorage.getItem("userEmail") || "";
    const name = localStorage.getItem("userName") || "Admin User";
    setUserEmail(email);
    setUserName(name);
  }, []);

  const getUserInitials = () => {
    if (!isClient) return "A"; // Default fallback for SSR
    return userName.slice(0, 1).toUpperCase() || "A";
  };

  const menuMap: Record<string, string> = {};

  const title = menuMap[pathname] || "SMK Negeri 1 Jenangan";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await api.post("/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      localStorage.clear();
      alert("Logout Berhasil!");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Clear localStorage even if API call fails
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar - Hidden on mobile */}

          <Button variant="ghost" size="icon" className="relative">
          </Button>
          
          <Separator orientation="vertical" className="h-6" />

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-blue-600 text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;