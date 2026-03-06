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
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgb(113, 118, 123)">
        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
      </svg>
    `;
  }
}
