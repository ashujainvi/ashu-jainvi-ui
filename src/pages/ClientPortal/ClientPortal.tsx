import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import Button from '../../atoms/Button/Button';
import PhotoModal, {
  type PhotoItem,
} from '../../organisms/PhotoModal/PhotoModal';
import { portalApi, type ClientAlbum } from '../../services/portalApi';
import styles from './ClientPortal.module.css';

const ClientPortal = () => {
  const { albumSlug = '' } = useParams<{ albumSlug: string }>();
  const [album, setAlbum] = useState<ClientAlbum | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState('');
  const [modalIndex, setModalIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAlbum = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setAlbum(await portalApi.getClientAlbum(albumSlug));
      setAuthRequired(false);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to open album';
      if (message.toLowerCase().includes('sign in')) setAuthRequired(true);
      else setError(message);
    } finally {
      setLoading(false);
    }
  }, [albumSlug]);

  useEffect(() => {
    void loadAlbum();
  }, [loadAlbum]);

  const modalPhotos: PhotoItem[] = useMemo(
    () =>
      album?.photos.map((photo) => ({ src: photo.url, alt: photo.filename })) ??
      [],
    [album],
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await portalApi.clientLogin(albumSlug, password);
      await loadAlbum();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not unlock album',
      );
      setLoading(false);
    }
  };

  const toggleFavorite = async (imageId: string, favorite: boolean) => {
    if (!album) return;
    setAlbum({
      ...album,
      photos: album.photos.map((photo) =>
        photo.id === imageId ? { ...photo, favorite } : photo,
      ),
    });
    try {
      await portalApi.setFavorite(album.slug, imageId, favorite);
    } catch {
      setAlbum({
        ...album,
        photos: album.photos.map((photo) =>
          photo.id === imageId ? { ...photo, favorite: !favorite } : photo,
        ),
      });
    }
  };

  if (loading && !album) {
    return <main className={styles.centered}>Opening your gallery…</main>;
  }

  if (authRequired) {
    return (
      <main className={styles.centered}>
        <Seo
          title="Private client gallery"
          description="Private photography client gallery."
          path={`/clients/${albumSlug}`}
        />
        <form
          className={styles.loginCard}
          onSubmit={(event) => void handleLogin(event)}
        >
          <span className="text-overline">Private collection</span>
          <h1 className={styles.loginTitle}>Your photographs are ready.</h1>
          <p>
            Enter the password from your delivery message to open the album.
          </p>
          <label className={styles.field}>
            <span>Album password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Opening…' : 'Open album'}
          </Button>
        </form>
      </main>
    );
  }

  if (!album) {
    return (
      <main className={styles.centered}>
        {error || 'This album is unavailable.'}
      </main>
    );
  }

  const favoriteCount = album.photos.filter((photo) => photo.favorite).length;

  return (
    <main className={styles.portal}>
      <Seo
        title={`${album.title} — Client gallery`}
        description={album.description ?? 'Private photography client gallery.'}
        path={`/clients/${album.slug}`}
      />
      <header className={styles.header}>
        <span className="text-overline">Private client gallery</span>
        <h1 className="display">{album.title}</h1>
        {album.description && <p>{album.description}</p>}
        <div className={styles.summary}>
          <span>{album.photos.length} photographs</span>
          <span>{favoriteCount} selected</span>
          {album.eventDate && <span>{album.eventDate}</span>}
        </div>
      </header>
      <section className={styles.grid} aria-label="Album photographs">
        {album.photos.map((photo, index) => (
          <article
            key={photo.id}
            className={styles.photo}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <button
              className={styles.openPhoto}
              type="button"
              onClick={() => {
                setModalIndex(index);
                setModalOpen(true);
              }}
              aria-label={`Open ${photo.filename}`}
            >
              <img src={photo.url} alt={photo.filename} loading="lazy" />
            </button>
            <div className={styles.photoActions}>
              <button
                type="button"
                className={`${styles.favorite} ${photo.favorite ? styles.favoriteActive : ''}`}
                aria-pressed={photo.favorite}
                onClick={() => void toggleFavorite(photo.id, !photo.favorite)}
              >
                <span aria-hidden="true">♥</span>
                {photo.favorite ? 'Selected' : 'Select'}
              </button>
              {photo.downloadUrl && (
                <a href={photo.downloadUrl} className={styles.download}>
                  Download
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
      <PhotoModal
        photos={modalPhotos}
        currentIndex={modalIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setModalIndex}
      />
    </main>
  );
};

export default ClientPortal;
