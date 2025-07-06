// src/components/SampleImage.tsx
import React, { useState } from "react";

export const SampleImage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const sampleImages = [
    {
      name: "Reading Material",
      description: "Small text and fine details",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    },
    {
      name: "Natural Scene",
      description: "Landscape with varying focus depths",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    },
    {
      name: "Architecture",
      description: "Sharp lines and geometric patterns",
      url: "https://images.unsplash.com/photo-1486718448742-163d73305c99?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Image Processing Demo
        </h3>
        <p className="text-gray-600 mb-4">
          Select different images to see how the VisionCorrectionEngine enhances
          visual clarity through adaptive sharpening and contrast optimization.
        </p>
      </div>

      {/* Image Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sampleImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedImage === index
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {image.name}
          </button>
        ))}
      </div>

      {/* Image Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Original</h4>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={sampleImages[selectedImage].url}
              alt={`Original ${sampleImages[selectedImage].name}`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              No Correction
            </div>
          </div>
        </div>

        {/* Vision Corrected */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Vision Corrected</h4>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden vision-processed">
            <img
              src={sampleImages[selectedImage].url}
              alt={`Corrected ${sampleImages[selectedImage].name}`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
              MaxVue Enhanced
            </div>
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">🖼️</div>
          <div>
            <h4 className="font-medium text-blue-900">
              {sampleImages[selectedImage].name}
            </h4>
            <p className="text-blue-700 text-sm">
              {sampleImages[selectedImage].description}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Processing applied: Unsharp masking, edge enhancement, contrast
              optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
