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

  private async handleScreenshot(tweet: HTMLElement): Promise<void> {
    try {
      const imageDataUrl = await this.capture.capture(tweet);
      const modal = new PreviewModal();
      modal.show(imageDataUrl);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('截图失败，请重试');
    }
  }
}

const xcapture = new XCapture();
xcapture.init();
