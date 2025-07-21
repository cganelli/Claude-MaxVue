/**
 * Canvas Analysis System Types
 * 
 * Defines interfaces for Canvas-based content analysis including text detection,
 * contrast analysis, and content classification for presbyopia correction.
 */

// Core Canvas Analysis Results
export interface CanvasAnalysisResult {
  // Text region detection
  textRegions: TextRegion[];
  
  // Contrast analysis data
  contrastMap: ContrastMap;
  
  // Content classification
  contentClassification: ContentClassification;
  
  // Performance metrics
  processingTime: number;
  
  // Analysis metadata
  timestamp: number;
  canvasSize: { width: number; height: number };
  devicePixelRatio: number;
}

// Text Region Detection
export interface TextRegion {
  // Region boundaries
  bounds: BoundingRect;
  
  // Confidence score (0-1)
  confidence: number;
  
  // Text characteristics
  textDensity: number;
  estimatedFontSize: number;
  
  // Edge detection data
  edgeIntensity: number;
  
  // Classification
  regionType: TextRegionType;
}

export interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TextRegionType = 
  | 'heading' 
  | 'body-text' 
  | 'small-text' 
  | 'ui-element' 
  | 'label';

// Contrast Analysis
export interface ContrastMap {
  // Local contrast values (0-1 normalized)
  contrastGrid: number[][];
  
  // Grid dimensions
  gridWidth: number;
  gridHeight: number;
  
  // Cell size in pixels
  cellSize: number;
  
  // Overall contrast statistics
  meanContrast: number;
  minContrast: number;
  maxContrast: number;
  
  // Enhancement recommendations
  enhancementMap: EnhancementMap;
}

export interface EnhancementMap {
  // Enhancement strength per grid cell (0-1)
  strengthGrid: number[][];
  
  // Recommended diopter adjustment per region
  diopterAdjustmentGrid: number[][];
  
  // Processing priority areas
  priorityRegions: BoundingRect[];
}

// Content Classification
export interface ContentClassification {
  // Primary content type
  primaryType: ContentType;
  
  // Content type confidence (0-1)
  confidence: number;
  
  // Detected content characteristics
  characteristics: ContentCharacteristics;
  
  // Recommended processing strategy
  processingStrategy: ProcessingStrategy;
}

export type ContentType = 
  | 'email' 
  | 'article' 
  | 'ui-interface' 
  | 'document' 
  | 'mixed';

export interface ContentCharacteristics {
  // Text density and distribution
  textDensity: number;
  lineSpacing: number;
  columnCount: number;
  
  // Color and contrast properties
  backgroundType: 'light' | 'dark' | 'mixed';
  colorVariance: number;
  
  // Layout characteristics
  hasHeaders: boolean;
  hasSidebars: boolean;
  hasButtons: boolean;
  
  // Font characteristics
  fontSizeVariance: number;
  averageFontSize: number;
}

export interface ProcessingStrategy {
  // Recommended enhancement settings
  contrastBoost: number;
  edgeEnhancement: number;
  
  // Region-specific adjustments
  regionAdjustments: RegionAdjustment[];
  
  // Performance optimization hints
  processingPriority: 'speed' | 'quality' | 'balanced';
  useWebGL: boolean;
}

export interface RegionAdjustment {
  region: BoundingRect;
  diopterAdjustment: number;
  contrastMultiplier: number;
  priority: number;
}

// Analysis Configuration
export interface CanvasAnalysisConfig {
  // Text detection settings
  textDetection: TextDetectionConfig;
  
  // Contrast analysis settings
  contrastAnalysis: ContrastAnalysisConfig;
  
  // Content classification settings
  contentClassification: ContentClassificationConfig;
  
  // Performance settings
  performance: PerformanceConfig;
}

export interface TextDetectionConfig {
  // Sobel edge detection parameters
  sobelThreshold: number;
  
  // Text region detection
  minRegionSize: number;
  maxRegionSize: number;
  mergeDistance: number;
  
  // Confidence thresholds
  minConfidence: number;
  
  // Font size estimation
  enableFontSizeEstimation: boolean;
}

export interface ContrastAnalysisConfig {
  // Grid settings
  gridCellSize: number;
  
  // Contrast calculation
  contrastMethod: 'rms' | 'michelson' | 'weber';
  
  // Enhancement mapping
  enhancementSensitivity: number;
  maxEnhancement: number;
}

export interface ContentClassificationConfig {
  // Classification thresholds
  textDensityThresholds: {
    email: number;
    article: number;
    ui: number;
  };
  
  // Feature detection
  enableLayoutAnalysis: boolean;
  enableColorAnalysis: boolean;
}

export interface PerformanceConfig {
  // Processing limits
  maxProcessingTime: number; // ms
  
  // Quality vs speed trade-offs
  analysisQuality: 'fast' | 'balanced' | 'high';
  
  // Memory management
  enableCaching: boolean;
  maxCacheSize: number;
  
  // Concurrent processing
  useWebWorkers: boolean;
}

// Debug and Validation Types
export interface DebugVisualization {
  // Text region overlays
  textRegionOverlay: ImageData;
  
  // Contrast heatmap
  contrastHeatmap: ImageData;
  
  // Content classification visualization
  classificationOverlay: ImageData;
  
  // Performance metrics display
  performanceMetrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  // Processing times
  textDetectionTime: number;
  contrastAnalysisTime: number;
  contentClassificationTime: number;
  totalProcessingTime: number;
  
  // Memory usage
  memoryUsage: number;
  peakMemoryUsage: number;
  
  // Analysis quality metrics
  textDetectionAccuracy?: number;
  contrastAnalysisQuality?: number;
}

// Validation and Testing Types
export interface ValidationResult {
  // Test results
  textDetectionAccuracy: number;
  processingTime: number;
  memoryEfficiency: number;
  
  // Checkpoint gates
  checkpointResults: CheckpointResults;
  
  // Overall validation status
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export interface CheckpointResults {
  processingTimeUnder16ms: boolean;
  textDetectionOver90Percent: boolean;
  noRegressionInBaseline: boolean;
  debugVisualizationsWorking: boolean;
  allTestsPassing: boolean;
  performanceBenchmarksValid: boolean;
  memoryEfficient: boolean;
  mobileCompensationPreserved: boolean;
  gracefulFallbackWorking: boolean;
}

// Error and Exception Types
export interface CanvasAnalysisError extends Error {
  code: CanvasAnalysisErrorCode;
  context?: Record<string, unknown>;
}

export type CanvasAnalysisErrorCode =
  | 'CANVAS_NOT_AVAILABLE'
  | 'PROCESSING_TIMEOUT'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'INVALID_IMAGE_DATA'
  | 'WEBGL_NOT_SUPPORTED'
  | 'ANALYSIS_FAILED';

// WebGL Integration Types
export interface WebGLAnalysisData {
  // Texture data for WebGL shaders
  textRegionTexture: Float32Array;
  contrastTexture: Float32Array;
  enhancementTexture: Float32Array;
  
  // Texture dimensions
  textureWidth: number;
  textureHeight: number;
  
  // Shader uniforms
  uniforms: WebGLUniforms;
}

export interface WebGLUniforms {
  // Analysis parameters
  textRegionCount: number;
  averageContrast: number;
  enhancementStrength: number;
  
  // Content type parameters
  contentType: number; // encoded as float
  processingStrategy: number; // encoded as float
}

// Cache Management Types
export interface AnalysisCache {
  // Cache key generation
  generateKey(imageData: ImageData, config: CanvasAnalysisConfig): string;
  
  // Cache operations
  get(key: string): CanvasAnalysisResult | null;
  set(key: string, result: CanvasAnalysisResult): void;
  clear(): void;
  
  // Cache statistics
  getStats(): CacheStats;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheSize: number;
  memoryUsage: number;
}