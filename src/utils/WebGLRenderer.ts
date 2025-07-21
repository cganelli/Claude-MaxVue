/**
 * WebGLRenderer - GPU-accelerated presbyopia correction engine
 * 
 * Provides real-time vision correction using WebGL shaders with fallback to CSS filters.
 * Targets 5.0/10 effectiveness (67% improvement over CSS-only approach).
 * 
 * Architecture:
 * 1. WebGL GPU processing with custom presbyopia shaders
 * 2. Smart fallback to CSS filters for unsupported devices
 * 3. Performance monitoring and optimization
 * 4. Seamless integration with existing VisionCorrectionEngine
 */

export interface WebGLSettings {
  readingVision: number; // 0.00D to +3.5D (presbyopia correction)
  contrastBoost: number; // 0-100
  edgeEnhancement: number; // 0-100
  isEnabled: boolean;
  useWebGL: boolean; // Toggle between WebGL and CSS processing
}

export interface WebGLPerformanceMetrics {
  fps: number;
  processingTime: number; // milliseconds
  memoryUsage: number; // MB
  batteryImpact: number; // percentage
  fallbackTriggered: boolean;
}

export interface WebGLProcessingResult {
  success: boolean;
  processedCanvas?: HTMLCanvasElement;
  fallbackUsed: boolean;
  performanceMetrics: WebGLPerformanceMetrics;
  error?: string;
}

export interface WebGLContextInfo {
  vendor: string;
  renderer: string;
  version: string;
  extensions: string[];
}

export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private settings: WebGLSettings;
  private performanceMetrics: WebGLPerformanceMetrics;
  private isInitialized: boolean = false;
  private fallbackToCSS: boolean = false;
  private shaderCache: Map<string, string> = new Map();

  // Shader locations
  private uniformLocations: {
    uReadingVision: WebGLUniformLocation | null;
    uContrastBoost: WebGLUniformLocation | null;
    uEdgeEnhancement: WebGLUniformLocation | null;
    uTexture: WebGLUniformLocation | null;
    uResolution: WebGLUniformLocation | null;
  } = {
    uReadingVision: null,
    uContrastBoost: null,
    uEdgeEnhancement: null,
    uTexture: null,
    uResolution: null,
  };

  // Buffers
  private positionBuffer: WebGLBuffer | null = null;
  private textureCoordBuffer: WebGLBuffer | null = null;

  constructor(settings: WebGLSettings) {
    this.settings = settings;
    this.canvas = document.createElement('canvas');
    this.performanceMetrics = {
      fps: 0,
      processingTime: 0,
      memoryUsage: 0,
      batteryImpact: 0,
      fallbackTriggered: false,
    };
  }

  /**
   * Initialize WebGL context and shaders
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('🎯 WebGLRenderer: Starting initialization...');
      
      // Check WebGL support
      if (!this.checkWebGLSupport()) {
        console.warn('🚧 WebGL not supported, falling back to CSS filters');
        this.fallbackToCSS = true;
        return false;
      }

      // Initialize WebGL context
      const glContext = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (!glContext) {
        throw new Error('Failed to get WebGL context');
      }
      this.gl = glContext as WebGLRenderingContext;

      console.log('🎯 WebGLRenderer: WebGL context created successfully');

      // Load external shader files
      await this.loadShaderFiles();
      
      // Create and compile shaders
      await this.createShaders();
      
      // Initialize buffers
      this.initializeBuffers();
      
      // Set initial uniforms
      this.updateUniforms();
      
      this.isInitialized = true;
      console.log('✅ WebGL renderer initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ WebGL initialization failed:', error);
      this.fallbackToCSS = true;
      return false;
    }
  }

  /**
   * Load external shader files
   */
  private async loadShaderFiles(): Promise<void> {
    try {
      console.log('🎯 WebGLRenderer: Loading shader files...');
      
      // Load vertex shader
      const vertexResponse = await fetch('/src/shaders/presbyopia.vertex');
      if (!vertexResponse.ok) {
        throw new Error(`Failed to load vertex shader: ${vertexResponse.statusText}`);
      }
      const vertexSource = await vertexResponse.text();
      this.shaderCache.set('vertex', vertexSource);
      
      // Load fragment shader
      const fragmentResponse = await fetch('/src/shaders/presbyopia.fragment');
      if (!fragmentResponse.ok) {
        throw new Error(`Failed to load fragment shader: ${fragmentResponse.statusText}`);
      }
      const fragmentSource = await fragmentResponse.text();
      this.shaderCache.set('fragment', fragmentSource);
      
      console.log('✅ WebGLRenderer: Shader files loaded successfully');
    } catch (error) {
      console.warn('⚠️ WebGLRenderer: Failed to load external shaders, using inline shaders:', error);
      // Fallback to inline shaders
      this.useInlineShaders();
    }
  }

  /**
   * Fallback to inline shaders if external loading fails
   */
  private useInlineShaders(): void {
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform sampler2D u_texture;
      uniform float u_readingVision;
      uniform float u_contrastBoost;
      uniform float u_edgeEnhancement;
      uniform vec2 u_resolution;
      
      varying vec2 v_texCoord;
      
      // Gaussian blur kernel for unsharp masking
      vec4 gaussianBlur(sampler2D tex, vec2 texCoord, vec2 texelSize, float radius) {
          vec4 result = vec4(0.0);
          float totalWeight = 0.0;
          
          for (int i = -3; i <= 3; i++) {
              for (int j = -3; j <= 3; j++) {
                  vec2 offset = vec2(float(i), float(j)) * texelSize;
                  float distance = float(i*i + j*j);
                  float weight = exp(-distance / (2.0 * radius * radius));
                  result += texture2D(tex, texCoord + offset) * weight;
                  totalWeight += weight;
              }
          }
          
          return result / totalWeight;
      }

      // Unsharp mask algorithm specifically for presbyopia text sharpening
      vec4 unsharpMask(vec2 texCoord) {
          vec2 texelSize = 1.0 / u_resolution;
          vec4 center = texture2D(u_texture, texCoord);
          
          // Calculate blur based on reading vision strength
          float blurRadius = 1.0 + (u_readingVision / 3.5) * 2.0; // Adaptive blur radius
          vec4 blurred = gaussianBlur(u_texture, texCoord, texelSize, blurRadius);
          
          // Apply unsharp mask with adaptive strength
          float strength = u_readingVision / 3.5; // Normalize to 0-1 range
          strength = clamp(strength, 0.0, 1.0);
          
          // Enhanced unsharp mask for presbyopia
          vec4 difference = center - blurred;
          vec4 sharpened = center + difference * strength * 1.5; // Boosted strength for presbyopia
          
          return clamp(sharpened, 0.0, 1.0);
      }

      // Sobel edge detection for enhanced text edges
      vec4 sobelEdgeDetection(vec2 texCoord) {
          vec2 texelSize = 1.0 / u_resolution;
          vec4 center = texture2D(u_texture, texCoord);
          
          // Sobel X kernel
          vec4 gx = vec4(0.0);
          gx += texture2D(u_texture, texCoord + vec2(-1.0, -1.0) * texelSize) * -1.0;
          gx += texture2D(u_texture, texCoord + vec2( 0.0, -1.0) * texelSize) * -2.0;
          gx += texture2D(u_texture, texCoord + vec2( 1.0, -1.0) * texelSize) * -1.0;
          gx += texture2D(u_texture, texCoord + vec2(-1.0,  1.0) * texelSize) *  1.0;
          gx += texture2D(u_texture, texCoord + vec2( 0.0,  1.0) * texelSize) *  2.0;
          gx += texture2D(u_texture, texCoord + vec2( 1.0,  1.0) * texelSize) *  1.0;
          
          // Sobel Y kernel
          vec4 gy = vec4(0.0);
          gy += texture2D(u_texture, texCoord + vec2(-1.0, -1.0) * texelSize) * -1.0;
          gy += texture2D(u_texture, texCoord + vec2(-1.0,  0.0) * texelSize) * -2.0;
          gy += texture2D(u_texture, texCoord + vec2(-1.0,  1.0) * texelSize) * -1.0;
          gy += texture2D(u_texture, texCoord + vec2( 1.0, -1.0) * texelSize) *  1.0;
          gy += texture2D(u_texture, texCoord + vec2( 1.0,  0.0) * texelSize) *  2.0;
          gy += texture2D(u_texture, texCoord + vec2( 1.0,  1.0) * texelSize) *  1.0;
          
          // Calculate edge magnitude
          vec4 edgeMagnitude = sqrt(gx * gx + gy * gy);
          
          return edgeMagnitude;
      }

      // Edge enhancement specifically for presbyopia text
      vec4 edgeEnhancement(vec2 texCoord) {
          vec4 center = texture2D(u_texture, texCoord);
          vec4 edges = sobelEdgeDetection(texCoord);
          
          // Adaptive edge enhancement based on reading vision
          float edgeStrength = u_edgeEnhancement / 100.0;
          edgeStrength = clamp(edgeStrength, 0.0, 1.0);
          
          // Enhanced edge detection for text
          float edgeThreshold = 0.1;
          vec4 enhancedEdges = step(edgeThreshold, edges) * edges * edgeStrength;
          
          // Combine with original image
          vec4 result = center + enhancedEdges;
          
          return clamp(result, 0.0, 1.0);
      }

      // Contrast adjustment optimized for presbyopia
      vec4 adjustContrast(vec4 color) {
          float contrast = 1.0 + u_contrastBoost / 100.0;
          contrast = clamp(contrast, 0.5, 2.0); // Reasonable bounds
          
          // Enhanced contrast for presbyopia
          vec4 adjusted = (color - 0.5) * contrast + 0.5;
          
          // Additional brightness boost for low contrast text
          float brightness = 1.0 + (u_contrastBoost / 200.0);
          adjusted *= brightness;
          
          return clamp(adjusted, 0.0, 1.0);
      }

      // Local contrast enhancement for text readability
      vec4 enhanceLocalContrast(vec2 texCoord) {
          vec2 texelSize = 1.0 / u_resolution;
          vec4 center = texture2D(u_texture, texCoord);
          
          // Sample local neighborhood
          vec4 localMin = vec4(1.0);
          vec4 localMax = vec4(0.0);
          
          for (int i = -2; i <= 2; i++) {
              for (int j = -2; j <= 2; j++) {
                  vec2 offset = vec2(float(i), float(j)) * texelSize;
                  vec4 sample = texture2D(u_texture, texCoord + offset);
                  localMin = min(localMin, sample);
                  localMax = max(localMax, sample);
              }
          }
          
          // Enhance local contrast
          vec4 localContrast = localMax - localMin;
          float enhancement = u_contrastBoost / 100.0;
          
          vec4 enhanced = center + localContrast * enhancement * 0.5;
          return clamp(enhanced, 0.0, 1.0);
      }

      // Presbyopia-specific text sharpening
      vec4 presbyopiaSharpening(vec2 texCoord) {
          vec4 color = texture2D(u_texture, texCoord);
          
          // Apply unsharp mask for general sharpening
          color = unsharpMask(texCoord);
          
          // Apply edge enhancement for text edges
          color = edgeEnhancement(texCoord);
          
          // Apply local contrast enhancement
          color = enhanceLocalContrast(texCoord);
          
          // Apply contrast and brightness adjustment
          color = adjustContrast(color);
          
          return color;
      }

      // Main fragment shader function
      void main() {
          vec4 color = texture2D(u_texture, v_texCoord);
          
          // Apply presbyopia correction pipeline
          color = presbyopiaSharpening(v_texCoord);
          
          // Final output
          gl_FragColor = color;
      }
    `;

    this.shaderCache.set('vertex', vertexShaderSource);
    this.shaderCache.set('fragment', fragmentShaderSource);
  }

  /**
   * Process image with WebGL GPU acceleration
   */
  public processImage(
    source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): WebGLProcessingResult {
    const startTime = performance.now();

    try {
      console.log('🎯 WebGLRenderer: Processing image with WebGL...', {
        isInitialized: this.isInitialized,
        useWebGL: this.settings.useWebGL,
        fallbackToCSS: this.fallbackToCSS
      });

      // Check if WebGL is available and enabled
      if (!this.isInitialized || !this.settings.useWebGL || this.fallbackToCSS) {
        console.log('🎯 WebGLRenderer: Using CSS fallback');
        return this.processWithCSSFallback(source);
      }

      // Set canvas size to match source
      let width = 100;
      let height = 100;
      
      if (source instanceof HTMLCanvasElement) {
        width = source.width;
        height = source.height;
      } else if (source instanceof HTMLVideoElement) {
        width = source.videoWidth || 100;
        height = source.videoHeight || 100;
      } else if (source instanceof HTMLImageElement) {
        width = source.naturalWidth || source.width || 100;
        height = source.naturalHeight || source.height || 100;
      }

      this.canvas.width = width;
      this.canvas.height = height;

      console.log('🎯 WebGLRenderer: Canvas size set to', { width, height });

      // Create texture from source
      const texture = this.createTexture(source);
      if (!texture) {
        throw new Error('Failed to create texture from source');
      }

      // Apply WebGL processing
      this.renderWithWebGL(texture, width, height);

      // Update performance metrics
      const processingTime = performance.now() - startTime;
      this.updatePerformanceMetrics(processingTime);

      console.log('✅ WebGLRenderer: Processing completed successfully', {
        processingTime: processingTime.toFixed(2) + 'ms',
        performanceMetrics: this.performanceMetrics
      });

      return {
        success: true,
        processedCanvas: this.canvas,
        fallbackUsed: false,
        performanceMetrics: this.performanceMetrics,
      };

    } catch (error) {
      console.error('❌ WebGL processing failed:', error);
      return this.processWithCSSFallback(source);
    }
  }

  /**
   * Update vision correction settings
   */
  public updateSettings(newSettings: Partial<WebGLSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.isInitialized && this.gl) {
      this.updateUniforms();
      console.log('🎯 WebGLRenderer: Settings updated', this.settings);
    }
  }

  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics(): WebGLPerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Check if using CSS fallback
   */
  public isUsingFallback(): boolean {
    return this.fallbackToCSS;
  }

  /**
   * Get WebGL context information
   */
  public getContextInfo(): WebGLContextInfo {
    if (!this.gl) {
      return {
        vendor: 'Unknown',
        renderer: 'Unknown',
        version: 'Unknown',
        extensions: [],
      };
    }

    try {
      const debugInfo = this.gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
        renderer: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        version: this.gl.getParameter(this.gl.VERSION),
        extensions: this.gl.getSupportedExtensions() || [],
      };
    } catch (error) {
      console.warn('WebGL context info not available:', error);
      return {
        vendor: 'Unknown',
        renderer: 'Unknown',
        version: 'Unknown',
        extensions: [],
      };
    }
  }

  /**
   * Clean up WebGL resources
   */
  public dispose(): void {
    if (this.gl) {
      try {
        if (this.program) {
          this.gl.deleteProgram(this.program);
        }
        if (this.positionBuffer) {
          this.gl.deleteBuffer(this.positionBuffer);
        }
        if (this.textureCoordBuffer) {
          this.gl.deleteBuffer(this.textureCoordBuffer);
        }
        const loseContext = this.gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      } catch (error) {
        console.warn('Error during WebGL disposal:', error);
      }
    }
    this.isInitialized = false;
    console.log('🎯 WebGLRenderer: Resources disposed');
  }

  /**
   * Check WebGL support
   */
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (error) {
      console.warn('WebGL support check failed:', error);
      return false;
    }
  }

  /**
   * Create and compile WebGL shaders
   */
  private async createShaders(): Promise<void> {
    if (!this.gl) throw new Error('WebGL context not available');

    const vertexShaderSource = this.shaderCache.get('vertex');
    const fragmentShaderSource = this.shaderCache.get('fragment');

    if (!vertexShaderSource || !fragmentShaderSource) {
      throw new Error('Shader sources not available');
    }

    console.log('🎯 WebGLRenderer: Creating shaders...');

    // Create and compile shaders
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create program and link shaders
    this.program = this.gl.createProgram();
    if (!this.program) throw new Error('Failed to create WebGL program');

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(this.program);
      throw new Error(`Failed to link WebGL program: ${error}`);
    }

    // Get uniform locations
    this.uniformLocations = {
      uReadingVision: this.gl.getUniformLocation(this.program, 'u_readingVision'),
      uContrastBoost: this.gl.getUniformLocation(this.program, 'u_contrastBoost'),
      uEdgeEnhancement: this.gl.getUniformLocation(this.program, 'u_edgeEnhancement'),
      uTexture: this.gl.getUniformLocation(this.program, 'u_texture'),
      uResolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
    };

    // Clean up shaders
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    console.log('✅ WebGLRenderer: Shaders created successfully');
  }

  /**
   * Create and compile a WebGL shader
   */
  private createShader(type: number, source: string): WebGLShader {
    if (!this.gl) throw new Error('WebGL context not available');

    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Shader compilation failed: ${error}`);
    }

    return shader;
  }

  /**
   * Initialize WebGL buffers
   */
  private initializeBuffers(): void {
    if (!this.gl) throw new Error('WebGL context not available');

    // Position buffer (full-screen quad)
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  // bottom left
       1, -1,  // bottom right
      -1,  1,  // top left
       1,  1   // top right
    ]), this.gl.STATIC_DRAW);

    // Texture coordinate buffer
    this.textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0, 0,  // bottom left
      1, 0,  // bottom right
      0, 1,  // top left
      1, 1   // top right
    ]), this.gl.STATIC_DRAW);

    console.log('✅ WebGLRenderer: Buffers initialized');
  }

  /**
   * Update WebGL uniforms with current settings
   */
  private updateUniforms(): void {
    if (!this.gl || !this.program) return;

    this.gl.useProgram(this.program);

    if (this.uniformLocations.uReadingVision) {
      this.gl.uniform1f(this.uniformLocations.uReadingVision, this.settings.readingVision);
    }
    if (this.uniformLocations.uContrastBoost) {
      this.gl.uniform1f(this.uniformLocations.uContrastBoost, this.settings.contrastBoost);
    }
    if (this.uniformLocations.uEdgeEnhancement) {
      this.gl.uniform1f(this.uniformLocations.uEdgeEnhancement, this.settings.edgeEnhancement);
    }
    if (this.uniformLocations.uResolution) {
      this.gl.uniform2f(this.uniformLocations.uResolution, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Create texture from source element
   */
  private createTexture(source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): WebGLTexture | null {
    if (!this.gl) return null;

    const texture = this.gl.createTexture();
    if (!texture) return null;

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  /**
   * Render with WebGL processing
   */
  private renderWithWebGL(texture: WebGLTexture, width: number, height: number): void {
    if (!this.gl || !this.program) return;

    // Set viewport
    this.gl.viewport(0, 0, width, height);

    // Use program
    this.gl.useProgram(this.program);

    // Bind texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    if (this.uniformLocations.uTexture) {
      this.gl.uniform1i(this.uniformLocations.uTexture, 0);
    }

    // Bind position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Bind texture coordinate buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Process with CSS fallback
   */
  private processWithCSSFallback(
    source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): WebGLProcessingResult {
    console.log('🎯 WebGLRenderer: Using CSS fallback processing');
    
    const startTime = performance.now();
    
    // Create canvas for CSS processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context for CSS fallback');
    }

    // Set canvas size
    let width = 100;
    let height = 100;
    
    if (source instanceof HTMLCanvasElement) {
      width = source.width;
      height = source.height;
    } else if (source instanceof HTMLVideoElement) {
      width = source.videoWidth || 100;
      height = source.videoHeight || 100;
    } else if (source instanceof HTMLImageElement) {
      width = source.naturalWidth || source.width || 100;
      height = source.naturalHeight || source.height || 100;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw source to canvas
    ctx.drawImage(source, 0, 0, width, height);

    // Apply CSS-style filters (simulated)
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Simple contrast and brightness adjustment
    const contrast = 1.0 + this.settings.contrastBoost / 100.0;
    const brightness = 1.0 + this.settings.contrastBoost / 200.0;

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast and brightness
      data[i] = ((data[i] / 255 - 0.5) * contrast + 0.5) * 255 * brightness; // R
      data[i + 1] = ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255 * brightness; // G
      data[i + 2] = ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255 * brightness; // B
      // Alpha channel unchanged
    }

    ctx.putImageData(imageData, 0, 0);

    const processingTime = performance.now() - startTime;
    this.updatePerformanceMetrics(processingTime);
    this.performanceMetrics.fallbackTriggered = true;

    return {
      success: true,
      processedCanvas: canvas,
      fallbackUsed: true,
      performanceMetrics: this.performanceMetrics,
    };
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(processingTime: number): void {
    this.performanceMetrics.processingTime = processingTime;
    this.performanceMetrics.fps = 1000 / processingTime;
    this.performanceMetrics.memoryUsage = this.estimateMemoryUsage();
    this.performanceMetrics.batteryImpact = this.estimateBatteryImpact();
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    if (!this.canvas) return 0;
    const bytesPerPixel = 4; // RGBA
    return (this.canvas.width * this.canvas.height * bytesPerPixel) / (1024 * 1024); // MB
  }

  /**
   * Estimate battery impact
   */
  private estimateBatteryImpact(): number {
    // Simple estimation based on processing time and complexity
    const baseImpact = this.performanceMetrics.processingTime / 100; // 1% per 100ms
    return Math.min(baseImpact, 5.0); // Cap at 5%
  }
} 