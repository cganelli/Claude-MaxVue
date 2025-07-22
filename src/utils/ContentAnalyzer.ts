// ContentAnalyzer.ts
// Location: src/utils/ContentAnalyzer.ts
// Purpose: Analyze element content type for selective enhancement in Layer 3 processing
// Follows CLAUDE.md and project best practices

export class ContentAnalyzer {
  /**
   * Analyze element content type for selective enhancement
   */
  analyzeContentType(element: HTMLElement): 'text-heavy' | 'image-heavy' | 'mixed-content' {
    const images = element.querySelectorAll('img, video, canvas, svg, picture');
    const textContent = this.getTextContent(element);
    const imageArea = this.calculateImageArea(images);
    const elementArea = element.offsetWidth * element.offsetHeight;
    
    // Calculate ratios
    const imageRatio = imageArea / elementArea;
    const textLength = textContent.length;
    
    // Classification logic
    if (imageRatio > 0.4) {
      return 'image-heavy'; // >40% image area
    } else if (textLength > 50 && imageRatio < 0.1) {
      return 'text-heavy'; // Significant text, minimal images
    } else {
      return 'mixed-content'; // Balanced content
    }
  }
  
  private getTextContent(element: HTMLElement): string {
    // Get all text content, excluding script/style tags
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let textContent = '';
    let node;
    while (node = walker.nextNode()) {
      textContent += node.textContent || '';
    }
    
    return textContent.trim();
  }
  
  private calculateImageArea(images: NodeListOf<Element>): number {
    let totalArea = 0;
    images.forEach(img => {
      const element = img as HTMLElement;
      totalArea += element.offsetWidth * element.offsetHeight;
    });
    return totalArea;
  }
  
  /**
   * Check if element is primarily text-based
   */
  isTextElement(element: HTMLElement): boolean {
    const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'ARTICLE', 'SECTION'];
    const tagName = element.tagName.toUpperCase();
    
    // Direct text tags
    if (textTags.includes(tagName)) {
      return !this.containsImages(element);
    }
    
    // Check content ratio
    return this.analyzeContentType(element) === 'text-heavy';
  }
  
  private containsImages(element: HTMLElement): boolean {
    const images = element.querySelectorAll('img, video, canvas, svg, picture');
    return images.length > 0;
  }
} 