/**
 * Canvas Analysis Types - Minimal interfaces for presbyopia correction
 */

// Core analysis result - what VisionCorrectionEngine needs
export interface AnalysisResult {
  textRegions: TextRegion[]
  contrastMap: ContrastData
  contentType: ContentType
  processingTime: number
  timestamp: number
}

// Text region with essential data only
export interface TextRegion {
  bounds: Rectangle
  confidence: number  // 0-1, how certain this is text
  priority: number    // 0-1, importance for processing
}

// Simple rectangle structure
export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

// Contrast analysis data
export interface ContrastData {
  grid: number[][]              // 2D array of contrast values (0-1)
  cellSize: number              // Size of each grid cell in pixels
  lowContrastAreas: Rectangle[] // Areas needing enhancement
  meanContrast: number          // Average contrast across image
}

// Content classification
export type ContentType = 'email' | 'article' | 'ui' | 'mixed'

// Configuration for analysis
export interface AnalysisConfig {
  sobelThreshold: number     // Edge detection threshold (0-1)
  minTextSize: number        // Minimum region size in pixels
  gridCellSize: number       // Contrast grid cell size
  performanceMode: 'fast' | 'balanced' | 'quality'
}

// Performance metrics for monitoring
export interface PerformanceMetrics {
  captureTime: number
  detectionTime: number
  contrastTime: number
  totalTime: number
}