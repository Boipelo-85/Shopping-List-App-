const API_BASE_URL = 'http://localhost:3000';

// Lists API
export const listsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/lists`);
    return response.json();
  },
  create: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, itemCount: 0 }),
    });
    return response.json();
  },
  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: number) => {
    await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'DELETE',
    });
  },
};

// Items API
export const itemsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/items`);
    return response.json();
  },
  create: async (item: any) => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  },
  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: number) => {
    await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
  },
};
