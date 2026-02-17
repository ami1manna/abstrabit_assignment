"use client"

import { BookmarkX, Loader2 } from "lucide-react"
import { useAppSelector } from "@/src/store/hooks"
import { BookmarkCard } from "./BookmarkCard"

export function BookmarkList() {
  const { items, loading, error } = useAppSelector((state) => state.bookmarks)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">
          Loading bookmarks...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <BookmarkX className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-base font-medium text-foreground">
          No bookmarks yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first bookmark using the form above.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}
