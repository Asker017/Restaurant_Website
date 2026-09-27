import type { AdminDashboardStats, AdminCustomer, AdminCustomerDetail, Order, Reservation, MenuItem, Category, Review, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// Admin Authentication
export async function adminLoginApi(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Admin login failed');
  return json;
}

// Dashboard
export async function fetchAdminDashboard(token: string): Promise<AdminDashboardStats> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch dashboard statistics');
  return json.data;
}

// Orders
export async function fetchAdminOrders(
  token: string,
  params?: { status?: string; orderType?: string; paymentStatus?: string; search?: string }
): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'all') query.append('status', params.status);
  if (params?.orderType && params.orderType !== 'all') query.append('orderType', params.orderType);
  if (params?.paymentStatus && params.paymentStatus !== 'all') query.append('paymentStatus', params.paymentStatus);
  if (params?.search?.trim()) query.append('search', params.search.trim());

  const url = `${API_BASE_URL}/admin/orders?${query.toString()}`;
  const res = await fetch(url, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch orders');
  return json.data;
}

export async function fetchAdminOrderById(token: string, id: string): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Order not found');
  return json.data;
}

export async function updateAdminOrderStatus(
  token: string,
  id: string,
  data: { status: string; paymentStatus?: string }
): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update order status');
  return json.data;
}

// Reservations
export async function fetchAdminReservations(
  token: string,
  params?: { date?: string; status?: string }
): Promise<Reservation[]> {
  const query = new URLSearchParams();
  if (params?.date) query.append('date', params.date);
  if (params?.status && params.status !== 'all') query.append('status', params.status);

  const url = `${API_BASE_URL}/admin/reservations?${query.toString()}`;
  const res = await fetch(url, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch reservations');
  return json.data;
}

export async function updateAdminReservationStatus(
  token: string,
  id: string,
  status: string
): Promise<Reservation> {
  const res = await fetch(`${API_BASE_URL}/admin/reservations/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update reservation status');
  return json.data;
}

// Menu Items CRUD
export async function fetchAdminMenuItems(token: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE_URL}/admin/menu`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch menu items');
  return json.data;
}

export async function createAdminMenuItem(token: string, data: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`${API_BASE_URL}/admin/menu`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create menu item');
  return json.data;
}

export async function updateAdminMenuItem(token: string, id: string, data: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`${API_BASE_URL}/admin/menu/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update menu item');
  return json.data;
}

export async function deleteAdminMenuItem(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/menu/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete menu item');
}

// Categories CRUD
export async function fetchAdminCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch categories');
  return json.data;
}

export async function createAdminCategory(token: string, data: { name: string; description?: string; displayOrder?: number }): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create category');
  return json.data;
}

export async function updateAdminCategory(token: string, id: string, data: { name?: string; description?: string; displayOrder?: number }): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update category');
  return json.data;
}

export async function deleteAdminCategory(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete category');
}

// Reviews Moderation
export async function fetchAdminReviews(token: string, status?: string): Promise<Review[]> {
  const query = new URLSearchParams();
  if (status && status !== 'all') query.append('status', status);

  const res = await fetch(`${API_BASE_URL}/admin/reviews?${query.toString()}`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch reviews');
  return json.data;
}

export async function updateAdminReviewStatus(token: string, id: string, status: 'approved' | 'rejected'): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update review status');
  return json.data;
}

export async function deleteAdminReview(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete review');
}

// Customers Management
export async function fetchAdminCustomers(token: string): Promise<AdminCustomer[]> {
  const res = await fetch(`${API_BASE_URL}/admin/customers`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch customers');
  return json.data;
}

export async function fetchAdminCustomerDetail(token: string, id: string): Promise<AdminCustomerDetail> {
  const res = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
    headers: getAuthHeaders(token)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Customer details not found');
  return json.data;
}
