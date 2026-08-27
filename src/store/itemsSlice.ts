// src/store/itemsSlice.ts

import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import { itemsApi } from '../services/api';
import type { Item, CreateItemData, UpdateItemData } from '../services/api';
/* =========================================================
   STATE
========================================================= */

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

/* =========================================================
   FETCH ITEMS
========================================================= */

export const fetchItems = createAsyncThunk<
  Item[],
  void,
  { rejectValue: string }
>(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      return await itemsApi.getAll();
    } catch (error) {
      console.error('Failed to fetch items:', error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch items'
      );
    }
  }
);

/* =========================================================
   FETCH ITEMS BY LIST ID
========================================================= */

export const fetchItemsByListId = createAsyncThunk<
  Item[],
  number,
  { rejectValue: string }
>(
  'items/fetchItemsByListId',
  async (listId, { rejectWithValue }) => {
    try {
      return await itemsApi.getByListId(listId);
    } catch (error) {
      console.error('Failed to fetch items by list ID:', error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch items'
      );
    }
  }
);

/* =========================================================
   CREATE ITEM
========================================================= */

export const createItem = createAsyncThunk<
  Item,
  CreateItemData,
  { rejectValue: string }
>(
  'items/createItem',
  async (item, { rejectWithValue }) => {
    try {
      /*
       * This calls:
       *
       * POST http://localhost:3000/items
       *
       * json-server then persists the item
       * inside database.json.
       */

      return await itemsApi.create(item);
    } catch (error) {
      console.error('Failed to create item:', error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to create item'
      );
    }
  }
);

/* =========================================================
   UPDATE ITEM
========================================================= */

export const updateItem = createAsyncThunk<
  Item,
  {
    id: number;
    data: UpdateItemData;
  },
  { rejectValue: string }
>(
  'items/updateItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await itemsApi.update(id, data);
    } catch (error) {
      console.error('Failed to update item:', error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to update item'
      );
    }
  }
);

/* =========================================================
   DELETE ITEM
========================================================= */

export const deleteItem = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await itemsApi.delete(id);

      return id;
    } catch (error) {
      console.error('Failed to delete item:', error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to delete item'
      );
    }
  }
);

/* =========================================================
   SLICE
========================================================= */

const itemsSlice = createSlice({
  name: 'items',

  initialState,

  reducers: {
   
  },

  extraReducers: (builder) => {
    builder

      /* ===============================================
         FETCH
      =============================================== */

      .addCase(
        fetchItems.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchItems.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchItems.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Failed to fetch items';
        }
      )

      /* ===============================================
         FETCH BY LIST ID
      =============================================== */

      .addCase(
        fetchItemsByListId.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchItemsByListId.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchItemsByListId.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Failed to fetch items';
        }
      )

      /* ===============================================
         CREATE
      =============================================== */

      .addCase(
        createItem.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createItem.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * The item returned by the API includes
           * the ID generated by json-server.
           */
          state.items.push(action.payload);

          state.error = null;
        }
      )

      .addCase(
        createItem.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Failed to create item';
        }
      )

      /* ===============================================
         UPDATE
      =============================================== */

      .addCase(
        updateItem.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateItem.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.items.findIndex(
              (item) =>
                item.id === action.payload.id
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }

          state.error = null;
        }
      )

      .addCase(
        updateItem.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Failed to update item';
        }
      )

      /* ===============================================
         DELETE
      =============================================== */

      .addCase(
        deleteItem.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteItem.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            state.items.filter(
              (item) =>
                item.id !== action.payload
            );

          state.error = null;
        }
      )

      .addCase(
        deleteItem.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Failed to delete item';
        }
      );
  },
});

/* =========================================================
   EXPORT
========================================================= */

export default itemsSlice.reducer;