// WeekOneTest.tsx
// Location: src/components/WeekOneTest.tsx
// Purpose: Test interface for Week 1 Foundation functionality
// Follows CLAUDE.md and project best practices

import React, { useState, useEffect } from 'react';
import { useVisionCorrection } from '../hooks/useVisionCorrection';

export const WeekOneTest: React.FC = () => {
  const { 
    applyMinimalFoundation, 
    removeMinimalFoundation, 
    toggleMinimalFoundation,
    getFoundationStatus,
    isFoundationActive
  } = useVisionCorrection();
  
  const [status, setStatus] = useState<any>(null);
  
  const updateStatus = () => {
    const currentStatus = getFoundationStatus();
    setStatus(currentStatus);
  };
  
  const handleApply = () => {
    applyMinimalFoundation();
    setTimeout(updateStatus, 100);
  };
  
  const handleRemove = () => {
    removeMinimalFoundation();
    setTimeout(updateStatus, 100);
  };
  
  const handleToggle = () => {
    toggleMinimalFoundation();
    setTimeout(updateStatus, 100);
  };

  // Add this useEffect to automatically equalize on page load
  useEffect(() => {
    const autoEqualizeText = () => {
      console.log('🎯 AUTO-EQUALIZING ALL TEXT (Default Baseline)...');
      
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, div, td, th');
      let applied = 0;
      
      textElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        
        // Skip UI elements
        if (htmlElement.tagName === 'BUTTON' || 
            htmlElement.tagName === 'IMG' ||
            htmlElement.closest('button') ||
            htmlElement.className.includes('btn')) {
          return;
        }
        
        // Apply consistent baseline to all text
        if (htmlElement.textContent && htmlElement.textContent.trim().length > 5) {
          htmlElement.style.filter = '';
          htmlElement.style.fontWeight = '400';
          htmlElement.classList.add('equalized-baseline');
          applied++;
        }
      });
      
      console.log(`✅ Auto-equalized ${applied} text elements as default baseline`);
    };
    
    // Auto-equalize after component mount
    setTimeout(autoEqualizeText, 1000);
  }, []);

  const applyFoundation = () => {
    console.log('🔍 EVIDENCE GATHERING: Foundation Detection Analysis Starting...');
    console.log('📊 MANDATORY LOGGING: Analyzing ALL elements on page');
    
    // EVIDENCE: What elements exist on the page?
    const allElements = document.querySelectorAll('*');
    console.log(`📊 TOTAL ELEMENTS ON PAGE: ${allElements.length}`);
    
    // EVIDENCE: What buttons exist?
    const buttons = document.querySelectorAll('button');
    console.log(`🔴 BUTTONS FOUND: ${buttons.length}`);
    buttons.forEach((btn, index) => {
      console.log(`🔴 BUTTON ${index + 1}: tagName=${btn.tagName}, className="${btn.className}", text="${btn.textContent?.substring(0, 20)}"`);
    });
    
    // EVIDENCE: What images exist?
    const images = document.querySelectorAll('img');
    console.log(`🖼️ IMAGES FOUND: ${images.length}`);
    images.forEach((img, index) => {
      console.log(`🖼️ IMAGE ${index + 1}: tagName=${img.tagName}, className="${img.className}", src="${img.src?.substring(0, 30)}"`);
    });
    
    // EVIDENCE: What gets the Foundation filter applied?
    const foundationFilter = 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))';
    let enhancedCount = 0;
    let skippedCount = 0;
    
    allElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // EVIDENCE: Document decision for each element type we care about
      if (htmlElement.tagName === 'BUTTON') {
        console.log(`🔴 BUTTON DECISION: Element ${index} - SHOULD BE SKIPPED`);
        skippedCount++;
        return;
      }
      
      if (htmlElement.tagName === 'IMG') {
        console.log(`🖼️ IMAGE DECISION: Element ${index} - SHOULD BE SKIPPED`);
        skippedCount++;
        return;
      }
      
      // Apply to text elements and LOG what we're enhancing
      if (htmlElement.textContent && 
          htmlElement.textContent.trim().length > 3 &&
          ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'DIV'].includes(htmlElement.tagName)) {
        
        console.log(`✅ ENHANCING: Element ${index} - ${htmlElement.tagName} - "${htmlElement.textContent.substring(0, 30)}..."`);
        htmlElement.style.filter = foundationFilter;
        htmlElement.style.fontWeight = '500';
        enhancedCount++;
      }
    });
    
    console.log(`📊 FINAL EVIDENCE: ${enhancedCount} elements enhanced, ${skippedCount} UI elements skipped`);
    console.log('🔍 EVIDENCE GATHERING COMPLETE - Check mobile console for results');
  };

  const applyEnhancedFilter = (filterCSS: string, filterName: string) => {
    console.log(`🎯 Applying ${filterName} to equalized baseline...`);
    
    const textElements = document.querySelectorAll('.equalized-baseline');
    let applied = 0;
    
    textElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Skip UI elements
      if (htmlElement.tagName === 'BUTTON' || 
          htmlElement.tagName === 'IMG' ||
          htmlElement.closest('button, img')) {
        return;
      }
      
      htmlElement.style.filter = filterCSS;
      htmlElement.style.fontWeight = '520';
      applied++;
    });
    
    console.log(`✅ Applied ${filterName} to ${applied} text elements`);
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '2px solid #28a745',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      maxWidth: '600px'
    }}>
      <h2>🚀 Week 1 Foundation Test</h2>
      <p><strong>Goal:</strong> 3.0 → 3.3/10 effectiveness with minimal complexity</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={applyFoundation}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✅ Apply Foundation
        </button>
        
        <button 
          onClick={handleRemove}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ❌ Remove Foundation
        </button>
        
        <button 
          onClick={handleToggle}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Toggle Foundation
        </button>
        
        <button 
          onClick={updateStatus}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📊 Check Status
        </button>
        
        {/* Enhanced Filter Testing - Add these alongside existing buttons */}
        <button
          onClick={() => applyEnhancedFilter('contrast(1.8) brightness(1.15) drop-shadow(0 0 0.3px rgba(0,0,0,0.9))', 'Enhanced Contrast')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm font-medium"
        >
          🔥 Enhanced Contrast
        </button>

        <button
          onClick={() => applyEnhancedFilter('contrast(1.7) brightness(1.12) saturate(1.1) drop-shadow(0 0 0.2px rgba(0,0,0,1.0))', 'Maximum Sharpness')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
        >
          ⚡ Maximum Sharpness
        </button>
      </div>
      
      {status && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <h3>Foundation Status:</h3>
          <div><strong>Active:</strong> {status.active ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Text Enhanced:</strong> {status.textEnhanced} elements</div>
          <div><strong>Images Preserved:</strong> {status.imagesPreserved} elements</div>
          <div><strong>Total Processed:</strong> {status.totalProcessed} elements</div>
          <div><strong>Effectiveness:</strong> {status.effectiveness}</div>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h4>Manual Validation:</h4>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Click "Apply Foundation"</li>
          <li>Look at text on this page - does it appear sharper?</li>
          <li>Check any images - do they look the same?</li>
          <li>Toggle on/off to see the difference</li>
          <li>Check console for processing stats</li>
        </ol>
      </div>
      
      {/* Test content */}
      <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
        <h3>Test Content</h3>
        <p>This is sample text that should be enhanced by the Week 1 Foundation. 
           Notice how the text appears sharper and more defined when the foundation is applied.</p>
        <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '100px', 
            height: '60px', 
            backgroundColor: '#e9ecef', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            [Test Image]
          </div>
          <span>← This "image" should maintain its appearance</span>
        </div>
        <p>More text to test consistency across multiple elements. The enhancement should work uniformly.</p>
      </div>
    </div>
  );
}; 