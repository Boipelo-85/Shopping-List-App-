// src/services/api.ts

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL ='http://localhost:3000';

/* =========================================================
   TYPES
========================================================= */

export interface Item {
  id: number;
  listId: number;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  createdAt: number;
}

export type CreateItemData = Omit<
  Item,
  'id' | 'createdAt'
>;

export type UpdateItemData =
  Partial<CreateItemData>;

/* ---------------------------------------------------------
   USER
--------------------------------------------------------- */

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  celphone: string;
  password: string;
  createdAt: number;
}

export type CreateUserData = Omit<
  User,
  'id' | 'createdAt'
>;

/* ---------------------------------------------------------
   LIST
--------------------------------------------------------- */

export interface List {
  id: number;
  name: string;
  itemCount: number;
  createdAt: number;
}

/* =========================================================
   API ERROR
========================================================= */

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(
    message: string,
    status = 0,
    statusText = ''
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/* =========================================================
   API CALL HELPER
========================================================= */

const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,

      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    /* -----------------------------------------------------
       Check if server returned HTML instead of JSON
    ----------------------------------------------------- */

    const contentType =
      response.headers.get('content-type') || '';

    if (
      contentType.includes('text/html')
    ) {
      throw new ApiError(
        'Backend returned HTML instead of JSON. Make sure json-server is running.'
      );
    }

    /* -----------------------------------------------------
       Handle HTTP errors
    ----------------------------------------------------- */

    if (!response.ok) {
      let message =
        `API request failed: ${response.status} ${response.statusText}`;

      try {
        const errorData =
          await response.json();

        if (
          errorData &&
          typeof errorData.message === 'string'
        ) {
          message = errorData.message;
        }
      } catch {
        // Ignore JSON parsing errors.
      }

      throw new ApiError(
        message,
        response.status,
        response.statusText
      );
    }

    return response;
  } catch (error) {
    /* -----------------------------------------------------
       Preserve our own API errors
    ----------------------------------------------------- */

    if (error instanceof ApiError) {
      throw error;
    }

    /* -----------------------------------------------------
       Handle network errors
    ----------------------------------------------------- */

    if (
      error instanceof TypeError &&
      error.message.includes('fetch')
    ) {
      throw new ApiError(
        `Cannot connect to backend at ${API_BASE_URL}. ` +
        'Make sure json-server is running.'
      );
    }

    /* -----------------------------------------------------
       Unknown errors
    ----------------------------------------------------- */

    if (error instanceof Error) {
      throw new ApiError(error.message);
    }

    throw new ApiError(
      'An unknown API error occurred.'
    );
  }
};

/* =========================================================
   BACKEND CONNECTION CHECK
========================================================= */

export const checkBackendConnection =
  async (): Promise<boolean> => {
    try {
      const response =
        await fetch(`${API_BASE_URL}/users`);

      return response.ok;
    } catch {
      return false;
    }
  };

/* =========================================================
   USERS API
========================================================= */

export const usersApi = {

  /* -------------------------------------------------------
     GET ALL USERS
  ------------------------------------------------------- */

  getAll: async (): Promise<User[]> => {
    const response =
      await apiCall('/users');

    return response.json();
  },

  /* -------------------------------------------------------
     GET USER BY EMAIL
  ------------------------------------------------------- */

  getByEmail: async (
  email: string
): Promise<User | null> => {
  try {
    const normalizedEmail =
      email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return null;
    }

    const users =
      await usersApi.getAll();

    return (
      users.find(
        (user) =>
          user.email
            ?.trim()
            .toLowerCase() ===
          normalizedEmail
      ) || null
    );

  } catch (error) {

    console.error(
      'Failed to find user by email:',
      error
    );

    throw error;
  }
},
  /* -------------------------------------------------------
     GET USER BY ID
  ------------------------------------------------------- */

  getById: async (
    id: number
  ): Promise<User | null> => {

    try {
      const response =
        await apiCall(`/users/${id}`);

      return response.json();
    } catch (error) {

      if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  /* -------------------------------------------------------
     CREATE USER
  ------------------------------------------------------- */

  create: async (
    userData: CreateUserData
  ): Promise<User> => {

    const response =
      await apiCall('/users', {
        method: 'POST',

        body: JSON.stringify({
          ...userData,
          email: userData.email
            .trim()
            .toLowerCase(),
          username: userData.username
            .trim()
            .toLowerCase(),
          createdAt: Date.now(),
        }),
      });

    return response.json();
  },
};

/* =========================================================
   LISTS API
========================================================= */

export const listsApi = {

  /* -------------------------------------------------------
     GET ALL LISTS
  ------------------------------------------------------- */

  getAll: async (): Promise<List[]> => {
    const response =
      await apiCall('/lists');

    return response.json();
  },

  /* -------------------------------------------------------
     GET LIST BY ID
  ------------------------------------------------------- */

  getById: async (
    id: number
  ): Promise<List | null> => {

    try {
      const response =
        await apiCall(`/lists/${id}`);

      return response.json();
    } catch (error) {

      if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  /* -------------------------------------------------------
     CREATE LIST
  ------------------------------------------------------- */

  create: async (
    name: string
  ): Promise<List> => {

    const cleanName =
      name.trim();

    if (!cleanName) {
      throw new ApiError(
        'List name cannot be empty.'
      );
    }

    const response =
      await apiCall('/lists', {
        method: 'POST',

        body: JSON.stringify({
          name: cleanName,
          itemCount: 0,
          createdAt: Date.now(),
        }),
      });

    return response.json();
  },

  /* -------------------------------------------------------
     UPDATE LIST
  ------------------------------------------------------- */

  update: async (
    id: number,
    data: Partial<List>
  ): Promise<List> => {

    const response =
      await apiCall(`/lists/${id}`, {
        method: 'PATCH',

        body: JSON.stringify(data),
      });

    return response.json();
  },

  /* -------------------------------------------------------
     DELETE LIST
  ------------------------------------------------------- */

  delete: async (
    id: number
  ): Promise<void> => {

    await apiCall(`/lists/${id}`, {
      method: 'DELETE',
    });
  },
};

/* =========================================================
   ITEMS API
========================================================= */

export const itemsApi = {

  /* -------------------------------------------------------
     GET ALL ITEMS
  ------------------------------------------------------- */

  getAll: async (): Promise<Item[]> => {

    const response =
      await apiCall('/items');

    return response.json();
  },

  /* -------------------------------------------------------
     GET ITEM BY ID
  ------------------------------------------------------- */

  getById: async (
    id: number
  ): Promise<Item | null> => {

    try {
      const response =
        await apiCall(`/items/${id}`);

      return response.json();
    } catch (error) {

      if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  /* -------------------------------------------------------
     GET ITEMS BY LIST
  ------------------------------------------------------- */

  getByListId: async (
    listId: number
  ): Promise<Item[]> => {

    const response =
      await apiCall(
        `/items?listId=${listId}`
      );

    return response.json();
  },

  /* -------------------------------------------------------
     CREATE ITEM
  ------------------------------------------------------- */

  create: async (
    item: CreateItemData
  ): Promise<Item> => {

    const response =
      await apiCall('/items', {
        method: 'POST',

        body: JSON.stringify({
          ...item,
          createdAt: Date.now(),
        }),
      });

    return response.json();
  },

  /* -------------------------------------------------------
     UPDATE ITEM
  ------------------------------------------------------- */

  update: async (
    id: number,
    data: UpdateItemData
  ): Promise<Item> => {

    const response =
      await apiCall(`/items/${id}`, {
        method: 'PATCH',

        body: JSON.stringify(data),
      });

    return response.json();
  },

  /* -------------------------------------------------------
     DELETE ITEM
  ------------------------------------------------------- */

  delete: async (
    id: number
  ): Promise<void> => {

    await apiCall(`/items/${id}`, {
      method: 'DELETE',
    });
  },
};

/* =========================================================
   EXPORT API CONFIG
========================================================= */

export {
  API_BASE_URL,
};