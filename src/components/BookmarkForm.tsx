"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/src/store/hooks"
import { addBookmark } from "@/src/store/features/bookmarks/bookmarksSlice"

export function BookmarkForm() {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !url.trim()) return

    const newBookmark = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: url.trim(),
      user_id: "mock-user-001",
      created_at: new Date().toISOString(),
    }

    dispatch(addBookmark(newBookmark))
    setTitle("")
    setUrl("")
  }

  return (
    <Card className="mb-8 border-border/60 shadow-lg shadow-foreground/[0.03]">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. React Documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-background transition-shadow focus-visible:shadow-sm"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="url" className="text-sm font-medium text-foreground">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-10 bg-background transition-shadow focus-visible:shadow-sm"
              required
            />
          </div>
          <Button
            type="submit"
            className="h-10 gap-1.5 px-5 font-medium shadow-sm shadow-primary/20 transition-all hover:shadow-md hover:shadow-primary/25 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Bookmark
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
