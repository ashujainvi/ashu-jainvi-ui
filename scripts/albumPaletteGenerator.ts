/**
 * Album Palette Generator
 *
 * Analyzes images in an album folder to generate a 3-color gradient palette,
 * then updates the matching album in src/data/photos.ts.
 *
 * Usage:
 *   npx tsx scripts/albumPaletteGenerator.ts <albumFolder> [imageCount]
 *
 * Examples:
 *   npx tsx scripts/albumPaletteGenerator.ts bandits 5
 *   npx tsx scripts/albumPaletteGenerator.ts vanta 8
 *   npx tsx scripts/albumPaletteGenerator.ts icarus-cup
 */

import { getPalette } from 'colorthief';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PHOTOS_DIR = path.join(PROJECT_ROOT, 'src/assets/photos');
const PHOTOS_TS = path.join(PROJECT_ROOT, 'src/data/photos.ts');

type RGB = [number, number, number];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const albumFolder = process.argv[2];
const imageCount = parseInt(process.argv[3] || '5', 10);

if (!albumFolder) {
  console.error(
    'Usage: npx tsx scripts/albumPaletteGenerator.ts <albumFolder> [imageCount]',
  );
  process.exit(1);
}

// Fuzzy-match the album folder on disk (handles case, hyphens, spaces, etc.)
function findAlbumDir(input: string): string | null {
  const exact = path.join(PHOTOS_DIR, input);
  if (fs.existsSync(exact) && fs.statSync(exact).isDirectory()) return exact;

  // Normalize for comparison: lowercase, strip non-alphanumeric
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedInput = norm(input);

  const dirs = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => fs.statSync(path.join(PHOTOS_DIR, f)).isDirectory());

  // Try exact normalized match first, then substring containment
  const exactMatch = dirs.find((d) => norm(d) === normalizedInput);
  if (exactMatch) return path.join(PHOTOS_DIR, exactMatch);

  const containsMatch = dirs.find(
    (d) =>
      norm(d).includes(normalizedInput) || normalizedInput.includes(norm(d)),
  );
  if (containsMatch) return path.join(PHOTOS_DIR, containsMatch);

  return null;
}

const albumDir = findAlbumDir(albumFolder);

if (!albumDir) {
  const available = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => fs.statSync(path.join(PHOTOS_DIR, f)).isDirectory());
  console.error(
    `Album folder not found for "${albumFolder}".\n` +
      `Available folders: ${available.join(', ')}`,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Collect image paths
// ---------------------------------------------------------------------------

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const imageFiles = fs
  .readdirSync(albumDir)
  .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
  .sort()
  .slice(0, imageCount);

if (imageFiles.length === 0) {
  console.error(`No images found in ${albumDir}`);
  process.exit(1);
}

console.log(
  `Analyzing ${imageFiles.length} image(s) from "${albumFolder}"...\n`,
);

// ---------------------------------------------------------------------------
// Extract palettes
// ---------------------------------------------------------------------------

const PALETTE_SIZE = 6;
const allColors: RGB[] = [];

for (const file of imageFiles) {
  const filePath = path.join(albumDir, file);
  console.log(`  Extracting palette from ${file}`);
  const palette = await getPalette(filePath, PALETTE_SIZE);
  if (!palette) continue;
  for (const swatch of palette) {
    // colorthief returns objects with _r, _g, _b properties
    const s = swatch as unknown as { _r: number; _g: number; _b: number };
    allColors.push([s._r, s._g, s._b]);
  }
}

console.log(`\nCollected ${allColors.length} colors total.`);

// ---------------------------------------------------------------------------
// K-means clustering to find 3 representative colors
// ---------------------------------------------------------------------------

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
  );
}

function kMeans(colors: RGB[], k: number, maxIter = 30): RGB[] {
  // Initialize centroids using k-means++ for better spread
  const centroids: RGB[] = [colors[Math.floor(Math.random() * colors.length)]];

  for (let i = 1; i < k; i++) {
    const distances = colors.map((c) =>
      Math.min(...centroids.map((cent) => colorDistance(c, cent))),
    );
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalDist;
    for (let j = 0; j < colors.length; j++) {
      r -= distances[j];
      if (r <= 0) {
        centroids.push(colors[j]);
        break;
      }
    }
    if (centroids.length <= i) centroids.push(colors[i]);
  }

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign colors to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    for (const color of colors) {
      let minDist = Infinity;
      let closest = 0;
      for (let i = 0; i < k; i++) {
        const d = colorDistance(color, centroids[i]);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      }
      clusters[closest].push(color);
    }

    // Recalculate centroids
    let converged = true;
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;
      const newCentroid: RGB = [0, 0, 0];
      for (const c of clusters[i]) {
        newCentroid[0] += c[0];
        newCentroid[1] += c[1];
        newCentroid[2] += c[2];
      }
      newCentroid[0] = Math.round(newCentroid[0] / clusters[i].length);
      newCentroid[1] = Math.round(newCentroid[1] / clusters[i].length);
      newCentroid[2] = Math.round(newCentroid[2] / clusters[i].length);

      if (colorDistance(centroids[i], newCentroid) > 1) converged = false;
      centroids[i] = newCentroid;
    }

    if (converged) break;
  }

  return centroids;
}

// Run k-means multiple times and pick the result with best compactness
function bestKMeans(colors: RGB[], k: number, runs = 10): RGB[] {
  let bestCentroids: RGB[] = [];
  let bestScore = Infinity;

  for (let r = 0; r < runs; r++) {
    const centroids = kMeans(colors, k);
    // Score = sum of min distances from each color to nearest centroid
    let score = 0;
    for (const c of colors) {
      score += Math.min(...centroids.map((cent) => colorDistance(c, cent)));
    }
    if (score < bestScore) {
      bestScore = score;
      bestCentroids = centroids;
    }
  }

  return bestCentroids;
}

const medianColors = bestKMeans(allColors, 3);

// Sort by luminance (dark to light) for a natural gradient flow
medianColors.sort(
  (a, b) =>
    0.299 * a[0] +
    0.587 * a[1] +
    0.114 * a[2] -
    (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]),
);

function rgbToHex(rgb: RGB): string {
  return (
    '#' +
    rgb
      .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0'))
      .join('')
  );
}

const hexColors = medianColors.map(rgbToHex) as [string, string, string];
console.log(`\nGenerated palette: ${hexColors.join(', ')}`);

// ---------------------------------------------------------------------------
// Update photos.ts — find album by fuzzy title match, update gradient
// ---------------------------------------------------------------------------

const photosContent = fs.readFileSync(PHOTOS_TS, 'utf-8');

// Normalize a string for comparison: lowercase, strip non-alphanumeric, collapse spaces
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ') // replace hyphens, @, punctuation etc. with space
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

// Extract all album titles from photos.ts
const titleRegex = /title:\s*'([^']+)'/g;
const albumTitles: string[] = [];
let titleMatch: RegExpExecArray | null;
while ((titleMatch = titleRegex.exec(photosContent)) !== null) {
  albumTitles.push(titleMatch[1]);
}

// Match the provided album name against titles using normalized comparison
const normalizedInput = normalize(albumFolder);

function matchScore(title: string): number {
  const normalizedTitle = normalize(title);

  // Exact normalized match
  if (normalizedTitle === normalizedInput) return 100;

  // One contains the other fully
  if (normalizedTitle.includes(normalizedInput)) return 90;
  if (normalizedInput.includes(normalizedTitle)) return 80;

  // Check if all words from input appear in the title (or vice versa)
  const inputWords = normalizedInput.split(' ');
  const titleWords = normalizedTitle.split(' ');
  const inputInTitle = inputWords.filter((w) =>
    titleWords.some((tw) => tw.includes(w) || w.includes(tw)),
  );
  const titleInInput = titleWords.filter((w) =>
    inputWords.some((iw) => iw.includes(w) || w.includes(iw)),
  );

  if (inputInTitle.length === inputWords.length)
    return 70 + inputInTitle.length;
  if (titleInInput.length === titleWords.length)
    return 60 + titleInInput.length;

  // Partial word overlap
  const overlapRatio =
    inputInTitle.length / Math.max(inputWords.length, titleWords.length);
  if (overlapRatio > 0) return Math.round(overlapRatio * 50);

  return 0;
}

const scored = albumTitles
  .map((title) => ({ title, score: matchScore(title) }))
  .filter((s) => s.score > 0)
  .sort((a, b) => b.score - a.score);

if (scored.length === 0) {
  console.error(
    `\nNo album found matching "${albumFolder}" in photos.ts.\n` +
      `Available albums: ${albumTitles.join(', ')}`,
  );
  process.exit(1);
}

const targetTitle = scored[0].title;

if (scored.length > 1 && scored[0].score === scored[1].score) {
  console.warn(
    `\nAmbiguous match for "${albumFolder}". Candidates: ${scored.map((s) => `"${s.title}" (${s.score})`).join(', ')}`,
  );
  console.warn(`Using best match: "${targetTitle}"\n`);
}

console.log(`Updating gradient for album "${targetTitle}"...`);

// Replace the gradient value for the target album
const gradientStr = `gradient: ['${hexColors[0]}', '${hexColors[1]}', '${hexColors[2]}']`;

// Find and replace the gradient line in the target album's block
const escapedTitle = targetTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const albumGradientRegex = new RegExp(
  `(title:\\s*'${escapedTitle}'[\\s\\S]*?)gradient:\\s*\\[[^\\]]*\\]`,
);

if (!albumGradientRegex.test(photosContent)) {
  console.error(`\nCould not find gradient field for album "${targetTitle}".`);
  process.exit(1);
}

const updatedContent = photosContent.replace(
  albumGradientRegex,
  `$1${gradientStr}`,
);

fs.writeFileSync(PHOTOS_TS, updatedContent, 'utf-8');
console.log(
  `\nDone! Updated gradient for "${targetTitle}" to: [${hexColors.join(', ')}]`,
);
