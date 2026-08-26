// src/store/listSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { listsApi, type List as ApiList } from '../services/api';

export interface List {
  id: number;
  name: string;
  itemCount: number;
  createdAt: number;
}

export type CreateListData = Omit<List, 'id' | 'itemCount' | 'createdAt'>;
export type UpdateListData = Partial<Omit<List, 'id' | 'createdAt'>>;

interface ListState {
  lists: List[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: ListState = {
  lists: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

// Helper to convert API List to Redux List
const toList = (apiList: ApiList): List => ({
  id: apiList.id || Date.now(),
  name: apiList.name,
  itemCount: apiList.itemCount,
  createdAt: apiList.createdAt || Date.now(),
});

// Async thunks
export const fetchLists = createAsyncThunk<List[], void>(
  'lists/fetchLists',
  async (): Promise<List[]> => {
    const apiLists = await listsApi.getAll();
    return apiLists.map(toList);
  }
);

export const createList = createAsyncThunk<List, string>(
  'lists/createList',
  async (name: string): Promise<List> => {
    const apiList = await listsApi.create(name);
    return toList(apiList);
  }
);

export const updateList = createAsyncThunk<List, { id: number; data: UpdateListData }>(
  'lists/updateList',
  async ({ id, data }: { id: number; data: UpdateListData }): Promise<List> => {
    const apiList = await listsApi.update(id, data);
    return toList(apiList);
  }
);

export const deleteList = createAsyncThunk<number, number>(
  'lists/deleteList',
  async (id: number): Promise<number> => {
    await listsApi.delete(id);
    return id;
  }
);

const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<string>) => {
      const newList: List = {
        id: Date.now(),
        name: action.payload,
        itemCount: 0,
        createdAt: Date.now(),
      };
      state.lists.push(newList);
    },
    removeList: (state, action: PayloadAction<number>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
    },
    updateListName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.id);
      if (list) {
        list.name = action.payload.name;
      }
    },
    incrementItemCount: (state, action: PayloadAction<number>) => {
      const list = state.lists.find(l => l.id === action.payload);
      if (list) {
        list.itemCount += 1;
      }
    },
    decrementItemCount: (state, action: PayloadAction<number>) => {
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
      .addCase(createList.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.creating = false;
        state.lists.push(action.payload);
      })
      .addCase(createList.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create list';
      })
      // Update list
      .addCase(updateList.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateList.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.lists.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(updateList.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update list';
      })
      // Delete list
      .addCase(deleteList.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.deleting = false;
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete list';
      });
  },
});

export const { addList, removeList, updateListName, incrementItemCount, decrementItemCount } = listSlice.actions;
export default listSlice.reducer;