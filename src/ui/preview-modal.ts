import { copyImageToClipboard, downloadImage, generateFilename } from '../utils/image-helpers';

export class PreviewModal {
  private modal: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;

  show(imageDataUrl: string): void {
    this.modal = this.createModal(imageDataUrl);
    const shadowHost = document.createElement('div');
    this.shadow = shadowHost.attachShadow({ mode: 'closed' });
    this.shadow.appendChild(this.modal);
    document.body.appendChild(shadowHost);
  }

  close(): void {
    if (this.modal && this.modal.parentElement) {
      this.modal.parentElement.remove();
      this.modal = null;
      this.shadow = null;
    }
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
    const overlay = modal.querySelector('.xcapture-overlay');
    const copyBtn = modal.querySelector('.xcapture-copy');
    const downloadBtn = modal.querySelector('.xcapture-download');

    const handleClose = () => this.close();
    closeBtn?.addEventListener('click', handleClose);
    overlay?.addEventListener('click', handleClose);

    copyBtn?.addEventListener('click', async () => {
      const success = await copyImageToClipboard(imageDataUrl);
      if (success) {
        alert('图片已复制到剪贴板！');
        this.close();
      } else {
        alert('复制失败，请重试');
      }
    });

    downloadBtn?.addEventListener('click', () => {
      downloadImage(imageDataUrl, generateFilename());
      this.close();
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
