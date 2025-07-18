"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu,Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Modern Navbar Component
const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  
  const menuMap: Record<string, string> = {
  };
  
  const title = menuMap[pathname] || 'SMK Negeri 1 Jenangan';
  
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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-10 pr-4 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
          
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
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-blue-600 text-primary-foreground">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;