"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/src/store/hooks"
import { createBookmark } from "@/src/store/features/bookmarks/bookmarksThunks"

interface BookmarkFormProps {
  userId: string
}

export function BookmarkForm({ userId }: BookmarkFormProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !url.trim()) return

    try {
      setSubmitting(true)

      await dispatch(
        createBookmark({
          title: title.trim(),
          url: url.trim(),
          userId,
        })
      ).unwrap()

      setTitle("")
      setUrl("")
    } catch (err) {
      console.error("Failed to create bookmark:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="mb-8 border-border/60 shadow-lg shadow-foreground/[0.03]">
      <CardContent className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. React Documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-10 gap-1.5 px-5 font-medium"
          >
            <Plus className="h-4 w-4" />
            {submitting ? "Adding..." : "Add Bookmark"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
