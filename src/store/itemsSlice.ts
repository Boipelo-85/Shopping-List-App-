// src/store/itemsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string; // This will be the list name
  listId: number; // Reference to the list this item belongs to
  notes?: string;
  image?: string;
  createdAt: number;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  return await itemsApi.getAll();
});

export const createItem = createAsyncThunk('items/createItem', async (item: any) => {
  return await itemsApi.create(item);
});

export const updateItemApi = createAsyncThunk('items/updateItemApi', async ({ id, data }: { id: number; data: any }) => {
  return await itemsApi.update(id, data);
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id: number) => {
  await itemsApi.delete(id);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem: Item = {
        id: Date.now(),
        ...action.payload,
        createdAt: Date.now(),
      };
      state.items.push(newItem);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload);
      }
    },
    updateItemQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      // Create item
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update item
      .addCase(updateItemApi.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { addItem, removeItem, updateItem, updateItemQuantity } = itemsSlice.actions;
export default itemsSlice.reducer;
