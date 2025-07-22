// WeekOneTest.tsx
// Location: src/components/WeekOneTest.tsx
// Purpose: Test interface for Week 1 Foundation functionality
// Follows CLAUDE.md and project best practices

import React, { useState } from 'react';
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
          onClick={handleApply}
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