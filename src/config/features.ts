// src/config/features.ts

/**
 * MaxVue Feature Flags
 * 
 * Controls optional features throughout the application.
 */

// WebGL Vision Processing Feature
export const WEBGL_ENABLED = false;

/**
 * TO REACTIVATE WEBGL IN THE FUTURE:
 * 
 * 1. Change line above to: export const WEBGL_ENABLED = true;
 * 2. Restart the development server: npm run dev
 * 3. WebGL toggle and processing will be restored
 * 
 * Files containing dormant WebGL code:
 * - src/hooks/useVisionCorrection.tsx
 * - src/components/ContentDemo.tsx  
 * - src/components/VisionProcessor.tsx
 * - src/utils/WebGLRenderer.ts (preserved unchanged)
 */ 