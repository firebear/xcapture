const BUTTON_ID = 'xcapture-button';

export class ButtonInjector {
  private injectedButtons = new Set<HTMLElement>();

  inject(tweet: HTMLElement, onClick: () => void): void {
    if (this.injectedButtons.has(tweet)) {
      return;
    }

    const actionBar = tweet.querySelector('[role="group"]');
    if (!actionBar) {
      return;
    }

    const button = this.createButton(onClick);
    actionBar.appendChild(button);
    this.injectedButtons.add(tweet);
  }

  private createButton(onClick: () => void): HTMLElement {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.innerHTML = this.getSVGIcon();
    button.style.cssText = `
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });

    return button;
  }

  private getSVGIcon(): string {
    return `
      <svg viewBox="0 0 1024 1024" width="18" height="18" fill="rgb(113, 118, 123)">
        <path d="M512 320c-211.2 0-384 170.8-384 384s170.8 384 384 384 0 384-170.8 384-384-170.8-384-384-384z m0 640c-140.8 0-256 115.2-256 256s115.2 256 256 256 256-115.2 256-256-115.2-256-256-256z"/>
        <path d="M640 192H384v-64c0-35.2-28.8-64-64-64H288c-35.2 0-64 28.8-64 64v64c-35.2 0-64 28.8-64 64v448c0 35.2 28.8 64 64 64h448c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64z m-128 448c-105.6 0-192-86.4-192-192s86.4-192 192-192 192 86.4 192 192-86.4 192-192 192z"/>
      </svg>
    `;
  }
}
