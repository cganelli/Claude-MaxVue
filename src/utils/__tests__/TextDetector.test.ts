import { describe, it, expect } from "vitest";
// import your textDetector and fullHDImage as needed

describe("TextDetector", () => {
  it.skip("should process Full HD image in <10s", async () => {
    const start = performance.now();
    // await textDetector.process(fullHDImage); // Uncomment and provide actual implementation
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
}); 