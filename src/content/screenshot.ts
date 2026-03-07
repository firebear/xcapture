import { toPng } from 'html-to-image';

export class ScreenshotCapture {
  async capture(tweet: HTMLElement): Promise<string> {
    const wrapper = this.createWrapper(tweet);
    const elementsToHide = this.findElementsToHide(tweet);
    const originalStyles = this.hideElements(elementsToHide);
    
    const parent = tweet.parentNode;
    const nextSibling = tweet.nextSibling;
    
    try {
      parent?.insertBefore(wrapper, nextSibling);
      wrapper.appendChild(tweet);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(wrapper, {
        pixelRatio: 2,
        quality: 1.0,
        backgroundColor: '#ffffff',
      });
      
      return dataUrl;
    } finally {
      parent?.insertBefore(tweet, wrapper);
      wrapper.remove();
      this.restoreElements(elementsToHide, originalStyles);
    }
  }

  private createWrapper(tweet: HTMLElement): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 12px;
      max-width: 600px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: inline-block;
    `;
    return wrapper;
  }

  private findElementsToHide(tweet: HTMLElement): HTMLElement[] {
    const selectorsToHide = [
      '[role="group"]',
      '[data-testid="caret"]',
      'button',
    ];

    const elements: HTMLElement[] = [];
    selectorsToHide.forEach((selector) => {
      tweet.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement) {
          elements.push(el);
        }
      });
    });

    return elements;
  }

  private hideElements(elements: HTMLElement[]): Map<HTMLElement, string> {
    const originalStyles = new Map<HTMLElement, string>();
    
    elements.forEach((el) => {
      originalStyles.set(el, el.style.display);
      el.style.display = 'none';
    });

    return originalStyles;
  }

  private restoreElements(
    elements: HTMLElement[],
    originalStyles: Map<HTMLElement, string>
  ): void {
    elements.forEach((el) => {
      const originalDisplay = originalStyles.get(el);
      if (originalDisplay !== undefined) {
        el.style.display = originalDisplay;
      }
    });
  }
}
