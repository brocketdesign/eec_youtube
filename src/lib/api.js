const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  // ---- Public ----
  getAvailableSlots: () =>
    fetch(`${API_BASE}/api/schedule/available`).then((r) => r.json()),

  createBooking: (data) =>
    fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Booking failed');
      return body;
    }),

  // ---- Admin ----
  adminLogin: (password) =>
    fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Login failed');
      return body;
    }),

  adminGetSchedule: (password) =>
    fetch(`${API_BASE}/api/admin/schedule`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  adminAddSlots: (password, date, times) =>
    fetch(`${API_BASE}/api/admin/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ date, times }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to add slots');
      return body;
    }),

  adminDeleteSlot: (password, id) =>
    fetch(`${API_BASE}/api/admin/schedule/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to delete slot');
      return body;
    }),

  adminGetBookings: (password) =>
    fetch(`${API_BASE}/api/admin/bookings`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  adminMarkContacted: (password, id) =>
    fetch(`${API_BASE}/api/admin/bookings/${id}/contacted`, {
      method: 'PATCH',
      headers: { 'x-admin-password': password },
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to update booking');
      return body;
    }),

  // ---- Notification Email ----
  adminGetNotificationEmail: (password) =>
    fetch(`${API_BASE}/api/admin/notification-email`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  adminSetNotificationEmail: (password, email) =>
    fetch(`${API_BASE}/api/admin/notification-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ email }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to save email');
      return body;
    }),

  // ---- Ebook Downloads ----
  trackEbookDownload: (email) =>
    fetch(`${API_BASE}/api/ebook-downloads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then((r) => r.json()),

  adminGetEbookDownloads: (password) =>
    fetch(`${API_BASE}/api/admin/ebook-downloads`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  // ---- API Keys ----
  adminGetApiKeys: (password) =>
    fetch(`${API_BASE}/api/admin/api-keys`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  adminCreateApiKey: (password, name) =>
    fetch(`${API_BASE}/api/admin/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ name }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to create API key');
      return body;
    }),

  adminRevokeApiKey: (password, id) =>
    fetch(`${API_BASE}/api/admin/api-keys/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to revoke API key');
      return body;
    }),
};
