"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabaseClient"
import { useAppDispatch } from "@/src/store/hooks"
import { fetchBookmarks } from "@/src/store/features/bookmarks/bookmarksThunks"
import { setBookmarks } from "@/src/store/features/bookmarks/bookmarksSlice"
import { Navbar } from "@/src/components/Navbar"
import { BookmarkForm } from "@/src/components/BookmarkForm"
import { BookmarkList } from "@/src/components/BookmarkList"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

useEffect(() => {
  let channel: any

  const initialize = async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      router.push("/")
      return
    }

    const uid = data.session.user.id
    setUserId(uid)

    // Initial fetch
    dispatch(fetchBookmarks(uid))

    // Realtime subscription
    channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${uid}`,
        },
        (payload) => {
          console.log("REALTIME EVENT:", payload)
          dispatch(fetchBookmarks(uid))
        }
      )
      .subscribe((status) => {
        console.log("SUBSCRIPTION STATUS:", status)
      })


    setLoading(false)
  }

  initialize()

  return () => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }
}, [router, dispatch])


  if (loading || !userId) return null

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

        <BookmarkForm userId={userId} />
        <BookmarkList />
      </main>
    </div>
  )
}
