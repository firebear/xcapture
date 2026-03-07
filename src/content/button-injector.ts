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
        <path d="M525.184 394.666667a53.333333 53.333333 0 0 0-47.701333 29.482666l-27.946667 55.850667H384A74.666667 74.666667 0 0 0 309.333333 554.666667v266.666666c0 41.216 33.450667 74.666667 74.666667 74.666667h426.666667a74.666667 74.666667 0 0 0 74.666666-74.666667V554.666667A74.666667 74.666667 0 0 0 810.666667 480h-65.578667l-27.904-55.850667a53.333333 53.333333 0 0 0-47.701333-29.482666h-144.298667z m-21.333333 119.850666l27.946666-55.850666h131.072l27.946667 55.850666a53.333333 53.333333 0 0 0 47.701333 29.482667H810.666667a10.666667 10.666667 0 0 1 10.666666 10.666667v266.666666a10.666667 10.666667 0 0 1-10.666666 10.666667H384a10.666667 10.666667 0 0 1-10.666667-10.666667V554.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h72.149333a53.333333 53.333333 0 0 0 47.701334-29.482667z"/>
        <circle cx="597.333333" cy="682.666667" r="85.333333"/>
      </svg>
    `;
  }
}
