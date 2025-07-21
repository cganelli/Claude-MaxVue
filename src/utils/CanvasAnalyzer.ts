/**
 * Canvas Analysis System
 * 
 * Comprehensive Canvas-based content analysis for text detection, contrast analysis,
 * and content classification to optimize presbyopia correction.
 */

import type {
  CanvasAnalysisConfig,
  CanvasAnalysisResult,
  TextRegion,
  ContrastMap,
  ContentClassification,
  BoundingRect,
  TextRegionType,
  ContentType,
  ProcessingStrategy,
  AnalysisCache,
  CacheStats,
  CanvasAnalysisError,
  PerformanceMetrics,
  EnhancementMap,
  ContentCharacteristics
} from '../types/canvas-analysis';

export class CanvasAnalyzer {
  private config: CanvasAnalysisConfig;
  private cache: Map<string, CanvasAnalysisResult>;
  private cacheStats: CacheStats;

  constructor(config: CanvasAnalysisConfig) {
    this.config = config;
    this.cache = new Map();
    this.cacheStats = {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      cacheSize: 0,
      memoryUsage: 0
    };
  }

  /**
   * Main analysis function - analyzes content and returns comprehensive results
   */
  async analyzeContent(imageData: ImageData): Promise<CanvasAnalysisResult> {
    const startTime = performance.now();
    
    try {
      // Validate input
      this.validateImageData(imageData);
      
      // Check cache first
      const cacheKey = this.generateCacheKey(imageData);
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Start analysis with timeout protection
      const analysisPromise = this.performAnalysis(imageData);
      const timeoutPromise = this.createTimeoutPromise();
      
      const result = await Promise.race([analysisPromise, timeoutPromise]);
      
      // Update processing time
      result.processingTime = performance.now() - startTime;
      result.timestamp = Date.now();
      result.canvasSize = { width: imageData.width, height: imageData.height };
      result.devicePixelRatio = window.devicePixelRatio || 1;
      
      // Cache result
      this.setInCache(cacheKey, result);
      
      return result;
    } catch (error) {
      // Provide fallback result on error
      return this.createFallbackResult(imageData, performance.now() - startTime);
    }
  }

  /**
   * Detect edges using Sobel operator
   */
  async detectEdges(imageData: ImageData): Promise<Float32Array> {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const edges = new Float32Array(width * height);
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    // Convert to grayscale and apply Sobel
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0;
        let gy = 0;
        
        // Apply Sobel kernels
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            
            gx += gray * sobelX[kernelIdx];
            gy += gray * sobelY[kernelIdx];
          }
        }
        
        // Calculate edge magnitude
        const magnitude = Math.sqrt(gx * gx + gy * gy) / 255;
        edges[y * width + x] = magnitude;
      }
    }
    
    return edges;
  }

  /**
   * Get current configuration
   */
  getConfig(): CanvasAnalysisConfig {
    return { ...this.config };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return { ...this.cacheStats };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CanvasAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheStats = {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      cacheSize: 0,
      memoryUsage: 0
    };
  }

  // Private implementation methods

  private async performAnalysis(imageData: ImageData): Promise<CanvasAnalysisResult> {
    // Parallel analysis execution for performance
    const [textRegions, contrastMap, contentClassification] = await Promise.all([
      this.detectTextRegions(imageData),
      this.analyzeContrast(imageData),
      this.classifyContent(imageData)
    ]);

    return {
      textRegions,
      contrastMap,
      contentClassification,
      processingTime: 0, // Will be set by caller
      timestamp: 0,      // Will be set by caller
      canvasSize: { width: imageData.width, height: imageData.height },
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }

  private async detectTextRegions(imageData: ImageData): Promise<TextRegion[]> {
    // Edge detection
    const edges = await this.detectEdges(imageData);
    
    // Find connected components (text regions)
    const regions = this.findConnectedComponents(edges, imageData.width, imageData.height);
    
    // Filter and validate regions
    const validRegions = regions.filter(region => 
      region.bounds.width >= this.config.textDetection.minRegionSize &&
      region.bounds.width <= this.config.textDetection.maxRegionSize &&
      region.bounds.height >= this.config.textDetection.minRegionSize &&
      region.bounds.height <= this.config.textDetection.maxRegionSize &&
      region.confidence >= this.config.textDetection.minConfidence
    );

    // Merge nearby regions
    const mergedRegions = this.mergeNearbyRegions(validRegions);
    
    // Estimate font sizes and classify region types
    return mergedRegions.map(region => ({
      ...region,
      estimatedFontSize: this.estimateFontSize(region, imageData),
      regionType: this.classifyTextRegion(region, imageData)
    }));
  }

  private findConnectedComponents(edges: Float32Array, width: number, height: number): TextRegion[] {
    const visited = new Array(width * height).fill(false);
    const regions: TextRegion[] = [];
    const threshold = this.config.textDetection.sobelThreshold;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        
        if (!visited[idx] && edges[idx] > threshold) {
          const region = this.floodFill(edges, visited, x, y, width, height, threshold);
          if (region) {
            regions.push(region);
          }
        }
      }
    }

    return regions;
  }

  private floodFill(
    edges: Float32Array, 
    visited: boolean[], 
    startX: number, 
    startY: number, 
    width: number, 
    height: number, 
    threshold: number
  ): TextRegion | null {
    const stack: Array<{x: number, y: number}> = [{x: startX, y: startY}];
    const points: Array<{x: number, y: number}> = [];
    let edgeSum = 0;

    while (stack.length > 0) {
      const {x, y} = stack.pop()!;
      const idx = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || edges[idx] <= threshold) {
        continue;
      }

      visited[idx] = true;
      points.push({x, y});
      edgeSum += edges[idx];

      // Add neighbors
      stack.push({x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1});
    }

    if (points.length < this.config.textDetection.minRegionSize) {
      return null;
    }

    // Calculate bounding rectangle
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const bounds: BoundingRect = {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };

    // Calculate confidence based on edge density and region coherence
    const area = bounds.width * bounds.height;
    const edgeDensity = points.length / area;
    const averageEdgeStrength = edgeSum / points.length;
    const confidence = Math.min(edgeDensity * averageEdgeStrength * 2, 1.0);

    return {
      bounds,
      confidence,
      textDensity: edgeDensity,
      estimatedFontSize: 0, // Will be calculated later
      edgeIntensity: averageEdgeStrength,
      regionType: 'body-text' // Will be classified later
    };
  }

  private mergeNearbyRegions(regions: TextRegion[]): TextRegion[] {
    const mergeDistance = this.config.textDetection.mergeDistance;
    const merged: TextRegion[] = [];
    const used = new Array(regions.length).fill(false);

    for (let i = 0; i < regions.length; i++) {
      if (used[i]) continue;

      const group = [regions[i]];
      used[i] = true;

      // Find nearby regions to merge
      for (let j = i + 1; j < regions.length; j++) {
        if (used[j]) continue;

        const distance = this.calculateRegionDistance(regions[i].bounds, regions[j].bounds);
        if (distance <= mergeDistance) {
          group.push(regions[j]);
          used[j] = true;
        }
      }

      // Merge regions in group
      if (group.length === 1) {
        merged.push(group[0]);
      } else {
        merged.push(this.mergeRegionGroup(group));
      }
    }

    return merged;
  }

  private calculateRegionDistance(rect1: BoundingRect, rect2: BoundingRect): number {
    const centerX1 = rect1.x + rect1.width / 2;
    const centerY1 = rect1.y + rect1.height / 2;
    const centerX2 = rect2.x + rect2.width / 2;
    const centerY2 = rect2.y + rect2.height / 2;

    return Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2));
  }

  private mergeRegionGroup(regions: TextRegion[]): TextRegion {
    // Calculate combined bounding rectangle
    const minX = Math.min(...regions.map(r => r.bounds.x));
    const maxX = Math.max(...regions.map(r => r.bounds.x + r.bounds.width));
    const minY = Math.min(...regions.map(r => r.bounds.y));
    const maxY = Math.max(...regions.map(r => r.bounds.y + r.bounds.height));

    const bounds: BoundingRect = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    // Average other properties
    const avgConfidence = regions.reduce((sum, r) => sum + r.confidence, 0) / regions.length;
    const avgTextDensity = regions.reduce((sum, r) => sum + r.textDensity, 0) / regions.length;
    const avgEdgeIntensity = regions.reduce((sum, r) => sum + r.edgeIntensity, 0) / regions.length;

    return {
      bounds,
      confidence: avgConfidence,
      textDensity: avgTextDensity,
      estimatedFontSize: 0, // Will be calculated later
      edgeIntensity: avgEdgeIntensity,
      regionType: 'body-text' // Will be classified later
    };
  }

  private estimateFontSize(region: TextRegion, imageData: ImageData): number {
    if (!this.config.textDetection.enableFontSizeEstimation) {
      return 12; // Default estimate
    }

    // Analyze text line height within the region
    const bounds = region.bounds;
    const data = imageData.data;
    const width = imageData.width;
    
    // Sample vertical intensity variations in the region
    const centerX = Math.floor(bounds.x + bounds.width / 2);
    const intensities: number[] = [];
    
    for (let y = bounds.y; y < bounds.y + bounds.height && y < imageData.height; y++) {
      if (centerX < width) {
        const idx = (y * width + centerX) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        intensities.push(intensity);
      }
    }
    
    // Find line spacing by detecting intensity transitions
    let transitions = 0;
    let lastIntensity = intensities[0] || 0;
    
    for (let i = 1; i < intensities.length; i++) {
      const diff = Math.abs(intensities[i] - lastIntensity);
      if (diff > 50) { // Threshold for significant transition
        transitions++;
      }
      lastIntensity = intensities[i];
    }
    
    // Estimate font size based on transitions and region height
    const lineCount = Math.max(1, Math.floor(transitions / 2));
    const estimatedLineHeight = bounds.height / lineCount;
    
    // Font size is typically 75% of line height
    return Math.max(8, Math.min(72, estimatedLineHeight * 0.75));
  }

  private classifyTextRegion(region: TextRegion, imageData: ImageData): TextRegionType {
    const fontSize = region.estimatedFontSize;
    const area = region.bounds.width * region.bounds.height;
    const aspectRatio = region.bounds.width / region.bounds.height;

    // Classification based on characteristics
    if (fontSize > 24) {
      return 'heading';
    } else if (fontSize < 10) {
      return 'small-text';
    } else if (area < 500 && aspectRatio > 3) {
      return 'label';
    } else if (area < 1000 && region.confidence > 0.8) {
      return 'ui-element';
    } else {
      return 'body-text';
    }
  }

  private async analyzeContrast(imageData: ImageData): Promise<ContrastMap> {
    const cellSize = this.config.contrastAnalysis.gridCellSize;
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    const contrastGrid: number[][] = [];
    
    let totalContrast = 0;
    let minContrast = 1;
    let maxContrast = 0;
    let cellCount = 0;

    // Calculate contrast for each grid cell
    for (let gridY = 0; gridY < gridHeight; gridY++) {
      const row: number[] = [];
      
      for (let gridX = 0; gridX < gridWidth; gridX++) {
        const startX = gridX * cellSize;
        const startY = gridY * cellSize;
        const endX = Math.min(startX + cellSize, width);
        const endY = Math.min(startY + cellSize, height);
        
        const contrast = this.calculateLocalContrast(data, width, startX, startY, endX, endY);
        row.push(contrast);
        
        totalContrast += contrast;
        minContrast = Math.min(minContrast, contrast);
        maxContrast = Math.max(maxContrast, contrast);
        cellCount++;
      }
      
      contrastGrid.push(row);
    }

    const meanContrast = totalContrast / cellCount;
    
    // Generate enhancement map
    const enhancementMap = this.generateEnhancementMap(contrastGrid, meanContrast);

    return {
      contrastGrid,
      gridWidth,
      gridHeight,
      cellSize,
      meanContrast,
      minContrast,
      maxContrast,
      enhancementMap
    };
  }

  private calculateLocalContrast(
    data: Uint8ClampedArray, 
    width: number, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): number {
    const method = this.config.contrastAnalysis.contrastMethod;
    const intensities: number[] = [];

    // Collect intensities in the region
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * width + x) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        intensities.push(intensity);
      }
    }

    if (intensities.length === 0) return 0;

    // Calculate contrast based on selected method
    switch (method) {
      case 'rms':
        return this.calculateRMSContrast(intensities);
      case 'michelson':
        return this.calculateMichelsonContrast(intensities);
      case 'weber':
        return this.calculateWeberContrast(intensities);
      default:
        return this.calculateRMSContrast(intensities);
    }
  }

  private calculateRMSContrast(intensities: number[]): number {
    const mean = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
    return Math.sqrt(variance) / 255; // Normalize to 0-1
  }

  private calculateMichelsonContrast(intensities: number[]): number {
    const max = Math.max(...intensities);
    const min = Math.min(...intensities);
    return (max - min) / (max + min + 1); // +1 to avoid division by zero
  }

  private calculateWeberContrast(intensities: number[]): number {
    const max = Math.max(...intensities);
    const mean = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    return (max - mean) / (mean + 1); // +1 to avoid division by zero
  }

  private generateEnhancementMap(contrastGrid: number[][], meanContrast: number): EnhancementMap {
    const sensitivity = this.config.contrastAnalysis.enhancementSensitivity;
    const maxEnhancement = this.config.contrastAnalysis.maxEnhancement;
    
    const strengthGrid: number[][] = [];
    const diopterAdjustmentGrid: number[][] = [];
    const priorityRegions: BoundingRect[] = [];

    for (let y = 0; y < contrastGrid.length; y++) {
      const strengthRow: number[] = [];
      const diopterRow: number[] = [];
      
      for (let x = 0; x < contrastGrid[y].length; x++) {
        const contrast = contrastGrid[y][x];
        
        // Enhancement strength inversely related to contrast
        const strengthFactor = (meanContrast - contrast) / meanContrast;
        const enhancementStrength = Math.max(0, Math.min(maxEnhancement, 
          strengthFactor * sensitivity
        ));
        
        strengthRow.push(enhancementStrength);
        
        // Diopter adjustment for presbyopia correction
        // Higher adjustment for lower contrast areas
        const diopterAdjustment = enhancementStrength * 0.5; // Max 0.5D adjustment
        diopterRow.push(diopterAdjustment);
        
        // Mark high-priority regions (low contrast text areas)
        if (enhancementStrength > 0.7) {
          const cellSize = this.config.contrastAnalysis.gridCellSize;
          priorityRegions.push({
            x: x * cellSize,
            y: y * cellSize,
            width: cellSize,
            height: cellSize
          });
        }
      }
      
      strengthGrid.push(strengthRow);
      diopterAdjustmentGrid.push(diopterRow);
    }

    return {
      strengthGrid,
      diopterAdjustmentGrid,
      priorityRegions
    };
  }

  private async classifyContent(imageData: ImageData): Promise<ContentClassification> {
    // Analyze content characteristics
    const characteristics = await this.analyzeContentCharacteristics(imageData);
    
    // Classify primary content type
    const primaryType = this.determineContentType(characteristics);
    
    // Calculate confidence
    const confidence = this.calculateClassificationConfidence(characteristics, primaryType);
    
    // Generate processing strategy
    const processingStrategy = this.generateProcessingStrategy(primaryType, characteristics);

    return {
      primaryType,
      confidence,
      characteristics,
      processingStrategy
    };
  }

  private async analyzeContentCharacteristics(imageData: ImageData): Promise<ContentCharacteristics> {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Analyze text density
    const textPixels = this.countTextPixels(data, width, height);
    const textDensity = textPixels / (width * height);
    
    // Analyze color properties
    const colorStats = this.analyzeColors(data);
    
    // Analyze layout (simplified)
    const layoutStats = this.analyzeLayout(imageData);

    return {
      textDensity,
      lineSpacing: layoutStats.averageLineSpacing,
      columnCount: layoutStats.columnCount,
      backgroundType: colorStats.backgroundType,
      colorVariance: colorStats.variance,
      hasHeaders: layoutStats.hasHeaders,
      hasSidebars: layoutStats.hasSidebars,
      hasButtons: layoutStats.hasButtons,
      fontSizeVariance: layoutStats.fontSizeVariance,
      averageFontSize: layoutStats.averageFontSize
    };
  }

  private countTextPixels(data: Uint8ClampedArray, width: number, height: number): number {
    let textPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const intensity = (r + g + b) / 3;
      
      // Consider dark pixels as potential text
      if (intensity < 128) {
        textPixels++;
      }
    }
    
    return textPixels;
  }

  private analyzeColors(data: Uint8ClampedArray): {backgroundType: 'light' | 'dark' | 'mixed', variance: number} {
    const intensities: number[] = [];
    
    for (let i = 0; i < data.length; i += 4) {
      const intensity = (data[i] + data[i + 1] + data[i + 2]) / 3;
      intensities.push(intensity);
    }
    
    const mean = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
    
    let backgroundType: 'light' | 'dark' | 'mixed';
    if (mean > 200) {
      backgroundType = 'light';
    } else if (mean < 100) {
      backgroundType = 'dark';
    } else {
      backgroundType = 'mixed';
    }
    
    return {
      backgroundType,
      variance: variance / (255 * 255) // Normalize
    };
  }

  private analyzeLayout(imageData: ImageData): {
    averageLineSpacing: number;
    columnCount: number;
    hasHeaders: boolean;
    hasSidebars: boolean;
    hasButtons: boolean;
    fontSizeVariance: number;
    averageFontSize: number;
  } {
    // Simplified layout analysis
    const width = imageData.width;
    const height = imageData.height;
    
    // Detect horizontal structures (lines of text)
    const horizontalDensity = this.analyzeHorizontalDensity(imageData);
    const lineSpacing = this.estimateLineSpacing(horizontalDensity);
    
    return {
      averageLineSpacing: lineSpacing,
      columnCount: 1, // Simplified
      hasHeaders: horizontalDensity[0] > horizontalDensity[Math.floor(horizontalDensity.length / 2)],
      hasSidebars: width > height && this.detectVerticalStructures(imageData),
      hasButtons: this.detectButtonLikeStructures(imageData),
      fontSizeVariance: 0.2, // Simplified
      averageFontSize: 14 // Simplified
    };
  }

  private analyzeHorizontalDensity(imageData: ImageData): number[] {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const density: number[] = [];
    
    for (let y = 0; y < height; y++) {
      let lineTextPixels = 0;
      
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        if (intensity < 128) { // Dark pixel (potential text)
          lineTextPixels++;
        }
      }
      
      density.push(lineTextPixels / width);
    }
    
    return density;
  }

  private estimateLineSpacing(horizontalDensity: number[]): number {
    // Find peaks in horizontal density (text lines)
    const peaks: number[] = [];
    
    for (let i = 1; i < horizontalDensity.length - 1; i++) {
      if (horizontalDensity[i] > horizontalDensity[i - 1] && 
          horizontalDensity[i] > horizontalDensity[i + 1] &&
          horizontalDensity[i] > 0.1) { // Threshold for text line
        peaks.push(i);
      }
    }
    
    if (peaks.length < 2) return 20; // Default spacing
    
    // Calculate average spacing between peaks
    let totalSpacing = 0;
    for (let i = 1; i < peaks.length; i++) {
      totalSpacing += peaks[i] - peaks[i - 1];
    }
    
    return totalSpacing / (peaks.length - 1);
  }

  private detectVerticalStructures(imageData: ImageData): boolean {
    // Simplified: check if there are distinct vertical regions
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    const leftThird = Math.floor(width / 3);
    const rightThird = Math.floor(width * 2 / 3);
    
    let leftDensity = 0;
    let centerDensity = 0;
    let rightDensity = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        if (intensity < 128) {
          if (x < leftThird) leftDensity++;
          else if (x < rightThird) centerDensity++;
          else rightDensity++;
        }
      }
    }
    
    // Check for significant difference in density (indicating columns)
    const maxDensity = Math.max(leftDensity, centerDensity, rightDensity);
    const minDensity = Math.min(leftDensity, centerDensity, rightDensity);
    
    return (maxDensity - minDensity) / maxDensity > 0.3;
  }

  private detectButtonLikeStructures(imageData: ImageData): boolean {
    // Simplified: look for rectangular regions with borders
    // This is a basic implementation
    return false; // Placeholder
  }

  private determineContentType(characteristics: ContentCharacteristics): ContentType {
    const thresholds = this.config.contentClassification.textDensityThresholds;
    
    if (characteristics.textDensity > thresholds.article && 
        characteristics.lineSpacing > 15 && 
        !characteristics.hasButtons) {
      return 'article';
    } else if (characteristics.textDensity > thresholds.email && 
               characteristics.hasHeaders) {
      return 'email';
    } else if (characteristics.hasButtons || 
               characteristics.hasSidebars || 
               characteristics.textDensity < thresholds.ui) {
      return 'ui-interface';
    } else if (characteristics.textDensity > 0.4) {
      return 'document';
    } else {
      return 'mixed';
    }
  }

  private calculateClassificationConfidence(
    characteristics: ContentCharacteristics, 
    primaryType: ContentType
  ): number {
    // Simplified confidence calculation
    let confidence = 0.5; // Base confidence
    
    switch (primaryType) {
      case 'article':
        if (characteristics.textDensity > 0.5) confidence += 0.3;
        if (characteristics.lineSpacing > 15) confidence += 0.2;
        break;
      case 'email':
        if (characteristics.hasHeaders) confidence += 0.3;
        if (characteristics.textDensity > 0.3) confidence += 0.2;
        break;
      case 'ui-interface':
        if (characteristics.hasButtons) confidence += 0.3;
        if (characteristics.textDensity < 0.3) confidence += 0.2;
        break;
    }
    
    return Math.min(1.0, confidence);
  }

  private generateProcessingStrategy(
    contentType: ContentType, 
    characteristics: ContentCharacteristics
  ): ProcessingStrategy {
    let contrastBoost = 1.0;
    let edgeEnhancement = 1.0;
    let processingPriority: 'speed' | 'quality' | 'balanced' = 'balanced';
    
    // Adjust based on content type
    switch (contentType) {
      case 'article':
      case 'document':
        contrastBoost = 1.3;
        edgeEnhancement = 1.2;
        processingPriority = 'quality';
        break;
      case 'email':
        contrastBoost = 1.2;
        edgeEnhancement = 1.1;
        processingPriority = 'balanced';
        break;
      case 'ui-interface':
        contrastBoost = 1.1;
        edgeEnhancement = 1.3;
        processingPriority = 'speed';
        break;
      case 'mixed':
        contrastBoost = 1.1;
        edgeEnhancement = 1.1;
        processingPriority = 'balanced';
        break;
    }
    
    // Adjust for background type
    if (characteristics.backgroundType === 'dark') {
      contrastBoost *= 1.2;
    }
    
    return {
      contrastBoost,
      edgeEnhancement,
      regionAdjustments: [], // Will be populated based on specific regions
      processingPriority,
      useWebGL: true
    };
  }

  // Cache management
  private generateCacheKey(imageData: ImageData): string {
    // Simple hash based on image dimensions and sample pixels
    const sampleStep = Math.floor(imageData.data.length / 100);
    let hash = 0;
    
    for (let i = 0; i < imageData.data.length; i += sampleStep) {
      hash = ((hash << 5) - hash + imageData.data[i]) & 0xffffffff;
    }
    
    return `${imageData.width}x${imageData.height}_${hash}`;
  }

  private getFromCache(key: string): CanvasAnalysisResult | null {
    this.cacheStats.totalRequests++;
    
    if (this.cache.has(key)) {
      this.cacheStats.hitRate = (this.cacheStats.hitRate * (this.cacheStats.totalRequests - 1) + 1) / this.cacheStats.totalRequests;
      return this.cache.get(key)!;
    } else {
      this.cacheStats.missRate = (this.cacheStats.missRate * (this.cacheStats.totalRequests - 1) + 1) / this.cacheStats.totalRequests;
      return null;
    }
  }

  private setInCache(key: string, result: CanvasAnalysisResult): void {
    if (this.cache.size >= this.config.performance.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, result);
    this.cacheStats.cacheSize = this.cache.size;
  }

  // Utility methods
  private validateImageData(imageData: ImageData): void {
    if (!imageData || imageData.width <= 0 || imageData.height <= 0) {
      throw new Error('Invalid image data provided');
    }
    
    if (!imageData.data || imageData.data.length === 0) {
      throw new Error('Image data is empty');
    }
  }

  private createTimeoutPromise(): Promise<CanvasAnalysisResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Analysis timeout'));
      }, this.config.performance.maxProcessingTime);
    });
  }

  private createFallbackResult(imageData: ImageData, processingTime: number): CanvasAnalysisResult {
    // Provide minimal fallback result when analysis fails
    return {
      textRegions: [{
        bounds: { x: 0, y: 0, width: imageData.width, height: imageData.height },
        confidence: 0.5,
        textDensity: 0.3,
        estimatedFontSize: 14,
        edgeIntensity: 0.2,
        regionType: 'body-text'
      }],
      contrastMap: {
        contrastGrid: [[0.5]],
        gridWidth: 1,
        gridHeight: 1,
        cellSize: Math.max(imageData.width, imageData.height),
        meanContrast: 0.5,
        minContrast: 0.5,
        maxContrast: 0.5,
        enhancementMap: {
          strengthGrid: [[0.5]],
          diopterAdjustmentGrid: [[0.25]],
          priorityRegions: []
        }
      },
      contentClassification: {
        primaryType: 'mixed',
        confidence: 0.5,
        characteristics: {
          textDensity: 0.3,
          lineSpacing: 16,
          columnCount: 1,
          backgroundType: 'light',
          colorVariance: 0.1,
          hasHeaders: false,
          hasSidebars: false,
          hasButtons: false,
          fontSizeVariance: 0.1,
          averageFontSize: 14
        },
        processingStrategy: {
          contrastBoost: 1.1,
          edgeEnhancement: 1.1,
          regionAdjustments: [],
          processingPriority: 'balanced',
          useWebGL: true
        }
      },
      processingTime,
      timestamp: Date.now(),
      canvasSize: { width: imageData.width, height: imageData.height },
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }
}