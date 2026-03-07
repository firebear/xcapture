import { toPng } from 'html-to-image';
import { cloneElementWithStyles } from '../utils/dom-helpers';

export class ScreenshotCapture {
  async capture(tweet: HTMLElement): Promise<string> {
    const clone = this.prepareClone(tweet);
    
    const container = this.createContainer(clone);
    document.body.appendChild(container);
    
    try {
      const dataUrl = await toPng(container, {
        pixelRatio: 2,
        quality: 1.0,
        backgroundColor: '#ffffff',
      });
      
      return dataUrl;
    } finally {
      document.body.removeChild(container);
    }
  }

  private prepareClone(tweet: HTMLElement): HTMLElement {
    const clone = cloneElementWithStyles(tweet);
    return clone;
  }

  private createContainer(content: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 600px;
      background: white;
      z-index: -9999;
    `;
    container.appendChild(content);
    return container;
  }
}
