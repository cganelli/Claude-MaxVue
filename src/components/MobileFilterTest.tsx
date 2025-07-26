// Mobile presbyopia filter testing component for mobile deployment
// Purpose: Enhanced Foundation building on proven 3.3/10 sharpness
// Location: src/components/MobileFilterTest.tsx

import React, { useEffect, useState, useRef } from 'react';

interface MobileFilterTestProps {
  isEnabled: boolean;
}

export const MobileFilterTest: React.FC<MobileFilterTestProps> = ({ isEnabled }) => {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [elementCount, setElementCount] = useState({
    highContrast: 0,
    enhancedSharpness: 0,
    maximumClarity: 0
  });
  const hasAppliedRef = useRef(false);

  useEffect(() => {
    if (isEnabled && !hasAppliedRef.current) {
      const timer = setTimeout(() => {
        applyEnhancedFoundationFilters();
        hasAppliedRef.current = true;
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!isEnabled && hasAppliedRef.current) {
      clearFilters();
      hasAppliedRef.current = false;
    }
  }, [isEnabled]);

  const applyEnhancedFoundationFilters = () => {
    console.log("🚀 Applying ENHANCED FOUNDATION filters (building on proven 3.3/10 sharpness)...");
    
    // Clear any existing enhanced mobile filter classes
    document.querySelectorAll('.mobile-filter-high-contrast, .mobile-filter-enhanced-sharpness, .mobile-filter-maximum-clarity').forEach(el => {
      const element = el as HTMLElement;
      // Don't clear Foundation filter - keep it as base!
      element.classList.remove('mobile-filter-high-contrast', 'mobile-filter-enhanced-sharpness', 'mobile-filter-maximum-clarity');
    });

    console.log("✅ Cleared previous enhanced filters (keeping Foundation base)");

    let counts = { highContrast: 0, enhancedSharpness: 0, maximumClarity: 0 };

    // Find text nodes and enhance Foundation's proven filter
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      const parentElement = textNode.parentElement;
      
      if (!parentElement) return;

      // Skip if already has enhanced mobile filter
      if (parentElement.classList.contains('mobile-filter-high-contrast') ||
          parentElement.classList.contains('mobile-filter-enhanced-sharpness') ||
          parentElement.classList.contains('mobile-filter-maximum-clarity')) {
        return;
      }

      // Get current Foundation filter (if applied)
      const currentFilter = parentElement.style.filter;
      const hasFoundation = currentFilter.includes('contrast(1.6)'); // Foundation's signature

      // Test A: User authentication - ENHANCED FOUNDATION + HIGH CONTRAST
      if (text.includes('User authentication system implementation')) {
        if (hasFoundation) {
          // Build on Foundation's proven filter
          parentElement.style.filter = "contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6)) contrast(1.2) brightness(1.05)";
        } else {
          // Apply Foundation + enhancement
          parentElement.style.filter = "contrast(1.8) brightness(1.15) drop-shadow(0 0 0.5px rgba(0,0,0,0.8))";
        }
        parentElement.style.letterSpacing = "0.2px";
        parentElement.classList.add('mobile-filter-high-contrast');
        counts.highContrast++;
        console.log("🔴 Applied ENHANCED FOUNDATION HIGH CONTRAST to: User authentication");
      }
      
      // Test B: Database schema - ENHANCED FOUNDATION + SHARPNESS
      else if (text.includes('Database schema optimization')) {
        if (hasFoundation) {
          // Build on Foundation with subtle enhancement
          parentElement.style.filter = "contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6)) saturate(1.1) drop-shadow(0 0 0.2px rgba(0,0,0,0.8))";
        } else {
          parentElement.style.filter = "contrast(1.7) brightness(1.12) saturate(1.1) drop-shadow(0 0 0.3px rgba(0,0,0,0.9))";
        }
        parentElement.style.letterSpacing = "0.2px";
        parentElement.classList.add('mobile-filter-enhanced-sharpness');
        counts.enhancedSharpness++;
        console.log("🔵 Applied ENHANCED FOUNDATION SHARPNESS to: Database schema");
      }
      
      // Test C: API endpoint - ENHANCED FOUNDATION + MAXIMUM CLARITY  
      else if (text.includes('API endpoint testing')) {
        if (hasFoundation) {
          // Build on Foundation with stronger sharpness
          parentElement.style.filter = "contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6)) contrast(1.3) drop-shadow(0 0 0.3px rgba(0,0,0,0.9))";
        } else {
          parentElement.style.filter = "contrast(2.0) brightness(1.18) drop-shadow(0 0 0.4px rgba(0,0,0,0.7))";
        }
        parentElement.style.letterSpacing = "0.2px";
        parentElement.classList.add('mobile-filter-maximum-clarity');
        counts.maximumClarity++;
        console.log("🟢 Applied ENHANCED FOUNDATION MAXIMUM CLARITY to: API endpoint");
      }
    });

    setElementCount(counts);
    setFiltersApplied(true);

    console.log("\n📱 ENHANCED FOUNDATION FILTERS DEPLOYED:");
    console.log(`✅ Enhanced ${counts.highContrast} HIGH CONTRAST elements (Foundation + boost)`);
    console.log(`✅ Enhanced ${counts.enhancedSharpness} SHARPNESS elements (Foundation + saturation)`);
    console.log(`✅ Enhanced ${counts.maximumClarity} MAXIMUM CLARITY elements (Foundation + stronger)`);
    console.log("\n👓 Which enhanced Foundation filter provides better sharpness?");

    if (counts.highContrast === 0 && counts.enhancedSharpness === 0 && counts.maximumClarity === 0) {
      console.log("⚠️ No target text found. Make sure Foundation is enabled and you're on Email tab.");
    }
  };

  const clearFilters = () => {
    document.querySelectorAll('.mobile-filter-high-contrast, .mobile-filter-enhanced-sharpness, .mobile-filter-maximum-clarity').forEach(el => {
      const element = el as HTMLElement;
      // Restore Foundation's original filter if it was there
      const hasFoundation = element.style.filter.includes('contrast(1.6)');
      if (hasFoundation) {
        element.style.filter = "contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))";
      }
      element.style.letterSpacing = '';
      element.classList.remove('mobile-filter-high-contrast', 'mobile-filter-enhanced-sharpness', 'mobile-filter-maximum-clarity');
    });

    setFiltersApplied(false);
    setElementCount({ highContrast: 0, enhancedSharpness: 0, maximumClarity: 0 });
    console.log("🧹 Enhanced filters cleared (Foundation restored)");
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="mobile-filter-test-panel bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          🚀 Phase 2: Enhanced Foundation Testing
        </h3>
        <p className="text-sm text-green-700">
          Building on proven Foundation sharpness (3.3/10) → targeting 4.4+/10
        </p>
      </div>

      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>⚠️ Important:</strong> Enable Foundation system first, then enable this test to build on proven sharpness.
      </div>

      {filtersApplied && (
        <div className="mb-4 p-3 bg-white rounded border">
          <div className="text-sm font-medium text-gray-900 mb-2">Enhanced Foundation Status:</div>
          <div className="text-sm space-y-1">
            <div className="text-red-600">🔴 Enhanced High Contrast: {elementCount.highContrast} elements</div>
            <div className="text-blue-600">🔵 Enhanced Sharpness: {elementCount.enhancedSharpness} elements</div>
            <div className="text-green-600">🟢 Enhanced Maximum Clarity: {elementCount.maximumClarity} elements</div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 border-t pt-3">
        <strong>Testing Protocol:</strong>
        <br />1. Enable Foundation system first (proven 3.3/10 sharpness)
        <br />2. Enable this Enhanced Foundation test
        <br />3. Compare enhanced bullet points to regular Foundation text
        <br />4. Rate sharpness improvement beyond Foundation baseline
      </div>

      <button 
        onClick={applyEnhancedFoundationFilters}
        className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
      >
        🔄 Reapply Enhanced Foundation
      </button>
    </div>
  );
};

export default MobileFilterTest; 