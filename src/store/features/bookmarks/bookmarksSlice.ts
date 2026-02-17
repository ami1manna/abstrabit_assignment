import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

const MOCK_USER_ID = "mock-user-001"

const initialState: BookmarksState = {
  items: [
    {
      id: "1",
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      user_id: MOCK_USER_ID,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      user_id: MOCK_USER_ID,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Redux Toolkit",
      url: "https://redux-toolkit.js.org",
      user_id: MOCK_USER_ID,
      created_at: new Date().toISOString(),
    },
  ],
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
    addBookmark(state, action: PayloadAction<Bookmark>) {
      state.items.unshift(action.payload)
    },
    removeBookmark(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setBookmarks, addBookmark, removeBookmark, setLoading, setError } =
  bookmarksSlice.actions
export default bookmarksSlice.reducer
