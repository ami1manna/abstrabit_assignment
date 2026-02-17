"use client"

import { Navbar } from "@/src/components/Navbar"
import { BookmarkForm } from "@/src/components/BookmarkForm"
import { BookmarkList } from "@/src/components/BookmarkList"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Bookmarks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save and organize your favorite links in one place.
          </p>
        </div>
        <BookmarkForm />
        <BookmarkList />
      </main>
    </div>
  )
}
