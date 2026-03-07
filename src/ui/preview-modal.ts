import { copyImageToClipboard, downloadImage, generateFilename } from '../utils/image-helpers';

export class PreviewModal {
  private modal: HTMLElement | null = null;
  private shadowHost: HTMLElement | null = null;
  private handleEscapeKey: ((e: KeyboardEvent) => void) | null = null;

  show(imageDataUrl: string): void {
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

  private createModal(imageDataUrl: string): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'xcapture-modal';
    
    modal.innerHTML = `
      <div class="xcapture-overlay"></div>
      <div class="xcapture-content">
        <div class="xcapture-header">
          <h2>截图预览</h2>
          <button class="xcapture-close">&times;</button>
        </div>
        <div class="xcapture-image-container">
          <img src="${imageDataUrl}" alt="Tweet Screenshot" />
        </div>
        <div class="xcapture-actions">
          <button class="xcapture-btn xcapture-copy">复制到剪贴板</button>
          <button class="xcapture-btn xcapture-download">下载图片</button>
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

    closeBtn?.addEventListener('click', () => this.close());

    copyBtn?.addEventListener('click', async () => {
      const success = await copyImageToClipboard(imageDataUrl);
      if (success) {
        this.showToast('✓ 图片已复制到剪贴板', 'success');
      } else {
        this.showToast('✗ 复制失败，请重试', 'error');
      }
    });

    downloadBtn?.addEventListener('click', () => {
      downloadImage(imageDataUrl, generateFilename());
      this.showToast('✓ 图片已开始下载', 'success');
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
      }

      .xcapture-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
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

      .xcapture-copy {
        background-color: #1da1f2;
        color: white;
      }

      .xcapture-copy:hover {
        background-color: #1a91da;
      }

      .xcapture-download {
        background-color: #14171a;
        color: white;
      }

      .xcapture-download:hover {
        background-color: #0f1316;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    modal.appendChild(styleSheet);
  }
}
