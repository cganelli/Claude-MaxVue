// Foundation parameter optimization component for systematic testing
// Purpose: Optimize proven Foundation sharpness (3.3/10) towards 4.4+/10 target
// Location: src/components/FoundationOptimizer.tsx

import React, { useEffect, useState } from 'react';

interface FoundationOptimizerProps {
  isEnabled: boolean;
}

export const FoundationOptimizer: React.FC<FoundationOptimizerProps> = ({ isEnabled }) => {
  const [currentVariation, setCurrentVariation] = useState<string>('baseline');
  const [effectivenessRatings, setEffectivenessRatings] = useState<Record<string, number>>({});
  const [elementsEnhanced, setElementsEnhanced] = useState<number>(0);

  // Foundation parameter variations for systematic testing
  const foundationVariations = {
    baseline: {
      name: 'Current Foundation',
      filter: 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))',
      description: 'Proven 3.3/10 effectiveness',
      target: 'Baseline'
    },
    contrast17: {
      name: 'Higher Contrast',
      filter: 'contrast(1.7) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))',
      description: 'Increased contrast for sharper edges',
      target: '+0.2/10'
    },
    contrast18: {
      name: 'Max Contrast',
      filter: 'contrast(1.8) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))',
      description: 'Maximum contrast without artifacts',
      target: '+0.3/10'
    },
    sharperShadow: {
      name: 'Sharper Shadow',
      filter: 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.3px rgba(0,0,0,0.8))',
      description: 'Tighter, darker drop-shadow',
      target: '+0.2/10'
    },
    optimizedCombo: {
      name: 'Optimized Combined',
      filter: 'contrast(1.7) brightness(1.12) drop-shadow(0 0 0.3px rgba(0,0,0,0.8))',
      description: 'Best contrast + shadow combination',
      target: '+0.4/10'
    },
    maxOptimized: {
      name: 'Maximum Optimized',
      filter: 'contrast(1.8) brightness(1.12) drop-shadow(0 0 0.3px rgba(0,0,0,0.9))',
      description: 'Strongest optimization for maximum sharpness',
      target: '+0.5/10'
    }
  };

  useEffect(() => {
    if (isEnabled) {
      applyFoundationVariation();
    } else {
      clearFoundationOptimization();
    }
  }, [isEnabled, currentVariation]);

  const applyFoundationVariation = () => {
    const variation = foundationVariations[currentVariation as keyof typeof foundationVariations];
    
    console.log(`🚀 Applying Foundation optimization: ${variation.name}`);
    console.log(`🎯 Target improvement: ${variation.target}`);
    
    // Clear any existing foundation optimization
    document.querySelectorAll('.foundation-optimized').forEach(el => {
      const element = el as HTMLElement;
      element.style.filter = '';
      element.style.fontWeight = '';
      element.classList.remove('foundation-optimized');
    });

    // Apply optimized Foundation to email content for comparison
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    let enhanced = 0;
    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      const parentElement = textNode.parentElement;
      
      if (!parentElement) return;

      // Target email bullet points for systematic comparison
      if (text.includes('User authentication system implementation') ||
          text.includes('Database schema optimization') ||
          text.includes('API endpoint testing') ||
          text.includes('Initial UI/UX mockups completed') ||
          text.includes('Mobile responsiveness review') ||
          text.includes('Security audit preparation')) {
        
        // Apply optimized Foundation filter
        parentElement.style.filter = variation.filter;
        parentElement.style.fontWeight = '500';
        parentElement.style.letterSpacing = '0.2px';
        parentElement.style.lineHeight = '1.5';
        parentElement.classList.add('foundation-optimized');
        enhanced++;
      }
    });

    setElementsEnhanced(enhanced);
    console.log(`✅ Applied ${variation.name} to ${enhanced} email bullet points`);
    console.log(`📊 Filter: ${variation.filter}`);
  };

  const clearFoundationOptimization = () => {
    document.querySelectorAll('.foundation-optimized').forEach(el => {
      const element = el as HTMLElement;
      element.style.filter = '';
      element.style.fontWeight = '';
      element.style.letterSpacing = '';
      element.style.lineHeight = '';
      element.classList.remove('foundation-optimized');
    });
    setElementsEnhanced(0);
    console.log('🧹 Foundation optimization cleared');
  };

  const handleEffectivenessRating = (rating: number) => {
    const newRatings = { ...effectivenessRatings, [currentVariation]: rating };
    setEffectivenessRatings(newRatings);
    console.log(`📊 Foundation ${currentVariation}: ${rating}/10 effectiveness`);
    
    if (rating >= 4.4) {
      console.log('🎯 Phase 2 target achieved! Foundation optimization successful.');
    }
  };

  if (!isEnabled) return null;

  const current = foundationVariations[currentVariation as keyof typeof foundationVariations];

  return (
    <div className="foundation-optimizer bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          🔧 Phase 2: Foundation Parameter Optimization
        </h3>
        <p className="text-sm text-green-700">
          Optimizing proven Foundation sharpness: 3.3/10 → 4.4+/10 target
        </p>
      </div>

      {/* Status */}
      <div className="mb-4 p-3 bg-white rounded border">
        <div className="text-sm font-medium text-gray-900 mb-1">Current Test:</div>
        <div className="text-sm text-gray-700">{current.name} - {current.description}</div>
        <div className="text-sm text-green-600">Elements Enhanced: {elementsEnhanced}</div>
      </div>

      {/* Variation Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foundation Optimization:
        </label>
        <select 
          value={currentVariation}
          onChange={(e) => setCurrentVariation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {Object.entries(foundationVariations).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name} ({config.target})
            </option>
          ))}
        </select>
        <div className="text-xs text-gray-600 mt-1">
          Expected gain: {current.target}
        </div>
      </div>

      {/* Effectiveness Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Presbyopia Sharpness (mobile +2.00D testing):
        </label>
        <div className="flex gap-1 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              onClick={() => handleEffectivenessRating(rating)}
              className={`w-8 h-8 rounded text-sm font-medium ${
                effectivenessRatings[currentVariation] === rating
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        {effectivenessRatings[currentVariation] && (
          <div className="text-sm text-green-700 mt-1">
            Current rating: {effectivenessRatings[currentVariation]}/10
            {effectivenessRatings[currentVariation] >= 4.4 && ' 🎯 Phase 2 target achieved!'}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {Object.keys(effectivenessRatings).length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded border">
          <div className="text-sm font-medium text-blue-900 mb-2">Foundation Optimization Results:</div>
          {Object.entries(effectivenessRatings)
            .sort(([,a], [,b]) => b - a)
            .map(([variation, rating]) => (
            <div key={variation} className="text-sm text-blue-800">
              {foundationVariations[variation as keyof typeof foundationVariations].name}: {rating}/10
              {rating >= 4.4 && ' 🎯'}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-600 border-t pt-3 mt-4">
        <strong>Testing Protocol:</strong>
        <br />1. Navigate to Email tab to see optimized bullet points
        <br />2. Test different Foundation parameter variations
        <br />3. Rate sharpness improvement compared to baseline Foundation
        <br />4. Deploy best variation to mobile for +2.00D presbyopia testing
      </div>
    </div>
  );
};

export default FoundationOptimizer; 