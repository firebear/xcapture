import { TweetDetector } from './tweet-detector';
import { ButtonInjector } from './button-injector';
import { ScreenshotCapture } from './screenshot';
import { PreviewModal } from '../ui/preview-modal';

class XCapture {
  private detector: TweetDetector;
  private injector: ButtonInjector;
  private capture: ScreenshotCapture;

  constructor() {
    this.detector = new TweetDetector();
    this.injector = new ButtonInjector();
    this.capture = new ScreenshotCapture();
  }

  async init(): Promise<void> {
    await this.detector.start((tweet) => {
      this.handleTweet(tweet);
    });
  }

  private handleTweet(tweet: HTMLElement): void {
    this.injector.inject(tweet, () => {
      this.handleScreenshot(tweet);
    });
  }

  private showLoading(): HTMLElement {
    const loading = document.createElement('div');
    loading.id = 'xcapture-loading';
    loading.innerHTML = `
      <div class="xcapture-loading-content">
        <div class="xcapture-spinner"></div>
        <div class="xcapture-loading-text">正在生成截图...</div>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      #xcapture-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.2s ease-in;
      }
      
      .xcapture-loading-content {
        text-align: center;
        color: white;
      }
      
      .xcapture-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: #1da1f2;
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 1s linear infinite;
      }
      
      .xcapture-loading-text {
        font-size: 18px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    
    loading.appendChild(style);
    document.body.appendChild(loading);
    return loading;
  }

  private hideLoading(loading: HTMLElement): void {
    if (loading && loading.parentElement) {
      loading.remove();
    }
  }

  private async handleScreenshot(tweet: HTMLElement): Promise<void> {
    const loading = this.showLoading();
    
    try {
      const imageDataUrl = await this.capture.capture(tweet);
      this.hideLoading(loading);

      const modal = new PreviewModal();
      modal.show(imageDataUrl);
    } catch (error) {
      this.hideLoading(loading);
      console.error('Failed to capture screenshot:', error);
      alert('截图失败，请重试');
    }
  }
}

const xcapture = new XCapture();
xcapture.init();
