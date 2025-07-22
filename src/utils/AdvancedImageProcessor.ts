// AdvancedImageProcessor.ts
// Location: src/utils/AdvancedImageProcessor.ts
// Purpose: Core for Layer 3 multi-algorithm enhancement pipeline (edge enhancement, unsharp masking, adaptive contrast)
// Follows CLAUDE.md and project best practices

export interface ProcessingRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'text' | 'image' | 'background';
  enhancement: number; // 0.0 to 2.0 multiplier
}

export interface ProcessingParameters {
  edgeEnhancement: number;     // 0.0 to 3.0
  unsharpStrength: number;     // 0.0 to 2.0  
  unsharpRadius: number;       // 0.5 to 3.0
  contrastBoost: number;       // 0.0 to 2.0
  preserveImages: boolean;     // true to protect image regions
}

/**
 * AdvancedImageProcessor
 * - Captures element content (with CSS baseline)
 * - Analyzes content regions
 * - Applies edge enhancement, unsharp masking, adaptive contrast
 * - Graceful error handling and fallback to baseline CSS
 */
export class AdvancedImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // Main processing pipeline
  async processElement(element: HTMLElement, params: ProcessingParameters): Promise<void> {
    try {
      // Step 1: Capture element with existing CSS baseline
      const imageData = await this.captureElementContent(element);
      // Step 2: Analyze content regions
      const regions = await this.analyzeContentRegions(imageData);
      // Step 3: Apply multi-algorithm processing
      const processedData = await this.applyMultiAlgorithmProcessing(imageData, regions, params);
      // Step 4: Apply result while preserving CSS baseline
      await this.applyProcessedResult(element, processedData);
    } catch (error) {
      console.error('Advanced processing failed, maintaining baseline CSS:', error);
      // Graceful degradation - baseline CSS continues working
    }
  }

  // Capture element content including CSS baseline effects
  private async captureElementContent(element: HTMLElement): Promise<ImageData> {
    const rect = element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // ADD THIS DIAGNOSTIC LINE:
    console.log('🔍 Canvas dimensions:', this.canvas.width, 'x', this.canvas.height, 'for element:', element.tagName);
    
    // This is probably where the getImageData call fails:
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  // Analyze content to identify text vs image regions
  private async analyzeContentRegions(imageData: ImageData): Promise<ProcessingRegion[]> {
    const regions: ProcessingRegion[] = [];
    const width = imageData.width;
    const height = imageData.height;
    // Simple region detection - can be enhanced with computer vision
    // For now, assume entire area is mixed content requiring intelligent processing
    regions.push({
      x: 0,
      y: 0,
      width: width,
      height: height,
      type: 'text', // Will be refined with better detection
      enhancement: 1.5 // Strong enhancement for presbyopia
    });
    return regions;
  }

  // Multi-algorithm processing pipeline
  private async applyMultiAlgorithmProcessing(
    imageData: ImageData, 
    regions: ProcessingRegion[], 
    params: ProcessingParameters
  ): Promise<ImageData> {
    let processed = new ImageData(
      new Uint8ClampedArray(imageData.data), 
      imageData.width, 
      imageData.height
    );
    // Algorithm 1: Edge Enhancement (Sobel operator)
    if (params.edgeEnhancement > 0) {
      processed = this.applyEdgeEnhancement(processed, params.edgeEnhancement);
    }
    // Algorithm 2: Unsharp Masking
    if (params.unsharpStrength > 0) {
      processed = this.applyUnsharpMasking(processed, params.unsharpStrength, params.unsharpRadius);
    }
    // Algorithm 3: Adaptive Contrast Enhancement
    if (params.contrastBoost > 0) {
      processed = this.applyAdaptiveContrast(processed, params.contrastBoost, regions);
    }
    return processed;
  }

  // Edge Enhancement - Sobel operator for presbyopia
  private applyEdgeEnhancement(imageData: ImageData, strength: number): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    // Sobel X and Y kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
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
        // Calculate edge strength
        const edgeStrength = Math.sqrt(gx * gx + gy * gy);
        const enhancement = Math.min(edgeStrength * strength, 255);
        const outputIdx = (y * width + x) * 4;
        // Apply enhancement to all RGB channels
        for (let c = 0; c < 3; c++) {
          output[outputIdx + c] = Math.min(data[outputIdx + c] + enhancement, 255);
        }
        output[outputIdx + 3] = data[outputIdx + 3]; // Preserve alpha
      }
    }
    return new ImageData(output, width, height);
  }

  // Unsharp Masking for professional sharpening
  private applyUnsharpMasking(imageData: ImageData, strength: number, radius: number): ImageData {
    // Create Gaussian blur
    const blurred = this.gaussianBlur(imageData, radius);
    const width = imageData.width;
    const height = imageData.height;
    const original = imageData.data;
    const blur = blurred.data;
    const output = new Uint8ClampedArray(original);
    // Unsharp mask formula: original + (original - blurred) * strength
    for (let i = 0; i < original.length; i += 4) {
      for (let c = 0; c < 3; c++) { // RGB channels
        const diff = original[i + c] - blur[i + c];
        output[i + c] = Math.max(0, Math.min(255, original[i + c] + diff * strength));
      }
      output[i + 3] = original[i + 3]; // Preserve alpha
    }
    return new ImageData(output, width, height);
  }

  // Gaussian blur for unsharp masking
  private gaussianBlur(imageData: ImageData, radius: number): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    // Simplified Gaussian blur - can be optimized with separable kernels
    const kernelSize = Math.ceil(radius * 2) * 2 + 1;
    const kernel: number[] = [];
    let kernelSum = 0;
    // Generate Gaussian kernel
    for (let i = 0; i < kernelSize; i++) {
      const x = i - Math.floor(kernelSize / 2);
      const value = Math.exp(-(x * x) / (2 * radius * radius));
      kernel[i] = value;
      kernelSum += value;
    }
    // Normalize kernel
    for (let i = 0; i < kernelSize; i++) {
      kernel[i] /= kernelSum;
    }
    // Apply horizontal blur
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels
          let sum = 0;
          let weightSum = 0;
          for (let k = 0; k < kernelSize; k++) {
            const px = x + k - Math.floor(kernelSize / 2);
            if (px >= 0 && px < width) {
              const idx = (y * width + px) * 4 + c;
              sum += data[idx] * kernel[k];
              weightSum += kernel[k];
            }
          }
          const outputIdx = (y * width + x) * 4 + c;
          output[outputIdx] = sum / weightSum;
        }
      }
    }
    return new ImageData(output, width, height);
  }

  // Adaptive contrast enhancement
  private applyAdaptiveContrast(
    imageData: ImageData, 
    boostAmount: number, 
    regions: ProcessingRegion[]
  ): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        // Find which region this pixel belongs to
        const region = this.findPixelRegion(x, y, regions);
        const localBoost = boostAmount * region.enhancement;
        // Apply adaptive contrast
        for (let c = 0; c < 3; c++) {
          const value = data[idx + c];
          const normalized = value / 255;
          const contrasted = ((normalized - 0.5) * localBoost) + 0.5;
          output[idx + c] = Math.max(0, Math.min(255, contrasted * 255));
        }
        output[idx + 3] = data[idx + 3]; // Preserve alpha
      }
    }
    return new ImageData(output, width, height);
  }

  private findPixelRegion(x: number, y: number, regions: ProcessingRegion[]): ProcessingRegion {
    for (const region of regions) {
      if (x >= region.x && x < region.x + region.width &&
          y >= region.y && y < region.y + region.height) {
        return region;
      }
    }
    // Default region if none found
    return { x: 0, y: 0, width: 100, height: 100, type: 'text', enhancement: 1.0 };
  }

  // Apply processed result to element
  private async applyProcessedResult(element: HTMLElement, processedData: ImageData): Promise<void> {
    // Convert processed ImageData to canvas
    this.canvas.width = processedData.width;
    this.canvas.height = processedData.height;
    this.ctx.putImageData(processedData, 0, 0);
    // Apply as background while preserving existing CSS
    const dataURL = this.canvas.toDataURL();
    // Preserve existing CSS baseline filters
    const existingFilter = element.style.filter || 
      'contrast(1.5) brightness(1.1) drop-shadow(0 0 0.3px rgba(0,0,0,0.5))';
    // Apply processed image as overlay while keeping CSS baseline
    element.style.background = `url(${dataURL}) no-repeat`;
    element.style.backgroundSize = 'cover';
    element.style.filter = existingFilter; // Maintain baseline CSS
  }
} 