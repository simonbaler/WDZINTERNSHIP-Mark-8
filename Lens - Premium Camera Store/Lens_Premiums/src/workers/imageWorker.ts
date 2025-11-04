// This is a TypeScript Web Worker
// Handles image processing tasks like resizing, compression, and similarity search

type ImageData = {
  imageUrl: string;
  url: string;
  width?: number;
  height?: number;
  quality?: number;
};

// Function to load an image from URL or Blob
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Function to get average color from image data
function getAverageColor(imageData: ImageData[]): Promise<string[]> {
  return Promise.all(
    imageData.map(async (data) => {
      const img = await loadImage(data.url);
      const canvas = new OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${r},${g},${b})`;
    })
  );
}

// Function to resize images
async function resizeImages(imageData: ImageData[]): Promise<Blob[]> {
  return Promise.all(
    imageData.map(async ({ imageUrl, width = 800, height = 600 }) => {
      const img = await loadImage(imageUrl);
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0, width, height);
      return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
    })
  );
}

// Function to calculate image similarity
async function calculateImageSimilarity(source: string, targets: string[]): Promise<number[]> {
  const sourceImg = await loadImage(source);
  const targetImgs = await Promise.all(targets.map(loadImage));

  // Simple pixel comparison (in practice, use more sophisticated algorithms)
  const canvas = new OffscreenCanvas(64, 64); // Thumbnail size for comparison
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Get source image data
  ctx.drawImage(sourceImg, 0, 0, 64, 64);
  const sourceData = ctx.getImageData(0, 0, 64, 64).data;

  return targetImgs.map(targetImg => {
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(targetImg, 0, 0, 64, 64);
    const targetData = ctx.getImageData(0, 0, 64, 64).data;

    // Calculate similarity score
    let diff = 0;
    for (let i = 0; i < sourceData.length; i += 4) {
      diff += Math.abs(sourceData[i] - targetData[i]) +
              Math.abs(sourceData[i + 1] - targetData[i + 1]) +
              Math.abs(sourceData[i + 2] - targetData[i + 2]);
    }

    // Convert to similarity score (0-1)
    return 1 - (diff / (256 * 3 * 64 * 64));
  });
}

// Listen for messages from the main thread
self.addEventListener('message', async (e: MessageEvent) => {
  try {
    const { type, data } = e.data;

    switch (type) {
      case 'resize':
        const resizedImages = await resizeImages(data);
        self.postMessage({ type: 'resize', data: resizedImages });
        break;

      case 'average-color':
        const colors = await getAverageColor(data);
        self.postMessage({ type: 'average-color', data: colors });
        break;

      case 'similarity':
        const { source, targets } = data;
        const similarities = await calculateImageSimilarity(source, targets);
        self.postMessage({ type: 'similarity', data: similarities });
        break;

      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
});