// src/store/listSlice.ts

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  listsApi,
  type List as ApiList,
} from '../services/api';

    // Types

export interface List {
  id: number;
  name: string;
  itemCount: number;
  createdAt: number;
}

export type CreateListData = Omit<
  List,
  'id' | 'itemCount' | 'createdAt'
>;

export type UpdateListData = Partial<
  Omit<List, 'id' | 'createdAt'>
>;

interface ListState {
  lists: List[];

  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  error: string | null;
}

    // Initial state

const initialState: ListState = {
  lists: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  error: null,
};


const toList = (apiList: ApiList): List => ({
  id: apiList.id,
  name: apiList.name,
  itemCount: apiList.itemCount ?? 0,
  createdAt: apiList.createdAt ?? Date.now(),
});

  // Fetch all list

export const fetchLists = createAsyncThunk<
  List[],
  void,
  { rejectValue: string }
>(
  'lists/fetchLists',

  async (_, { rejectWithValue }) => {
    try {
      const apiLists = await listsApi.getAll();

      return apiLists.map(toList);
    } catch (error) {
      console.error(
        'Failed to fetch lists:',
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch lists'
      );
    }
  }
);

    // Fetch single list by ID

export const fetchListById = createAsyncThunk<
  List,
  number,
  { rejectValue: string }
>(
  'lists/fetchListById',

  async (id, { rejectWithValue }) => {
    try {
      const apiList = await listsApi.getById(id);

      if (!apiList) {
        return rejectWithValue('List not found');
      }

      return toList(apiList);
    } catch (error) {
      console.error(
        'Failed to fetch list:',
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch list'
      );
    }
  }
);

    // Create List

export const createList = createAsyncThunk<
  List,
  string,
  { rejectValue: string }
>(
  'lists/createList',

  async (name, { rejectWithValue }) => {
    try {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return rejectWithValue(
          'List name cannot be empty'
        );
      }

      const apiList = await listsApi.create(
        trimmedName
      );

      return toList(apiList);
    } catch (error) {
      console.error(
        'Failed to create list:',
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to create list'
      );
    }
  }
);

/* =========================================================
   UPDATE / RENAME LIST
========================================================= */

export const updateList = createAsyncThunk<
  List,
  {
    id: number;
    data: UpdateListData;
  },
  { rejectValue: string }
>(
  'lists/updateList',

  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (
        data.name !== undefined &&
        !data.name.trim()
      ) {
        return rejectWithValue(
          'List name cannot be empty'
        );
      }
      const apiList = await listsApi.update(
        id,
        {
          ...data,
          ...(data.name !== undefined
            ? { name: data.name.trim() }
            : {}),
        }
      );

      return toList(apiList);
    } catch (error) {
      console.error(
        'Failed to update list:',
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to update list'
      );
    }
  }
);

  // Delete list

export const deleteList = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'lists/deleteList',

  async (id, { rejectWithValue }) => {
    try {
      await listsApi.delete(id);

      return id;
    } catch (error) {
      console.error(
        'Failed to delete list:',
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to delete list'
      );
    }
  }
);

    // List slice

const listSlice = createSlice({
  name: 'lists',

  initialState,

  reducers: {


    incrementItemCount: (
      state,
      action: PayloadAction<number>
    ) => {
      const list = state.lists.find(
        (list) =>
          list.id === action.payload
      );

      if (list) {
        list.itemCount += 1;
      }
    },

    decrementItemCount: (
      state,
      action: PayloadAction<number>
    ) => {
      const list = state.lists.find(
        (list) =>
          list.id === action.payload
      );

      if (
        list &&
        list.itemCount > 0
      ) {
        list.itemCount -= 1;
      }
    },

    clearListError: (state) => {
      state.error = null;
    },
  },


   //  ASYNC API OPERATIONS


  extraReducers: (builder) => {
    builder

      // Fetch list

      .addCase(
        fetchLists.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLists.fulfilled,
        (state, action) => {
          state.loading = false;
          state.lists = action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchLists.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            action.error.message ??
            'Failed to fetch lists';
        }
      )

      // Fetch single list by ID

      .addCase(
        fetchListById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchListById.fulfilled,
        (state, action) => {
          state.loading = false;
          
          // Replace or add the list
          const index = state.lists.findIndex(
            (list) => list.id === action.payload.id
          );
          
          if (index !== -1) {
            state.lists[index] = action.payload;
          } else {
            state.lists.push(action.payload);
          }
          
          state.error = null;
        }
      )

      .addCase(
        fetchListById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            action.error.message ??
            'Failed to fetch list';
        }
      )

        // Create list

      .addCase(
        createList.pending,
        (state) => {
          state.creating = true;
          state.error = null;
        }
      )

      .addCase(
        createList.fulfilled,
        (state, action) => {
          state.creating = false;

          /*
           * The item returned here is the item
           * that was actually created by the API.
           */
          state.lists.push(
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        createList.rejected,
        (state, action) => {
          state.creating = false;

          state.error =
            action.payload ??
            action.error.message ??
            'Failed to create list';
        }
      )


        //  UPDATE LIST
      

      .addCase(
        updateList.pending,
        (state) => {
          state.updating = true;
          state.error = null;
        }
      )

      .addCase(
        updateList.fulfilled,
        (state, action) => {
          state.updating = false;

          const index =
            state.lists.findIndex(
              (list) =>
                list.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.lists[index] =
              action.payload;
          }

          state.error = null;
        }
      )

      .addCase(
        updateList.rejected,
        (state, action) => {
          state.updating = false;

          state.error =
            action.payload ??
            action.error.message ??
            'Failed to update list';
        }
      )

      // Delete list

      .addCase(
        deleteList.pending,
        (state) => {
          state.deleting = true;
          state.error = null;
        }
      )

      .addCase(
        deleteList.fulfilled,
        (state, action) => {
          state.deleting = false;

          state.lists =
            state.lists.filter(
              (list) =>
                list.id !== action.payload
            );

          state.error = null;
        }
      )

      .addCase(
        deleteList.rejected,
        (state, action) => {
          state.deleting = false;

          state.error =
            action.payload ??
            action.error.message ??
            'Failed to delete list';
        }
      );
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  incrementItemCount,
  decrementItemCount,
  clearListError,
} = listSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default listSlice.reducer;