// Enhanced content detection that excludes UI elements
// Purpose: Intelligently target content elements while excluding UI components
// Location: src/utils/ContentTargeting.ts

export interface ContentTargetingConfig {
  includeSelectors: string[];
  excludeSelectors: string[];
  excludeClasses: string[];
  excludeRoles: string[];
  minTextLength: number;
}

export class ContentTargeting {
  private config: ContentTargetingConfig = {
    includeSelectors: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'span', 'div', 'li', 'td', 'th',
      'article', 'section', 'main',
      '[role="main"]', '[role="article"]', '[role="region"]'
    ],
    excludeSelectors: [
      // Core UI elements
      'button', 'input', 'select', 'textarea', 'a[role="button"]',
      'nav', 'header', 'footer', 'aside',
      // UI component classes
      '.btn', '.button', '.nav', '.navbar',
      '.header', '.footer', '.sidebar',
      '.menu', '.dropdown', '.modal',
      '.tooltip', '.popover', '.alert',
      '.control', '.widget', '.toolbar',
      // ARIA roles for UI
      '[role="button"]', '[role="navigation"]',
      '[role="banner"]', '[role="contentinfo"]',
      '[role="complementary"]', '[role="dialog"]',
      '[role="menubar"]', '[role="menu"]', '[role="tab"]'
    ],
    excludeClasses: [
      'ui-element', 'control', 'widget',
      'navigation', 'menu-item', 'toolbar',
      'status-bar', 'tab', 'accordion',
      'carousel', 'slider', 'progress',
      'btn', 'button'
    ],
    excludeRoles: [
      'button', 'navigation', 'banner', 
      'contentinfo', 'complementary', 'dialog',
      'alertdialog', 'menubar', 'menu', 'menuitem',
      'tab', 'tablist', 'tabpanel', 'toolbar'
    ],
    minTextLength: 10
  };

  public isContentElement(element: Element): boolean {
    // Quick exclude check - UI elements (this will catch the 13 buttons)
    if (this.isUIElement(element)) {
      console.log(`❌ Excluded UI element: ${element.tagName}.${element.className}`);
      return false;
    }

    // Check if element matches content selectors
    const matchesInclude = this.config.includeSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });

    if (!matchesInclude) {
      return false;
    }

    // Check text content length
    const textContent = element.textContent?.trim() || '';
    if (textContent.length < this.config.minTextLength) {
      return false;
    }

    // Additional content validation
    return this.hasReadableContent(element);
  }

  private isUIElement(element: Element): boolean {
    // Check tag names (this will catch button elements specifically)
    const tagName = element.tagName.toLowerCase();
    if (['button', 'input', 'select', 'textarea'].includes(tagName)) {
      console.log(`🚫 Excluding ${tagName} element`);
      return true;
    }

    // Check for button-like elements
    if (element.getAttribute('role') === 'button' || 
        element.classList.contains('btn') || 
        element.classList.contains('button')) {
      console.log(`🚫 Excluding button-like element: ${element.tagName}`);
      return true;
    }

    // Check exclude selectors
    const matchesExclude = this.config.excludeSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });

    if (matchesExclude) {
      return true;
    }

    // Check parent context - if inside UI container
    const uiParent = element.closest('nav, header, footer, .navbar, .menu, [role="navigation"], [role="banner"]');
    if (uiParent) {
      console.log(`🚫 Excluding element inside UI container: ${uiParent.tagName}`);
      return true;
    }

    return false;
  }

  private hasReadableContent(element: Element): boolean {
    const text = element.textContent?.trim() || '';
    
    // Must have meaningful text
    if (text.length < this.config.minTextLength) {
      return false;
    }

    // Exclude common UI text patterns
    const uiPatterns = [
      /^(click|button|menu|nav|home|login|logout|submit|cancel|close|back|next|prev)$/i,
      /^(search|filter|sort|view|edit|delete|add|remove|save|load)$/i,
      /^(toggle|enable|disable|start|stop|play|pause|reset)$/i
    ];

    if (uiPatterns.some(pattern => pattern.test(text))) {
      console.log(`🚫 Excluding UI text pattern: "${text}"`);
      return false;
    }

    return true;
  }

  public getContentElements(): Element[] {
    const allElements = Array.from(document.querySelectorAll('*'));
    const contentElements = allElements.filter(el => this.isContentElement(el));
    
    console.log(`🎯 Content targeting results:`);
    console.log(`📊 Total elements: ${allElements.length}`);
    console.log(`✅ Content elements: ${contentElements.length}`);
    console.log(`❌ UI elements excluded: ${allElements.length - contentElements.length}`);
    console.log(`🎯 Content ratio: ${(contentElements.length / allElements.length * 100).toFixed(1)}%`);
    
    return contentElements;
  }
}

export const contentTargeting = new ContentTargeting(); 