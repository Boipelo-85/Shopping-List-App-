// src/store/listSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listsApi } from '../services/api';

export interface List {
  id: number;
  name: string;
  itemCount: number;
  createdAt: number;
}

interface ListState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  lists: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchLists = createAsyncThunk('lists/fetchLists', async () => {
  return await listsApi.getAll();
});

export const createList = createAsyncThunk('lists/createList', async (name: string) => {
  return await listsApi.create(name);
});

export const updateList = createAsyncThunk('lists/updateList', async ({ id, data }: { id: number; data: any }) => {
  return await listsApi.update(id, data);
});

export const deleteList = createAsyncThunk('lists/deleteList', async (id: number) => {
  await listsApi.delete(id);
  return id;
});

const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    addList: (state, action) => {
      const newList: List = {
        id: Date.now(),
        name: action.payload,
        itemCount: 0,
        createdAt: Date.now(),
      };
      state.lists.push(newList);
    },
    removeList: (state, action) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
    },
    updateListName: (state, action) => {
      const list = state.lists.find(l => l.id === action.payload.id);
      if (list) {
        list.name = action.payload.name;
      }
    },
    incrementItemCount: (state, action) => {
      const list = state.lists.find(l => l.id === action.payload);
      if (list) {
        list.itemCount += 1;
      }
    },
    decrementItemCount: (state, action) => {
      const list = state.lists.find(l => l.id === action.payload);
      if (list && list.itemCount > 0) {
        list.itemCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lists
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lists';
      })
      // Create list
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      // Update list
      .addCase(updateList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      // Delete list
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      });
  },
});

export const { addList, removeList, updateListName, incrementItemCount, decrementItemCount } = listSlice.actions;
export default listSlice.reducer;
