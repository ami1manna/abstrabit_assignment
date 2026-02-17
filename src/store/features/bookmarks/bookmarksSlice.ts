import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  createBookmark,
  fetchBookmarks,
  deleteBookmark,
} from "./bookmarksThunks"

export interface Bookmark {
  id: string
  title: string
  url: string
  user_id: string
  created_at?: string
}

interface BookmarksState {
  items: Bookmark[]
  loading: boolean
  error: string | null
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
}

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    setBookmarks(state, action: PayloadAction<Bookmark[]>) {
      state.items = action.payload
    },

    /* =========================
       REALTIME INSERT
    ========================= */
    addRealtimeBookmark(state, action: PayloadAction<Bookmark>) {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      )
      if (!exists) {
        state.items.unshift(action.payload)
      }
    },

    /* =========================
       REALTIME DELETE
    ========================= */
    removeRealtimeBookmark(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         FETCH
      ========================= */
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || "Failed to fetch bookmarks"
      })

      /* =========================
         CREATE
      ========================= */
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })

      /* =========================
         DELETE
      ========================= */
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        )
      })
  },
})

export const {
  setBookmarks,
  addRealtimeBookmark,
  removeRealtimeBookmark,
  setLoading,
  setError,
} = bookmarksSlice.actions

export default bookmarksSlice.reducer
