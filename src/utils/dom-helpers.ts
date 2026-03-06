export function waitForElement(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

export function inlineStyles(element: HTMLElement): void {
  const computed = window.getComputedStyle(element);
  const properties = [
    'color',
    'background-color',
    'font-size',
    'font-weight',
    'font-family',
    'line-height',
    'padding',
    'margin',
    'border',
    'border-radius',
    'display',
    'flex-direction',
    'gap',
    'width',
    'height',
  ];

  properties.forEach((prop) => {
    element.style.setProperty(prop, computed.getPropertyValue(prop));
  });
}

export function cloneElementWithStyles(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      inlineStyles(el);
    }
  });
  
  inlineStyles(clone);
  
  return clone;
}
