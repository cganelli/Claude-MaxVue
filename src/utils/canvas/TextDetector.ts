/**
 * TextDetector - Sobel edge detection for text region identification
 */

import type { TextRegion, Rectangle, AnalysisConfig } from './types';

export class TextDetector {
  private config: AnalysisConfig;
  
  constructor(config: AnalysisConfig) {
    this.config = config;
  }
  
  /**
   * Detect text regions in image data
   */
  detectTextRegions(imageData: ImageData): TextRegion[] {
    if (imageData.width === 0 || imageData.height === 0) {
      return [];
    }
    
    // Performance optimization: downsample large images
    const processedData = this.optimizeForPerformance(imageData);
    const scale = imageData.width / processedData.width;
    
    // Step 1: Edge detection
    const edges = this.detectEdges(processedData);
    
    // Step 2: Find connected components
    const components = this.findConnectedComponents(edges, processedData.width, processedData.height);
    
    // Step 3: Filter and merge regions
    const filtered = this.filterRegions(components);
    const merged = this.mergeNearbyRegions(filtered);
    
    // Step 4: Calculate priority and scale back up
    const regions = this.assignPriority(merged);
    
    // Scale regions back to original size
    return this.scaleRegions(regions, scale);
  }
  
  /**
   * Sobel edge detection
   */
  detectEdges(imageData: ImageData): Float32Array {
    const { width, height, data } = imageData;
    const edges = new Float32Array(width * height);
    
    if (width <= 1 || height <= 1) {
      return edges;
    }
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    // Apply Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0;
        let gy = 0;
        
        // Convolve with kernels
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            
            gx += gray * sobelX[kernelIdx];
            gy += gray * sobelY[kernelIdx];
          }
        }
        
        // Magnitude
        edges[y * width + x] = Math.sqrt(gx * gx + gy * gy) / 255;
      }
    }
    
    return edges;
  }
  
  private findConnectedComponents(edges: Float32Array, width: number, height: number): TextRegion[] {
    const visited = new Array(width * height).fill(false);
    const regions: TextRegion[] = [];
    const threshold = this.config.sobelThreshold;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        
        if (!visited[idx] && edges[idx] > threshold) {
          const component = this.bfs(edges, visited, x, y, width, height, threshold);
          if (component) {
            regions.push(component);
          }
        }
      }
    }
    
    return regions;
  }
  
  private bfs(
    edges: Float32Array,
    visited: boolean[],
    startX: number,
    startY: number,
    width: number,
    height: number,
    threshold: number
  ): TextRegion | null {
    const queue: Array<{x: number, y: number}> = [{x: startX, y: startY}];
    let pixels = 0;
    let edgeSum = 0;
    let minX = startX, maxX = startX, minY = startY, maxY = startY;
    const maxPixels = 10000; // Limit to prevent stack overflow
    
    while (queue.length > 0 && pixels < maxPixels) {
      const {x, y} = queue.shift()!;
      const idx = y * width + x;
      
      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx]) {
        continue;
      }
      
      if (edges[idx] <= threshold) {
        continue;
      }
      
      visited[idx] = true;
      pixels++;
      edgeSum += edges[idx];
      
      // Update bounding box
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      // Add neighbors (with bounds check)
      if (x + 1 < width && !visited[y * width + (x + 1)]) queue.push({x: x + 1, y});
      if (x > 0 && !visited[y * width + (x - 1)]) queue.push({x: x - 1, y});
      if (y + 1 < height && !visited[(y + 1) * width + x]) queue.push({x, y: y + 1});
      if (y > 0 && !visited[(y - 1) * width + x]) queue.push({x, y: y - 1});
    }
    
    if (pixels < 10) { // Too small
      return null;
    }
    
    const bounds: Rectangle = {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
    
    // Calculate confidence
    const avgEdgeStrength = edgeSum / pixels;
    const fillRatio = pixels / (bounds.width * bounds.height);
    const confidence = Math.min(avgEdgeStrength * fillRatio * 2, 1);
    
    return {
      bounds,
      confidence,
      priority: 0 // Will be calculated later
    };
  }
  
  private filterRegions(regions: TextRegion[]): TextRegion[] {
    return regions.filter(region => {
      const area = region.bounds.width * region.bounds.height;
      return area >= this.config.minTextSize;
    });
  }
  
  private mergeNearbyRegions(regions: TextRegion[]): TextRegion[] {
    if (regions.length <= 1) return regions;
    
    const merged: TextRegion[] = [];
    const used = new Array(regions.length).fill(false);
    const mergeDistance = 20; // pixels
    
    for (let i = 0; i < regions.length; i++) {
      if (used[i]) continue;
      
      const group = [regions[i]];
      used[i] = true;
      
      // Find nearby regions
      for (let j = i + 1; j < regions.length; j++) {
        if (used[j]) continue;
        
        const dist = this.regionDistance(regions[i].bounds, regions[j].bounds);
        if (dist < mergeDistance) {
          group.push(regions[j]);
          used[j] = true;
        }
      }
      
      // Merge group
      if (group.length === 1) {
        merged.push(group[0]);
      } else {
        merged.push(this.mergeGroup(group));
      }
    }
    
    return merged;
  }
  
  private regionDistance(r1: Rectangle, r2: Rectangle): number {
    // Distance between closest edges
    const xDist = Math.max(0, Math.max(r1.x - (r2.x + r2.width), r2.x - (r1.x + r1.width)));
    const yDist = Math.max(0, Math.max(r1.y - (r2.y + r2.height), r2.y - (r1.y + r1.height)));
    return Math.sqrt(xDist * xDist + yDist * yDist);
  }
  
  private mergeGroup(group: TextRegion[]): TextRegion {
    const minX = Math.min(...group.map(r => r.bounds.x));
    const minY = Math.min(...group.map(r => r.bounds.y));
    const maxX = Math.max(...group.map(r => r.bounds.x + r.bounds.width));
    const maxY = Math.max(...group.map(r => r.bounds.y + r.bounds.height));
    
    const bounds: Rectangle = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
    
    const avgConfidence = group.reduce((sum, r) => sum + r.confidence, 0) / group.length;
    
    return {
      bounds,
      confidence: avgConfidence,
      priority: 0
    };
  }
  
  private optimizeForPerformance(imageData: ImageData): ImageData {
    // Downsample if image is too large for performance
    const maxDimension = 1200; // Max width or height for processing
    const { width, height } = imageData;
    
    if (width <= maxDimension && height <= maxDimension) {
      return imageData; // No downsampling needed
    }
    
    // Calculate scale factor
    const scale = Math.min(maxDimension / width, maxDimension / height);
    const newWidth = Math.floor(width * scale);
    const newHeight = Math.floor(height * scale);
    
    // Create downsampled image data
    const newData = new Uint8ClampedArray(newWidth * newHeight * 4);
    
    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.floor(x / scale);
        const srcY = Math.floor(y / scale);
        const srcIdx = (srcY * width + srcX) * 4;
        const dstIdx = (y * newWidth + x) * 4;
        
        newData[dstIdx] = imageData.data[srcIdx];
        newData[dstIdx + 1] = imageData.data[srcIdx + 1];
        newData[dstIdx + 2] = imageData.data[srcIdx + 2];
        newData[dstIdx + 3] = imageData.data[srcIdx + 3];
      }
    }
    
    return { data: newData, width: newWidth, height: newHeight, colorSpace: imageData.colorSpace };
  }
  
  private scaleRegions(regions: TextRegion[], scale: number): TextRegion[] {
    if (scale === 1) return regions;
    
    return regions.map(region => ({
      ...region,
      bounds: {
        x: Math.round(region.bounds.x * scale),
        y: Math.round(region.bounds.y * scale),
        width: Math.round(region.bounds.width * scale),
        height: Math.round(region.bounds.height * scale)
      }
    }));
  }
  
  private assignPriority(regions: TextRegion[]): TextRegion[] {
    if (regions.length === 0) return regions;
    
    // Assign priority based on size and confidence
    const maxArea = Math.max(...regions.map(r => r.bounds.width * r.bounds.height));
    
    return regions.map(region => {
      const area = region.bounds.width * region.bounds.height;
      const sizeFactor = maxArea > 0 ? area / maxArea : 0;
      const priority = (sizeFactor * 0.5 + region.confidence * 0.5);
      
      return { ...region, priority };
    });
  }
}