import { waitForElement } from '../utils/dom-helpers';

export class TweetDetector {
  private observer: MutationObserver | null = null;
  private processedTweets = new Set<HTMLElement>();

  async start(callback: (tweet: HTMLElement) => void): Promise<void> {
    await waitForElement('[data-testid="primaryColumn"]');
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.findTweets(node, callback);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const existingTweets = document.querySelectorAll('[data-testid="tweet"]');
    existingTweets.forEach((tweet) => {
      if (tweet instanceof HTMLElement) {
        callback(tweet);
      }
    });
  }

  private findTweets(
    root: HTMLElement,
    callback: (tweet: HTMLElement) => void
  ): void {
    const tweets = root.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
      if (
        tweet instanceof HTMLElement &&
        !this.processedTweets.has(tweet)
      ) {
        this.processedTweets.add(tweet);
        callback(tweet);
      }
    });
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.processedTweets.clear();
  }
}
