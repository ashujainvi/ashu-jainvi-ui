export interface ClientPhoto {
  id: string;
  filename: string;
  width: number;
  height: number;
  position: number;
  url: string;
  downloadUrl?: string;
  favorite: boolean;
}

export interface ClientAlbum {
  id: string;
  slug: string;
  title: string;
  description?: string;
  eventDate?: string;
  allowDownloads: boolean;
  photos: ClientPhoto[];
}

export interface AdminAlbum {
  id: string;
  slug: string;
  title: string;
  description?: string;
  eventDate?: string;
  allowDownloads: boolean;
  photoCount: number;
  favoriteCount: number;
  createdAt: string;
}

interface ApiErrorBody {
  error?: string;
}

const API_URL = (
  import.meta.env.VITE_PORTAL_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8787' : '')
).replace(/\/$/, '');

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const portalApi = {
  clientLogin: (slug: string, password: string) =>
    api<{ ok: true }>(`/api/client/session`, {
      method: 'POST',
      body: JSON.stringify({ slug, password }),
    }),

  getClientAlbum: (slug: string) =>
    api<ClientAlbum>(`/api/client/albums/${encodeURIComponent(slug)}`),

  setFavorite: (slug: string, imageId: string, favorite: boolean) =>
    api<{ favorite: boolean }>(
      `/api/client/albums/${encodeURIComponent(slug)}/favorites`,
      {
        method: 'POST',
        body: JSON.stringify({ imageId, favorite }),
      },
    ),

  adminLogin: (password: string) =>
    api<{ ok: true }>(`/api/admin/session`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  getAdminAlbums: () => api<AdminAlbum[]>(`/api/admin/albums`),

  createAlbum: (album: {
    title: string;
    slug: string;
    password: string;
    description?: string;
    eventDate?: string;
    allowDownloads: boolean;
  }) =>
    api<AdminAlbum>(`/api/admin/albums`, {
      method: 'POST',
      body: JSON.stringify(album),
    }),

  createUpload: (
    albumId: string,
    file: { filename: string; width: number; height: number; size: number },
  ) =>
    api<{ id: string; uploadURL: string }>(
      `/api/admin/albums/${encodeURIComponent(albumId)}/uploads`,
      { method: 'POST', body: JSON.stringify(file) },
    ),

  uploadReservedFile: async (uploadURL: string, file: File) => {
    const response = await fetch(uploadURL, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-File-Name': encodeURIComponent(file.name),
        'X-File-Size': String(file.size),
      },
      body: file,
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
      throw new Error(body.error ?? `Upload failed (${response.status})`);
    }
  },
};

export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      reject(new Error(`Could not read ${file.name}`));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}
