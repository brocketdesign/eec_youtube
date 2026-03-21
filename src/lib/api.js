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

  // ---- EEC Onboarding & Platform ----
  submitOnboarding: (data) =>
    fetch(`${API_BASE}/api/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Onboarding failed');
      return body;
    }),

  createCheckout: (userId, productId) =>
    fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Checkout failed');
      return body;
    }),

  getSetupStatus: (sessionId) =>
    fetch(`${API_BASE}/api/setup-status/${sessionId}`).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Status check failed');
      return body;
    }),

  login: (email, password) =>
    fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Login failed');
      return body;
    }),

  getDashboard: (userId) =>
    fetch(`${API_BASE}/api/dashboard/${userId}`).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to load dashboard');
      return body;
    }),

  updateDomain: (userId, domain) =>
    fetch(`${API_BASE}/api/dashboard/${userId}/domain`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to update domain');
      return body;
    }),

  updateTemplate: (userId, data) =>
    fetch(`${API_BASE}/api/dashboard/${userId}/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to update template');
      return body;
    }),

  // ---- Products ----
  getProducts: () =>
    fetch(`${API_BASE}/api/products`).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to fetch products');
      return body;
    }),

  adminGetProducts: (password) =>
    fetch(`${API_BASE}/api/admin/products`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),

  adminCreateProduct: (password, data) =>
    fetch(`${API_BASE}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to create product');
      return body;
    }),

  adminUpdateProduct: (password, id, data) =>
    fetch(`${API_BASE}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to update product');
      return body;
    }),

  adminDeleteProduct: (password, id) =>
    fetch(`${API_BASE}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Failed to deactivate product');
      return body;
    }),

  // ---- Newsletter ----
  subscribeNewsletter: (data) =>
    fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Subscription failed');
      return body;
    }),

  getNewsletterHeroImage: () =>
    fetch(`${API_BASE}/api/newsletter/hero-image`).then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || 'Image generation failed');
      return body;
    }),

  adminGetNewsletterSubscribers: (password) =>
    fetch(`${API_BASE}/api/admin/newsletter-subscribers`, {
      headers: { 'x-admin-password': password },
    }).then((r) => r.json()),
};
