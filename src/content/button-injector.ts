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
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.382.054.77.113 1.157.18C21.082 6.88 22 8.006 22 9.25v7.5c0 1.244-.978 2.37-2.234 2.581a48.927 48.927 0 01-1.157.18c-.465.067-.87.327-1.11.71l-.821 1.317a2.742 2.742 0 01-2.332 1.39 49.539 49.539 0 00-5.312 0 2.742 2.742 0 01-2.332-1.39l-.821-1.317c-.24-.383-.645-.643-1.11-.71a48.935 48.935 0 00-1.157-.18C3.918 19.12 3 17.996 3 16.75v-7.5c0-1.244.978-2.37 2.234-2.581a48.94 48.94 0 011.157-.18c.465-.067.87-.327 1.11-.71l.821-1.317a2.742 2.742 0 012.332-1.39zM12 15a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
    `;
  }
}
