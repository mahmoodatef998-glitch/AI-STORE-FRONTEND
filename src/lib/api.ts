import { ApiResponse, Equipment, EquipmentConsumption, Notification, Prediction, ConsumptionFilter, Order, OrderMaterial, StockMovement, CreateOrderDto, StockMovementFilter, OrderAttachment } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Always get fresh token from Supabase session
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    try {
      const { createSupabaseClient } = await import('./supabase');
      const supabase = createSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session error:', sessionError);
      }
      
      if (session?.access_token) {
        token = session.access_token;
        // Update localStorage with fresh token
        localStorage.setItem('supabase.auth.token', token);
      } else {
        // Clear invalid token from localStorage
        localStorage.removeItem('supabase.auth.token');
        throw new Error('No active session. Please login again.');
      }
    } catch (err) {
      console.error('Could not get Supabase session:', err);
      // If it's not a "no session" error, try localStorage as fallback
      if (!(err instanceof Error && err.message.includes('No active session'))) {
        token = localStorage.getItem('supabase.auth.token');
      }
    }
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      // If unauthorized, clear token and redirect to login
      if (response.status === 401) {
        localStorage.removeItem('supabase.auth.token');
        // Don't redirect if we're already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          // Use router if available, otherwise use window.location
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }

      // Log CORS errors specifically
      if (response.status === 0 || errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')) {
        console.error('❌ CORS or Network Error:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          url: `${API_URL}${endpoint}`,
        });
        throw new Error('Network error: Unable to connect to server. Please check your connection and try again.');
      }

      throw new Error(errorMessage);
    }

    // Parse JSON only if response is ok
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Network Error:', {
        endpoint,
        url: `${API_URL}${endpoint}`,
        error: error.message,
      });
      throw new Error('Network error: Unable to connect to server. Please check your connection and CORS settings.');
    }
    
    console.error('API Error:', error);
    throw error;
  }
}

// Equipment API
export const equipmentAPI = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await fetchAPI<Equipment[]>('/equipments');
    return response.data || [];
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await fetchAPI<Equipment>(`/equipments/${id}`);
    if (!response.data) throw new Error('Equipment not found');
    return response.data;
  },

  create: async (equipment: Partial<Equipment>): Promise<Equipment> => {
    const response = await fetchAPI<Equipment>('/equipments', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
    if (!response.data) throw new Error('Failed to create equipment');
    return response.data;
  },

  update: async (id: string, equipment: Partial<Equipment>): Promise<Equipment> => {
    const response = await fetchAPI<Equipment>(`/equipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
    if (!response.data) throw new Error('Failed to update equipment');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/equipments/${id}`, {
      method: 'DELETE',
    });
  },

  getLowStock: async (): Promise<Equipment[]> => {
    const response = await fetchAPI<Equipment[]>('/equipments/low-stock');
    return response.data || [];
  },
};

// Consumption API
export const consumptionAPI = {
  log: async (consumption: {
    equipment_id: string;
    quantity_used: number;
    purpose?: string;
  }): Promise<EquipmentConsumption> => {
    const response = await fetchAPI<EquipmentConsumption>('/consumption', {
      method: 'POST',
      body: JSON.stringify(consumption),
    });
    if (!response.data) throw new Error('Failed to log consumption');
    return response.data;
  },

  getHistory: async (filter?: ConsumptionFilter): Promise<EquipmentConsumption[]> => {
    const params = new URLSearchParams();
    if (filter?.equipment_id) params.append('equipment_id', filter.equipment_id);
    if (filter?.user_id) params.append('user_id', filter.user_id);
    if (filter?.start_date) params.append('start_date', filter.start_date);
    if (filter?.end_date) params.append('end_date', filter.end_date);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/consumption?${queryString}` : '/consumption';
    
    const response = await fetchAPI<EquipmentConsumption[]>(endpoint);
    return response.data || [];
  },

  getById: async (id: string): Promise<EquipmentConsumption> => {
    const response = await fetchAPI<EquipmentConsumption>(`/consumption/${id}`);
    if (!response.data) throw new Error('Consumption record not found');
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getAll: async (userId?: string, sent?: boolean): Promise<Notification[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (sent !== undefined) params.append('sent', sent.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    
    const response = await fetchAPI<Notification[]>(endpoint);
    return response.data || [];
  },

  markAsSent: async (id: string): Promise<Notification> => {
    const response = await fetchAPI<Notification>(`/notifications/${id}/sent`, {
      method: 'PUT',
    });
    if (!response.data) throw new Error('Failed to update notification');
    return response.data;
  },
};

// Prediction API
export const predictionAPI = {
  getAll: async (equipmentId?: string): Promise<Prediction[]> => {
    const endpoint = equipmentId 
      ? `/predictions?equipment_id=${equipmentId}`
      : '/predictions';
    
    const response = await fetchAPI<Prediction[]>(endpoint);
    return response.data || [];
  },

  getByEquipment: async (equipmentId: string): Promise<Prediction[]> => {
    const response = await fetchAPI<Prediction[]>(`/predictions/${equipmentId}`);
    return response.data || [];
  },
};

// Order API
export const orderAPI = {
  create: async (order: CreateOrderDto): Promise<Order> => {
    const response = await fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    if (!response.data) throw new Error('Failed to create order');
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await fetchAPI<Order[]>('/orders');
    return response.data || [];
  },

  getById: async (id: string): Promise<Order & { materials: OrderMaterial[] }> => {
    try {
      const response = await fetchAPI<Order & { materials: OrderMaterial[] }>(`/orders/${id}`);
      if (!response.data) throw new Error('Order not found');
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  },

  update: async (id: string, order: Partial<CreateOrderDto>): Promise<Order> => {
    const response = await fetchAPI<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
    if (!response.data) throw new Error('Failed to update order');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  getStockMovements: async (filter?: StockMovementFilter): Promise<StockMovement[]> => {
    const params = new URLSearchParams();
    if (filter?.equipment_id) params.append('equipment_id', filter.equipment_id);
    if (filter?.type) params.append('type', filter.type);
    if (filter?.receiver_name) params.append('receiver_name', filter.receiver_name);
    if (filter?.start_date) params.append('start_date', filter.start_date);
    if (filter?.end_date) params.append('end_date', filter.end_date);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/orders/history/movements?${queryString}` : '/orders/history/movements';
    
    const response = await fetchAPI<StockMovement[]>(endpoint);
    return response.data || [];
  },

  getAttachments: async (orderId: string): Promise<OrderAttachment[]> => {
    const response = await fetchAPI<OrderAttachment[]>(`/orders/${orderId}/attachments`);
    return response.data || [];
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await fetchAPI(`/orders/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  },
};

