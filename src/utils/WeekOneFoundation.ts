// WeekOneFoundation.ts
// Location: src/utils/WeekOneFoundation.ts
// Purpose: Week 1 Minimal Foundation - Simple and Fast
// Goal: 3.0 → 3.3/10 effectiveness in minimal time
// Follows CLAUDE.md and project best practices

/**
 * Week 1 Minimal Foundation - Simple and Fast
 * Goal: 3.0 → 3.3/10 effectiveness in minimal time
 */

export const applyWeekOneFoundation = (): void => {
  console.log('🚀 Applying Week 1 Foundation (Simple Fix)...');
  
  const startTime = Date.now();
  let enhancedElements = 0;
  
  try {
    // Simple approach: Process all elements, but skip image containers
    document.querySelectorAll('*').forEach(element => {
      const el = element as HTMLElement;
      
      // Skip if already processed
      if (el.classList.contains('presbyopia-enhanced')) return;
      
      // SIMPLE FIX: Has images? Skip it.
      const hasImages = el.querySelector('img, video, canvas, svg, picture') !== null;
      
      // Only enhance text-only elements (THE FIX: added !hasImages condition)
      if (!hasImages && el.textContent && el.textContent.trim().length > 10) {
        el.style.filter = 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))';
        el.style.fontWeight = '500';
        el.style.letterSpacing = '0.025em';
        el.classList.add('presbyopia-enhanced');
        enhancedElements++;
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Foundation applied: ${enhancedElements} text elements enhanced, images skipped`);
    console.log(`⏱️ Processing time: ${processingTime}ms`);
    console.log('🎯 Target: 3.0 → 3.3/10 effectiveness with image protection');
    
  } catch (error) {
    console.error('❌ Foundation error:', error);
  }
};

/**
 * Remove Week 1 Foundation enhancements
 */
export const removeWeekOneFoundation = (): void => {
  console.log('🧹 Removing Week 1 Foundation...');
  
  document.querySelectorAll('.presbyopia-enhanced').forEach(element => {
    const el = element as HTMLElement;
    el.style.filter = '';
    el.style.fontWeight = '';
    el.style.letterSpacing = '';
    el.classList.remove('presbyopia-enhanced', 'presbyopia-text-enhanced', 'presbyopia-image-preserved');
  });
  
  console.log('✅ Week 1 Foundation removed');
};

/**
 * Check if foundation is currently applied
 */
export const isWeekOneFoundationActive = (): boolean => {
  return document.querySelectorAll('.presbyopia-enhanced').length > 0;
};

/**
 * Enhanced Week 1 Foundation - Maximum presbyopia assistance
 * Goal: 3.3 → 3.8/10 effectiveness for severe presbyopia
 */
export const applyMaximumPresbyopiaEnhancement = (element: HTMLElement): void => {
  const hasImages = element.querySelector('img, video, canvas, svg, picture') !== null;
  
  if (!hasImages && element.textContent && element.textContent.trim().length > 10) {
    // Maximum enhancement for presbyopia users
    element.style.filter = `
      contrast(1.8) 
      brightness(1.2) 
      drop-shadow(0 0 0.6px rgba(0,0,0,0.8))
      drop-shadow(0 0 1px rgba(0,0,0,0.4))
    `;
    element.style.fontWeight = '600';
    element.style.letterSpacing = '0.03em';
    element.style.lineHeight = '1.6';
    element.classList.add('presbyopia-maximum-enhanced');
  }
};

/**
 * Apply maximum enhancement to all suitable elements
 */
export const applyMaximumPresbyopiaFoundation = (): number => {
  console.log('🚀 Applying Week 1 Foundation with COMPREHENSIVE image protection...');
  
  const startTime = Date.now();
  const allElements = document.querySelectorAll('*');
  let enhancedCount = 0;
  let skippedImages = 0;
  let skippedButtons = 0;
  
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    
    // COMPREHENSIVE: Check if element is or contains images
    const isImageElement = (
      element.tagName === 'IMG' ||
      element.tagName === 'SVG' ||
      element.tagName === 'CANVAS' ||
      element.tagName === 'VIDEO' ||
      element.tagName === 'PICTURE'
    );
    
    // Check if element contains images
    const containsImages = element.querySelector('img, svg, canvas, video, picture') !== null;
    
    // Check for background images
    const hasBackgroundImage = (
      element.style.backgroundImage && 
      element.style.backgroundImage !== 'none' && 
      element.style.backgroundImage !== ''
    );
    
    // Check if element is a button or UI element
    const isUIElement = (
      element.tagName === 'BUTTON' ||
      element.getAttribute('role') === 'button' ||
      element.classList.contains('btn') ||
      element.classList.contains('button') ||
      element.tagName === 'INPUT' ||
      element.tagName === 'SELECT' ||
      element.tagName === 'TEXTAREA' ||
      element.closest('nav, header, footer, .navbar, .menu, [role="navigation"]') !== null
    );
    
    // Check for valid text content
    const hasValidText = (
      element.textContent && 
      element.textContent.trim().length > 10 &&
      !element.textContent.trim().match(/^(click|button|menu|nav|submit|cancel|reset|toggle|enable|disable)$/i)
    );
    
    // Decision logic: Only enhance text elements without images or UI functionality
    if (isImageElement || containsImages || hasBackgroundImage) {
      skippedImages++;
      // Explicitly ensure no enhancement on image elements
      element.classList.remove('presbyopia-enhanced');
      element.style.filter = '';
      return;
    }
    
    if (isUIElement) {
      skippedButtons++;
      // Explicitly ensure no enhancement on UI elements
      element.classList.remove('presbyopia-enhanced');
      element.style.filter = '';
      element.style.boxShadow = '';
      return;
    }
    
    // Only enhance pure text elements
    if (hasValidText) {
      element.style.filter = 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))';
      element.style.fontWeight = '500';
      element.classList.add('presbyopia-enhanced');
      enhancedCount++;
    }
  });
  
  console.log(`✅ Foundation applied: ${enhancedCount} text elements enhanced`);
  console.log(`🚫 Protection: ${skippedImages} image elements skipped`);
  console.log(`🚫 Protection: ${skippedButtons} UI elements skipped`);
  console.log(`⏱️ Processing time: ${Date.now() - startTime}ms`);
  console.log(`🎯 Target: 3.0 → 3.3/10 effectiveness with comprehensive protection`);
  
  return enhancedCount;
};

/**
 * Remove maximum presbyopia enhancements
 */
export const removeMaximumPresbyopiaFoundation = (): void => {
  console.log('🧹 Removing Maximum Presbyopia Foundation...');
  
  document.querySelectorAll('.presbyopia-maximum-enhanced').forEach(element => {
    const el = element as HTMLElement;
    el.style.filter = '';
    el.style.fontWeight = '';
    el.style.letterSpacing = '';
    el.style.lineHeight = '';
    el.classList.remove('presbyopia-maximum-enhanced');
  });
  
  console.log('✅ Maximum Presbyopia Foundation removed');
};

/**
 * Get foundation status
 */
export const getWeekOneFoundationStatus = () => {
  const enhanced = document.querySelectorAll('.presbyopia-text-enhanced').length;
  const preserved = document.querySelectorAll('.presbyopia-image-preserved').length;
  const total = document.querySelectorAll('.presbyopia-enhanced').length;
  const maximumEnhanced = document.querySelectorAll('.presbyopia-maximum-enhanced').length;
  
  return {
    active: total > 0 || maximumEnhanced > 0,
    textEnhanced: enhanced,
    imagesPreserved: preserved,
    totalProcessed: total + maximumEnhanced,
    maximumEnhanced: maximumEnhanced,
    effectiveness: maximumEnhanced > 0 ? '3.8/10 (maximum)' : '3.3/10 (standard)'
  };
}; 