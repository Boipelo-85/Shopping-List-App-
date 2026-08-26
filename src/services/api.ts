//Localhost key
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//PixaBay key
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

// ✅ Define the Item interface
export interface Item {
  id?: number;        // optional because backend generates it
  listId: number;     // must belong to a list
  name: string;       // item name
  image?: string;     // optional URL for picture
  createdAt?: number; // backend generates timestamp
}
// Interface for Image
 export interface PixabayImage {
  id: number;
  pageURL: string;
  previewURL: string;
  largeImageURL: string;
}

// ✅ Define the List interface (optional but useful)
export interface List {
  id?: number;
  name: string;
  itemCount: number;
  createdAt?: number;
}

export const listsApi = {
  getAll: async (): Promise<List[]> => {
    const response = await fetch(`${API_BASE_URL}/lists`);
    return response.json();
  },
  create: async (name: string): Promise<List> => {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, itemCount: 0 }),
    });
    return response.json();
  },
  update: async (id: number, data: Partial<List>): Promise<List> => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/lists/${id}`, { method: 'DELETE' });
  },
};

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/items`);
    return response.json();
  },
  create: async (item: Item): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  },
  update: async (id: number, data: Partial<Item>): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' });
  },
};
// Pixabay Image API
export const imageApi = {
  search: async (query: string): Promise<PixabayImage[]> => {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo`
    );
    const data = await response.json();
    return data.hits;
  },
};