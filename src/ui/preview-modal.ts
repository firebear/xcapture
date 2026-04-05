import { copyImageToClipboard, downloadImage, generateFilename, getImageDimensions, isLongImage, splitImage } from '../utils/image-helpers';
import { t, getLocale, setLocale, onLocaleChange } from '../i18n';

export class PreviewModal {
  private modal: HTMLElement | null = null;
  private shadowHost: HTMLElement | null = null;
  private handleEscapeKey: ((e: KeyboardEvent) => void) | null = null;
  private imageDataUrl: string = '';
  private slices: string[] | null = null;

  show(imageDataUrl: string): void {
    this.imageDataUrl = imageDataUrl;
    this.modal = this.createModal(imageDataUrl);
    this.shadowHost = document.createElement('div');
    const shadow = this.shadowHost.attachShadow({ mode: 'closed' });
    shadow.appendChild(this.modal);
    document.body.appendChild(this.shadowHost);

    this.handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.handleEscapeKey);

    onLocaleChange(() => this.refreshUI());

    this.checkLongImage(imageDataUrl);
  }

  close(): void {
    if (this.handleEscapeKey) {
      document.removeEventListener('keydown', this.handleEscapeKey);
      this.handleEscapeKey = null;
    }
    if (this.shadowHost && this.shadowHost.parentElement) {
      this.shadowHost.remove();
      this.modal = null;
      this.shadowHost = null;
    }
  }

  private refreshUI(): void {
    if (!this.modal) return;

    // Update language toggle button
    const langBtn = this.modal.querySelector('.xcapture-lang') as HTMLElement;
    if (langBtn) langBtn.textContent = t('lang.toggle');

    if (this.slices) {
      // Update split view texts
      const header = this.modal.querySelector('.xcapture-header h2');
      if (header) header.textContent = t('preview.titleSplit', { count: this.slices.length });

      this.modal.querySelectorAll('.xcapture-slice').forEach((sliceEl, index) => {
        const label = sliceEl.querySelector('.xcapture-slice-label');
        if (label) label.textContent = t('preview.sliceLabel', { index: index + 1, total: this.slices!.length });

        const copyBtn = sliceEl.querySelector('.xcapture-copy');
        if (copyBtn) copyBtn.textContent = t('preview.sliceCopy', { index: index + 1, total: this.slices!.length });

        const downloadBtn = sliceEl.querySelector('.xcapture-download');
        if (downloadBtn) downloadBtn.textContent = t('preview.sliceDownload');
      });

      const downloadAllBtn = this.modal.querySelector('.xcapture-download-all');
      if (downloadAllBtn) downloadAllBtn.textContent = t('preview.downloadAll', { count: this.slices.length });
    } else {
      // Update single image view texts
      const header = this.modal.querySelector('.xcapture-header h2');
      if (header) header.textContent = t('preview.title');

      const copyBtn = this.modal.querySelector('.xcapture-copy');
      if (copyBtn) copyBtn.textContent = t('preview.copy');

      const downloadBtn = this.modal.querySelector('.xcapture-download');
      if (downloadBtn) downloadBtn.textContent = t('preview.download');

      const splitBtn = this.modal.querySelector('.xcapture-split') as HTMLButtonElement;
      if (splitBtn && !splitBtn.disabled) splitBtn.textContent = t('preview.split');
    }
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    if (!this.modal) return;

    const toast = document.createElement('div');
    toast.className = `xcapture-toast xcapture-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      z-index: 10001;
      animation: slideIn 0.3s ease-out;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;

    const styleAnim = document.createElement('style');
    styleAnim.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    this.modal.appendChild(styleAnim);
    this.modal.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  private async checkLongImage(imageDataUrl: string): Promise<void> {
    if (!this.modal) return;

    const { width, height } = await getImageDimensions(imageDataUrl);
    if (!isLongImage(width, height)) return;

    const actions = this.modal.querySelector('.xcapture-actions');
    if (!actions) return;

    const splitBtn = document.createElement('button');
    splitBtn.className = 'xcapture-btn xcapture-split';
    splitBtn.textContent = t('preview.split');

    splitBtn.addEventListener('click', async () => {
      splitBtn.disabled = true;
      splitBtn.textContent = t('preview.splitting');
      try {
        const slices = await splitImage(imageDataUrl);
        this.slices = slices;
        this.showSplitResult(slices);
      } catch {
        this.showToast(t('preview.splitFailed'), 'error');
        splitBtn.disabled = false;
        splitBtn.textContent = t('preview.split');
      }
    });

    actions.appendChild(splitBtn);
  }

  private showSplitResult(slices: string[]): void {
    if (!this.modal) return;

    const content = this.modal.querySelector('.xcapture-content');
    if (!content) return;

    const header = content.querySelector('.xcapture-header h2');
    if (header) {
      header.textContent = t('preview.titleSplit', { count: slices.length });
    }

    const imageContainer = content.querySelector('.xcapture-image-container');
    const actions = content.querySelector('.xcapture-actions');
    if (imageContainer) imageContainer.remove();
    if (actions) actions.remove();

    const slicesContainer = document.createElement('div');
    slicesContainer.className = 'xcapture-slices-container';

    slices.forEach((slice, index) => {
      const sliceEl = document.createElement('div');
      sliceEl.className = 'xcapture-slice';

      const label = document.createElement('div');
      label.className = 'xcapture-slice-label';
      label.textContent = t('preview.sliceLabel', { index: index + 1, total: slices.length });

      const imgContainer = document.createElement('div');
      imgContainer.className = 'xcapture-image-container xcapture-slice-image';
      const img = document.createElement('img');
      img.src = slice;
      img.alt = `Slice ${index + 1}`;
      imgContainer.appendChild(img);

      const sliceActions = document.createElement('div');
      sliceActions.className = 'xcapture-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'xcapture-btn xcapture-copy';
      copyBtn.textContent = t('preview.sliceCopy', { index: index + 1, total: slices.length });
      copyBtn.addEventListener('click', async () => {
        const success = await copyImageToClipboard(slice);
        this.showToast(
          success ? t('toast.sliceCopied', { index: index + 1 }) : t('toast.sliceCopyFailed'),
          success ? 'success' : 'error'
        );
      });

      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'xcapture-btn xcapture-download';
      downloadBtn.textContent = t('preview.sliceDownload');
      downloadBtn.addEventListener('click', () => {
        downloadImage(slice, generateFilename(`${index + 1}`));
        this.showToast(t('toast.sliceDownloading', { index: index + 1 }), 'success');
      });

      sliceActions.appendChild(copyBtn);
      sliceActions.appendChild(downloadBtn);

      sliceEl.appendChild(label);
      sliceEl.appendChild(imgContainer);
      sliceEl.appendChild(sliceActions);
      slicesContainer.appendChild(sliceEl);
    });

    const downloadAllActions = document.createElement('div');
    downloadAllActions.className = 'xcapture-actions xcapture-download-all-actions';
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.className = 'xcapture-btn xcapture-download-all';
    downloadAllBtn.textContent = t('preview.downloadAll', { count: slices.length });
    downloadAllBtn.addEventListener('click', () => {
      slices.forEach((slice, index) => {
        downloadImage(slice, generateFilename(`${index + 1}`));
      });
      this.showToast(t('toast.downloadAll', { count: slices.length }), 'success');
    });
    downloadAllActions.appendChild(downloadAllBtn);

    const closeBtn = content.querySelector('.xcapture-header');
    if (closeBtn && closeBtn.nextSibling) {
      content.insertBefore(slicesContainer, closeBtn.nextSibling);
      slicesContainer.after(downloadAllActions);
    } else {
      content.appendChild(slicesContainer);
      content.appendChild(downloadAllActions);
    }
  }

  private createModal(imageDataUrl: string): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'xcapture-modal';

    modal.innerHTML = `
      <div class="xcapture-overlay"></div>
      <div class="xcapture-content">
        <div class="xcapture-header">
          <h2>${t('preview.title')}</h2>
          <div class="xcapture-header-actions">
            <button class="xcapture-lang">${t('lang.toggle')}</button>
            <button class="xcapture-close">&times;</button>
          </div>
        </div>
        <div class="xcapture-image-container">
          <img src="${imageDataUrl}" alt="Tweet Screenshot" />
        </div>
        <div class="xcapture-actions">
          <button class="xcapture-btn xcapture-copy">${t('preview.copy')}</button>
          <button class="xcapture-btn xcapture-download">${t('preview.download')}</button>
        </div>
      </div>
    `;

    this.attachEventListeners(modal, imageDataUrl);
    this.injectStyles(modal);

    return modal;
  }

  private attachEventListeners(modal: HTMLElement, imageDataUrl: string): void {
    const closeBtn = modal.querySelector('.xcapture-close');
    const copyBtn = modal.querySelector('.xcapture-copy');
    const downloadBtn = modal.querySelector('.xcapture-download');
    const langBtn = modal.querySelector('.xcapture-lang');

    closeBtn?.addEventListener('click', () => this.close());

    langBtn?.addEventListener('click', () => {
      setLocale(getLocale() === 'zh' ? 'en' : 'zh');
    });

    copyBtn?.addEventListener('click', async () => {
      const success = await copyImageToClipboard(imageDataUrl);
      if (success) {
        this.showToast(t('toast.copied'), 'success');
      } else {
        this.showToast(t('toast.copyFailed'), 'error');
      }
    });

    downloadBtn?.addEventListener('click', () => {
      downloadImage(imageDataUrl, generateFilename());
      this.showToast(t('toast.downloading'), 'success');
    });
  }

  private injectStyles(modal: HTMLElement): void {
    const styles = `
      .xcapture-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      .xcapture-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
      }

      .xcapture-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .xcapture-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e1e8ed;
        position: sticky;
        top: 0;
        background: white;
        border-radius: 16px 16px 0 0;
        z-index: 1;
      }

      .xcapture-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }

      .xcapture-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .xcapture-lang {
        background: #f0f0f0;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        color: #333;
        transition: background-color 0.2s;
      }

      .xcapture-lang:hover {
        background: #e0e0e0;
      }

      .xcapture-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #657786;
        padding: 0;
        line-height: 1;
      }

      .xcapture-close:hover {
        color: #1da1f2;
      }

      .xcapture-image-container {
        padding: 20px;
        max-height: 60vh;
        overflow: auto;
      }

      .xcapture-image-container img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      .xcapture-actions {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid #e1e8ed;
      }

      .xcapture-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 9999px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .xcapture-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .xcapture-copy {
        background-color: #1da1f2;
        color: white;
      }

      .xcapture-copy:hover:not(:disabled) {
        background-color: #1a91da;
      }

      .xcapture-download {
        background-color: #14171a;
        color: white;
      }

      .xcapture-download:hover:not(:disabled) {
        background-color: #0f1316;
      }

      .xcapture-split {
        background-color: #7856ff;
        color: white;
      }

      .xcapture-split:hover:not(:disabled) {
        background-color: #6344d9;
      }

      .xcapture-slices-container {
        padding: 0 20px 20px;
      }

      .xcapture-slice {
        margin-bottom: 24px;
        border: 1px solid #e1e8ed;
        border-radius: 12px;
        overflow: hidden;
      }

      .xcapture-slice:last-child {
        margin-bottom: 0;
      }

      .xcapture-slice-label {
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        color: #657786;
        background: #f7f9fa;
        border-bottom: 1px solid #e1e8ed;
      }

      .xcapture-slice-image {
        max-height: none;
        padding: 12px;
      }

      .xcapture-slice .xcapture-actions {
        border-top: 1px solid #e1e8ed;
        padding: 12px 16px;
      }

      .xcapture-download-all-actions {
        padding: 16px 20px;
        border-top: none;
        position: sticky;
        bottom: 0;
        background: white;
        border-radius: 0 0 16px 16px;
      }

      .xcapture-download-all {
        background-color: #10b981;
        color: white;
      }

      .xcapture-download-all:hover:not(:disabled) {
        background-color: #059669;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    modal.appendChild(styleSheet);
  }
}
