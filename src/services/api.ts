// src/services/api.ts

const API_BASE_URL = 'http://localhost:3000';

// Helper function to check if backend is reachable
const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper function for API calls with better error handling
const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);

    // Check if we got HTML instead of JSON (backend not running)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Cannot connect to backend — is json-server running on port 3000?');
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with our custom message if it's a connection error
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to backend — is json-server running on port 3000?');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

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

export type CreateItemData = Omit<Item, 'id' | 'createdAt'>;
export type UpdateItemData = Partial<CreateItemData>;

export interface List {
  id: number;
  name: string;
  itemCount: number;
  createdAt: number;
}

export const listsApi = {
  getAll: async (): Promise<List[]> => {
    const response = await apiCall(`${API_BASE_URL}/lists`);
    return response.json();
  },

  create: async (name: string): Promise<List> => {
    const response = await apiCall(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        itemCount: 0,
      }),
    });
    return response.json();
  },

  update: async (
    id: number,
    data: Partial<List>
  ): Promise<List> => {
    const response = await apiCall(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiCall(`${API_BASE_URL}/lists/${id}`, {
      method: 'DELETE',
    });
  },
};

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    const response = await apiCall(`${API_BASE_URL}/items`);
    return response.json();
  },

  create: async (item: CreateItemData): Promise<Item> => {
    const response = await apiCall(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  },

  update: async (
    id: number,
    data: UpdateItemData
  ): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiCall(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
  },
};