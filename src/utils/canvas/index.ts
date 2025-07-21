/**
 * Canvas Analysis System - Phase 1a Foundation
 * 
 * Provides text detection and basic contrast analysis for presbyopia correction.
 */

export { CanvasAnalyzer } from './CanvasAnalyzer';
export { TextDetector } from './TextDetector';
export type {
  AnalysisResult,
  TextRegion,
  Rectangle,
  ContrastData,
  ContentType,
  AnalysisConfig,
  PerformanceMetrics
} from './types';

// Phase 1a Foundation: Canvas analysis with text detection and basic contrast analysis
// ✅ Text Detection: Sobel edge detection with connected components
// ✅ Contrast Analysis: Grid-based RMS contrast calculation  
// ✅ Content Classification: Basic heuristics for email/article/UI/mixed
// ✅ Performance: Optimized with downsampling for large images
// ✅ Integration Ready: Compatible data structure for VisionCorrectionEngine

// Next Phase 1b: Enhanced contrast analysis and content classification
// Next Phase 2: WebGL rendering optimization