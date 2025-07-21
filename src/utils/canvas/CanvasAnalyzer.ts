/**
 * CanvasAnalyzer - Orchestrates Canvas analysis for presbyopia correction
 */

import { TextDetector } from './TextDetector';
import type { AnalysisResult, AnalysisConfig, ContrastData, ContentType, PerformanceMetrics } from './types';

export class CanvasAnalyzer {
  private textDetector: TextDetector;
  private config: AnalysisConfig;
  private cache = new Map<string, AnalysisResult>();

  constructor(config?: Partial<AnalysisConfig>) {
    this.config = {
      sobelThreshold: 0.1,
      minTextSize: 50,
      gridCellSize: 20,
      performanceMode: 'balanced',
      ...config
    };
    
    this.textDetector = new TextDetector(this.config);
  }

  /**
   * Analyze canvas content for presbyopia correction
   */
  async analyze(imageData: ImageData): Promise<AnalysisResult> {
    const startTime = performance.now();
    
    // Check cache
    const cacheKey = this.generateCacheKey(imageData);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    try {
      // Phase 1: Text detection
      const detectionStart = performance.now();
      const textRegions = this.textDetector.detectTextRegions(imageData);
      const detectionTime = performance.now() - detectionStart;
      
      // Phase 2: Basic contrast analysis (simplified for now)
      const contrastStart = performance.now();
      const contrastMap = this.analyzeContrast(imageData);
      const contrastTime = performance.now() - contrastStart;
      
      // Phase 3: Content classification (simplified)
      const contentType = this.classifyContent(textRegions, imageData);
      
      const totalTime = performance.now() - startTime;
      
      const result: AnalysisResult = {
        textRegions,
        contrastMap,
        contentType,
        processingTime: totalTime,
        timestamp: Date.now()
      };
      
      // Cache result
      this.cache.set(cacheKey, result);
      this.trimCache();
      
      return result;
      
    } catch (error) {
      // Fallback to minimal analysis
      return this.createFallbackResult(imageData, performance.now() - startTime);
    }
  }

  /**
   * Basic contrast analysis
   */
  private analyzeContrast(imageData: ImageData): ContrastData {
    const { width, height, data } = imageData;
    const cellSize = this.config.gridCellSize;
    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    
    const grid: number[][] = [];
    const lowContrastAreas = [];
    let totalContrast = 0;
    let cellCount = 0;
    
    for (let gridY = 0; gridY < gridHeight; gridY++) {
      const row: number[] = [];
      
      for (let gridX = 0; gridX < gridWidth; gridX++) {
        const startX = gridX * cellSize;
        const startY = gridY * cellSize;
        const endX = Math.min(startX + cellSize, width);
        const endY = Math.min(startY + cellSize, height);
        
        const contrast = this.calculateCellContrast(data, width, startX, startY, endX, endY);
        row.push(contrast);
        totalContrast += contrast;
        cellCount++;
        
        // Mark low contrast areas
        if (contrast < 0.3) {
          lowContrastAreas.push({
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY
          });
        }
      }
      
      grid.push(row);
    }
    
    return {
      grid,
      cellSize,
      lowContrastAreas,
      meanContrast: totalContrast / cellCount
    };
  }

  private calculateCellContrast(
    data: Uint8ClampedArray,
    width: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): number {
    const intensities: number[] = [];
    
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * width + x) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        intensities.push(intensity);
      }
    }
    
    if (intensities.length === 0) return 0;
    
    // RMS contrast
    const mean = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
    return Math.sqrt(variance) / 255; // Normalize to 0-1
  }

  /**
   * Basic content classification
   */
  private classifyContent(textRegions: any[], imageData: ImageData): ContentType {
    const totalArea = imageData.width * imageData.height;
    const textArea = textRegions.reduce((sum, region) => 
      sum + (region.bounds.width * region.bounds.height), 0);
    const textDensity = textArea / totalArea;
    
    // Simple heuristics
    if (textDensity > 0.4) return 'article';
    if (textDensity > 0.2) return 'email';
    if (textRegions.length > 10) return 'ui';
    return 'mixed';
  }

  /**
   * Generate cache key for image data
   */
  private generateCacheKey(imageData: ImageData): string {
    // Simple hash based on dimensions and sample pixels
    const sampleStep = Math.floor(imageData.data.length / 50);
    let hash = 0;
    
    for (let i = 0; i < imageData.data.length; i += sampleStep) {
      hash = ((hash << 5) - hash + imageData.data[i]) & 0xffffffff;
    }
    
    return `${imageData.width}x${imageData.height}_${hash}`;
  }

  /**
   * Trim cache to prevent memory leaks
   */
  private trimCache(): void {
    const maxCacheSize = 10;
    if (this.cache.size > maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Create fallback result when analysis fails
   */
  private createFallbackResult(imageData: ImageData, processingTime: number): AnalysisResult {
    return {
      textRegions: [{
        bounds: { x: 0, y: 0, width: imageData.width, height: imageData.height },
        confidence: 0.5,
        priority: 0.5
      }],
      contrastMap: {
        grid: [[0.5]],
        cellSize: Math.max(imageData.width, imageData.height),
        lowContrastAreas: [],
        meanContrast: 0.5
      },
      contentType: 'mixed',
      processingTime,
      timestamp: Date.now()
    };
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}