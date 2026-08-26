// src/store/itemsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string;
  listId: number;
  notes?: string;
  image?: string;
  createdAt: number;
}

export type CreateItemData = Omit<Item, 'id' | 'createdAt'>;
export type UpdateItemData = Partial<Omit<Item, 'id' | 'createdAt'>>;

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

// Async thunks with proper types
export const fetchItems = createAsyncThunk<Item[]>(
  'items/fetchItems',
  async () => {
    return itemsApi.getAll();
  }
);

export const createItem = createAsyncThunk<Item, CreateItemData>(
  'items/createItem',
  async (item) => {
    return itemsApi.create(item);
  }
);

export const updateItemApi = createAsyncThunk<
  Item,
  { id: number; data: UpdateItemData }
>(
  'items/updateItemApi',
  async ({ id, data }) => {
    return itemsApi.update(id, data);
  }
);
export const deleteItem = createAsyncThunk<number, number>(
  'items/deleteItem',
  async (id: number) => {
    await itemsApi.delete(id);
    return id;
  }
);

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
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      })
      // Update item
      .addCase(updateItemApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemApi.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItemApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const { addItem, removeItem, updateItem, updateItemQuantity } = itemsSlice.actions;
export default itemsSlice.reducer;