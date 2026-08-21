import { useCallback, useEffect, useState } from 'react';
import Seo from '../../components/Seo/Seo';
import Button from '../../atoms/Button/Button';
import {
  getImageDimensions,
  portalApi,
  type AdminAlbum,
} from '../../services/portalApi';
import styles from './PortalStudio.module.css';

interface UploadState {
  total: number;
  completed: number;
  current: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const PortalStudio = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    password: '',
    description: '',
    eventDate: '',
    allowDownloads: false,
  });

  const loadAlbums = useCallback(async () => {
    try {
      const nextAlbums = await portalApi.getAdminAlbums();
      setAlbums(nextAlbums);
      setAuthenticated(true);
      if (!selectedAlbum && nextAlbums[0]) setSelectedAlbum(nextAlbums[0].id);
    } catch {
      setAuthenticated(false);
    }
  }, [selectedAlbum]);

  useEffect(() => {
    void loadAlbums();
  }, [loadAlbums]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      await portalApi.adminLogin(password);
      await loadAlbums();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Sign in failed',
      );
    }
  };

  const createAlbum = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      const created = await portalApi.createAlbum(form);
      setAlbums((current) => [created, ...current]);
      setSelectedAlbum(created.id);
      setNotice(`Created ${created.title}. Upload the finished JPEGs below.`);
      setForm({
        title: '',
        slug: '',
        password: '',
        description: '',
        eventDate: '',
        allowDownloads: false,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not create album',
      );
    }
  };

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (!selectedAlbum || files.length === 0) return;

    setError('');
    setNotice('');
    setUpload({ total: files.length, completed: 0, current: files[0].name });

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setUpload({
          total: files.length,
          completed: index,
          current: file.name,
        });
        const dimensions = await getImageDimensions(file);
        const target = await portalApi.createUpload(selectedAlbum, {
          filename: file.name,
          size: file.size,
          ...dimensions,
        });
        await portalApi.uploadReservedFile(target.uploadURL, file);
      }
      setUpload({ total: files.length, completed: files.length, current: '' });
      setNotice(
        `${files.length} photograph${files.length === 1 ? '' : 's'} uploaded.`,
      );
      await loadAlbums();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Upload failed',
      );
    } finally {
      event.target.value = '';
    }
  };

  if (!authenticated) {
    return (
      <main className={styles.centered}>
        <Seo
          title="Photography studio"
          description="Private photography administration."
          path="/studio"
        />
        <form className={styles.card} onSubmit={(event) => void login(event)}>
          <span className="text-overline">Owner access</span>
          <h1 className={styles.title}>Delivery studio</h1>
          <p>Create private albums and upload finished work.</p>
          <label className={styles.field}>
            <span>Studio password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit">Enter studio</Button>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.studio}>
      <Seo
        title="Photography delivery studio"
        description="Manage private photography albums."
        path="/studio"
      />
      <header className={styles.header}>
        <span className="text-overline">Private workspace</span>
        <h1 className="display">Delivery studio</h1>
        <p>
          Create a client album, then drop in the JPEGs exported from Lightroom
          Classic.
        </p>
      </header>

      {(error || notice) && (
        <div className={error ? styles.errorBanner : styles.notice}>
          {error || notice}
        </div>
      )}

      <div className={styles.layout}>
        <form
          className={styles.panel}
          onSubmit={(event) => void createAlbum(event)}
        >
          <div className={styles.panelHeading}>
            <span>01</span>
            <h2>Create an album</h2>
          </div>
          <label className={styles.field}>
            <span>Album title</span>
            <input
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({
                  ...current,
                  title,
                  slug: current.slug || slugify(title),
                }));
              }}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Private link name</span>
            <div className={styles.slugField}>
              <span>/clients/</span>
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm({ ...form, slug: slugify(event.target.value) })
                }
                required
              />
            </div>
          </label>
          <label className={styles.field}>
            <span>Client password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              minLength={8}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              rows={3}
            />
          </label>
          <label className={styles.field}>
            <span>Session date</span>
            <input
              type="date"
              value={form.eventDate}
              onChange={(event) =>
                setForm({ ...form, eventDate: event.target.value })
              }
            />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={form.allowDownloads}
              onChange={(event) =>
                setForm({ ...form, allowDownloads: event.target.checked })
              }
            />
            Allow full-resolution downloads for this album
          </label>
          <p className={styles.helper}>
            Off by default. Clients otherwise receive only the optimized gallery
            preset.
          </p>
          <Button type="submit">Create album</Button>
        </form>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <span>02</span>
            <h2>Upload photographs</h2>
          </div>
          <label className={styles.field}>
            <span>Destination album</span>
            <select
              value={selectedAlbum}
              onChange={(event) => setSelectedAlbum(event.target.value)}
            >
              <option value="">Choose an album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} · {album.photoCount} photos
                </option>
              ))}
            </select>
          </label>
          <label
            className={`${styles.dropzone} ${!selectedAlbum ? styles.disabled : ''}`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              disabled={
                !selectedAlbum ||
                Boolean(upload && upload.completed < upload.total)
              }
              onChange={(event) => void uploadFiles(event)}
            />
            <strong>
              {upload && upload.completed < upload.total
                ? 'Uploading…'
                : 'Choose finished JPEGs'}
            </strong>
            <span>
              Originals stay private in R2. Cloudflare Images creates the
              optimized gallery preset only when a client opens it.
            </span>
          </label>
          {upload && (
            <div className={styles.progress}>
              <div>
                <span
                  style={{
                    width: `${(upload.completed / upload.total) * 100}%`,
                  }}
                />
              </div>
              <p>
                {upload.completed} of {upload.total}
                {upload.current ? ` · ${upload.current}` : ''}
              </p>
            </div>
          )}
        </section>
      </div>

      <section className={styles.albums}>
        <h2>Client albums</h2>
        <div className={styles.albumGrid}>
          {albums.map((album) => (
            <article key={album.id} className={styles.albumCard}>
              <span>
                {album.photoCount} photographs · {album.favoriteCount} client
                selections
              </span>
              <h3>{album.title}</h3>
              <p>{album.description || 'Private client collection'}</p>
              <a
                href={`/clients/${album.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Open client view ↗
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PortalStudio;
