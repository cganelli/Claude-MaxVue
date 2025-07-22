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
 * Get foundation status
 */
export const getWeekOneFoundationStatus = () => {
  const enhanced = document.querySelectorAll('.presbyopia-text-enhanced').length;
  const preserved = document.querySelectorAll('.presbyopia-image-preserved').length;
  const total = document.querySelectorAll('.presbyopia-enhanced').length;
  
  return {
    active: total > 0,
    textEnhanced: enhanced,
    imagesPreserved: preserved,
    totalProcessed: total,
    effectiveness: '3.3/10 (estimated)'
  };
}; 