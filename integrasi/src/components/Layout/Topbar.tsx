"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

type User = {
  name: string;
  email: string;
  avatar?: string;
};

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const menuMap: Record<string, string> = {};
  const title = menuMap[pathname] || "SMK Negeri 1 Jenangan";

  // 🔥 contoh ambil data user (bisa dari API Laravel pakai token)
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.post("/verify-token");

        // pastikan sesuai struktur response API kamu
        setUser({
          name: res.data.data.name,
          email: res.data.data.email,
          avatar: res.data.data.avatar,
        });
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token
    window.location.href = "/login"; // redirect ke login
  };

  if (!user) {
    return null;
  }

  console.log(user);

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
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-10 pr-4 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Avatar + Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-primary-foreground">
                    {user?.name?.[0] ?? "?"}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name ?? "Guest"}</span>
                  {user?.email && (
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
