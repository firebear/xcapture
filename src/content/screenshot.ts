import { toPng } from 'html-to-image';

export class ScreenshotCapture {
  async capture(tweet: HTMLElement): Promise<string> {
    const clone = tweet.cloneNode(true) as HTMLElement;

    this.copyEssentialTextStyles(tweet, clone);

    this.removeUnwantedElements(clone);
    await this.inlineImages(clone);
    
    clone.style.backgroundColor = 'white';
    clone.style.padding = '20px';
    clone.style.borderRadius = '12px';
    clone.style.maxWidth = '600px';
    clone.style.opacity = '1';
    clone.style.visibility = 'visible';
    clone.style.display = 'block';
    
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -99999px;
      top: -99999px;
      width: 600px;
      background: white;
      opacity: 0;
      pointer-events: none;
      z-index: 2147483647;
    `;
    container.appendChild(clone);
    document.body.appendChild(container);
    
    // Force layout recalculation
    void container.offsetHeight;
    void clone.offsetHeight;
    
    // Wait for layout to update
    await new Promise(resolve => setTimeout(resolve, 100));

    const bounds = this.calculateCaptureBounds(clone);
    const safeWidth = this.sanitizeCaptureDimension(bounds.width, 600, 'width');
    const safeHeight = this.sanitizeCaptureDimension(Math.max(bounds.height, clone.scrollHeight, clone.offsetHeight), 1200, 'height');
    
    container.style.width = `${safeWidth}px`;
    container.style.height = `${safeHeight}px`;
    clone.style.width = `${safeWidth}px`;
    clone.style.height = 'auto';
    clone.style.minHeight = 'auto';

    // Force another layout recalculation
    void container.offsetHeight;
    void clone.offsetHeight;
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const dataUrl = await toPng(clone, {
        width: safeWidth,
        height: safeHeight,
        pixelRatio: 2,
        quality: 1.0,
        backgroundColor: '#ffffff',
      });
      return dataUrl;
    } catch (error) {
      console.error('[XCapture] Capture failed:', error);
      throw error;
    } finally {
      document.body.removeChild(container);
    }
  }

  private copyEssentialTextStyles(sourceRoot: HTMLElement, cloneRoot: HTMLElement): void {
    const sourceNodes = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll('*'))];
    const cloneNodes = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll('*'))];

    const propsToCopy = [
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-decoration',
      'text-decoration-color',
      'text-decoration-line',
      'text-transform',
      'text-shadow',
      'word-break',
      'white-space',
    ];

    sourceNodes.forEach((sourceNode, index) => {
      const cloneNode = cloneNodes[index];
      if (
        !cloneNode ||
        !(sourceNode instanceof HTMLElement) ||
        !(cloneNode instanceof HTMLElement)
      ) {
        return;
      }

      const sourceStyle = window.getComputedStyle(sourceNode);
      const sourceColor = sourceStyle.getPropertyValue('color');

      if (this.isTextBearingElement(sourceNode)) {
        const normalizedColor = this.normalizeDarkTextColor(sourceColor);
        if (normalizedColor) {
          cloneNode.style.setProperty('color', normalizedColor);
        }
      }

      propsToCopy.forEach((prop) => {
        if (prop === 'color') {
          return;
        }

        const value = sourceStyle.getPropertyValue(prop);
        if (value) {
          cloneNode.style.setProperty(prop, value);
        }
      });

      if (index === 0) {
        cloneNode.style.setProperty('color', '#0f1419', 'important');
      }
    });
  }

  private isTextBearingElement(element: HTMLElement): boolean {
    const tag = element.tagName.toLowerCase();
    const disallowedTags = new Set(['img', 'svg', 'canvas', 'iframe', 'video', 'audio']);

    if (disallowedTags.has(tag)) {
      return false;
    }

    if (element.closest('[data-testid="tweetPhoto"]')) {
      return false;
    }

    if (element.matches('[contenteditable="true"], input, textarea, button')) {
      return false;
    }

    if (element.textContent && element.textContent.trim().length > 0) {
      return true;
    }

    const textTags = new Set([
      'a',
      'abbr',
      'b',
      'blockquote',
      'code',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'i',
      'label',
      'p',
      'pre',
      'q',
      's',
      'span',
      'strong',
      'sub',
      'sup',
      'time',
      'u',
    ]);

    return textTags.has(tag);
  }

  private normalizeDarkTextColor(color: string): string | null {
    if (!color) {
      return null;
    }

    const rgb = this.parseRgb(color);
    if (!rgb) {
      return color;
    }

    const [r, g, b] = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    if (luminance > 160) {
      return '#0f1419';
    }

    return color;
  }

  private parseRgb(color: string): [number, number, number] | null {
    if (color.startsWith('rgb(')) {
      const parts = color
        .replace(/^rgb\((.+)\)$/i, '$1')
        .split(',')
        .map((part) => Number.parseInt(part.trim(), 10));

      if (parts.length >= 3 && parts.every((value) => Number.isFinite(value))) {
        return [parts[0], parts[1], parts[2]];
      }
    }

    if (color.startsWith('rgba(')) {
      const parts = color
        .replace(/^rgba\((.+)\)$/i, '$1')
        .split(',')
        .slice(0, 3)
        .map((part) => Number.parseInt(part.trim(), 10));

      if (parts.length === 3 && parts.every((value) => Number.isFinite(value))) {
        return [parts[0], parts[1], parts[2]];
      }
    }

    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        const r = Number.parseInt(hex[0] + hex[0], 16);
        const g = Number.parseInt(hex[1] + hex[1], 16);
        const b = Number.parseInt(hex[2] + hex[2], 16);
        return [r, g, b];
      }
      if (hex.length === 6) {
        const r = Number.parseInt(hex.slice(0, 2), 16);
        const g = Number.parseInt(hex.slice(2, 4), 16);
        const b = Number.parseInt(hex.slice(4, 6), 16);
        return [r, g, b];
      }
    }

    const rgbFromHsl = color.match(/hsl\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
    if (rgbFromHsl) {
      const h = Number.parseFloat(rgbFromHsl[1]);
      const s = Number.parseFloat(rgbFromHsl[2]) / 100;
      const l = Number.parseFloat(rgbFromHsl[3]) / 100;
      if ([h, s, l].every(Number.isFinite)) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r: number;
        let g: number;
        let b: number;

        if (h >= 0 && h < 60) {
          [r, g, b] = [c, x, 0];
        } else if (h < 120) {
          [r, g, b] = [x, c, 0];
        } else if (h < 180) {
          [r, g, b] = [0, c, x];
        } else if (h < 240) {
          [r, g, b] = [0, x, c];
        } else if (h < 300) {
          [r, g, b] = [x, 0, c];
        } else {
          [r, g, b] = [c, 0, x];
        }

        return [
          Math.round((r + m) * 255),
          Math.round((g + m) * 255),
          Math.round((b + m) * 255),
        ];
      }
    }

    return null;
  }

  private removeUnwantedElements(clone: HTMLElement): void {
    const selectorsToRemove = [
      '[data-testid="caret"]',
      '[data-testid="socialContext"]',
    ];

    selectorsToRemove.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((element) => {
        if (element instanceof HTMLElement) {
          element.remove();
        }
      });
    });
  }
  
  private async inlineImages(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll('img');
    const promises: Promise<void>[] = [];
    
    images.forEach((img) => {
      const src = img.src;
      if (src && !src.startsWith('data:')) {
        promises.push(this.convertImageToBase64(src).then(base64 => {
          img.src = base64;
        }).catch(error => {
          console.warn('[XCapture] Failed to convert img:', src.substring(0, 100), error);
        }));
      }
    });
    
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const bgImage = el.style.backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
          const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
          if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith('data:')) {
            const url = urlMatch[1];
            promises.push(this.convertImageToBase64(url).then(base64 => {
              el.style.backgroundImage = `url(${base64})`;
            }).catch(error => {
              console.warn('[XCapture] Failed to convert background image:', url.substring(0, 100), error);
            }));
          }
        }
      }
    });
    
    await Promise.all(promises);
    
    // Wait for all images to load
    await this.waitForImagesToLoad(element);
  }
  
  private async waitForImagesToLoad(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll('img');
    const loadPromises: Promise<void>[] = [];
    
    images.forEach((img, index) => {
      if (img.complete && img.naturalHeight !== 0) {
        return;
      }
      
      loadPromises.push(new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn(`[XCapture] img[${index}] load timeout`);
          resolve();
        }, 2000);
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn(`[XCapture] img[${index}] load error`);
          resolve();
        };
      }));
    });
    
    await Promise.all(loadPromises);
  }
  
  private calculateCaptureBounds(element: HTMLElement): { width: number; height: number } {
    const rootRect = element.getBoundingClientRect();
    const safeRootWidth = Number.isFinite(rootRect.width) ? rootRect.width : 0;
    const safeRootHeight = Number.isFinite(rootRect.height) ? rootRect.height : 0;
    let maxBottomFromRects = safeRootHeight;
    let maxRightFromRects = safeRootWidth;

    element.querySelectorAll('*').forEach((child) => {
      if (child instanceof HTMLElement) {
        const rect = child.getBoundingClientRect();
        const left = rect.left - rootRect.left;
        const top = rect.top - rootRect.top;

        if (
          Number.isFinite(rect.width) && Number.isFinite(rect.height)
          && Number.isFinite(left) && Number.isFinite(top)
          && rect.width < 5000 && rect.height < 5000
          && Math.abs(left) < 5000 && Math.abs(top) < 5000
        ) {
          maxRightFromRects = Math.max(maxRightFromRects, left + rect.width);
          maxBottomFromRects = Math.max(maxBottomFromRects, top + rect.height);
        }
      }
    });

    const width = Math.max(
      1,
      Math.ceil(maxRightFromRects),
      Math.ceil(element.offsetWidth),
      Math.ceil(safeRootWidth)
    );

    const height = Math.max(
      1,
      Math.ceil(maxBottomFromRects),
      Math.ceil(element.scrollHeight),
      Math.ceil(element.offsetHeight),
      Math.ceil(safeRootHeight)
    );

    return { width, height };
  }

  private sanitizeCaptureDimension(value: number, fallback: number, axis: 'width' | 'height'): number {
    const max = axis === 'width' ? 1200 : 12000;

    if (!Number.isFinite(value)) {
      console.warn(`[XCapture] Invalid ${axis} bound ${value}, using fallback ${fallback}`);
      return fallback;
    }

    if (value <= 0) {
      console.warn(`[XCapture] Non-positive ${axis} bound ${value}, using fallback ${fallback}`);
      return fallback;
    }

    if (value > max) {
      console.warn(`[XCapture] Oversized ${axis} bound ${value}, clamped to ${max}`);
      return max;
    }

    return Math.round(value);
  }

  private async convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }
}
