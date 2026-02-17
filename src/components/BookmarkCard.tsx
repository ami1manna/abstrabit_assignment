"use client"

import { ExternalLink, Globe, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/src/store/hooks"
import {
  deleteBookmark,
} from "@/src/store/features/bookmarks/bookmarksThunks"
import {
  type Bookmark,
} from "@/src/store/features/bookmarks/bookmarksSlice"

interface BookmarkCardProps {
  bookmark: Bookmark
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(deleteBookmark(bookmark.id))
  }

  return (
    <Card className="group relative border-border/60 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-foreground/[0.04]">
      <CardContent className="flex items-start gap-3.5 p-5">
        {/* Favicon placeholder */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold leading-tight text-card-foreground">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{extractDomain(bookmark.url)}</span>
          </a>
          {bookmark.created_at && (
            <p className="mt-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground/50 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          onClick={handleDelete}
          aria-label={`Delete bookmark: ${bookmark.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
