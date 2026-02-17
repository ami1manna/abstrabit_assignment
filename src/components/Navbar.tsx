"use client"

import { Bookmark, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/25">
            <Bookmark className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Smart Bookmark
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Avatar className="ml-2 h-8 w-8 border border-border">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              // Supabase signOut will be integrated here
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
