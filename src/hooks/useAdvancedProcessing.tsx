// useAdvancedProcessing.tsx
// Location: src/hooks/useAdvancedProcessing.tsx
// Purpose: Controller hook for Layer 3 advanced image processing pipeline
// Follows CLAUDE.md and project best practices

import { useState, useCallback } from 'react';
import { AdvancedImageProcessor, ProcessingParameters } from '../utils/AdvancedImageProcessor';

export interface AdvancedProcessingConfig {
  enabled: boolean;
  processingParams: ProcessingParameters;
  targetElements: string[]; // CSS selectors
}

export const useAdvancedProcessing = () => {
  const [config, setConfig] = useState<AdvancedProcessingConfig>({
    enabled: false,
    processingParams: {
      edgeEnhancement: 1.5,     // Aggressive for presbyopia
      unsharpStrength: 1.2,     // Professional sharpening
      unsharpRadius: 1.0,       // Optimal for text
      contrastBoost: 1.3,       // Moderate contrast boost
      preserveImages: true      // Protect image regions
    },
    targetElements: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'a']
  });

  const [processor] = useState(() => new AdvancedImageProcessor());
  const [isProcessing, setIsProcessing] = useState(false);

  const updateProcessingParams = useCallback((newParams: Partial<ProcessingParameters>) => {
    console.log('🔴 updateProcessingParams called with:', newParams);
    
    setConfig(prev => {
      const updatedConfig = {
        ...prev,
        processingParams: { ...prev.processingParams, ...newParams }
      };
      
      console.log('🔴 Updated config will be:', updatedConfig.processingParams);
      return updatedConfig;
    });
  }, []);

  const toggleProcessing = useCallback(() => {
    console.log('🔴 toggleProcessing called, current enabled:', config.enabled);
    setConfig(prev => {
      const newConfig = { ...prev, enabled: !prev.enabled };
      console.log('🔴 toggleProcessing new state:', newConfig.enabled);
      return newConfig;
    });
  }, [config.enabled]);

  const processPageContent = useCallback(async () => {
    console.log('🔴 processPageContent ENTRY - function called');
    
    // Force fresh state read
    const currentConfig = config;
    console.log('🔴 FRESH CONFIG READ:', currentConfig.processingParams);
    console.log('🔴 Fresh Edge Enhancement:', currentConfig.processingParams.edgeEnhancement);
    console.log('🔴 Fresh Unsharp Strength:', currentConfig.processingParams.unsharpStrength);
    console.log('🔴 Fresh Contrast Boost:', currentConfig.processingParams.contrastBoost);
    
    if (!currentConfig.enabled || isProcessing) {
      console.log('❌ Early return - enabled:', currentConfig.enabled, 'isProcessing:', isProcessing);
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🔴 About to process with FRESH params:', currentConfig.processingParams);
      
      const elements = document.querySelectorAll(currentConfig.targetElements.join(', '));
      console.log('🔴 Found elements:', elements.length);
      
      for (const element of elements) {
        console.log('🔴 Processing element with FRESH edge enhancement:', currentConfig.processingParams.edgeEnhancement);
        await processor.processElement(element as HTMLElement, currentConfig.processingParams);
        console.log('✅ Element processed successfully');
        break; // Process only first element for testing
      }
      
      console.log('✅ Advanced processing completed successfully');
    } catch (error) {
      console.error('❌ Advanced processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []); // Remove ALL dependencies to force fresh closure

  return {
    config,
    isProcessing,
    processPageContent,
    updateProcessingParams,
    toggleProcessing,
    setConfig
  };
}; 