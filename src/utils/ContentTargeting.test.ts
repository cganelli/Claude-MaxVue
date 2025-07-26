// Test file for ContentTargeting utility
// Purpose: Verify content detection and UI exclusion logic
// Location: src/utils/ContentTargeting.test.ts

import { contentTargeting, ContentTargeting } from './ContentTargeting';

describe('ContentTargeting', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create test container
    container = document.createElement('div');
    container.innerHTML = `
      <div class="presbyopia-enhanced">
        <p>This is actual content that should be enhanced.</p>
        <h2>Another content heading</h2>
        <span>More readable text content here.</span>
      </div>
      
      <button class="btn">Click me</button>
      <nav class="navbar">
        <a href="#" role="button">Home</a>
        <a href="#" role="button">About</a>
      </nav>
      
      <header>
        <h1>Header content</h1>
        <button>Menu</button>
      </header>
      
      <main>
        <article>
          <p class="presbyopia-enhanced">Article content that should be enhanced.</p>
          <div class="presbyopia-enhanced">More article content with longer text that meets the minimum length requirement.</div>
        </article>
      </main>
      
      <footer>
        <p>Footer content</p>
        <button>Contact</button>
      </footer>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should identify content elements correctly', () => {
    const contentElements = contentTargeting.getContentElements();
    
    // Should find content elements
    expect(contentElements.length).toBeGreaterThan(0);
    
    // Should include paragraphs and headings with content
    const hasContentElements = contentElements.some(el => 
      el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2'
    );
    expect(hasContentElements).toBe(true);
  });

  test('should exclude UI elements', () => {
    const contentElements = contentTargeting.getContentElements();
    
    // Should not include buttons
    const hasButtons = contentElements.some(el => el.tagName === 'BUTTON');
    expect(hasButtons).toBe(false);
    
    // Should not include navigation elements
    const hasNav = contentElements.some(el => el.tagName === 'NAV');
    expect(hasNav).toBe(false);
    
    // Should not include elements with button role
    const hasButtonRole = contentElements.some(el => 
      el.getAttribute('role') === 'button'
    );
    expect(hasButtonRole).toBe(false);
  });

  test('should exclude elements inside UI containers', () => {
    const contentElements = contentTargeting.getContentElements();
    
    // Should not include content inside nav
    const navContent = container.querySelector('nav h1');
    if (navContent) {
      const isIncluded = contentElements.includes(navContent);
      expect(isIncluded).toBe(false);
    }
    
    // Should not include content inside header
    const headerContent = container.querySelector('header h1');
    if (headerContent) {
      const isIncluded = contentElements.includes(headerContent);
      expect(isIncluded).toBe(false);
    }
  });

  test('should require minimum text length', () => {
    // Add a short text element
    const shortElement = document.createElement('p');
    shortElement.textContent = 'Short';
    shortElement.className = 'presbyopia-enhanced';
    container.appendChild(shortElement);
    
    const contentElements = contentTargeting.getContentElements();
    const isIncluded = contentElements.includes(shortElement);
    expect(isIncluded).toBe(false);
  });

  test('should work with presbyopia-enhanced class', () => {
    const contentElements = contentTargeting.getContentElements();
    const enhancedElements = Array.from(contentElements).filter(el => 
      el.classList.contains('presbyopia-enhanced')
    );
    
    // Should find enhanced content elements
    expect(enhancedElements.length).toBeGreaterThan(0);
    
    // Should only include content elements (not UI)
    enhancedElements.forEach(el => {
      expect(el.tagName).not.toBe('BUTTON');
      expect(el.getAttribute('role')).not.toBe('button');
    });
  });

  test('should provide detailed logging', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    contentTargeting.getContentElements();
    
    // Should log targeting results
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('🎯 Content targeting results:')
    );
    
    consoleSpy.mockRestore();
  });
}); 