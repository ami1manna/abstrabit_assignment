import { createAsyncThunk } from "@reduxjs/toolkit"
import { supabase } from "@/src/lib/supabaseClient"
import type { Bookmark } from "./bookmarksSlice"

/* =========================
   FETCH BOOKMARKS
========================= */
export const fetchBookmarks = createAsyncThunk<
  Bookmark[],
  string
>("bookmarks/fetchBookmarks", async (userId, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("create_at", { ascending: false })
     
  if (error) {
    return rejectWithValue(error.message)
  }

  return data as Bookmark[]
})

/* =========================
   CREATE BOOKMARK
========================= */
export const createBookmark = createAsyncThunk<
  Bookmark,
  { title: string; url: string; userId: string }
>("bookmarks/createBookmark", async ({ title, url, userId }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        user_id: userId,
      },
    ])
    .select()
    .single()

  if (error) {
    return rejectWithValue(error.message)
  }

  return data as Bookmark
})

/* =========================
   DELETE BOOKMARK
========================= */
export const deleteBookmark = createAsyncThunk<
  string,
  string
>("bookmarks/deleteBookmark", async (bookmarkId, { rejectWithValue }) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)

  if (error) {
    return rejectWithValue(error.message)
  }

  return bookmarkId
})
