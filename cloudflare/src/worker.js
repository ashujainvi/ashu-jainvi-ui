const encoder = new TextEncoder();
const decoder = new TextDecoder();
const CLIENT_COOKIE = 'aj_client_session';
const ADMIN_COOKIE = 'aj_admin_session';
const CLIENT_SESSION_SECONDS = 60 * 60 * 24 * 14;
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;
const PASSWORD_ITERATIONS = 210_000;
const GALLERY_PRESET = Object.freeze({
  name: 'gallery',
  width: 2048,
  height: 2048,
  fit: 'scale-down',
  format: 'image/webp',
  quality: 82,
});
const DEFAULT_STORAGE_LIMIT_BYTES = 9_000_000_000;
const DEFAULT_UPLOAD_LIMIT_BYTES = 50_000_000;
const DEFAULT_MONTHLY_TRANSFORM_LIMIT = 4_500;

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), request, env);
    }
    try {
      return withCors(await route(request, env, ctx), request, env);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'request failed',
          method: request.method,
          path: new URL(request.url).pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof HttpError ? error.message : 'Something went wrong';
      return withCors(json({ error: message }, status), request, env);
    }
  },
};

async function route(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (path === '/api/health' && request.method === 'GET')
    return json({ ok: true });

  if (path === '/api/admin/session' && request.method === 'POST') {
    const body = await readJson(request);
    const throttleKey = await loginThrottleKey(request, 'admin');
    await assertLoginAllowed(env, throttleKey);
    if (
      !body.password ||
      !(await secureEqual(body.password, env.ADMIN_PASSWORD))
    ) {
      await recordFailedLogin(env, throttleKey);
      throw new HttpError(401, 'That studio password is not correct.');
    }
    await clearLoginFailures(env, throttleKey);
    const token = await signSession(
      { scope: 'admin', exp: unixTime() + ADMIN_SESSION_SECONDS },
      env.SESSION_SECRET,
    );
    return json({ ok: true }, 200, {
      'Set-Cookie': sessionCookie(
        ADMIN_COOKIE,
        token,
        ADMIN_SESSION_SECONDS,
        env,
      ),
    });
  }

  if (path === '/api/admin/albums' && request.method === 'GET') {
    await requireAdmin(request, env);
    const result = await env.DB.prepare(
      `SELECT a.id, a.slug, a.title, a.description, a.event_date AS eventDate,
              a.allow_downloads AS allowDownloads, a.created_at AS createdAt,
              COUNT(DISTINCT i.id) AS photoCount,
              (SELECT COUNT(*) FROM favorites f WHERE f.album_id = a.id) AS favoriteCount
         FROM albums a
         LEFT JOIN images i ON i.album_id = a.id AND i.r2_key IS NOT NULL
        GROUP BY a.id
        ORDER BY a.created_at DESC`,
    ).all();
    return json(result.results.map(normalizeAdminAlbum));
  }

  if (path === '/api/admin/albums' && request.method === 'POST') {
    await requireAdmin(request, env);
    const body = await readJson(request);
    const title = cleanText(body.title, 120);
    const slug = cleanSlug(body.slug);
    const password = String(body.password ?? '');
    if (!title || !slug || password.length < 8) {
      throw new HttpError(
        400,
        'Title, private link, and an 8-character password are required.',
      );
    }
    const id = crypto.randomUUID();
    const salt = randomToken(18);
    const passwordHash = await hashPassword(password, salt);
    try {
      await env.DB.prepare(
        `INSERT INTO albums
          (id, slug, title, description, event_date, password_salt, password_hash, allow_downloads)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      )
        .bind(
          id,
          slug,
          title,
          cleanText(body.description, 600) || null,
          cleanText(body.eventDate, 30) || null,
          salt,
          passwordHash,
          body.allowDownloads === true ? 1 : 0,
        )
        .run();
    } catch (error) {
      if (String(error).includes('UNIQUE')) {
        throw new HttpError(409, 'That private link is already in use.');
      }
      throw error;
    }
    return json(
      normalizeAdminAlbum({
        id,
        slug,
        title,
        description: cleanText(body.description, 600) || null,
        eventDate: cleanText(body.eventDate, 30) || null,
        allowDownloads: body.allowDownloads === true ? 1 : 0,
        photoCount: 0,
        favoriteCount: 0,
        createdAt: new Date().toISOString(),
      }),
      201,
    );
  }

  const uploadMatch = path.match(/^\/api\/admin\/albums\/([^/]+)\/uploads$/);
  if (uploadMatch && request.method === 'POST') {
    await requireAdmin(request, env);
    const albumId = decodeURIComponent(uploadMatch[1]);
    await requireAlbum(env, albumId);
    const body = await readJson(request);
    const filename = cleanText(body.filename, 240);
    const uploadBytes = positiveInt(body.size);
    const uploadLimit = positiveInt(
      env.MAX_UPLOAD_BYTES || DEFAULT_UPLOAD_LIMIT_BYTES,
    );
    if (!filename) throw new HttpError(400, 'A file name is required.');
    if (uploadBytes > uploadLimit) {
      throw new HttpError(
        413,
        `Each photograph must be smaller than ${formatMegabytes(uploadLimit)} MB.`,
      );
    }
    await assertStorageAvailable(env, uploadBytes);

    const id = crypto.randomUUID();
    const positionRow = await env.DB.prepare(
      'SELECT COALESCE(MAX(position), -1) + 1 AS nextPosition FROM images WHERE album_id = ?1',
    )
      .bind(albumId)
      .first();
    await env.DB.prepare(
      `INSERT INTO images
        (id, album_id, filename, width, height, position, original_bytes)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0)`,
    )
      .bind(
        id,
        albumId,
        filename,
        positiveInt(body.width),
        positiveInt(body.height),
        Number(positionRow?.nextPosition ?? 0),
      )
      .run();

    return json({
      id,
      uploadURL: `${new URL(request.url).origin}/api/admin/albums/${encodeURIComponent(albumId)}/originals/${encodeURIComponent(id)}`,
    });
  }

  const originalMatch = path.match(
    /^\/api\/admin\/albums\/([^/]+)\/originals\/([^/]+)$/,
  );
  if (originalMatch && request.method === 'PUT') {
    await requireAdmin(request, env);
    const albumId = decodeURIComponent(originalMatch[1]);
    const imageId = decodeURIComponent(originalMatch[2]);
    const image = await env.DB.prepare(
      'SELECT id, r2_key AS r2Key FROM images WHERE id = ?1 AND album_id = ?2',
    )
      .bind(imageId, albumId)
      .first();
    if (!image) throw new HttpError(404, 'Image not found.');
    if (image.r2Key) throw new HttpError(409, 'This photograph is uploaded.');
    if (!request.body) throw new HttpError(400, 'A photograph is required.');

    const uploadBytes = positiveInt(
      request.headers.get('X-File-Size') ||
        request.headers.get('Content-Length'),
    );
    const uploadLimit = positiveInt(
      env.MAX_UPLOAD_BYTES || DEFAULT_UPLOAD_LIMIT_BYTES,
    );
    if (uploadBytes > uploadLimit) {
      throw new HttpError(
        413,
        `Each photograph must be smaller than ${formatMegabytes(uploadLimit)} MB.`,
      );
    }
    await assertStorageAvailable(env, uploadBytes);

    const filename = safeFilename(
      decodeURIComponent(
        request.headers.get('X-File-Name') ?? `${imageId}.jpg`,
      ),
    );
    const key = `${albumId}/${imageId}/${filename}`;
    const object = await env.ORIGINALS.put(key, request.body, {
      httpMetadata: {
        contentType: request.headers.get('Content-Type') ?? 'image/jpeg',
      },
    });
    await env.DB.prepare(
      'UPDATE images SET r2_key = ?1, original_bytes = ?2 WHERE id = ?3',
    )
      .bind(key, Number(object.size || uploadBytes), imageId)
      .run();
    return json({ ok: true }, 201);
  }

  if (path === '/api/client/session' && request.method === 'POST') {
    const body = await readJson(request);
    const slug = cleanSlug(body.slug);
    const throttleKey = await loginThrottleKey(request, `client:${slug}`);
    await assertLoginAllowed(env, throttleKey);
    const album = await env.DB.prepare(
      'SELECT id, password_salt, password_hash FROM albums WHERE slug = ?1',
    )
      .bind(slug)
      .first();
    if (!album) {
      await recordFailedLogin(env, throttleKey);
      throw new HttpError(401, 'The album or password is not correct.');
    }
    const candidate = await hashPassword(
      String(body.password ?? ''),
      album.password_salt,
    );
    if (!(await secureEqual(candidate, album.password_hash))) {
      await recordFailedLogin(env, throttleKey);
      throw new HttpError(401, 'The album or password is not correct.');
    }
    await clearLoginFailures(env, throttleKey);
    const token = await signSession(
      {
        scope: 'client',
        albumId: album.id,
        visitorId: crypto.randomUUID(),
        exp: unixTime() + CLIENT_SESSION_SECONDS,
      },
      env.SESSION_SECRET,
    );
    return json({ ok: true }, 200, {
      'Set-Cookie': sessionCookie(
        CLIENT_COOKIE,
        token,
        CLIENT_SESSION_SECONDS,
        env,
      ),
    });
  }

  const albumMatch = path.match(/^\/api\/client\/albums\/([^/]+)$/);
  if (albumMatch && request.method === 'GET') {
    const slug = cleanSlug(decodeURIComponent(albumMatch[1]));
    const album = await env.DB.prepare(
      `SELECT id, slug, title, description, event_date AS eventDate,
              allow_downloads AS allowDownloads
         FROM albums WHERE slug = ?1`,
    )
      .bind(slug)
      .first();
    if (!album) throw new HttpError(404, 'This album is unavailable.');
    const session = await requireClient(request, env, album.id);
    const imageResult = await env.DB.prepare(
      `SELECT i.id, i.filename, i.width, i.height, i.position, i.r2_key AS r2Key,
              CASE WHEN f.image_id IS NULL THEN 0 ELSE 1 END AS favorite
         FROM images i
        LEFT JOIN favorites f
          ON f.image_id = i.id AND f.visitor_id = ?1
        WHERE i.album_id = ?2 AND i.r2_key IS NOT NULL
        ORDER BY i.position ASC, i.created_at ASC`,
    )
      .bind(session.visitorId, album.id)
      .all();
    const apiOrigin = new URL(request.url).origin;
    const photos = imageResult.results.map((image) => ({
      id: image.id,
      filename: image.filename,
      width: Number(image.width),
      height: Number(image.height),
      position: Number(image.position),
      url: `${apiOrigin}/api/client/albums/${encodeURIComponent(slug)}/images/${encodeURIComponent(image.id)}?preset=${GALLERY_PRESET.name}`,
      favorite: Boolean(image.favorite),
      ...(album.allowDownloads && image.r2Key
        ? {
            downloadUrl: `${apiOrigin}/api/client/albums/${encodeURIComponent(slug)}/downloads/${encodeURIComponent(image.id)}`,
          }
        : {}),
    }));
    return json({
      id: album.id,
      slug: album.slug,
      title: album.title,
      description: album.description || undefined,
      eventDate: album.eventDate || undefined,
      allowDownloads: Boolean(album.allowDownloads),
      photos,
    });
  }

  const clientImageMatch = path.match(
    /^\/api\/client\/albums\/([^/]+)\/images\/([^/]+)$/,
  );
  if (clientImageMatch && request.method === 'GET') {
    const slug = cleanSlug(decodeURIComponent(clientImageMatch[1]));
    const imageId = decodeURIComponent(clientImageMatch[2]);
    if (
      (url.searchParams.get('preset') || GALLERY_PRESET.name) !==
      GALLERY_PRESET.name
    ) {
      throw new HttpError(404, 'Image preset not found.');
    }
    const image = await env.DB.prepare(
      `SELECT a.id AS albumId, i.id, i.r2_key AS r2Key
         FROM albums a JOIN images i ON i.album_id = a.id
        WHERE a.slug = ?1 AND i.id = ?2 AND i.r2_key IS NOT NULL`,
    )
      .bind(slug, imageId)
      .first();
    if (!image) throw new HttpError(404, 'Photograph not found.');
    await requireClient(request, env, image.albumId);
    return serveGalleryImage(request, env, ctx, image);
  }

  const favoriteMatch = path.match(
    /^\/api\/client\/albums\/([^/]+)\/favorites$/,
  );
  if (favoriteMatch && request.method === 'POST') {
    const slug = cleanSlug(decodeURIComponent(favoriteMatch[1]));
    const album = await env.DB.prepare('SELECT id FROM albums WHERE slug = ?1')
      .bind(slug)
      .first();
    if (!album) throw new HttpError(404, 'Album not found.');
    const session = await requireClient(request, env, album.id);
    const body = await readJson(request);
    const imageId = cleanText(body.imageId, 100);
    const image = await env.DB.prepare(
      'SELECT id FROM images WHERE id = ?1 AND album_id = ?2',
    )
      .bind(imageId, album.id)
      .first();
    if (!image) throw new HttpError(404, 'Photograph not found.');
    if (body.favorite) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO favorites (album_id, image_id, visitor_id)
         VALUES (?1, ?2, ?3)`,
      )
        .bind(album.id, imageId, session.visitorId)
        .run();
    } else {
      await env.DB.prepare(
        'DELETE FROM favorites WHERE image_id = ?1 AND visitor_id = ?2',
      )
        .bind(imageId, session.visitorId)
        .run();
    }
    return json({ favorite: Boolean(body.favorite) });
  }

  const downloadMatch = path.match(
    /^\/api\/client\/albums\/([^/]+)\/downloads\/([^/]+)$/,
  );
  if (downloadMatch && request.method === 'GET') {
    const slug = cleanSlug(decodeURIComponent(downloadMatch[1]));
    const imageId = decodeURIComponent(downloadMatch[2]);
    const row = await env.DB.prepare(
      `SELECT a.id AS albumId, a.allow_downloads AS allowDownloads,
              i.r2_key AS r2Key, i.filename
         FROM albums a JOIN images i ON i.album_id = a.id
        WHERE a.slug = ?1 AND i.id = ?2`,
    )
      .bind(slug, imageId)
      .first();
    if (!row || !row.allowDownloads || !row.r2Key) {
      throw new HttpError(404, 'Download not available.');
    }
    await requireClient(request, env, row.albumId);
    const object = await env.ORIGINALS.get(row.r2Key);
    if (!object) throw new HttpError(404, 'Download not available.');
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set(
      'Content-Disposition',
      `attachment; filename="${safeFilename(row.filename)}"`,
    );
    headers.set('Cache-Control', 'private, no-store');
    return new Response(object.body, { headers });
  }

  throw new HttpError(404, 'Not found.');
}

async function requireAdmin(request, env) {
  const payload = await readSessionCookie(
    request,
    ADMIN_COOKIE,
    env.SESSION_SECRET,
  );
  if (!payload || payload.scope !== 'admin')
    throw new HttpError(401, 'Please sign in to the studio.');
  return payload;
}

async function requireClient(request, env, albumId) {
  const payload = await readSessionCookie(
    request,
    CLIENT_COOKIE,
    env.SESSION_SECRET,
  );
  if (!payload || payload.scope !== 'client' || payload.albumId !== albumId) {
    throw new HttpError(401, 'Please sign in to open this album.');
  }
  return payload;
}

async function requireAlbum(env, albumId) {
  const album = await env.DB.prepare('SELECT id FROM albums WHERE id = ?1')
    .bind(albumId)
    .first();
  if (!album) throw new HttpError(404, 'Album not found.');
  return album;
}

async function assertLoginAllowed(env, key) {
  const windowStart = unixTime() - 15 * 60;
  const row = await env.DB.prepare(
    'SELECT attempts, window_started_at AS windowStartedAt FROM auth_attempts WHERE key = ?1',
  )
    .bind(key)
    .first();
  if (
    row &&
    Number(row.windowStartedAt) >= windowStart &&
    Number(row.attempts) >= 10
  ) {
    throw new HttpError(
      429,
      'Too many attempts. Please wait 15 minutes and try again.',
    );
  }
}

async function recordFailedLogin(env, key) {
  const now = unixTime();
  const windowStart = now - 15 * 60;
  await env.DB.prepare(
    `INSERT INTO auth_attempts (key, attempts, window_started_at)
     VALUES (?1, 1, ?2)
     ON CONFLICT(key) DO UPDATE SET
       attempts = CASE
         WHEN window_started_at < ?3 THEN 1
         ELSE attempts + 1
       END,
       window_started_at = CASE
         WHEN window_started_at < ?3 THEN ?2
         ELSE window_started_at
       END`,
  )
    .bind(key, now, windowStart)
    .run();
}

async function clearLoginFailures(env, key) {
  await env.DB.prepare('DELETE FROM auth_attempts WHERE key = ?1')
    .bind(key)
    .run();
}

async function loginThrottleKey(request, scope) {
  const address = request.headers.get('CF-Connecting-IP') || 'local';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`${scope}:${address}`),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function serveGalleryImage(request, env, ctx, image) {
  const cacheUrl = new URL(request.url);
  cacheUrl.search = `?preset=${GALLERY_PRESET.name}&format=webp`;
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  const cached = await caches.default.match(cacheKey);
  if (cached) return privateImageResponse(cached);

  const object = await env.ORIGINALS.get(image.r2Key);
  if (!object) throw new HttpError(404, 'Photograph not found.');
  await reserveMonthlyTransform(env, image.id, GALLERY_PRESET.name);

  const transformed = (
    await env.IMAGES.input(object.body)
      .transform({
        width: GALLERY_PRESET.width,
        height: GALLERY_PRESET.height,
        fit: GALLERY_PRESET.fit,
      })
      .output({
        format: GALLERY_PRESET.format,
        quality: GALLERY_PRESET.quality,
      })
  ).response();
  const headers = new Headers(transformed.headers);
  headers.set('Cache-Control', 'public, max-age=604800');
  headers.set('Content-Disposition', 'inline');
  headers.set('X-Content-Type-Options', 'nosniff');
  const cacheResponse = new Response(transformed.body, {
    status: transformed.status,
    headers,
  });
  ctx?.waitUntil(caches.default.put(cacheKey, cacheResponse.clone()));
  return privateImageResponse(cacheResponse);
}

function privateImageResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, max-age=86400');
  headers.set('Cross-Origin-Resource-Policy', 'same-site');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function reserveMonthlyTransform(env, imageId, preset) {
  const billingMonth = new Date().toISOString().slice(0, 7);
  const existing = await env.DB.prepare(
    `SELECT 1 FROM image_transform_usage
      WHERE billing_month = ?1 AND image_id = ?2 AND preset = ?3`,
  )
    .bind(billingMonth, imageId, preset)
    .first();
  if (existing) return;

  const limit = positiveInt(
    env.MAX_MONTHLY_TRANSFORMS || DEFAULT_MONTHLY_TRANSFORM_LIMIT,
  );
  const usage = await env.DB.prepare(
    'SELECT COUNT(*) AS total FROM image_transform_usage WHERE billing_month = ?1',
  )
    .bind(billingMonth)
    .first();
  if (Number(usage?.total || 0) >= limit) {
    throw new HttpError(
      429,
      'This month’s optimized-gallery limit has been reached.',
    );
  }
  await env.DB.prepare(
    `INSERT OR IGNORE INTO image_transform_usage
      (billing_month, image_id, preset) VALUES (?1, ?2, ?3)`,
  )
    .bind(billingMonth, imageId, preset)
    .run();
}

async function assertStorageAvailable(env, incomingBytes) {
  const limit = positiveInt(
    env.MAX_STORAGE_BYTES || DEFAULT_STORAGE_LIMIT_BYTES,
  );
  const usage = await env.DB.prepare(
    'SELECT COALESCE(SUM(original_bytes), 0) AS total FROM images WHERE r2_key IS NOT NULL',
  ).first();
  if (Number(usage?.total || 0) + incomingBytes > limit) {
    throw new HttpError(
      413,
      'The private portal storage limit has been reached.',
    );
  }
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations: PASSWORD_ITERATIONS,
    },
    key,
    256,
  );
  return bytesToBase64Url(new Uint8Array(bits));
}

async function signSession(payload, secret) {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmacHex(body, secret);
  return `${body}.${signature}`;
}

async function readSessionCookie(request, name, secret) {
  const token = parseCookies(request.headers.get('Cookie') ?? '')[name];
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = await hmacHex(body, secret);
  if (!(await secureEqual(signature, expected))) return null;
  try {
    const payload = JSON.parse(decoder.decode(base64UrlToBytes(body)));
    return payload.exp > unixTime() ? payload : null;
  } catch {
    return null;
  }
}

async function hmacHex(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(value),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function secureEqual(left, right) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(left ?? ''))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(right ?? ''))),
  ]);
  return crypto.subtle.timingSafeEqual(leftHash, rightHash);
}

function sessionCookie(name, value, maxAge, env) {
  const domain = env.COOKIE_DOMAIN ? `; Domain=${env.COOKIE_DOMAIN}` : '';
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}${domain}`;
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  const origin = request.headers.get('Origin');
  if (origin && isAllowedOrigin(origin, env.ALLOWED_ORIGIN)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, X-File-Name, X-File-Size',
    );
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  }
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'same-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isAllowedOrigin(origin, allowedOrigin) {
  const allowed = String(allowedOrigin ?? '')
    .split(',')
    .map((value) => value.trim());
  return (
    allowed.includes(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  );
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'A valid JSON body is required.');
  }
}

function normalizeAdminAlbum(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || undefined,
    eventDate: row.eventDate || undefined,
    allowDownloads: Boolean(row.allowDownloads),
    photoCount: Number(row.photoCount || 0),
    favoriteCount: Number(row.favoriteCount || 0),
    createdAt: row.createdAt,
  };
}

function parseCookies(value) {
  return Object.fromEntries(
    value
      .split(';')
      .map((part) => {
        const separator = part.indexOf('=');
        return separator < 0
          ? ['', '']
          : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
      })
      .filter(([key]) => key),
  );
}

function cleanSlug(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function cleanText(value, maxLength) {
  return String(value ?? '')
    .trim()
    .slice(0, maxLength);
}

function safeFilename(value) {
  return String(value ?? 'download.jpg')
    .replace(/[^a-zA-Z0-9._ -]/g, '_')
    .slice(0, 180);
}

function positiveInt(value) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 1;
}

function formatMegabytes(bytes) {
  return Math.round(bytes / 1_000_000);
}

function randomToken(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function unixTime() {
  return Math.floor(Date.now() / 1000);
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
