// Vision correction diagnostic component for analyzing clarity differences
// Purpose: Analyze why sections have different clarity and fix overexposure issues
// Location: src/components/VisionCorrectionDiagnostic.tsx

import React, { useEffect, useState } from 'react';

interface VisionCorrectionDiagnosticProps {
  isEnabled: boolean;
}

export const VisionCorrectionDiagnostic: React.FC<VisionCorrectionDiagnosticProps> = ({ isEnabled }) => {
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);

  useEffect(() => {
    if (isEnabled) {
      runDiagnostic();
    }
  }, [isEnabled]);

  const runDiagnostic = () => {
    console.log('🔍 VISION CORRECTION DIAGNOSTIC - Analyzing why sections have different clarity...');
    
    const results: any[] = [];
    
    // Analyze all elements with vision correction applied
    const enhancedElements = document.querySelectorAll('[style*="filter"], .presbyopia-enhanced, .week-one-enhanced, .progressive-enhanced');
    
    enhancedElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      
      const elementInfo = {
        index: index + 1,
        tagName: htmlElement.tagName,
        className: htmlElement.className,
        filter: htmlElement.style.filter || computedStyle.filter,
        brightness: '',
        contrast: '',
        textContent: htmlElement.textContent?.substring(0, 50) + '...',
        section: getSectionName(htmlElement),
        hasOverexposure: isOverexposed(htmlElement)
      };
      
      results.push(elementInfo);
    });

    // Check for elements without vision correction
    const unenhancedElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    let unenhancedCount = 0;
    
    unenhancedElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const hasFilter = htmlElement.style.filter || window.getComputedStyle(htmlElement).filter !== 'none';
      const hasClass = htmlElement.className.includes('enhanced') || htmlElement.className.includes('presbyopia');
      
      if (!hasFilter && !hasClass && htmlElement.textContent && htmlElement.textContent.trim().length > 10) {
        unenhancedCount++;
      }
    });

    console.log(`📊 DIAGNOSTIC RESULTS:`);
    console.log(`✅ Elements WITH vision correction: ${results.length}`);
    console.log(`❌ Elements WITHOUT vision correction: ${unenhancedCount}`);
    console.log(`🔴 Overexposed elements: ${results.filter(r => r.hasOverexposure).length}`);
    
    // Log section-by-section analysis
    const sectionBreakdown = groupBySection(results);
    Object.entries(sectionBreakdown).forEach(([section, elements]) => {
      console.log(`\n📍 ${section.toUpperCase()}:`);
      console.log(`   Elements enhanced: ${(elements as any[]).length}`);
      console.log(`   Overexposed: ${(elements as any[]).filter((e: any) => e.hasOverexposure).length}`);
      console.log(`   Sample filter: ${(elements as any[])[0]?.filter || 'None'}`);
    });

    setDiagnosticResults(results);
  };

  const getSectionName = (element: HTMLElement): string => {
    // Try to identify which section the element belongs to
    const rect = element.getBoundingClientRect();
    const y = rect.top + window.scrollY;
    
    if (y < 400) return 'Section 1 (Header/Nav)';
    if (y < 800) return 'Section 2 (Vision Controls)';
    if (y < 1200) return 'Section 3 (Email Content)';
    return 'Section 4 (Bottom/Footer)';
  };

  const isOverexposed = (element: HTMLElement): boolean => {
    const filter = element.style.filter;
    if (!filter) return false;
    
    // Check for excessive brightness or contrast
    const brightnessMatch = filter.match(/brightness\(([^)]+)\)/);
    const contrastMatch = filter.match(/contrast\(([^)]+)\)/);
    
    const brightness = brightnessMatch ? parseFloat(brightnessMatch[1]) : 1;
    const contrast = contrastMatch ? parseFloat(contrastMatch[1]) : 1;
    
    // Consider overexposed if brightness > 1.3 or contrast > 2.5
    return brightness > 1.3 || contrast > 2.5;
  };

  const groupBySection = (results: any[]) => {
    return results.reduce((acc, result) => {
      const section = result.section;
      if (!acc[section]) acc[section] = [];
      acc[section].push(result);
      return acc;
    }, {});
  };

  const fixOverexposure = () => {
    console.log('🔧 FIXING OVEREXPOSURE (TEXT ELEMENTS ONLY)...');
    
    const overexposedElements = document.querySelectorAll('[style*="filter"]');
    let fixed = 0;
    let skipped = 0;
    
    overexposedElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const filter = htmlElement.style.filter;
      
      // Skip UI elements and buttons
      if (htmlElement.tagName === 'BUTTON' ||
          htmlElement.tagName === 'IMG' ||
          htmlElement.tagName === 'INPUT' ||
          htmlElement.tagName === 'A' ||
          htmlElement.closest('button, a, [role="button"]') ||
          htmlElement.querySelector('button, img, input, a') ||
          htmlElement.className.includes('btn') ||
          htmlElement.className.includes('button') ||
          htmlElement.hasAttribute('onclick')) {
        skipped++;
        return; // Skip UI elements
      }
      
      if (filter) {
        // Fix excessive brightness and contrast for text elements only
        const fixedFilter = filter
          .replace(/brightness\([^)]*\)/g, 'brightness(1.12)')
          .replace(/contrast\(([^)]*)\)/g, (match, value) => {
            const contrast = parseFloat(value);
            return contrast > 2.0 ? 'contrast(1.6)' : match;
          });
        
        if (fixedFilter !== filter) {
          htmlElement.style.filter = fixedFilter;
          fixed++;
        }
      }
    });
    
    console.log(`✅ Fixed ${fixed} overexposed TEXT elements`);
    console.log(`🚫 Skipped ${skipped} UI elements (buttons, images, etc.)`);
  };

  const makeAllSectionsEqual = () => {
    const results: string[] = ['🎯 EQUALIZING TEXT SECTIONS ONLY...'];
    
    // Use optimal Foundation filter for TEXT elements only
    const referenceFilter = 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))';
    
    // Target only text elements, exclude UI elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, div');
    let applied = 0;
    
    textElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Skip buttons, images, and interactive elements
      if (htmlElement.tagName === 'BUTTON' ||
          htmlElement.tagName === 'IMG' ||
          htmlElement.tagName === 'INPUT' ||
          htmlElement.tagName === 'A' ||
          htmlElement.closest('button, a, [role="button"]') ||
          htmlElement.querySelector('button, img, input, a') ||
          htmlElement.className.includes('btn') ||
          htmlElement.className.includes('button') ||
          htmlElement.hasAttribute('onclick')) {
        return; // Skip UI elements
      }
      
      // Apply only to elements with meaningful text content
      if (htmlElement.textContent && htmlElement.textContent.trim().length > 5) {
        htmlElement.style.filter = referenceFilter;
        htmlElement.style.fontWeight = '500';
        applied++;
      }
    });
    
    results.push(`✅ Applied Foundation filter to ${applied} TEXT elements only`);
    results.push('🛡️ Skipped buttons, images, and interactive elements');
    results.push('All text sections should now have equal clarity without UI overexposure');
    results.push('Reference filter: ' + referenceFilter);
    
    console.log(results.join('\n'));
  };

  if (!isEnabled) return null;

  const sectionBreakdown = groupBySection(diagnosticResults);

  return (
    <div className="vision-diagnostic bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          🔍 Vision Correction Diagnostic
        </h3>
        <p className="text-sm text-red-700">
          Analyzing why sections have different clarity levels and fixing overexposure
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <button 
          onClick={runDiagnostic}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          🔍 Run Diagnostic
        </button>
        
        <button 
          onClick={fixOverexposure}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm ml-2"
        >
          🔧 Fix Overexposure
        </button>
        
        <button 
          onClick={makeAllSectionsEqual}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm ml-2"
        >
          🎯 Equalize All Sections
        </button>
      </div>

      {Object.keys(sectionBreakdown).length > 0 && (
        <div className="bg-white rounded border p-3">
          <div className="text-sm font-medium mb-2">Section Analysis:</div>
          {Object.entries(sectionBreakdown).map(([section, elements]) => (
            <div key={section} className="text-sm mb-2">
              <strong>{section}:</strong> {(elements as any[]).length} enhanced, {(elements as any[]).filter((e: any) => e.hasOverexposure).length} overexposed
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-600 border-t pt-3 mt-4">
        <strong>Goal:</strong> Make all sections as clear as Section 1, then apply vision correction for further improvement.
      </div>
    </div>
  );
};

export default VisionCorrectionDiagnostic; 