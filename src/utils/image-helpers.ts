export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateFilename(suffix?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return suffix ? `xcapture-${timestamp}-${suffix}.png` : `xcapture-${timestamp}.png`;
}

export const SPLIT_ASPECT_RATIO = 16 / 9; // ≈ 1.778, optimized for screen viewing

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function isLongImage(width: number, height: number): boolean {
  return height / width > SPLIT_ASPECT_RATIO;
}

export async function splitImage(dataUrl: string): Promise<string[]> {
  const { width, height } = await getImageDimensions(dataUrl);
  const maxSliceHeight = Math.floor(width * SPLIT_ASPECT_RATIO);
  const sliceCount = Math.ceil(height / maxSliceHeight);
  const results: string[] = [];

  const img = await loadImage(dataUrl);

  for (let i = 0; i < sliceCount; i++) {
    const sy = i * maxSliceHeight;
    const sh = Math.min(maxSliceHeight, height - sy);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = sh;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, sy, width, sh, 0, 0, width, sh);
    drawWatermark(ctx, width, sh);
    results.push(canvas.toDataURL('image/png'));
  }

  return results;
}

function drawWatermark(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
  const text = 'captured by XCapture Chrome extension';
  const fontSize = Math.max(12, Math.floor(canvasWidth / 60));
  const padding = fontSize;

  ctx.save();
  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(text, canvasWidth - padding, canvasHeight - padding);
  ctx.restore();
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}
